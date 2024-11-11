<template>
  <div class="page_container">
    <el-card>
      <el-form ref="searchform" :inline="true" :model="searchform" class="demo-form-inline" size="small">
        <el-form-item :label="$t('roleName')">
          <el-input v-model="searchform.name" clearable :placeholder="$t('roleNameOrCode')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">
            {{ $t('query') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="position: relative">
      <el-button-group>
        <el-button v-hasPermi="['Role/Add']" type="primary" icon="el-icon-plus" size="small"
          @click="ShowEditOrViewDialog(null, $t('Added'))">
          {{ $t('Added') }}
        </el-button>
        <el-button v-hasPermi="['Role/Edit']" type="primary" icon="el-icon-edit" class="el-button-modify" size="small"
          @click="ShowEditOrViewDialog('edit', $t('edit'))">
          {{ $t('Modify') }}
        </el-button>
        <el-button v-hasPermi="['Role/Clone']" type="primary" icon="el-icon-copy-document" class="el-button-modify" size="small"
          @click="ShowEditOrViewDialog('clone', $t('clone'))">
          {{ $t('clone') }}
        </el-button>
        <el-button v-hasPermi="['Role/Enable']" type="info" icon="el-icon-video-pause" size="small"
          @click="setEnable('0')">
          {{ $t('disable') }}
        </el-button>
        <el-button v-hasPermi="['Role/Enable']" type="success" icon="el-icon-video-play" size="small"
          @click="setEnable('1')">
          {{ $t('enable') }}
        </el-button>
        <el-button v-hasPermi="['Role/DeleteSoft']" type="warning" icon="el-icon-delete" size="small"
          @click="deleteSoft('0')">
          {{ $t('softDelete') }}
        </el-button>
        <el-button v-hasPermi="['Role/Delete']" type="danger" icon="el-icon-delete" size="small" @click="deletePhysics()">
          {{ $t('delete') }}
        </el-button>
        <el-button v-hasPermi="['Role/SetAuthorize']" type="default" icon="el-icon-s-custom" size="small"
          @click="handleSetAuth()">
          {{ $t('authorityOfDistribution') }}
        </el-button>
        <el-button type="default" icon="el-icon-refresh" size="small" @click="loadTableData()">
          {{ $t('refresh') }}
        </el-button>
        <el-button v-hasPermi="['Role/systemInit']" type="text" size="small"
          style="position: absolute; right: 5px; top: 0; color: transparent;" @click="getSystemInit()">
          systemInit
        </el-button>
      </el-button-group>
      <el-table ref="gridtable" v-loading="tableloading" :data="tableData" border stripe highlight-current-row
        style="width: 100%" :default-sort="{ prop: 'SortCode', order: 'descending' }" height="calc(100vh - 400px)"
        @select="handleSelectChange" @select-all="handleSelectAllChange" @sort-change="handleSortChange"
        @current-change="handleCurrentRow">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="FullName" :label="$t('roleName')" sortable="custom" width="180" />
        <el-table-column prop="EnCode" :label="$t('roleCode')" sortable="custom" width="180" />
        <el-table-column prop="Type" :label="$t('type')" sortable="custom" width="100" align="center">
          <template slot-scope="scope">
            <slot v-if="scope.row.Type === '1'">{{ $t('systemRole') }}</slot>
            <slot v-else-if="scope.row.Type === '2'">
              {{ $t('businessRole') }}
            </slot>
            <slot v-else-if="scope.row.Type === '3'">
              {{ $t('otherRole') }}
            </slot>
          </template>
        </el-table-column>
        <el-table-column prop="OrganizeName" :label="$t('NASA')" width="120" />
        <el-table-column :label="$t('isEnable')" sortable="custom" width="180" prop="EnabledMark" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.EnabledMark === true ? 'success' : 'info'" disable-transitions>
              {{
                scope.row.EnabledMark === true ? $t('enable') : $t('disable')
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('isDelete')" sortable="custom" width="170" prop="DeleteMark" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.DeleteMark === true ? 'danger' : 'success'" disable-transitions>
              {{ scope.row.DeleteMark === true ? $t('haveDeleted') : $t('no') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="CreatorTime" :label="$t('createTime')" sortable min-width="180" />
        <el-table-column prop="LastModifyTime" :label="$t('updateTime')" sortable min-width="180" />
      </el-table>
      <div class="pagination-container">
        <el-pagination background :current-page="pagination.currentPage" :page-sizes="[5, 10, 20, 50, 100, 200, 300, 400]"
          :page-size="pagination.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.pageTotal"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <el-dialog ref="dialogEditForm" v-el-drag-dialog :title="editFormTitle + ' ' + $t('role')"
      :visible.sync="dialogEditFormVisible" width="640px">
      <el-form ref="editFrom" :inline="true" :model="editFrom" :rules="rules" class="demo-form-inline">
        <el-form-item :label="$t('roleName')" :label-width="formLabelWidth" prop="FullName">
          <el-input v-model="editFrom.FullName" :placeholder="$t('pleaseEnterRoleName')" autocomplete="off" clearable
            style="width: 320px" />
        </el-form-item>
        <el-form-item :label="$t('roleCode')" :label-width="formLabelWidth" prop="EnCode">
          <el-input v-model="editFrom.EnCode" :placeholder="$t('pleaseEnterRoleCode')" autocomplete="off" clearable
            style="width: 320px" />
        </el-form-item>
        <el-form-item :label="$t('roleType')" :label-width="formLabelWidth" prop="Type">
          <el-select v-model="editFrom.Type" clearable :placeholder="$t('pleaseSelectType')" style="width: 320px">
            <el-option v-for="item in selectRoleType" :key="item.Id" :label="item.ItemName" :value="item.ItemCode" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('ownershipGroup')" :label-width="formLabelWidth" prop="OrganizeId">
          <el-cascader :key="cascaderKey" v-model="selectedOrganizeOptions" :options="selectOrganize" filterable :props="{
            label: 'FullName',
            value: 'Id',
            children: 'Children',
            emitPath: false,
            checkStrictly: true,
            expandTrigger: 'hover',
          }" clearable style="width: 320px" @change="handleSelectOrganizeChange" />
        </el-form-item>
        <el-form-item :label="$t('sort')" :label-width="formLabelWidth" prop="SortCode">
          <el-input v-model.number="editFrom.SortCode" :placeholder="$t('pleaseEnterSort')" autocomplete="off" clearable
            style="width: 320px" />
        </el-form-item>
        <el-form-item :label="$t('describe')" :label-width="formLabelWidth" prop="Description">
          <el-input v-model="editFrom.Description" autocomplete="off" clearable style="width: 320px" />
        </el-form-item>
        <el-form-item :label="$t('isEnable')" :label-width="formLabelWidth" prop="EnabledMark">
          <el-radio-group v-model="editFrom.EnabledMark">
            <el-radio :label="true">{{ $t('yes') }}</el-radio>
            <el-radio :label="false">{{ $t('no') }}</el-radio>
          </el-radio-group>
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

    <el-dialog ref="dialogSetAuthForm" v-el-drag-dialog :title="$t('authorityOfDistribution')"
      :visible.sync="dialogSetAuthFormVisible" width="70%">
      <el-tabs v-model="ActionName" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="$t('AvailableSystem')" name="treeSystem">
          <el-card class="box-card">
            <el-tree ref="treeSystem" :data="treeSystemData" :check-strictly="true" :empty-text="$t('LoadingPleaseWait')"
              show-checkbox default-expand-all node-key="Id" highlight-current
              :props="{ label: 'FullName', children: 'Children' }" />
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('functionMenu')" name="treeFunction">
          <el-card class="box-card">
            <el-tree ref="treeFunction" :data="treeFuntionData" :check-strictly="true"
              :empty-text="$t('LoadingPleaseWait')" show-checkbox default-expand-all node-key="Id" highlight-current
              :props="{
                label: 'FullName',
                children: 'Children',
                disabled: 'IsShow',
              }" />
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('dataPermission')" name="treeOrganize">
          <el-card class="box-card">
            <el-tree ref="treeOrganize" :data="treeOrganizeData" :check-strictly="true"
              :empty-text="$t('LoadingPleaseWait')" show-checkbox default-expand-all node-key="Id" highlight-current
              :props="{ label: 'FullName', children: 'Children' }" />
          </el-card>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSetAuthFormVisible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" @click="saveRoleAuthorize()">
          {{ $t('save') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getListItemDetailsByCode } from '@/api/basebasic'
import {
  getRoleListWithPager,
  getRoleDetail,
  saveRole,
  setRoleEnable,
  deleteSoftRole,
  deleteRole,
  getRoleAuthorizeFunction,
  getAllFunctionTree,
  getAllRoleDataByRoleId,
  saveRoleAuthorize,
} from '@/api/security/roleservice'

import { getAllOrganizeTreeTable } from '@/api/security/organizeservice'
import { getAllSystemTypeList } from '@/api/developers/systemtypeservice'
import { Loading } from 'element-ui'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import { SetSyncUserData } from '@/api/user.js'
export default {
  name: 'Role',
  directives: { elDragDialog },
  data() {
    return {
      searchform: {
        name: '',
      },
      loadBtnFunc: [],
      selectedOrganizeOptions: '',
      selectOrganize: [],
      selectRoleType: [],
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
        FullName: [
          {
            required: true,
            message: this.$t('pleaseEnterRoleName'),
            trigger: 'blur',
          },
          {
            min: 2,
            max: 50,
            message: this.$t('TheValueContains2to50characters'),
            trigger: 'blur',
          },
        ],
        EnCode: [
          {
            required: true,
            message: this.$t('pleaseEnterRoleCode'),
            trigger: 'blur',
          },
          {
            min: 2,
            max: 50,
            message: this.$t('TheValueContains2to50characters'),
            trigger: 'blur',
          },
        ],
        Type: [
          {
            required: true,
            message: this.$t('pleaseSelectRoleType'),
            trigger: 'blur',
          },
        ],
        OrganizeId: [
          {
            required: true,
            message: this.$t('pleaseSelectDepartment'),
            trigger: 'blur',
          },
        ],
      },
      formLabelWidth: '180px',
      currentId: '', // 当前操作对象的ID值，主要用于修改
      currentSelected: [],
      pageLoading: '',
      dialogSetAuthFormVisible: false,
      treeFuntionData: [],
      default_select: [],
      defaultOrganize_select: [],
      treeOrganizeData: [],
      defaultSystem_select: [],
      treeSystemData: [],
      cascaderKey: 0,
      ActionName: 'treeSystem',
      currentRow: {},
      flag: ''
    }
  },
  created() {
    this.pagination.currentPage = 1
    this.InitDictItem()
    this.loadTableData()
    this.loadBtnFunc = JSON.parse(sessionStorage.getItem('yueboncurrentfuns'))
  },
  methods: {
    getSystemInit() {
      SetSyncUserData().then(res=>{
        if(res.Success){
          this.$message('System init successfully');
        }
      })
    },
    handleCurrentRow(row) {
      this.currentRow = row
    },
    /**
     * 初始化数据
     */
    InitDictItem() {
      getListItemDetailsByCode('RoleType').then((res) => {
        this.selectRoleType = res.ResData
      })

      getAllOrganizeTreeTable().then((res) => {
        ++this.cascaderKey
        this.selectOrganize = res.ResData
      })

      getAllFunctionTree().then((res) => {
        this.treeFuntionData = res.ResData
      })
      getAllOrganizeTreeTable().then((res) => {
        this.treeOrganizeData = res.ResData
      })
      getAllSystemTypeList().then((res) => {
        this.treeSystemData = res.ResData
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
      getRoleListWithPager(seachdata).then((res) => {
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
     *选择组织
     */
    handleSelectOrganizeChange: function () {
      this.editFrom.OrganizeId = this.selectedOrganizeOptions
    },
    // 表单重置
    reset() {
      this.editFrom = {
        FullName: '',
        EnCode: '',
        RoleType: '',
        OrganizeId: '',
        SortCode: 99,
        EnabledMark: true,
        Description: '',
      }
      this.selectedOrganizeOptions = ''
      this.resetForm('editFrom')
    },
    /**
     * 新增、修改或查看明细信息（绑定显示数据）     *
     */
    ShowEditOrViewDialog: function (view, title) {
      this.flag = ''
      this.reset()
      if (view) {
        this.flag = view
        if (!this.currentRow || JSON.stringify(this.currentRow) === "{}") {
          this.$alert(
            this.$t('PleaseselectdatatoeditOrmodify') + `/${this.$t('clone')}`,
            this.$t('hint')
          )
        } else {
          this.currentId = this.currentRow.Id;
          this.editFormTitle = title
          this.dialogEditFormVisible = true
          this.bindEditInfo()
        }
      } else {
        this.editFormTitle = title
        this.currentId = ''
        this.dialogEditFormVisible = true
      }
    },

    bindEditInfo: function () {
      getRoleDetail(this.currentId).then((res) => {
        this.editFrom = res.ResData
        this.selectedOrganizeOptions = res.ResData.OrganizeId
      })
    },
    /**
     * 新增/修改保存
     */
    saveEditForm() {
      this.$refs['editFrom'].validate((valid) => {
        if (valid) {
          /*  if(this.editFormTitle === this.$t('clone')){
             this.currentId = '';
             this.$refs.gridtable.setCurrentRow(this.editFrom);
           } */
          var loadop = {
            lock: true,
            text: this.$t('SavingDataPleaseWaitPatiently'),
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
          }
          this.pageLoading = Loading.service(loadop)
          let data = {
            OrganizeId: this.editFrom.OrganizeId,
            EnCode: this.editFrom.EnCode,
            FullName: this.editFrom.FullName,
            Type: this.editFrom.Type,
            SortCode: this.editFrom.SortCode,
            EnabledMark: this.editFrom.EnabledMark,
            Description: this.editFrom.Description,
            Id: this.currentId,
          }
          var url = 'Role/Insert'
          if (this.currentId !== '') {
            if (this.flag === 'edit') {
              url = 'Role/Update'
            } else {
              url = 'Role/Clone'
              // data.CreatorUserId = ''
              // data.LastModifyUserId = ''
              // data.DeleteUserId = ''
            }
          }

          saveRole(data, url).then((res) => {
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
            this.pageLoading.close()
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
        setRoleEnable(data).then((res) => {
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
        let data = {
          Ids: currentIds,
          Flag: val,
        }
        deleteSoftRole(data).then((res) => {
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
            let data = {
              Ids: currentIds,
            }
            return deleteRole(data)
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
    /**
     * 设置权限
     */
    handleSetAuth: function () {
      if (!this.currentRow || JSON.stringify(this.currentRow) === "{}") {
        this.$alert(this.$t('Selectthedatatooperateonfirst'), this.$t('hint'))
        return false
      } else {
        this.currentId = this.currentRow.Id
        this.dialogSetAuthFormVisible = true

        this.ActionName = 'treeSystem'
        this.default_select = []
        this.defaultOrganize_select = []
        this.defaultSystem_select = []

        let datar = {
          roleId: this.currentId,
        }
        getAllRoleDataByRoleId(datar).then((res) => {
          this.defaultOrganize_select = res.ResData
          setTimeout(this.restFrom(), 500)
        })

        let data = {
          roleId: this.currentId,
          itemType: '1,2',
        }
        getRoleAuthorizeFunction(data).then((res) => {
          this.default_select = res.ResData
          setTimeout(this.restFrom(), 500)
        })

        let datas = {
          roleId: this.currentId,
          itemType: '0',
        }
        getRoleAuthorizeFunction(datas).then((res) => {
          this.defaultSystem_select = res.ResData
          setTimeout(this.restFrom(), 500)
        })
      }
    },
    handleClick: function () {
      // this.restFrom()
    },
    // 重置
    restFrom: function () {
      var that = this
      this.$nextTick(() => {
        this.$refs.treeFunction.setCheckedKeys(that.default_select)
        this.$refs.treeSystem.setCheckedKeys(that.defaultSystem_select)
        this.$refs.treeOrganize.setCheckedKeys(that.defaultOrganize_select)
      })
    },
    /**
     * 保存权限
     */
    saveRoleAuthorize: function () {
      var loadop = {
        lock: true,
        text: this.$t('SavingDataPleaseWaitPatiently'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      }
      this.pageLoading = Loading.service(loadop)
      // 目前被选中的菜单节点
      let checkedKeysTreeFunction = this.$refs.treeFunction.getCheckedKeys()
      // 半选中的菜单节点
      let halfCheckedKeysTreeFunction =
        this.$refs.treeFunction.getHalfCheckedKeys()
      checkedKeysTreeFunction.unshift.apply(
        checkedKeysTreeFunction,
        halfCheckedKeysTreeFunction
      )

      let checkedKeysTreeOrganize = this.$refs.treeOrganize.getCheckedKeys()
      let halfCheckedKeysTreeOrganize =
        this.$refs.treeOrganize.getHalfCheckedKeys()
      checkedKeysTreeOrganize.unshift.apply(
        checkedKeysTreeOrganize,
        halfCheckedKeysTreeOrganize
      )

      let checkedKeysTreeSystem = this.$refs.treeSystem.getCheckedKeys()
      let halfCheckedKeysTreeSystem = this.$refs.treeSystem.getHalfCheckedKeys()
      checkedKeysTreeSystem.unshift.apply(
        checkedKeysTreeSystem,
        halfCheckedKeysTreeSystem
      )

      var data = {
        RoleFunctios: checkedKeysTreeFunction,
        RoleData: checkedKeysTreeOrganize,
        RoleSystem: checkedKeysTreeSystem,
        RoleId: this.currentId,
      }
      saveRoleAuthorize(data).then((res) => {
        if (res.Success) {
          this.$message({
            message: this.$t('operateSuccessfully'),
            type: 'success',
          })
          this.currentSelected = ''
          // this.default_select = []
          // this.defaultOrganize_select = []
          // this.defaultSystem_select = []
          this.dialogSetAuthFormVisible = false
        } else {
          this.$message({
            message: res.ErrMsg,
            type: 'error',
          })
        }
        this.pageLoading.close()
      })
    },
  },
}
</script>

<style>
.el-cascader {
  width: 100%;
}

.box-card {
  max-height: 600px;
  overflow-y: scroll;
}
</style>
<style lang="scss" scoped>
.pagination-container {
  .el-pagination {
    text-align: left;
  }
}
</style>
