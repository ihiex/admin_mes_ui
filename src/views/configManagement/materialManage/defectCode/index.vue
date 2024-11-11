<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.Keywords" style="height: inherit;" :show-add="showAdd" :total="total"
      :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" :show-fold="false"
      @switchLock="handleSwitchLock" @search="handleSearch" @add="handleAdd" @reset="handleReset">
      <el-button slot="button" v-hasPermi="['defectCode/BeachDelete']" type="danger" icon="el-icon-delete"
        @click="handleBeachDelete">{{
          $t('delete')
        }}</el-button>
      <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="110px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('DefectType')">
                <el-select v-model="form.DefectTypeIds" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :reserve-keyword="true" :collapse-tags="true" multiple clearable filterable>
                  <el-option v-for="item in DefectTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.Description }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('DefectCode')">
                <el-input v-model.trim="form.DefectCode" :placeholder="$t('pleaseInput')" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('status')">
                <el-select v-model="form.Status" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable>
                  <el-option v-for="item in statusOptions" :key="item.ID" :label="item.Description" :value="item.ID">
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
        <el-table v-if="update" :data="tableData" style="width: 100%;" :default-expand-all="expandAll" height="100%"
          :row-style="handleRowStyle" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="ID" label="ID" sortable width="80" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="DefectType" :label="$t('DefectType')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="DefectCode" :label="$t('DefectCode')" sortable min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Status" :label="$t('status')" sortable min-width="100" show-overflow-tooltip>
            <template slot-scope="props">
              {{ getStatusDesc(props.row.Status) }}
            </template>
          </el-table-column>
          <el-table-column prop="Description" :label="$t('describe')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="" :label="$t('operation')" width="100" fixed="right">
            <template slot-scope="props">
              <el-button v-hasPermi="['defectCode/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['defectCode/Delete']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleDelete(props.row)"></el-button>
              <!-- <el-button v-hasPermi="['defectCode/Clone']" size="mini" icon="el-icon-copy-document" circle
                @click="handleClone(props.row)"></el-button> -->
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
  DefectCodeDeleteAsync,
  DefectCodeFindWithPagerSearchAsync,
  DefectTypeFindWithAllPagerAsync
} from '@/api/config.js'
import { GetsysStatus } from '@/api/configCommon.js'
import mixin from '@/views/configManagement/mixin/index.js';
import AddOrEdit from './AddOrEdit';
import { pageSize } from '@/config'

/* 不良代码 */
export default {
  name: 'DefectCode',
  components: {
    AddOrEdit,
  },
  mixins: [mixin],
  data() {
    return {
      title: '不良代码',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        "RecordCount": 0,
        "Keywords": "",
        "EnCode": "",
        "Order": "",
        "Sort": "",
        "Status": "",
        "DefectTypeIds": [],
        "DefectCode": "",
        "DefectDesc": ""
      },
      statusOptions: [],
      DefectTypeOptions: []
    }
  },
  mounted() {
    this.handleSearch();
    this.getStatus();
    this.getDefectType();
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'defectCode/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
  },
  methods: {
    delete(id) {
      DefectCodeDeleteAsync({ ID: id }).then(res => {
        if (res.Success) {
          if (this.selectList[this.selectList.length - 1].ID === id) {
            this.handleSearch();
          }
        }
      })
    },
    getDefectType() {
      DefectTypeFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.DefectTypeOptions = [...res.ResData]
        }
      })
    },
    getStatusDesc(val) {
      let obj = this.statusOptions.find(item => item.ID === val)
      return obj ? obj.Description : ''
    },
    /*     handleClone(item) {
          this.$refs.AddOrEdit.show(this.$t('clone'), 'Clone', item)
        }, */
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
    handleDelete(item) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        DefectCodeDeleteAsync(item).then(res => {
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
      if (row.Status === 2) {
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
      /* Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          this.$set(params, key, params[key].join(','))
        }
      }) */
      this.loading = true
      DefectCodeFindWithPagerSearchAsync(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.tableData = [...data.Items]
          this.total = data.TotalItems
        }
        this.loading = false;
      })
    },
    getStatus() {
      GetsysStatus().then(res => {
        if (res.Success) {
          this.statusOptions = [...res.ResData]
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
