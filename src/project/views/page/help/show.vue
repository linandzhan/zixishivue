<template>
  <el-row class="page">
    <!--    搜索-->
    <el-col :span="24">
      <search
        style="width: 95%; margin: 10px auto"
        :search-items="searchItems"
        @on-search="searchBySearchItem"
      ></search>
    </el-col>
    <!--    按钮和分页-->
    <el-col :span="24"> </el-col>
    <!--    表格-->
    <el-col :span="24">
      <el-table
        :data="data"
        style="width: 95%; margin: 0 auto"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowClick"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="seatName" label="座位名称">
        </el-table-column>
        <el-table-column prop="description" label="座位描述"> </el-table-column>
        <el-table-column prop="status" label="座位状态"></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click.stop="handleStatusChange(scope.row)"
              type="text"
              size="small"
              v-if="scope.row.status === '可预约'"
              >标记已处理</el-button
            >
            <el-button
              @click.stop="handleStatusChange(scope.row)"
              type="text"
              size="small"
              v-else
              disabled
              >已处理</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
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
      model: "advice",
      menu: {
        visible: false,
      },
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
      this.search(1);
    },
    search(page) {
      // let _t = this;
      // _t.page = page;
      // let param = {
      //   pageable: {
      //     page: page,
      //     size: _t.pageSize,
      //     sort: _t.sort,
      //   },
      //   [this.model]: _t.extraParam,
      // };
      // if (
      //   param.pageable.sort.asc.length === 0 &&
      //   param.pageable.sort.desc.length === 0
      // ) {
      //   delete param.pageable.sort;
      // }
      // console.log(this.extraParam.searchTime)
      let param = {
        id:this.id,
        searchTime:this.extraParam.searchTime
      }
      searchSeat(param, (res) => {
        let data = res;
        this.data = data;
        console.log(this.data)
        this.data.forEach(element => {
          if(element.status == true) {
            element.status = '已预定'
          }else {
            element.status = '空位'
          }
        });
        // _t.getTotal();
      });
    },
    // getTotal() {
    //   let _t = this;
    //   let param = { [this.model]: _t.extraParam };
    //   count(param, (res) => {
    //     _t.total = parseInt(res);
    //   });
    // },
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
    handleStatusChange(row) {
      close({ id: row.id }, (res) => {
        this.$message.success("已处理");
        this.search(this.page);
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
