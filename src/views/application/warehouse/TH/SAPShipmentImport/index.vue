<template>
  <div v-loading="loading" class="app_container">
    <z-query ref="ZQuery" v-model.trim="form.Keywords" style="height: inherit;" :show-add="false" :show-fold="false"
      :total="total" :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" @search="handleSearch"
      @reset="handleReset">
      <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('StartDateTime')">
                <el-date-picker v-model="form.StartTime" type="date" style="width: 100%;" :placeholder="$t('optionDate')">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('EndDateTime')">
                <el-date-picker v-model="form.EndTime" type="date" style="width: 100%;" :placeholder="$t('optionDate')">
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
              <el-form-item :label="$t('Project')">
                <el-input v-model.trim="form.Project" :placeholder="$t('pleaseInput')" clearable
                  @keypress.native.enter="handleSearch">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('PO')">
                <el-input v-model.trim="form.PO" :placeholder="$t('pleaseInput')" clearable
                  @keypress.native.enter="handleSearch">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('import') + $t('Status')">
                <!-- :collapse-tags="true" multiple -->
                <el-select v-model="form.import" :placeholder="$t('pleaseSelect')" :reserve-keyword='true'
                  style="width: 100%;" filterable clearable>
                  <el-option v-for="item in importOptions" :key="item.Key" :label="item.Value" :value="item.Key">
                    <div class="select_option">
                      <span>{{ item.Value }}</span>
                      <span>{{ item.Key }}</span>
                    </div>
                  </el-option>
                </el-select>
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
          <el-table-column prop="Project" :label="$t('Project')" sortable width="90"></el-table-column>
          <el-table-column prop="HAWB" :label="$t('HAWB')" sortable show-overflow-tooltip
            min-width="100"></el-table-column>
            <el-table-column prop="ShipDate" :label="$t('ShipDate')" sortable show-overflow-tooltip
            min-width="160"></el-table-column>
          <el-table-column prop="PO" :label="$t('PO')" sortable show-overflow-tooltip min-width="100"></el-table-column>
          <el-table-column prop="LineItem" :label="$t('LineItem')" sortable show-overflow-tooltip
            min-width="120"></el-table-column>
          <el-table-column prop="PartNumber" :label="$t('PartNumber')" sortable show-overflow-tooltip
            min-width="130"></el-table-column>
          <el-table-column prop="QTY" :label="$t('quantity')" sortable show-overflow-tooltip
            min-width="100"></el-table-column>
          <el-table-column prop="CartonQTY" :label="$t('CartonQTY')" sortable show-overflow-tooltip
            min-width="120"></el-table-column>
          <el-table-column prop="Region" :label="$t('Region')" sortable show-overflow-tooltip
            min-width="100"></el-table-column>
          <el-table-column prop="Carrier" :label="$t('Carrier')" sortable show-overflow-tooltip
            min-width="110"></el-table-column>
          <el-table-column prop="HubCode" :label="$t('HubCode')" sortable show-overflow-tooltip
            min-width="110"></el-table-column>
          <el-table-column prop="import" :label="$t('import') + $t('Status')" sortable show-overflow-tooltip
            min-width="110">
            <template slot-scope="scope">
              <i v-if="scope.row.import === 0" class="el-icon-question"></i>
              <i v-else-if="scope.row.import === 1" class="el-icon-info"></i>
              <i v-else-if="scope.row.import === 2" class="el-icon-success" style="color: green;"></i>
              <i v-else-if="scope.row.import === 3" class="el-icon-warning" style="color: red;"></i>
              {{ getImportDesc(scope.row.import) }}
            </template>
          </el-table-column>

        </el-table>
      </div>
    </z-query>
  </div>
</template>

<script>
import ZQuery from '@/components/configQuery/ZQuery.vue'
import { SAPShipmentImportFindWithPagerLikeAsync, GetSAPDataState } from '@/api/application.js'
import { pageSize } from '@/config'

// SAP出货导入
export default {
  name: 'SAPShipmentImport',
  components: {
    ZQuery,
  },
  data() {
    let d = new Date();
    d.setDate(d.getDate() - 1)
    return {
      title: 'SAP出货导入',
      form: {
        "CurrentPageIndex": 1,
        "PageSize": pageSize,
        "RecordCount": 0,
        "Keywords": "",
        "EnCode": "",
        "Order": "", //排序字段 未起用 (要求使用ui表格的排序)
        "Sort": "", //asc /desc
        "StartTime": d.format('yyyy-MM-dd'),
        "EndTime": new Date().format('yyyy-MM-dd'),
        "HAWB": "",
        "Project": "",
        "HubCode": "",
        "Region": "",
        "PO": "",
        "PartNumber": "",
        "PartNumberDesc": "",
        "import": '-1'
      },
      total: 0,
      tableData: [],
      loading: false,
      importOptions: []
    }
  },
  mounted() {
    this.GetSAPDataState()
  },
  methods: {
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
      let d = new Date();
      d.setDate(d.getDate() - 1)
      this.$set(this.form, 'StartTime', d.format('yyyy-MM-dd'))
      this.$set(this.form, 'EndTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
      this.$set(this.form, 'import', '-1')
    },
    getImportDesc(val) {
      let desc = '';
      let obj = this.importOptions.find(item => item.Key === val + '')
      if (obj) {
        desc = obj.Value
      }
      return desc
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
      SAPShipmentImportFindWithPagerLikeAsync(this.form).then(res => {
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
    GetSAPDataState() {
      this.importOptions = [{ Key: '-1', Value: 'All' }]
      GetSAPDataState().then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.importOptions = [...this.importOptions, ...data]
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.app_container {}

.select_option {
  position: relative;
  text-align: left;

  &>span {
    &:first-child {
      position: absolute;
      left: 0;
    }

    &:nth-child(2) {
      position: absolute;
      right: 20px;
    }
  }
}
</style>
