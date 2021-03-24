<template>
  <el-row class="page">
    <!--    搜索-->
    <el-col :span="24">
      <search
        style="width: 95%;margin: 10px auto"
        :search-items="searchItems"
        @on-search="searchBySearchItem"
      ></search>
<!--      流水统计-->
      <div class="manage">
        <span><p>{{InOut.totalIncome || 0}}</p><p>累积总收入</p></span>
        <span><p>{{InOut.totalExpend || 0}}</p><p>累计总支出</p></span>
        <span><p>{{searchInOut.searchIncome || 0}}</p><p>搜索结果收入合计</p></span>
        <span><p>{{searchInOut.searchExpend || 0}}</p><p>搜索结果支出合计</p></span>
      </div>
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
      >
        <el-table-column
          prop="id"
          label="流水号"
        >
        </el-table-column>
        <el-table-column
          prop="order.id"
          label="关联订单号"
        >
        </el-table-column>
        <el-table-column
          prop="userId"
          label="User ID"
        >
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          prop="userNickname"
          label="昵称"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
        >
        </el-table-column>
        <el-table-column
          prop="cause"
          label="事由"
        >
        </el-table-column>
        <el-table-column
          prop="price"
          label="流水金额"
        >
        </el-table-column>
        <el-table-column
          prop="payMethod"
          label="支付方式"
        >
        </el-table-column>
        <el-table-column
          prop="createAt"
          label="发生时间"
        >
        </el-table-column>
      </el-table>
    </el-col>

  </el-row>
</template>
<script>
  import Search from "@/framework/components/search";
  import {post} from "@/framework/http/request";
  import Emitter from '@/framework/mixins/emitter'
  import {search, count,totalInOut} from '@/project/service/IncomeRecord'

  export default {
    mixins: [Emitter],
    data() {
      return {
        model: "record",
        menu: {
          visible: false
        },
        data: [],
        selectList: [],
        sort: {asc: ['id'], desc: []},
        pageSize: 10,
        page: 1,
        total: 0,
        extraParam: {},
        searchItems: [
          {
            name: "订单号",
            key: "orderNum",
            type: "string"
          },
          {
            name: "流水号",
            key: "recordNum",
            type: "string"
          },
          {
            name: "User ID",
            key: "ID",
            type: "string"
          },
          {
            name: "类型",
            key: "type",
            type: "select",
            displayValue: ["收入", "支出"],
            value: ["收入", "支出"]
          },
          {
            name: "事由",
            key: "reason",
            type: "select",
            displayValue: ["订单收入", "充值积分", "售后退款"],
            value: ["订单收入", "充值积分", "售后退款"]
          },
          {
            name: "用户手机号",
            key: "phone",
            type: "string"
          },
          {
            name: "发生时间",
            key: "startTime",
            type: "datetimerange",
          },
        ],
        InOut: {},
        searchInOut: {},
      };
    },
    computed: {
      route() {
        return this.$route;
      }
    },
    components: {
      Search,
    },
    methods: {
      toDetail(id) {
        this.$router.push({path: `/${this.model}/show/` + id})
      },
      handleEdit() {
        this.editId = this.selectList[0].id
        this.editProps.visible = true;
      },
      handleStatusChange(row) {
        let status;
        let _t = this;
        if (row.status.indexOf('启用') >= 0) {
          status = '禁用'
        } else {
          status = '启用'
        }
        this.$confirm(`确定${status}选中内容？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (status === '禁用') {
            disable({id: row.id}, res => {
              _t.$message({
                type: 'success',
                message: '已禁用!'
              });
              _t.search(_t.page);
            })
          } else {
            enable({id: row.id}, res => {
              _t.$message({
                type: 'success',
                message: '已启用!'
              });
              _t.search(_t.page);
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

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
          orderId: _t.extraParam.orderNum,
          incomeRecordId: _t.extraParam.recordNum,
          userId: _t.extraParam.ID,
          type: _t.extraParam.type,
          cause: _t.extraParam.reason,
          userPhone: _t.extraParam.phone,
          startDate: _t.extraParam.startstartTime,
          endDate: _t.extraParam.endstartTime,
        };
        if (
          param.pageable.sort.asc.length === 0 &&
          param.pageable.sort.desc.length === 0
        ) {
          delete param.pageable.sort;
        }
        search(param, res => {
          console.log(res)
          _t.data = res;
          _t.getTotal();
        });
        totalInOut(res => {
            this.InOut = res
          console.log(res)
        });
      },
      getTotal() {
        let _t = this;
        let param = {
          pageable: {
            page: _t.page,
            size: _t.pageSize,
            sort: _t.sort
          },
          orderId: _t.extraParam.orderNum,
          incomeRecordId: _t.extraParam.recordNum,
          userId: _t.extraParam.ID,
          type: _t.extraParam.type,
          cause: _t.extraParam.reason,
          userPhone: _t.extraParam.phone,
          startDate: _t.extraParam.startstartTime,
          endDate: _t.extraParam.endstartTime,
        };
        count(param, res => {
          _t.total = parseInt(res.count);
          this.searchInOut = res
          console.log(res)
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
        this.createProps.visible = false;
        this.editProps.visible = false;
      },
      handleSelectionChange(val) {
        this.selectList = val;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.search(this.page);
      },
      handleSizeChange(pageSize) {
        this.pageSize = pageSize;

        this.search(this.page);
      },
      onMenuChange(val) {
        console.log(val);
      },
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
    .manage {
      margin-left: 44px;
      span{
        display: inline-block;
        width: 120px;
        height: 44px;
        background-color: #D7D7D7;
        border-radius: 8px;
        text-align: center;
        p:last-child {
          font-size: 14px;
        }
      }
    }
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
