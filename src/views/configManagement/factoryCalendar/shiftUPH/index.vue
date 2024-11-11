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
              <el-form-item :label="$t('Shift')" prop="ShiftID">
                <el-select v-model="form.Filter.ShiftID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" :reserve-keyword="true" filterable multiple clearable>
                  <el-option v-for="item in shiftOptions" :key="item.ID" :label="item.ShiftCode" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.ShiftCode }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('Line')">
                <el-select v-model="form.Filter.LineID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
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
              <el-form-item :label="$t('status')" prop="State">
                <el-select v-model="form.Filter.State" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" clearable filterable>
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
          <el-table-column prop="" :label="$t('operation')" width="150" fixed="right">
            <template slot-scope="props">
              <el-button v-hasPermi="['shift/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['shift/Delete']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleDelete(props.row)"></el-button>
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
  ShiftUPHDelete,
  ShiftUPHGetList,
  ShiftGetAllList,
} from '@/api/config.js'

import mixin from '@/views/configManagement/mixin/index.js';
import PrimaryAddOrEdit from './primaryAddOrEdit.vue';
import { pageSize, /* tableSize */ } from '@/config'
import { GetDictDataDetail } from '@/api/common'
import {
  GetmesLine,
} from '@/api/configCommon.js'

/* 班次UPH */
export default {
  name: 'ShiftUPH',
  components: {
    PrimaryAddOrEdit
  },
  mixins: [mixin],
  data() {
    return {
      title: '班次UPH',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        RecordCount: 0,
        Keywords: '',
        EnCode: '',
        Order: '',
        Sort: '',
        Filter: {
          ShiftID: '',
          LineID: '',
          UPH: '',
          YieldTarget: '',
          CreateTime: '',
          UpdateTime: '',
          State: '',
          ShiftDate: '',
        }
      },
      // tableSize: tableSize
      stateOptions: [],
      shiftOptions: [],
      lineOptions: [],

    }
  },
  mounted() {
    this.handleSearch();
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'label/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
    this.getShift()
    this.getState()
    this.getLine()
  },
  methods: {

    showShiftType(type) {
      let item = this.shiftOptions.find(res => res.ItemCode == type)
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
      ShiftUPHDelete({ Id: id }).then(res => {
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

    handleEdit(item) {
      this.$refs.PrimaryAddOrEdit.show(this.$t('edit'), 'Edit', item)
    },
    handleDelete(item) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        ShiftUPHDelete(item).then(res => {
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
      ShiftUPHGetList(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.tableData = [...data.Items]
        }
        this.loading = false;
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

    getShift() {
      ShiftGetAllList().then(res => {
        if (res.Success) {
          this.shiftOptions = [...res.ResData]
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
