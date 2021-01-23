<template>
  <el-row class="page">
    <!--    搜索-->
    <el-col :span="24">
      <search
        style="width: 95%;margin: 10px auto"
        :search-items="searchItems"
        @on-search="searchBySearchItem"
      ></search>
    </el-col>
    <!--    按钮和分页-->
    <el-col :span="24">
      <div style="width: 95%;margin: 10px auto;">
        <div class="pager-group">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, jumper, prev, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-col>
    <!--    表格-->
    <el-col :span="24">
      <el-table
        :data="data"
        style="width: 95%;margin:0 auto;"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowClick"
      >
        <el-table-column
          prop="id"
          label="序号"
        >
        </el-table-column>
        <el-table-column
          prop="user.id"
          label="User ID"
        >
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          prop="amount"
          label="提现金额"
        >
        </el-table-column>
        <el-table-column
          prop="realname"
          label="账户姓名"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="提现途径"
        >
        </el-table-column>
        <el-table-column
          prop="bank"
          label="开户行"
        >
        </el-table-column>
        <el-table-column
          prop="account"
          label="银行卡号/账户"
        >
        </el-table-column>
        <el-table-column
          prop="createAt"
          label="申请时间"
        >
        </el-table-column>
        <el-table-column
          prop="comment"
          label="备注"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button @click.stop="handleComment(scope.row.id)" type="text" size="small">备注</el-button>
            <el-button @click.stop="isPass(scope.row.id)" type="text" size="small" v-show="scope.row.status ==='待审核'">标记已处理</el-button>
            <el-button @click.stop="isRefuse(scope.row.id)" style="color: red;" type="text" size="small" v-show="scope.row.status ==='待审核'">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
<!--    备注弹窗-->
    <el-dialog
      :title="title"
      :visible.sync="rejectVisible"
      :modal-append-to-body='false'
      :append-to-body="true"
      width="30%"
      :before-close="handleClose">
      <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" v-model="rejectReason" placeholder="请输入内容"></el-input>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="rejectConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import {findById} from '@/project/service/user'
  import {post} from "@/framework/http/request";
  import Emitter from '@/framework/mixins/emitter'
  import {search, count,passedWithDrawRecord,rejectWithDrawRecord,commentWithDrawRecord} from '@/project/service/WithdrawRecord'
  import {
    commentWithDrawRecordWithAccountId,
    passedWithDrawRecordWithAccountId,
    rejectWithDrawRecordWithAccountId
  } from "../../service/OperationRecord";

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "takeManage",
        menu: {
          visible: false
        },
        data: [],
        rejectVisible: false,
        rejectReason: '',
        rejectId: 0,
        selectList: [],
        comment: '',
        sort: {asc: [], desc: []},
        pageSize: 10,
        page: 1,
        total: 0,
        title: '',
        extraParam: {},
        searchItems: [
          {
            name: "User ID",
            key: "ID",
            type: "string"
          },
          {
            name: "用户手机号",
            key: "phone",
            type: "string"
          },
          {
            name: "申请时间",
            key: "applyTime",
            type: "datetimerange",
          },
          {
            name: "账户姓名",
            key: "name",
            type: "string",
          }
        ],
      };
    },
    computed: {
      route() {
        return this.$route;
      }
    },
    components: {
      Search
    },
    methods: {
      toDetail(id) {
        this.$router.push({path: `/${this.model}/show/` + id})
      },
      // 通过
      isPass(id) {
        this.$confirm('确定通过该提现申请吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          passedWithDrawRecord({id: id}, res => {
            this.$message({
              type: 'success',
              message: '已通过审核!'
            });
            passedWithDrawRecordWithAccountId()
            this.search(1)
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作！'
          });
        });
      },
      // 拒绝
      isRefuse(id) {
        this.rejectVisible = true
        this.rejectId = id
        this.title = '拒绝'
      },
      handleComment(id) {
        this.rejectVisible = true
        this.rejectId = id
        this.title = '备注'
      },
      handlePageSizeChange(pageSize) {
        this.pageSize = pageSize;
        this.search(1);
      },
      handlePageChange(page) {
        this.search(page);
      },
      handleSortChange(sort) {
        let key = sort.key;
        let order = sort.order;
        let asc = this.sort.asc;
        let desc = this.sort.desc;
        if (asc.indexOf(key) > -1) {
          let idx = asc.indexOf(key);
          asc.splice(idx, 1);
        }
        if (desc.indexOf(key) > -1) {
          let idx = desc.indexOf(key);
          desc.splice(idx, 1);
        }
        if (order !== "normal") {
          this.sort[order].push(key);
        }
        this.search(1);
      },
      // searchItems就是搜索框的内容对象  keywords
      searchBySearchItem(searchItems) {
        this.extraParam = searchItems
        this.search(1);
      },
      search(page) {
        let _t = this;
        _t.page = page;
        let param = {
          pageable: {
            page: page,
            size: _t.pageSize,
            sort: _t.sort
          },
          userId: _t.extraParam.ID,
          phone: _t.extraParam.phone,
          realName: _t.extraParam.name,
          startDate: _t.extraParam.starttime,
          endDate: _t.extraParam.endtime,
        };
        if (
          param.pageable.sort.asc.length === 0 &&
          param.pageable.sort.desc.length === 0
        ) {
          delete param.pageable.sort;
        }
        search(param, res => {
          res.map((r,i)=>{
            // 加载用户手机号
            findById({id: r.user.id},res2=>{
              r.phone = res2.phone
            })
          })
          console.log(res)
          _t.data = res;
          _t.getTotal();
        });
      },
      getTotal() {
        let _t = this;
        let param = {};
        count(param, res => {
          _t.total = parseInt(res);
        });
      },
      handleTransportSelectList(list) {
        this.selectList = list;
      },

      delete(id) {
        let _t = this;
        del({id: id}, res => {
          _t.search(_t.page);
        });
      },
      enable(id, url) {
        let _t = this;
        post(url, {id: id}, res => {
          _t.search(_t.page);
        });
      },
      handleClose() {
        this.rejectVisible = false;
      },
      rejectConfirm() {
        if (this.title === '备注') {
          commentWithDrawRecord({id: this.rejectId, comment: this.rejectReason}, res => {
            this.$message({
              type: 'success',
              message: '已备注!'
            });
            this.search(this.page)
            commentWithDrawRecordWithAccountId()
          });
        } else {
          rejectWithDrawRecord({id: this.rejectId, rejectReason: this.rejectReason}, res => {
            this.$message({
              type: 'success',
              message: '已拒绝!'
            });
            rejectWithDrawRecordWithAccountId()
            this.search(this.page)
          });
        }
        this.rejectVisible = false;
        this.rejectReason = '';
        this.rejectId = 0;
      },
      handleSelectionChange(val) {
        this.selectList = val;
      },
      handleRowClick(row) {
        // this.$router.push({path: `/${this.model}/show/` + row.id})
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;

        this.search(this.page);
      }
    },
    mounted() {
      this.search(1);
      // this.findAllRoles();
    }
  };
</script>
<style lang="less" scoped>
  .page {
    overflow-y: auto;
    overflow-x: hidden;
  }
  .dialog-footer {
    text-align: center;
  }
  .message-comment {
    width: 150px;
    height: 150px;
  }
  .el-button+.el-button{
    margin-left: 2px;
  }
  .el-button--default:hover{
    color: #00a16c;
    border: 1px solid#00a16c;
    background: white;
  }
  .footor{
    margin:10px 30px;
    width: 90%;
    text-align: right;
  }
</style>
