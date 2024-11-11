<template>
  <div v-if="IsLegalPage" class="warehouse_out">
    <z-column direction="row" :min="5" :max="300" :pane-length-percent.sync="paneLengthPercent" :is-show-down="isUnfold"
      :title-style="{ width: '5px' }" style="width: 100%">
      <div slot="one" style="height: 100%; width: 100%; min-width: 300px; overflow: hidden; display: flex;">
        <el-container>
          <el-header style="height: auto;">
            <el-row :gutter="1" style="height: auto; padding: 10px; 0">
              <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="BillNo" style="padding: 0; margin: 0;">
                    <el-input ref="BillNoSN" v-model="form.S_BillNo" :disabled="billDisabled"
                      @keypress.native.enter="handleBillNo(form.S_BillNo)">
                      <template slot="append">
                        <el-button style="width: 106px" type="warning" @click="handleReset">重置</el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="margin: 5px 0">
                  <el-form-item label="MultipackSN" style="padding: 0; margin: 0;">
                    <el-input ref="MultipackSN" v-model="form.S_BoxSN" :disabled="boxDisabled"
                      @keypress.native.enter="handleBoxSN(form.S_BoxSN)">
                      <template slot="append">
                        <el-checkbox v-model="checked">反出库</el-checkbox>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <div style="height: 32px; line-height: 32px; padding: 0 15px; user-select: none; text-align: right;">
                    <span>Total Box: <span style="font-weight: 700; font-size:16px"> {{ total }} </span> </span>
                    <span style="margin: 0 20px;">Reciepted: <span style="font-weight: 700; font-size:16px">{{ reciepted
                    }}</span></span>
                    <span>UnReciepted: <span style="font-weight: 700; font-size:16px">{{ total - reciepted
                    }}</span></span>
                  </div>
                </el-col>
              </el-form>
            </el-row>
          </el-header>
          <el-main>
            <z-row direction="column" :min="5" :pane-length-percent.sync="paneLengthPercent2" :title="$t('message')"
              :title-style="{ 'line-height': '22px' }">
              <div slot="one" style="padding: 0; margin: 0; height: 100%;">
                <el-table :data="tableData" style="width: 100%;" border height="100%" size="mini">
                  <el-table-column prop="NO" label="NO." width="50">
                  </el-table-column>
                  <el-table-column prop="PalletID" label="PalletID" min-width="100" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="SerialNumber" label="SerialNumber" min-width="120" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="isReceipt" label="isReceipt" min-width="80">
                    <template slot-scope="scope">
                      <i v-if="scope.row.isReceipt == '1'" class="el-icon-success"
                        style="color: #047734; font-size: 24px"></i>
                      <i v-else class="el-icon-error" style="font-size: 24px"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ReceiptDate" label="ReceiptDate" min-width="120" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="isShipping" label="isShipping" min-width="90">
                    <template slot-scope="scope">
                      <i v-if="scope.row.isShipping == '1'" class="el-icon-success"
                        style="color: #047734; font-size: 24px"></i>
                      <i v-else class="el-icon-error" style="font-size: 24px"></i>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ShippingDate" label="ShippingDate" min-width="120" show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </div>
              <div slot="two" style="height: 100%; ">
                <div class="msg_box">
                  <div class="show_hint">
                    <div>
                      <p v-for="(item, index) in hintInfos" :key="index"
                        :class="item.result == 'error' ? 'danger_info' : 'success_info'">
                        {{ item.msg }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </z-row>
          </el-main>
        </el-container>

      </div>
      <div slot="two" style="height: inherit; background-color: #fff; ">
        <div class="right_detail" style="overflow: hidden; position: absolute; right: 0; width: 100%; height: inherit;">
          <el-table :data="tableData2" style="width: inherit;" border height="calc(100% - 24px)" size="mini">
            <!--   <el-table-column prop="LineItem" label="LineItem" min-width="80" show-overflow-tooltip>
            </el-table-column> -->
            <el-table-column prop="FKPONO" label="KPO#" min-width="80" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="FMPNNO" label="MPN" min-width="80" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="FCTN" label="CTN" min-width="50" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="FOutSN" label="OutSN" min-width="60" show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </z-column>
  </div>
</template>

<script>
import ZColumn from 'z-layouts/ZColumn.vue'
import ZRow from 'z-layouts/ZRow.vue'
import {
  DG_GetPageInitialize,
  DG_WHOut,
  DG_CheckBillNo
} from '@/api/application.js'
/*
4914057345-0622423003-1

00008859096853901483
00008859096853901506
00008859096853901513
00008859096853901520
00008859096853901544
00008859096853901582
00008859096853901278
00008859096853901742
00008859096853901681
00008859096853901667
00008859096853902077
00008859096853901766
00008859096853901780
00008859096853901797
00008859096853901803
00008859096853901810
00008859096853901858
00008859096853901865
00008859096853901896
00008859096853901902
00008859096853901926
00008859096853901933
00008859096853901940
00008859096853901971
00008859096853901650
00008859096853901643
00008859096853903890
00008859096853903883
00008859096853904491
00008859096853904286
00008859096853905078
00008859096853904972
00008859096853905146
00008859096853906020
00008859096853906501
00008859096853906495
00008859096853956520
00008859096853956681
00008859096853956780
00008859096853956810
00008859096853955554
00008859096853955530
00008859096853959545
00008859096854028769
00008859096854028783
00008859096854028776
00008859096854028806
00008859096854028820
00008859096854028837
00008859096854028684
00008859096854028691
00008859096854028707
00008859096854028639
00008859096854028622
00008859096854028592
00008859096854028585
00008859096854028578
00008859096854028554
00008859096854028530
00008859096854028417
00008859096854028448
00008859096854028455
00008859096854023726
00008859096854023733
00008859096854023658
00008859096854023665
00008859096854023559
00008859096854023566
00008859096854023573
00008859096854023610
00008859096854023627
00008859096854023481
00008859096854023474
00008859096854032155
00008859096854032148
00008859096854032193
00008859096854032247
00008859096854031967
00008859096854031950
00008859096854032100
00008859096854190619
00008859096854190312
00008859096854190091
00008859096854190053
00008859096854190046
00008859096854191135
00008859096854187992
00008859096854188074
00008859096854188241
00008859096854190862
00008859096854188319
00008859096854188302
00008859096854188449
00008859096854188579
00008859096854188593
00008859096854188623
00008859096854188654
00008859096854188708
00008859096854184885
00008859096854185806
00008859096854186094
00008859096854189996
00008859096854189941
00008859096854189965
00008859096854189958
00008859096854479707
00008859096854480154
00008859096854480383
00008859096854480482
00008859096854480536
00008859096854480581
00008859096854480574
00008859096854480697
00008859096854480635
00008859096854480703
00008859096854480642
00008859096854484817
00008859096854484831
00008859096854484855
00008859096854484879
00008859096854485104
00008859096854485074
00008859096854485098
00008859096854485050
00008859096854485043
00008859096854547215
00008859096854547741
00008859096854547765
00008859096854547789
00008859096854547796
00008859096854547987
00008859096854548014
00008859096854548038
00008859096854548076
00008859096854548168
00008859096854548182
00008859096854546515
00008859096854546553
00008859096854546577
00008859096854582391
00008859096854625906
00008859096854625920
00008859096854625784
00008859096854625791

*/
export default {
  name: 'DGWarehouseOut',
  components: {
    ZRow,
    ZColumn
  },
  data() {
    return {
      title: '东莞出库',
      isUnfold: true,
      paneLengthPercent: 64,
      paneLengthPercent1: 28,
      paneLengthPercent2: 75,
      form: {
        S_MPN: '',
        S_BillNo: '',
        S_BoxSN: '',
        S_Type: '0'
      },
      tableData: [],
      tableData2: [],
      hintInfos: [],
      total: 0,
      reciepted: 0,
      IsLegalPage: false,
      ApplicationType: '',
      checked: false,
      billDisabled: false,
      boxDisabled: true,
       /* list: [
         '00008859096854625906',
         '00008859096854625920',
         '00008859096854625784',
         '00008859096854625791',
         '00008859096854548168',
         '00008859096854548182',
         '00008859096854546515',
         '00008859096854546553',
       ] */
     /*  list: [
        '00008859096853901483',
        '00008859096853901506',
        '00008859096853901513',
        '00008859096853901520',
        '00008859096853901544',
        '00008859096853901582',
        '00008859096853901278',
        '00008859096853901742',
        '00008859096853901681',
        '00008859096853901667',
        '00008859096853902077',
        '00008859096853901766',
        '00008859096853901780',
        '00008859096853901797',
        '00008859096853901803',
        '00008859096853901810',
        '00008859096853901858',
        '00008859096853901865',
        '00008859096853901896',
        '00008859096853901902',
        '00008859096853901926',
        '00008859096853901933',
        '00008859096853901940',
        '00008859096853901971',
        '00008859096853901650',
        '00008859096853901643',
        '00008859096853903890',
        '00008859096853903883',
        '00008859096853904491',
        '00008859096853904286',
        '00008859096853905078',
        '00008859096853904972',
        '00008859096853905146',
        '00008859096853906020',
        '00008859096853906501',
        '00008859096853906495',
        '00008859096853956520',
        '00008859096853956681',
        '00008859096853956780',
        '00008859096853956810',
        '00008859096853955554',
        '00008859096853955530',
        '00008859096853959545',
        '00008859096854028769',
        '00008859096854028783',
        '00008859096854028776',
        '00008859096854028806',
        '00008859096854028820',
        '00008859096854028837',
        '00008859096854028684',
        '00008859096854028691',
        '00008859096854028707',
        '00008859096854028639',
        '00008859096854028622',
        '00008859096854028592',
        '00008859096854028585',
        '00008859096854028578',
        '00008859096854028554',
        '00008859096854028530',
        '00008859096854028417',
        '00008859096854028448',
        '00008859096854028455',
        '00008859096854023726',
        '00008859096854023733',
        '00008859096854023658',
        '00008859096854023665',
        '00008859096854023559',
        '00008859096854023566',
        '00008859096854023573',
        '00008859096854023610',
        '00008859096854023627',
        '00008859096854023481',
        '00008859096854023474',
        '00008859096854032155',
        '00008859096854032148',
        '00008859096854032193',
        '00008859096854032247',
        '00008859096854031967',
        '00008859096854031950',
        '00008859096854032100',
        '00008859096854190619',
        '00008859096854190312',
        '00008859096854190091',
        '00008859096854190053',
        '00008859096854190046',
        '00008859096854191135',
        '00008859096854187992',
        '00008859096854188074',
        '00008859096854188241',
        '00008859096854190862',
        '00008859096854188319',
        '00008859096854188302',
        '00008859096854188449',
        '00008859096854188579',
        '00008859096854188593',
        '00008859096854188623',
        '00008859096854188654',
        '00008859096854188708',
        '00008859096854184885',
        '00008859096854185806',
        '00008859096854186094',
        '00008859096854189996',
        '00008859096854189941',
        '00008859096854189965',
        '00008859096854189958',
        '00008859096854479707',
        '00008859096854480154',
        '00008859096854480383',
        '00008859096854480482',
        '00008859096854480536',
        '00008859096854480581',
        '00008859096854480574',
        '00008859096854480697',
        '00008859096854480635',
        '00008859096854480703',
        '00008859096854480642',
        '00008859096854484817',
        '00008859096854484831',
        '00008859096854484855',
        '00008859096854484879',
        '00008859096854485104',
        '00008859096854485074',
        '00008859096854485098',
        '00008859096854485050',
        '00008859096854485043',
        '00008859096854547215',
        '00008859096854547741',
        '00008859096854547765',
        '00008859096854547789',
        '00008859096854547796',
        '00008859096854547987',
        '00008859096854548014',
        '00008859096854548038',
        '00008859096854548076',
        '00008859096854548168',
        '00008859096854548182',
        '00008859096854546515',
        '00008859096854546553',
        '00008859096854546577',
        '00008859096854582391',
        '00008859096854625906',
        '00008859096854625920',
        '00008859096854625784',
        '00008859096854625791',
      ] */
    }
  },
  watch: {
    checked: function (val, oval) {
      if (val) {
        this.$set(this.form, 'S_Type', '1')
      } else {
        this.$set(this.form, 'S_Type', '0')
      }
    }
  },
  created() {
    this.handleInitPage()
  },
  methods: {
    handleReset() {
      this.billDisabled = false;
      this.boxDisabled = true;
      this.checked = false
      this.tableData = [];
      this.tableData2 = [];
      this.$set(this.form, 'S_BillNo', '')
      this.$set(this.form, 'S_BoxSN', '')
    },
    handleBillNo(val) {
      DG_CheckBillNo({ S_BillNo: val, S_Result: '' }).then(res => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.hintInfos.unshift({
              msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${val} ${res.ResultMsg}`,
              result: 'success'
            })
            this.tableData2 = [...data]
            this.billDisabled = true;
            this.boxDisabled = false;
            this.$nextTick(function () {
              this.$refs.MultipackSN.focus()
            })

          } else {
            this.hintInfos.unshift({
              msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${val} ${res.ResultMsg}`,
              result: 'error'
            })
            this.$set(this.form, 'S_BillNo', '')
          }
        } catch (error) {
          this.hintInfos.unshift({
            msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${val} ${error.toString()}`,
            result: 'error',
          })
        } finally {
          if (res.Sounds === 'OK') {
            document.querySelector('#OKPlay').play()
          } else if (res.Sounds === 'RE') {
            document.querySelector('#REPlay').play()
          } else {
            document.querySelector('#NGPlay').play()
          }
          // debugger
          //测试循环
          /* if (this.list.length > 0) {
            this.$set(this.form, 'S_BoxSN', this.list.shift())
            this.handleBoxSN(this.form.S_BoxSN)
          } */
        }
      }, (error) => {
        document.querySelector('#NGPlay').play()
        this.hintInfos.unshift({
          msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${val} ${error.toString()}`,
          result: 'error',
        })
      })
    },
    handleBoxSN(val) {
      let params = JSON.parse(JSON.stringify(this.form))
      DG_WHOut(params).then(res => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.hintInfos.unshift({
              msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${val} ${res.ResultMsg}`,
              result: 'success'
            })
            this.total = data.WH_OutCount[0].LCount
            this.reciepted = data.LCountS
            this.tableData = [...data.WH_OutGrid]
            this.tableData2 = [...data.POMPN];

            //BillNo 循环
            if (!this.tableData2.some(res => res.FCTN != res.FOutSN)) {
              this.$set(this.form, 'S_BillNo', '')
              this.billDisabled = false;
              this.boxDisabled = true;
              this.total = 0;
              this.reciepted = 0;
              this.tableData = []
              this.tableData2 = []
              this.$nextTick(function () {
                this.$refs.BillNoSN.focus()
              })
            }
          } else {
            this.hintInfos.unshift({
              msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${val} ${res.ResultMsg}`,
              result: 'error'
            })
          }
        } catch (error) {
          this.hintInfos.unshift({
            msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${val} ${error.toString()}`,
            result: 'error',
          })
        } finally {
          this.$set(this.form, 'S_BoxSN', '')
          if (res.Sounds === 'OK') {
            document.querySelector('#OKPlay').play()
          } else if (res.Sounds === 'RE') {
            document.querySelector('#REPlay').play()
          } else {
            document.querySelector('#NGPlay').play()
          }
         /*  if (this.list.length > 0) {
            this.$set(this.form, 'S_BoxSN', this.list.shift())
            this.handleBoxSN(this.form.S_BoxSN)
          } */
        }
      }, (error) => {
        document.querySelector('#NGPlay').play()
        this.hintInfos.unshift({
          msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${val} ${error.toString()}`,
          result: 'error',
        })
      })
    },
    handleInitPage() {
      DG_GetPageInitialize({ S_URL: this.$route.path }).then(res => {
        try {
          let data = res.ResData[0]
          if (res.Success && data) {
            this.IsLegalPage = data.IsLegalPage == '1' ? true : false;
            this.ApplicationType = data.ApplicationType
            if (!this.IsLegalPage) {
              this.$message({
                message: this.$t("TheSelectedPageDoesNotMatchTheSite"),
                type: "warning",
                showClose: true,
              });
            }
          }
        } catch (err) {
          this.$message.error(err);
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.warehouse_out {
  height: inherit;
  background-color: #fff;
  display: flex;

  .el-container {
    .el-header {
      height: auto;
    }

    .el-main {
      margin: 0;
      padding: 0;
    }
  }

  ::v-deep {
    .pane_two_row {
      overflow-y: auto;
    }
  }

  .right_detail {
    &::before {
      display: block;
      content: 'Multipack Detail';
      height: 24px;
      line-height: 24px;
      text-align: left;
      padding-left: 10px;
      background-color: #ccc;
      font-weight: 700
    }
  }

  .msg_box {
    overflow: hidden;
    height: inherit;
    box-sizing: border-box;
    position: relative;
    z-index: 100;
    background-color: #fff;

    .show_hint {
      height: inherit;
      box-sizing: border-box;
      display: flex;
      overflow: auto;

      &>div {
        flex: 1;
        height: 0;
        width: 0;
        display: block;

        p {
          padding: 0 0 5px 5px
        }
      }

      .success_info {
        color: #85ce61;
      }

      .danger_info {
        color: #f56c6c;
      }

      p {
        padding: 0;
        margin: 0;
      }
    }
  }
}
</style>
