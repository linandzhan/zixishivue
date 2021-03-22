<template>
  <el-dialog
    title="预定座位"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="60%"
    :before-close="handleClose"
  >
    <el-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      label-width="150px"
    >
      <el-form-item label="预定电话" prop="phone">
        <el-input
          v-model="formValidate.phone"
          placeholder="请输入"
          @blur="test"
        ></el-input>
      </el-form-item>
      <el-form-item label="会员名称" prop="username">
        <el-input
          v-model="formValidate.username"
          placeholder="会员名称"
          :disabled="true"
        ></el-input>
      </el-form-item>

      <el-form-item label="预定日期" prop="date">
        <el-date-picker
          v-model="formValidate.date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          style="width: 200px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="预定时间" prop="dateTime">
        <el-time-select
          placeholder="起始时间"
          v-model="formValidate.startTime"
          value-format="HH:mm:00"
          @blur="searchOptions"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
          }"
        >
        </el-time-select>
        <el-time-select
          placeholder="结束时间"
          v-model="formValidate.endTime"
          value-format="HH:mm:00"
          @blur="searchOptions"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
            minTime: formValidate.startTime,
          }"
        >
        </el-time-select>


      </el-form-item>

      <el-form-item label="预定座位" prop="seat">
        <el-cascader
          v-model="formValidate.seat"
          :options="options"
          @change="culculateMoney"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="需扣费" prop="money">
        <el-input
          v-model="formValidate.money"
          placeholder="会员扣费"
          :disabled="true"
        ></el-input>
      </el-form-item>
    </el-form>
    <!--    </div>-->

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm('formValidate')"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import Upload from "@/framework/components/upload";
import Editor from "@/framework/components/editor";
import { save } from "@/project/service/page"; //接口
import Emitter from "@/framework/mixins/emitter";
import { post } from "@/framework/http/request";

export default {
  mixins: [Emitter],
  name: "creat",
  components: {
    Upload,
    Editor,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      options: [],
      categoryList: [],
      radio: "1", //1是启用的意思
      show: false,

      formValidate: {
        label: "help",
      },
      ruleValidate: {
        phone: [{ required: true, message: "电话不能为空", trigger: "blur" }],
        date: [
          { required: true, message: "预定日期不能为空", trigger: "blur" },
        ],
      },
      model: "page",
    };
  },
  computed: {},
  methods: {
    culculateMoney() {
      let startHour = parseInt(this.formValidate.startTime.substring(0, 2));
      let endHour = parseInt(this.formValidate.endTime.substring(0, 2));
      let countHour = endHour - startHour;
      let startMinute = parseInt(this.formValidate.startTime.substring(3, 5));
      let endMinute = parseInt(this.formValidate.endTime.substring(3, 5));
      if (endMinute > startMinute) {
        countHour++;
      }
      post("/seat/get", { id: this.formValidate.seat[1] }, (res) => {
        this.formValidate.money = res.area.amount * countHour + "元";
        console.log(this.formValidate.money);
      });
    },
    test() {
      let param = {
        phone: this.formValidate.phone,
      };
      post("/account/getAccountByPhone", param, (res) => {
        this.formValidate.username = res.username;
        if (this.formValidate.username == null) {
          // this.$message.error("该电话不存在用户列表中");
        }
      });
    },
    onChangeEditor(val) {
      this.formValidate.content = val.html;
    },
    handleClose() {
      // this.visible = false;

      this.$emit("on-dialog-close");
      this.options = [];
      this.$refs.formValidate.resetFields();
    },
    handleConfirm(name) {
      this.$nextTick(() => {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let param = {
              date: this.formValidate.date,
              phone: this.formValidate.phone,
              startTime: this.formValidate.startTime,
              endTime: this.formValidate.endTime,
              areaId: this.formValidate.seat[0],
              seatId: this.formValidate.seat[1],
              money: this.formValidate.money,
            };
            save(param, (res) => {
              this.$message.success("添加成功");
              this.$emit("on-save-success");
              this.options = [];
              this.$refs.formValidate.resetFields();
            });
          }
        });
      });
    },
    handleTransportFileList(e) {
      console.log(e);
      this.formValidate.thumbnail = e[0].response.data;
    },
    handleTransportFileList2(e) {
      console.log(e);
      this.formValidate.blueprint = e[0].response.data;
    },
    searchOptions() {
      if (this.formValidate.endTime == null) {
        return;
      }
      let param = {
        date: this.formValidate.date,
        startTime: this.formValidate.startTime,
        endTime: this.formValidate.endTime,
      };
      post("seat/searchOptions", param, (res) => {
        let data = res;
        this.options = data;
      });
    },
  },

  created() {
    // this.findById()
  },
  mounted() {
    // this.searchOptions();
  },
};
</script>

<style scoped>
</style>
