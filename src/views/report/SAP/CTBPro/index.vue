<template>
  <!-- <div class="page_container"> -->
  <ZReportQuery ref="ZReportQueryRef" v-loading="loading" :total="total" :page-size="form.PageSize"
    :show-pagination="true" :current-page-index="form.CurrentPageIndex" @search="handleSearch" @reset="handleReset">
    <el-button slot="button" v-hasPermi="['SAP/CTBPro/ExportData']" :icon="downLoading ? 'el-icon-loading' : 'el-icon-download'" :disabled="downLoading"
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
          <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
            <el-form-item :label="$t('type')">
              <el-select v-model="form.sapDateType" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                :reserve-keyword="true"  filterable>
                <el-option v-for="item in dataTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div slot="table" style="height: 100%;">
      <el-table :data="tableData" style="width: 100%;" :height="height" border>
        <el-table-column v-for="item in tableHead" :key="item" :prop="item" :label="item" sortable
          :min-width="item.includes('Wks') ? '230' : '160'" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
  </ZReportQuery>
  <!-- </div> -->
</template>

<script>
import ZReportQuery from '@/components/reportQuery'
import { GetSAPStockPro, GetPlantCode, GetVersionByPlantCode, GetMaterialByPlantCode, GetSAPStockProExport } from '@/api/report'
import { pageSize } from '@/config'
import { downloadFile } from '@/utils'

export default {
  name: 'CTBPro',
  components: {
    ZReportQuery
  },
  data() {
    return {
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        sapDateType: 1
      },
      total: 0,
      materialOptions: [],
      versionOptions: [],
      plantOptions: [],
      tableData: [],
      tableHead: [],
      height: '100%',
      loading: false,
      downLoading: false,
      dataTypeOptions: [
        {
          value: 1,
          label: this.$t('GenerateByDay')
        },
        {
          value: 2,
          label: this.$t('GenerateByWeek')
        }
      ]
    };
  },
  watch: {
    "$i18n.locale": function () {
      this.dataTypeOptions = [
        {
          value: 1,
          label: this.$t('GenerateByDay')
        },
        {
          value: 2,
          label: this.$t('GenerateByWeek')
        }
      ]
    }
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
      GetSAPStockProExport(params).then(res => {
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
      if(val.CurrentPageIndex == 1){
        this.total= 0
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
      this.$set(this.form, 'sapDateType', 1)

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
      GetSAPStockPro(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          if (data.Items.length > 0) {
            this.tableHead = Object.keys(data.Items[0]);
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
    }

  },

};
</script>

<style scoped lang="scss"></style>
