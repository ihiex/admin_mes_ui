<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.LikeQuery" style="height: inherit;" :show-add="showAdd" :total="total"
      :show-fold="false" :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex"
      @switchLock="handleSwitchLock" @search="handleSearch" @add="handleAdd" @reset="handleReset">
      <el-button slot="button" v-hasPermi="['lineGroup/BeachDelete']" type="danger" icon="el-icon-delete"
        @click="handleBeachDelete">{{
          $t('delete')
        }}</el-button>
      <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="110px" @submit.native.prevent>
          <el-row :gutter="10">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('Line')">
                <el-select v-model="form.LineID" multiple :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" filterable :reserve-keyword="true" clearable>
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
              <el-form-item :label="$t('lineGroupName')">
                <el-select v-model="form.LineGroupName" multiple :placeholder="$t('pleaseSelect')" :collapse-tags="true"
                  style="width: 100%;" filterable :reserve-keyword="true" clearable>
                  <el-option v-for="item in lineGroupOptions" :key="item.ID" :label="item.Name" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.Name }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('partGroupName')">
                <el-select v-model="form.PartFamilyTypeID" multiple :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" filterable :reserve-keyword="true" clearable>
                  <el-option v-for="item in partFamilyTypeOptions" :key="item.ID" :label="item.Description"
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
          <el-table-column prop="ID" label="ID" sortable width="80" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="LineGroupName" :label="$t('describe')" sortable min-width="130"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Line" :label="$t('Line')" sortable min-width="150"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="LineNumber" :label="$t('LineNumber')" sortable min-width="130"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="LineType" :label="$t('lineType')" sortable min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="PartFamilyType" :label="$t('partGroupName')" sortable min-width="150"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="" :label="$t('operation')" width="130" min-width="130" fixed="right">
            <template slot-scope="props">
              <el-button v-hasPermi="['lineGroup/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['lineGroup/Delete']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleDelete(props.row.ID)"></el-button>
              <el-button v-hasPermi="['lineGroup/Clone']" size="mini" icon="el-icon-copy-document" circle
                @click="handleClone(props.row)"></el-button>
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
  MesLineGroupDelete,
  MesLineGroupFindWithPagerSearchAsync,
} from '@/api/config.js'
import { GetluPartFamilyType, GetmesLine, GetLineGroupName } from '@/api/configCommon.js'
import mixin from '@/views/configManagement/mixin/index.js';
import PrimaryAddOrEdit from './primaryAddOrEdit.vue';
import { pageSize } from '@/config'

/* 线别分组 */
export default {
  name: 'LineGroup',
  components: {
    PrimaryAddOrEdit
  },
  mixins: [mixin],
  data() {
    return {
      title: '线别分组',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        LikeQuery: '',
        ID: '',
        /*  LineName: '',
         StatusID: null,
         StatusValue: '',
         LineTypeDefID: '',
         LineTypeDefValue: '',
         PropertyContent: '', */
        LineGroupName: '',
        LineID: '',
        Line: '',
        LineNumber: '',
        LineType: '',
        PartFamilyTypeID: '',
        PartFamilyType: ''

      },
      lineOptions: [],
      partFamilyTypeOptions: [],
      lineGroupOptions: [],
    }
  },
  mounted() {
    this.handleSearch();
    this.getLine();
    this.getLineGroup();
    this.getPartFamilyType();
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'lineGroup/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
  },
  methods: {
    delete(id) {
      MesLineGroupDelete({ Id: id }).then(res => {
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
    handleDelete(id) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        MesLineGroupDelete({ Id: id }).then(res => {
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
      MesLineGroupFindWithPagerSearchAsync(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.tableData = [...data.Items]
          this.total = data.TotalItems
        }
        this.loading = false;
      })
    },
    getLine() {
      GetmesLine().then(res => {
        if (res.Success) {
          this.lineOptions = [...res.ResData]
        }
      })
    },
    getLineGroup() {
      GetLineGroupName().then(res => {
        if (res.Success) {
          this.lineGroupOptions = [...res.ResData]
        }
      })
    },
    getPartFamilyType() {
      GetluPartFamilyType().then(res => {
        if (res.Success) {
          this.partFamilyTypeOptions = [...res.ResData]
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
