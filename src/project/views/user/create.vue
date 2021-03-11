<template>
  <el-dialog
    title="用户信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="50%"
    :before-close="handleClose"
  >
    <el-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      label-width="150px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="formValidate.username"
          placeholder="输入用户名"
        ></el-input>
      </el-form-item>

      <el-form-item label="电话" prop="phone">
        <el-input
          v-model="formValidate.phone"
          placeholder="输入电话"
        ></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="type">
        <el-select v-model="formValidate.gender" placeholder="请选择">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="首次充值" prop="balance">
        <el-input
          v-model="formValidate.balance"
          placeholder="首次充值"
        ></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm('formValidate')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { post } from "@/framework/http/request";

export default {
  name: "dialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      model: "user",
      formValidate: {
        username: "",
        phone: "",
        gender: "",
      },
      ruleValidate: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
        ],
        phone: [{ required: true, message: "手机号不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit("on-dialog-close");
    },
    handleConfirm() {
      post("/user/save", { [this.model]: this.formValidate }, (res) => {
        this.$message.success("添加成功");
        this.$emit("on-save-success");
      });
    },
  },
};
</script>

<style scoped>
</style>
