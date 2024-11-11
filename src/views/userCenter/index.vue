<template>
  <div class="page_container">
    <div class="title">
      {{ $t('basicInformation') }}
    </div>
    <el-form ref="editFrom" :model="editFrom" :rules="rules" class="yuebon-setting-form">
      <!-- <el-tabs v-model="activeName" >
        <el-tab-pane :label="$t('basicInformation')" name="first"> -->
      <el-form-item :label="$t('headPortrait')" :label-width="formLabelWidth" prop="HeadIcon">
        <el-upload class="avatar-uploader" :action="httpFileUploadUrl" :headers="headers" :show-file-list="false"
          :on-success="uploadFileSuccess">
          <img v-if="editFrom.HeadIcon" :src="editFrom.HeadIcon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-dialog :visible.sync="dialogHeadIconVisible">
          <img width="100%" :src="dialogHeadIconImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item :label="$t('accountNumber')" :label-width="formLabelWidth" prop="Account">
        <el-input v-model="editFrom.Account" :placeholder="$t('PleaseEnterTheLoginAccoun')" :disabled="true"
          autocomplete="off" clearable />
      </el-form-item>
      <el-form-item :label="$t('compellation')" :label-width="formLabelWidth" prop="RealName">
        <el-input v-model="editFrom.RealName" :placeholder="$t('PleaseEnterYourName')" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item :label="$t('nickname')" :label-width="formLabelWidth" prop="NickName">
        <el-input v-model="editFrom.NickName" :placeholder="$t('PleaseEnterNickname')" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item :label="$t('gender')" :label-width="formLabelWidth" prop="Gender">
        <el-radio-group v-model="editFrom.Gender">
          <el-radio label="1">{{ $t('man') }}</el-radio>
          <el-radio label="0">{{ $t('girl') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('phoneNumber')" :label-width="formLabelWidth" prop="MobilePhone">
        <el-input v-model="editFrom.MobilePhone" :placeholder="$t('pleaseEnterPhoneNumber')" autocomplete="off"
          clearable />
      </el-form-item>
      <el-form-item :label="$t('WechatID')" :label-width="formLabelWidth" prop="WeChat">
        <el-input v-model="editFrom.WeChat" :placeholder="$t('pleaseEnterWechatID')" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item :label="$t('email')" :label-width="formLabelWidth" prop="Email">
        <el-input v-model="editFrom.Email" :placeholder="$t('pleaseEnterWechatID')" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item :label="$t('dateOfBirth')" :label-width="formLabelWidth" prop="Birthday">
        <el-date-picker v-model="editFrom.Birthday" type="date" :placeholder="$t('optionDate')" />
      </el-form-item>
      <el-form-item :label="$t('option')" :label-width="formLabelWidth" prop="" disabled>
        <el-checkbox v-model="editFrom.EnabledMark" disabled>{{ $t('enable') }}</el-checkbox>
        <el-checkbox v-model="editFrom.IsAdministrator" disabled>{{ $t('manager') }}</el-checkbox>
      </el-form-item>
      <el-form-item :label="$t('NASA')" :label-width="formLabelWidth" prop="DepartmentId">
        <el-cascader v-model="selectedOrganizeOptions" :options="selectOrganize" style="width: 100%" disabled filterable
          :props="{
            label: 'FullName',
            value: 'Id',
            children: 'Children',
            emitPath: false,
            checkStrictly: true,
            expandTrigger: 'hover',
          }" clearable @change="handleSelectOrganizeChange" />
      </el-form-item>
      <el-form-item :label="$t('role')" :label-width="formLabelWidth" prop="RoleId">
        <el-select v-model="editFrom.RoleId" style="width: 100%" multiple clearable disabled
          :placeholder="$t('pleaseSelect')">
          <el-option v-for="item in selectRole" :key="item.Id" :label="item.FullName" :value="item.Id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('EmployeeGroup')" :label-width="formLabelWidth" prop="EmployeeGroupID">
        <el-select v-model="editFrom.EmployeeGroupID" :reserve-keyword="true" disabled filterable
          :placeholder="$t('pleaseSelect')" style="width: 100%">
          <el-option v-for="item in employeeGroupOptions" :key="item.ID" :label="item.Description" :value="item.ID" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('status')" :label-width="formLabelWidth" prop="StatusID">
        <el-select v-model="editFrom.StatusID" :reserve-keyword="true" disabled filterable
          :placeholder="$t('pleaseSelect')" style="width: 100%">
          <el-option v-for="item in employeeStatusOptions" :key="item.ID" :label="item.Description" :value="item.ID" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('PermissionGroup')" :label-width="formLabelWidth" prop="PermissionId">
        <el-select v-model="editFrom.PermissionId" :reserve-keyword="true" disabled filterable
          :placeholder="$t('pleaseSelect')" style="width: 100%">
          <el-option v-for="item in permissionGroupOptions" :key="item.ID" :label="item.Description" :value="item.ID" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('remark')" :label-width="formLabelWidth" prop="Description">
        <el-input v-model="editFrom.Description" placeholder="" autocomplete="off" clearable />
      </el-form-item>
      <!-- </el-tab-pane>
      </el-tabs> -->
      <el-form-item>
        <el-button type="primary" class="btnset" @click="saveEditForm()">
          {{ $t('save') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getByUserName, saveUser } from '@/api/security/userservice'
import { getAllRoleList } from '@/api/security/roleservice'
import { getAllOrganizeTreeTable } from '@/api/security/organizeservice'
import { BaseUrl } from '@/utils/request'
import { GetEmployeeGroup, GetEmployeeStatus, GetPermissionGroup } from '@/api/configCommon.js'

import { getAccessToken } from '@/utils/accessToken'
export default {
  name: 'UserInfoPage',
  data() {
    return {
      activeName: 'first',
      selectRole: [],
      selectedOrganizeOptions: '',
      selectOrganize: [],
      editFrom: {
        Account: '',
        HeadIcon: '',
        RealName: '',
        NickName: '',
        Gender: '1',
        Birthday: '',
        MobilePhone: '',
        Email: '',
        WeChat: '',
        DepartmentId: '',
        RoleId: '',
        IsAdministrator: true,
        EnabledMark: true,
        Description: '',
        EmployeeGroupID: null,
        StatusID: null,
        PermissionId: null,
      },
      rules: {
        /* StatusID: [
          {
            required: true,
            message: this.$t('pleaseSelect'),
            trigger: 'blur',
          },
        ],
        PermissionId: [
          {
            required: true,
            message: this.$t('pleaseSelect'),
            trigger: 'blur',
          },
        ], */
        RealName: [
          { required: true, message: this.$t('pleaseEnterName'), trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: 'Max 50 charts',
            trigger: 'blur',
          },
        ],
        MobilePhone: [
          { required: true, message: this.$t('PleaseEnterTheAccessAddress'), trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: this.$t('Contains2to32characters'),
            trigger: 'blur',
          },
        ],
      },
      httpFileUploadUrl: `${process.env.NODE_ENV === 'production'
        ? process.env.VUE_APP_BASE_URL
        : BaseUrl.api
        }/api/Files/Upload`,
      dialogHeadIconVisible: false,
      dialogHeadIconImageUrl: '',
      filelist: [],
      formLabelWidth: '150px',
      headers: [],
      employeeGroupOptions: [],
      employeeStatusOptions: [],
      permissionGroupOptions: [],
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo',
    }),
  },
  created() {
    this.InitDictItem()
    this.bindEditInfo()
    this.headers = { Authorization: getAccessToken() || '' }
    this.getEmployeeGroup()
    this.getEmployeeStatus()
    this.getPermissionGroup()
  },
  methods: {
    getPermissionGroup() {
      GetPermissionGroup().then(res => {
        if (res.Success) {
          this.permissionGroupOptions = [...res.ResData]
        }
      })
    },
    getEmployeeGroup() {
      GetEmployeeGroup().then(res => {
        if (res.Success) {
          this.employeeGroupOptions = [...res.ResData]
        }
      })

    },
    getEmployeeStatus() {
      GetEmployeeStatus().then(res => {
        if (res.Success) {
          this.employeeStatusOptions = [...res.ResData]
        }
      })
    },
    /**
     * 初始化数据
     */
    InitDictItem() {
      getAllRoleList().then((res) => {
        this.selectRole = res.ResData
      })
      getAllOrganizeTreeTable().then((res) => {
        this.selectOrganize = res.ResData
      })
    },
    handleClick(tab, event) { },

    /**
     *选择组织
     */
    handleSelectOrganizeChange: function () {
      this.editFrom.OrganizeId = this.selectedOrganizeOptions
    },
    handleRemove(file, fileList) {
      this.editFrom.SysLogo = file.url
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    bindEditInfo: function () {
      getByUserName(this.userInfo.Account).then((res) => {
        this.editFrom.Account = res.ResData.Account
        this.editFrom.RealName = res.ResData.RealName
        this.editFrom.NickName = res.ResData.NickName
        this.editFrom.Gender = res.ResData.Gender + ''
        this.editFrom.Birthday = res.ResData.Birthday
        this.editFrom.MobilePhone = res.ResData.MobilePhone
        this.editFrom.Email = res.ResData.Email
        this.editFrom.WeChat = res.ResData.WeChat
        this.editFrom.DepartmentId = res.ResData.DepartmentId
        this.editFrom.IsAdministrator = res.ResData.IsAdministrator
        this.editFrom.EnabledMark = res.ResData.EnabledMark
        this.editFrom.RoleId = res.ResData.RoleId.split(',')
        this.editFrom.Description = res.ResData.Description
        this.selectedOrganizeOptions = res.ResData.DepartmentId
        this.currentId = res.ResData.Id
        this.editFrom.HeadIcon = res.ResData.HeadIcon
        this.filelist = [
          { name: res.ResData.HeadIcon, url: res.ResData.HeadIcon },
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
            Account: this.editFrom.Account,
            RealName: this.editFrom.RealName,
            NickName: this.editFrom.NickName,
            Gender: this.editFrom.Gender,
            Birthday: this.editFrom.Birthday,
            MobilePhone: this.editFrom.MobilePhone,
            Email: this.editFrom.Email,
            WeChat: this.editFrom.WeChat,
            DepartmentId: this.editFrom.DepartmentId,
            IsAdministrator: this.editFrom.IsAdministrator,
            EnabledMark: this.editFrom.EnabledMark,
            RoleId: this.editFrom.RoleId.join(','),
            Description: this.editFrom.Description,
            HeadIcon: this.editFrom.HeadIcon,
            Id: this.currentId,
            EmployeeGroupID: this.editFrom.EmployeeGroupID,
            StatusID: this.editFrom.StatusID,
            PermissionId: this.editFrom.PermissionId,
          }
          var url = 'User/Update'
          saveUser(data, url).then((res) => {
            if (res.Success) {
              this.$message({
                message: this.$t('operateSuccessfully'),
                type: 'success',
              })
              this.selectedOrganizeOptions = ''
              this.$refs['editFrom'].resetFields()
              this.bindEditInfo()
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
    uploadFileSuccess: function (response, file, fileList) {
      this.editFrom.HeadIcon =
        `${process.env.NODE_ENV === 'production'
          ? process.env.VUE_APP_BASE_URL
          : BaseUrl.api
        }/` + response.ResData.FilePath
    },
  },
}
</script>
<style lang="scss" scoped>
.page_container {
  background-color: #fff;
  margin-bottom: 20px;
  overflow: hidden;
  height: inherit;

  .title {
    height: 38px;
    line-height: 38px;
    padding: 5px 15px;
    margin-bottom: 10px;
    box-shadow: 1px 1px 5px 1px #efefef;
  }
}

.el-form {
  height: calc(100vh - 245px);
  overflow-y: auto;

  .el-form-item {
    min-width: 300px;
    max-width: 500px;
  }
}

.yuebon-setting-form .el-tab-pane {
  width: 40%;
}

.yuebon-setting-form .el-input {
  width: 100%;
}

.yuebon-setting-form .el-select .el-input,
.yuebon-setting-form .el-cascader .el-input {
  width: 100%;
}

.yuebon-setting-form .btnset {
  float: right;
  margin-right: 30px;
  margin-top: 20px;
}

.avatar-uploader .el-upload {
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  .avatar {
    width: 176px;
    height: 176px;
    display: block;
    border: 1px solid #ccc;
  }
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 176px;
  height: 176px;
  line-height: 176px;
  border: 1px solid #ccc;
  text-align: center;
}
</style>
