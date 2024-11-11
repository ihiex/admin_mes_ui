<template>
  <div class="page_container">
    <z-query ref="ZQuery" v-model.trim="form.Keywords" style="height: inherit;" :show-add="showAdd" :show-fold="false"
      :total="total" :page-size="form.PageSize" :current-page-index="form.CurrentPageIndex" @search="handleSearch"
      @reset="handleReset" @add="handleAdd">
      <!--  <div style="margin-top: 20px;">
        <el-form ref="form" :model="form" label-width="90px" @submit.native.prevent>
          <el-row :gutter="10">
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
      <el-button slot="button" v-hasPermi="['attributeConfig/InitBaseData']" type="danger" @click="handleInitData">{{ $t('InitBaseData') }}</el-button>
      <div slot="table" style="height: 100%; display: flex;">
        <el-table v-loading="loading" :data="tableData" style="flex-direction: column; flex: 2; width: 100%;"
          :default-expand-all="false" height="100%" :highlight-current-row="true" row-key="ID"
          :current-row-key="currentRowKey"  @row-click="handleRowClick">
          <!--   <el-table-column prop="ID" label="ID" sortable width="130" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column> -->
          <el-table-column prop="Description" :label="$t('describe')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>
        </el-table>
        <el-table v-loading="childLoading" :data="childTableData" style="width: 100%; flex-direction: column; flex: 7;"
          border :default-expand-all="false" height="100%">
          <el-table-column prop="ID" label="ID" sortable width="130" :sort-method="handleSortMethod"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="Description" :label="$t('describe')" sortable min-width="180"
            show-overflow-tooltip></el-table-column>
          <el-table-column prop="" :label="$t('operation')" width="140" fixed="right">
            <template slot-scope="props">
              <el-button v-hasPermi="['attributeConfig/Edit']" size="mini" type="primary" icon="el-icon-edit" circle
                @click="handleChildrenEdit(props.row)"></el-button>
              <el-button v-hasPermi="['attributeConfig/Delete']" size="mini" type="danger" icon="el-icon-delete" circle
                @click="handleChildrenDelete(props.row)"></el-button>
              <el-button v-hasPermi="['attributeConfig/Clone']" size="mini" icon="el-icon-copy-document" circle
                @click="handleClone(props.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </z-query>
    <ChildAddOrEdit ref="ChildAddOrEdit" @confirm="handlePrimaryConfirm"></ChildAddOrEdit>
  </div>
</template>

<script>
import {
  GetCommonTabList,
  AttributeFindWithPagerAsync,
  AttributeDeleteAsync,
} from '@/api/config.js'
import mixin from '@/views/configManagement/mixin/index.js';
import ChildAddOrEdit from './childAddOrEdit.vue';
import { pageSize } from '@/config'
import { InitializeBaseData } from '@/api/configCommon.js'
/* 属性名配置 */
export default {
  name: 'AttributeConfig',
  components: {
    ChildAddOrEdit
  },
  mixins: [mixin],
  data() {
    return {
      title: '属性名配置',
      form: {
        PageSize: pageSize,
        CurrentPageIndex: 1,
        RecordCount: 0,
        Keywords: "",
        EnCode: "",
        Order: "asc",
        Sort: "",
        TableName: "",
      },
      childTableData: [],
      loading: false,
      childLoading: false,
      currentRowKey: ''
    }
  },
  mounted() {
    this.getCommonTabList();
    let per = this.$store.getters['user/modulePermissions']
    let res = per.some(r => r === 'attributeConfig/Add')
    if (res) {
      this.showAdd = true
    } else {
      this.showAdd = false
    }
  },
  methods: {
    handleInitData() {
      this.$confirm(this.$t('InitBaseData') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        InitializeBaseData().then(res => {
          if (res.Success) {
            this.$message({
              message: this.$t('InitializeBasicData', { 0: this.$t('Success') }),
              type: 'success'
            });
          }
        })
      }).catch(() => {
      });

    },
    handleAdd() {
      this.form.ID = 0
      this.$refs.ChildAddOrEdit.show(this.$t('Added'), this.form, 'Add')
    },
    getCommonTabList() {
      this.loading = true
      GetCommonTabList().then(res => {
        if (res.Success) {
          this.tableData = [...res.ResData]
          this.currentRowKey = this.tableData[0].ID
          this.$set(this.form, 'TableName', this.tableData[0].Description)
          this.handleRowClick(this.tableData[0])
        }
        this.loading = false
      }, error => {
        this.loading = false
      })
    },
    handleRowClick(item) {
      this.$set(this.form, 'TableName', item.Description)
      this.$set(this.form, 'CurrentPageIndex', 1)
      this.getData()
    },
    handleSortMethod(a, b) {
      return a.ID < b.ID
    },
    handlePrimaryConfirm(val) {
      switch (val) {
        case 'Edit':
        case 'Clone':
          this.getData()
          break;
        default:
          this.handleSearch()
      }
    },

    handleChildrenEdit(item) {
      this.$refs.ChildAddOrEdit.show(this.$t('edit'), { ...item, TableName: this.form.TableName }, 'Edit')
    },
    handleClone(item) {
      this.$refs.ChildAddOrEdit.show(this.$t('clone'), { ...item, TableName: this.form.TableName }, 'Clone')
    },
    handleChildrenDelete(item) {
      this.$confirm(this.$t('delete') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        AttributeDeleteAsync({ ...item, TableName: this.form.TableName }).then(res => {
          if (res.Success) {
            this.getData();
          }
        })
      }).catch(() => {
      });
    },

    handleAddChildren(row) {
      this.$refs.ChildAddOrEdit.show(this.$t('Added'), row, 'Add')
    },

    handleSearch(item) {
      if (item) {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
      } else {
        this.$set(this.form, 'CurrentPageIndex', 1)
      }
      this.getData()
    },
    getData() {
      let params = JSON.parse(JSON.stringify(this.form))
      this.childLoading = true
      this.childTableData = []
      AttributeFindWithPagerAsync(params).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.childTableData = [...data.Items]
          this.total = data.TotalItems
        }
        this.childLoading = false;
      }, error => {
        this.childLoading = false;
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
