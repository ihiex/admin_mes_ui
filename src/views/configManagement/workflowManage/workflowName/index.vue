<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.LikeQuery" style="height: inherit;" :show-add="showAdd" :total="total"
      :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" :show-fold="false" @search="handleSearch"
      @add="handleAdd" @reset="handleReset">
      <el-button slot="button" v-hasPermi="['workflowName/BeachDelete']" type="danger" icon="el-icon-delete"
        @click="handleBeachDelete">{{
          $t('delete')
        }}</el-button>
      <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('name')">
                <el-input v-model.trim="form.Name" :placeholder="$t('pleaseInput')" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('describe')">
                <el-input v-model.trim="form.Description" :placeholder="$t('pleaseInput')" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('PathType')">
                <el-select v-model="form.RouteType" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" clearable filterable>
                  <el-option v-for="item in pathOptions" :key="item.value" :label="item.label" :value="item.value">
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
        <el-table :data="tableData" style="width: 100%;" :default-expand-all="expandAll" height="100%" border
          @expand-change="handleExpandChange" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.Children" style="width: 100%" size="mini" border :show-header="true">
                <el-table-column prop="ID" label="ID" min-width="60" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="StationType" :label="$t('StationType')" min-width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="UnitState" :label="$t('Unit_State')" min-width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="Sequence" :label="$t('Order')" min-width="60" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="SequenceMod" :label="$t('Order')" min-width="80" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="Description" :label="$t('describe')" min-width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="" :label="$t('operation')" width="100">
                  <template slot-scope="scope">
                    <el-button v-hasPermi="['workflowName/EditChild']" size="mini" type="primary" icon="el-icon-edit"
                      circle @click="handleChildrenEdit(scope.row, props.row)"></el-button>
                    <el-button v-hasPermi="['workflowName/DeleteChild']" size="mini" type="danger" icon="el-icon-delete"
                      circle @click="handleChildrenDelete(scope.row.ID, props.row.Children)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="ID" label="ID" sortable width="80" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Name" :label="$t('name')" sortable min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Description" :label="$t('describe')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="RouteTypeValue" :label="$t('PathType')" sortable min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="" :label="$t('operation')" sortable width="280" fixed="right">
            <template slot-scope="props">
              <el-button v-hasPermi="['workflowName/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['workflowName/Delete']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleDelete(props.row)"></el-button>

              <el-button v-hasPermi="['workflowName/Clone']" size="mini" icon="el-icon-copy-document" circle
                @click="handleClone(props.row)"></el-button>

              <el-button v-if="props.row.RouteType !== '1'" v-hasPermi="['workflowName/AddChild']" size="mini"
                icon="el-icon-plus" circle @click="handleAddChildren(props.row)"></el-button>

              <el-button v-if="props.row.RouteType !== '0'" v-hasPermi="['workflowName/view']" size="mini" type="primary"
                icon="el-icon-view" circle :title="$t('ViewDraw')" @click="handleDrawView(props.row)"></el-button>
              <el-button v-if="props.row.RouteType !== '0'" v-hasPermi="['workflowName/Draw']" size="mini" type="primary"
                icon="el-icon-s-grid" circle :title="$t('Draw')" @click="handleDraw(props.row)"></el-button>
              <el-button v-if="props.row.RouteType !== '0'" v-hasPermi="['workflowName/ReturnDraw']" size="mini"
                type="primary" icon="el-icon-back" circle :title="$t('ReturnDraw')"
                @click="handleReturnDraw(props.row)"></el-button>
              <el-button v-if="props.row.RouteType !== '0'" v-hasPermi="['workflowName/Upgrade']" size="mini"
                icon="el-icon-s-promotion" circle @click="handleUpgrade(props.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </z-query>
    <PrimaryAddOrEdit ref="PrimaryAddOrEdit" @confirm="handlePrimaryConfirm"></PrimaryAddOrEdit>
    <ChildAddOrEdit ref="ChildAddOrEdit" @confirm="handleExpandChange"></ChildAddOrEdit>
    <ViewAndAddDraw ref="ViewAndAddDraw"></ViewAndAddDraw>
    <RouterHistory ref="RouterHistoryRef" @confirm="handleRouterHistoryConfirm"></RouterHistory>
  </div>
</template>

<script>
import {
  WorkflowNameDelete,
  WorkflowNameFindWithPagerSearchAsync,
  WorkflowConfigDelete,
  WorkflowConfigFindWithPagerSearchAsync,
  SetXMLToXMLV2
} from '@/api/config.js'
import {
  GetSectionType,
  GetluSNFamily
} from '@/api/configCommon.js'
import mixin from '@/views/configManagement/mixin/index.js';
import PrimaryAddOrEdit from './primaryAddOrEdit.vue';
import ChildAddOrEdit from './childAddOrEdit.vue';
import { pageSize } from '@/config'
import ViewAndAddDraw from './viewAndAddDraw.vue'
import RouterHistory from './routerHistory.vue';

