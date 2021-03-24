<template>
  <div>
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <!-- 用户信息由多个div组成 -->
        <div class="text">
          <span class="text_label">姓名：{{ user.username }}</span>
        </div>
        <div class="text">
          <span class="text_label">电话：{{ user.phone }}</span>
        </div>
        <div class="text">
          <span class="text_label">性别：{{ user.gender }}</span>
        </div>
        <div class="text">
          <span class="text_label">注册时间：{{ user.createTime }}</span>
        </div>
        <div class="text">
          <span class="text_label">余额：{{ user.balance }}元</span>
          &nbsp&nbsp&nbsp&nbsp
          <span>
            <el-button
              style="background: rgb(0, 161, 108); border: none"
              icon="el-icon-plus"
              type="success"
              @click="recharge"
              >充值
            </el-button></span
          >
        </div>
      </el-card>
    </el-col>

    <el-col :span="18">
      <el-card class="box-card-large">
        <div slot="header">
          <span>余额充值扣费记录</span>
        </div>
        <!-- 一个余额充值扣费记录表格 -->
        <div class="pager-group">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, jumper, prev, next"
            :total="total"
          >
          </el-pagination>
        </div>
        <el-table :data="data" style="width: 95%; margin: 0 auto">
          <el-table-column prop="type" label="收支类型"> </el-table-column>
          <el-table-column prop="content" label="用途"> </el-table-column>
          <el-table-column prop="updateBalance" label="金额"> </el-table-column>
          <el-table-column prop="updateTime" label="时间"> </el-table-column>
        </el-table>
      </el-card>
    </el-col>

    <el-dialog
      title="充值窗口"
      :visible.sync="rechargeVisible"
      width="50%"
      :modal-append-to-body="false"
      :before-close="handleClose"
    >
      <el-form ref="formValidate" :model="formValidate" label-width="150px">
        <el-form-item label="充值费用">
          <el-input v-model="formValidate.rechargeMoney" placeholder="输入金额">
          </el-input
          >元
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirm('formValidate')"
          >确 定</el-button
        >
        <el-button type="info" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
import qs from 'qs'

export default {
  mixins: [Emitter],
  data() {
    return {
      user: {},
      formValidate: {},
      rechargeVisible: false,
      page: 1,
      total: 0,
      pageSize:10,
      data:[]
    };
  },
  computed: {
    route() {
      return this.$route;
    },
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.search(this.page);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.search(this.page);
    },
    getUserInfo() {
      post("/user/get", {}, (res) => {
        this.user = res;
      });
    },
    recharge() {
      this.rechargeVisible = true;
    },
    handleClose() {
      this.$refs.formValidate.resetFields();
      this.rechargeVisible = false;
    },
    handleConfirm(form) {
      let param = {
        rechargeMoney: this.formValidate.rechargeMoney,
      };
      post("/user/recharge", param, (res) => {
        this.$message.success("充值成功");
        this.$refs.formValidate.resetFields();
        this.rechargeVisible = false;

        this.getUserInfo();
            this.search(1);
      });
    },

    search(page) {
      let _t = this;
      _t.page = page;
      let param = {
        page: page,
        size: _t.pageSize,
      };

      post("/record/search", param, (res) => {
        console.log(res)
        this.data = res.items;
        this.data.forEach(element => {
          element.updateBalance = element.updateBalance+'元'
        });
        this.total = res.total;
      });
    },
    // test() {
    //   let param  = {
    //     page :1
    //   }
    //   post("/record/param",param,(res)=>{

    //   })

    // }
  },
  mounted() {
    this.getUserInfo();
    this.search(1);
    // this.test();
  },
  created() {},
};
</script>

<style scoped>
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
.text {
  margin-top: 15px;
}
</style>