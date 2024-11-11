<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.Keywords" style="height: inherit;" :show-add="showAdd" :total="total"
      :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" @switchLock="handleSwitchLock"
      @search="handleSearch" @add="handleAdd" @reset="handleReset">
      <el-button slot="button" v-hasPermi="['shift/Delete']" type="danger" icon="el-icon-delete"
        @click="handleBeachDelete">{{
          $t('delete')
        }}</el-button>
      <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('type')" prop="ShiftType">
                <el-select v-model="form.ShiftTypeNames" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" clearable filterable multiple>
                  <el-option v-for="item in shiftTypeOptions" :key="item.Id" :label="item.ItemName"
                    :value="item.ItemCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('code')" prop="ShiftCode">
                <el-input v-model.trim="form.ShiftCode" :placeholder="$t('pleaseInput')" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('status')" prop="State">
                <el-select v-model="form.ShiftStates" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" clearable filterable multiple>
                  <el-option v-for="item in stateOptions" :key="item.Id" :label="item.ItemName" :value="item.ItemCode">
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
        <!-- :size="tableSize" -->
        <el-table v-if="update" :data="tableData" style="width: 100%;" :default-expand-all="expandAll" height="100%"
          :row-style="handleRowStyle" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.Details" style="width: 100%" size="mini" border :show-header="true">
                <el-table-column prop="ID" label="ID" width="80" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="StartTime" :label="$t('StartDateTime')" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="EndTime" :label="$t('EndDateTime')" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="State" :label="$t('Status')" min-width="80" show-overflow-tooltip>
                  <template slot-scope="scope">{{ showShiftState(scope.row.State) }}</template>
                </el-table-column>
                <el-table-column prop="" :label="$t('operation')" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button v-hasPermi="['shift/EditChild']" size="mini" type="primary" icon="el-icon-edit" circle
                      @click="handleChildrenEdit(scope.row)"></el-button>
                    <el-button v-hasPermi="['shift/DeleteChild']" size="mini" type="danger" icon="el-icon-delete" circle
                      @click="handleChildrenDelete(scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="ID" label="ID" sortable width="80" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="ShiftType" :label="$t('type')" sortable min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ showShiftType(scope.row.ShiftType) }}
            </template>
          </el-table-column>
          <el-table-column prop="ShiftCode" :label="$t('code')" sortable min-width="100"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="State" :label="$t('status')" sortable min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ showShiftState(scope.row.State) }}
            </template>
          </el-table-column>
          <el-table-column prop="ShiftDesc" :label="$t('describe')" sortable min-width="130"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="" :label="$t('operation')" width="170" fixed="right">
            <template slot-scope="props">
              <el-button v-hasPermi="['shift/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['shift/Delete']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleDelete(props.row)"></el-button>
              <el-button v-hasPermi="['shift/AddChild']" size="mini" icon="el-icon-plus" circle
                @click="handleAddChildren(props.row.ID)"></el-button>
              <el-button v-hasPermi="['shift/Clone']" size="mini" icon="el-icon-copy-document" circle
                @click="handleClone(props.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </z-query>
    <PrimaryAddOrEdit ref="PrimaryAddOrEdit" @confirm="handlePrimaryConfirm"></PrimaryAddOrEdit>
    <ChildAddOrEdit ref="ChildAddOrEdit" @confirm="getData"></ChildAddOrEdit>
  </div>
</template>

<script>
import {
  ShiftDelete,
  ShiftGetList,
  ShiftDetailDelete,
  ShiftDetailGetListByParentId,
  ShiftDetailGetList,
  ShiftDetailGetAllList,
  ShiftFindWithAllPagerFilterAsync
} from '@/api/config.js'

import mixin from '@/views/configManagement/mixin/index.js';
import PrimaryAddOrEdit from './primaryAddOrEdit.vue';
import ChildAddOrEdit from './childAddOrEdit.vue';
import { pageSize, /* tableSize */ } from '@/config'
import { GetDictDataDetail } from '@/api/common'

/* 班次 */
export default {
  name: 'Shift',
  components: {
    PrimaryAddOrEdit,
    ChildAddOrEdit
  },
  mixins: [mixin],
  data() {
    return {
      title: '班次',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        RecordCount: 0,
        Keywords: '',
        EnCode: '',
        Order: '',
        Sort: '',
        ShiftTypeNames: [],
        ShiftStates: [],
        ShiftCode: '',
        ShiftDesc: ''
        /*  Filter: {
           ShiftType: '',
           ShiftCode: '',
           ShiftDesc: '',
           State: null
         } */
      },
      // tableSize: tableSize
      stateOptions: [],
      shiftTypeOptions: [],
    }
  },
  mounted() {
    this.handleSearch();
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'shift/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
    this.getShiftType()
    this.getState()
  },
  methods: {

    showShiftType(type) {
      let item = this.shiftTypeOptions.find(res => res.ItemCode == type)
      if (item) {
        return item.ItemName
      } else {
        return ''
      }
    },
    showShiftState(state) {
      let item = this.stateOptions.find(res => res.ItemCode == state)
      if (item) {
        return item.ItemName
      } else {
        return ''
      }
    },
    delete(id) {
      ShiftDelete({ Id: id }).then(res => {
        if (res.Success) {
          if (this.selectList[this.selectList.length - 1].ID === id) {
            this.handleSearch();
          }
        }
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
    handleChildrenEdit(item) {
      this.$refs.ChildAddOrEdit.show(this.$t('edit'), item)
    },
    handleChildrenDelete(item) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        ShiftDetailDelete(item).then(res => {
          if (res.Success) {
            this.getData();
          }
        })
      }).catch(() => {
      });
    },
    handleEdit(item) {
      this.$refs.PrimaryAddOrEdit.show(this.$t('edit'), 'Edit', item)
    },
    handleDelete(item) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        ShiftDelete(item).then(res => {
          if (res.Success) {
            this.handleSearch();
          }
        })
      }).catch(() => {
      });
    },
    handleAddChildren(id) {
      this.$refs.ChildAddOrEdit.show(this.$t('Added'), {}, id)
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
      /* Object.entries(params).forEach(([key, item]) => {
          if (key == 'Filter') {
          Object.keys(item).forEach(k => {
            if (k == 'State') {
              item[k] = item[k] === '' ? null : item[k]
            }
          })
        }
      }) */
      this.loading = true
      // let list = []
      ShiftFindWithAllPagerFilterAsync(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.tableData = [...data.Items]
          /* ShiftDetailGetAllList().then(r => {
            let l = r.ResData
            if (r.Success && l) {
              list.forEach(rr => {
                rr['Children'] = l.filter(rrr => rrr.ShiftCodeID == rr.ID)
              })
              this.tableData = list
            }
            this.loading = false;
          }, error => {
            this.loading = false;
          }) */
          this.total = data.TotalItems;
          this.loading = false;
        }

      }, error => {
        this.loading = false;
      })
    },
    getState() {
      GetDictDataDetail({ S_EnCode: 'ShiftStateItem' }).then(res => {
        if (res.Success) {
          this.stateOptions = [...res.ResData]
        }
      })
    },

    getShiftType() {
      GetDictDataDetail({ S_EnCode: 'ShiftTypeItem' }).then(res => {
        if (res.Success) {
          this.shiftTypeOptions = [...res.ResData]
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
