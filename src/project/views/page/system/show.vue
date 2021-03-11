<template>
  <div>
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
          <!-- <el-dropdown style="position: absolute;right: -9px;top: -6px"  @command="handleClick">
            <el-button type="text">
              <img src="@/project/assets/more.png" alt="" width="10" height="8">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="编辑">编辑</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
        <div class="text item">
          <span class="text_label">区域名称：{{ test }}</span>
        </div>
        <div class="text item">
          <span class="text_label">座位总数：</span>
          {{ page.position }}
        </div>
        <div class="text item">
          <span class="text_label">占座数量：</span>
          {{ page.createAt }}
        </div>
        <div class="text item">
          <span class="text_label">空位数量：</span>
          {{ page.updateAt }}
        </div>
      </el-card>
    </el-col>

    <el-col :span="18">
      <!-- <el-card class="box-card-large">
        <el-tabs v-model="activeName">
          <el-tab-pane label="座位情况" name="first">
            <div v-html="page.content"></div>
          </el-tab-pane>

          <el-tab-pane label="座位情况" name="first">
            <div v-html="page.content"></div>
          </el-tab-pane>
        </el-tabs>
      </el-card> -->
      <el-card class="box-card-large">
        <el-table
          :data="data"
          style="width: 95%; margin: 0 auto"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="seatName" label="座位"></el-table-column>
          <el-table-column prop="type" label="状态"></el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                @click.stop="handleStatusChange(scope.row)"
                type="text"
                size="small"
                >{{
                  scope.row.type.indexOf("启用") >= 0 ? "禁用" : "启用"
                }}</el-button
              >
              <!-- <el-button @click.stop="handleStatusChange(scope.row)" type="text" size="small">{{'扣费'}}</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <i-edit
      :dialog-visible="editProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
      :id="editId"
    />
  </div>
</template>

<script>
import { get } from "@/project/service/page";
import iEdit from "./edit";
export default {
  name: "show",
  data() {
    return {
      textarea: "",
      page: {},
      id: this.$route.params.id,
      activeName: "first",
      editProps: {
        visible: false,
      },
      editId: this.$route.params.id,
      test: "hhhh",
      selectList: [],
      data: [],
    };
  },
  components: {
    iEdit,
  },
  created() {
    this.findById();
  },

  methods: {
    send() {
      updateComment({ storeId: this.id, comment: this.textarea }, (res) => {
        this.$message({
          type: "success",
          message: "已提交!",
        });
        this.findById();
      });
    },
    findById() {
      get({ id: this.id }, (res) => {
        this.page = res;
      });
    },
    handleClick(command) {
      switch (command) {
        case "编辑":
          this.editProps.visible = true;
          break;
      }
    },
    handleClose() {
      this.editProps.visible = false;
    },
    handleSave() {
      this.findById();
      this.handleClose();
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
  },
};
</script>
<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.text_label {
  display: inline-block;
  width: 120px;
  text-align: right;
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

.box-card {
  width: 92%;
  margin: 20px;
  display: inline-block;
}
.box-card-large {
  width: 92%;
  display: inline-block;
  margin: 20px;
}
.el-button--text {
  color: #3e5265;
}
.el-button--mini {
  padding: 4px 12px;
}
.table-button {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}
</style>
