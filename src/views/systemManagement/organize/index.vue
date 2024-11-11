<template>
  <div class="page_container">
    <el-card>
      <div class="list-btn-container">
        <el-button-group>
          <el-button
            v-hasPermi="['Organize/Add']"
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="ShowEditOrViewDialog()"
          >
            {{$t('Added')}}
          </el-button>
          <el-button
            v-hasPermi="['Organize/Edit']"
            type="primary"
            icon="el-icon-edit"
            class="el-button-modify"
            size="small"
            @click="ShowEditOrViewDialog('edit')"
          >
            {{$t('Modify')}}
          </el-button>
          <el-button
            v-hasPermi="['Organize/Enable']"
            type="info"
            icon="el-icon-video-pause"
            size="small"
            @click="setEnable('0')"
          >
            {{$t('disable')}}
          </el-button>
          <el-button
            v-hasPermi="['Organize/Enable']"
            type="success"
            icon="el-icon-video-play"
            size="small"
            @click="setEnable('1')"
          >
            {{$t('enable')}}
          </el-button>
          <el-button
            v-hasPermi="['Organize/DeleteSoft']"
            type="warning"
            icon="el-icon-delete"
            size="small"
            @click="deleteSoft('0')"
          >
            {{$t('softDelete')}}
          </el-button>
          <el-button
            v-hasPermi="['Organize/Delete']"
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="deletePhysics()"
          >
            {{$t('delete')}}
          </el-button>
          <el-button
            type="default"
            icon="el-icon-refresh"
            size="small"
            @click="loadTableData()"
          >
            {{$t('refresh')}}
          </el-button>
        </el-button-group>
      </div>
      <el-table
        ref="gridtable"
        v-loading="tableloading"
        :data="tableData"
        row-key="Id"
        border
        stripe
        highlight-current-row
        style="width: 100%"
        default-expand-all
        :tree-props="{ children: 'Children' }"
        height="calc(100vh - 250px)"
        @select="handleSelectChange"
        @select-all="handleSelectAllChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column
          prop="FullName"
          :label="$t('organizationName')"
          sortable="custom"
          width="380"
        />
        <el-table-column
          prop="EnCode"
          :label="$t('code')"
          sortable="custom"
          width="180"
        />
        <el-table-column
          prop="CategoryId"
          :label="$t('type')"
          sortable="custom"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            <slot>{{Categorys[scope.row.CategoryId]}}</slot>
          </template>
        </el-table-column>
        <el-table-column
          prop="ManagerId"
          :label="$t('principal')"
          sortable="custom"
          width="120"
        />
        <el-table-column
          prop="TelePhone"
          :label="$t('telephone')"
          sortable="custom"
          width="120"
        />
        <el-table-column
          prop="MobilePhone"
          :label="$t('mobilePhone')"
          sortable="custom"
          width="150"
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
        <el-table-column prop="CreatorTime" :label="$t('createTime')" sortable min-width="180"/>
        <el-table-column prop="LastModifyTime" :label="$t('updateTime')" sortable min-width="180"/>
      </el-table>
    </el-card>
    <el-dialog
      ref="dialogEditForm"
      v-el-drag-dialog
      :title="editFormTitle + ' '+ $t('organization')"
      :visible.sync="dialogEditFormVisible"
      width="660px"
    >
      <el-form
        ref="editFrom"
        :inline="true"
        :model="editFrom"
        :rules="rules"
        class="demo-form-inline"
      >
        <el-form-item
          :label="$t('parentOrganization')"
          :label-width="formLabelWidth"
          prop="ParentId"
        >
          <el-cascader
            v-model="selectedOrganizeOptions"
            style="width: 400px"
            :options="selectOrganize"
            filterable
            :props="{
              label: 'FullName',
              value: 'Id',
              children: 'Children',
              emitPath: false,
              checkStrictly: true,
              expandTrigger: 'hover',
            }"
            clearable
            @change="handleSelectOrganizeChange"
          />
        </el-form-item>
        <el-form-item
          :label="$t('name')"
          :label-width="formLabelWidth"
          prop="FullName"
        >
          <el-input
            v-model="editFrom.FullName"
            style="width: 400px"
            :placeholder="$t('PleaseEnterTheOrganizationName')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('code')" :label-width="formLabelWidth" prop="EnCode">
          <el-input
            v-model="editFrom.EnCode"
            :placeholder="$t('PleaseEnterTheOrganizationCode')"
            autocomplete="off"
            clearable
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item
          :label="$t('type')"
          :label-width="formLabelWidth"
          prop="CategoryId"
        >
          <el-select
            v-model="editFrom.CategoryId"
            clearable
            :placeholder="$t('pleaseSelectType')"
            style="width: 400px"
          >
            <el-option
              v-for="item in selectOrganizeType"
              :key="item.Id"
              :label="item.ItemName"
              :value="item.ItemCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('abbreviation')"
          :label-width="formLabelWidth"
          prop="ShortName"
        >
          <el-input
            v-model="editFrom.ShortName"
            :placeholder="$t('pleaseEnterAbbreviation')"
            autocomplete="off"
            clearable
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item
          :label="$t('principal')"
          :label-width="formLabelWidth"
          prop="ManagerId"
        >
          <el-input
            v-model="editFrom.ManagerId"
            :placeholder="$t('pleaseEnterPrincipal')"
            autocomplete="off"
            clearable
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item
          :label="$t('mobilePhone')"
          :label-width="formLabelWidth"
          prop="MobilePhone"
        >
          <el-input
            v-model="editFrom.MobilePhone"
            :placeholder="$t('pleaseEnterMobilePhone')"
            autocomplete="off"
            clearable
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item
          :label="$t('landlinePhone')"
          :label-width="formLabelWidth"
          prop="TelePhone"
        >
          <el-input
            v-model="editFrom.TelePhone"
            :placeholder="$t('pleaseEnterLandlinePhone')"
            autocomplete="off"
            clearable
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item
          :label="$t('WechatID')"
          :label-width="formLabelWidth"
          prop="WeChat"
        >
          <el-input
            v-model="editFrom.WeChat"
            :placeholder="$t('pleaseEnterWechatID')"
            autocomplete="off"
            clearable
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="Email" :label-width="formLabelWidth" prop="Email">
          <el-input
            v-model="editFrom.Email"
            :placeholder="$t('pleaseEnterEmail')"
            autocomplete="off"
            clearable
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item :label="$t('fax')" :label-width="formLabelWidth" prop="Fax">
          <el-input
            v-model="editFrom.Fax"
            :placeholder="$t('pleaseEnterFax')"
            autocomplete="off"
            clearable
            style="width: 400px"
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
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item :label="$t('option')" :label-width="formLabelWidth" prop="">
          <el-checkbox v-model="editFrom.EnabledMark">{{$t('enable')}}</el-checkbox>
          <el-checkbox v-model="editFrom.DeleteMark">{{$t('delete')}}</el-checkbox>
        </el-form-item>
        <el-form-item :label="$t('address')" :label-width="formLabelWidth" prop="Address">
          <el-input
            v-model="editFrom.Address"
            style="width: 400px"
            :placeholder="$t('pleaseEnterAddress')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('describe')"
          :label-width="formLabelWidth"
          prop="Description"
        >
          <el-input
            v-model="editFrom.Description"
            style="width: 400px"
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
import { getListItemDetailsByCode } from '@/api/basebasic'
import {
  getAllOrganizeTreeTable,
  getOrganizeDetail,
  saveOrganize,
  setOrganizeEnable,
  deleteSoftOrganize,
  deleteOrganize,
} from '@/api/security/organizeservice'

