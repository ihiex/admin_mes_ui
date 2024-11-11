<template>
  <div class="app-container">
    <div class="filter-container">
      <el-card>
        <el-form
          ref="searchDbform"
          :inline="true"
          :model="searchform"
          class="demo-form-inline"
          size="small"
        >
          <el-form-item :label="$t('databaseAddress')" prop="DbAddress">
            <el-input
              v-model="searchDbform.DbAddress"
              :placeholder="$t('pleaseEnterDatabaseAddress')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('databaseName')" prop="DbName">
            <el-input
              v-model="searchDbform.DbName"
              :placeholder="$t('pleaseEnterDatabaseName')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('userName')" prop="DbUserName">
            <el-input
              v-model="searchDbform.DbUserName"
              :placeholder="$t('pleaseEnterUserName')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('AccessPassword')" prop="DbPassword">
            <el-input
              v-model="searchDbform.DbPassword"
              :placeholder="$t('pleaseEnterAccessPassword')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('databaseType')" prop="DbType">
            <el-select
              v-model="searchDbform.DbType"
              clearable
              :placeholder="$t('pleaseSelectDatabaseType')"
            >
              <el-option
                v-for="item in selectDbTypes"
                :key="item.Id"
                :label="item.Title"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('databasePort')" prop="DbPort">
            <el-input
              v-model="searchDbform.DbPort"
              :placeholder="$t('pleaseEnterDatabasePort')"
              autocomplete="off"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleDbConn()">{{$t('link')}}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-card>
      <div class="list-btn-container">
        <el-form
          ref="codeform"
          :inline="true"
          :rules="rules"
          :model="codeform"
          class="demo-form-inline"
          size="small"
        >
          <el-button
            type="default"
            icon="el-icon-refresh"
            size="small"
            style="margin-right: 10px"
            @click="loadTableData()"
          >
            {{$t('refresh')}}
          </el-button>
          <el-form-item :label="$t('database')">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('defaultSystemAccessesDatabase')"
              placement="top"
            >
              <el-select
                v-model="searchform.DbName"
                clearable
                :placeholder="$t('pleaseSelect')"
                @change="handleShowTable"
              >
                <el-option
                  v-for="item in selectedDataBase"
                  :key="item.Id"
                  :label="item.DbName"
                  :value="item.DbName"
                />
              </el-select>
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('databaseTableName')">
            <el-input
              v-model="searchform.tableName"
              clearable
              :placeholder="$t('pleaseEnterQueryTableName')"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">{{$t('query')}}</el-button>
          </el-form-item>
          <el-form-item :label="$t('objectNamespace')" prop="baseSpace">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('systemAutoCreateIServiceOrServiceOrModels')"
              placement="top"
            >
              <el-input
                v-model="codeform.baseSpace"
                clearable
                :placeholder="$t('likeWMS')"
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item :label="$t('RemoveTheTableNamePrefix')">
            <el-tooltip
              class="item"
              effect="dark"
              :content="$t('tableNameIsChangedToTheClassName')"
              placement="top"
            >
              <el-input
                v-model="codeform.replaceTableNameStr"
                clearable
                width="300"
                :placeholder="$t('multiplePrefixesSeparated')"
              />
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="iconfont icon-code"
              @click="handleGenerate()"
            >
              {{$t('generatingCode')}}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="gridtable"
        v-loading="tableloading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        style="width: 100%"
        :default-sort="{ prop: 'TableName', order: 'ascending' }"
        height="calc(100vh - 525px)"
        @select="handleSelectChange"
        @select-all="handleSelectAllChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column
          prop="TableName"
          :label="$t('table')"
          sortable="custom"
          width="380"
        />
        <el-table-column prop="Description" :label="$t('tableDesc')" />
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          :current-page="pagination.currentPage"
          :page-sizes="[5, 10, 20, 50, 100, 200, 300, 400]"
          :page-size="pagination.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.pageTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  createGetDBConn,
  codeGetDBList,
  codeGetTableList,
  codeGenerator,
} from '@/api/developers/toolsservice'
import { downloadFile } from '@/utils/index'
import { Loading } from 'element-ui'

