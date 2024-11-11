<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.Keywords" style="height: inherit;" :show-add="showAdd" :total="total"
      :show-fold="false" :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" @search="handleSearch"
      @add="handleAdd" @reset="handleReset">
      <el-button slot="button" v-hasPermi="['workOrderAttribute/BeachDelete']" type="danger" icon="el-icon-delete"
        @click="handleBeachDelete">{{
          $t('delete')
        }}</el-button>
      <!--   <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('attributeName')">
                <el-select v-model="form.DetailNameIds" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :reserve-keyword="true" :collapse-tags="true" multiple clearable filterable>
                  <el-option v-for="item in attributeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.Description }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('attributeValue')">
                <el-input v-model.trim="form.DetailValue" :placeholder="$t('pleaseInput')" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('PartNumber')">
                <el-select v-model="form.PartIds" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :reserve-keyword="true" :collapse-tags="true" multiple clearable filterable>
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
                <el-select v-model="form.LineIds" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :reserve-keyword="true" :collapse-tags="true" multiple clearable filterable>
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
      </div> -->
      <div slot="table" style="height: 100%;">
        <el-table :data="tableData" style="width: 100%;" border height="100%" :row-style="handleRowStyle"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="ID" label="ID" sortable width="80" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Description" :label="$t('describe')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>

          <el-table-column prop="ParentValueID" :label="$t('ParentValueID')" sortable min-width="150"
            show-overflow-tooltip></el-table-column>

          <el-table-column prop="ParentCheckID" :label="$t('ParentCheckID')" sortable min-width="150"
            show-overflow-tooltip></el-table-column>

          <el-table-column prop="ValueType" :label="$t('ValueType')" sortable min-width="130">
          </el-table-column>

          <el-table-column prop="Parameters" :label="$t('Parameters')" sortable min-width="150"
            show-overflow-tooltip></el-table-column>

          <el-table-column prop="Required" :label="$t('Required')" sortable min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.Required == null ? '' : scope.row.Required + '' }}</template>
          </el-table-column>
          <el-table-column prop="" :label="$t('operation')" width="100" fixed="right">
            <template slot-scope="props">
              <el-button v-hasPermi="['workOrderAttribute/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['workOrderAttribute/Delete']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleDelete(props.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </z-query>
    <PrimaryAddOrEdit ref="PrimaryAddOrEdit" @confirm="handlePrimaryConfirm"></PrimaryAddOrEdit>
  </div>
</template>

<script>
import {
  WorkOrderAttributeDeleteAsync,
  WorkOrderAttributeFindWithPagerAsync,
  WorkOrderAttributeFindWithAllPagerAsync,
} from '@/api/config.js'
import { GetluProductionOrderStatus, GetmesPart, GetmesLine } from '@/api/configCommon.js'
import mixin from '@/views/configManagement/mixin/index.js';
import PrimaryAddOrEdit from './primaryAddOrEdit.vue';
import { pageSize } from '@/config'

/* 工单属性 */
export default {
  name: 'WorkOrderAttribute',
  components: {
    PrimaryAddOrEdit
  },
  mixins: [mixin],
  data() {
    return {
      title: '工单属性',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        RecordCount: 0,
        Keywords: "",
        EnCode: "",
        Order: "",
        Sort: "",
        // "Filter": {
        //   "ID": '',
        //   "Description": "",
        //   "ParentValueID": '',
        //   "ParentCheckID": '',
        //   "ValueType": '',
        //   "CheckType": '',
        //   "Parameters": "",
        //   "Required": false
        // }
      },
      attributeOptions: [],
      statusOptions: [],
      partOptions: [],
      lineOptions: [],
    }
  },
  mounted() {
    this.handleSearch();
    this.getStatus();
    this.getParOptions();
    this.getLineOptions();
    this.getAttributeOptions(); //工单详细属性 未添加为查询条件
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'workOrderAttribute/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
  },
  methods: {
    delete(id) {
      WorkOrderAttributeDeleteAsync({ ID: id }).then(res => {
        if (res.Success) {
          if (this.selectList[this.selectList.length - 1].ID === id) {
            this.handleSearch();
          }
        }
      })
    },
    getAttributeOptions() {
      WorkOrderAttributeFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.attributeOptions = [...res.ResData]
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
        WorkOrderAttributeDeleteAsync(item).then(res => {
          if (res.Success) {
            this.handleSearch();
          }
        })
      }).catch(() => {
      });
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
      /*   Object.keys(params).forEach(key => {
          if (Array.isArray(params[key])) {
            this.$set(params, key, params[key].join(','))
          }
        }) */
      this.loading = true
      WorkOrderAttributeFindWithPagerAsync(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.tableData = [...data.Items]
          this.total = data.TotalItems
        }
        this.loading = false;
      })
    },
    getStatus() {
      GetluProductionOrderStatus().then(res => {
        if (res.Success) {
          this.statusOptions = [...res.ResData]
        }
      })
    },
    getParOptions() {
      GetmesPart().then(res => {
        if (res.Success) {
          this.partOptions = [...res.ResData]
        }
      })
    },
    getLineOptions() {
      GetmesLine().then(res => {
        if (res.Success) {
          this.lineOptions = [...res.ResData]
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
