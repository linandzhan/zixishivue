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
    <el-row>
      <div style="width: 95%; margin: 60px auto">
        <el-col :span="7">
          <div class="yudingBox">
            <el-button
              type="success"
              plain
              style="
                width: 100%;
                height: 100%;
                margin-bottom: 15px;
                border-radius: 30px;
              "
              icon="el-icon-plus"
              @click="toCreate"
              >预定座位</el-button
            >
          </div>
        </el-col>

        <el-col :span="6">
          <div class="tuiding">
            <el-button
              style="
                width: 100%;
                height: 100%;
                margin-bottom: 15px;
                border-radius: 30px;
              "
              icon="el-icon-minus"
              type="primary"
              plain
              @click="toCreate"
              >预定座位</el-button
            >
          </div>
        </el-col>
      </div>
    </el-row>

    <!--    表格-->
    <el-col :span="24">
      <div class="checkBox" v-for="(item, index) in areas" :key="index">
        <!-- v-for="(item,index) in areas" -->
        <el-row>
          <el-col class="header" style="border-radius: 4px">
            {{ item.areaName }}
          </el-col>
        </el-row>
        <el-row class="mybox">
          <el-col
            :span="6"
            v-for="(seat, index) in item.seatDTO"
            :key="index"
            class="myseat"
          >
            <div :class="{ red: seat.status == true }">
              <span
                v-if="seat.status == true"
                style="display: block; text-align: left"
                class="el-icon-message-solid"
              ></span>
              <span
                v-if="seat.status == null"
                style="display: block; text-align: left"
                class="el-icon-bell"
              ></span>
              <span
                v-if="seat.seatName == '2'"
                style="display: block; text-align: left"
                class="el-icon-bell"
              ></span>
              <span style="font-size: 15px; display: block; text-align: center"
                >{{ seat.seatName }} &nbsp&nbsp&nbsp&nbsp {{ seat.username }}
              </span>

              <span style="display: block; height: 54px"></span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
      :id="editId"
    />
    <!--    &lt;!&ndash;    编辑&ndash;&gt;-->
    <!--    <i-edit-->
    <!--      :dialog-visible="editProps.visible"-->
    <!--      :edit-id="editId"-->
    <!--      @on-dialog-close="handleClose"-->
    <!--    />-->
  </el-row>
</template>
<script>
import Search from "@/framework/components/search";
import ICreate from "./edit";
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
import { search, count, del } from "@/project/service/page"; //接口

export default {
  name: "commodityAudit",
  mixins: [Emitter],

  data() {
    return {
      categoryListName: [],
      categoryListId: [],
      // storeName: JSON.parse(decodeURIComponent(this.$route.params.storeName)),
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
        {
          name: "查询时间",
          key: "updateAt",
          type: "daterange",
        },
      ],
      seats: [1, 2, 3, 4, 56, 7],
      areas: [],
    };
  },
  created() {
    this.search(1);
  },
  computed: {
    route() {
      return this.$route;
    },
  },
  components: {
    Search,
    ICreate,
  },
  methods: {
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
      // let _t = this;
      // _t.page = page;
      // _t.extraParam.label = "seat";
      // let param = {
      //   pageable: {
      //     page: page,
      //     size: _t.pageSize,
      //     sort: _t.sort,
      //   },
      //   [this.model]: _t.extraParam,
      // };

      // search(param, (res) => {
      //   let data = res;
      //   _t.data = data;
      //   _t.getTotal();
      // });

      post("/seat/search", {}, (res) => {
        this.areas = res;
      });
    },
    getTotal() {
      let _t = this;
      let param = {
        page: {},
      };
      for (let key in _t.extraParam) {
        param.page[key] = _t.extraParam[key];
      }
      count(param, (res) => {
        _t.total = parseInt(res);
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
              // this.$message({
              //   type: 'success',
              //   message: '删除成功!'
              // });
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
              // this.$message({
              //   type: 'success',
              //   message: '删除成功!'
              // });
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
      this.search(this.page);
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    handleRowClick(row) {
      // print(this.id);
      this.editId = row.id;
      this.createProps.visible = true;
    },
    toDetail(id) {
      console.log(id);
      this.$router.push({ path: `show/` + id });
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
  border: 1px solid#00a16c;
  background: white;
}
.footor {
  margin: 10px 30px;
  width: 90%;
  text-align: right;
}
.checkBox {
  margin: 50px 0px 0px 35px;
}
.header {
  width: 60%;
  border: 1px solid #9fa7b9;
  text-align: center;
  line-height: 200%;
  height: 50px;
  font-size: 25px;
}
.mybox {
  width: 60%;
  display: flex;
  flex-wrap: wrap;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.myseat {
  line-height: 150%;
  border: 1px solid #9fa7b9;
  height: 97px;
}
.el-dropdown-menu {
  background: rgb(62, 82, 101);
  width: 114px;
  padding: 0;
  font-size: 10px;
  margin: 0;
  border-radius: 0;
  .el-dropdown-menu__item {
    color: white;
    &:hover {
      background: rgb(43, 57, 71);
      color: #fff;
    }
  }
  .popper__arrow {
    opacity: 0;
  }
}
.frontSize {
  font-size: 25px;
}
.red {
  background-color: rgba(28, 118, 236, 0.12);
}

.yudingBox {
  height: 60px;
  margin-right: 140px;
  text-align: center;
  border-radius: 30px;
}

.tuiding {
  height: 60px;
  margin-left: 90px;
  text-align: center;
  border-radius: 30px;
}
</style>
