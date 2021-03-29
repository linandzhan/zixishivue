<template>
  <div>
    <el-col :span="24">
      <el-card class="box-card-large">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="待评价" name="first">
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
                      :total="clockTotal"
                    >
                    </el-pagination>
                  </div>
                </div>
              </el-col>

              <el-col :span="24">
                <el-table
                  :data="clockData"
                  style="width: 95%; margin: 0 auto"
                  @row-dblclick="handleRowClick"
                >
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="signinTime" label="签到时间">
                  </el-table-column>
                  <el-table-column
                    prop="endTime"
                    label="签退时间"
                  ></el-table-column>
                  <el-table-column prop="length" label="学习时长">
                  </el-table-column>
                  <el-table-column prop="seatName" label="座位">
                  </el-table-column>
                  <el-table-column label="评价操作">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="openComment(scope.row)"
                        type="text"
                        size="small"
                      >
                        评价
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="已评价" name="second">
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
                      :total="clockHaveCommentTotal"
                    >
                    </el-pagination>
                  </div>
                </div>
              </el-col>

              <el-col :span="24">
                <el-table
                  :data="clockDataHaveComment"
                  style="width: 95%; margin: 0 auto"
                  @row-dblclick="handleRowClick"
                >
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="signinTime" label="签到时间">
                  </el-table-column>
                  <el-table-column
                    prop="endTime"
                    label="签退时间"
                  ></el-table-column>
                  <el-table-column prop="length" label="学习时长">
                  </el-table-column>
                  <el-table-column prop="seatName" label="座位">
                  </el-table-column>
                  <el-table-column label="评价">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="showComment(scope.row)"
                        type="text"
                        size="small"
                      >
                        查看评价
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <div style="text-align: center">
        <el-button type="primary" @click="getErWeiMa">打卡</el-button>
      </div>
    </el-col>

    <el-dialog
      title="评价操作"
      :visible.sync="commentVisible"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="40%"
      :before-close="handleClose"
    >
      <!-- :rules="ruleValidate" -->
      <el-form ref="formValidate" :model="formValidate" label-width="150px">
        <el-form-item label="评价内容" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 7 }"
            placeholder="请输入内容"
            v-model="formValidate.content"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="content">
          <el-rate v-model="formValidate.stars"></el-rate>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save()">保 存</el-button>
        <el-button type="info" @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="查看评价"
      :visible.sync="showCommentVisible"
      :modal-append-to-body="false"
      :append-to-body="true"
      width="40%"
      :before-close="handleClose"
    >
      <!-- :rules="ruleValidate" -->
      <el-form :model="commentData" label-width="150px">
        <el-form-item label="评价内容" prop="content">
          <el-input
            :disabled="true"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 7 }"
            placeholder="请输入内容"
            v-model="commentData.content"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="content">
          <el-rate v-model="commentData.stars" :disabled="true"></el-rate>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
export default {
  mixins: [Emitter],
  data() {
    return {
      activeName: "first",
      clockData: [],
      uncommentData: [],
      clockTotal: 0,
      page: 0,
      pageSize: 10,
      imgUrl: "",
      imgShow: false,
      commentVisible: false,
      formValidate: {},
      clockId: 0,
      clock: {},
      isComment: false,
      clockDataHaveComment: [],
      clockHaveCommentTotal: 0,
      showCommentVisible: false,
      commentData:{}
    };
  },
  computed: {
    route() {
      return this.$route;
    },
  },
  methods: {
    showComment(row) {
      this.showCommentVisible = true;
      let param = {
        id:row.id
      }
      post('/evaluate/searchByClock',param,(res)=>{
              this.commentData.content = res.content,
              this.commentData.stars = res.stars
      })

    },
    handleClick(tab, event) {
      this.search(1);
    },
    save() {
      // console.log(this.formValidate)
      this.clock.id = this.clockId;

      let param = {
        content: this.formValidate.content,
        stars: this.formValidate.stars,
        clock: this.clock,
      };
      let _t = this;

      post("/evaluate/save", param, (res) => {
        _t.$message.success("已取消预约");
        _t.commentVisible = false;
        this.search();
      });
    },
    openComment(row) {
      this.clockId = row.id;
      this.commentVisible = true;
      // this.$refs.formValidate.resetFields();
    },
    handleClose() {
      this.commentVisible = false;
      this.showCommentVisible = false;
      this.formValidate.stars = 0;
      this.$refs.formValidate.resetFields();
    },
    getErWeiMa() {
      post("/clock/getErWeiMa", {}, (res) => {
        this.imgUrl = res;
        window.location.href = this.imgUrl;
      });
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
      if (this.activeName == "first") {
        this.isComment = false;
      } else {
        this.isComment = true;
      }
      let _t = this;
      _t.page = page;
      let param = {
        pageable: {
          page: page,
          size: _t.pageSize,
        },
        isComment: this.isComment,
      };

      post("/clock/searchClcok", param, (res) => {
        if (this.isComment) {
          this.clockDataHaveComment = res.items;
          this.clockHaveCommentTotal = res.total;
        } else {
          this.clockData = res.items;
          this.clockTotal = res.total;
        }
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