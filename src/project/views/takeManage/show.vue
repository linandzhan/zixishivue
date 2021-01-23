<template>
  <div >

<!--    基本信息-->
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
<!--          下来启动禁用-->
          <el-dropdown style="position: absolute;right: -9px;top: -6px"  @command="handleClick">
            <el-button type="text">
              <img src="../../assets/more.png" alt="" width="10" height="8">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="状态">启用</el-dropdown-item>
              <el-dropdown-item command="状态">禁用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
<!--        以下都是基本详情信息-->
<!--        账户信息-->
        <p>账户信息</p>
        <div class="text item">
          <span class="text_label">注册时间</span>
          2018-09-09 19:13
        </div>
        <div class="text item">
          <span class="text_label">最近登录时间</span>
          2018-09-09 19:13
        </div>
        <div class="text item">
          <span class="text_label">用户余额(元)</span>
          200.00
        </div>
        <div class="text item">
          <span class="text_label">积分</span>
          100
        </div>
<!--        基本信息-->
        <p>基本信息</p>
        <div class="text item">
          <span class="text_label">启动状态</span>
          {{user.status}}
        </div>
        <div class="text item">
          <span class="text_label">User ID</span>
          Apache
        </div>
        <div class="text item">
          <span class="text_label">手机号</span>
          {{user.phone}}
        </div>
        <div class="text item">
          <span class="text_label">昵称</span>
          紫小鲸
        </div>
        <div class="text item" style="display: flex">
          <span class="text_label">头像</span>
          <img style="width: 100px; height: 100px;" src="@/project/assets/logo.png" alt="">
        </div>
<!--        认证信息-->
        <p>认证信息</p>
        <div class="text item">
          <span class="text_label">认证身份</span>
          普通用户
        </div>
<!--        <el-button @click="backUp">返回上一页</el-button>-->
      </el-card>
    </el-col>

<!--    钱包管理&积分管理-->
    <el-col :span="18">
      <el-card class="box-card-large">
        <el-tabs v-model="activeName">
<!--          钱包管理-->
          <el-tab-pane label="钱包管理" name="first">
            <div class="wallet">
              <!--            上部分-->
              <div class="manage">
              <span><p>3000.00</p><p>钱包总额</p></span>
              <span><p>300.00</p><p>冻结保证金</p></span>
              <span><p>正常</p><p>钱包状态</p></span>
              <el-button @click="fre_wrallet">{{state ? '冻结钱包' : '解冻钱包'}}</el-button>
              <el-button :disabled="isLose" @click="dialogVisible = true">调整可用余额</el-button>
              <el-button :disabled="isLose" @click="dialogVisible2 = true">扣除保证金</el-button>
            </div>
              <el-button style="margin: 10px 0;" type="primary">钱包流水</el-button>
              <el-button style="margin: 10px 0;">提现记录</el-button>
              <!--分页-->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, jumper, prev, next"
                :total="total">
              </el-pagination>
              <!--表格下部分-->
              <div class="w_table">
                <el-table
                  :data="tableData"
                >
                  <el-table-column
                    prop="number"
                    label="流水号"
                  ></el-table-column>
                  <el-table-column
                    prop="type"
                    label="类型"
                  ></el-table-column>
                  <el-table-column
                    prop="reason"
                    label="事由"
                  ></el-table-column>
                  <el-table-column
                    prop="money"
                    label="流水金额"
                  ></el-table-column>
                  <el-table-column
                    prop="ways"
                    label="支付方式"
                  ></el-table-column>
                  <el-table-column
                    prop="time"
                    label="发生时间"
                  ></el-table-column>
                  <el-table-column
                    prop="msg"
                    label="备注"
                  ></el-table-column>
                  <el-table-column
                    prop="handler"
                    label="操作人"
                  ></el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>

<!--          积分管理-->
          <el-tab-pane label="积分管理" name="second">
            <div class="integration">
<!--              积分管理上部分-->
              <div class="manage">
                <span><p>3000</p><p>积分总额</p></span>
                <span><p>2000</p><p>充值积分</p></span>
                <span><p>1000</p><p>奖励积分</p></span>
                <el-button :disabled="isLose" @click="dialogVisible3 = true">调整积分</el-button>
              </div>
              <!--分页-->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, sizes, jumper, prev, next"
                :total="total">
              </el-pagination>
