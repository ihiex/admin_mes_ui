<template>
  <div v-loading="loading" class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.LikeQuery" style="height: inherit;" :show-add="showAdd" :total="total"
      :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" @switchLock="handleSwitchLock"
      @search="handleSearch" @add="handleAdd" @reset="handleReset">
      <el-button slot="button" v-hasPermi="['SNFormat/BeachDelete']" type="danger" icon="el-icon-delete"
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
              <el-form-item :label="$t('NodeTypes')">
                <el-select v-model="form.SectionTypeID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" :reserve-keyword="true" filterable multiple clearable>
                  <el-option v-for="item in stationTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
                    <div class="select_option">
                      <span>{{ item.Description }}</span>
                      <span>{{ item.ID }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
              <el-form-item :label="$t('SNFamily')">
                <el-select v-model="form.SNFamilyID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
                  :collapse-tags="true" multiple clearable filterable>
                  <el-option v-for="item in SNFamilyOptions" :key="item.ID" :label="item.Description" :value="item.ID">
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
        <el-table v-if="update" :data="tableData" style="width: 100%;" :default-expand-all="expandAll" height="100%" border
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.Children" style="width: 100%" size="mini" border :show-header="true">
                <el-table-column prop="ID" label="ID" min-width="60" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="SNFormat" :label="$t('SNFormat')" min-width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="SectionType" :label="$t('NodeTypes')" min-width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="SectionParam" :label="$t('NodeParams')" min-width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="Increment" :label="$t('Increment')" min-width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="InvalidChar" :label="$t('InvalidChar')" min-width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="LastUsed" :label="$t('LastUsed')" min-width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="AllowReset" :label="$t('AllowReset')" min-width="100">
                  <template slot-scope="scope">
                    {{ scope.row.AllowReset ? 'true' : 'false' }}
                  </template>
                </el-table-column>
                <el-table-column prop="Order" :label="$t('Order')" min-width="80" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="" :label="$t('operation')" width="100">
                  <template slot-scope="scope">
                    <el-button v-hasPermi="['SNFormat/EditChild']" size="mini" type="primary" icon="el-icon-edit" circle
                      @click="handleChildrenEdit(scope.row)"></el-button>
                    <el-button v-hasPermi="['SNFormat/DeleteChild']" size="mini" type="danger" icon="el-icon-delete"
                      circle @click="handleChildrenDelete(scope.row.ID)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- <el-row v-for="item in props.row.Children" :key="item.ID" :gutter="10"
                style="height: 30px; line-height: 30px; font-size: 14px; border: 1px solid red">
                <el-col :span="2">
                  {{ item.ID }}
                </el-col>
                <el-col :span="3" :title="item.SNFormat">
                  {{ item.SNFormat }}
                </el-col>
                <el-col :span="3" :title="item.SectionTypeName" style="overflow: hidden;text-overflow: ellipsis;">
                  {{ item.SectionTypeName }}
                </el-col>
                <el-col :span="3" :title="item.SectionParam" style="overflow: hidden;text-overflow: ellipsis;">
                  {{ item.SectionParam }}
                </el-col>
                <el-col :span="1" :title="item.Increment" style="overflow: hidden;text-overflow: ellipsis;">
                  {{ item.Increment }}
                </el-col>
                <el-col :span="2" :title="item.InvalidChar" style="overflow: hidden;text-overflow: ellipsis;">
                  {{ item.InvalidChar }}
                </el-col>
                <el-col :span="3" :title="item.LastUsed" style="overflow: hidden;text-overflow: ellipsis;">
                  {{ item.LastUsed }}
                </el-col>
                <el-col :span="2" :title="item.AllowReset" style="overflow: hidden;text-overflow: ellipsis;">
                  {{ item.AllowReset }}
                </el-col>
                <el-col :span="1" :title="item.Order" style="overflow: hidden;text-overflow: ellipsis;">
                  {{ item.Order }}
                </el-col>
                <el-col :span="4">
                  <el-button v-hasPermi="['SNFormat/EditChild']" size="mini" type="primary" icon="el-icon-edit"
                    circle @click="handleChildrenEdit(item)"></el-button>
                  <el-button v-hasPermi="['SNFormat/DeleteChild']" size="mini" type="danger" icon="el-icon-delete"
                    circle @click="handleChildrenDelete(item.ID)"></el-button>
                </el-col>
              </el-row> -->
            </template>
          </el-table-column>
          <el-table-column prop="ID" label="ID" sortable width="80" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Name" :label="$t('name')" sortable min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Description" :label="$t('describe')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="SNFamily" :label="$t('SNFamily')" sortable min-width="120"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="" :label="$t('operation')" width="170">
            <template slot-scope="props">
              <el-button v-hasPermi="['SNFormat/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleEdit(props.row)"></el-button>
              <el-button v-hasPermi="['SNFormat/Delete']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleDelete(props.row.ID)"></el-button>
              <el-button v-hasPermi="['SNFormat/AddChild']" size="mini" icon="el-icon-plus" circle
                @click="handleAddChildren(props.row.ID)"></el-button>
              <el-button v-hasPermi="['SNFormat/Clone']" size="mini" icon="el-icon-copy-document" circle
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
  SNFormatDelete,
  SNFormatFindWithPagerSearchAsync,
  SNFormatChildDelete,
} from '@/api/config.js'
import {
  GetSectionType,
  GetluSNFamily
} from '@/api/configCommon.js'
import mixin from '@/views/configManagement/mixin/index.js';
import PrimaryAddOrEdit from './primaryAddOrEdit.vue';
import ChildAddOrEdit from './childAddOrEdit.vue';
import { pageSize } from '@/config'

/* 条码格式 */
export default {
  name: 'SNFormat',
  components: {
    PrimaryAddOrEdit,
    ChildAddOrEdit
  },
  mixins: [mixin],
  data() {
    return {
      title: '条码格式',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        LikeQuery: '',
        ID: '',
        Name: '',
        Description: '',
        SNFamilyID: '',
        SNFamily: '',
        SectionTypeID: '',
        SectionType: '',
        SectionParam: '',
        Increment: '',
        InvalidChar: '',
        LastUsed: '',
        // AllowReset: '',
      },
      stationTypeOptions: [],
      SNFamilyOptions: []
    }
  },
  mounted() {
    this.handleSearch();
    this.getStationType();
    this.getSNFamily();
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'SNFormat/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
  },
  methods: {
    delete(id) {
      SNFormatDelete({ Id: id }).then(res => {
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
      this.$refs.ChildAddOrEdit.show(this.$t('edit'), JSON.parse(JSON.stringify(item)))
    },
    handleChildrenDelete(id) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        SNFormatChildDelete({ Id: id }).then(res => {
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
        SNFormatDelete({ Id: id }).then(res => {
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
      SNFormatFindWithPagerSearchAsync(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.tableData = [...data.Items]
          this.total = data.TotalItems
        }
        this.loading = false;
      })
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
