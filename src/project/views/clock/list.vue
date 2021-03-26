<template>
  <div>
    <el-col :span="24">
      <el-card class="box-card-large">
        <el-tabs v-model="activeName">
          <el-tab-pane label="已评价" name="first">
            <el-row class="page">
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
                      :total="uncomentTotal"
                    >
                    </el-pagination>
                  </div>
                </div>
              </el-col>

              <el-col :span="24">
                <el-table
                  :data="uncommentData"
                  style="width: 95%; margin: 0 auto"
                  @row-dblclick="handleRowClick"
                >
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="phone" label="签到时间">
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="签退时间"
                  ></el-table-column>
                  <el-table-column prop="enabled" label="学习时长">
                  </el-table-column>
                  <el-table-column prop="enabled" label="座位">
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="待评价" name="second"> 设备信息 </el-tab-pane>
        </el-tabs>
      </el-card>
      <div style="text-align: center">
        <el-button type="primary" @click="getErWeiMa">打卡</el-button>
      </div>
    </el-col>
  </div>
</template>

<script>
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
export default {
  mixins: [Emitter],
  data() {
    return {
      uncommentData: [],
      uncomentTotal: 0,
      page: 0,
      pageSize: 10,
      imgUrl: "",
      imgShow:false,
    };
  },
  computed: {
    route() {
      return this.$route;
    },
  },
  methods: {
    getErWeiMa() {
      post('/clock/getErWeiMa',{},(res)=>{
        this.imgUrl = res;
          window.location.href = this.imgUrl;
      })
     
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    handleRowClick(row) {
      // this.editId = row.id;
      // this.createProps.visible = true;
    },
    handleCurrentChange1(val) {
      this.page = val;
      this.search3(this.page);
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;

      this.search(this.page);
    },
    search(page) {
      let _t = this;
      _t.page = page;
      let param = {
        page: page,
        size: _t.pageSize,
      };
      post("/clock/searchUncoment", param, (res) => {
        console.log(res);
      });
    },
  },
  mounted() {
    this.search(1);
  },
  created() {},
};
</script>

<style scoped>
.box-card-large {
  width: 92%;
  display: inline-block;
  margin: 20px;
}
.page {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>