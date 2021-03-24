<template>
  <div>
    <div class="page">
      <div id="register">
        <p class="title">用户注册</p>
      </div>

      <el-col
        style="margin-top: 50px;"
        :xs="{ span: 12, offset: 8 }"
        :lg="{ span: 6, offset: 9 }"
      >
        <div style="margin-top: 50px; text-align: center;">
        <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="margin-top: 50px;">
        
          <el-form-item prop="username">
            <span style="margin-right:8px">用户名</span>
            <el-input
              class="has-prefix"
              :maxlength="80"
              v-model="formValidate.username"
              placeholder="请输入用户名"
            >
              <i class="el-icon-user-solid" slot="prefix" />
            </el-input>
          </el-form-item>
        </el-form>
        </div>
      </el-col>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
      return {
          formValidate:{},
          ruleValidate:{}
      }
  }
};
</script>

<style lang="less" scoped>
.title {
  font-size: 26px;
  line-height: 50px;
  font-weight: bold;
  margin: 10px;
  text-align: center;
}
.page {
  background-color: #ffffff;
  img.logo {
    width: 100px;
    height: 100px;
  }
  .logo-text {
    font-size: 30px;
    color: #333333;
  }
}
</style>
