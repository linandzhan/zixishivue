<template>
  <el-row class="page">
    <el-col class="welcome" :span="10" :offset="8">{{$t('message.projectName')}}</el-col>
  </el-row>
</template>

<script>
    export default {
        name: "Welcome"
    }
</script>

<style lang="less" scoped>
.page {
  position: relative;
  width: 80%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
  background-repeat: no-repeat;
  .welcome {
    margin-top: 100px;
    font-size: 50px;
    color: #333333;
  }
}
</style>
