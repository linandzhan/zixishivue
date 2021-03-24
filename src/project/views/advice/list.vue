<template>
  <el-row class="page">
    <!--    搜索-->
    <el-col :span="24">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
          <span style="margin-left: 25px">
            <el-button
              style="background: rgb(0, 161, 108); border: none"
              type="primary"
              @click="toCreate"
              >编辑</el-button
            ></span
          >
        </div>
        <div class="text item">
          <span class="text_label">姓名：ssss</span>
        </div>
        <div class="text item">
          <span class="text_label">电话：ssss</span>
        </div>
        <div class="text item">
          <span class="text_label">性别：ssss</span>
        </div>
        <div class="text item">
          <span class="text_label">注册时间：ssss</span>
        </div>
        <div class="text item">
          <span class="text_label">余额：ssss</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import Search from "@/framework/components/search";
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
import {
  search,
  count,
  del,
  batchDelete,
  enable,
  close,
  batchClose,
} from "@/project/service/advice";

export default {
  mixins: [Emitter],
  data() {
    return {
      model: "advice",
      menu: {
        visible: false,
      },
      editId: 0, //编辑id
      data: [],
      selectList: [],
      sort: { asc: [], desc: [] },
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
  components: {},
  methods: {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.box-card {
  width: 92%;
  margin: 20px;
  display: inline-block;
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
.box-card-large {
  width: 92%;
  display: inline-block;
  margin: 20px;
}
.text_label {
  display: inline-block;
  width: 200px;
  text-align: right;
  font-size: 25px;
}
</style>
