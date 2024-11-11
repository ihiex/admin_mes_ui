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
              :placeholder="$t('TaskNameOrGroup')"
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
            v-hasPermi="['TaskManager/Add']"
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="ShowEditOrViewDialog()"
          >
            {{ $t('Added') }}
          </el-button>
          <el-button
            v-hasPermi="['TaskManager/Edit']"
            type="primary"
            icon="el-icon-edit"
            class="el-button-modify"
            size="small"
            @click="ShowEditOrViewDialog('edit')"
          >
            {{ $t('Modify') }}
          </el-button>
          <el-button
            v-hasPermi="['TaskManager/Enable']"
            type="info"
            icon="el-icon-video-pause"
            size="small"
            @click="setEnable('0')"
          >
            {{ $t('disable') }}
          </el-button>
          <el-button
            v-hasPermi="['TaskManager/Enable']"
            type="success"
            icon="el-icon-video-play"
            size="small"
            @click="setEnable('1')"
          >
            {{ $t('enable') }}
          </el-button>
          <el-button
            v-hasPermi="['TaskManager/DeleteSoft']"
            type="warning"
            icon="el-icon-delete"
            size="small"
            @click="deleteSoft('0')"
          >
            {{ $t('softDelete') }}
          </el-button>
          <el-button
            v-hasPermi="['TaskManager/Delete']"
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="deletePhysics()"
          >
            {{ $t('delete') }}
          </el-button>
          <el-button
            v-hasPermi="['TaskManager/ChangeStatus']"
            type="info"
            icon="el-icon-video-pause"
            size="small"
            @click="setStatus('0')"
          >
            {{ $t('pause') }}
          </el-button>
          <el-button
            v-hasPermi="['TaskManager/ChangeStatus']"
            type="success"
            icon="el-icon-video-play"
            size="small"
            @click="setStatus('1')"
          >
            {{ $t('start') }}
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
        :default-sort="{ prop: 'Id', order: 'ascending' }"
        height="calc(100vh - 400px)"
        @select="handleSelectChange"
        @select-all="handleSelectAllChange"
        @sort-change="handleSortChange"
        @row-click="handleRowClick"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column
          prop="Id"
          :label="$t('taskID')"
          sortable="custom"
          width="200"
        />
        <el-table-column
          prop="TaskName"
          :label="$t('taskName')"
          sortable="custom"
          width="150"
        />
        <el-table-column
          prop="GroupName"
          :label="$t('groupName')"
          sortable="custom"
          width="150"
        />
        <el-table-column
          prop="Cron"
          :label="$t('CronExpression')"
          sortable="custom"
          width="150"
        />
        <el-table-column
          :label="$t('status')"
          sortable="custom"
          width="100"
          prop="Status"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.Status === 1 ? 'success' : 'danger'"
              disable-transitions
            >
              {{ scope.row.Status === 1 ? $t('running') : $t('pause') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="Description"
          :label="$t('sketch')"
          sortable="custom"
          width="110"
        />
        <el-table-column
          prop="JobCallAddress"
          :label="$t('taskAddress')"
          sortable="custom"
          min-width="200"
        />
        <el-table-column
          prop="StartTime"
          :label="$t('taskStartTime')"
          sortable
          width="160"
        />
        <el-table-column
          prop="EndTime"
          :label="$t('taskEndTime')"
          sortable
          width="160"
        />
        <el-table-column
          prop="LastRunTime"
          :label="$t('protectedDateFieldDietLatest')"
          sortable
          width="170"
        />
        <el-table-column
          prop="NextRunTime"
          :label="$t('NextExecutionTime')"
          sortable
          width="170"
        />
        <el-table-column
          prop="RunCount"
          :label="$t('executeCount')"
          sortable="custom"
          width="150"
        />
        <el-table-column
          prop="ErrorCount"
          :label="$t('errorumber')"
          sortable="custom"
          width="150"
        />
        <el-table-column
          prop="LastErrorTime"
          :label="$t('errorTime')"
          sortable
          width="160"
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
              {{ scope.row.EnabledMark === true ? $t('enable') : $t('disable') }}
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
          width="160"
        />
        <el-table-column
          prop="LastModifyTime"
          :label="$t('updateTime')"
          sortable
          width="160"
        />
        <el-table-column fixed="right" :label="$t('operation')" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleShowLogs(scope.row)"
            >
              {{$t('viewLog')}}
            </el-button>
          </template>
        </el-table-column>
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
      :title="editFormTitle +' '+ $t('task')"
      :visible.sync="dialogEditFormVisible"
      width="900px"
      append-to-body
    >
      <el-form ref="editFrom" :model="editFrom" :rules="rules">
        <el-row>
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="$t('groupName')"
              :label-width="formLabelWidth"
              prop="GroupName"
            >
              <el-input
                v-model="editFrom.GroupName"
                :placeholder="$t('PleaseEnterGroupName')"
                autocomplete="off"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('beginTime')"
              :label-width="formLabelWidth"
              prop="StartEndTime"
            >
              <el-date-picker
                v-model="editFrom.StartEndTime"
                type="datetimerange"
                :start-placeholder="$t('StartDateTime')"
                :end-placeholder="$t('EndDateTime')"
                :default-time="['12:00:00']"
              />
            </el-form-item>
          </el-col>
          <!-- 表達式 -->
          <el-col :span="24">
            <el-form-item
              :label="$t('CronExpression')"
              :label-width="formLabelWidth"
              prop="Cron"
            >
              <cron-input v-model="editFrom.Cron" :placeholder="$t('EntertheCronexpression')" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('modeOfExecution')"
              :label-width="formLabelWidth"
              prop="IsLocal"
            >
              <el-radio-group
                v-model="editFrom.IsLocal"
                @change="changeIsLocal"
              >
                <el-radio :label="true">{{$t('localTask')}}</el-radio>
                <el-radio :label="false">{{$t('ExternalInterfaceTask')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="isShowSelect"
              :label="$t('taskAddress')"
              :label-width="formLabelWidth"
              prop="JobCallAddress"
            >
              <el-select
                v-model="editFrom.JobCallAddress"
                clearable
                filterable
                :placeholder="$t('PleaseEnterTheTaskAddress')"
                style="width: 300px"
              >
                <el-option
                  v-for="item in selectLocalTask"
                  :key="item.FullName"
                  :label="item.FullName"
                  :value="item.FullName"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="!isShowSelect"
              :label="$t('taskAddress')"
              :label-width="formLabelWidth"
              prop="JobCallAddress"
            >
              <el-input
                v-model="editFrom.JobCallAddress"
                :placeholder="$t('EnterTheTaskAddressOfTheExternalInterface')"
                autocomplete="off"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('taskParams')"
              :label-width="formLabelWidth"
              prop="JobCallParams"
            >
              <el-input
                v-model="editFrom.JobCallParams"
                type="textarea"
                :placeholder="$t('taskParamsFormat')"
                autocomplete="off"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('describe')"
              :label-width="formLabelWidth"
              prop="Description"
            >
              <el-input
                v-model="editFrom.Description"
                type="textarea"
                autocomplete="off"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('emailNotification')"
              :label-width="formLabelWidth"
              prop="IsSendMail"
            >
              <el-radio-group v-model="editFrom.SendMail">
                <el-radio :label="0">{{$t('notInform')}}</el-radio>
                <el-radio :label="1">{{$t('exceptionAdvice')}}</el-radio>
                <el-radio :label="2">{{$t('AllNotifications')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="editFrom.SendMail != '0'"
              :label="$t('emailAddress')"
              :label-width="formLabelWidth"
              prop="EmailAddress"
            >
              <el-input
                v-model="editFrom.EmailAddress"
                :placeholder="$t('emailAddress')"
                autocomplete="off"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              :label="$t('isEnable')"
              :label-width="formLabelWidth"
              prop="EnabledMark"
            >
              <el-radio-group v-model="editFrom.EnabledMark">
                <el-radio :label="true">{{$t('yes')}}</el-radio>
                <el-radio :label="false">{{$t('no')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" @click="saveEditForm()">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      ref="dialogShowLogForm"
      :title="editFormTitle + $t('TaskLogIndicatesTheLatest40records')"
      :visible.sync="dialogShowLogFormVisible"
      width="940px"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :color="activity.Color"
          :timestamp="activity.CreatorTime"
        >
          {{ activity.Description }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTaskManagerListWithPager,
  getTaskManagerDetail,
  saveTaskManager,
  setTaskManagerEnable,
  deleteSoftTaskManager,
  deleteTaskManager,
  changeStatus,
  getLocalTaskJobs,
  getTaskJobLogListWithPager,
} from '@/api/security/taskmanager'

import CronInput from '@/components/cron/cron-input'
/* 任务列表 */

export default {
  name: 'TaskList',
  components: {
    CronInput
  },
  data() {
    return {
      searchform: {
        name: '',
      },
      loadBtnFunc: [],
      selectLocalTask: [],
      tableData: [],
      tableloading: true,
      pagination: {
        currentPage: 1,
        pagesize: 20,
        pageTotal: 0,
      },
      sortableData: {
        order: 'desc',
        sort: 'Id',
      },
      dialogEditFormVisible: false,
      dialogShowLogFormVisible: false,
      editFormTitle: '',
      editFrom: {},
      rules: {
        TaskName: [
          { required: true, message: this.$t('PleaseEnterTaskName'), trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
        GroupName: [
          { required: true, message: this.$t('PleaseEnterGroupName'), trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
        StartEndTime: [
          { required: true, message: this.$t('Setthestartandendtimeofthetask'), trigger: 'blur' },
        ],
        Cron: [
          { required: true, message: this.$t('EntertheCronexpression'), trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
        JobCallAddress: [
          { required: true, message: this.$t('Pleaseentertheremoteinterfaceaddress'), trigger: 'blur' },
          {
            min: 1,
            max: 250,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
      },
      formLabelWidth: '130px',
      currentId: '', // 当前操作对象的ID值，主要用于修改
      currentSelected: [],
      isShowSelect: true,
      activities: [],
      reverse: true,
    }
  },
  created() {
    this.pagination.currentPage = 1
    this.InitDictItem()
    this.loadTableData()
  },
  methods: {
    /**
     * 初始化数据
     */
    InitDictItem() {
      getLocalTaskJobs().then((res) => {
        this.selectLocalTask = res.ResData
      })
    },
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
      getTaskManagerListWithPager(seachdata).then((res) => {
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
    changeIsLocal: function () {
      this.isShowSelect = this.editFrom.IsLocal
      this.editFrom.JobCallAddress = ''
    },
    handleShowLogs: function (row) {
      this.dialogShowLogFormVisible = true
      this.loadJobLogData(row)
    },
    /**
     * 加载页面table数据
     */
    loadJobLogData: function (row) {
      var seachdata = {
        Keywords: row.Id,
      }
      getTaskJobLogListWithPager(seachdata).then((res) => {
        this.activities = res.ResData
      })
    },
    // 表单重置
    reset() {
      if (!this.currentId) {
        this.editFrom = {
          TaskName: '',
          GroupName: '',
          Cron: '',
          JobCallAddress: '',
          JobCallParams: '',
          EnabledMark: true,
          IsLocal: true,
          Description: '',
          SendMail: 1,
          EmailAddress: '',
          StartTime: '',
          EndTime: '',
          StartEndTime: '',
        }
        this.resetForm('editFrom')
      } else {
        this.bindEditInfo()
      }
    },

    /**
     * 新增、修改或查看明细信息（绑定显示数据）     *
     */
    ShowEditOrViewDialog: function (view) {
      if (view !== undefined) {
        if (this.currentId.length === 0) {
          this.$alert(this.$t('PleaseselectdatatoeditOrmodify'), this.$t('hint'))
        } else {
          this.editFormTitle = this.$t('edit')
          this.dialogEditFormVisible = true
        }
      } else {
        this.editFormTitle = this.$t('Added')
        this.currentId = ''
        this.dialogEditFormVisible = true
      }
      this.reset()
    },
    bindEditInfo: function () {
      getTaskManagerDetail(this.currentId).then((res) => {
        this.editFrom = res.ResData
        this.isShowSelect = res.ResData.IsLocal
        this.editFrom.StartEndTime = [
          res.ResData.StartTime,
          res.ResData.EndTime,
        ]
      })
    },
    /**
     * 新增/修改保存
     */
    saveEditForm() {
      this.$refs['editFrom'].validate((valid) => {
        if (valid) {
          const data = {
            TaskName: this.editFrom.TaskName,
            GroupName: this.editFrom.GroupName,
            Cron: this.editFrom.Cron,
            JobCallAddress: this.editFrom.JobCallAddress,
            JobCallParams: this.editFrom.JobCallParams,
            StartTime: this.editFrom.StartEndTime[0],
            EndTime: this.editFrom.StartEndTime[1],
            IsLocal: this.editFrom.IsLocal,
            Description: this.editFrom.Description,
            SendMail: this.editFrom.SendMail,
            EmailAddress: this.editFrom.EmailAddress,
            EnabledMark: this.editFrom.EnabledMark,
            Id: this.currentId,
          }
          var url = 'TaskManager/Insert'
          if (this.currentId !== '') {
            url = 'TaskManager/Update'
          }
          saveTaskManager(data, url).then((res) => {
            if (res.Success) {
              this.$message({
                message: this.$t('operateSuccessfully'),
                type: 'success',
              })
              this.dialogEditFormVisible = false
              this.currentSelected = ''
              this.editFrom.StartEndTime = ''
              this.resetForm('editFrom')
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
        setTaskManagerEnable(data).then((res) => {
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
        deleteSoftTaskManager(data).then((res) => {
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
        this.$confirm(this.$t('Confirmdeletionoftheselecteddataitem'), this.$t('hint'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning',
        })
          .then(function () {
            const data = {
              Ids: currentIds,
            }
            return deleteTaskManager(data)
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
    // 启动/暂停
    setStatus: function (val) {
      if (this.currentSelected.length === 0) {
        this.$alert(this.$t('Selectthedatatooperateonfirst'), this.$t('hint'))
        return false
      } else {
        var currentIds = this.currentSelected[0].Id
        const data = {
          Id: currentIds,
          Status: val,
        }
        changeStatus(data).then((res) => {
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
      this.currentId = row.Id
    },
    /**
     * 当用户手动勾选全选checkbox事件
     */
    handleSelectAllChange: function (selection) {
      this.currentSelected = selection
    },
    /**
     * 单击行
     */
    handleRowClick: function (row, column, event) {
      this.currentId = row.Id
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
