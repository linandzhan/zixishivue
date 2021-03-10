<template>
  <div>
    <el-col :span="24">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
          <el-dropdown
            style="position: absolute; right: -9px; top: -6px"
            @command="handleClick"
          >
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="10" height="8" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="编辑">编辑</el-dropdown-item>
              <el-dropdown-item command="状态">{{
                manager.status === "启用" ? "禁用" : "启用"
              }}</el-dropdown-item>
              <el-dropdown-item command="修改密码">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="text item" style="display: flex; align-items: center">
          <span class="text_label">头像：</span>
          <img
            style="width: 50px; height: 50px; border-radius: 40px"
            :src="$store.state.prefix + manager.avator"
            @click="imgVisible = true"
          />
        </div>
        <div class="text item">
          <span class="text_label">账号：</span>
          {{ manager.username }}
        </div>
        <div class="text item">
          <span class="text_label">手机号：</span>
          {{ manager.phone }}
        </div>
        <div class="text item">
          <span class="text_label">姓名：</span>
          {{ manager.username }}
        </div>
        <div class="text item">
          <span class="text_label">状态：</span>
          <span v-if="manager.enabled == false"> 禁用 </span>
          <span v-if="manager.enabled == true"> 启用 </span>
        </div>
        <div class="text item">
          <span class="text_label">备注：</span>
          <span v-if="manager.description == null"> 无 </span>
          <span v-if="manager.description != null">
            {{ manager.description }}
          </span>
        </div>
      </el-card>
    </el-col>
    <el-col :span="18">
      <el-card class="box-card-large">
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色设置" name="first">
            <el-col :span="24">
              <div class="table-button">
                <div>
                  <el-button type="primary" @click="openDialog"
                    >添加角色</el-button
                  >
                  <!-- <el-button @click="removeRole">删除角色</el-button> -->
                </div>
              </div>

              <el-table
                :data="myRoleList"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column prop="rolename" label="角色名称">
                </el-table-column>
                <el-table-column prop="description" label="角色备注">
                </el-table-column>
              </el-table>
            </el-col>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>

    <i-edit
      :dialog-visible="editProps.visible"
      :edit-id="editId"
      @on-dialog-close="handleClose"
    ></i-edit>

    <preview-img
      :img-visible="imgVisible"
      :img-url="manager.avator"
      @on-preview-cancal="handleClose"
    >
    </preview-img>



    <el-dialog
      title="修改密码"
      :visible.sync="sercetVisible"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm('ruleForm')"
          >确 定</el-button
        >
        <el-button type="info" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="添加角色"
      :visible.sync="roleVisible"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="50%"
      :before-close="handleClose"
    >
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
        :data="roleList"
        ref="table"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="rolename" label="角色名称"> </el-table-column>
        <el-table-column prop="description" label="角色备注"> </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRole">确 定</el-button>
        <el-button type="info" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  get,
  enable,
  disable,
  addRole,
  removeRole,
  updatePassword,
} from "@/project/service/manager";
import { search, count, findByAccountId } from "@/project/service/role";
import { post } from "@/framework/http/request";
import previewImg from "@/framework/components/previewImg/previewImg.vue";
import IEdit from "./edit";

