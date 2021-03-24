<template>
  <div>
    <el-row class="page">
      <!--    搜索-->
      <el-col :span="24"> </el-col>
      <!--    按钮和分页-->
      <el-col :span="24"> </el-col>
      <!--    表格-->
      <el-col :span="24">
        <el-table
          :data="data"
          style="width: 95%; margin: 40px auto"
          @selection-change="handleSelectionChange"
          @row-dblclick="handleRowClick"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="seatName" label="座位名称"> </el-table-column>
          <el-table-column prop="description" label="座位描述">
          </el-table-column>
          <!-- <el-table-column prop="status" label="座位状态"></el-table-column> -->
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button @click="openbook(scope.row)" type="text" size="small"
                >查看预约详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog
      title="预定座位"
      :visible.sync="bookVisible"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="50%"
      :before-close="handleClose"
    >
      <search
        style="width: 95%; margin: 10px auto"
        :search-items="searchItems"
        @on-search="searchBySearchItem"
      ></search>
      <div class="pager-group">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes,jumper,prev,next"
          :total="total"
        >
        </el-pagination>
      </div>
      <el-table
        :data="bookInfo"
        ref="table"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column prop="username" label="预定人"> </el-table-column>
        <el-table-column prop="startTime" label="开始时间"> </el-table-column>
        <el-table-column prop="endTime" label="结束时间"> </el-table-column>
        <el-table-column prop="haveUsing" label="状态">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toReason(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.haveUsing == '已取消'"
            >
              {{ scope.row.haveUsing }}(查看原因)
            </el-button>
            <span v-else>{{ scope.row.haveUsing }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Search from "@/framework/components/search";
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
import {
  searchSeat,
  count,
  del,
  batchDelete,
  enable,
  close,
  batchClose,
} from "@/project/service/page";

export default {
  mixins: [Emitter],
  data() {
    return {
      reason:"",
      model: "advice",
      menu: {
        visible: false,
      },
      selectId: 0,
      editId: 0, //编辑id
      data: [],
      selectList: [],
      sort: { asc: [], desc: [] },
      pageSize: 10,
      page: 1,
      total: 0,
      id: this.$route.params.id,
      extraParam: {},
      searchItems: [
        {
          name: "查询时间",
          key: "searchTime",
          type: "date",
        },
      ],
      bookInfo: [],
      bookVisible: false,
    };
  },
  computed: {
    route() {
      return this.$route;
    },
  },
  components: {
    Search,
  },
  methods: {
    toReason(row) { 
       this.reason = row.cancelReason;      
       let r = this.reason; 
      this.$alert(r, {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ ss }`
            });
          }
        });
    
     

    },
    handleClose() {
      this.bookVisible = false;
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.search(1);
    },
    handlePageChange(page) {
      this.search(page);
    },
    handleSortChange(sort) {
      let key = sort.key;
      let order = sort.order;
      let asc = this.sort.asc;
      let desc = this.sort.desc;
      if (asc.indexOf(key) > -1) {
        let idx = asc.indexOf(key);
        asc.splice(idx, 1);
      }
      if (desc.indexOf(key) > -1) {
        let idx = desc.indexOf(key);
        desc.splice(idx, 1);
      }
      if (order !== "normal") {
        this.sort[order].push(key);
      }
      this.search(1);
    },
    searchBySearchItem(searchItems) {
      let keys = [];
      for (
        let i = 0,
          searchItemList = this.searchItems,
          len = searchItemList.length;
        i < len;
        i++
      ) {
        keys.push(searchItemList[i].key);
      }

      for (let i in keys) {
        if (searchItems[keys[i]]) {
          this.extraParam[keys[i]] = searchItems[keys[i]];
        } else {
          delete this.extraParam[keys[i]];
        }
      }
      //有时间段搜索进行转化字段
      if (this.extraParam.createAt) {
        this.extraParam.startCreateAt = this.extraParam.createAt[0];
        this.extraParam.endCreateAt = this.extraParam.createAt[1];
        delete this.extraParam.createAt;
      } else {
        delete this.extraParam.startCreateAt;
        delete this.extraParam.endCreateAt;
      }
      this.searchBook(1);
    },
    search(page) {
      let param = {
        id: this.id,
        searchTime: this.extraParam.searchTime,
      };
      searchSeat(param, (res) => {
        let data = res;
        this.data = data;
        console.log(this.data);
        this.data.forEach((element) => {
          if (element.status == true) {
            element.status = "已预定";
          } else {
            element.status = "空位";
          }
        });
      });
    },
    handleTransportSelectList(list) {
      this.selectList = list;
    },
    //批量删除
    batchDelete() {
      this.broadcast("SiTable", "on-get-selectList");
      this.$nextTick(() => {
        let selectList = this.selectList;
        if (selectList.length === 0) {
          this.$notify.warning({
            title: "至少选择一条数据",
          });
          return;
        }
        this.$confirm("确定删除所选记录吗?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let idList = selectList.map((s) => {
              return s.id;
            });
            batchDelete({ idList: idList }, (res) => {
              this.$message.success("删除成功");
              this.search(this.page);
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      });
    },
    //批量处理
    batchDeal() {
      let _t = this;
      let selectList = this.selectList;
      this.$confirm("确定处理所选的记录吗?", "启用提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let idList = selectList.map((s) => {
            return s.id;
          });
          batchClose({ idList: idList }, (res) => {
            _t.$message.success("已处理");
            _t.search(this.page);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    delete(id) {
      let _t = this;
      del({ id: id }, (res) => {
        _t.search(_t.page);
      });
    },
    enable(id, url) {
      let _t = this;
      post(url, { id: id }, (res) => {
        _t.search(_t.page);
      });
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    handleRowClick(row) {},
    toDetail(row) {
      this.$router.push({ path: "/advice/show/" + row.id });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.search(this.page);
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;

      this.search(this.page);
    },
    openbook(row) {
      this.selectId = row.seatId;
      this.bookVisible = true;

      this.searchBook(1);
    },

    searchBook(page) {
      let _t = this;
      _t.page = page;

      let param = {
        pageable: {
          page: page,
          size: _t.pageSize,
        },
        date: this.extraParam.searchTime,
        id: this.selectId,
      };
      post("/seat/searchReversation", param, (res) => {
        this.bookInfo = res.items;
        this.total = res.total;
        res.items.forEach((element) => {
          if (element.haveUsing == true) {
            element.haveUsing = "正常";
          } else {
            element.haveUsing = "已取消";
          }
        });
      });
    },
  },

  mounted() {
    this.search(1);

    // this.findAllRoles();
  },
};
</script>
<style lang="less" scoped>
.page {
  overflow-y: auto;
  overflow-x: hidden;
}
.el-button + .el-button {
  margin-left: 2px;
}
.el-button--default:hover {
  color: #00a16c;
  border: 1px solid#00a16c;
  background: white;
}
.footor {
  margin: 10px 30px;
  width: 90%;
  text-align: right;
}
</style>
