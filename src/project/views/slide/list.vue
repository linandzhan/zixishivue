<template>
  <div>
    <el-row class="page">
      <!--    搜索-->
      <el-col :span="24">
        <div class="content">
          <span>年份</span>
          <el-select v-model="valuetype1">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="content1">
          <span>月份</span>
          <el-select v-model="valuetype2">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <el-button
          class="search-btn"
          icon="el-icon-search"
          type="primary"
          @click="onSearch"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
      </el-col>
    </el-row>

    <el-col :span="12">
      <div class="grid-content bg-purple">
        <div
          id="pieReport"
          style="width: 50%; height: 400px; margin-top: 25px"
        ></div>
      </div>
    </el-col>

    <el-col :span="12">
      <div class="grid-content bg-purple-light">
        <div
          id="main"
          style="width: 60%; height: 400px; margin-top: 40px"
        ></div>
      </div>
    </el-col>

    <el-row>
      <el-col :span="20">
        <div class="grid-content bg-purple-dark">
          <div
            style="
              width: 30%;
              margin: auto;
              height: 30px;
              font-size: 20px;
              color: #483d8b;
              text-align: center;
            "
          >
            当月用户消费排行榜前10
          </div>

          <el-table :data="data" style="width: 95%; margin-top: 15px">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <el-table-column prop="amount" label="消费金额" sortable="true">
            </el-table-column>
            <el-table-column prop="number" label="预定次数"> </el-table-column>
            <el-table-column prop="areaNameLike" label="最喜爱区域">
            </el-table-column>
            <el-table-column
              fixed="right"
              align="center"
              label="奖励操作"
              width="200"
            >
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="given(scope.row)"
                  >奖励</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Search from "@/framework/components/search";
import IEdit from "./edit";
import ICreate from "./create";
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
import echarts from "echarts";

export default {
  name: "commodityAudit",
  mixins: [Emitter],

  data() {
    return {
      sort: { asc: [], desc: [] },
      monthDate: [],
      options1: [
        {
          value: new Date().getFullYear() + "年",
          label: new Date().getFullYear() + "年",
        },
        {
          value: new Date().getFullYear() - 1 + "年",
          label: new Date().getFullYear() - 1 + "年",
        },
        {
          value: new Date().getFullYear() - 2 + "年",
          label: new Date().getFullYear() - 2 + "年",
        },
      ],
      valuetype1: "",

      options2: [
        {
          value: 1 + "月",
          label: 1 + "月",
        },
        {
          value: 2 + "月",
          label: 2 + "月",
        },
        {
          value: 3 + "月",
          label: 3 + "月",
        },
        {
          value: 12 + "月",
          label: 12 + "月",
        },
      ],
      valuetype2: "",

      keywords: {},
      charts: "",
      opinion: ["区域1", "区域2", "区域3", "区域4", "区域5", "区域6"],
      opinionData: [],

      mychart: "",
      optionData1: [],
      optionName: [],
      searchItems: [],
      data: [],
    };
  },
  created() {},
  computed: {},
  components: {
    Search,
    ICreate,
    IEdit,
  },
  methods: {
    searchLeaderBoard() {
      let param = {
        year: this.valuetype1,
        month: this.valuetype2,
      };
      post("/record/leaderBoard", param, (res) => {
        this.data = res;
      });
    },
    given(row) {},
    onSearch() {
      this.$emit("on-search", this.keywords); // handle seach
      console.log(this.valuetype1);
      console.log(this.valuetype2);
      let param = {
        year: this.valuetype1,
        month: this.valuetype2,
      };
      this.searchLeaderBoard();
      post("/area/searchMoneyByAreaAndDate", param, (res) => {
        let optionDataTemp = [];
        let optionNameTemp = [];
        let i = 0;
        this.opinionData = res.areas;
        res.incomes.forEach((element) => {
          optionDataTemp.push(element.income);
          optionNameTemp.push(element.month);
        });
        this.optionData1 = optionDataTemp;
        this.optionName = optionNameTemp;
        this.drawPie("pieReport");
        this.drawZhu("main");
      });
    },
    onReset() {
      this.keywords = {};
      this.clear = true;
      setTimeout(() => {
        this.clear = false;
      }, 200);
      this.$emit("on-search", this.keywords); //  handle seach
    },
    searchBySearchItem(searchItems) {
      console.log(searchItems);
      let keys = [];
      // this.search(1);
    },
    drawPie(id) {
      this.charts = echarts.init(document.getElementById(id));
      this.charts.setOption({
        title: {
          text: "当月各区域自习室预定订单量",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a}<br/>{b}:{c} ({d}%)",
        },
        legend: {
          bottom: 10,
          left: "center",
          data: this.opinion,
        },
        series: [
          {
            name: "状态",
            type: "pie",
            radius: "75%",
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
              color: function (params) {
                //自定义颜色
                var colorList = [
                  "#1ab394",
                  "#79d2c0",
                  "#483D8B",
                  "#00BFFF",
                  "#00FA9A",
                  "#556B2F",
                ];
                return colorList[params.dataIndex];
              },
            },
            data: this.opinionData,
          },
        ],
      });
    },
    drawZhu(id) {
      this.mychart = echarts.init(document.getElementById(id));
      this.mychart.setOption({
        title: {
          text: "当年门店收入统计",
        },
        // tooltip: {},
        // legend: {
        //   data: ["收入金额"],
        // },
        xAxis: {
          axisLine: {
            show: true,
          },
          data: this.optionName,
          name: "月份",
        },
        yAxis: {
          //是否显示y轴线条
          axisLine: {
            show: true,
          },
          name: "收入金额(元)",
          // 线条位置
          position: "left",
        },
        series: [
          {
            name: "收入金额",
            type: "bar",
            data: this.optionData1,
            label: { show: true, position: "top" },
          },
        ],
      });
    },
    setYear() {
      this.valuetype1 = new Date().getFullYear() + "年";
      this.valuetype2 = new Date().getMonth() + 1 + "月";
      let monthNow = new Date().getMonth();
      for (let i = 0; i < 6; i++) {
        if (monthNow - i == 0) {
          monthNow = 12 + monthNow;
        }
        this.monthDate.push(monthNow - i);
      }
      console.log(this.monthDate);
    },
  },
  mounted() {
    this.onSearch();
    this.drawPie("pieReport");
    this.drawZhu("main");
    this.setYear();
    this.searchLeaderBoard();
  },
};
</script>
<style lang="less" scoped>
.content {
  display: inline-block;
  margin-left: 10px;
  margin-top: 20px;
}
.content1 {
  display: inline-block;
  margin-left: 30px;
  margin-top: 20px;
}
</style>