export default {
  name: "show",
  components: {
    IEdit,
    previewImg,
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      manager: {},
      editProps: {
        visible: false,
      },
      imgVisible: false,
      sercetVisible: false,
      roleVisible: false,
      id: this.$route.params.id,
      editId: "",
      activeName: "first",
      page: 1,
      pageSize: 10,
      sort: { desc: ["id"] },
      roleList: [],
      checkedRoleList: [],
      total: 0,
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
      ruleForm: {
        pass: "",
        checkPass: "",
      },
      selection: [],
      myRoleList: [],
    };
  },
  created() {
    this.get();
    this.findByAccountId();
    this.roleSearch();
  },
  methods: {
    get() {
      let param = { id: this.id };
      post("/manager/get", param, (res) => {
        this.manager = res;
      });
    },
    openDialog() {
      // console.log("********");
      // console.log(this.checkedRoleList);
      let check1 = this.unique(this.checkedRoleList);
    //  this.checkedRoleList.splice(0,4);
      // console.log(check1)
      // console.log(this.myRoleList)
      this.roleVisible = true;
      this.$nextTick(() => {
        //为什么一定要checkedRoleList才可以让它选中！！！！
        this.toggleSelection(this.checkedRoleList, true);
      });
    },
    unique(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1));
    },
    toggleSelection(rows, selected) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs["table"].toggleRowSelection(row, selected);
        });
      }
    },
    roleSearch() {
      let param = {
        pageable: {
          page: this.page,
          size: this.pageSize,
          sort: this.sort,
        },
        role: {},
      };

      search(param, (res) => {
        // // this.roleList = res;
        // let arr = res.filter((item) => {
        //   return this.myRoleList.indexOf(item) === -1;
        // });
        let _t = this;
        this.roleList = res.items;
        this.total = res.total;
        this.checkedRoleList = [];
        // console.log("++++++++");
        for (let i = 0; i < this.roleList.length; i++) {
          for (let j = 0; j < this.myRoleList.length; j++) {
            if (this.roleList[i].id == this.myRoleList[j].id) {
              this.checkedRoleList.push(this.roleList[i]);
            }
          }
        }

        console.log(this.checkedRoleList);
        console.log("^^^^^^^^^^^^^^^^^^^");
      });
    },
    // roleCount() {
    //   count({ role: {} }, (res) => {
    //     this.total = res;
    //   });
    // },

    //选中就会返回给你当前选中的role给你
    handleSelectionChange(val) {
      this.selection = val;
    },
    handleRowClick() {
      // this.$refs.table.toggleRowSelection(row,true);//点击选中
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.roleSearch();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.roleSearch();
    },
    handleClose() {
      this.editProps.visible = false;
      this.imgVisible = false;
      this.sercetVisible = false;
      this.roleVisible = false;
      this.toggleSelection(this.roleList, false);
      this.selection = [];
    },
    handleClick(command) {
      switch (command) {
        case "编辑":
          this.editId = this.id;
          this.editProps.visible = true;
          break;
        case "修改密码":
          this.sercetVisible = true;
          break;
        case "状态":
          let status = this.manager.status;
          if (status === "禁用") {
            enable({ id: this.id }, (res) => {
              this.$message({
                type: "success",
                message: "已启用!",
              });
              this.get();
            });
          } else {
            disable({ id: this.id }, (res) => {
              this.$message({
                type: "success",
                message: "已禁用!",
              });
              this.get();
            });
          }
          break;
      }
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updatePassword(
            { id: this.id, password: this.ruleForm.pass },
            (res) => {
              this.$message.success("修改成功");
              this.sercetVisible = false;
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    reload() {
      this.roleSearch();
    },

    addRole(id) {
      // for(let i = 0 ; i<(this.myRoleList.length);i++) {
      //   this.selection.splice(0,1);
      // }
      console.log("++++++");
      console.log(this.selection);
      //       var params = new URLSearchParams();
      // params.append("username", _t.formValidate.username);
      // params.append("password", _t.formValidate.password);
      let roleIds = [];
      this.selection.forEach((item, index) => {
        console.log(item);
        roleIds.push(item.id);
      });
      addRole({ id: parseInt(this.id), roleIds: roleIds }, (res) => {
        this.$message.success("添加成功");
        this.findByAccountId();
        this.handleClose();
      });
    },

    removeRole(id) {
      this.selection.forEach((item, index) => {
        removeRole({ id: this.id, roleId: item.id }, (res) => {
          if (index === this.selection.length - 1) {
            this.$message.success("删除成功");
            this.findByAccountId();
          }
        });
      });
    },
    //根据当前用户，查当前用户得角色有哪些
    findByAccountId() {
      findByAccountId({ id: this.id }, (res) => {
        this.myRoleList = res;
        this.roleSearch();
      });
    },
    compare(beforeArr, afterArr) {
      let resObj = {
          add: [],
          del: [],
        },
        cenObj = {};
      //把beforeArr数组去重放入cenObj
      for (let i = 0; i < beforeArr.length; i++) {
        cenObj[beforeArr[i]] = beforeArr[i];
      }
      //遍历afterArr，查看其元素是否在cenObj中
      for (let j = 0; j < afterArr.length; j++) {
        if (!cenObj[afterArr[j]]) {
          resObj.add.push(afterArr[j]);
        } else {
          delete cenObj[afterArr[j]];
        }
      }
      for (let k in cenObj) {
        console.log(cenObj);
        resObj.del.push(cenObj[k]);
      }
      return resObj;
    },
  },
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.text_label {
  display: inline-block;
  width: 100px;
  text-align: right;
}

.clearfix {
  position: relative;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.box-card {
  width: 92%;
  margin: 20px;
  display: inline-block;
}

.box-card-large {
  width: 92%;
  display: inline-block;
  margin: 20px;
}

.el-button--text {
  color: #3e5265;
}

.el-button--mini {
  padding: 4px 12px;
}

.table-button {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}
</style>
