<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.LikeQuery" style="height: inherit;" :show-add="showAdd" :total="total"
      :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" @switchLock="handleSwitchLock"
      @search="handleSearch" @add="handleAdd" @reset="handleReset">
      <el-button slot="button" v-hasPermi="['label/BeachDelete']" type="danger" icon="el-icon-delete"
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
              <el-form-item :label="$t('attributeValue')">
                <el-input v-model.trim="form.LabelFieldDefName" :placeholder="$t('pleaseInput')" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('LabelFamily')">
                <el-select v-model="form.LabelFamilyID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" :reserve-keyword="true" multiple clearable filterable @focus="handleFocus">
                  <el-option v-for="item in labelFamilyOptions" :key="item.ID" :label="item.Description"
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
        <!-- :size="tableSize" -->
        <el-table v-if="update" :data="tableData" style="width: 100%;" :default-expand-all="expandAll" height="100%"
          :row-style="handleRowStyle" border  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.Children" style="width: 100%" size="mini" border :show-header="true">
                <el-table-column prop="ID" label="ID" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="LabelFormatPosKey" :label="$t('LabelFormatPos')" width="200"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="DefName" :label="$t('DefineName')" width="200" show-overflow-tooltip>
                </el-table-column>

                <el-table-column prop="Order" :label="$t('Order')" width="80" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="Description" :label="$t('describe')" min-width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="" :label="$t('operation')" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button v-hasPermi="['WOMaintenance/EditChild']" size="mini" type="primary" icon="el-icon-edit"
                      circle @click="handleChildrenEdit(scope.row)"></el-button>
                    <el-button v-hasPermi="['WOMaintenance/DeleteChild']" size="mini" type="danger"
                      icon="el-icon-delete" circle @click="handleChildrenDelete(scope.row.ID)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="ID" label="ID" sortable width="80" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Name" :label="$t('name')" sortable min-width="130"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Description" :label="$t('describe')" sortable min-width="130"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="LabelFamily" :label="$t('LabelFamily')" sortable min-width="130"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="LabelTypeName" :label="$t('LabelType')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="TargetPath" :label="$t('TargetPath')" sortable min-width="130"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="SourcePath" :label="$t('SourcePath')" sortable min-width="250"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="PageCapacity" :label="$t('PageCapacity')" sortable min-width="150"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="PrintCMD" :label="$t('PrintCMD')" sortable min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="OutputTypeName" :label="$t('OutputType')" sortable min-width="150"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="" :label="$t('operation')" width="170" fixed="right">
            <template slot-scope="props">
              <el-button v-hasPermi="['label/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['label/Delete']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleDelete(props.row.ID)"></el-button>
              <el-button v-hasPermi="['label/AddChild']" size="mini" icon="el-icon-plus" circle
                @click="handleAddChildren(props.row.ID)"></el-button>
              <el-button v-hasPermi="['label/Clone']" size="mini" icon="el-icon-copy-document" circle
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
  LabelDelete,
  LabelFindWithPagerSearchAsync,
  LabelDeleteDetail,
} from '@/api/config.js'

import { GetluLabelFamily } from '@/api/configCommon.js'
import mixin from '@/views/configManagement/mixin/index.js';
import PrimaryAddOrEdit from './primaryAddOrEdit.vue';
import ChildAddOrEdit from './childAddOrEdit.vue';
import { pageSize, /* tableSize */ } from '@/config'

/* 标签 */
export default {
  name: 'Label',
  components: {
    PrimaryAddOrEdit,
    ChildAddOrEdit
  },
  mixins: [mixin],
  data() {
    return {
      title: '标签',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        LikeQuery: '',
        ID: '',
        Name: '',
        Description: '',
        LabelFamilyID: '',
        LabelFamily: '',
        LabelType: '',
        LabelTypeName: '',
        TargetPath: '',
        OutputType: '',
        OutputTypeName: '',
        PrintCMD: '',
        SourcePath: '',
        PageCapacity: '',
        LabelFieldDefName: ''
      },
      labelFamilyOptions: [],
      // tableSize: tableSize
    }
  },
  mounted() {
    this.handleSearch();
    this.getLabelFamily();
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'label/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
  },
  methods: {
    delete(id) {
      LabelDelete({ Id: id }).then(res => {
        if (res.Success) {
          if (this.selectList[this.selectList.length - 1].ID === id) {
            this.handleSearch();
          }
        }
      })
    },
    handleFocus() {
      this.getLabelFamily()
    },
    getLabelFamily() {
      GetluLabelFamily().then(res => {
        if (res.Success) {
          this.labelFamilyOptions = [...res.ResData]
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
        LabelDeleteDetail({ Id: id }).then(res => {
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
        LabelDelete({ Id: id }).then(res => {
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
      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          this.$set(params, key, params[key].join(','))
        }
      })
      this.loading = true
      LabelFindWithPagerSearchAsync(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.tableData = [...data.Items]
          this.total = data.TotalItems
        }
        this.loading = false;
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
