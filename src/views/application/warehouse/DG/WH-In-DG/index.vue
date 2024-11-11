<template>
  <div v-if="IsLegalPage" class="warehouse_in">
    <el-container>
      <el-header style="height: auto;">
        <el-row :gutter="1" style="height: auto; padding: 10px; 0">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
              <el-form-item label="BoxSN" style="padding: 0; margin: 0;">
                <el-input v-model.trim="form.S_BoxSN" autofocus @keypress.native.enter="handleBoxSNEnter(form.S_BoxSN)">
                  <template slot="append">
                    <el-checkbox v-model="form.checked">反入库</el-checkbox>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <div style="height: 32px; line-height: 32px; padding: 0 15px; user-select: none; text-align: right;">
              <span>Total Box: <span style="font-weight: 700; font-size:16px"> {{ total }} </span> </span>
              <span style="margin: 0 20px;">Reciepted: <span style="font-weight: 700; font-size:16px">{{ reciepted
              }}</span></span>
              <span>UnReciepted: <span style="font-weight: 700; font-size:16px">{{ total - reciepted }}</span></span>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <z-row direction="column" :min="5" :pane-length-percent.sync="paneLengthPercent" :title="$t('message')"
          :title-style="{ 'line-height': '22px' }">
          <div slot="one" style="padding: 0; margin: 0; height: 100%;">
            <el-table :data="tableData" style="width: 100%;" border height="100%" size="mini">
              <el-table-column prop="PalletID" label="PalletID" min-width="80">
              </el-table-column>
              <el-table-column prop="SerialNumber" label="SerialNumber" min-width="120">
              </el-table-column>
              <el-table-column prop="isReceipt" label="isReceipt" min-width="60">
                <template slot-scope="scope">
                  <i v-if="scope.row.isReceipt == '1'" class="el-icon-success"
                    style="color: #047734; font-size: 24px"></i>
                  <i v-else class="el-icon-error"></i>
                </template>
              </el-table-column>
              <el-table-column prop="ReceiptDate" label="ReceiptDate" min-width="150">
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
</template>

<script>
import ZRow from 'z-layouts/ZRow.vue'
import {
  DG_GetPageInitialize,
  DG_WHIn
} from '@/api/application.js'

/*
00008859096854963244
00008859096854963343
00008859096854963336
00008859096854963329
00008859096854963312
00008859096854963305
00008859096854963299
00008859096854963282
00008859096854963435
00008859096854963411
00008859096854963404
00008859096854963381
00008859096854963374
00008859096854963367
00008859096854963350
00008859096854963541
00008859096854963497
00008859096854963480
00008859096854963473
00008859096854963466
00008859096854963459
00008859096854963442
00008859096854963169
00008859096854963176
00008859096854963008
00008859096854963183
00008859096854962995
00008859096854963015
00008859096854963022
00008859096854963039
00008859096854963046
00008859096854963053

*/
export default {
  name: 'DGWarehouseIn',
  components: {
    ZRow
  },
  data() {
    return {
      title: '东莞入库',
      form: {
        S_MPN: '',
        S_BoxSN: '',
        S_Type: '0',
        checked: false,
      },
      total: 0,
      reciepted: 0,
      tableData: [],
      paneLengthPercent: 70,
      hintInfos: [],
      IsLegalPage: false,
      ApplicationType: '',
    }
  },
  watch: {
    'form.checked': function (val, oval) {
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
    handleBoxSNEnter(val) {
      let params = JSON.parse(JSON.stringify(this.form))
      params.checked && delete params.checked
      DG_WHIn(params).then(res => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.hintInfos.unshift({
              msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${val} ${res.ResultMsg}`,
              result: 'success'
            })
            this.total = data.WH_InCount[0].LCount
            this.tableData = [...data.WH_InGrid]
            this.reciepted = data.LCountS
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
  },
}
</script>

<style lang="scss" scoped>
.warehouse_in {
  height: inherit;
  background-color: #fff;
  display: flex;

  .el-header {
    height: auto;
  }

  .el-main {
    margin: 0;
    padding: 0;
  }

  ::v-deep {
    .pane_two_row {
      overflow-y: auto;
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
