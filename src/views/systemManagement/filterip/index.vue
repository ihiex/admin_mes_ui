<template>
  <div class="page_container">
    <el-card>
      <el-form ref="searchform" :inline="true" :model="searchform" size="small">
        <el-form-item :label="$t('IPAddress')">
          <el-input
            v-model="searchform.name"
            clearable
            :placeholder="$t('IPAddress')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">
            {{ $t('query') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-button-group>
        <el-button-group>
          <el-button
            v-hasPermi="['FilterIP/Add']"
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="ShowEditOrViewDialog()"
          >
            {{ $t('Added') }}
          </el-button>
          <el-button
            v-hasPermi="['FilterIP/Edit']"
            type="primary"
            icon="el-icon-edit"
            class="el-button-modify"
            size="small"
            @click="ShowEditOrViewDialog('edit')"
          >
            {{ $t('Modify') }}
          </el-button>
          <el-button
            v-hasPermi="['FilterIP/Enable']"
            type="info"
            icon="el-icon-video-pause"
            size="small"
            @click="setEnable('0')"
          >
            {{ $t('disable') }}
          </el-button>
          <el-button
            v-hasPermi="['FilterIP/Enable']"
            type="success"
            icon="el-icon-video-play"
            size="small"
            @click="setEnable('1')"
          >
            {{ $t('enable') }}
          </el-button>
          <el-button
            v-hasPermi="['FilterIP/DeleteSoft']"
            type="warning"
            icon="el-icon-delete"
            size="small"
            @click="deleteSoft('0')"
          >
            {{ $t('softDelete') }}
          </el-button>
          <el-button
            v-hasPermi="['FilterIP/Delete']"
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="deletePhysics()"
          >
            {{ $t('delete') }}
          </el-button>
          <el-button
            type="default"
            icon="el-icon-refresh"
            size="small"
            @click="loadTableData()"
          >
            {{ $t('refresh') }}
          </el-button>
        </el-button-group>
      </el-button-group>
      <el-table
        ref="gridtable"
        v-loading="tableloading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        style="width: 100%"
        :default-sort="{ prop: 'SortCode', order: 'ascending' }"
        height="calc(100vh - 400px)"
        @select="handleSelectChange"
        @select-all="handleSelectAllChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column
          prop="FilterType"
          :label="$t('controlStrategy')"
          sortable="custom"
          width="150"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.FilterType === true ? 'success' : 'info'"
              disable-transitions
            >
              {{
                scope.row.FilterType === true
                  ? $t('AllowAccess')
                  : $t('accessDenied')
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="StartIP"
          :label="$t('StartingIP')"
          sortable="custom"
          width="150"
        />
        <el-table-column
          prop="EndIP"
          :label="$t('OverIP')"
          sortable="custom"
          width="150"
        />
        <el-table-column
          prop="SortCode"
          :label="$t('sort')"
          sortable="custom"
          width="120"
        />
        <el-table-column
          :label="$t('isEnable')"
          sortable="custom"
          width="160"
          prop="EnabledMark"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.EnabledMark === true ? 'success' : 'info'"
              disable-transitions
            >
              {{
                scope.row.EnabledMark === true ? $t('enable') : $t('disable')
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('isDelete')"
          sortable="custom"
          width="160"
          prop="DeleteMark"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.DeleteMark === true ? 'danger' : 'success'"
              disable-transitions
            >
              {{ scope.row.DeleteMark === true ? $t('haveDeleted') : $t('no') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="CreatorTime"
          :label="$t('createTime')"
          sortable
          min-width="150"
        />
        <el-table-column
          prop="LastModifyTime"
          :label="$t('updateTime')"
          sortable
          min-width="150"
        />
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
    <el-dialog
      ref="dialogEditForm"
      :title="editFormTitle + ' ' + $t('subsystem')"
      :visible.sync="dialogEditFormVisible"
      width="640px"
    >
      <el-form ref="editFrom" :model="editFrom" :rules="rules">
        <el-form-item
          :label="$t('controlStrategy')"
          :label-width="formLabelWidth"
          prop="FilterType"
        >
          <el-select
            v-model="editFrom.FilterType"
            :placeholder="$t('pleaseSelect')"
          >
            <el-option :label="$t('AllowAccess')" :value="true" />
            <el-option :label="$t('accessDenied')" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('StartingIP')"
          :label-width="formLabelWidth"
          prop="StartIP"
        >
          <el-input
            v-model="editFrom.StartIP"
            :placeholder="$t('pleaseEnterStartingIP')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('OverIP')"
          :label-width="formLabelWidth"
          prop="EndIP"
        >
          <el-input
            v-model="editFrom.EndIP"
            :placeholder="$t('pleaseEnterOverIP')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('sort')"
          :label-width="formLabelWidth"
          prop="SortCode"
        >
          <el-input
            v-model.number="editFrom.SortCode"
            :placeholder="$t('pleaseEnterSort')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('isEnable')"
          :label-width="formLabelWidth"
          prop="EnabledMark"
        >
          <el-radio-group v-model="editFrom.EnabledMark">
            <el-radio :label="true">{{ $t('yes') }}</el-radio>
            <el-radio :label="false">{{ $t('no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('describe')"
          :label-width="formLabelWidth"
          prop="Description"
        >
          <el-input
            v-model="editFrom.Description"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" @click="saveEditForm()">
          $t('confirm')
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getFilterIPListWithPager,
  getFilterIPDetail,
  saveFilterIP,
  setFilterIPEnable,
  deleteSoftFilterIP,
  deleteFilterIP,
} from '@/api/security/filteripservice'

/* 访问控制 */
export default {
  name: 'FilterIP',
  data() {
    return {
      searchform: {
        name: '',
      },
      loadBtnFunc: [],
      tableData: [],
      tableloading: true,
      pagination: {
        currentPage: 1,
        pagesize: 20,
        pageTotal: 0,
      },
      sortableData: {
        order: 'desc',
        sort: 'SortCode',
      },
      dialogEditFormVisible: false,
      editFormTitle: '',
      editFrom: {},
      rules: {
        FilterType: [
          {
            required: true,
            message: this.$t('pleaseSelectControlStrategy'),
            trigger: 'blur',
          },
        ],
        StartIP: [
          {
            required: true,
            message: this.$t('pleaseEnterStartingIP'),
            trigger: 'blur',
          },
          {
            min: 7,
            max: 15,
            message: this.$t('TheValueContains7to15characters'),
            trigger: 'blur',
          },
        ],
        EndIP: [
          {
            required: true,
            message: this.$t('pleaseEnterOverIP'),
            trigger: 'blur',
          },
          {
            min: 7,
            max: 15,
            message: this.$t('TheValueContains7to15characters'),
            trigger: 'blur',
          },
        ],
      },
      formLabelWidth: '120px',
      currentId: '', // 当前操作对象的ID值，主要用于修改
      currentSelected: [],
    }
  },
  created() {
    this.pagination.currentPage = 1
    this.InitDictItem()
    this.loadTableData()
    this.loadBtnFunc = JSON.parse(sessionStorage.getItem('yueboncurrentfuns'))
  },
  methods: {
    /**
     * 初始化数据
     */
    InitDictItem() {},
    /**
     * 加载页面table数据
     */
    loadTableData: function () {
      this.tableloading = true
      var seachdata = {
        CurrentPageIndex: this.pagination.currentPage,
        PageSize: this.pagination.pagesize,
        Keywords: this.searchform.name,
        Order: this.sortableData.order,
        Sort: this.sortableData.sort,
      }
      getFilterIPListWithPager(seachdata).then((res) => {
        this.tableData = res.ResData.Items
        this.pagination.pageTotal = res.ResData.TotalItems
        this.tableloading = false
      })
    },
    /**
     * 点击查询
     */
    handleSearch: function () {
      this.pagination.currentPage = 1
      this.loadTableData()
    },
    // 表单重置
    reset() {
      this.editFrom = {
        FilterType: false,
        StartIP: '',
        EndIP: '',
        SortCode: 99,
        EnabledMark: true,
        Description: '',
      }
      this.resetForm('editFrom')
    },

    /**
     * 新增、修改或查看明细信息（绑定显示数据）     *
     */
    ShowEditOrViewDialog: function (view) {
      this.reset()
      if (view !== undefined) {
        if (
          this.currentSelected.length > 1 ||
          this.currentSelected.length === 0
        ) {
          this.$alert(
            this.$t('PleaseselectdatatoeditOrmodify'),
            this.$t('hint')
          )
        } else {
          this.currentId = this.currentSelected[0].Id
          this.editFormTitle = this.$t('edit')
          this.dialogEditFormVisible = true
          this.bindEditInfo()
        }
      } else {
        this.editFormTitle = this.$t('Added')
        this.currentId = ''
        this.dialogEditFormVisible = true
      }
    },
    bindEditInfo: function () {
      getFilterIPDetail(this.currentId).then((res) => {
        this.editFrom = res.ResData
      })
    },
    /**
     * 新增/修改保存
     */
    saveEditForm() {
      this.$refs['editFrom'].validate((valid) => {
        if (valid) {
          const data = {
            FilterType: this.editFrom.FilterType,
            StartIP: this.editFrom.StartIP,
            EndIP: this.editFrom.EndIP,
            SortCode: this.editFrom.SortCode,
            EnabledMark: this.editFrom.EnabledMark,
            Description: this.editFrom.Description,
            Id: this.currentId,
          }
          var url = 'FilterIP/Insert'
          if (this.currentId !== '') {
            url = 'FilterIP/Update'
          }
          saveFilterIP(data, url).then((res) => {
            if (res.Success) {
              this.$message({
                message: this.$t('operateSuccessfully'),
                type: 'success',
              })
              this.dialogEditFormVisible = false
              this.currentSelected = ''
              this.$refs['editFrom'].resetFields()
              this.loadTableData()
              this.InitDictItem()
            } else {
              this.$message({
                message: res.ErrMsg,
                type: 'error',
              })
            }
          })
        } else {
          return false
        }
      })
    },
    setEnable: function (val) {
      if (this.currentSelected.length === 0) {
        this.$alert(this.$t('Selectthedatatooperateonfirst'), this.$t('hint'))
        return false
      } else {
        var currentIds = []
        this.currentSelected.forEach((element) => {
          currentIds.push(element.Id)
        })
        const data = {
          Ids: currentIds,
          Flag: val,
        }
        setFilterIPEnable(data).then((res) => {
          if (res.Success) {
            this.$message({
              message: this.$t('operateSuccessfully'),
              type: 'success',
            })
            this.currentSelected = ''
            this.loadTableData()
          } else {
            this.$message({
              message: res.ErrMsg,
              type: 'error',
            })
          }
        })
      }
    },
    deleteSoft: function (val) {
      if (this.currentSelected.length === 0) {
        this.$alert(this.$t('Selectthedatatooperateonfirst'), this.$t('hint'))
        return false
      } else {
        var currentIds = []
        this.currentSelected.forEach((element) => {
          currentIds.push(element.Id)
        })
        const data = {
          Ids: currentIds,
          Flag: val,
        }
        deleteSoftFilterIP(data).then((res) => {
          if (res.Success) {
            this.$message({
              message: this.$t('operateSuccessfully'),
              type: 'success',
            })
            this.currentSelected = ''
            this.loadTableData()
          } else {
            this.$message({
              message: res.ErrMsg,
              type: 'error',
            })
          }
        })
      }
    },
    deletePhysics: function () {
      if (this.currentSelected.length === 0) {
        this.$alert(this.$t('Selectthedatatooperateonfirst'), this.$t('hint'))
        return false
      } else {
        var currentIds = []
        this.currentSelected.forEach((element) => {
          currentIds.push(element.Id)
        })
        this.$confirm(
          this.$t('Confirmdeletionoftheselecteddataitem'),
          this.$t('warn'),
          {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning',
          }
        )
          .then(function () {
            const data = {
              Ids: currentIds,
            }
            return deleteFilterIP(data)
          })
          .then((res) => {
            if (res.Success) {
              this.$message({
                message: this.$t('successfullyDelete'),
                type: 'success',
              })
              this.currentSelected = ''
              this.loadTableData()
            } else {
              this.$message({
                message: res.ErrMsg,
                type: 'error',
              })
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

<style lang="scss" scoped>
.pagination-container {
  .el-pagination {
    text-align: left;
  }
}
</style>