<!--              积分管理下部分-->
              <div class="w_table">
                <el-table
                  :data="tableData"
                >
                  <el-table-column
                    prop="number"
                    label="流水号"
                  ></el-table-column>
                  <el-table-column
                    prop="type"
                    label="类型"
                  ></el-table-column>
                  <el-table-column
                    prop="reason"
                    label="事由"
                  ></el-table-column>
                  <el-table-column
                    prop="money"
                    label="积分数额"
                  ></el-table-column>
                  <el-table-column
                    prop="time"
                    label="发生时间"
                  ></el-table-column>
                  <el-table-column
                    prop="msg"
                    label="备注"
                  ></el-table-column>
                  <el-table-column
                    prop="handler"
                    label="操作人"
                  ></el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>

<!--          负责项目-->
          <el-tab-pane label="负责项目" name="third">
            <Search
              style="width: 95%;margin: 10px auto"
              :search-items="searchItems"
              @on-search="searchBySearchItem"
            ></Search>
            <!--分页-->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="total, sizes, jumper, prev, next"
              :total="total">
            </el-pagination>
<!--            数据表-->
              <div class="w_table">
                <el-table
                  :data="tableData"
                >
                  <el-table-column
                    prop="id"
                    label="项目ID"
                  ></el-table-column>
                  <el-table-column
                    prop="name"
                    label="项目名称"
                  ></el-table-column>
                  <el-table-column
                    prop="attr"
                    label="项目属性"
                  ></el-table-column>
                  <el-table-column
                    prop="type"
                    label="项目分类"
                  ></el-table-column>
                  <el-table-column
                    prop="intoduce"
                    label="项目简介"
                  ></el-table-column>
                  <el-table-column
                    prop="time"
                    label="创建时间"
                  ></el-table-column>
                  <el-table-column
                    prop="state"
                    label="状态"
                  ></el-table-column>
                </el-table>
              </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>

<!--    弹窗-->
    <el-dialog
      title="调整可用余额"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
    <div class="inner_form">
      <el-form style="margin-left: 120px">
        <el-form-item>
          <span>调整方向</span><el-select placeholder="请选择">
            <el-option>上调</el-option>
            <el-option>下调</el-option>
          </el-select>
        </el-form-item>
        <el-form-item><span>调整金额</span><el-input placeholder="请输入"></el-input>元</el-form-item>
        <el-form-item><span>备注</span><el-input type="textarea" style="width: 200px;" placeholder="请输入"></el-input></el-form-item>
        <el-button style="margin-left: 80px" @click="dialogVisible = false">取消</el-button>
        <el-button style="margin-left: 30px" @click="dialogVisible = false">确定</el-button>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      title="扣除保证金"
      :visible.sync="dialogVisible2"
      width="30%"
      :before-close="handleClose"
    >
    <div class="inner_form">
      <el-form style="margin-left: 120px">
        <el-form-item><span>扣除金额</span><el-input placeholder="请输入"></el-input>元</el-form-item>
        <el-form-item><span>备注</span><el-input type="textarea" style="width: 200px;" placeholder="请输入"></el-input></el-form-item>
        <el-button style="margin-left: 80px" @click="dialogVisible2 = false">取消</el-button>
        <el-button style="margin-left: 30px" @click="dialogVisible2 = false">确定</el-button>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      title="调整可用余额"
      :visible.sync="dialogVisible3"
      width="30%"
      :before-close="handleClose"
    >
      <div class="inner_form">
        <el-form style="margin-left: 120px">
          <el-form-item>
            <span>调整积分</span><el-select placeholder="请选择">
            <el-option>奖励积分</el-option>
            <el-option>充值积分</el-option>
            <el-option>扣除积分</el-option>
          </el-select>
          </el-form-item>
          <el-form-item><span>调整金额</span><el-input placeholder="请输入"></el-input>元</el-form-item>
          <el-form-item><span>备注</span><el-input type="textarea" style="width: 200px;" placeholder="请输入"></el-input></el-form-item>
          <el-button style="margin-left: 80px" @click="dialogVisible3 = false">取消</el-button>
          <el-button style="margin-left: 30px" @click="dialogVisible3 = false">确定</el-button>
        </el-form>
      </div>
    </el-dialog>
    <!--      <el-dialog-->
    <!--        title="查看图片"-->
    <!--        :visible.sync="imgVisible"-->
    <!--        :modal-append-to-body='false'-->
    <!--        width="50%"-->
    <!--        :before-close="handleClose">-->
    <!--        <img :src="'https://www.gunghobox.com/images/'+manager.avatar" alt="" width="100%">-->
    <!--      </el-dialog>-->
  </div>
