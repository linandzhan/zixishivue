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
    <el-col :span="24">

    </el-col>
    <!--    表格-->
    <el-col :span="24">
      <el-table
        :data="data"
        style="width: 95%; margin: 0 auto"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowClick"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="区域名称">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small"
            >
              {{ scope.row.areaName }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="totalSeat" label="座位总数"> </el-table-column>
        <el-table-column prop="remainingSeat" label="剩余座位">
        </el-table-column>
        <el-table-column prop="amount" label="价格(元/时)"> </el-table-column>
      </el-table>
    </el-col>
    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
      :id="editId"
    />
    <!--    &lt;!&ndash;    编辑&ndash;&gt;-->
    <i-edit
      :dialog-visible="editProps.visible"
      :id="editId"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
    />
  </el-row>
</template>
<script>
import Search from "@/framework/components/search";
import IEdit from "./edit";
import ICreate from "./create";
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
import { search, count, del } from "@/project/service/page"; //接口
import { findById } from "@/project/service/user";

export default {
  name: "commodityAudit",
  mixins: [Emitter],

  data() {
    return {
      categoryListName: [],
      categoryListId: [],
      model: "page",
      createProps: {
        visible: false,
      },
      editProps: {
        visible: false,
      },
      menu: {
        visible: false,
      },
      editId: 0, //编辑id
      data: [],
      selectList: [],
      sort: { desc: ["id"] },
      pageSize: 10,
      page: 1,
      total: 0,
      extraParam: {},
      searchItems: [
        // {
        //   name: "文章名称",
        //   key: "title",
        //   type: "string",
        // },
        {
          name: "查询日期",
          key: "searchTime",
          type: "date",
        },
        {
          name: "选择时间段",
          key: "timeAfter",
          type: "time",
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
    ICreate,
    IEdit,
  },
  methods: {
    findById() {
      findById({ storeId: this.id }, (res) => {
        this.data = res;
      });
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
      let order = sort.order;
      if (order === "ascending") {
        this.sort = {
          asc: [sort.prop],
        };
      } else {
        this.sort = {
          desc: [sort.prop],
        };
      }
      this.search(1);
    },
    searchBySearchItem(searchItems) {
      console.log(searchItems);
      console.log("+++++");
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
      if (this.extraParam.updateAt) {
        this.extraParam.startUpdateAt = this.extraParam.updateAt[0];
        this.extraParam.endUpdateAt = this.extraParam.updateAt[1];
        delete this.extraParam.updateAt;
      } else {
        delete this.extraParam.startUpdateAt;
        delete this.extraParam.endUpdateAt;
      }
      this.search(1);
    },
    search(page) {
      let _t = this;
    
      let param = {
        searchTime: _t.extraParam.searchTime,
        timeAfter: _t.extraParam.timeAfter,
      };

      search(param, (res) => {
        let data = res;
        _t.data = data;
      });
    },

    handleTransportSelectList(list) {
      this.selectList = list;
    },

    //批量启用
    batchEnable() {
      let _t = this;
      let selectList = this.selectList;
      this.$confirm("确定启用所选的记录吗?", "启用提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          selectList.map((s) => {
            enable({ id: s.id }, (res) => {
              _t.search(_t.page);
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    //批量禁用
    batchDisable() {
      let _t = this;
      let selectList = this.selectList;
      this.$confirm("确定禁用所选的记录吗?", "启用提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          selectList.map((s) => {
            disable({ id: s.id }, (res) => {
              _t.search(_t.page);
            });
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
    handleClose() {
      this.createProps.visible = false;
      this.editProps.visible = false;
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
      // print(this.id);
      this.editId = row.id;
      this.editProps.visible = true;
    },
    toDetail(row) {
      console.log(this.extraParam)
      let _t = this;
      this.$router.push({ path: `show/` + row.areaId});
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
          console.log("编辑");
          this.editId = this.selectList[0].id;
          this.createProps.visible = true;
          break;
      }
    },
    toCreate() {
      this.createProps.visible = true;
    },
  },
  mounted() {
    this.search(1);
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
  border: 1px solid #00a16c;
  background: white;
}

.footor {
  margin: 10px 30px;
  width: 90%;
  text-align: right;
}
</style>
