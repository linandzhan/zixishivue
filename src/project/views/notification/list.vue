<template>
  <div>
    <el-row>
      <el-col style="margin: 10px 1%; width: 98%">
        <el-tabs type="border-card" @tab-click="handleTabClick">
          <el-tab-pane label="我的预约">
            <el-row class="page">
              <!--    搜索-->
              <el-col :span="24">
                <!-- <search
                style="width: 95%; margin: 10px auto"
                :search-items="searchItems"
                @on-search="searchBySearchItem1"
              ></search> -->
              </el-col>
              <!--    按钮和分页-->
              <el-col :span="24">
                <div style="width: 95%; margin: 10px auto">
                  <div class="pager-group">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange1"
                      :current-page="page"
                      :page-sizes="[10, 20, 30, 40]"
                      :page-size="pageSize"
                      layout="total, sizes, jumper, prev, next"
                      :total="allTotal"
                    >
                    </el-pagination>
                  </div>
                </div>
              </el-col>
              <!--    表格-->
              <el-col :span="24">
                <el-table
                  :data="allData"
                  style="width: 95%; margin: 0 auto"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="handleRowClick"
                  @sort-change="handleSortChange"
                >
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="seat.seatName" label="预约座位">
                  </el-table-column>
                  <el-table-column
                    prop="seat.description"
                    label="座位描述"
                    sortable
                  >
                  </el-table-column>
                  <el-table-column prop="bookDate" label="预约日期" sortable>
                  </el-table-column>
                  <el-table-column prop="startTime" label="开始时间" sortable>
                  </el-table-column>
                  <el-table-column prop="endTime" label="结束时间" sortable>
                  </el-table-column>
                  <el-table-column prop="status" label="状态" sortable>
                  </el-table-column>
                  <el-table-column prop="haveClock" label="是否打卡" sortable>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    align="center"
                    label="操作"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-button
                        @click.stop="handleStatusChange(scope.row)"
                        type="text"
                        size="small"
                        v-if="scope.row.status == '待开始'"
                        >{{
                          scope.row.status == "取消预约" ? "已取消" : "取消预约"
                        }}</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <!--    新建-->
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="已取消预约">
            <el-row class="page">
              <!--    搜索-->
              <el-col :span="24">
                <search
                  style="width: 95%; margin: 10px auto"
                  :search-items="searchItems"
                  @on-search="searchBySearchItem2"
                ></search>
              </el-col>
              <!--    按钮和分页-->
              <el-col :span="24">
                <div style="width: 95%; margin: 10px auto">
                  <div class="pager-group">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange2"
                      :current-page="page"
                      :page-sizes="[10, 20, 30, 40]"
                      :page-size="pageSize"
                      layout="total, sizes, jumper, prev, next"
                      :total="cancelTotal"
                    >
                    </el-pagination>
                  </div>
                </div>
              </el-col>
              <!--    表格-->
              <el-col :span="24">
                <el-table
                  :data="cancelData"
                  style="width: 95%; margin: 0 auto"
                  @selection-change="handleSelectionChange"
                  @row-dblclick="handleRowClick"
                  @sort-change="handleSortChange"
                >
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="seat.seatName" label="预约座位">
                  </el-table-column>
                  <el-table-column
                    prop="seat.description"
                    label="座位描述"
                    sortable
                  >
                  </el-table-column>
                  <el-table-column prop="bookDate" label="预约日期" sortable>
                  </el-table-column>
                  <el-table-column prop="startTime" label="开始时间" sortable>
                  </el-table-column>
                  <el-table-column prop="endTime" label="结束时间" sortable>
                  </el-table-column>
                  <el-table-column
                    prop="cancelReason"
                    label="取消原因"
                    sortable
                  >
                  </el-table-column>
                </el-table>
              </el-col>
              <!--    新建-->
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog
      title="取消预约"
      :visible.sync="cancelVisible"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        label-width="150px"
      >
        <el-form-item label="取消原因" prop="cancelReason">
          <el-input
            v-model="formValidate.cancelReason"
            placeholder="原因"
          ></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="open()">确 定</el-button>
        <el-button type="info" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Search from "@/framework/components/search";
import ICreate from "./create";
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
import {
  search,
  count,
  del,
  enable,
  disable,
} from "@/project/service/notificationPacket";