import { BaseUrl } from '@/utils/request'
/* 开发者--数据库连接 */
export default {
  name: 'DbConnect',
  data() {
    return {
      searchDbform: {
        DbName: '',
        DbAddress: '',
        DbPort: '1433',
        DbUserName: '',
        DbPassword: '',
        DbType: '',
      },
      searchform: {
        DbName: '',
        tableName: '',
      },
      codeform: {
        baseSpace: '',
        replaceTableNameStr: '',
      },
      rules: {
        baseSpace: [
          { required: true, message: this.$t('pleaseEnterObjectName'), trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: this.$t('TheValueContains2to50characters'),
            trigger: 'blur',
          },
        ],
        replaceTableNameStr: [
          { min: 0, max: 50, message: this.$t('TheValueContainsMaximumOf50characters'), trigger: 'blur' },
        ],
      },
      selectDbTypes: [
        {
          Id: 'SqlServer',
          Title: 'SqlServer',
        },
        {
          Id: 'MySql',
          Title: 'MySql',
        },
      ],
      tableData: [],
      tableloading: true,
      pagination: {
        currentPage: 1,
        pagesize: 20,
        pageTotal: 0,
      },
      sortableData: {
        order: '',
        sort: '',
      },
      currentSelected: [],
      selectedDataBase: [],
    }
  },
  created() {
    this.pagination.currentPage = 1
    this.loadData()
    this.loadTableData()
  },
  methods: {
    loadData: function () {
      codeGetDBList().then((res) => {
        this.selectedDataBase = res.ResData
      })
    },
    /**
     * 加载页面table数据
     */
    loadTableData: function () {
      if (this.searchform.dataBaseName !== '') {
        this.tableloading = true
        var seachdata = {
          CurrentPageIndex: this.pagination.currentPage,
          PageSize: this.pagination.pagesize,
          Keywords: this.searchform.tableName,
          EnCode: this.searchform.DbName,
          Order: this.sortableData.order,
          Sort: this.sortableData.sort,
        }
        codeGetTableList(seachdata).then((res) => {
          this.tableData = res.ResData.Items
          this.pagination.pageTotal = res.ResData.TotalItems
          this.tableloading = false
        })
      }
    },
    /**
     * 点击查询
     */
    handleSearch: function () {
      this.pagination.currentPage = 1
      this.loadTableData()
    },
    handleShowTable: function () {
      this.pagination.currentPage = 1
      this.loadTableData()
    },
    handleDbConn: function () {
      var dataInfo = {
        DbAddress: this.searchDbform.DbAddress,
        DbPort: this.searchDbform.DbPort,
        DbName: this.searchDbform.DbName,
        DbUserName: this.searchDbform.DbUserName,
        DbPassword: this.searchDbform.DbPassword,
        DbType: this.searchDbform.DbType,
      }
      createGetDBConn(dataInfo).then((res) => {
        this.selectedDataBase = res.ResData
        this.searchform.DbName = this.searchDbform.DbName
      })
      this.pagination.currentPage = 1
      this.loadTableData()
    },
    /**
     * 点击生成服务端代码
     */
    handleGenerate: async function () {
      if (this.currentSelected.length === 0) {
        this.$alert(this.$t('SelectTheDataTableToGenerateTheCodeFrom'), this.$t('hint'))
        return false
      } else {
        this.$refs['codeform'].validate((valid) => {
          if (valid) {
            var loadop = {
              lock: true,
              text: this.$t('GeneratingCodes'),
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)',
            }
            const pageLoading = Loading.service(loadop)
            var currentTables = ''
            this.currentSelected.forEach((element) => {
              currentTables += element.TableName + ','
            })
            var seachdata = {
              tables: currentTables,
              baseSpace: this.codeform.baseSpace,
              replaceTableNameStr: this.codeform.replaceTableNameStr,
            }
            codeGenerator(seachdata)
              .then((res) => {
                if (res.Success) {
                  downloadFile(
                    BaseUrl.api + '/BaseApi/' + res.ResData[0],
                    res.ResData[1]
                  )
                  this.$message({
                    message: this.$t('CodeGenerationComplete'),
                    type: 'success',
                  })
                } else {
                  this.$message({
                    message: res.ErrMsg,
                    type: 'error',
                  })
                }
                pageLoading.close()
              })
              .catch((erre) => {
                pageLoading.close()
              })
          } else {
            return false
          }
        })
      }
    },
    /**
     * 当表格的排序条件发生变化的时候会触发该事件
     */
    handleSortChange: function (column) {
      this.sortableData.sort = column.prop
      if (column.order === 'ascending') {
        this.sortableData.order = 'asc'
      } else {
        this.sortableData.order = 'desc'
      }
      this.loadTableData()
    },
    /**
     * 当用户手动勾选checkbox数据行事件
     */
    handleSelectChange: function (selection, row) {
      this.currentSelected = selection
    },
    /**
     * 当用户手动勾选全选checkbox事件
     */
    handleSelectAllChange: function (selection) {
      this.currentSelected = selection
    },
    /**
     * 选择每页显示数量
     */
    handleSizeChange(val) {
      this.pagination.pagesize = val
      this.pagination.currentPage = 1
      this.loadTableData()
    },
    /**
     * 选择当页面
     */
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.loadTableData()
    },
  },
}
</script>