import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  name: 'Organize',
  directives: { elDragDialog },
  data() {
    return {
      loadBtnFunc: [],
      selectedOrganizeOptions: '',
      selectOrganize: [],
      selectOrganizeType: [],
      tableData: [],
      tableloading: true,
      dialogEditFormVisible: false,
      editFormTitle: '',
      editFrom: {},
      rules: {
        FullName: [
          { required: true, message: this.$t('pleaseEnterName'), trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: this.$t('TheValueContains2to50characters'),
            trigger: 'blur',
          },
        ],
        CategoryId: [
          { required: true, message: this.$t('pleaseSelectType'), trigger: 'blur' },
        ],
      },
      formLabelWidth: '140px',
      currentId: '', // 当前操作对象的ID值，主要用于修改
      currentSelected: [],
      Categorys:{
        Area: this.$t('area'),
        Company: this.$t('company'),
        SubCompany: this.$t('subsidiaryCorporation'),
        Department: this.$t('department'),
        SubDepartment: this.$t('subdivision'),
        WorkGroup: this.$t('workingTeam')
      }
    }
  },
  created() {
    this.InitDictItem()
    this.loadTableData()
  },
  methods: {
    /**
     * 初始化数据
     */
    InitDictItem() {
      getListItemDetailsByCode('OrganizeCategory').then((res) => {
        this.selectOrganizeType = res.ResData
      })
    },
    /**
     * 加载页面table数据
     */
    loadTableData: function () {
      this.tableloading = true
      getAllOrganizeTreeTable().then((res) => {
        this.tableData = res.ResData
        this.selectOrganize = res.ResData
        this.tableloading = false
      })
    },

    /**
     *选择组织
     */
    handleSelectOrganizeChange: function () {
      this.editFrom.ParentId = this.selectedOrganizeOptions
    },
    // 表单重置
    reset() {
      this.editFrom = {
        FullName: '',
        EnCode: '',
        ParentId: '',
        ShortName: '',
        CategoryId: '',
        ManagerId: '',
        TelePhone: '',
        MobilePhone: '',
        WeChat: '',
        Fax: '',
        Email: '',
        Address: '',
        AllowEdit: true,
        AllowDelete: true,
        SortCode: 99,
        EnabledMark: true,
        DeleteMark: false,
        Description: '',
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
      }
    },
    bindEditInfo: function () {
      getOrganizeDetail(this.currentId).then((res) => {
        this.editFrom = res.ResData
        this.selectedOrganizeOptions = res.ResData.ParentId
      })
    },
    /**
     * 新增/修改保存
     */
    saveEditForm() {
      this.$refs['editFrom'].validate((valid) => {
        if (valid) {
          const data = {
            ParentId: this.editFrom.ParentId,
            EnCode: this.editFrom.EnCode,
            FullName: this.editFrom.FullName,
            ShortName: this.editFrom.ShortName,
            CategoryId: this.editFrom.CategoryId,
            ManagerId: this.editFrom.ManagerId,
            TelePhone: this.editFrom.TelePhone,
            MobilePhone: this.editFrom.MobilePhone,
            WeChat: this.editFrom.WeChat,
            Fax: this.editFrom.Fax,
            Email: this.editFrom.Email,
            Address: this.editFrom.Address,
            AllowEdit: this.editFrom.AllowEdit,
            AllowDelete: this.editFrom.AllowDelete,
            DeleteMark: this.editFrom.DeleteMark,
            SortCode: this.editFrom.SortCode,
            EnabledMark: this.editFrom.EnabledMark,
            Description: this.editFrom.Description,
            Id: this.currentId,
          }
          var url = 'Organize/Insert'
          if (this.currentId !== '') {
            url = 'Organize/Update'
          }
          saveOrganize(data, url).then((res) => {
            if (res.Success) {
              this.$message({
                message: this.$t('operateSuccessfully'),
                type: 'success',
              })
              this.dialogEditFormVisible = false
              this.currentSelected = ''
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
        setOrganizeEnable(data).then((res) => {
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
        deleteSoftOrganize(data).then((res) => {
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
            return deleteOrganize(data)
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
  },
}
</script>
