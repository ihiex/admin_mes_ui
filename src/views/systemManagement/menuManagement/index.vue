<template>
  <div class="app-container">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="grid-content bg-purple">
            <div class="grid-content bg-purple">
              <div class="list-btn-container">
                <el-form ref="searchmenuform" :inline="true" :model="searchform" class="demo-form-inline" size="small">
                  <el-form-item>
                    <el-button-group>
                      <el-button type="default" icon="el-icon-refresh" size="mini" @click="loadTableData()">
                        {{ $t('refresh') }}
                      </el-button>
                      <el-button v-hasPermi="['Menu/Add']" type="primary" icon="el-icon-plus" size="mini"
                        @click="ShowMenuEditOrViewDialog()">
                        {{ $t('Added') }}
                      </el-button>
                      <el-button v-hasPermi="['Menu/Edit']" type="primary" icon="el-icon-edit" class="el-button-modify"
                        size="mini" @click="ShowMenuEditOrViewDialog('edit')">
                        {{ $t('Modify') }}
                      </el-button>
                      <el-button v-hasPermi="['Menu/Enable']" type="info" icon="el-icon-video-pause" size="mini"
                        @click="setMenuEnable('0')">
                        {{ $t('disable') }}
                      </el-button>
                      <el-button v-hasPermi="['Menu/Enable']" type="success" icon="el-icon-video-play" size="mini"
                        @click="setMenuEnable('1')">
                        {{ $t('enable') }}
                      </el-button>
                      <el-button v-hasPermi="['Menu/Delete']" type="danger" icon="el-icon-delete" size="mini"
                        @click="deleteMenuPhysics()">
                        {{ $t('delete') }}
                      </el-button>
                    </el-button-group>
                  </el-form-item>
                  <el-form-item :label="$t('systemName')">
                    <el-select v-model="searchmenuform.systemTypeId" style="width: 150px" clearable
                      :placeholder="$t('pleaseSelect')">
                      <el-option v-for="item in selectSystemType" :key="item.Id" :label="item.FullName"
                        :value="item.Id" />
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="mini" @click="handleSearch()">
                      {{ $t('query') }}
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
              <el-table v-loading="loading" :data="tableDataMenus" style="width: 100%;" row-key="Id" border size="mini"
                max-height="850" default-expand-all highlight-current-row :tree-props="{ children: 'Children' }"
                height="calc(100vh - 270px)" @row-click="handleClickMenuChange">
                <el-table-column prop="FullName" :label="$t('menuOrModuleName')" min-width="220">
                  <template slot-scope="scope">
                    <!--   <svg-icon
                      v-if="scope.row.Icon"
                      :icon-class="scope.row.Icon"
                    /> -->
                    {{ scope.row.FullName }}
                  </template>
                </el-table-column>
                <el-table-column prop="EnCode" :label="$t('functionCode')" min-width="200" />
                <el-table-column prop="UrlAddress" :label="$t('routerAddress')" min-width="280" />
                <el-table-column prop="Component" :label="$t('componentAddress')" width="180" />
                <el-table-column :label="$t('type')" width="100" prop="MenuType" align="center">
                  <template slot-scope="scope">
                    <slot v-if="scope.row.MenuType === 'C'" disable-transitions>
                      {{ $t('moduleCatalogue') }}
                    </slot>
                    <slot v-if="scope.row.MenuType === 'M'" disable-transitions>
                      {{ $t('menu') }}
                    </slot>
                    <slot v-if="scope.row.MenuType === 'F'" disable-transitions>
                      {{ $t('functionOrButton') }}
                    </slot>
                  </template>
                </el-table-column>
                <el-table-column prop="SortCode" :label="$t('sort')" width="80" />
                <el-table-column :label="$t('display')" width="80" prop="IsShow" align="center">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.IsShow === true ? 'success' : 'info'" disable-transitions>
                      {{
                        scope.row.IsShow === true ? $t('display') : $t('hide')
                      }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('status')" width="80" prop="EnabledMark" align="center">
                  <template slot-scope="scope">
                    <el-tag :type="scope.row.EnabledMark === true ? 'success' : 'info'
                      " disable-transitions>
                      {{
                        scope.row.EnabledMark === true
                        ? $t('enable')
                        : $t('disable')
                      }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog ref="dialogEditMenuForm" v-el-drag-dialog :title="editMenuFormTitle + ' ' + $t('moduleOrMenu')"
      append-to-body :visible.sync="dialogMenuEditFormVisible" :close-on-click-modal="false" width="900px">
      <el-form ref="editMenuFrom" :model="editMenuFrom" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('SubordinateToTheSystem')" :label-width="formLabelWidth" prop="SystemTypeId">
              <el-select v-model="selectSystemTypeId" clearable :placeholder="$t('pleaseSelect')"
                @change="handleSystemTypeChange">
                <el-option v-for="item in selectSystemType" :key="item.Id" :label="item.FullName" :value="item.Id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('parentModule')" :label-width="formLabelWidth" prop="ParentId">
              <el-cascader :key="cascaderKey" v-model="selectedMenuOptions" :options="selectMenus" filterable :props="{
                label: 'FullName',
                value: 'Id',
                children: 'Children',
                emitPath: false,
                checkStrictly: true,
                expandTrigger: 'click',
              }" clearable @change="handleMenuChange" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('BelongsToType')" :label-width="formLabelWidth" prop="MenuType">
              <el-radio-group v-model="editMenuFrom.MenuType" @change="menuTypeChange">
                <el-radio label="C">{{ $t('moduleCatalogue') }}</el-radio>
                <el-radio label="M">{{ $t('menu') }}</el-radio>
                <el-radio label="F">{{ $t('functionOrButton') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="formShowTitle + $t('name')" :label-width="formLabelWidth" prop="FullName">
              <el-input v-model.trim="editMenuFrom.FullName" :placeholder="$t('pleaseInput') + formShowTitle + $t('name')"
                autocomplete="off" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="formShowTitle + $t('code')" :label-width="formLabelWidth" prop="EnCode">
              <el-input v-model.trim="editMenuFrom.EnCode" :placeholder="$t('pleaseInput') + formShowTitle + $t('code')"
                autocomplete="off" clearable />
            </el-form-item>
          </el-col>

          <el-col v-if="editMenuFrom.MenuType != 'F'" :span="12">
            <el-form-item :label="$t('WhetherTheLinkOut')" :label-width="formLabelWidth" prop="IsFrame">
              <el-radio-group v-model.trim="editMenuFrom.IsFrame">
                <el-radio v-for="item in options" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col v-if="editMenuFrom.MenuType != 'F'" :span="12">
            <el-form-item :label="$t('routerAddress')" :label-width="formLabelWidth" prop="UrlAddress">
              <el-input v-model.trim="editMenuFrom.UrlAddress" :placeholder="$t('pleaseEnterRouterAddress')"
                autocomplete="off" clearable />
            </el-form-item>
          </el-col>

          <el-col v-if="editMenuFrom.MenuType == 'M'" :span="12">
            <el-form-item :label="$t('componentPath')" :label-width="formLabelWidth" prop="Component">
              <el-input v-model.trim="editMenuFrom.Component" :placeholder="$t('pleaseEnterComponentPath')"
                autocomplete="off" clearable />
            </el-form-item>
          </el-col>

          <el-col v-if="editMenuFrom.MenuType == 'M' && !editMenuFrom.IsShow" :span="12">
            <el-form-item :label="$t('SelectTheMenu')" :label-width="formLabelWidth" prop="ActiveMenu">
              <el-input v-model.trim="editMenuFrom.ActiveMenu" :placeholder="$t('pleaseEnterSelectTheMenuAddress')"
                autocomplete="off" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item :label="图标" :label-width="formLabelWidth" prop="Icon">
              <el-popover
                placement="bottom-start"
                width="660"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="editMenuFrom.Icon" :placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="editMenuFrom.Icon"
                    slot="prefix"
                    :icon-class="editMenuFrom.Icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item :label="$t('isPublic')" :label-width="formLabelWidth" prop="IsPublic">
              <el-radio-group v-model="editMenuFrom.IsPublic">
                <el-radio v-for="item in options" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('sort')" :label-width="formLabelWidth" prop="SortCode">
              <el-input v-model.number="editMenuFrom.SortCode" :placeholder="$t('pleaseEnterSort')" autocomplete="off"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('isShow')" :label-width="formLabelWidth" prop="IsShow">
              <el-radio-group v-model="editMenuFrom.IsShow">
                <el-radio :label="true">{{ $t('display') }}</el-radio>
                <el-radio :label="false">{{ $t('hide') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('status')" :label-width="formLabelWidth" prop="EnabledMark">
              <el-radio-group v-model="editMenuFrom.EnabledMark">
                <el-radio :label="true">{{ $t('usable') }}</el-radio>
                <el-radio :label="false">{{ $t('blockUp') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="editMenuFrom.MenuType == 'F'" :span="12">
            <el-form-item :label="$t('isCatch')" :label-width="formLabelWidth" prop="IsCache">
              <el-radio-group v-model="editMenuFrom.IsCache">
                <el-radio v-for="item in options" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col v-if="editMenuFrom.MenuType == 'F' && currentMenuId === ''" :span="12">
            <el-form-item :label="$t('ABatchOfNew')" :label-width="formLabelWidth" prop="IsBatch">
              <el-radio-group v-model="editMenuFrom.IsBatch">
                <el-radio v-for="item in options" :key="item.value" :label="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
              <el-link disabled>{{ $t('BatchAddMenuUnderTheFunctionButton') }}</el-link>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="saveEditMenuForm()">{{ $t('confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSubSystemList } from '@/api/basebasic'
import {
  getAllMenuTreeTable,
  getMenuDetail,
  saveMenu,
  setMenuEnable,
  deleteSoftMenu,
  deleteMenu,
} from '@/api/developers/menufunction'

// import IconSelect from '@/components/IconSelect'
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'Menu',
  directives: { elDragDialog },
  // components: { IconSelect },
  data() {
    return {
      searchform: {
        keywords: '',
        code: '',
      },
      searchmenuform: {
        systemTypeId: '',
      },
      selectSystemType: [],
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
      selectSystemTypeId: '',
      dialogMenuEditFormVisible: false,
      editMenuFormTitle: '',
      selectedMenuOptions: [],
      selectMenus: [],
      // 表单参数
      editMenuFrom: {},
      options: [
        {
          value: true,
          label: this.$t('yes'),
        },
        {
          value: false,
          label: this.$t('no'),
        },
      ],
      rules: {
        FullName: [
          { required: true, message: this.$t('pleaseEnterModuleName'), trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
        EnCode: [
          { required: true, message: this.$t('pleaseEnterModuleCode'), trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
        SystemTypeId: [
          { required: true, message: this.$t('SelectTheOwningSystem'), trigger: 'blur' },
        ],
        UrlAddress: [
          { required: true, message: this.$t('pleaseEnterRouter'), trigger: 'blur' },
        ],
      },
      formLabelWidth: '190px',
      currentMenuId: '',
      formShowTitle: this.$t('module'),
      currentId: '', // 当前操作对象的ID值，主要用于修改
      currentSelected: [],
      tableDataMenus: [],
      cascaderKey: 0,
      loading: false
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
    InitDictItem() {
      getSubSystemList().then((res) => {
        this.selectSystemType = res.ResData
      })
    },
    menuTypeChange: function () {
      var mty = this.editMenuFrom.MenuType
      if (mty === 'M') {
        this.formShowTitle = this.$t('menu')
      } else if (mty === 'F') {
        this.formShowTitle = this.$t('function')
        this.editMenuFrom.Component = ''
      } else if (mty === 'C') {
        this.formShowTitle = this.$t('module')
        this.editMenuFrom.Component = ''
      }
    },

    // 选择图标
    selected(name) {
      this.editMenuFrom.Icon = name
    },
    // 取消按钮
    cancel() {
      this.dialogMenuEditFormVisible = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.editMenuFrom = {
        FullName: '',
        EnCode: '',
        ParentId: '',
        SystemTypeId: '',
        Icon: undefined,
        UrlAddress: '',
        Component: '',
        ActiveMenu: '',
        EnabledMark: true,
        MenuType: 'C',
        IsPublic: false,
        IsShow: true,
        IsFrame: false,
        SortCode: 99,
        IsBatch: false,
        IsCache: false,
      }
      this.selectedMenuOptions = []
      this.selectSystemTypeId = ''
      this.resetForm('editMenuFrom')
    },
    /**
     * 加载页面左侧菜单table数据
     */
    loadTableData: function () {
      var data = {
        systemTypeId: this.searchmenuform.systemTypeId,
      }
      this.loading = true;
      getAllMenuTreeTable(data).then((res) => {
        this.loading = false
        this.tableDataMenus = res.ResData
      })
    },
    /**
     * 点击查询菜单
     */
    handleSearch: function () {
      this.loadTableData()
    },
    //
    handleClickMenuChange: function (row, column, event) {
      this.searchform.code = row.EnCode
      this.currentMenuId = row.Id
    },

    /**
     * 菜单选择子系统
     */
    handleSystemTypeChange: function () {
      ++this.cascaderKey
      var data = {
        systemTypeId: this.selectSystemTypeId,
      }
      getAllMenuTreeTable(data).then((res) => {
        this.selectMenus = res.ResData
      })
      this.editMenuFrom.SystemTypeId = this.selectSystemTypeId
    },
    /**
     * 添加模块式选择菜单
     */
    handleMenuChange: function () {
      if (this.currentMenuId === this.selectedMenuOptions) {
        this.$alert(this.$t('Youcannotchooseyourselfasparent'), this.$t('hint'))
        this.selectedMenuOptions = ''
        return
      }
      this.editMenuFrom.ParentId = this.selectedMenuOptions
    },
    /**
     * 新增、修改或查看明细信息（绑定显示数据）*
     */
    ShowMenuEditOrViewDialog: function (view) {
      this.reset()
      if (view !== undefined) {
        if (this.currentMenuId === '') {
          this.$alert(this.$t('PleaseselectdatatoeditOrmodify'), this.$t('hint'))
        } else {
          this.editMenuFormTitle = this.$t('edit')
          this.dialogMenuEditFormVisible = true
          this.bindMenuEditInfo()
        }
      } else {
        this.editMenuFormTitle = this.$t('Added')
        this.currentMenuId = ''
        this.dialogMenuEditFormVisible = true
      }
    },
    bindMenuEditInfo: function () {
      getMenuDetail(this.currentMenuId).then((res) => {
        this.editMenuFrom = res.ResData
        this.selectSystemTypeId = res.ResData.SystemTypeId
        this.selectedMenuOptions = res.ResData.ParentId
        this.handleSystemTypeChange()
        this.editMenuFrom.IsBatch = false
      })
    },
    /**
     * 新增/修改保存
     */
    saveEditMenuForm() {
      this.$refs['editMenuFrom'].validate((valid) => {
        if (valid) {
          let data = {
            FullName: this.editMenuFrom.FullName,
            EnCode: this.editMenuFrom.EnCode,
            SystemTypeId: this.selectSystemTypeId,
            ParentId: this.editMenuFrom.ParentId,
            Icon: this.editMenuFrom.Icon,
            UrlAddress: this.editMenuFrom.UrlAddress,
            EnabledMark: this.editMenuFrom.EnabledMark,
            ActiveMenu: this.editMenuFrom.ActiveMenu,
            MenuType: this.editMenuFrom.MenuType,
            Component: this.editMenuFrom.Component,
            SortCode: this.editMenuFrom.SortCode,
            IsPublic: this.editMenuFrom.IsPublic,
            IsShow: this.editMenuFrom.IsShow,
            IsFrame: this.editMenuFrom.IsFrame,
            IsBatch: this.editMenuFrom.IsBatch,
            IsCache: this.editMenuFrom.IsCache,
            Id: this.currentMenuId,
          }
          var url = 'Menu/Insert'
          if (this.currentMenuId !== '') {
            url = 'Menu/Update'
          }
          saveMenu(data, url).then((res) => {
            if (res.Success) {
              this.$message({
                message: this.$t('operateSuccessfully'),
                type: 'success',
              })
              this.dialogMenuEditFormVisible = false
              this.currentMenuId = ''
              this.selectedMenuOptions = []
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
    setMenuEnable: function (val) {
      if (this.currentMenuId === '') {
        this.$alert(this.$t('Selectthedatatooperateonfirst'), this.$t('hint'))
        return false
      } else {
        var currentIds = [this.currentMenuId]
        let data = {
          Ids: currentIds,
          Flag: val,
        }
        setMenuEnable(data).then((res) => {
          if (res.Success) {
            this.$message({
              message: this.$t('operateSuccessfully'),
              type: 'success',
            })
            this.currentMenuId = ''
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
    deleteMenuSoft: function (val) {
      if (this.currentMenuId === '') {
        this.$alert(this.$t('Selectthedatatooperateonfirst'), this.$t('hint'))
        return false
      } else {
        var currentIds = [this.currentMenuId]
        let data = {
          Ids: currentIds,
          Flag: val,
        }
        deleteSoftMenu(data).then((res) => {
          if (res.Success) {
            this.$message({
              message: this.$t('operateSuccessfully'),
              type: 'success',
            })
            this.currentMenuId = ''
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
    deleteMenuPhysics: function () {
      if (this.currentMenuId === '') {
        this.$alert(this.$t('Selectthedatatooperateonfirst'), this.$t('hint'))
        return false
      } else {
        var currentIds = [this.currentMenuId]
        this.$confirm(this.$t('Confirmdeletionoftheselecteddataitem'), this.$t('warn'), {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning',
        })
          .then(function () {
            let data = {
              Ids: currentIds,
            }
            return deleteMenu(data)
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
  },
}
</script>
<style lang="scss" scoped>
.el-cascader {
  width: 100%;
}
</style>
