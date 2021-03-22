<template>
  <div>
        <el-col :span="24">
      <el-card class="box-card-large">
        <el-tabs v-model="activeName">
          <el-tab-pane label="已评价" name="first">
            账户信息
          </el-tab-pane>
          <el-tab-pane label="未评价" name="second">
            设备信息
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
export default {
  mixins: [Emitter],
  data() {
    return {};
  },
  computed: {
    route() {
      return this.$route;
    },
  },
  methods: {},
  mounted() {},
  created() {},
};
</script>

<style scoped>
  .box-card-large{
    width: 92%;
    display: inline-block;
    margin: 20px;
  }
</style>