<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.LikeQuery" style="height: inherit;" :show-add="showAdd" :total="total"
      :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" @switchLock="handleSwitchLock"
      @search="handleSearch" @add="handleAdd" @reset="handleReset">
      <el-button slot="button" v-hasPermi="['stationType/BeachDelete']" type="danger" icon="el-icon-delete"
        @click="handleBeachDelete">{{
          $t('delete')
        }}</el-button>
      <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('ApplicationType')">
                <el-select v-model="form.ApplicationTypeID" :placeholder="$t('pleaseSelect')" :collapse-tags="true"
                  :reserve-keyword='true' style="width: 100%;" multiple filterable clearable>
                  <el-option v-for="item in appOptions" :key="item.ID" :label="item.Description" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.Description }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('attributeName')">
                <el-select v-model="form.StationTypeDetailDefID" multiple filterable :placeholder="$t('pleaseSelect')"
                  style="width: 100%;" :collapse-tags="true" :reserve-keyword='true' clearable value-key="ID">
                  <el-option v-for="item in options" :key="item.ID" :label="item.Description" :value="item.ID">
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
                <el-input v-model.trim="form.Content" :placeholder="$t('pleaseInput')" clearable></el-input>
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
        <el-table v-if="update" :data="tableData" style="width: 100%;" :default-expand-all="expandAll" height="100%"
          :row-style="handleRowStyle" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <!-- <el-row v-for="item in props.row.Children" :key="item.ID" :gutter="10"
                style="height: 30px; line-height: 30px; font-size: 14px;">
                <el-col :span="2">
                  {{ item.ID }}
                </el-col>
                <el-col :span="6" :title="item.StationTypeDetailDef" style="overflow: hidden;text-overflow: ellipsis;">
                  {{ item.StationTypeDetailDef ? item.StationTypeDetailDef : ' &nbsp;&nbsp; ' }}
                </el-col>
                <el-col :span="7" :title="item.Content" style="overflow: hidden;text-overflow: ellipsis;">
                  {{ item.Content ? item.Content : ' &nbsp;&nbsp; ' }}
                </el-col>
                <el-col :span="5" :title="item.Description" style="overflow: hidden; text-overflow: ellipsis;">
                  {{ item.Description ? item.Description : ' &nbsp;&nbsp; ' }}
                </el-col>
                <el-col :span="4">
                  <el-button v-hasPermi="['stationType/EditChild']" size="mini" type="primary" icon="el-icon-edit" circle
                    @click="handleChildrenEdit(item)"></el-button>
                  <el-button v-hasPermi="['stationType/DeleteChild']" size="mini" type="danger" icon="el-icon-delete"
                    circle @click="handleChildrenDelete(item.ID)"></el-button>
                </el-col>
              </el-row> -->
              <el-table :data="props.row.Children" style="width: 100%" :show-header="false">
                <el-table-column prop="ID">
                </el-table-column>
                <el-table-column prop="StationTypeDetailDef" min-width="100" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="Content" min-width="90" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column prop="Description" min-width="100" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope" width="100">
                    <el-button v-hasPermi="['stationType/EditChild']" size="mini" type="primary" icon="el-icon-edit"
                      circle @click="handleChildrenEdit(scope.row)"></el-button>
                    <el-button v-hasPermi="['stationType/DeleteChild']" size="mini" type="danger" icon="el-icon-delete"
                      circle @click="handleChildrenDelete(scope.row.ID)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="ID" label="ID" sortable width="80" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Description" :label="$t('describe')" sortable min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="ApplicationType" :label="$t('ApplicationType')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="" :label="$t('operation')" width="170" fixed="right">
            <template slot-scope="props">
              <el-button v-hasPermi="['stationType/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['stationType/Delete']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleDelete(props.row.ID)"></el-button>
              <el-button v-hasPermi="['stationType/AddChild']" size="mini" icon="el-icon-plus" circle
                @click="handleAddChildren(props.row.ID)"></el-button>
              <el-button v-hasPermi="['stationType/Clone']" size="mini" icon="el-icon-copy-document" circle
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
  MesStationTypeDelete,
  MesStationTypeFindWithPagerSearchAsync,
  MesStationTypeDeleteDetail
} from '@/api/config.js'
import { GetluApplicationType, GetluStationTypeDetailDef } from '@/api/configCommon.js';
import mixin from '@/views/configManagement/mixin/index.js';
import PrimaryAddOrEdit from './primaryAddOrEdit.vue';
import ChildAddOrEdit from './childAddOrEdit.vue';
import { pageSize } from '@/config';

/* 工站类型 */
export default {
  name: 'StationType',
  components: {
    PrimaryAddOrEdit,
    ChildAddOrEdit
  },
  mixins: [mixin],
  data() {
    return {
      title: '工站类型',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        LikeQuery: '',
        ID: '',
        ApplicationType: '',
        ApplicationTypeID: '',
        StationTypeDetailDef: '',
        StationTypeDetailDefID: '',
        DetailDescription: '',
        Description: ''
      },
      options: [],
      appOptions: [],
    }
  },
  mounted() {
    this.handleSearch();
    this.getAppType();
    this.getStationType();
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'stationType/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
  },
  methods: {
    delete(id) {
      MesStationTypeDelete({ Id: id }).then(res => {
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
    handleChildrenDelete(id) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        MesStationTypeDeleteDetail({ Id: id }).then(res => {
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
    handleDelete(id) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        MesStationTypeDelete({ Id: id }).then(res => {
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
      /*  GetluApplicationType().then(res => {
         console.log(res)
       })
       GetluStationTypeDetailDef().then(res => {
         console.log(res)
       }) */
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
      MesStationTypeFindWithPagerSearchAsync(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.tableData = [...data.Items]
          this.total = data.TotalItems
        }
        this.loading = false;
      })
    },
    getStationType() {
      GetluStationTypeDetailDef().then(res => {
        if (res.Success) {
          this.options = [...res.ResData]
        }
      })
    },
    getAppType() {
      GetluApplicationType().then(res => {
        if (res.Success) {
          this.appOptions = [...res.ResData]
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
