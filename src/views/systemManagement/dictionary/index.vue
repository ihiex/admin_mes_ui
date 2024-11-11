<template>
  <div class="page_container">
    <el-card>
      <el-row :gutter="24">
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <div class="grid-content bg-purple">
              <div class="list-btn-container">
                <el-form
                  ref="searchmenuform"
                  :inline="true"
                  :model="searchform"
                  class="demo-form-inline"
                  size="small"
                >
                  <el-form-item>
                    <el-button-group>
                      <el-button
                        type="default"
                        icon="el-icon-refresh"
                        size="small"
                        @click="loadTableData()"
                      >
                        {{ $t('refresh') }}
                      </el-button>
                      <el-button
                        v-hasPermi="['Items/Add']"
                        type="primary"
                        icon="el-icon-plus"
                        size="small"
                        @click="ShowItemsEditOrViewDialog()"
                      >
                        {{ $t('Added') }}
                      </el-button>
                      <el-button
                        v-hasPermi="['Items/Edit']"
                        type="primary"
                        icon="el-icon-edit"
                        class="el-button-modify"
                        size="small"
                        @click="ShowItemsEditOrViewDialog('edit')"
                      >
                        {{ $t('Modify') }}
                      </el-button>
                      <el-button
                        v-hasPermi="['Items/Enable']"
                        type="info"
                        icon="el-icon-video-pause"
                        size="small"
                        @click="setItemsEnable('0')"
                      >
                        {{ $t('disable') }}
                      </el-button>
                      <el-button
                        v-hasPermi="['Items/Enable']"
                        type="success"
                        icon="el-icon-video-play"
                        size="small"
                        @click="setItemsEnable('1')"
                      >
                        {{ $t('enable') }}
                      </el-button>
                      <el-button
                        v-hasPermi="['Items/Delete']"
                        type="danger"
                        icon="el-icon-delete"
                        size="small"
                        @click="deleteItemsPhysics()"
                      >
                        {{ $t('delete') }}
                      </el-button>
                    </el-button-group>
                  </el-form-item>
                </el-form>
              </div>
              <el-table
                :data="tableDataItemss"
                style="width: 100%; margin-bottom: 20px"
                row-key="Id"
                border
                size="mini"
                height="calc(100vh - 290px)"
                default-expand-all
                highlight-current-row
                :tree-props="{ children: 'Children' }"
                @row-click="handleClickItemsChange"
              >
                <el-table-column prop="FullName" :label="$t('name')" />
                <el-table-column
                  :label="$t('status')"
                  width="80"
                  prop="EnabledMark"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-tag
                      :type="
                        scope.row.EnabledMark === true ? 'success' : 'info'
                      "
                      disable-transitions
                    >
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
        <el-col :span="14">
          <div class="grid-content bg-purple">
            <div class="list-btn-container">
              <el-form
                ref="searchform"
                :inline="true"
                :model="searchform"
                class="demo-form-inline"
                size="small"
              >
                <el-form-item>
                  <el-button-group>
                    <el-button
                      type="default"
                      icon="el-icon-refresh"
                      size="small"
                      @click="loadItemsDetailTableData()"
                    >
                      {{ $t('refresh') }}
                    </el-button>
                    <el-button
                      v-hasPermi="['ItemsDetail/Add']"
                      type="primary"
                      icon="el-icon-plus"
                      size="small"
                      @click="ShowItemsDetailEditOrViewDialog()"
                    >
                      {{ $t('Added') }}
                    </el-button>
                    <el-button
                      v-hasPermi="['ItemsDetail/Edit']"
                      type="primary"
                      icon="el-icon-edit"
                      class="el-button-modify"
                      size="small"
                      @click="ShowItemsDetailEditOrViewDialog('edit')"
                    >
                      {{ $t('Modify') }}
                    </el-button>
                    <el-button
                      v-hasPermi="['ItemsDetail/Enable']"
                      type="info"
                      icon="el-icon-video-pause"
                      size="small"
                      @click="setItemsDetailEnable('0')"
                    >
                      {{ $t('disable') }}
                    </el-button>
                    <el-button
                      v-hasPermi="['ItemsDetail/Enable']"
                      type="success"
                      icon="el-icon-video-play"
                      size="small"
                      @click="setItemsDetailEnable('1')"
                    >
                      {{ $t('enable') }}
                    </el-button>
                    <el-button
                      v-hasPermi="['ItemsDetail/Delete']"
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                      @click="deleteItemsDetailPhysics()"
                    >
                      {{ $t('delete') }}
                    </el-button>
                  </el-button-group>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <el-table
            ref="gridtable"
            :data="tableData"
            style="width: 100%; margin-bottom: 20px"
            row-key="Id"
            border
            size="mini"
            height="calc(100vh - 290px)"
            default-expand-all
            highlight-current-row
            :tree-props="{ children: 'Children' }"
            @select="handleSelectChange"
            @select-all="handleSelectAllChange"
          >
            <el-table-column type="selection" width="40" />
            <el-table-column
              prop="ItemName"
              :label="$t('name')"
              sortable="custom"
            />
            <el-table-column
              prop="ItemCode"
              :label="$t('value')"
              sortable="custom"
            />
            <el-table-column
              prop="SortCode"
              :label="$t('sort')"
              sortable="custom"
              width="80"
              align="center"
            />
            <el-table-column
              :label="$t('status')"
              sortable="custom"
              width="100"
              prop="EnabledMark"
              align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.EnabledMark === true ? 'success' : 'info'"
                  disable-transitions
                >
                  {{
                    scope.row.EnabledMark === true
                      ? $t('enable')
                      : $t('disable')
                  }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      ref="dialogEditItemsForm"
      :title="editItemsFormTitle + ' ' + $t('dictionaries')"
      :visible.sync="dialogItemsEditFormVisible"
      width="30%"
    >
      <el-form ref="editItemsFrom" :model="editItemsFrom" :rules="rules">
        <el-form-item
          :label="$t('dictionaryName')"
          :label-width="formLabelWidth"
          prop="FullName"
        >
          <el-input
            v-model="editItemsFrom.FullName"
            :placeholder="$t('pleaseEnterDictionaryName')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('dictionaryCode')"
          :label-width="formLabelWidth"
          prop="EnCode"
        >
          <el-input
            v-model="editItemsFrom.EnCode"
            :placeholder="$t('pleaseEnterDictionaryCode')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('parentLevel')"
          :label-width="formLabelWidth"
          prop="ParentId"
        >
          <el-cascader
            v-model="selectedItemsOptions"
            :options="selectItemss"
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
            @change="handleItemsChange"
          />
        </el-form-item>
        <el-form-item
          :label="$t('sort')"
          :label-width="formLabelWidth"
          prop="SortCode"
        >
          <el-input
            v-model.number="editItemsFrom.SortCode"
            :placeholder="$t('pleaseEnterSort')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('attribute')"
          :label-width="formLabelWidth"
          prop=""
        >
          <el-checkbox v-model="editItemsFrom.EnabledMark">
            {{ $t('enable') }}
          </el-checkbox>
          <el-checkbox v-model="editItemsFrom.IsTree">
            {{ $t('isTree') }}
          </el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogItemsEditFormVisible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" @click="saveEditItemsForm()">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      ref="dialogEditItemsDetailForm"
      :title="editItemsDetailFormTitle +' '+ $t('function')"
      :visible.sync="dialogItemsDetailEditFormVisible"
      width="30%"
    >
      <el-form
        ref="editItemsDetailFrom"
        :model="editItemsDetailFrom"
        :rules="rulesfun"
      >
        <el-form-item
          :label="$t('name')"
          :label-width="formLabelWidth"
          prop="ItemName"
        >
          <el-input
            v-model="editItemsDetailFrom.ItemName"
            :placeholder="$t('pleaseEnterName')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('value')" :label-width="formLabelWidth" prop="ItemCode">
          <el-input
            v-model="editItemsDetailFrom.ItemCode"
            :placeholder="$t('pleaseEnterValue')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('classify')"
          :label-width="formLabelWidth"
          prop="ItemId"
        >
          <el-cascader
            v-model="selectedItemsOptions"
            :options="selectItemss"
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
            @change="handleAddItemsDetailChange"
          />
        </el-form-item>
        <el-form-item
          :label="$t('superiorFunction')"
          :label-width="formLabelWidth"
          prop="ParentId"
        >
          <el-cascader
            v-model="selectedItemsDetailOptions"
            :options="selectItemsDetails"
            filterable
            :props="{
              label: 'ItemName',
              value: 'Id',
              children: 'Children',
              emitPath: false,
              checkStrictly: true,
              expandTrigger: 'hover',
            }"
            clearable
            @change="handleAddItemsDetailItemsChange"
          />
        </el-form-item>
        <el-form-item
          :label="$t('sort')"
          :label-width="formLabelWidth"
          prop="SortCode"
        >
          <el-input
            v-model.number="editItemsDetailFrom.SortCode"
            :placeholder="$t('pleaseEnterSort')"
            autocomplete="off"
            clearable
          />
        </el-form-item>
        <el-form-item
          :label="$t('attribute')"
          :label-width="formLabelWidth"
          prop=""
        >
          <el-checkbox v-model="editItemsDetailFrom.EnabledMark">
            {{ $t('enable') }}
          </el-checkbox>
          <el-checkbox v-model="editItemsDetailFrom.IsDefault">
            {{ $t('defaultValue') }}
          </el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogItemsDetailEditFormVisible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button type="primary" @click="saveEditItemsDetailForm()">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllItemsTreeTable,
  getItemsDetail,
  saveItems,
  setItemsEnable,
  deleteSoftItems,
  deleteItems,
  getItemsDetailListWithPager,
  getItemsDetailDetail,
  saveItemsDetail,
  setItemsDetailEnable,
  deleteSoftItemsDetail,
  deleteItemsDetail,
  getAllItemsDetailTreeTable,
} from '@/api/security/itemsservice'

