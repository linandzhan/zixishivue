<template>
  <el-dialog
    title="预定座位"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="60%"
    :before-close="handleClose"
  >
    <!--    <div style="overflow: auto;height:40vh;padding: 10px 0 40px;">-->
    <el-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      label-width="150px"
    >
      <el-form-item label="预定电话" prop="phone">
        <el-input v-model="formValidate.phone" placeholder="请输入"></el-input>
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
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
            minTime: formValidate.startTime,
          }"
        >
        </el-time-select>

          <!-- <el-time-picker
    v-model="formValidate.startTime"
    value-format="HH:mm:ss"
    :picker-options="{
      selectableRange: '18:30:00 - 20:30:00'
    }"
    placeholder="任意时间点">
  </el-time-picker>
  <el-time-picker
    arrow-control
    v-model="formValidate.endTime"
    value-format="HH:mm:ss"
    :picker-options="{
      selectableRange: '18:30:00 - 20:30:00'
    }"
    placeholder="任意时间点">
  </el-time-picker> -->
       
      </el-form-item>

      <el-form-item label="预定座位" prop="dateTime">
        <el-cascader
          v-model="formValidate.seat"
          :options="options"
        ></el-cascader>
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
    onChangeEditor(val) {
      this.formValidate.content = val.html;
    },
    handleClose() {
      // this.visible = false;

      this.$emit("on-dialog-close");
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
            };
            save(param, (res) => {
              this.$message.success("添加成功");
              this.$emit("on-save-success");
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
      post("seat/searchOptions", {}, (res) => {
        let data = res;
        this.options = data;
      });
    },
  },

  created() {
    // this.findById()
  },
  mounted() {
    this.searchOptions();
  },
};
</script>

<style scoped>
</style>
