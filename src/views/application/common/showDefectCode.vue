<template>
  <div class="defect_code_page">
    <el-dialog :title="$t('defectMsg')" :visible.sync="dialogVisible" width="750px" :show-close="true"
      :close-on-click-modal="false" :destroy-on-close="true">
      <div class="dialog_right_container">
        <el-input ref="SearchValueRef" v-model.trim="searchValue" clearable :placeholder="$t('pleaseEnterQueryContents')"
          suffix-icon="el-icon-search" style="margin: 10px; width: 50%" @input="handleSearch(searchValue)"
          @keydown.native.enter="handleEnter(searchValue)" @clear="handleInputClear"></el-input>
        <el-button style="margin-left: 15px" @click="handleSearch(searchValue)">
          {{ $t('query') }}
        </el-button>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" size="mini"
          height="505">
          <el-table-column prop="DefectCode" :label="$t('defectCode')" width="100"></el-table-column>
          <el-table-column prop="DefectName" :label="$t('defectName')" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Location" :label="$t('location')" show-overflow-tooltip width="120"></el-table-column>
          <el-table-column width="90" align="center" :label="$t('operation')">
            <template slot-scope="scope">
              <i class="move_btn el-icon-plus" @click="handleMoveData(scope.row)"></i>
              <!-- <el-button type="info" plain size="mini" icon="el-icon-plus" @click="handleMoveData(scope.row)"></el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div style="height: 40px">
          <el-pagination :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes"
            :page-size="pagination.pageSize" layout="prev, pager, next" :total="pagination.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </div>
      </div>
      <div class="left_container">
        <div class="left_title">{{ $t('checked') }}</div>
        <div class="select_container">
          <el-tag v-for="tag in selectTableData" :key="tag.ID" closable type="success" size="medium"
            @close="handleRemove(tag.ID)">
            {{ tag.DefectCode }}
          </el-tag>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button size="medium" type="primary" @click="handleConform">
          {{ $t('confirm') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ShowDefectCode',
  props: {
    value: {
      type: String,
      default: () => { return '' }
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      cacheTableData: [],
      searchCacheTableData: [],
      multipleSelection: {},
      searchValue: '',
      pagination: {
        total: 0,
        pageSize: 20,
        pageSizes: [20, 30, 40, 50, 100, 200, 300],
        currentPage: 1,
      },
      selectTableData: [],
      isSearch: false,
    }
  },
  watch: {
    // value: function(val,oval){
    //   console.log(val)
    // }
  },
  methods: {
    handleEnter(val) {
      if (!val) return;
      for (let i = 0; i < this.tableData.length; i++) {
        if (val === this.tableData[i].DefectCode) {
          this.handleMoveData(this.tableData[i])
          this.handleConform()
          break;
        }
      }
    },
    handleInputClear() {
      this.isSearch = false
      this.$set(this.pagination, 'currentPage', 1)
      this.$set(this.pagination, 'total', this.cacheTableData.length)
      this.handlePaginationData()
    },
    handleSearch(val) {
      //只要是查询都回到第一页
      this.$set(this.pagination, 'currentPage', 1)
      if (!val) {
        this.handleInputClear()
        return
      }
      this.isSearch = true
      this.searchCacheTableData = this.cacheTableData.filter((res) => {
        if (
          res.DefectCode.includes(val) ||
          res.DefectName.includes(val) ||
          res.Location.includes(val)
        ) {
          return res
        } else {
          return
        }
      })
      this.$set(this.pagination, 'total', this.searchCacheTableData.length)
      this.handlePaginationData()

      //   this.tableData = data.splice(0, 100)
      //   console.log(this.tableData)
    },
    //从表格移动到已选中
    handleMoveData(val) {
      let tIndex = this.tableData.findIndex((res) => res.ID === val.ID)
      if (tIndex >= 0) {
        this.setSelectData(this.tableData.splice(tIndex, 1)[0])
      }
      let cIndex = this.cacheTableData.findIndex((res) => res.ID === val.ID)
      if (cIndex >= 0) {
        this.cacheTableData.splice(cIndex, 1)
      }

      if (this.isSearch) {
        let cIndex = this.searchCacheTableData.findIndex(
          (res) => res.ID === val.ID
        )
        if (cIndex >= 0) {
          this.searchCacheTableData.splice(cIndex, 1)
        }
      }
    },
    //从已选中移动到表格
    handleRemove(id) {
      let index = this.selectTableData.findIndex((res) => res.ID === id)
      if (index >= 0) {
        //移除已选中
        let obj = this.selectTableData.splice(index, 1)[0]
        //还原到原缓存中
        this.cacheTableData.splice(obj.index, 0, obj)
        if (this.isSearch) {
          //还原到查询结果中
          this.searchCacheTableData.splice(obj.index, 0, obj)
          //根据查询关键字匹配是否在当前页
          if (
            obj.DefectCode.includes(this.searchValue) ||
            obj.DefectName.includes(this.searchValue) ||
            obj.Location.includes(this.searchValue)
          ) {
            this.tableData.unshift(obj)
          }
        } else {
          this.tableData.unshift(obj)
        }
      }
    },
    setSelectData(val) {
      let obj = this.selectTableData.find((res) => res.ID === val.ID)
      if (!obj) {
        this.selectTableData.push(val)
      }
    },
    show(data) {
      this.$set(this.pagination, 'total', data ? data.length : 0)
      this.$set(this.pagination, 'currentPage', 1)
      this.cacheTableData = [...data] //缓存数据
      this.selectTableData = [] //已选中数据
      this.searchCacheTableData = [] //查询缓存数据
      this.isSearch = false
      this.handlePaginationData()
      this.dialogVisible = true
      let that = this;
      setTimeout(function () {
        that.$refs.SearchValueRef.focus()
      }, 200)
    },
    handleConform() {
      if (this.selectTableData.length == 0) {
        this.$message({
          message: this.$t('confirmNGSetNG'),
          type: 'warning',
        })

        return
      }
      let ids = new Set()
      let labels = new Set()

      this.selectTableData.forEach((el) => {
        ids.add(el.ID)
        labels.add(el.DefectCode)
      })
      this.$emit('confirm', {
        ids: Array.from(ids).join(','),
        labels: Array.from(labels).join(','),
      })
      this.searchValue = ""
      this.dialogVisible = false
    },

    handleSizeChange(val) {
      this.$set(this.pagination, 'pageSize', val)
      this.$set(this.pagination, 'currentPage', 1)
      this.handlePaginationData()
    },
    handleCurrentChange(val) {
      this.$set(this.pagination, 'currentPage', val)
      this.handlePaginationData()
    },
    handlePaginationData() {
      if (this.isSearch) {
        this.tableData = this.searchCacheTableData.slice(
          this.pagination.pageSize * (this.pagination.currentPage - 1),
          this.pagination.pageSize * (this.pagination.currentPage - 1) +
          this.pagination.pageSize
        )
      } else {
        this.tableData = this.cacheTableData.slice(
          this.pagination.pageSize * (this.pagination.currentPage - 1),
          this.pagination.pageSize * (this.pagination.currentPage - 1) +
          this.pagination.pageSize
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.defect_code_page {
  .dialog_right_container {
    display: inline-block;
    width: 70%;
    height: inherit;
    padding: 0;
    margin: 0;
    padding: 0 10px;
    box-sizing: border-box;
    vertical-align: bottom;

    .move_btn {
      cursor: pointer;
      color: #222;
      //   border: 1px solid #ccc;
      padding: 2px 4px;
    }
  }

  .left_container {
    display: inline-block;
    width: 29%;
    border-left: 1px solid #ccc;
    height: inherit;
    vertical-align: bottom;

    .left_title {
      height: 52px;
      width: 100%;
      line-height: 52px;
      text-align: center;
      font-weight: 700;
      font-size: 16px;
    }

    .select_container {
      overflow: auto;
      height: 560px;

      .el-tag {
        margin: 10px;
        font-size: 24px;
        height: 40px;
        line-height: 40px;
        min-width: 60px;
      }
    }
  }
}
</style>
<style lang="scss">
.defect_code_page {
  .el-dialog__body {
    padding: 0 20px;
  }
}

.select_container {
  .el-icon-close:before {
    font-size: 20px;
  }
}
</style>