/* 工艺流程名 */
export default {
  name: 'WorkFlowName',
  components: {
    PrimaryAddOrEdit,
    ChildAddOrEdit,
    ViewAndAddDraw,
    RouterHistory
  },
  mixins: [mixin],
  data() {
    return {
      title: '工艺流程名',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        LikeQuery: '',
        ID: '',
        Name: '',
        Description: '',
        RouteType: '',
        RouteTypeValue: '',
      },
      stationTypeOptions: [],
      SNFamilyOptions: [],
      pathOptions: [
        {
          value: '0',
          label: 'TableRoute'
        },
        {
          value: '1',
          label: 'DiagramRoute'
        }
      ],
    }
  },
  mounted() {
    this.handleSearch();
    this.getStationType();
    this.getSNFamily();
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'workflowName/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
  },
  methods: {
    delete(id) {
      WorkflowNameDelete({ Id: id }).then(res => {
        if (res.Success) {
          if (this.selectList[this.selectList.length - 1].ID === id) {
            this.handleSearch();
          }
        }
      })
    },
    handleRouterHistoryConfirm(data, title) {
      this.$refs.ViewAndAddDraw.show(title, 'ReturnDraw', data)
    },
    handleUpgrade(row) {
      this.$confirm(this.$t('IsUpgradeFromOldDrawToNewDraw'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        SetXMLToXMLV2({ Id: row.ID }).then(res => {
          if (res.Success) {
            this.handleDraw(row)
          }
        })
      }).catch(() => {

      });
    },
    handleDrawView(row) {
      this.$refs.ViewAndAddDraw.show(this.$t('view'), 'view', row)
    },
    handleDraw(row) {
      this.$refs.ViewAndAddDraw.show(this.$t('edit'), 'edit', row)
    },
    handleReturnDraw(row) {
      this.$refs.RouterHistoryRef.show(this.$t('ReturnDraw'), row.ID)
    },
    async handleExpandChange(row) {
      if (row.RouteType === '1') return;
      let list = await this.getWorkFlowConfigData(row.ID)
      row.Children.length = 0;
      list.forEach(item => {
        row.Children.push(item)
      })
    },
    handleClone(item) {
      this.$refs.PrimaryAddOrEdit.show(this.$t('clone'), 'Clone', item)
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
      this.$refs.PrimaryAddOrEdit.show(this.$t('Added'), 'Add')
    },
    handleChildrenEdit(item, parentRow) {
      this.$refs.ChildAddOrEdit.show(this.$t('edit'), JSON.parse(JSON.stringify(item)), parentRow)
    },
    handleChildrenDelete(id, list) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        WorkflowConfigDelete({ Id: id }).then(res => {
          if (res.Success) {
            // this.getData();
            let index = list.findIndex(r => r.ID === id)
            index >= 0 && list.splice(index, 1)
          }
        })
      }).catch(() => {
      });
    },
    handleEdit(item) {
      this.$refs.PrimaryAddOrEdit.show(this.$t('edit'), 'Edit', item)
    },
    handleDelete(row) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(async () => {
        let list = await this.getWorkFlowConfigData(row.ID)
        let ids = list.map(r => r.ID)
        let that = this
        if (ids && ids.length > 0) {
          function delChild(id) {
            WorkflowConfigDelete({ Id: id }).then(res => {
              if (res.Success) {
                if (ids.length > 0) {
                  delChild(ids.shift())
                } else {
                  WorkflowNameDelete({ Id: row.ID }).then(result => {
                    if (result.Success) {
                      that.handleSearch();
                    }
                  })
                }
              }
            })
          }
          delChild(ids.shift())

        } else {
          WorkflowNameDelete({ Id: row.ID }).then(result => {
            if (result.Success) {
              this.handleSearch();
            }
          })
        }
      }).catch(() => {
      });
    },
    handleAddChildren(row) {
      this.$refs.ChildAddOrEdit.show(this.$t('Added'), {}, row)
    },
    handleRowStyle({ row, rowIndex }) {
      if (row.StatusID === 2) {
        return { backgroundColor: '#eee' }
      }
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
      WorkflowNameFindWithPagerSearchAsync(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.tableData = [...data.Items]
          this.tableData.forEach(item => {
            item.Children = []
          })
          this.total = data.TotalItems
        }
        this.loading = false;
      })
    },
    async getWorkFlowConfigData(id) {
      let res = await WorkflowConfigFindWithPagerSearchAsync({ RouteID: id })
      if (res.Success && res.ResData) {
        return res.ResData
      }
      return []
    },
    getStationType() {
      GetSectionType().then(res => {
        if (res.Success) {
          this.stationTypeOptions = [...res.ResData]
        }
      })
    },
    getSNFamily() {
      GetluSNFamily().then(res => {
        if (res.Success) {
          this.SNFamilyOptions = [...res.ResData]
        }
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
