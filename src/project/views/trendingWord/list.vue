<template>
<div>
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
    <el-col :span="24">
      <div style="width: 95%; margin: 10px auto">
        <div class="pager-group">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, jumper, prev, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </el-col>
    <!--    表格-->
    <el-col :span="24">
      <el-table
        :data="data"
        style="width: 95%; margin: 0 auto"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowClick"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="username" label="用户"> </el-table-column>

        <el-table-column prop="seatName" label="自习座位"> </el-table-column>
        <el-table-column prop="bookDate" label="预约日期"> </el-table-column>

        <el-table-column prop="startTime" label="预约开始时间">
        </el-table-column>
        <el-table-column prop="endTime" label="预约结束时间"> </el-table-column>
        <el-table-column label="评价">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="showComment(scope.row)"
              type="text"
              size="small"
              v-if=" scope.row.haveComment"
            >
              查看评价
            </el-button>
            <span v-else style="font-size:12px;">暂未评价</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
      :id="createId"
    />
    <!--    &lt;!&ndash;    编辑&ndash;&gt;-->
    <i-edit
      :dialog-visible="editProps.visible"
      :item="item"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
    />
  </el-row>


    <el-dialog
      title="查看评价"
      :visible.sync="showCommentVisible"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="40%"
      :before-close="handleClose"
    >
      <!-- :rules="ruleValidate" -->
      <el-form :model="commentData" label-width="150px">
        <el-form-item label="评价内容" prop="content">
          <el-input
            :disabled="true"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 7 }"
            placeholder="用户还未对此次自习体验进行评论"
            v-model="commentData.content"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="content">
          <el-rate v-model="commentData.stars" :disabled="true"></el-rate>
        </el-form-item>
      </el-form>
    </el-dialog>
</div>
  
</template>
<script>
import Search from "@/framework/components/search";
import ICreate from "./create";
import IEdit from "./edit";
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
import {
  search,
  count,
  del,
  enable,
  disable,
} from "@/project/service/trendingWord"; //接口
import trendingWordService from "@/project/model/trendingWord";

export default {
  mixins: [Emitter],
  data() {
    return {
      commentData:{},
       showCommentVisible: false,
      model: "user",
      createProps: {
        visible: false,
      },
      editProps: {
        visible: false,
      },
      menu: {
        visible: false,
      },
      createId: 0,
      editId: 0, //编辑id
      data: [],
      selectList: [],
      sort: { asc: [], desc: [] },
      pageSize: 10,
      page: 1,
      total: 0,
      extraParam: {},
      searchItems: [
        {
          name: "用户名",
          key: "username",
          type: "string",
        },
        {
          name: "自习座位",
          key: "phone",
          type: "string",
        },
      ],
      item: {},
    };
  },
  computed: {
    route() {
      return this.$route;
    },
  },
  components: {
    Search,
    ICreate,
    IEdit,
  },
  methods: {

        showComment(row) {
      this.showCommentVisible = true;
      if(row.clockId != null) {
      let param = {
        id:row.clockId
      }
      post('/evaluate/searchByClock',param,(res)=>{
              this.commentData.content = res.content,
              this.commentData.stars = res.stars
      })
      }


    },
    handleEdit() {
      this.editId = this.selectList[0].id;
      this.editProps.visible = true;
    },
    handleStatusChange(row) {
      let status;
      let _t = this;
      if (row.status.indexOf("启用") >= 0) {
        status = "禁用";
      } else {
        status = "启用";
      }
      this.$confirm(`确定${status}选中内容？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (status === "禁用") {
            disable({ id: row.id }, (res) => {
              _t.$message({
                type: "success",
                message: "已禁用!",
              });
              _t.search(_t.page);
            });
          } else {
            enable({ id: row.id }, (res) => {
              _t.$message({
                type: "success",
                message: "已启用!",
              });
              _t.search(_t.page);
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
      this.extraParam = searchItems;
      this.search(1);
    },
    toCreate() {
      this.createProps.visible = true;
    },
    search(page) {
      let _t = this;
      _t.page = page;
      // this.extraParam.position = 0;
      let param = {
        pageable: {
          page: page,
          size: _t.pageSize,
          sort: _t.sort,
        },
        [this.model]: this.extraParam,
      };

      post("/reservation/search", param, (res) => {
        this.data = res.items;
        this.total = res.total
      });
    },

    handleTransportSelectList(list) {
      this.selectList = list;
    },
    //批量删除
    batchDelete() {
      let _t = this;
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
            selectList.forEach((item, index) => {
              del({ id: item.id }, (res) => {
                if (selectList.length === index + 1) {
                  this.$message.success("删除成功");
                  this.search(this.page);
                }
              });
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

    handleClose() {
      this.createProps.visible = false;
      this.editProps.visible = false;
            this.showCommentVisible = false;
    },
    handleSave() {
      this.createProps.visible = false;
      this.editProps.visible = false;
      this.search(this.page);
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    handleRowClick(row) {
      this.item = row;
      this.editProps.visible = true;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.search(this.page);
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.search(this.page);
    },
    onMenuChange(val) {
      console.log(val);
    },
    handleClick(command) {
      switch (command) {
        case "编辑":
          this.createId = this.selectList[0].id;
          // this.editProps.visible = true;
          this.createProps.visible = true;
          break;
        case "启用":
          console.log("启用");
          this.batchEnable();
          break;
        case "禁用":
          console.log("禁用");
          this.batchDisable();
          break;
      }
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
