<template>
  <div v-if="IsLegalPage" class="app_container">
    <div class="header">
      <el-row :gutter="10">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item :label="$t('date')" style="display: inline-block;">
            <el-date-picker v-model="form.date" type="daterange" align="right" style="width: 220px;" unlink-panels
              value-format="yyyy-MM-dd" range-separator="-" :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')" :picker-options="pickerOptions" :clearable="false"
              @change="handleDateChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('status')" style="display: inline-block;">
            <el-select v-model="form.FStatus" placeholder="" clearable @clear="handleClearStatus"
              @change="handleSelectChange">
              <el-option v-for="item in options" :key="item.ID" :label="item.Description" :value="item.ID">
                <span style="padding: 0 10px 0 0;">{{ item.ID }}</span>
                <span>{{ $t('FStatus' + item.ID) }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-button size="small" type="primary" plain style="margin-left: 10px;" @click="handleSearch">{{ $t('query')
          }}</el-button>
          <el-button size="small" plain @click="handleImport">{{ $t('import') }}</el-button>
          <el-button v-hasPermi="['shippingData/Print']" v-loading="printLoading"
            element-loading-spinner="el-icon-loading" :disabled="printLoading" size="small" plain @click="handlePrint">{{
              $t('Print')
            }}</el-button>
          <el-button v-hasPermi="['shippingData/Add']" size="small" plain @click="handleAdd">{{ $t('Added') }}</el-button>
          <el-button v-hasPermi="['shippingData/Audit']" size="small" plain @click="handleAudit">{{ $t('Audit')
          }}</el-button>
          <el-button v-hasPermi="['shippingData/Shipped']" size="small" plain @click="handleShipped">{{ $t('Shipped')
          }}</el-button>
        </el-form>
      </el-row>
    </div>
    <div id="BillShipmentMain" v-loading="loading" class="main">
      <el-table ref="multipleTableBody" :data="tableData" tooltip-effect="dark" style="width: 100%"
        :height="mainTableHeight" border :highlight-current-row="true" @selection-change="handleSelectionChange"
        @row-click="handleRowClick" @row-dblclick="handleRowDBClick">
        <el-table-column type="selection" width="45" fixed="left">
        </el-table-column>
        <el-table-column :label="$t('operation')" width="125" fixed="left" align="center">
          <template slot-scope="scope">
            <el-button type="info" circle size="mini" icon="el-icon-view" @click="handleView(scope.row)"></el-button>
            <el-button v-if="scope.row.FStatus === 0" type="info" circle size="mini" icon="el-icon-edit"
              @click="handleEdit(scope.row)"></el-button>
            <el-button v-if="scope.row.FStatus === 0" type="warning" circle size="mini" icon="el-icon-delete"
              @click="handleDelete(scope.row.FInterID)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="MyStatus" label="FStatus" min-width="140" sortable show-overflow-tooltip fixed="left">
          <template slot-scope="scope">
            <span :class="'FStatus' + scope.row.FStatus"
              style="height: 20px; width: 20px; display: inline-block; position: relative; top: 5px;">
            </span>
            {{ $t('FStatus' + scope.row.FStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="FBill NO" prop="FBillNO" min-width="200" sortable show-overflow-tooltip fixed="left">
        </el-table-column>
        <el-table-column prop="HAWB" label="HAWB" min-width="140" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="FDate" label="FDate" width="170" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="FShipNO" label="FShip NO" min-width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="FCTN" label="FCTN" min-width="100" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="FProjectNO" label="FProject NO" min-width="130" sortable
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="FPalletSeq" label="FPallet Seq" min-width="120" sortable
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="FPalletCount" label="FPallet Count" min-width="140" sortable
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="FGrossweight" label="FGrossweight" min-width="140" sortable
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="FEmptyCarton" label="FEmpty Carton" min-width="140" sortable
          show-overflow-tooltip></el-table-column>


      </el-table>
      <div style="line-height: 30px; padding: 0 10px; text-align: right;">
        <span style="margin-right: 10px ;">Count: {{ tableData.length }}</span>
        <span>SUM: {{ sum }}</span>
      </div>
    </div>
    <div class="footer">
      <div style="line-height: 32px;">
        <el-button size="small" plain :disabled="!isAddChild" @click="handleAddChild">{{ $t('Added') }}</el-button>
        <!-- <el-button size="small" plain :disabled="!isModifyChild" @click="handleModifyChild">修改</el-button>
        <el-button size="small" plain :disabled="!isDeleteChild" @click="handleDeleteChild">删除</el-button> -->
      </div>
      <el-table ref="multipleTable" v-loading="childLoading" :data="childTableData" tooltip-effect="dark"
        style="width: 100%" border height="165" :highlight-current-row="true">
        <el-table-column label="NO." type="index" width="50" fixed="left">
        </el-table-column>
        <el-table-column :label="$t('operation')" width="100" fixed="left" align="center">
          <template slot-scope="scope">
            <el-button v-if="isModifyChild && scope.row.FEntryID !== 0" type="info" circle size="mini" icon="el-icon-edit"
              @click="handleModifyChild(scope.row, currentRow.FInterID)"></el-button>
            <el-button v-if="isDeleteChild && scope.row.FEntryID !== 0" type="warning" circle size="mini"
              icon="el-icon-delete" @click="handleDeleteChild(scope.row.FDetailID, currentRow.FInterID)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="FProjectNO" label="ProjectNO" width="170" sortable show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="FKPONO" label="PO" min-width="140" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="FMPNNO" label="MPN" min-width="120" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="FCTN" label="FCTN" min-width="140" sortable show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <AddAndEdit ref="AddAndEdit" @confirm="handleConfirm"></AddAndEdit>
    <ChildAddAndEdit ref="ChildAddAndEdit" @confirm="handleChildConfirm"></ChildAddAndEdit>
    <BrowserPrint ref="BrowserPrint"></BrowserPrint>
    <UploadDialog ref="UploadDialog" @confirm="handleUploadConfirm"></UploadDialog>
  </div>
</template>

<script>
import {
  DG_GetPageInitialize,
  ShipmentGetWHType, //状态数据类别
  DG_GetShipment, // 获取主数据
  DG_GetShipmentEntry, // 获取子数据
  DG_GetShipmentReport, // 栈板纸-打印
  DG_Edit_CO_WH_Shipment, // 编辑主表
  DG_UpdateShipment_FStatus, // 批量更新状态
  DG_DeleteShipment, // 删除主表
  DG_Edit_CO_WH_ShipmentEntry, //编辑子表
  DG_DeleteShipmentEntry, // 删除子表
  // DG_GetShipment_One
} from '@/api/application.js'
import AddAndEdit from './addAndEdit.vue'
import ChildAddAndEdit from './childAddAndEdit.vue'
import BrowserPrint from '@/views/application/common/browserPrint.vue'
import UploadDialog from './uploadDialog.vue'

/* 出货数据 */
export default {
  name: 'ShippingData',
  components: {
    AddAndEdit,
    ChildAddAndEdit,
    BrowserPrint,
    UploadDialog
  },
  data() {
    let cDate = new Date()
    cDate.setDate(cDate.getDate() + 1)
    let eDate = cDate.format('yyyy-MM-dd')
    let sDate = new Date(cDate.setDate(cDate.getDate() - 7)).format('yyyy-MM-dd')
    let station = this.$store.getters['stationSet/currentStation']
    return {
      title: '出货数据',
      IsLegalPage: false,
      ApplicationType: '',
      printLoading: false,
      form: {
        date: [sDate, eDate],
        S_Start: sDate,
        S_End: eDate,
        FStatus: 999,
      },
      options: [],
      loading: false,
      childLoading: false,
      sum: 0,
      pickerOptions: {
        shortcuts: [{
          text: this.$t('LastWeek'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('LastMonths'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('LastThreeMonths'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      tableData: [],
      childTableData: [],
      multipleSelection: [],
      isAddChild: false,
      isModifyChild: false,
      isDeleteChild: false,
      currentRow: {},
      mainTableHeight: window.innerHeight - 480
    }
  },
  created() {
    this.handleInitPage()
    this.handleGetWHType()
    let that = this;
    window.onresize = function () {
      that.mainTableHeight = window.innerHeight - 465
    }
  },
  methods: {
    handleUploadConfirm(val) {
      this.handleSearch()
    },
    handleImport() {
      this.$refs.UploadDialog.show()
      // console.log('import')
      /* let str = this.currentRow.FInterID + ''
      this.handleBatchUpdate({Status: this.form.FStatus, FInterID_List: str }) */
      // DG_GetShipment_One({FInterID: '41'}).then(res=>{
      //   console.log(res)
      // })
    },
    handleSelectChange() {
      this.$nextTick(function () {
        this.handleSearch()
      })
    },
    handleClearStatus() {
      this.$set(this.form, 'FStatus', 999)
    },
    handleView(item) {
      this.$refs.AddAndEdit.show(item, this.$t('view'))
    },
    handleEdit(item) {
      this.$refs.AddAndEdit.show(item, this.$t('edit'), 'Mod')
    },
    handleDelete(id) {
      this.$confirm(this.$t('WhetherToPerformTheDeletionOperation'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        DG_DeleteShipment({ FInterID: id }).then(res => {
          if (res.Success) {
            //从前端移除
            let index = this.tableData.findIndex(r => r.FInterID === id)
            this.tableData.splice(index, 1)
          }
        })
      }).catch(() => {
      });
    },
    handleRowClick(row, column, event) {
      if(!column.property) return;
      this.currentRow = row;

      this.childLoading = true;
      this.childTableData = [];
      this.handleStatus(row)
      DG_GetShipmentEntry({ S_FInterID: row.FInterID }, false).then(res => {
        this.childLoading = false
        try {
          if (res.Success && res.ResData) {
            this.childTableData = [...res.ResData]
          }
        } catch (err) {
          this.$message.error(err)
        }
      }, error => { this.childLoading = false })
    },
    handleRowDBClick(row, column, event) {
      if(!column.property) return;
      this.handleView(row)
    },
    handleConfirm(params) {
      DG_Edit_CO_WH_Shipment(params).then(res => {
        if (res.Success) {
          this.handleSearch()
        }
      })

    },

    handleChildConfirm(params) {
      console.log(params)
      DG_Edit_CO_WH_ShipmentEntry(params).then(res => {
        if (res.Success) {
          this.handleSearch()
        }
      })
    },
    handleAddChild() {
      if (Object.keys(this.currentRow).length <= 0) return
      this.$refs.ChildAddAndEdit.show({
        FInterID: this.currentRow.FInterID,
        FEntryID: '',
        FDetailID: '',
        FKPONO: '',
        FMPNNO: '',
        FCTN: '',
        FStatus: 0,
        S_Type: 'New'
      }, this.$t('Added'), 'New')
    },
    handleModifyChild(data, FInterID) {
      this.$set(data, 'FInterID', FInterID)
      this.$refs.ChildAddAndEdit.show(data, this.$t('edit'), 'Mod')
    },
    handleDeleteChild(DetailID, FInterID) {
      this.$confirm(this.$t('WhetherToDeleteChildItems'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        DG_DeleteShipmentEntry({ S_FDetailID: DetailID, S_FInterID: FInterID }).then(res => {
          if (res.Success) {
            let index = this.childTableData.findIndex(item => item.FDetailID === DetailID)
            this.childTableData.splice(index, 1)
          }
        })
      }).catch(() => {
      });
    },
    //状态处理
    handleStatus(item) {
      this.isAddChild = false
      this.isModifyChild = false
      this.isDeleteChild = false
      switch (item.FStatus) {
        case 0:
          this.isAddChild = true
          this.isModifyChild = true
          this.isDeleteChild = true
          break;
        case 1:
          console.log(1)
          break;
        case 2:
          console.log(2)
          this.isEnableShipped = true;
          break;
        case 3:
          console.log(3)
          break;
        case 4:
          break;
        case 5:
          break;
        case 6:
          break;
        default:
          console.log(999)
          break;
      }

    },

    handleSearch() {
      this.tableData = []
      this.childTableData = [] //清空子表
      this.currentRow = {}
      this.loading = true;
      this.sum = 0
      DG_GetShipment(this.form).then(res => {
        try {
          if (res.Success && res.ResData) {
            this.tableData = [...res.ResData]
            this.tableData.forEach(item => {
              this.sum += isNaN(item.FCTN) ? 0 : item.FCTN
            })
            if (this.tableData.length > 0) {
              this.currentRow = this.tableData[0]
              this.$refs.multipleTableBody.setCurrentRow(this.currentRow);
              this.$nextTick(function () {
                this.handleRowClick(this.currentRow, {property: true})
              })
            }
          }
        } finally {
          this.loading = false
        }
      }, error => { this.loading = false })
    },
    handlePrint() {
      this.printLoading = true
      DG_GetShipmentReport(this.form).then(res => {
        try {
          if (res.Success && res.ResData) {
            this.$refs.BrowserPrint.show(res.ResData)
          }
        } finally {
          this.printLoading = false
        }
      })
    },
    handleAdd() {
      this.$refs.AddAndEdit.show({}, this.$t('Added'), 'New')
    },
    handleAudit() {
      if (this.multipleSelection.length <= 0) {
        return
      }
      this.$confirm(this.$t('AuditConfirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        let list = this.multipleSelection.filter(res => res.FStatus === 0)
        if (list.length <= 0) return
        let str = list.map(res => res.FInterID).join(',')
        this.handleBatchUpdate({ Status: 1, FInterID_List: str })
      }).catch(() => {
      });

    },
    handleShipped() {
      if (this.multipleSelection.length <= 0) {
        return
      }
      this.$confirm(this.$t('ShippedConfirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        let list = this.multipleSelection.filter(res => res.FStatus === 2)
        if (list.length <= 0) return
        let str = list.map(res => res.FInterID).join(',')
        this.handleBatchUpdate({ Status: 3, FInterID_List: str })
      }).catch(() => {
      });
    },
    handleBatchUpdate(params) {
      DG_UpdateShipment_FStatus(params).then(res => {
        if (res.Success) {
          //刷新页面
          this.handleSearch()
        }
      })
    },
    handleDateChange(val) {
      this.$set(this.form, 'S_Start', val ? val[0] : '')
      this.$set(this.form, 'S_End', val ? val[1] : '')
    },
    handleInitPage() {
      DG_GetPageInitialize({ S_URL: this.$route.path }).then(res => {
        try {
          let data = res.ResData[0]
          if (res.Success && data) {
            this.IsLegalPage = data.IsLegalPage == '1' ? true : false;
            this.ApplicationType = data.ApplicationType
            if (data.IsLegalPage != '1') {
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
    handleGetWHType() {
      ShipmentGetWHType().then(res => {
        if (res.Success && res.ResData) {
          this.options = [...res.ResData]
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },

}
</script>

<style lang="scss" scoped>
.app_container {
  box-sizing: border-box;

  .header {
    line-height: 60px;
    padding: 0;
    box-sizing: border-box;
    // border: #00fa9a 1px solid;
    width: 99%;

    ::v-deep {
      .el-loading-mask {
        top: unset
      }
    }

    .el-form-item {
      padding: 0;
      margin: 0;
    }
  }

  .footer {
    height: 200px;
  }
}

.FStatus0 {
  background-color: #ac0909;
  color: #fff;
}

.FStatus1 {
  background-color: #00fa9a;
  color: #000;
}

.FStatus2 {
  background-color: #0b9b0b;
  color: #000;
}

.FStatus3 {
  background-color: #90ee90;
  color: #000;
}

.FStatus4 {
  background-color: #adff2f;
  color: #000;
}

.FStatus5 {
  background-color: #033b03;
  color: #fff;
}

.FStatus6 {
  background-color: #808080;
  color: #fff;
}
</style>
