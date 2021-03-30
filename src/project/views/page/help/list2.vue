<template>
  <el-row class="page">
    <!--    搜索-->
    <el-col :span="24"> </el-col>
    <!--    按钮和分页-->
    <el-col :span="24">
      <div style="width: 95%; margin: 10px auto">
        <el-button
          style="background: rgb(0, 161, 108); border: none"
          icon="el-icon-plus"
          type="primary"
          @click="toCreate"
          >设置套餐</el-button
        >
      </div>
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
        <el-table-column label="套餐名称" prop="name"> </el-table-column>
        <el-table-column prop="price" label="价格(元)"> </el-table-column>
        <el-table-column prop="description" label="使用说明">
        </el-table-column>
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
      searchItems: [],
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
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   // console.log('jsjsjsjsjs')
    //   // console.log(rowIndex) 0
    //   // console.log(columnIndex);  1
    //   if (columnIndex === 1 || columnIndex === 0 || columnIndex === 2) {
    //     let l = 0;
    //     if(rowIndex == 0) {l=3}
    //     if(rowIndex == 1) {l=2}
    //     const _row = l
    //     // console.log(_row)
    //     const _col = _row > 0 ? 1 : 0;
    //     return {
    //       rowspan: _row,
    //       colspan: _col,
    //     };
    //   }

    //   //  else {
    //   //   return {
    //   //     rowspan: 1,
    //   //     colspan: 1,
    //   //   };
    //   // }
    // },
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
      post('/package/search',{},(res)=>{
        this.data = res;
      })
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
      console.log(this.extraParam);
      let _t = this;
      this.$router.push({ path: `show/` + row.areaId });
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
