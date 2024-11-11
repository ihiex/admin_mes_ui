<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.Keywords" style="height: inherit;" :show-add="showAdd" :total="total"
      :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" :show-fold="false"
      @switchLock="handleSwitchLock" @search="handleSearch" @add="handleAdd" @reset="handleReset">
      <div slot="button" style="display: inline-block; margin-left: 5px;">
        <el-button :icon="downLoading ? 'el-icon-loading' : 'el-icon-download'" :disabled="downLoading"
          @click="handleExport">{{ $t('export') }}</el-button>
        <el-button v-hasPermi="['deviceData/BeachDelete']" type="danger" icon="el-icon-delete"
          @click="handleBeachDelete">{{
    $t('delete')
  }}</el-button>
      </div>
      <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('DeviceSN')">
                <el-input v-model.trim="form.SN" :placeholder="$t('pleaseInput')" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('StationType')">
                <el-select v-model="form.StationTypeName" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  filterable clearable>
                  <el-option v-for="item in stationTypeOptions" :key="item.ID" :label="item.Description"
                    :value="item.Description">
                    <div class="select_option">
                      <span>{{ item.Description }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('PartNumber')">
                <el-select v-model="form.PartNumber" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable
                  clearable>
                  <el-option v-for="item in partOptions" :key="item.ID" :label="item.PartNumber"
                    :value="item.PartNumber">
                    <div class="select_option">
                      <span>{{ item.PartNumber }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('DeviceFamily')">
                <el-select v-model="form.MachineFamilyName" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  filterable clearable>
                  <el-option v-for="item in machineFamilyOptions" :key="item.ID" :label="item.Name" :value="item.Name">
                    <div class="select_option">
                      <span>{{ item.Name }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('WarningState')">
                <el-select v-model="form.WarningStateIds" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" :reserve-keyword="true" multiple filterable clearable>
                  <el-option v-for="item in warningStateOptions" :key="item.Key" :label="item.Value" :value="item.Key">
                    <div class="select_option">
                      <span>{{ item.Value }}</span>
                      <span>{{ item.Key }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('Status')">
                <el-select v-model="form.StateIds" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" :reserve-keyword="true" multiple filterable clearable>
                  <el-option v-for="item in machineStatusOptions" :key="item.ID" :label="item.Description"
                    :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.Description }}</span>
                      <span>{{ item.ID }}</span>
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
        <el-table v-if="update" :data="tableData" style="width: 100%;" border :default-expand-all="expandAll"
          height="100%" :row-style="handleRowStyle" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="ID" label="ID" sortable width="80" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column>

          <el-table-column prop="StationTypeName" :label="$t('StationType')" sortable min-width="200"
            show-overflow-tooltip></el-table-column>

          <el-table-column prop="SN" :label="$t('DeviceSN')" sortable min-width="200"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="RuningQuantity" :label="$t('NumberUse')" sortable min-width="130"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="MaxUseQuantity" :label="$t('MaximumUsage')" sortable min-width="160"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="RuningCapacityQuantity" :label="$t('RunCapacityQTY')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="CapacityQuantity" :label="$t('CapacityQTY')" sortable min-width="130"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="StartRuningTime" :label="$t('RunStartTime')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="LastRuningTime" :label="$t('RunLastTime')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="MachineFamilyName" :label="$t('deviceFamily')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="PartNumber" :label="$t('PartNumber')" sortable min-width="150"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="StatusDesc" :label="$t('Status')" sortable min-width="150"
            show-overflow-tooltip></el-table-column>

          <el-table-column prop="WarningStatus" :label="$t('WarningState')" sortable min-width="150"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ showWarning(scope.row.WarningStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="CheckStatus" :label="$t('CheckState')" sortable min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ showCheckStatus(scope.row.CheckStatus) }}
            </template>
          </el-table-column>
          <el-table-column prop="ValidFrom" :label="$t('BindStationType')" sortable min-width="200"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatStation(scope.row.ValidFroms) }}
            </template>
          </el-table-column>
          <el-table-column prop="ValidDistribution" :label="$t('EffectiveDistribution')" sortable min-width="250"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatValidAllot(scope.row.ValidDistributions) }}
            </template>
          </el-table-column>
          <el-table-column prop="ValidTo" :label="$t('UnbindStationType')" sortable min-width="200"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatStation(scope.row.ValidTos) }}
            </template>
          </el-table-column>
          <el-table-column prop="Description" :label="$t('describe')" sortable min-width="150"
            show-overflow-tooltip></el-table-column>
            <el-table-column prop="ParentName" :label="$t('ParentFixture')" sortable min-width="100"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="" :label="$t('operation')" width="130" fixed="right">
            <template slot-scope="props">
              <el-button v-hasPermi="['deviceData/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['deviceData/Delete']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleDelete(props.row)"></el-button>
              <el-button v-hasPermi="['deviceData/Clone']" size="mini" icon="el-icon-copy-document" circle
                @click="handleClone(props.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </z-query>
    <AddOrEdit ref="AddOrEdit" @confirm="handlePrimaryConfirm"></AddOrEdit>
  </div>
