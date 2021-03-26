<template>
  <div>
    <el-col :span="20">
      <el-card
        style="margin-top: 70px; margin-left: 20px; height: 500px; width: 350px"
      >
        <div slot="header">
          <span>用户打卡</span>
        </div>
        <el-form ref="formValidate" :model="formValidate" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input placeholder="输入用户名" v-model="formValidate.username">
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              placeholder="输入密码"
              v-model="formValidate.password"
              :type="'password'"
              style="padding-left: 0px !important"
            >
            </el-input>
            <el-button
              type="primary"
              :disabled="formValidate.password == null"
              @click="getOptions"
              >获取预约信息</el-button
            >
          </el-form-item>
          <el-form-item label="预约信息" prop="reservation">
            <el-select
              v-model="formValidate.reservation"
              placeholder="请选择"
              @change="getAction"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <div style="text-align: center; margin-top: 70px">
            <el-button
              type="primary"
              :disabled="
                formValidate.reservation == null ||
                action === '已签退打卡' ||
                action === '该自习已结束' ||
                action === '该自习还未开始'
              "
              @click="sign"
              >{{ action }}</el-button
            >
          </div>
        </el-form>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import Emitter from "@/framework/mixins/emitter";
import { post } from "@/framework/http/request";
export default {
  mixins: [Emitter],
  data() {
    return {
      formValidate: {},
      ruleValidate: {},
      value: "",
      action: "签到打卡",
      option1: [
        {
          value: 1,
          label: "2021-03-25 10:59:00/乐观区1号位",
        },
        {
          value: 2,
          label: "2021-03-25 10:59:00/乐观区2号位",
        },
      ],
      options: [],
    };
  },
  computed: {},
  methods: {
    getAction() {
      console.log(this.formValidate.reservation);
      let param = {
        reservation: this.formValidate.reservation,
      };
      post("/clock/checkSignInOrOut", param, (res) => {
        this.action = res;
      });
    },
    getOptions() {
      let param = {
        username: this.formValidate.username,
        password: this.formValidate.password,
      };
      post("/reservation/getByUserToday", param, (res) => {
        this.options = res;
      });
    },
    sign() {
      let param = {
        status: this.action,
        reservation: this.formValidate.reservation,
      };
      post("/clock/sign", param, (res) => {
        let message = res;
        this.$message({
          message: res,
          type: "success",
        });
        this.getAction();
      });
    },
  },
  mounted() {},
  created() {},
};
</script>

<style>
</style>