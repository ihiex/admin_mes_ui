<template>
  <div v-loading="loading" class="app_container">
    <z-query ref="ZQuery" v-model.trim="form.Keywords" style="height: inherit;" :show-add="false" :show-fold="false"
      :total="total" :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" @search="handleSearch"
      @reset="handleReset">
      <el-button slot="button" :icon="downLoading ? 'el-icon-loading' : 'el-icon-download'" :disabled="downLoading"
        @click="handleExport">{{ $t('export') }}</el-button>
      <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('StartDateTime')">
                <el-date-picker v-model="form.StartTime" type="datetime" style="width: 100%;"
                  :placeholder="$t('optionDate')" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('EndDateTime')">
                <el-date-picker v-model="form.EndTime" type="datetime" style="width: 100%;"
                  :placeholder="$t('optionDate')" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('HAWB')">
                <el-input v-model.trim="form.HAWB" :placeholder="$t('pleaseInput')" clearable
                  @keypress.native.enter="handleSearch">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('BillNo')">
                <el-input v-model.trim="form.BillNO" :placeholder="$t('pleaseInput')" clearable
                  @keypress.native.enter="handleSearch">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('PalletSN')">
                <el-input v-model.trim="form.PalletSN" :placeholder="$t('pleaseInput')" clearable
                  @keypress.native.enter="handleSearch">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('BoxSN')">
                <el-input v-model.trim="form.Box_SN" :placeholder="$t('pleaseInput')" clearable
                  @keypress.native.enter="handleSearch">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="hidden-sm-and-up">
              <el-form-item :label="$t('keywords')">
                <el-input v-model.trim="form.Keywords" :placeholder="$t('keywords')" clearable
                  @keypress.native.enter="handleSearch">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="table" style="height: 100%;">
        <el-table :data="tableData" style="width: 100%;" border height="100%">
          <el-table-column prop="ID" label="ID" sortable width="90"></el-table-column>
          <el-table-column prop="HAWB" :label="$t('HAWB')" sortable show-overflow-tooltip
            min-width="150"></el-table-column>
          <el-table-column prop="BillNO" :label="$t('BillNo')" sortable show-overflow-tooltip
            min-width="250"></el-table-column>
          <el-table-column prop="PalletSN" :label="$t('PalletSN')" sortable show-overflow-tooltip
            min-width="180"></el-table-column>
          <el-table-column prop="Box_SN" :label="$t('BoxSN')" sortable show-overflow-tooltip
            min-width="180"></el-table-column>
          <el-table-column prop="FG_SN" :label="$t('FGSN')" sortable show-overflow-tooltip
            min-width="150"></el-table-column>
          <el-table-column prop="PurchaseOrderNumber" :label="$t('PurchaseOrderNumber')" sortable show-overflow-tooltip
            min-width="140"></el-table-column>
          <el-table-column prop="MPN" :label="$t('MPN')" sortable show-overflow-tooltip min-width="140"></el-table-column>
          <el-table-column prop="ShipmentWeight" :label="$t('ShipmentWeight')" sortable show-overflow-tooltip
            min-width="160"></el-table-column>
          <el-table-column prop="CreateTime" :label="$t('createTime')" sortable show-overflow-tooltip
            min-width="160"></el-table-column>
          <el-table-column prop="SAPGet" :label="$t('SAPGet')" sortable align="center" show-overflow-tooltip
            min-width="100">
            <template slot-scope="scope">
              <i :class="scope.row.SAPGet === 'X' ? 'el-icon-check' : 'el-icon-loading'"></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </z-query>
  </div>
</template>

<script>
import ZQuery from '@/components/configQuery/ZQuery.vue'
import { SAPShipManifestDataFindWithPagerLikeAsync, SAPShipManifestDataFindExportCSVAsync } from '@/api/application.js'
import { pageSize } from '@/config'
import { downloadFile } from '@/utils'


// SAP出货导出
export default {
  name: 'SAPShipManifestData',
  components: {
    ZQuery,
  },
  data() {
    return {
      title: 'SAP出货导出',
      form: {
        "CurrentPageIndex": 1,
        "PageSize": pageSize,
        "RecordCount": 0,
        "Keywords": "",
        "EnCode": "",
        "Order": "", //排序字段 未起用 (要求使用ui表格的排序)
        "Sort": "", //asc /desc
        "StartTime": new Date().format('yyyy-MM-dd 00:00:00'),
        "EndTime": new Date().format('yyyy-MM-dd hh:mm:ss'),
        "HAWB": "",
        "BillNO": "",
        "PurchaseOrderNumber": "",
        "PalletSN": "",
        "Box_SN": "",
        "FG_SN": ""
      },
      total: 0,
      tableData: [],
      loading: false,
      downLoading: false
    }
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    handleExport() {
      // this.$message('开发中...')
      // console.log('export')
       let params = {}
       Object.keys(this.form).forEach(key => {
         if (Array.isArray(this.form[key])) {
           params[key] = this.form[key].join(',')
         } else {
           params[key] = this.form[key]
         }
       })
       this.downLoading = true;
      //  delete params.CurrentPageIndex
      //  delete params.PageSize
       SAPShipManifestDataFindExportCSVAsync(params).then(res => {
         let url = res.ResData
         if (res.Success && url) {
           downloadFile(
             url,
             url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))
           )
         }
         this.downLoading = false;
       }, error => {
         this.downLoading = false;
       }).catch(error => {
         this.downLoading = false;
       })
    },
    handleReset() {
      Object.keys(this.form).forEach(key => {
        if (key !== 'PageSize' && key !== 'CurrentPageIndex') {
          if (Array.isArray(this.form[key])) {
            this.$set(this.form, key, [])
          } else {
            this.$set(this.form, key, '')
          }
        }
      })
      this.$set(this.form, 'StartTime', new Date().format('yyyy-MM-dd 00:00:00'))
      this.$set(this.form, 'EndTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
    },
    handleSearch(item) {
      if (item && JSON.stringify(item) != '{}') {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
      } else {
        this.$set(this.form, 'CurrentPageIndex', 1);
      }
      this.getData();
    },

    getData() {
      this.loading = true
      SAPShipManifestDataFindWithPagerLikeAsync(this.form).then(res => {
        this.loading = false
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.tableData = [...data.Items];
            this.total = data.TotalItems
          }
        } catch (error) {
          this.$message.error(error.toString())
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.app_container {}
</style>