</template>

<script>
import {
  MachineDeleteAsync,
  MachineFindWithPagerSearchAsync,
  getMachineFamily,
  getMachine,
  GetWarningState
} from '@/api/config.js'
import { GetmesRoute, GetmesStationType, GetmesPart, GetluMachineStatus } from '@/api/configCommon.js'
import mixin from '@/views/configManagement/mixin/index.js';
import AddOrEdit from './AddOrEdit.vue';
import { pageSize } from '@/config'
import { downloadFile } from '@/utils'
import getDownLoadData from '@/utils/excel.js'

/* 设备分配 */
export default {
  name: 'DeviceData',
  components: {
    AddOrEdit,
  },
  mixins: [mixin],
  data() {
    return {
      title: '设备分配',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        RecordCount: 0,
        Keywords: "",
        EnCode: "",
        Order: "",
        Sort: "",
        Status: "",
        StatusID: "",
        StationTypeName: "",
        PartNumber: "",
        MachineFamilyName: "",
        SN: "",
        WarningStateIds: [],
        StateIds: []
      },
      checkOptions: [
        {
          value: 0,
          label: this.$t('NoCheck')
        },
        {
          value: 1,
          label: this.$t('ConsistencyCheck')
        }
      ],
      pathNameOptions: [],
      stationTypeOptions: [],
      partOptions: [],
      machineFamilyOptions: [],
      SNOptions: [],
      downLoading: false,
      machineStatusOptions: [],
      warningStateOptions: [],
    }
  },
  mounted() {
    this.handleSearch();
    this.getPathName();
    // this.getSN();
    this.getStationType();
    this.getPart();
    this.getMachineFamily();
    this.getWarningState();
    this.getMachineStatus();

    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'deviceData/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
  },
  methods: {
    delete(id) {
      MachineDeleteAsync({ ID: id }).then(res => {
        if (res.Success) {
          if (this.selectList[this.selectList.length - 1].ID === id) {
            this.handleSearch();
          }
        }
      })
    },
    showWarning(val) {
      let obj = this.warningStateOptions.find(res => res.Key == val)
      if (obj) {
        return obj.Value
      }
      return
    },
    showCheckStatus(val) {
      let obj = this.checkOptions.find(res => res.value === val)
      if (obj) {
        return obj.label
      }
      return
    },
    formatValidAllot(list) {
      let arr = [];
      list.forEach(item => {
        arr.push(`${item.Description},${item.Count}`)
      })
      return arr.join(';')
    },
    formatStation(list) {
      return list.map(res => res.Description).join(';')
    },
    getWarningState() {
      GetWarningState().then(res => {
        if (res.Success) {
          this.warningStateOptions = [...res.ResData]
        }
      })
    },
    getMachineStatus() {
      GetluMachineStatus().then(res => {
        if (res.Success) {
          this.machineStatusOptions = [...res.ResData]
        }
      })
    },
    handleExport() {
      if (this.tableData.length == 0) return
      this.downLoading = true;
      // let data = J
      let data = {}
      let headData = {}
      /*        Attributes
      LastMaintenance
      MachineFamilyID
      MaxUseQuantity
      NextMaintenance
      PartDesc
      PartGroup
      PartGroupDesc
      PartID
      PartNO
      RuningStationTypeID
      StationID
      StationTypeID
      Store
       */

      data.DeviceData = this.tableData
      //显示表头，过滤多余的
      headData.DeviceData = [
        'ID',
        'StationTypeName',
        'SN',
        'RuningQuantity',
        'RuningCapacityQuantity',
        'CapacityQuantity',
        'StartRuningTime',
        'LastRuningTime',
        'MachineFamilyName',
        'PartNumber',
        'StatusDesc',
        'WarningStatus',
        'CheckStatus',
        'ValidFrom',
        'ValidDistribution',
        'ValidTo',
        'Description'
      ]
      downloadFile(
        getDownLoadData(data, 'xlsx', headData),
        `DeviceData_${new Date().format('yyyy/MM/dd hh:mm:ss')}.xlsx`
      )

      this.downLoading = false
    },
    getSN() {
      getMachine().then(res => {
        if (res.Success) {
          this.SNOptions = [...res.ResData]
        }
      })
    },
    getPathName() {
      GetmesRoute().then(res => {
        if (res.Success) {
          this.pathNameOptions = [...res.ResData]
        }
      })
    },
    getStationType() {
      GetmesStationType().then(res => {
        if (res.Success) {
          this.stationTypeOptions = [...res.ResData]
        }
      })
    },
    getPart() {
      GetmesPart().then(res => {
        if (res.Success) {
          this.partOptions = [...res.ResData]
        }
      })
    },
    getMachineFamily() {
      getMachineFamily().then(res => {
        if (res.Success) {
          this.machineFamilyOptions = [...res.ResData]
        }
      })
    },
    handleSortMethod(a, b) {
      return a.ID < b.ID
    },
    handlePrimaryConfirm(val) {
      switch (val) {
        case 'Edit':
          this.getData()
          break;
        default:
          this.handleSearch()
      }
    },
    handleAdd() {
      this.$refs.AddOrEdit.show(this.$t('Added'), 'Add')
    },
    handleClone(item) {
      this.$refs.AddOrEdit.show(this.$t('Clone'), 'Clone', item)
    },
    handleEdit(item) {
      this.$refs.AddOrEdit.show(this.$t('edit'), 'Edit', item)
    },
    handleDelete(item) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        MachineDeleteAsync(item).then(res => {
          if (res.Success) {
            this.handleSearch();
          }
        })
      }).catch(() => {
      });
    },
    handleSwitchLock(val) {
      this.update = false;
      this.expandAll = val
      this.$nextTick(function () {
        this.update = true;
      })
    },

    handleSearch(item) {
      if (item) {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
      } else {
        this.$set(this.form, 'CurrentPageIndex', 1)
      }
      this.tableData = []
      this.getData()
    },
    getData() {
      let params = JSON.parse(JSON.stringify(this.form))
      /* Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          this.$set(params, key, params[key].join(','))
        }
      }) */
      this.loading = true
      MachineFindWithPagerSearchAsync(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.tableData = [...data.Items]
          this.total = data.TotalItems
        }
        this.loading = false;
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page_container {
  background-color: #fff;
  height: inherit;

  .el-table__expanded-cell {

    .el-row {
      margin: 2px 0;
      // background-color: #f9f9f9;

      // .el-col {

      //   &:nth-child(1),
      //   &:nth-child(2) {
      //     background-color: #eee;
      //   }
      // }

      &:hover {
        &>.el-col {
          background-color: #ccc;
        }
      }
    }
  }

  ::v-deep {

    .el-table__expanded-cell[class*=cell] {
      padding: 0 50px;
      background-color: transparent !important
    }
  }
}
</style>
