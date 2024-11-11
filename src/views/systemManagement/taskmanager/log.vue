<template>
  <div class="page_container">
    <div class="filter-container">
      <el-card>
        <el-form
          ref="searchform"
          :inline="true"
          :model="searchform"
          class="demo-form-inline"
          size="small"
        >
          <el-form-item :label="$t('taskName')">
            <el-input
              v-model="searchform.name"
              clearable
              :placeholder="$t('taskIdOrTaskName')"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">
              {{ $t('query') }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-card>
      <div class="list-btn-container">
        <el-button-group>
          <el-button
            v-hasPermi="['TaskJobsLog/Delete']"
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
      </div>
      <el-table
        ref="gridtable"
        v-loading="tableloading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        style="width: 100%"
        :default-sort="{ prop: 'CreatorTime', order: 'ascending' }"
        height="calc(100vh - 400px)"
        @select="handleSelectChange"
        @select-all="handleSelectAllChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column
          prop="TaskId"
          :label="$t('taskID')"
          sortable="custom"
          width="200"
        />
        <el-table-column
          prop="TaskName"
          :label="$t('taskName')"
          sortable="custom"
          width="180"
        />
        <el-table-column
          prop="JobAction"
          :label="$t('performTheAction')"
          sortable="custom"
          width="160"
        />
        <el-table-column
          prop="Status"
          :label="$t('executingState')"
          sortable="custom"
          width="160"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.Status === true ? 'success' : 'info'"
              disable-transitions
            >
              {{ scope.row.Status === true ? $t('normal') : $t('abnormal') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="CreatorTime"
          :label="$t('createTime')"
          sortable="custom"
          width="160"
        />
        <el-table-column
          prop="Description"
          :label="$t('resultDescriptor')"
          sortable="custom"
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
      :title="editFormTitle + ' '+ $t('TableNameDesc')"
      :visible.sync="dialogEditFormVisible"
      width="640px"
    >
      <el-form ref="editFrom" :model="editFrom" :rules="rules">
        <el-form-item
          :label="$t('taskID')"
          :label-width="formLabelWidth"
          prop="TaskId"
        >
          <el-input
            v-model="editFrom.TaskId"
            :placeholder="$t('pleaseEnterTaskID')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('taskName')"
          :label-width="formLabelWidth"
          prop="TaskName"
        >
          <el-input
            v-model="editFrom.TaskName"
            :placeholder="$t('PleaseEnterTaskName')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('performTheAction')"
          :label-width="formLabelWidth"
          prop="JobAction"
        >
          <el-input
            v-model="editFrom.JobAction"
            :placeholder="$t('pleaseEnterPerformTheAction')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('executingState')"
          :label-width="formLabelWidth"
          prop="Status"
        >
          <el-radio-group v-model="editFrom.Status">
            <el-radio label="true">{{ $t('yes') }}</el-radio>
            <el-radio label="false">{{ $t('no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('resultDescriptor')"
          :label-width="formLabelWidth"
          prop="Description"
        >
          <el-input
            v-model="editFrom.Description"
            :placeholder="$t('pleaseEnterResultDescriptor')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('createTime')"
          :label-width="formLabelWidth"
          prop="CreatorTime"
        >
          <el-input
            v-model="editFrom.CreatorTime"
            :placeholder="$t('pleaseEnterCreateTime')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">{{$t('cancel')}}</el-button>
        <el-button type="primary" @click="saveEditForm()">{{$t('confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTaskJobsLogListWithPager,
  getTaskJobsLogDetail,
  saveTaskJobsLog,
  setTaskJobsLogEnable,
  deleteSoftTaskJobsLog,
  deleteTaskJobsLog,
} from '@/api/security/taskjobslog'
/* 任务日志 */
export default {
  name: 'TaskLog',
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
        sort: 'CreatorTime',
      },
      dialogEditFormVisible: false,
      editFormTitle: '',
      editFrom: {
        TaskId: '',
        TaskName: '',
        JobAction: '',
        Status: 'true',
        Description: '',
        CreatorTime: '',
      },
      rules: {
        TaskId: [
          { required: true, message: this.$t('pleaseEnterTaskID'), trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
        Status: [
          {
            required: true,
            message: this.$t('EnterNormalOrAbnormalExecutionStatus'),
            trigger: 'blur',
          },
          {
            min: 1,
            max: 50,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
        CreatorTime: [
          { required: true, message: this.$t('pleaseEnterCreateTime'), trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
      },
      formLabelWidth: '80px',
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
      getTaskJobsLogListWithPager(seachdata).then((res) => {
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

    /**
     * 新增、修改或查看明细信息（绑定显示数据）     *
     */
    ShowEditOrViewDialog: function (view) {
      if (view !== undefined) {
        if (
          this.currentSelected.length > 1 ||
          this.currentSelected.length === 0
        ) {
          this.$alert(this.$t('PleaseselectdatatoeditOrmodify'), this.$t('hint'))
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
        this.$refs['editFrom'].resetFields()
      }
    },
    bindEditInfo: function () {
      getTaskJobsLogDetail(this.currentId).then((res) => {
        this.editFrom.TaskId = res.ResData.TaskId
        this.editFrom.TaskName = res.ResData.TaskName
        this.editFrom.JobAction = res.ResData.JobAction
        this.editFrom.Status = res.ResData.Status + ''
        this.editFrom.Description = res.ResData.Description
        this.editFrom.CreatorTime = res.ResData.CreatorTime
      })
    },
    /**
     * 新增/修改保存
     */
    saveEditForm() {
      this.$refs['editFrom'].validate((valid) => {
        if (valid) {
          const data = {
            TaskId: this.editFrom.TaskId,
            TaskName: this.editFrom.TaskName,
            JobAction: this.editFrom.JobAction,
            Status: this.editFrom.Status,
            Description: this.editFrom.Description,
            CreatorTime: this.editFrom.CreatorTime,

            Id: this.currentId,
          }
          saveTaskJobsLog(data).then((res) => {
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
        var currentIds = ''
        this.currentSelected.forEach((element) => {
          currentIds += element.Id + ','
        })
        const data = {
          ids: currentIds,
          bltag: val,
        }
        setTaskJobsLogEnable(data).then((res) => {
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
        deleteSoftTaskJobsLog(data).then((res) => {
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
        this.$confirm(this.$t('Confirmdeletionoftheselecteddataitem'), this.$t('warn'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning',
        })
          .then(function () {
            const data = {
              Ids: currentIds,
            }
            return deleteTaskJobsLog(data)
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

<style>
</style>
