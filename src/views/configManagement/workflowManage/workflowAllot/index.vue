<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.LikeQuery" style="height: inherit;" :show-add="showAdd" :total="total"
      :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" @switchLock="handleSwitchLock"
      @search="handleSearch" @add="handleAdd" @reset="handleReset">
      <el-button slot="button" v-hasPermi="['workflowAllot/BeachDelete']" type="danger" icon="el-icon-delete"
        @click="handleBeachDelete">{{
          $t('delete')
        }}</el-button>
      <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('PathName')">
                <el-select v-model="form.RouteID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" :reserve-keyword="true" filterable multiple clearable>
                  <el-option v-for="item in pathNameOptions" :key="item.ID" :label="item.Name" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.Name }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('PartFamily')">
                <el-select v-model="form.PartFamilyID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" filterable clearable @change="handlePartFamilyChange">
                  <el-option v-for="item in partFamilyOptions" :key="item.ID" :label="item.Description" :value="item.ID">
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
                <el-select v-model="form.PartID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" :reserve-keyword="true" filterable multiple clearable>
                  <el-option v-for="item in partOptions" :key="item.ID" :label="item.Description" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.Description }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('Line')">
                <el-select v-model="form.LineID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" :reserve-keyword="true" filterable multiple clearable>
                  <el-option v-for="item in lineOptions" :key="item.ID" :label="item.Description" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.Description }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('WorkOrderNumber')" prop="ProductionOrderID">
                <el-select v-model="form.ProductionOrderID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" :reserve-keyword="true" filterable multiple clearable>
                  <el-option v-for="item in workOrderOptions" :key="item.ID" :label="item.SN" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.SN }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" class="hidden-sm-and-up">
              <el-form-item :label="$t('keywords')">
                <el-input v-model.trim="form.LikeQuery" :placeholder="$t('keywords')" clearable
                  @keypress.native.enter="handleSearch">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="table" style="height: 100%;">
        <el-table v-if="update" :data="tableData" style="width: 100%;" height="100%" :row-style="handleRowStyle" border
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="ID" label="ID" sortable width="80" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Route" :label="$t('PathName')" sortable min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="PartFamily" :label="$t('PartFamily')" sortable min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Line" :label="$t('Line')" sortable min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="PartNumber" :label="$t('PartNumber')" sortable min-width="140"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductionOrderNumber" :label="$t('WorkOrderNumber')" sortable min-width="170"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="" :label="$t('operation')" width="130" fixed="right">
            <template slot-scope="props">
              <el-button v-hasPermi="['workflowAllot/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['workflowAllot/Delete']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleDelete(props.row.ID)"></el-button>
              <el-button v-hasPermi="['workflowAllot/Clone']" size="mini" icon="el-icon-copy-document" circle
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
  WorkflowAllotDelete,
  WorkflowAllotFindWithPagerSearchAsync,
} from '@/api/config.js'
import mixin from '@/views/configManagement/mixin/index.js';
import AddOrEdit from './AddOrEdit.vue';
import { pageSize } from '@/config'
import {
  GetmesRoute,
  GetluPartFamily,
  GetmesPart_PartFamilyID,
  GetmesLine,
  GetmesProductionOrder
} from '@/api/configCommon.js'

/* 工艺流程分配 */
export default {
  name: 'WorkflowAllot',
  components: {
    AddOrEdit
  },
  mixins: [mixin],
  data() {
    return {
      title: '工艺流程分配',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        LikeQuery: '',
        ID: '',
        PartFamilyID: '',
        PartFamily: '',
        PartID: '',
        Part: '',
        LineID: '',
        Line: '',
        RouteID: '',
        Route: '',
        ProductionOrderID: '',
        ProductionOrder: ''
      },
      pathNameOptions: [],
      partFamilyOptions: [],
      partOptions: [],
      lineOptions: [],
      workOrderOptions: [],
    }
  },
  mounted() {
    this.handleSearch();
    this.getPathName();
    this.getPartFamily();
    this.getLine();
    this.getWorkOrder();
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'workflowAllot/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
  },
  methods: {
    delete(id) {
      WorkflowAllotDelete({ Id: id }).then(res => {
        if (res.Success) {
          if (this.selectList[this.selectList.length - 1].ID === id) {
            this.handleSearch();
          }
        }
      })
    },
    handleClone(item) {
      this.$refs.AddOrEdit.show(this.$t('clone'), 'Clone', item)
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
    handleEdit(item) {
      this.$refs.AddOrEdit.show(this.$t('edit'), 'Edit', item)
    },
    handleDelete(id) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        WorkflowAllotDelete({ Id: id }).then(res => {
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
    handleRowStyle({ row, rowIndex }) {
      if (row.StatusID === 2) {
        return { backgroundColor: '#eee' }
      }
    },
    handlePartFamilyChange(val) {
      this.partOptions = []
      this.$set(this.form, 'PartID', [])
      this.getPart(val)
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
      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          this.$set(params, key, params[key].join(','))
        }
      })
      this.loading = true
      WorkflowAllotFindWithPagerSearchAsync(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.tableData = [...data.Items]
          this.total = data.TotalItems
        }
        this.loading = false;
      })
    },
    getPathName() {
      GetmesRoute().then(res => {
        if (res.Success) {
          this.pathNameOptions = [...res.ResData]
          this.pathNameOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })

    },
    getPartFamily() {
      GetluPartFamily().then(res => {
        if (res.Success) {
          this.partFamilyOptions = [...res.ResData]
          this.partFamilyOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    },
    getPart(id) {
      GetmesPart_PartFamilyID({ PartFamilyID: id }).then(res => {
        if (res.Success) {
          this.partOptions = [...res.ResData]
          this.partOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    },
    getLine() {
      GetmesLine().then(res => {
        if (res.Success) {
          this.lineOptions = [...res.ResData]
          this.lineOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    },
    getWorkOrder() {
      GetmesProductionOrder().then(res => {
        if (res.Success) {
          this.workOrderOptions = [...res.ResData]
          this.workOrderOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    }
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
