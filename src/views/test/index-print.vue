<template>
  <div class="main_content">
    <!-- <div class="split_style gauge">
      <div id="GaugeContent" class="gauge_content">
        <div v-for="item in 6" :key="item"></div>
      </div>
    </div> -->
    <!--   <div class="flex">
      <div v-for="item in 100" :key="item" class="flex-item">{{ item }}</div>
    </div> -->

    <div>

      <el-statistic group-separator="," :precision="0" :value="value2" :title="'test'"></el-statistic>
    </div>
    <!--  <el-button v-for="(item, key) in chartItems" :key="key" size="mini">{{ key
          }}</el-button> -->
    <el-button @click="test(list)">test2</el-button>
    <!-- <div v-for="(item, key) in items" :key="key">

      {{ item }}</div> -->
    <div class="test" style="height: 100px; width: 100px;" @click="tComponent"></div>

    <TestComponent style="height: 50px; width: 100px; border: 1px solid #ccc" v-bind="$attrs" v-on="$listeners"
      @click="tComponent"></TestComponent>
      <XPrint ref="XPrint"></XPrint>
  </div>
</template>
<script>
// @submit.native.prevent
import TestComponent from './testComponent/index.vue'
import XPrint from './components/XPrint.vue'

export default {
  components: {
    TestComponent,
    XPrint
  },
  data() {
    return {
      timer: null,
      value2: 1345,
      list: [
        {
          "ProjectName": "S11_R631",
          "ProjectIcon": "/assets/images/PhoneCase.png",
          "StationTypeID": 3,
          "StationType": "HW",
          "Input": 592665,
          "NG": 4686,
          "Output": 586079,
          "SCRAP": 1900,
          "Other": 0
        },
        {
          "ProjectName": "S11_R631",
          "ProjectIcon": "/assets/images/PhoneCase.png",
          "StationTypeID": 14,
          "StationType": "Kitting",
          "Input": 100,
          "NG": 0,
          "Output": 100,
          "SCRAP": 0,
          "Other": 0
        },
        {
          "ProjectName": "S11_R631",
          "ProjectIcon": "/assets/images/PhoneCase.png",
          "StationTypeID": 68,
          "StationType": "Shiped",
          "Input": 100,
          "NG": 0,
          "Output": 100,
          "SCRAP": 0,
          "Other": 0
        },
        {
          "ProjectName": "S12_R731",
          "ProjectIcon": "/assets/images/PhoneCase.png",
          "StationTypeID": 3,
          "StationType": "HW",
          "Input": 1212394,
          "NG": 8787,
          "Output": 1199532,
          "SCRAP": 4075,
          "Other": 0
        },
        {
          "ProjectName": "S12_R731",
          "ProjectIcon": "/assets/images/PhoneCase.png",
          "StationTypeID": 14,
          "StationType": "Kitting",
          "Input": 120,
          "NG": 0,
          "Output": 120,
          "SCRAP": 0,
          "Other": 0
        },
        {
          "ProjectName": "S12_R731",
          "ProjectIcon": "/assets/images/PhoneCase.png",
          "StationTypeID": 68,
          "StationType": "Shiped",
          "Input": 120,
          "NG": 0,
          "Output": 120,
          "SCRAP": 0,
          "Other": 0
        },
        {
          "ProjectName": "S13_R831",
          "ProjectIcon": "/assets/images/PhoneCase.png",
          "StationTypeID": 3,
          "StationType": "HW",
          "Input": 1246879,
          "NG": 9775,
          "Output": 1234801,
          "SCRAP": 2303,
          "Other": 0
        },
        {
          "ProjectName": "S13_R831",
          "ProjectIcon": "/assets/images/PhoneCase.png",
          "StationTypeID": 14,
          "StationType": "Kitting",
          "Input": 120,
          "NG": 0,
          "Output": 120,
          "SCRAP": 0,
          "Other": 0
        },
        {
          "ProjectName": "S13_R831",
          "ProjectIcon": "/assets/images/PhoneCase.png",
          "StationTypeID": 68,
          "StationType": "Shiped",
          "Input": 120,
          "NG": 0,
          "Output": 120,
          "SCRAP": 0,
          "Other": 0
        },
        {
          "ProjectName": "S14_R931",
          "ProjectIcon": "/assets/images/PhoneCase.png",
          "StationTypeID": 3,
          "StationType": "HW",
          "Input": 1201259,
          "NG": 13666,
          "Output": 1184692,
          "SCRAP": 2901,
          "Other": 0
        },
        {
          "ProjectName": "S14_R931",
          "ProjectIcon": "/assets/images/PhoneCase.png",
          "StationTypeID": 14,
          "StationType": "Kitting",
          "Input": 140,
          "NG": 0,
          "Output": 140,
          "SCRAP": 0,
          "Other": 0
        },
        {
          "ProjectName": "S14_R931",
          "ProjectIcon": "/assets/images/PhoneCase.png",
          "StationTypeID": 68,
          "StationType": "Shiped",
          "Input": 140,
          "NG": 0,
          "Output": 140,
          "SCRAP": 0,
          "Other": 0
        }
      ],
      items: {},
      list1: [
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-04",
          "CDay": "2021-04-27",
          "Input": 1,
          "NG": 0,
          "Output": 1,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-04",
          "CDay": "2021-04-29",
          "Input": 1,
          "NG": 1,
          "Output": 0,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 0
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-06",
          "Input": 15,
          "NG": 13,
          "Output": 2,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 13.33
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-07",
          "Input": 100,
          "NG": 100,
          "Output": 0,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 0
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-14",
          "Input": 231,
          "NG": 231,
          "Output": 0,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 0
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-15",
          "Input": 454,
          "NG": 452,
          "Output": 2,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 0.44
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-17",
          "Input": 137,
          "NG": 137,
          "Output": 0,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 0
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-18",
          "Input": 588,
          "NG": 570,
          "Output": 18,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 3.06
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-19",
          "Input": 314,
          "NG": 313,
          "Output": 1,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 0.32
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-20",
          "Input": 165,
          "NG": 165,
          "Output": 0,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 0
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-21",
          "Input": 148,
          "NG": 148,
          "Output": 0,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 0
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-22",
          "Input": 176,
          "NG": 176,
          "Output": 0,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 0
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-24",
          "Input": 162,
          "NG": 112,
          "Output": 50,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 30.86
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-27",
          "Input": 124,
          "NG": 123,
          "Output": 1,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 0.81
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-05",
          "CDay": "2021-05-28",
          "Input": 256,
          "NG": 136,
          "Output": 120,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 46.88
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-01",
          "Input": 1008,
          "NG": 699,
          "Output": 309,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 30.65
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-02",
          "Input": 3402,
          "NG": 1512,
          "Output": 1890,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 55.56
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-03",
          "Input": 4235,
          "NG": 1189,
          "Output": 3046,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 71.92
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-04",
          "Input": 7644,
          "NG": 1146,
          "Output": 6498,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 85.01
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-05",
          "Input": 5523,
          "NG": 1462,
          "Output": 4061,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 73.53
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-06",
          "Input": 55,
          "NG": 0,
          "Output": 55,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-07",
          "Input": 7898,
          "NG": 730,
          "Output": 7168,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 90.76
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-08",
          "Input": 15633,
          "NG": 369,
          "Output": 15264,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 97.64
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-09",
          "Input": 16985,
          "NG": 205,
          "Output": 16780,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 98.79
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-10",
          "Input": 17104,
          "NG": 1054,
          "Output": 16050,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 93.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-11",
          "Input": 16183,
          "NG": 2129,
          "Output": 14054,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 86.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-12",
          "Input": 17105,
          "NG": 2384,
          "Output": 14721,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 86.06
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-13",
          "Input": 5551,
          "NG": 1264,
          "Output": 4287,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 77.23
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-15",
          "Input": 16484,
          "NG": 2086,
          "Output": 14398,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 87.35
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-16",
          "Input": 26134,
          "NG": 3333,
          "Output": 22801,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 87.25
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-17",
          "Input": 28454,
          "NG": 4203,
          "Output": 24251,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 85.23
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-18",
          "Input": 29327,
          "NG": 3185,
          "Output": 26142,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 89.14
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-19",
          "Input": 30984,
          "NG": 2502,
          "Output": 28482,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 91.92
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-20",
          "Input": 8433,
          "NG": 814,
          "Output": 7619,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 90.35
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-21",
          "Input": 20218,
          "NG": 1699,
          "Output": 18408,
          "SCRAP": 111,
          "Other": 0,
          "Yield": 91.05
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-22",
          "Input": 27008,
          "NG": 858,
          "Output": 25958,
          "SCRAP": 192,
          "Other": 0,
          "Yield": 96.11
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-23",
          "Input": 35439,
          "NG": 973,
          "Output": 34327,
          "SCRAP": 139,
          "Other": 0,
          "Yield": 96.86
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-24",
          "Input": 41561,
          "NG": 421,
          "Output": 40972,
          "SCRAP": 168,
          "Other": 0,
          "Yield": 98.58
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-25",
          "Input": 38696,
          "NG": 0,
          "Output": 38546,
          "SCRAP": 150,
          "Other": 0,
          "Yield": 99.61
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-26",
          "Input": 41633,
          "NG": 0,
          "Output": 41451,
          "SCRAP": 182,
          "Other": 0,
          "Yield": 99.56
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-27",
          "Input": 10838,
          "NG": 0,
          "Output": 10789,
          "SCRAP": 49,
          "Other": 0,
          "Yield": 99.55
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-28",
          "Input": 27022,
          "NG": 0,
          "Output": 26949,
          "SCRAP": 73,
          "Other": 0,
          "Yield": 99.73
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-29",
          "Input": 36969,
          "NG": 0,
          "Output": 36816,
          "SCRAP": 153,
          "Other": 0,
          "Yield": 99.59
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-06",
          "CDay": "2021-06-30",
          "Input": 38985,
          "NG": 3,
          "Output": 38802,
          "SCRAP": 180,
          "Other": 0,
          "Yield": 99.53
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-01",
          "Input": 42668,
          "NG": 0,
          "Output": 42492,
          "SCRAP": 176,
          "Other": 0,
          "Yield": 99.59
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-02",
          "Input": 45944,
          "NG": 0,
          "Output": 45784,
          "SCRAP": 160,
          "Other": 0,
          "Yield": 99.65
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-03",
          "Input": 43120,
          "NG": 0,
          "Output": 42960,
          "SCRAP": 160,
          "Other": 0,
          "Yield": 99.63
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-04",
          "Input": 8343,
          "NG": 0,
          "Output": 8299,
          "SCRAP": 44,
          "Other": 0,
          "Yield": 99.47
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-05",
          "Input": 28074,
          "NG": 0,
          "Output": 27968,
          "SCRAP": 106,
          "Other": 0,
          "Yield": 99.62
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-06",
          "Input": 38100,
          "NG": 0,
          "Output": 37920,
          "SCRAP": 180,
          "Other": 0,
          "Yield": 99.53
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-07",
          "Input": 32767,
          "NG": 0,
          "Output": 32628,
          "SCRAP": 139,
          "Other": 0,
          "Yield": 99.58
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-08",
          "Input": 41851,
          "NG": 0,
          "Output": 41644,
          "SCRAP": 207,
          "Other": 0,
          "Yield": 99.51
        },
        {
          "StationTypeID": 68,
          "StationType": "Shiped",
          "CMonth": "2021-07",
          "CDay": "2021-07-09",
          "Input": 480,
          "NG": 0,
          "Output": 480,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-09",
          "Input": 45386,
          "NG": 0,
          "Output": 45226,
          "SCRAP": 160,
          "Other": 0,
          "Yield": 99.65
        },
        {
          "StationTypeID": 14,
          "StationType": "Kitting",
          "CMonth": "2021-07",
          "CDay": "2021-07-09",
          "Input": 480,
          "NG": 0,
          "Output": 480,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-10",
          "Input": 44180,
          "NG": 0,
          "Output": 44009,
          "SCRAP": 171,
          "Other": 0,
          "Yield": 99.61
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-11",
          "Input": 9752,
          "NG": 0,
          "Output": 9682,
          "SCRAP": 70,
          "Other": 0,
          "Yield": 99.28
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-12",
          "Input": 31968,
          "NG": 0,
          "Output": 31845,
          "SCRAP": 123,
          "Other": 0,
          "Yield": 99.62
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-13",
          "Input": 41647,
          "NG": 0,
          "Output": 41483,
          "SCRAP": 164,
          "Other": 0,
          "Yield": 99.61
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-14",
          "Input": 45079,
          "NG": 5,
          "Output": 44883,
          "SCRAP": 191,
          "Other": 0,
          "Yield": 99.57
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-15",
          "Input": 44687,
          "NG": 0,
          "Output": 44522,
          "SCRAP": 165,
          "Other": 0,
          "Yield": 99.63
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-16",
          "Input": 43687,
          "NG": 0,
          "Output": 43515,
          "SCRAP": 172,
          "Other": 0,
          "Yield": 99.61
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-17",
          "Input": 38416,
          "NG": 0,
          "Output": 38272,
          "SCRAP": 144,
          "Other": 0,
          "Yield": 99.63
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-18",
          "Input": 6099,
          "NG": 0,
          "Output": 6034,
          "SCRAP": 65,
          "Other": 0,
          "Yield": 98.93
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-19",
          "Input": 29934,
          "NG": 0,
          "Output": 29817,
          "SCRAP": 117,
          "Other": 0,
          "Yield": 99.61
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-20",
          "Input": 40077,
          "NG": 0,
          "Output": 39882,
          "SCRAP": 195,
          "Other": 0,
          "Yield": 99.51
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-21",
          "Input": 42488,
          "NG": 0,
          "Output": 42328,
          "SCRAP": 160,
          "Other": 0,
          "Yield": 99.62
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-22",
          "Input": 46087,
          "NG": 0,
          "Output": 45852,
          "SCRAP": 235,
          "Other": 0,
          "Yield": 99.49
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-23",
          "Input": 44735,
          "NG": 0,
          "Output": 44540,
          "SCRAP": 195,
          "Other": 0,
          "Yield": 99.56
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-24",
          "Input": 38685,
          "NG": 0,
          "Output": 38507,
          "SCRAP": 178,
          "Other": 0,
          "Yield": 99.54
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-25",
          "Input": 6867,
          "NG": 0,
          "Output": 6815,
          "SCRAP": 52,
          "Other": 0,
          "Yield": 99.24
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-26",
          "Input": 29398,
          "NG": 0,
          "Output": 29317,
          "SCRAP": 81,
          "Other": 0,
          "Yield": 99.72
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-27",
          "Input": 43369,
          "NG": 0,
          "Output": 43172,
          "SCRAP": 197,
          "Other": 0,
          "Yield": 99.55
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-28",
          "Input": 48933,
          "NG": 0,
          "Output": 48723,
          "SCRAP": 210,
          "Other": 0,
          "Yield": 99.57
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-29",
          "Input": 49362,
          "NG": 0,
          "Output": 49194,
          "SCRAP": 168,
          "Other": 0,
          "Yield": 99.66
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-30",
          "Input": 48808,
          "NG": 0,
          "Output": 48662,
          "SCRAP": 146,
          "Other": 0,
          "Yield": 99.7
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-07",
          "CDay": "2021-07-31",
          "Input": 41776,
          "NG": 0,
          "Output": 41636,
          "SCRAP": 140,
          "Other": 0,
          "Yield": 99.66
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-01",
          "Input": 7582,
          "NG": 0,
          "Output": 7553,
          "SCRAP": 29,
          "Other": 0,
          "Yield": 99.62
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-02",
          "Input": 32037,
          "NG": 0,
          "Output": 31985,
          "SCRAP": 52,
          "Other": 0,
          "Yield": 99.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-03",
          "Input": 39638,
          "NG": 0,
          "Output": 39549,
          "SCRAP": 89,
          "Other": 0,
          "Yield": 99.78
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-04",
          "Input": 44018,
          "NG": 4,
          "Output": 43899,
          "SCRAP": 115,
          "Other": 0,
          "Yield": 99.73
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-05",
          "Input": 47113,
          "NG": 0,
          "Output": 47005,
          "SCRAP": 108,
          "Other": 0,
          "Yield": 99.77
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-06",
          "Input": 45524,
          "NG": 0,
          "Output": 45427,
          "SCRAP": 97,
          "Other": 0,
          "Yield": 99.79
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-07",
          "Input": 40416,
          "NG": 0,
          "Output": 40306,
          "SCRAP": 110,
          "Other": 0,
          "Yield": 99.73
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-08",
          "Input": 7462,
          "NG": 0,
          "Output": 7436,
          "SCRAP": 26,
          "Other": 0,
          "Yield": 99.65
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-09",
          "Input": 30266,
          "NG": 0,
          "Output": 30219,
          "SCRAP": 47,
          "Other": 0,
          "Yield": 99.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-10",
          "Input": 36669,
          "NG": 0,
          "Output": 36577,
          "SCRAP": 92,
          "Other": 0,
          "Yield": 99.75
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-11",
          "Input": 40784,
          "NG": 0,
          "Output": 40702,
          "SCRAP": 82,
          "Other": 0,
          "Yield": 99.8
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-12",
          "Input": 44998,
          "NG": 0,
          "Output": 44867,
          "SCRAP": 131,
          "Other": 0,
          "Yield": 99.71
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-13",
          "Input": 43653,
          "NG": 0,
          "Output": 43551,
          "SCRAP": 102,
          "Other": 0,
          "Yield": 99.77
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-14",
          "Input": 36395,
          "NG": 0,
          "Output": 36310,
          "SCRAP": 85,
          "Other": 0,
          "Yield": 99.77
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-15",
          "Input": 6445,
          "NG": 0,
          "Output": 6410,
          "SCRAP": 35,
          "Other": 0,
          "Yield": 99.46
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-16",
          "Input": 24927,
          "NG": 0,
          "Output": 24899,
          "SCRAP": 28,
          "Other": 0,
          "Yield": 99.89
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-17",
          "Input": 29753,
          "NG": 0,
          "Output": 29700,
          "SCRAP": 53,
          "Other": 0,
          "Yield": 99.82
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-18",
          "Input": 35988,
          "NG": 0,
          "Output": 35902,
          "SCRAP": 86,
          "Other": 0,
          "Yield": 99.76
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-19",
          "Input": 41911,
          "NG": 0,
          "Output": 41836,
          "SCRAP": 75,
          "Other": 0,
          "Yield": 99.82
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-20",
          "Input": 43844,
          "NG": 0,
          "Output": 43758,
          "SCRAP": 86,
          "Other": 0,
          "Yield": 99.8
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-21",
          "Input": 44940,
          "NG": 0,
          "Output": 44849,
          "SCRAP": 91,
          "Other": 0,
          "Yield": 99.8
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-22",
          "Input": 11537,
          "NG": 0,
          "Output": 11507,
          "SCRAP": 30,
          "Other": 0,
          "Yield": 99.74
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-23",
          "Input": 28243,
          "NG": 0,
          "Output": 28190,
          "SCRAP": 53,
          "Other": 0,
          "Yield": 99.81
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-24",
          "Input": 37029,
          "NG": 0,
          "Output": 36958,
          "SCRAP": 71,
          "Other": 0,
          "Yield": 99.81
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-25",
          "Input": 40426,
          "NG": 0,
          "Output": 40339,
          "SCRAP": 87,
          "Other": 0,
          "Yield": 99.78
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-26",
          "Input": 43053,
          "NG": 0,
          "Output": 42947,
          "SCRAP": 106,
          "Other": 0,
          "Yield": 99.75
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-27",
          "Input": 41179,
          "NG": 0,
          "Output": 41067,
          "SCRAP": 112,
          "Other": 0,
          "Yield": 99.73
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-28",
          "Input": 40518,
          "NG": 0,
          "Output": 40428,
          "SCRAP": 90,
          "Other": 0,
          "Yield": 99.78
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-29",
          "Input": 9067,
          "NG": 0,
          "Output": 9038,
          "SCRAP": 29,
          "Other": 0,
          "Yield": 99.68
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-30",
          "Input": 27026,
          "NG": 0,
          "Output": 26992,
          "SCRAP": 34,
          "Other": 0,
          "Yield": 99.87
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-08",
          "CDay": "2021-08-31",
          "Input": 31244,
          "NG": 0,
          "Output": 31188,
          "SCRAP": 56,
          "Other": 0,
          "Yield": 99.82
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-01",
          "Input": 37218,
          "NG": 0,
          "Output": 37157,
          "SCRAP": 61,
          "Other": 0,
          "Yield": 99.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-02",
          "Input": 43418,
          "NG": 0,
          "Output": 43333,
          "SCRAP": 85,
          "Other": 0,
          "Yield": 99.8
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-03",
          "Input": 36935,
          "NG": 0,
          "Output": 36858,
          "SCRAP": 77,
          "Other": 0,
          "Yield": 99.79
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-04",
          "Input": 36474,
          "NG": 0,
          "Output": 36388,
          "SCRAP": 86,
          "Other": 0,
          "Yield": 99.76
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-05",
          "Input": 11432,
          "NG": 0,
          "Output": 11405,
          "SCRAP": 27,
          "Other": 0,
          "Yield": 99.76
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-06",
          "Input": 10383,
          "NG": 0,
          "Output": 10369,
          "SCRAP": 14,
          "Other": 0,
          "Yield": 99.87
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-07",
          "Input": 12467,
          "NG": 0,
          "Output": 12455,
          "SCRAP": 12,
          "Other": 0,
          "Yield": 99.9
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-08",
          "Input": 15235,
          "NG": 0,
          "Output": 15200,
          "SCRAP": 35,
          "Other": 0,
          "Yield": 99.77
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-09",
          "Input": 17659,
          "NG": 0,
          "Output": 17608,
          "SCRAP": 51,
          "Other": 0,
          "Yield": 99.71
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-10",
          "Input": 19735,
          "NG": 0,
          "Output": 19688,
          "SCRAP": 47,
          "Other": 0,
          "Yield": 99.76
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-11",
          "Input": 21799,
          "NG": 0,
          "Output": 21764,
          "SCRAP": 35,
          "Other": 0,
          "Yield": 99.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-12",
          "Input": 4601,
          "NG": 0,
          "Output": 4579,
          "SCRAP": 22,
          "Other": 0,
          "Yield": 99.52
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-13",
          "Input": 10848,
          "NG": 0,
          "Output": 10841,
          "SCRAP": 7,
          "Other": 0,
          "Yield": 99.94
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-14",
          "Input": 16303,
          "NG": 0,
          "Output": 16265,
          "SCRAP": 38,
          "Other": 0,
          "Yield": 99.77
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-15",
          "Input": 17302,
          "NG": 0,
          "Output": 17241,
          "SCRAP": 61,
          "Other": 0,
          "Yield": 99.65
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-16",
          "Input": 4629,
          "NG": 0,
          "Output": 4607,
          "SCRAP": 22,
          "Other": 0,
          "Yield": 99.52
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-17",
          "Input": 10617,
          "NG": 0,
          "Output": 10605,
          "SCRAP": 12,
          "Other": 0,
          "Yield": 99.89
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-18",
          "Input": 17051,
          "NG": 0,
          "Output": 17036,
          "SCRAP": 15,
          "Other": 0,
          "Yield": 99.91
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-19",
          "Input": 18488,
          "NG": 0,
          "Output": 18463,
          "SCRAP": 25,
          "Other": 0,
          "Yield": 99.86
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-20",
          "Input": 5002,
          "NG": 0,
          "Output": 4977,
          "SCRAP": 25,
          "Other": 0,
          "Yield": 99.5
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-22",
          "Input": 13084,
          "NG": 0,
          "Output": 13057,
          "SCRAP": 27,
          "Other": 0,
          "Yield": 99.79
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-23",
          "Input": 5206,
          "NG": 0,
          "Output": 5177,
          "SCRAP": 29,
          "Other": 0,
          "Yield": 99.44
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-24",
          "Input": 13133,
          "NG": 0,
          "Output": 13083,
          "SCRAP": 50,
          "Other": 0,
          "Yield": 99.62
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-25",
          "Input": 22068,
          "NG": 0,
          "Output": 22042,
          "SCRAP": 26,
          "Other": 0,
          "Yield": 99.88
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-26",
          "Input": 9525,
          "NG": 0,
          "Output": 9499,
          "SCRAP": 26,
          "Other": 0,
          "Yield": 99.73
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-27",
          "Input": 16371,
          "NG": 0,
          "Output": 16354,
          "SCRAP": 17,
          "Other": 0,
          "Yield": 99.9
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-28",
          "Input": 21168,
          "NG": 0,
          "Output": 21147,
          "SCRAP": 21,
          "Other": 0,
          "Yield": 99.9
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-09",
          "CDay": "2021-09-29",
          "Input": 13616,
          "NG": 0,
          "Output": 13593,
          "SCRAP": 23,
          "Other": 0,
          "Yield": 99.83
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-04",
          "Input": 8173,
          "NG": 0,
          "Output": 8166,
          "SCRAP": 7,
          "Other": 0,
          "Yield": 99.91
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-05",
          "Input": 17981,
          "NG": 0,
          "Output": 17968,
          "SCRAP": 13,
          "Other": 0,
          "Yield": 99.93
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-06",
          "Input": 16939,
          "NG": 0,
          "Output": 16910,
          "SCRAP": 29,
          "Other": 0,
          "Yield": 99.83
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-07",
          "Input": 19012,
          "NG": 0,
          "Output": 18989,
          "SCRAP": 23,
          "Other": 0,
          "Yield": 99.88
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-08",
          "Input": 19201,
          "NG": 0,
          "Output": 19173,
          "SCRAP": 28,
          "Other": 0,
          "Yield": 99.85
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-09",
          "Input": 19758,
          "NG": 0,
          "Output": 19704,
          "SCRAP": 54,
          "Other": 0,
          "Yield": 99.73
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-10",
          "Input": 1872,
          "NG": 0,
          "Output": 1857,
          "SCRAP": 15,
          "Other": 0,
          "Yield": 99.2
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-11",
          "Input": 14916,
          "NG": 0,
          "Output": 14896,
          "SCRAP": 20,
          "Other": 0,
          "Yield": 99.87
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-12",
          "Input": 17785,
          "NG": 0,
          "Output": 17754,
          "SCRAP": 31,
          "Other": 0,
          "Yield": 99.83
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-13",
          "Input": 22293,
          "NG": 0,
          "Output": 22245,
          "SCRAP": 48,
          "Other": 0,
          "Yield": 99.78
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-14",
          "Input": 24018,
          "NG": 0,
          "Output": 23978,
          "SCRAP": 40,
          "Other": 0,
          "Yield": 99.83
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-15",
          "Input": 24345,
          "NG": 0,
          "Output": 24307,
          "SCRAP": 38,
          "Other": 0,
          "Yield": 99.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-16",
          "Input": 25050,
          "NG": 0,
          "Output": 25019,
          "SCRAP": 31,
          "Other": 0,
          "Yield": 99.88
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-17",
          "Input": 4267,
          "NG": 0,
          "Output": 4244,
          "SCRAP": 23,
          "Other": 0,
          "Yield": 99.46
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-18",
          "Input": 18035,
          "NG": 0,
          "Output": 18017,
          "SCRAP": 18,
          "Other": 0,
          "Yield": 99.9
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-19",
          "Input": 20238,
          "NG": 0,
          "Output": 20210,
          "SCRAP": 28,
          "Other": 0,
          "Yield": 99.86
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-20",
          "Input": 25076,
          "NG": 0,
          "Output": 25031,
          "SCRAP": 45,
          "Other": 0,
          "Yield": 99.82
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-21",
          "Input": 24137,
          "NG": 0,
          "Output": 24095,
          "SCRAP": 42,
          "Other": 0,
          "Yield": 99.83
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-22",
          "Input": 21891,
          "NG": 0,
          "Output": 21850,
          "SCRAP": 41,
          "Other": 0,
          "Yield": 99.81
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-23",
          "Input": 22228,
          "NG": 0,
          "Output": 22186,
          "SCRAP": 42,
          "Other": 0,
          "Yield": 99.81
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-24",
          "Input": 3849,
          "NG": 0,
          "Output": 3840,
          "SCRAP": 9,
          "Other": 0,
          "Yield": 99.77
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-25",
          "Input": 15473,
          "NG": 0,
          "Output": 15459,
          "SCRAP": 14,
          "Other": 0,
          "Yield": 99.91
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-26",
          "Input": 18097,
          "NG": 0,
          "Output": 18072,
          "SCRAP": 25,
          "Other": 0,
          "Yield": 99.86
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-27",
          "Input": 20777,
          "NG": 0,
          "Output": 20712,
          "SCRAP": 65,
          "Other": 0,
          "Yield": 99.69
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-28",
          "Input": 24945,
          "NG": 0,
          "Output": 24890,
          "SCRAP": 55,
          "Other": 0,
          "Yield": 99.78
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-29",
          "Input": 24670,
          "NG": 0,
          "Output": 24576,
          "SCRAP": 94,
          "Other": 0,
          "Yield": 99.62
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-30",
          "Input": 23148,
          "NG": 0,
          "Output": 23078,
          "SCRAP": 70,
          "Other": 0,
          "Yield": 99.7
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-10",
          "CDay": "2021-10-31",
          "Input": 4593,
          "NG": 0,
          "Output": 4571,
          "SCRAP": 22,
          "Other": 0,
          "Yield": 99.52
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-01",
          "Input": 14102,
          "NG": 0,
          "Output": 14082,
          "SCRAP": 20,
          "Other": 0,
          "Yield": 99.86
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-02",
          "Input": 17961,
          "NG": 0,
          "Output": 17912,
          "SCRAP": 49,
          "Other": 0,
          "Yield": 99.73
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-03",
          "Input": 16466,
          "NG": 5,
          "Output": 16440,
          "SCRAP": 21,
          "Other": 0,
          "Yield": 99.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-04",
          "Input": 16567,
          "NG": 0,
          "Output": 16520,
          "SCRAP": 47,
          "Other": 0,
          "Yield": 99.72
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-05",
          "Input": 13508,
          "NG": 0,
          "Output": 13466,
          "SCRAP": 42,
          "Other": 0,
          "Yield": 99.69
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-06",
          "Input": 10698,
          "NG": 0,
          "Output": 10667,
          "SCRAP": 31,
          "Other": 0,
          "Yield": 99.71
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-07",
          "Input": 1292,
          "NG": 0,
          "Output": 1269,
          "SCRAP": 23,
          "Other": 0,
          "Yield": 98.22
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-08",
          "Input": 5190,
          "NG": 0,
          "Output": 5187,
          "SCRAP": 3,
          "Other": 0,
          "Yield": 99.94
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-09",
          "Input": 7820,
          "NG": 0,
          "Output": 7794,
          "SCRAP": 26,
          "Other": 0,
          "Yield": 99.67
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-10",
          "Input": 7127,
          "NG": 0,
          "Output": 7114,
          "SCRAP": 13,
          "Other": 0,
          "Yield": 99.82
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-11",
          "Input": 9563,
          "NG": 0,
          "Output": 9548,
          "SCRAP": 15,
          "Other": 0,
          "Yield": 99.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-12",
          "Input": 9344,
          "NG": 0,
          "Output": 9336,
          "SCRAP": 8,
          "Other": 0,
          "Yield": 99.91
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-13",
          "Input": 8518,
          "NG": 0,
          "Output": 8497,
          "SCRAP": 21,
          "Other": 0,
          "Yield": 99.75
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-15",
          "Input": 4431,
          "NG": 0,
          "Output": 4427,
          "SCRAP": 4,
          "Other": 0,
          "Yield": 99.91
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-16",
          "Input": 5977,
          "NG": 0,
          "Output": 5964,
          "SCRAP": 13,
          "Other": 0,
          "Yield": 99.78
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-17",
          "Input": 5475,
          "NG": 0,
          "Output": 5472,
          "SCRAP": 3,
          "Other": 0,
          "Yield": 99.95
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-18",
          "Input": 8836,
          "NG": 0,
          "Output": 8817,
          "SCRAP": 19,
          "Other": 0,
          "Yield": 99.78
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-19",
          "Input": 9201,
          "NG": 0,
          "Output": 9193,
          "SCRAP": 8,
          "Other": 0,
          "Yield": 99.91
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-20",
          "Input": 3285,
          "NG": 0,
          "Output": 3276,
          "SCRAP": 9,
          "Other": 0,
          "Yield": 99.73
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-22",
          "Input": 4404,
          "NG": 0,
          "Output": 4399,
          "SCRAP": 5,
          "Other": 0,
          "Yield": 99.89
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-23",
          "Input": 5714,
          "NG": 0,
          "Output": 5707,
          "SCRAP": 7,
          "Other": 0,
          "Yield": 99.88
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-24",
          "Input": 6352,
          "NG": 0,
          "Output": 6341,
          "SCRAP": 11,
          "Other": 0,
          "Yield": 99.83
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-25",
          "Input": 6202,
          "NG": 0,
          "Output": 6194,
          "SCRAP": 8,
          "Other": 0,
          "Yield": 99.87
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-26",
          "Input": 6486,
          "NG": 0,
          "Output": 6478,
          "SCRAP": 8,
          "Other": 0,
          "Yield": 99.88
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-27",
          "Input": 4005,
          "NG": 0,
          "Output": 4001,
          "SCRAP": 4,
          "Other": 0,
          "Yield": 99.9
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-29",
          "Input": 5394,
          "NG": 0,
          "Output": 5391,
          "SCRAP": 3,
          "Other": 0,
          "Yield": 99.94
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-11",
          "CDay": "2021-11-30",
          "Input": 5328,
          "NG": 0,
          "Output": 5320,
          "SCRAP": 8,
          "Other": 0,
          "Yield": 99.85
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-01",
          "Input": 8123,
          "NG": 0,
          "Output": 8105,
          "SCRAP": 18,
          "Other": 0,
          "Yield": 99.78
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-02",
          "Input": 6092,
          "NG": 0,
          "Output": 6084,
          "SCRAP": 8,
          "Other": 0,
          "Yield": 99.87
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-03",
          "Input": 3012,
          "NG": 0,
          "Output": 3012,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-04",
          "Input": 1142,
          "NG": 0,
          "Output": 1140,
          "SCRAP": 2,
          "Other": 0,
          "Yield": 99.82
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-06",
          "Input": 4435,
          "NG": 0,
          "Output": 4429,
          "SCRAP": 6,
          "Other": 0,
          "Yield": 99.86
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-07",
          "Input": 4340,
          "NG": 0,
          "Output": 4332,
          "SCRAP": 8,
          "Other": 0,
          "Yield": 99.82
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-08",
          "Input": 7578,
          "NG": 0,
          "Output": 7566,
          "SCRAP": 12,
          "Other": 0,
          "Yield": 99.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-09",
          "Input": 8500,
          "NG": 0,
          "Output": 8487,
          "SCRAP": 13,
          "Other": 0,
          "Yield": 99.85
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-10",
          "Input": 7215,
          "NG": 0,
          "Output": 7192,
          "SCRAP": 23,
          "Other": 0,
          "Yield": 99.68
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-11",
          "Input": 585,
          "NG": 0,
          "Output": 585,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-13",
          "Input": 3966,
          "NG": 0,
          "Output": 3962,
          "SCRAP": 4,
          "Other": 0,
          "Yield": 99.9
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-14",
          "Input": 3321,
          "NG": 0,
          "Output": 3318,
          "SCRAP": 3,
          "Other": 0,
          "Yield": 99.91
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-15",
          "Input": 5338,
          "NG": 0,
          "Output": 5334,
          "SCRAP": 4,
          "Other": 0,
          "Yield": 99.93
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-16",
          "Input": 4768,
          "NG": 0,
          "Output": 4765,
          "SCRAP": 3,
          "Other": 0,
          "Yield": 99.94
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-17",
          "Input": 4684,
          "NG": 0,
          "Output": 4680,
          "SCRAP": 4,
          "Other": 0,
          "Yield": 99.91
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-18",
          "Input": 3903,
          "NG": 0,
          "Output": 3888,
          "SCRAP": 15,
          "Other": 0,
          "Yield": 99.62
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-20",
          "Input": 1817,
          "NG": 0,
          "Output": 1817,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-21",
          "Input": 2367,
          "NG": 0,
          "Output": 2363,
          "SCRAP": 4,
          "Other": 0,
          "Yield": 99.83
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-22",
          "Input": 2368,
          "NG": 0,
          "Output": 2365,
          "SCRAP": 3,
          "Other": 0,
          "Yield": 99.87
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-23",
          "Input": 3594,
          "NG": 0,
          "Output": 3593,
          "SCRAP": 1,
          "Other": 0,
          "Yield": 99.97
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-24",
          "Input": 4296,
          "NG": 0,
          "Output": 4294,
          "SCRAP": 2,
          "Other": 0,
          "Yield": 99.95
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-25",
          "Input": 4680,
          "NG": 0,
          "Output": 4672,
          "SCRAP": 8,
          "Other": 0,
          "Yield": 99.83
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-26",
          "Input": 1407,
          "NG": 0,
          "Output": 1406,
          "SCRAP": 1,
          "Other": 0,
          "Yield": 99.93
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-27",
          "Input": 4422,
          "NG": 0,
          "Output": 4416,
          "SCRAP": 6,
          "Other": 0,
          "Yield": 99.86
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-28",
          "Input": 6387,
          "NG": 0,
          "Output": 6379,
          "SCRAP": 8,
          "Other": 0,
          "Yield": 99.87
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-29",
          "Input": 5719,
          "NG": 0,
          "Output": 5718,
          "SCRAP": 1,
          "Other": 0,
          "Yield": 99.98
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2021-12",
          "CDay": "2021-12-30",
          "Input": 3475,
          "NG": 0,
          "Output": 3472,
          "SCRAP": 3,
          "Other": 0,
          "Yield": 99.91
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-03",
          "Input": 5671,
          "NG": 0,
          "Output": 5664,
          "SCRAP": 7,
          "Other": 0,
          "Yield": 99.88
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-04",
          "Input": 4267,
          "NG": 0,
          "Output": 4263,
          "SCRAP": 4,
          "Other": 0,
          "Yield": 99.91
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-05",
          "Input": 5209,
          "NG": 0,
          "Output": 5208,
          "SCRAP": 1,
          "Other": 0,
          "Yield": 99.98
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-06",
          "Input": 9278,
          "NG": 0,
          "Output": 9274,
          "SCRAP": 4,
          "Other": 0,
          "Yield": 99.96
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-07",
          "Input": 8810,
          "NG": 0,
          "Output": 8801,
          "SCRAP": 9,
          "Other": 0,
          "Yield": 99.9
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-08",
          "Input": 11496,
          "NG": 0,
          "Output": 11481,
          "SCRAP": 15,
          "Other": 0,
          "Yield": 99.87
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-09",
          "Input": 1019,
          "NG": 0,
          "Output": 1018,
          "SCRAP": 1,
          "Other": 0,
          "Yield": 99.9
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-10",
          "Input": 2249,
          "NG": 0,
          "Output": 2249,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-11",
          "Input": 2390,
          "NG": 0,
          "Output": 2387,
          "SCRAP": 3,
          "Other": 0,
          "Yield": 99.87
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-12",
          "Input": 3140,
          "NG": 0,
          "Output": 3137,
          "SCRAP": 3,
          "Other": 0,
          "Yield": 99.9
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-13",
          "Input": 3127,
          "NG": 0,
          "Output": 3122,
          "SCRAP": 5,
          "Other": 0,
          "Yield": 99.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-14",
          "Input": 3152,
          "NG": 0,
          "Output": 3149,
          "SCRAP": 3,
          "Other": 0,
          "Yield": 99.9
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-15",
          "Input": 4817,
          "NG": 0,
          "Output": 4799,
          "SCRAP": 18,
          "Other": 0,
          "Yield": 99.63
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-17",
          "Input": 2238,
          "NG": 0,
          "Output": 2235,
          "SCRAP": 3,
          "Other": 0,
          "Yield": 99.87
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-18",
          "Input": 2425,
          "NG": 0,
          "Output": 2422,
          "SCRAP": 3,
          "Other": 0,
          "Yield": 99.88
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-19",
          "Input": 3283,
          "NG": 0,
          "Output": 3276,
          "SCRAP": 7,
          "Other": 0,
          "Yield": 99.79
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-20",
          "Input": 1938,
          "NG": 0,
          "Output": 1937,
          "SCRAP": 1,
          "Other": 0,
          "Yield": 99.95
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-21",
          "Input": 2088,
          "NG": 0,
          "Output": 2083,
          "SCRAP": 5,
          "Other": 0,
          "Yield": 99.76
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-22",
          "Input": 4261,
          "NG": 0,
          "Output": 4252,
          "SCRAP": 9,
          "Other": 0,
          "Yield": 99.79
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-24",
          "Input": 5684,
          "NG": 0,
          "Output": 5670,
          "SCRAP": 14,
          "Other": 0,
          "Yield": 99.75
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-25",
          "Input": 6954,
          "NG": 0,
          "Output": 6945,
          "SCRAP": 9,
          "Other": 0,
          "Yield": 99.87
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-26",
          "Input": 8162,
          "NG": 0,
          "Output": 8142,
          "SCRAP": 20,
          "Other": 0,
          "Yield": 99.75
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-27",
          "Input": 6397,
          "NG": 0,
          "Output": 6388,
          "SCRAP": 9,
          "Other": 0,
          "Yield": 99.86
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-01",
          "CDay": "2022-01-28",
          "Input": 5393,
          "NG": 0,
          "Output": 5387,
          "SCRAP": 6,
          "Other": 0,
          "Yield": 99.89
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-02",
          "CDay": "2022-02-07",
          "Input": 3958,
          "NG": 0,
          "Output": 3950,
          "SCRAP": 8,
          "Other": 0,
          "Yield": 99.8
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-02",
          "CDay": "2022-02-08",
          "Input": 5061,
          "NG": 0,
          "Output": 5048,
          "SCRAP": 13,
          "Other": 0,
          "Yield": 99.74
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-02",
          "CDay": "2022-02-09",
          "Input": 7638,
          "NG": 0,
          "Output": 7626,
          "SCRAP": 12,
          "Other": 0,
          "Yield": 99.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-02",
          "CDay": "2022-02-10",
          "Input": 8981,
          "NG": 0,
          "Output": 8963,
          "SCRAP": 18,
          "Other": 0,
          "Yield": 99.8
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-02",
          "CDay": "2022-02-11",
          "Input": 8420,
          "NG": 0,
          "Output": 8403,
          "SCRAP": 17,
          "Other": 0,
          "Yield": 99.8
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-02",
          "CDay": "2022-02-12",
          "Input": 7709,
          "NG": 0,
          "Output": 7688,
          "SCRAP": 21,
          "Other": 0,
          "Yield": 99.73
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-02",
          "CDay": "2022-02-13",
          "Input": 2063,
          "NG": 0,
          "Output": 2058,
          "SCRAP": 5,
          "Other": 0,
          "Yield": 99.76
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-02",
          "CDay": "2022-02-14",
          "Input": 4252,
          "NG": 0,
          "Output": 4245,
          "SCRAP": 7,
          "Other": 0,
          "Yield": 99.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-02",
          "CDay": "2022-02-15",
          "Input": 4436,
          "NG": 0,
          "Output": 4423,
          "SCRAP": 13,
          "Other": 0,
          "Yield": 99.71
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-02",
          "CDay": "2022-02-16",
          "Input": 7348,
          "NG": 0,
          "Output": 7337,
          "SCRAP": 11,
          "Other": 0,
          "Yield": 99.85
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-02",
          "CDay": "2022-02-17",
          "Input": 3148,
          "NG": 0,
          "Output": 3143,
          "SCRAP": 5,
          "Other": 0,
          "Yield": 99.84
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-03",
          "CDay": "2022-03-25",
          "Input": 2,
          "NG": 0,
          "Output": 2,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-04",
          "CDay": "2022-04-27",
          "Input": 2,
          "NG": 0,
          "Output": 2,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-04",
          "CDay": "2022-04-29",
          "Input": 1,
          "NG": 0,
          "Output": 1,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-05",
          "CDay": "2022-05-13",
          "Input": 6,
          "NG": 0,
          "Output": 6,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-08",
          "CDay": "2022-08-26",
          "Input": 1,
          "NG": 0,
          "Output": 1,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-09",
          "CDay": "2022-09-01",
          "Input": 8,
          "NG": 0,
          "Output": 8,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-09",
          "CDay": "2022-09-02",
          "Input": 26,
          "NG": 0,
          "Output": 26,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-09",
          "CDay": "2022-09-05",
          "Input": 5,
          "NG": 0,
          "Output": 5,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-09",
          "CDay": "2022-09-06",
          "Input": 1,
          "NG": 0,
          "Output": 1,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-09",
          "CDay": "2022-09-07",
          "Input": 2,
          "NG": 0,
          "Output": 2,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-09",
          "CDay": "2022-09-09",
          "Input": 3,
          "NG": 0,
          "Output": 3,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-09",
          "CDay": "2022-09-16",
          "Input": 7,
          "NG": 3,
          "Output": 4,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 57.14
        },
        {
          "StationTypeID": 3,
          "StationType": "HW",
          "CMonth": "2022-09",
          "CDay": "2022-09-20",
          "Input": 2,
          "NG": 0,
          "Output": 2,
          "SCRAP": 0,
          "Other": 0,
          "Yield": 100
        }
      ],
      chartItems: {}
    }
  },
  mounted() {
    // 注：可以使用数组方式接收 方便控制多个
    // this.timer = this.handleScroll('GaugeContent', 'transformScrollSwitch')
    /*  let that = this
     setInterval(function () {
       that.value2 += 5
     }, 50) */
     console.log(this.$attrs)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    tComponent() {
      console.log('tComponent')
    },
    test() {
      this.$refs.XPrint.show()
      /* let obj = {};
      this.list1.forEach(item => {
        if (obj[item.StationType]) {
          obj[item.StationType].push(item)
        } else {
          obj[item.StationType] = [item]
        }
      })
      console.log(obj) */
    },
    test1(list) {
      if (!Array.isArray(list)) return;
      let obj = {}
      this.list.forEach(item => {
        if (obj[item.ProjectName]) {
          obj[item.ProjectName].push(item)
        } else {
          obj[item.ProjectName] = [item]
        }
      })
      Object.keys(obj).forEach(key => {
        obj[key] = this.formatArrayToObject(obj[key])
      })
      console.log(obj)
      this.items = obj
      return obj
    },

    formatArrayToObject(arr) {
      if (!Array.isArray(arr)) return
      let obj = {}
      arr.forEach(item => {
        Object.keys(item).forEach(key => {
          if (key != 'StationType' && key != 'ProjectIcon') {
            obj[item.StationType + '_' + key] = item[key]
          } else if (key === 'ProjectIcon') {
            obj[key] = item[key]
          }
        })
      })
      return obj
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    // id + key 可同时多个使用
    handleScroll(id, key) {
      let that = this;
      let sLen = 0
      let pScroll = document.querySelector('#' + id)
      // if (!pScroll.scrollLeft) return null;
      if (that[id + key]) {
        clearInterval(that[id + key])
      }
      that[id + key] = setInterval(async function () {
        !pScroll && (pScroll = document.querySelector('#' + id))
        sLen = pScroll.scrollLeft
        if (that[key]) {
          pScroll.scrollLeft += 1
          if (pScroll.scrollLeft <= sLen) {
            await that.sleep(1000 * 3)
            that[key] = false
          }
        } else {

          pScroll.scrollLeft -= 1
          if (pScroll.scrollLeft <= 0) {
            await that.sleep(1000 * 3)
            that[key] = true
          }
        }
      }, 50)

      return that[id + key]
    }

  }

}
</script>
<style scoped lang="scss">
.test {
  background-color: var(--themeColor, $base-color-default)
}

.main_content {
  background: #fff;
  height: inherit;
  overflow-y: auto;

  .flex {
    // width: 450px;
    // height: 150px;
    border: 1px solid blue;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .flex-item {
    width: 90px;
    height: 90px;
    line-height: 90px;
    margin: 10px;
    font-size: 10px;
    text-align: center;
    background-color: orange;
  }



  .gauge {
    height: 350px;
    // border: 1px solid #ccc;
    margin: 0 0 5px 0;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 1px 1px 2px #eee, 0 0 25px #efefef, 0 0 5px #185bff;

    .gauge_content {
      overflow: hidden;
      height: inherit;
      white-space: nowrap;
      box-sizing: border-box;

      &>div {
        display: inline-block;
        height: 92%;
        width: 300px;
        border: 1px solid #eee;
        margin: 10px 5px;
      }
    }
  }
}
</style>
