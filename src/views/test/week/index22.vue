<template>
  <!-- <div class="page_container"> -->
  <ZReportQuery ref="ZReportQueryRef" :total="total" :page-size="form.PageSize" :show-pagination="true"
    :current-page-index="form.CurrentPageIndex" @search="handleSearch" @reset="handleReset">
    <el-button slot="button" :icon="downLoading ? 'el-icon-loading' : 'el-icon-download'" :disabled="downLoading"
      @click="handleExport">{{ $t('export') }}</el-button>
    <div style="margin-top: 20px;">
      <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item :label="$t('PlantCode')">
              <el-select v-model="form.plant" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                :reserve-keyword="true" :collapse-tags="true" filterable @change="handlePlantChange">
                <el-option v-for="(item, index) in plantOptions" :key="index" :label="item.Plant" :value="item.Plant">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item :label="$t('Version')">
              <el-select v-model="form.version" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                :reserve-keyword="true" :collapse-tags="true" filterable>
                <el-option v-for="(item, index) in versionOptions" :key="index" :label="item.Version"
                  :value="item.Version">
                  {{ item.Version }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item :label="$t('Material')">
              <el-select v-model="form.material" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                :reserve-keyword="true" :collapse-tags="true" multiple clearable filterable>
                <el-option v-for="(item, index) in materialOptions" :key="index" :label="item.Material"
                  :value="item.Material">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="table" v-loading="loading" style="height: 100%;">
      <el-table :data="tableData" style="width: 100%;" :height="height" border>
        <el-table-column v-for="(item, key) in tableHead" :key="key" :prop="key" :label="key" sortable min-width="150"
          show-overflow-tooltip>
          <template v-if="Array.isArray(tableHead[key])">
            <el-table-column v-for="(d, i) in tableHead[key]" :key="i" :prop="d" :label="d" sortable min-width="150"
              show-overflow-tooltip></el-table-column>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </ZReportQuery>
  <!-- </div> -->
</template>

<script>
import ZReportQuery from '@/components/reportQuery'
import { GetStockPlan, GetPlantCode, GetVersionByPlantCode, GetMaterialByPlantCode, ExportStockPlan } from '@/api/report'
import { pageSize } from '@/config'
import { downloadFile, /* getWeekOfMonth */ } from '@/utils'

export default {
  name: 'CTB',
  components: {
    ZReportQuery
  },
  data() {
    return {
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
      },
      total: 0,
      materialOptions: [],
      versionOptions: [],
      plantOptions: [],
      tableData: [],
      tableHead: [],
      height: '100%',
      loading: false,
      downLoading: false
    };
  },
  mounted() {
    this.getPlantCode()
  },
  methods: {
    handleExport() {
      let params = {}
      Object.keys(this.form).forEach(key => {
        if (Array.isArray(this.form[key])) {
          params[key] = this.form[key].join(',')
        } else {
          params[key] = this.form[key]
        }
      })
      this.downLoading = true;
      delete params.CurrentPageIndex
      delete params.PageSize
      ExportStockPlan(params).then(res => {
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
    handleSearch(val) {
      if (val) {
        Object.keys(val).forEach(key => {
          this.$set(this.form, key, val[key])
        })
      }
      let params = {}
      Object.keys(this.form).forEach(key => {
        if (Array.isArray(this.form[key])) {
          params[key] = this.form[key].join(',')
        } else {
          params[key] = this.form[key]
        }
      })

      this.tableHead = [];
      this.tableData = [];
      this.getStockPlan(params)
    },
    handleReset() {
      this.$set(this.form, 'material', '')

      for (let i = 0; i < this.plantOptions.length; i++) {
        if (this.plantOptions[i]) {
          this.$set(this.form, 'plant', this.plantOptions[i].Plant)
          this.handlePlantChange(this.plantOptions[i].Plant)
          break;
        }
      }
    },
    handlePlantChange(val) {
      this.$set(this.form, 'version', '')
      this.$set(this.form, 'material', '')
      this.materialOptions = []
      this.versionOptions = []

      this.getVersion({ plant: val })
      this.getMaterial({ plant: val })

    },
    getStockPlan(params) {
      this.height = '99.9%';
      this.loading = true
      GetStockPlan(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          if (data.Items.length > 0) {
            // this.tableHead = Object.keys(data.Items[0]);
            this.tableHead = this.formatHead(data.Items[0]);
            console.log(this.tableHead)
          }
          this.total = parseInt(data.TotalItems)
          this.$nextTick(function () {
            this.tableData = [...data.Items]
            this.height = '100%'
          })
        }
        this.loading = false
      }, error => {
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    getPlantCode() {
      GetPlantCode().then(res => {
        if (res.Success) {
          this.plantOptions = [...res.ResData]
          for (let i = 0; i < this.plantOptions.length; i++) {
            if (this.plantOptions[i].Plant) {
              this.$set(this.form, 'plant', this.plantOptions[i].Plant)
              this.handlePlantChange(this.plantOptions[i].Plant)
              break;
            }
          }
        }
      })
    },
    getVersion(params) {
      GetVersionByPlantCode(params).then(res => {
        if (res.Success) {
          this.versionOptions = [...res.ResData]
          for (let i = 0; i < this, this.versionOptions.length; i++) {
            if (this.versionOptions[i].Version) {
              this.$set(this.form, 'version', this.versionOptions[i].Version)
              break
            }
          }
        }
      })
    },
    getMaterial(params) {
      GetMaterialByPlantCode(params).then(res => {
        if (res.Success) {
          this.materialOptions = [...res.ResData]
        }
      })
    },
    formatHead(item) {
      let hObj = {}
      Object.keys(item).forEach(key => {
        if (new Date(key) != 'Invalid Date') {
          // debugger
          let dk = getWeekOfMonth(new Date(key));
          if (hObj[dk]) {
            hObj[dk].push(key)
          } else {
            hObj[dk] = [key]
          }
        } else {
          hObj[key] = key;
        }
      })
      return hObj
    },
  },

};


/**
 * @author Jason.Zou
 * @param {*} date
 * @returns
 */
/*  export function getWeekOfMonth(date) {
  // 获取当前日期的年、月、日
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  let monthEnglishList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  // 创建一个新日期对象，将日期设置为该月的第一天
  const firstDayOfMonth = new Date(year, month, 1);

  // 获取该月的第一天是星期几
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // 计算当前日期是该月的第几天
  const dayOfMonth = day + firstDayOfWeek;
  // console.log(dayOfMonth)
  // 计算当前日期是该月的第几周
  const weekOfMonth = Math.ceil(dayOfMonth / 7);

  return `${year}_${monthEnglishList[month]} WK${weekOfMonth}`;
} */


</script>

<style scoped lang="scss"></style>