import { getListMeunFuntionBymeunCode } from '@/api/basebasic'
export default {
  name: 'Items',
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
      loadItemsBtnFunc: [],
      loadItemsDetailBtnFunc: [],
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
      selectItemsId: '',
      dialogItemsEditFormVisible: false,
      editItemsFormTitle: '',
      selectedItemsOptions: [],
      selectItemss: [],
      editItemsFrom: {},
      rules: {
        FullName: [
          {
            required: true,
            message: this.$t('pleaseEnterName'),
            trigger: 'blur',
          },
          {
            min: 1,
            max: 50,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
        EnCode: [
          {
            required: true,
            message: this.$t('pleaseEnterCode'),
            trigger: 'blur',
          },
          {
            min: 1,
            max: 50,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
      },
      formLabelWidth: '150px',
      currentItemsId: '',

      dialogItemsDetailEditFormVisible: false,
      editItemsDetailFormTitle: '',
      selectedItemsDetailOptions: [],
      selectItemsDetails: [],
      editItemsDetailFrom: {},
      rulesfun: {
        ItemName: [
          {
            required: true,
            message: this.$t('pleaseEnterName'),
            trigger: 'blur',
          },
          {
            min: 1,
            max: 50,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
        ItemCode: [
          {
            required: true,
            message: this.$t('pleaseEnterValue'),
            trigger: 'blur',
          },
          {
            min: 1,
            max: 50,
            message: this.$t('TheValueContains1to50characters'),
            trigger: 'blur',
          },
        ],
        ItemId: [
          {
            required: true,
            message: this.$t('pleaseSelectCategory'),
            trigger: 'blur',
          },
        ],
      },
      currentId: '', // 当前操作对象的ID值，主要用于修改
      currentSelected: [],
      tableDataItemss: [],
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
      getListMeunFuntionBymeunCode('ItemsDetail').then((res) => {
        this.loadItemsDetailBtnFunc = res.ResData
      })
    },
    /**
     * 加载页面左侧菜单table数据
     */
    loadTableData: function () {
      getAllItemsTreeTable().then((res) => {
        this.selectItemss = this.tableDataItemss = res.ResData
      })
    },
    /**
     * 点击查询菜单
     */
    handleSearch: function () {
      this.loadTableData()
    },
    /**
     * 点击查询
     */
    handleSearchItemsDetail: function () {
      this.pagination.currentPage = 1
      this.loadItemsDetailTableData()
    },

    loadItemsDetailTree() {
      var data = {
        itemId: this.selectItemsId,
      }
      getAllItemsDetailTreeTable(data).then((res) => {
        this.selectItemsDetails = res.ResData
      })
    },
    /**
     * 添加添加分类是选择父级分类
     */
    handleItemsChange: function () {
      if (this.currentItemsId === this.selectedItemsOptions) {
        this.$alert(this.$t('Youcannotchooseyourselfasparent'), this.$t('hint'))
        this.selectedItemsOptions = ''
        return
      }
      this.editItemsFrom.ParentId = this.selectedItemsOptions
    },
    /**
     * 添加分类值是选择分类
     */
    handleAddItemsDetailChange: function () {
      this.selectItemsId = this.selectedItemsOptions
      this.loadItemsDetailTree()
      this.editItemsDetailFrom.ItemId = this.selectedItemsOptions
    },
    /**
     * 添加分类值时选择父级
     */
    handleAddItemsDetailItemsChange: function () {
      if (this.currentId === this.selectedItemsDetailOptions) {
        this.$alert(this.$t('Youcannotchooseyourselfasparent'), this.$t('hint'))
        this.selectedItemsDetailOptions = ''
        return
      }
      this.editItemsDetailFrom.ParentId = this.selectedItemsDetailOptions
    },

    // 表单重置
    reset() {
      this.editItemsFrom = {
        FullName: '',
        EnCode: '',
        ParentId: '',
        IsTree: false,
        EnabledMark: true,
        SortCode: 99,
      }
      this.selectedItemsOptions = ''
      this.resetForm('editItemsFrom')
    },
    /**
     * 新增、修改或查看明细信息（绑定显示数据）*
     */
    ShowItemsEditOrViewDialog: function (view) {
      this.reset()
      if (view !== undefined) {
        if (this.currentItemsId === '') {
          this.$alert(
            this.$t('PleaseselectdatatoeditOrmodify'),
            this.$t('hint')
          )
        } else {
          this.editItemsFormTitle = this.$t('edit')
          this.dialogItemsEditFormVisible = true
          this.bindItemsEditInfo()
        }
      } else {
        this.editItemsFormTitle = this.$t('Added')
        this.currentItemsId = ''
        this.dialogItemsEditFormVisible = true
      }
    },
    bindItemsEditInfo: function () {
      getItemsDetail(this.currentItemsId).then((res) => {
        this.editItemsFrom = res.ResData
        this.selectedItemsOptions = res.ResData.ParentId
      })
    },
    /**
     * 新增/修改保存
     */
    saveEditItemsForm() {
      this.$refs['editItemsFrom'].validate((valid) => {
        if (valid) {
          let data = {
            FullName: this.editItemsFrom.FullName,
            EnCode: this.editItemsFrom.EnCode,
            ParentId: this.editItemsFrom.ParentId,
            IsTree: this.editItemsFrom.IsTree,
            EnabledMark: this.editItemsFrom.EnabledMark,
            SortCode: this.editItemsFrom.SortCode,
            Id: this.currentItemsId,
          }
          var url = 'Items/Insert'
          if (this.currentItemsId !== '') {
            url = 'Items/Update'
          }
          saveItems(data, url).then((res) => {
            if (res.Success) {
              this.$message({
                message: this.$t('operateSuccessfully'),
                type: 'success',
              })
              this.dialogItemsEditFormVisible = false
              this.currentItemsId = ''
              this.selectedItemsOptions = ''
              this.$refs['editItemsFrom'].resetFields()
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
    setItemsEnable: function (val) {
      if (this.currentItemsId === '') {
        this.$alert(this.$t('Selectthedatatooperateonfirst'), this.$t('hint'))
        return false
      } else {
        var currentIds = [this.currentItemsId]
        let data = {
          Ids: currentIds,
          Flag: val,
        }
        setItemsEnable(data).then((res) => {
          if (res.Success) {
            this.$message({
              message: this.$t('operateSuccessfully'),
              type: 'success',
            })
            this.currentItemsId = ''
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
    deleteItemsSoft: function (val) {
      if (this.currentItemsId === '') {
        this.$alert(this.$t('Selectthedatatooperateonfirst'), this.$t('hint'))
        return false
      } else {
        var currentIds = [this.currentItemsId]
        let data = {
          Ids: currentIds,
          Flag: val,
        }
        deleteSoftItems(data).then((res) => {
          if (res.Success) {
            this.$message({
              message: this.$t('operateSuccessfully'),
              type: 'success',
            })
            this.currentItemsId = ''
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
    deleteItemsPhysics: function () {
      if (this.currentItemsId === '') {
        this.$alert(this.$t('Selectthedatatooperateonfirst'), this.$t('hint'))
        return false
      } else {
        var currentIds = [this.currentItemsId]
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
            return deleteItems(data)
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

    // 表单重置
    resetDetails() {
      this.editItemsDetailFrom = {
        ItemName: '',
        ItemCode: '',
        ParentId: '',
        ItemId: '',
        IsDefault: false,
        EnabledMark: true,
        SortCode: 99,
      }
      this.selectedItemsOptions = ''
      this.resetForm('editItemsDetailFrom')
    },
    /**
     * 新增、修改或查看明细信息（绑定显示数据）*
     */
    ShowItemsDetailEditOrViewDialog: function (view) {
      this.resetDetails()
      if (view !== undefined) {
        if (this.currentSelected.length === 0) {
          this.$alert(
            this.$t('PleaseselectdatatoeditOrmodify'),
            this.$t('hint')
          )
        } else {
          this.editItemsDetailFormTitle = this.$t('edit')
          this.dialogItemsDetailEditFormVisible = true
          this.currentId = this.currentSelected[0].Id
          this.bindItemsDetailEditInfo()
        }
      } else {
        this.editItemsDetailFormTitle = this.$t('Added')
        this.currentId = ''
        this.dialogItemsDetailEditFormVisible = true
      }
    },
    bindItemsDetailEditInfo: function () {
      getItemsDetailDetail(this.currentId).then((res) => {
        this.editItemsDetailFrom = res.ResData
        this.editItemsDetailFrom.ItemId = res.ResData.ItemId
        this.selectedItemsOptions = res.ResData.ItemId
        this.selectItemsId = res.ResData.ItemId
        this.loadItemsDetailTree()
      })
    },
    /**
     * 新增/修改保存
     */
    saveEditItemsDetailForm() {
      this.$refs['editItemsDetailFrom'].validate((valid) => {
        if (valid) {
          let data = {
            ItemName: this.editItemsDetailFrom.ItemName,
            ItemCode: this.editItemsDetailFrom.ItemCode,
            ItemId: this.editItemsDetailFrom.ItemId,
            ParentId: this.editItemsDetailFrom.ParentId,
            IsDefault: this.editItemsDetailFrom.IsDefault,
            EnabledMark: this.editItemsDetailFrom.EnabledMark,
            SortCode: this.editItemsDetailFrom.SortCode,
            Id: this.currentId,
          }

          var url = 'ItemsDetail/Insert'
          if (this.currentId !== '') {
            url = 'ItemsDetail/Update'
          }
          saveItemsDetail(data, url).then((res) => {
            if (res.Success) {
              this.$message({
                message: this.$t('operateSuccessfully'),
                type: 'success',
              })
              this.dialogItemsDetailEditFormVisible = false
              this.currentSelected = ''
              this.selectedItemsOptions = ''
              this.loadItemsDetailTableData()
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
    setItemsDetailEnable: function (val) {
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
        setItemsDetailEnable(data).then((res) => {
          if (res.Success) {
            this.$message({
              message: this.$t('operateSuccessfully'),
              type: 'success',
            })
            this.currentSelected = ''
            this.loadItemsDetailTableData()
          } else {
            this.$message({
              message: res.ErrMsg,
              type: 'error',
            })
          }
        })
      }
    },
    deleteItemsDetailSoft: function (val) {
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
        deleteSoftItemsDetail(data).then((res) => {
          if (res.Success) {
            this.$message({
              message: this.$t('operateSuccessfully'),
              type: 'success',
            })
            this.currentSelected = ''
            this.loadItemsDetailTableData()
          } else {
            this.$message({
              message: res.ErrMsg,
              type: 'error',
            })
          }
        })
      }
    },
    deleteItemsDetailPhysics: function () {
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
            return deleteItemsDetail(data)
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
      this.loadItemsDetailTableData()
    },
    //
    handleClickItemsChange: function (row, column, event) {
      this.searchform.code = row.EnCode
      this.currentItemsId = row.Id
      this.loadItemsDetailTableData()
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
     * 加载数据字典值列表数据
     */
    loadItemsDetailTableData: function () {
      this.tableloading = true
      var seachdata = {
        itemId: this.currentItemsId,
      }
      getItemsDetailListWithPager(seachdata).then((res) => {
        this.tableData = res.ResData
        this.tableloading = false
      })
    },
  },
}
</script>
<style>
.el-cascader {
  width: 100%;
}
</style>
