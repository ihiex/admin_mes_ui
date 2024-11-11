<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.Keywords" style="height: inherit;" :show-add="showAdd" :total="total"
      :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" :show-fold="false"
      @switchLock="handleSwitchLock" @search="handleSearch" @add="handleAdd" @reset="handleReset">
      <el-button slot="button" v-hasPermi="['BOMProductStructure/BeachDelete']" type="danger" icon="el-icon-delete"
        @click="handleBeachDelete">{{
          $t('delete')
        }}</el-button>
      <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('ParentPart')">
                <el-select v-model="form.ParentPartIDs" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :reserve-keyword="true" :collapse-tags="true" multiple clearable filterable>
                  <el-option v-for="item in options" :key="item.ID" :label="item.PartNumber" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.PartNumber }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('PartNumber')">
                <el-select v-model="form.PartIDs" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :reserve-keyword="true" :collapse-tags="true" multiple clearable filterable>
                  <el-option v-for="item in options" :key="item.ID" :label="item.PartNumber" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.PartNumber }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('StationType')">
                <el-select v-model="form.StationTypeIDs" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :reserve-keyword="true" :collapse-tags="true" multiple clearable filterable>
                  <el-option v-for="item in stationOptions" :key="item.ID" :label="item.Description" :value="item.ID">
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
      </div>
      <div slot="table" style="height: 100%;">
        <el-table v-if="update"  :data="tableData" style="width: 100%;" :default-expand-all="expandAll" height="100%"
          :row-style="handleRowStyle" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="ID" label="ID" sortable width="80" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="ParentName" :label="$t('ParentPart')" sortable min-width="130"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="ChildName" :label="$t('PartNumber')" sortable min-width="130"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="StationTypeName" :label="$t('StationType')" sortable min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="SEQ" label="SEQ" sortable min-width="100"></el-table-column>
          <el-table-column prop="StatusDesc" :label="$t('Status')" sortable min-width="100"></el-table-column>
          <el-table-column prop="" :label="$t('operation')" width="100" fixed="right">
            <template slot-scope="props">
              <el-button v-hasPermi="['BOMProductStructure/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['BOMProductStructure/Delete']" size="mini" type="danger" icon="el-icon-delete"
                circle @click="handleDelete(props.row)"></el-button>
              <!-- <el-button v-hasPermi="['BOMProductStructure/Clone']" size="mini" icon="el-icon-copy-document" circle
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
  BOMProductStructureDeleteAsync,
  BOMProductStructureFindWithPagerSearchAsync,
  PartFindWithAllPagerAsync
} from '@/api/config.js'
import { GetmesStationType, GetsysStatus } from '@/api/configCommon.js'
import mixin from '@/views/configManagement/mixin/index.js';
import AddOrEdit from './AddOrEdit.vue';
import { pageSize } from '@/config'

/* BOM管理 */
export default {
  name: 'BOMProductStructure',
  components: {
    AddOrEdit,
  },
  mixins: [mixin],
  data() {
    return {
      title: 'BOM管理',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        RecordCount: 0,
        Keywords: "",
        EnCode: "",
        Order: "",
        Sort: "",
        Status: "",
        ParentPartIDs: [],
        StationTypeIDs: [],
        PartIDs: []
      },
      options: [],
      statusOptions: [],
      stationOptions: []
    }
  },
  mounted() {
    this.handleSearch();
    this.getPartNumber();
    this.getStationType();
    this.getStatus();
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'BOMProductStructure/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
  },
  methods: {
    delete(id) {
      BOMProductStructureDeleteAsync({ ID: id }).then(res => {
        if (res.Success) {
          if (this.selectList[this.selectList.length - 1].ID === id) {
            this.handleSearch();
          }
        }
      })
    },
    getStationType() {
      GetmesStationType().then(res => {
        if (res.Success) {
          this.stationOptions = [...res.ResData]
        }
      })
    },
    getStatus() {
      GetsysStatus().then(res => {
        if (res.Success) {
          this.statusOptions = [...res.ResData]
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

    handleEdit(item) {
      this.$refs.AddOrEdit.show(this.$t('edit'), 'Edit', item)
    },
    handleDelete(item) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        BOMProductStructureDeleteAsync(item).then(res => {
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
      BOMProductStructureFindWithPagerSearchAsync(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.tableData = [...data.Items]
          this.total = data.TotalItems
        }
        this.loading = false;
      })
    },
    getPartNumber() {
      PartFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.options = [...res.ResData]
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