export default {
  mixins: [Emitter],
  data() {
    return {
      formValidate: {},
      cancelId: 0,
      model: "notificationPacket",
      createProps: {
        visible: false,
      },
      editProps: {
        visible: false,
      },
      menu: {
        visible: false,
      },
      cancelVisible: false,
      editId: 0, //编辑id
      data: [],
      cancelData: [],
      allData: [],
      successData: [],
      selectList: [],
      sort: { asc: [], desc: ["id"] },
      pageSize: 10,
      page: 1,
      allTotal: 0,
      cancelTotal: 0,
      successTotal: 0,
      extraParam: {},
      messageType: "sms",
      searchItems: [
        {
          name: "预约日期",
          key: "bookDate",
          type: "date",
        },
      ],
      ruleValidate: {
        cancelReason: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
      },
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
  },
  methods: {
    open() {
      this.$confirm(
        "距离开始学习时间已不到5小时,需扣除您百分之50的费用，您确定取消预约？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.putReason("formValidate");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消该操作",
          });
        });
    },
    putReason(name) {
      this.$nextTick(() => {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let param = {
              id: this.cancelId,
              reason: this.formValidate.cancelReason,
            };

            let _t = this;
            post("/reservation/cancel", param, (res) => {
              _t.$message.success("已取消预约");
              _t.cancelVisible = false;
              _t.search1(1);
              _t.search2(1);
              _t.search3(1);
              //  this.cancelVisible = false;
              //  this.$refs.formValidate.resetFields()
            });
          }
        });
      });
    },
    toCancel(row) {
      this.cancelVisible = true;
      this.cancelId = row.id;
    },
    // handleEdit() {
    //   this.editId = this.selectList[0].id;
    //   this.editProps.visible = true;
    // },
    handleStatusChange(row) {
      let status = "取消预约";
      let _t = this;
      // if (row.status.indexOf("启用") >= 0) {
      //   status = "禁用";
      // } else {
      //   status = "启用";
      // }
      this.toCancel(row);
      // .then(()=> {
      //         this.$confirm(`确定${status}？`, "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      //   .then(() => {
      //     if (status === "取消预约") {
      //       // console.log('-----------------')
      //       // console.log(row.id)
      //       post('/reservation/cancel',{ id: row.id }, (res) => {
      //         _t.$message({
      //           type: "success",
      //           message: "已禁用!",
      //         });
      //         _t.search(_t.page);
      //       });
      //     }
      //     // else {
      //     //   enable({ id: row.id }, (res) => {
      //     //     _t.$message({
      //     //       type: "success",
      //     //       message: "已启用!",
      //     //     });
      //     //     _t.search(_t.page);
      //     //   });
      //     // }
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: "info",
      //       message: "取消该操作",
      //     });
      //   });
      // })
    },
    search() {},
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
    searchBySearchItem1(searchItems) {
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
      this.search1(1);
    },

    search1(page) {
      let _t = this;
      _t.page = page;

      let param = {
        pageable: {
          page: page,
          size: _t.pageSize,
          sort: _t.sort,
        },
        bookDate: this.extraParam.bookDate,
      };
      console.log(param);
      post("reservation/findAllByUser", param, (res) => {
        let data = res.items;
        _t.allData = data;
        _t.allTotal = res.total;

        _t.allData.forEach((element) => {
          if (element.haveClock == true) {
            element.haveClock = "已打卡";
          } else {
            element.haveClock = "尚未打卡";
          }
        });
      });
    },

    searchBySearchItem2(searchItems) {
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
      this.search2(1);
    },

    search2(page) {
      let _t = this;
      _t.page = page;

      let param = {
        pageable: {
          page: page,
          size: _t.pageSize,
          sort: _t.sort,
        },
        bookDate: this.extraParam.bookDate,
      };
      console.log(param);
      post("reservation/findCancelByUser", param, (res) => {
        let data = res.items;
        _t.cancelData = data;
        _t.cancelTotal = res.total;
      });
    },

    searchBySearchItem3(searchItems) {
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
      this.search3(1);
    },

    search3(page) {
      let _t = this;
      _t.page = page;

      let param = {
        pageable: {
          page: page,
          size: _t.pageSize,
          sort: _t.sort,
        },
        bookDate: this.extraParam.bookDate,
      };
      console.log(param);
      post("reservation/findFinishByUser", param, (res) => {
        let data = res.items;
        _t.successData = data;
        _t.successData.forEach((element) => {
          if (element.haveClock == true) {
            element.haveClock = "已打卡";
          } else {
            element.haveClock = "未打卡";
          }
        });
        _t.successTotal = res.total;
      });
    },

    getTotal() {
      let _t = this;
      let param = { [this.model]: _t.extraParam };
      count(param, (res) => {
        _t.total = parseInt(res);
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
            del({ ids: ids }, (res) => {
              _t.search(_t.page);
              this.$message({
                type: "success",
                message: "删除成功!",
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
      this.$confirm("确定启用所选的记录吗?", "启用提示", {
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
      this.cancelVisible = false;
      this.$refs.formValidate.resetFields();
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    handleRowClick(row) {
      // this.editId = row.id;
      // this.createProps.visible = true;
    },
    toDetail(row) {
      this.$router.push({ path: "/notification/show/" + row.id });
    },
    handleCurrentChange3(val) {
      this.page = val;
      this.search3(this.page);
    },
    handleCurrentChange1(val) {
      this.page = val;
      this.search1(this.page);
    },
    handleCurrentChange2(val) {
      this.page = val;
      this.search2(this.page);
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
          this.editProps.visible = true;
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
    handleTabClick(val) {
      this.messageType = val.label;
      if (val.label === "短信推送") {
        this.messageType = "sms";
      } else if (val.label === "APP内消息中心推送") {
        this.messageType = "inside";
      } else if (val.label === "通知栏推送") {
        this.messageType = "push";
      }
      this.search(this.page);
    },
    handleSaveSuccess() {
      this.createProps.visible = false;
      this.search(this.page);
    },
  },
  mounted() {
    this.search1(1);
    this.search2(1);
    this.search3(1);
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
