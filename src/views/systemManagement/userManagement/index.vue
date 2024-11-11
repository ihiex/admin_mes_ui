<template>
  <div class="page_container">
    <div class="filter-container">
      <el-card>
        <el-form ref="searchform" :inline="true" :model="searchform" class="demo-form-inline" size="small">
          <el-form-item :label="$t('role')">
            <el-select v-model="searchform.RoleId" clearable :placeholder="$t('pleaseSelect')">
              <el-option v-for="item in selectRole" :key="item.Id" :label="item.FullName" :value="item.Id" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('userInfo')">
            <el-input v-model="searchform.Keywords" clearable :placeholder="$t('IDNameNicknamePhone')" />
          </el-form-item>
          <el-form-item :label="$t('registrationDate')">
            <el-date-picker v-model="searchform.CreateTime" type="daterange" align="right" value-format="yyyy-MM-dd"
              unlink-panels range-separator="-" :start-placeholder="$t('startDate')" :end-placeholder="$t('endDate')"
              :picker-options="pickerOptions" @change="handleChangeDatePicker" />
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
          <el-button v-hasPermi="['User/Add']" type="primary" icon="el-icon-plus" size="small"
            @click="ShowEditOrViewDialog()">
            {{ $t('Added') }}
          </el-button>
          <el-button v-hasPermi="['User/Edit']" type="primary" icon="el-icon-edit" class="el-button-modify" size="small"
            @click="ShowEditOrViewDialog('edit')">
            {{ $t('Modify') }}
          </el-button>
          <el-button v-hasPermi="['User/Enable']" type="info" icon="el-icon-video-pause" size="small"
            @click="setEnable('0')">
            {{ $t('disable') }}
          </el-button>
          <el-button v-hasPermi="['User/Enable']" type="success" icon="el-icon-video-play" size="small"
            @click="setEnable('1')">
            {{ $t('enable') }}
          </el-button>
          <el-button v-hasPermi="['User/DeleteSoft']" type="warning" icon="el-icon-delete" size="small"
            @click="deleteSoft('0')">
            {{ $t('softDelete') }}
          </el-button>
          <el-button v-hasPermi="['User/Delete']" type="danger" icon="el-icon-delete" size="small"
            @click="deletePhysics()">
            {{ $t('delete') }}
          </el-button>
          <el-button v-hasPermi="['User/ResetPassword']" type="default" icon="el-icon-refresh-right" size="small"
            @click="handleResetPassword()">
            {{ $t('resetPasswords') }}
          </el-button>
          <el-button type="default" icon="el-icon-refresh" size="small" @click="loadTableData()">
            {{ $t('refresh') }}
          </el-button>
        </el-button-group>
      </div>
      <el-table ref="gridtable" v-loading="tableloading" :data="tableData" border stripe highlight-current-row
        style="width: 100%" :default-sort="{ prop: 'SortCode', order: 'descending' }" height="calc(100vh - 400px)"
        @select="handleSelectChange" @select-all="handleSelectAllChange" @sort-change="handleSortChange"
        @current-change="handleCurrentRow">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="Account" :label="$t('IDUserName')" sortable="custom" width="170" fixed />
        <el-table-column prop="RealName" :label="$t('realName')" sortable="custom" width="120" fixed />
        <el-table-column prop="NickName" :label="$t('nickname')" sortable="custom" width="120" fixed />
        <el-table-column prop="Gender" :label="$t('gender')" sortable="custom" width="90" align="center">
          <template slot-scope="scope">
            {{ scope.row.Gender === 1 ? $t('man') : $t('girl') }}
          </template>
        </el-table-column>
        <el-table-column prop="UserType" :label="$t('UserType')" sortable="custom" width="110" align="center">
          <template slot-scope="scope">
            {{ getUserType(scope.row.UserType) }}
          </template>
        </el-table-column>
        <el-table-column prop="Birthday" :label="$t('birthday')" sortable="custom" width="120" align="center"
          :formatter="dateformatter" />
        <el-table-column prop="MobilePhone" :label="$t('phoneNumber')" sortable="custom" width="150" align="center" />
        <el-table-column prop="DepartmentName" :label="$t('NASA')" width="260" align="center">
          <template slot-scope="scope">
            {{ scope.row.OrganizeName + '/' + scope.row.DepartmentName }}
          </template>
        </el-table-column>
        <el-table-column prop="RoleName" :label="$t('role')" sortable="custom" width="280" align="center" />
        <el-table-column :label="$t('usable')" sortable="custom" width="90" prop="EnabledMark" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.EnabledMark === true ? 'success' : 'info'" disable-transitions>
              {{
                scope.row.EnabledMark === true ? $t('enable') : $t('disable')
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('delete')" sortable="custom" width="90" prop="DeleteMark" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.DeleteMark === true ? 'danger' : 'success'" disable-transitions>
              {{ scope.row.DeleteMark === true ? $t('haveDeleted') : $t('no') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="CreatorTime" :label="$t('addTime')" width="160" sortable />
        <el-table-column prop="LastModifyTime" :label="$t('updateTime')" width="160" sortable>
          <template slot-scope="scope">
            {{ scope.row.LastModifyTime }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100, 200, 300, 400]"
          :page-size="pagination.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.pageTotal"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <el-dialog ref="dialogEditForm" :title="editFormTitle + ' ' + $t('user')" :visible.sync="dialogEditFormVisible"
      :close-on-click-modal="false" width="660px">
      <el-form ref="editFrom" :inline="true" :model="editFrom" :rules="rules" class="demo-form-inline">
        <el-form-item :label="$t('accountNumber')" :label-width="formLabelWidth" prop="Account">
          <el-input v-model="editFrom.Account" :placeholder="$t('pleaseEnterID')" autocomplete="off" clearable
            style="width: 400px" />
        </el-form-item>
        <el-form-item :label="$t('compellation')" :label-width="formLabelWidth" prop="RealName">
          <el-input v-model="editFrom.RealName" :placeholder="$t('PleaseEnterYourName')" autocomplete="off" clearable
            style="width: 400px" />
        </el-form-item>
        <el-form-item :label="$t('nickname')" :label-width="formLabelWidth" prop="NickName">
          <el-input v-model="editFrom.NickName" :placeholder="$t('PleaseEnterNickname')" autocomplete="off" clearable
            style="width: 400px" />
        </el-form-item>
        <el-form-item :label="$t('gender')" :label-width="formLabelWidth" prop="Gender">
          <el-radio-group v-model="editFrom.Gender">
            <el-radio :label="1">{{ $t('man') }}</el-radio>
            <el-radio :label="0">{{ $t('girl') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('phoneNumber')" :label-width="formLabelWidth" prop="MobilePhone">
          <el-input v-model="editFrom.MobilePhone" :placeholder="$t('pleaseEnterPhoneNumber')" autocomplete="off"
            clearable style="width: 400px" />
        </el-form-item>
        <el-form-item :label="$t('WechatID')" :label-width="formLabelWidth" prop="WeChat">
          <el-input v-model="editFrom.WeChat" :placeholder="$t('pleaseEnterWechatID')" autocomplete="off" clearable
            style="width: 400px" />
        </el-form-item>
        <el-form-item :label="$t('email')" :label-width="formLabelWidth" prop="EmailAddress">
          <el-input v-model="editFrom.EmailAddress" :placeholder="$t('pleaseEnterEmail')" autocomplete="off" clearable
            style="width: 400px" />
        </el-form-item>
        <el-form-item :label="$t('dateOfBirth')" :label-width="formLabelWidth" prop="Birthday">
          <el-date-picker v-model="editFrom.Birthday" type="date" :placeholder="$t('optionDate')" style="width: 400px" />
        </el-form-item>
        <el-form-item :label="$t('option')" :label-width="formLabelWidth" prop="">
          <el-checkbox v-model="editFrom.EnabledMark">
            {{ $t('enable') }}
          </el-checkbox>
          <el-checkbox v-model="editFrom.IsAdministrator">
            {{ $t('manager') }}
          </el-checkbox>
        </el-form-item>
        <!-- 用户类型 -->
        <el-form-item :label="$t('UserType')" :label-width="formLabelWidth" prop="UserType">
          <el-select v-model="editFrom.UserType" clearable :placeholder="$t('pleaseSelect')" style="width: 400px">
            <el-option v-for="item in userTypes" :key="item.ItemCode" :label="item.ItemName" :value="item.ItemCode" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('NASA')" :label-width="formLabelWidth" prop="DepartmentId">
          <el-cascader v-model="selectedOrganizeOptions" style="width: 400px" :options="selectOrganize" filterable :props="{
            label: 'FullName',
            value: 'Id',
            children: 'Children',
            emitPath: false,
            checkStrictly: true,
            expandTrigger: 'hover',
          }" clearable @change="handleSelectOrganizeChange" />
        </el-form-item>
        <el-form-item :label="$t('role')" :label-width="formLabelWidth" prop="RoleId">
          <el-select v-model="editFrom.RoleId" multiple :reserve-keyword="true" clearable
            :placeholder="$t('pleaseSelect')" style="width: 400px">
            <el-option v-for="item in selectRole" :key="item.Id" :label="item.FullName" :value="item.Id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('remark')" :label-width="formLabelWidth" prop="Description">
          <el-input v-model="editFrom.Description" placeholder="" autocomplete="off" clearable style="width: 400px" />
        </el-form-item>
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
  </div>
</template>

<script>
import {
  getUserListWithPager,
  getUserDetail,
  saveUser,
  setUserEnable,
  deleteSoftUser,
  deleteUser,
  resetPassword,
} from '@/api/security/userservice'
import { getAllRoleList } from '@/api/security/roleservice'
import { getAllOrganizeTreeTable } from '@/api/security/organizeservice'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'User',
  data() {
    return {
      searchform: {
        RoleId: '',
        Keywords: '',
        CreateTime: [],
        CreatorTime1: '',
        CreatorTime2: '',
      },
      selectRole: [],
      selectedOrganizeOptions: '',
      selectOrganize: [],
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t('today'),
            onClick(picker) {
              let end = new Date()
              let start = new Date()
              start.setTime(start.getTime())
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: this.$t('yesterday'),
            onClick(picker) {
              let end = new Date()
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: this.$t('recentTwoDays'),
            onClick(picker) {
              let end = new Date()
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: this.$t('recentThreeDays'),
            onClick(picker) {
              let end = new Date()
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: this.$t('recentOneWeek'),
            onClick(picker) {
              let end = new Date()
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: this.$t('recentOneMonth'),
            onClick(picker) {
              let end = new Date()
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: this.$t('recentTwoMonth'),
            onClick(picker) {
              let end = new Date()
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
              picker.$emit('pick', [start, end])
            },
          },
        ],
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

      },
      rules: {
        /*  UserType: [
           {
             required: false,
             message: this.$t('pleaseUserType'),
             trigger: 'change',
           },
         ], */
        Account: [
          {
            required: true,
            message: this.$t('pleaseEnterID'),
            trigger: 'blur',
          },
          {
            min: 2,
            max: 50,
            message: this.$t('TheValueContains2to16characters'),
            trigger: 'blur',
          },
        ],
        RealName: [
          {
            required: true,
            message: this.$t('PleaseEnterYourName'),
            trigger: 'blur',
          },
          {
            min: 2,
            max: 50,
            message: this.$t('TheValueContains2to50characters'),
            trigger: 'blur',
          },
        ],
        DepartmentId: [
          {
            required: true,
            message: this.$t('SelectAnOrganization'),
            trigger: 'blur',
          },
        ],
        RoleId: [
          {
            required: true,
            message: this.$t('PleaseSelectTheRole'),
            trigger: 'blur',
          },
        ],
      },
      formLabelWidth: '130px',
      currentId: '', // 当前操作对象的ID值，主要用于修改
      currentSelected: [],
      currentRow: {},

    }
  },
  computed: {
    ...mapGetters({
      userTypes: 'common/UserTypes',
    }),
  },
  created() {
    this.pagination.currentPage = 1
    this.InitDictItem()
    this.loadTableData()
    this.setUserType({ S_EnCode: 'UserType' })

  },
  methods: {

    handleCurrentRow(row) {
      this.currentRow = row
    },
    handleChangeDatePicker(arr) {
      if (arr) {
        this.$set(this.searchform, 'CreatorTime1', arr[0])
        this.$set(this.searchform, 'CreatorTime2', arr[1])
      } else {
        this.$set(this.searchform, 'CreatorTime1', '')
        this.$set(this.searchform, 'CreatorTime2', '')
      }
    },
    getUserType(val) {
      let obj = this.userTypes.find((res) => res.ItemCode === val)
      if (obj) {
        return obj.ItemName
      }
      return ''
    },
    ...mapActions({
      setUserType: 'common/setUserType',
    }),
    /**
     * 初始化数据
     */
    InitDictItem() {
      getAllRoleList().then((res) => {
        if (res.Success && res.ResData) {
          this.selectRole = res.ResData
        }
      })
      getAllOrganizeTreeTable().then((res) => {
        if (res.Success && res.ResData) {
          this.selectOrganize = res.ResData
        }
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
        Keywords: this.searchform.Keywords,
        Order: this.sortableData.order,
        Sort: this.sortableData.sort,
        CreatorTime1: this.searchform.CreatorTime1,
        CreatorTime2: this.searchform.CreatorTime2,
        RoleId: this.searchform.RoleId,
      }
      getUserListWithPager(seachdata).then((res) => {
        if (res.Success && res.ResData) {
          this.tableData = res.ResData.Items
          this.pagination.pageTotal = res.ResData.TotalItems
          this.tableloading = false
        }
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
        Account: '',
        RealName: '',
        NickName: '',
        Gender: 1,
        Birthday: '',
        MobilePhone: '',
        EmailAddress: '',
        WeChat: '',
        DepartmentId: '',
        RoleId: '',
        IsAdministrator: false,
        EnabledMark: true,
        Description: '',
        UserType: '',
      }
      this.selectedOrganizeOptions = ''
      this.resetForm('editFrom')
    },
    /**
     * 新增、修改或查看明细信息（绑定显示数据）     *
     */
    ShowEditOrViewDialog: function (view) {
      this.reset()
      if (view !== undefined) {
        if (!this.currentRow || JSON.stringify(this.currentRow) === "{}") {
          this.$alert(
            this.$t('PleaseselectdatatoeditOrmodify'),
            this.$t('hint')
          )
        } else {
          this.currentId = this.currentRow.Id
          this.editFormTitle = this.$t('edit')
          this.dialogEditFormVisible = true
          this.bindEditInfo()
        }
      } else {
        this.editFormTitle = this.$t('Added')
        this.currentId = ''
        this.selectedOrganizeOptions = ''
        this.dialogEditFormVisible = true
      }
    },
    bindEditInfo: function () {
      getUserDetail(this.currentId).then((res) => {
        if (res.Success && res.ResData) {
          this.editFrom = res.ResData
          this.editFrom.RoleId = res.ResData.RoleId.split(',')
          this.selectedOrganizeOptions = res.ResData.DepartmentId
        }
      })
    },
    /**
     * 新增/修改保存
     */
    saveEditForm() {
      this.$refs['editFrom'].validate((valid) => {
        if (valid) {
          let data = {
            Account: this.editFrom.Account,
            Birthday: this.editFrom.Birthday,
            DepartmentId: this.editFrom.DepartmentId,
            Description: this.editFrom.Description,
            EmailAddress: this.editFrom.EmailAddress,
            EnabledMark: this.editFrom.EnabledMark,
            Gender: this.editFrom.Gender,
            Id: this.currentId,
            IsAdministrator: this.editFrom.IsAdministrator,
            MobilePhone: this.editFrom.MobilePhone,
            NickName: this.editFrom.NickName,
            RealName: this.editFrom.RealName,
            RoleId: this.editFrom.RoleId.join(','),
            WeChat: this.editFrom.WeChat,
            UserType: this.editFrom.UserType,
          }
          var url = 'User/Insert'
          if (this.currentId !== '') {
            url = 'User/Update'
          }
          saveUser(data, url).then((res) => {
            if (res.Success) {
              this.$message({
                message: this.$t('operateSuccessfully'),
                type: 'success',
              })
              this.dialogEditFormVisible = false
              this.currentSelected = ''
              this.selectedOrganizeOptions = ''
              this.loadTableData()
              this.InitDictItem()
            } else {
              this.$message({
                message: res.ResultMsg,
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
        let data = {
          Ids: currentIds,
          Flag: val,
        }
        setUserEnable(data).then((res) => {
          if (res.Success) {
            this.$message({
              message: this.$t('operateSuccessfully'),
              type: 'success',
            })
            this.currentSelected = ''
            this.loadTableData()
          } else {
            this.$message({
              message: res.ResultMsg,
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
        let data = {
          Ids: currentIds,
          Flag: val,
        }
        deleteSoftUser(data).then((res) => {
          if (res.Success) {
            this.$message({
              message: this.$t('operateSuccessfully'),
              type: 'success',
            })
            this.currentSelected = ''
            this.loadTableData()
          } else {
            this.$message({
              message: res.ResultMsg,
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
            let data = {
              Ids: currentIds,
            }
            return deleteUser(data)
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
                message: res.ResultMsg,
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

    /**
     *选择组织
     */
    handleSelectOrganizeChange: function () {
      this.editFrom.DepartmentId = this.selectedOrganizeOptions
    },
    dateformatter(row, column, cellValue, index) {
      var date = row[column.property]
      return cellValue ? new Date(date).format('yyyy-MM-dd') : ''
    },
    handleResetPassword: function (val) {
      if (!this.currentRow || JSON.stringify(this.currentRow) === "{}") {
        this.$alert(this.$t('Selectthedatatooperateonfirst'), this.$t('hint'))
        return false
      } else {
        let data = {
          userId: this.currentRow.Id,
        }
        this.$confirm(this.$t('ResetPasswordContinue'), this.$t('hint'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning',
        })
          .then(() => {
            resetPassword(data).then((res) => {
              if (res.Success) {
                this.$alert(
                  this.$t('ResetPasswordSucceededNewSecretIs', {
                    0: res.ResultMsg,
                  }),
                  this.$t('remind'),
                  {
                    confirmButtonText: this.$t('confirm'),
                    callback: (action) => { },
                  }
                )
                this.currentRow = {}
                this.loadTableData()
              } else {
                this.$message({
                  message: res.ResultMsg,
                  type: 'error',
                })
              }
            })
          })
          .catch(() => {
            /*  this.$message({
               type: 'info',
               message: this.$t('CancelledDelete'),
             }) */
          })
      }
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