</template>

<script>
  import {get, enable, disable, findById} from '@/project/service/user'
  import Search from "@/framework/components/search/search";
  export default {
    name: "show",
    components: {
      Search,
    },
    data() {
      return {
        dialogVisible: false,
        dialogVisible2: false,
        dialogVisible3: false,
        state: true,
        isLose: false,
        user: {},
        tableData: [],
        id: this.$route.params.id,
        activeName: 'first',
        searchItems: [
          {
            name: "项目名称",
            key: "name",
            type: "string"
          },
          {
            name: "项目属性",
            key: "attr",
            type: "string",
          },
          {
            name: "项目分类",
            key: "type",
            type: "select",
          },
          {
            name: "创建时间",
            key: "time",
            type: "date",
          },
          {
            name: "项目状态",
            key: "state",
            type: "select",
          },
        ]
      }
    },
    created() {
      this.findById();
    },
    methods: {
      handleSelectionChange(val) {
        this.selectList = val;
      },
      // backUp() {
      //   this.$router.push('/user/list')
      // },
      // 切换按钮禁用状态
      fre_wrallet() {
        this.isLose = !this.isLose
        this.state = !this.state
      },
      findById() {
        findById({id: this.id}, res => {
          this.user = res;
        });
      },
      handleClick(command){
        switch (command) {
          case '状态':
            let status = this.user.status;
            if (status === '禁用') {
              enable({id: this.id}, res => {
                this.$message({
                  type: 'success',
                  message: '已启用!'
                });
                // this.findById();
                this.user.status = '启用'
              })
            } else {
              disable({id: this.id}, res => {
                this.$message({
                  type: 'success',
                  message: '已禁用!'
                });
                // this.findById();
                this.user.status = '禁用'
              })
            }
            break;
        }
      }
    }
  }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin: 18px 0;
  }
  .text_label{
    display: inline-block;
    width: 100px;
    text-align: left;
  }
  .clearfix{
    position: relative;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 92%;
    margin: 20px;
    display: inline-block;
  }
  .box-card p {
    font-weight: bold;
  }
  .box-card-large{
    width: 92%;
    display: inline-block;
    margin: 20px;
  }
  .box-card-large .el-button {
    border-radius: 6px;
  }

  /*分页右倾*/
  .box-card-large .el-pagination {
    text-align: right;
  }

  /*钱包管理*/
  .wallet .manage span{
    display: inline-block;
    width: 93px;
    height: 44px;
    background-color: #D7D7D7;
    border-radius: 8px;
  }

  .wallet .manage span p:first-child {
    text-align: center;
  }

  .wallet .manage span p:nth-child(2) {
    text-align: center;
    font-size: 13px;
  }

  /*积分*/
  .integration .manage {
    margin-bottom: 50px;
  }

  .integration .manage span{
    display: inline-block;
    width: 93px;
    height: 44px;
    background-color: #D7D7D7;
    border-radius: 8px;
  }
  .integration .manage span p:first-child {
    text-align: center;
  }

  .integration .manage span p:nth-child(2) {
    text-align: center;
    font-size: 13px;
  }

  /*弹窗*/
  .inner_form span {
    display: inline-block;
    width: 56px;
    height: 25px;
    text-align: center;
  }
  .el-button--text{
    color: #3e5265;
  }
  .el-button--mini{
    padding: 4px 12px;
  }
  .table-button{
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
  }
</style>
