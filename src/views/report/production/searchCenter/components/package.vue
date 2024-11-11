<template>
  <div v-loading="loading" class="page_container">
    <el-container style="height: 40%">
      <el-aside width="50%">
        <el-scrollbar class="side-bar-container">
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="treeData"
            :props="defaultProps"
            default-expand-all
            node-key="SN"
            icon-class="el-icon-arrow-right"
            :highlight-current="true"
            :expand-on-click-node="false"
            @current-change="getClickNode"
          >
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <!-- <div class="table_title">Package Detail Information</div> -->
        <el-table
          v-loading="load"
          :data="LeftTableData"
          style="width: 100%"
          class="left_table"
          size="small"
          :show-header="false"
          cell-class-name="cell_class_name"
          height="100%"
        >
          <el-table-column prop="Type" label="Type" width="200">
            <template slot-scope="scope">
              <div class="attr_title">{{ scope.row.Type }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="Num"
            label="Num"
            min-width="150"
          ></el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-footer style="height: 60%; border-top: 1px solid #efefef">
      <el-tabs v-model="activeName">
        <el-tab-pane label="History" name="History">
          <div class="footer_table_container">
            <el-table
              v-loading="load"
              :data="FooterTableData"
              style="width: 100%"
              size="mini"
              stripe
              :fit="true"
              height="100%"
              border
            >
              <el-table-column
                v-for="item in FooterTableHead"
                :key="item"
                :prop="item"
                :label="item"
                sortable
                :min-width="item == 'ID' ? '90' : '200'"
                :show-overflow-tooltip="true"
              ></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-footer>
  </div>
</template>

<script>
import { GetSearchCenter } from '@/api/report.js'
export default {
  name: 'Package',
  props: {
    loading: {
      type: Boolean,
      default: () => {
        return false
      },
    },
  },
  data() {
    return {
      title: 'Package',
      activeName: 'History',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'SN',
      },
      params: {},
      load: false,
      LeftTableData: [],
      FooterTableData: [],
      FooterTableHead: [],
    }
  },
  methods: {
    getTableData() {
      return [this.LeftTableData, this.FooterTableData]
    },
    getClickNode(obj) {
      this.$set(this.params, 'S_SNs', obj ? obj.SN : '')
      this.LeftTableData = []
      this.FooterTableHead = []
      this.FooterTableData = []
      this.load = true
      GetSearchCenter(this.params)
        .then((res) => {
          if (res.Success && res.ResData) {
            this.LeftTableData = res.ResData[0] ? res.ResData[0] : []
            if (res.ResData[1]) {
              this.FooterTableHead = res.ResData[1][0]
                ? Object.keys(res.ResData[1][0])
                : []
              this.$nextTick(function () {
                this.FooterTableData = res.ResData[1]
              })
            }
          }
          this.load = false
        })
        .catch((error) => {
          this.load = false
        })
    },
    formatTreeData(list) {
      if (!Array.isArray(list) && list.length === 0) return []
      let treeData = []

      list.sort(function (a, b) {
        return b.UnitID - a.UnitID
      })
      //获取顶级节点
      for (let i = 0; i < list.length; i++) {
        if (list[i].UnitID === null) {
          treeData.push(list.splice(i, 1)[0])
          i--
        }
      }

      function findTreeChild(data) {
        data.forEach((res) => {
          for (let i = 0; i < list.length; i++) {
            if (res.ChildUnitID === list[i].UnitID) {
              if (res.children) {
                res.children.push(list.splice(i, 1)[0])
                i--
              } else {
                res.children = [list.splice(i, 1)[0]]
                i--
              }
            }
          }
          if (res.children) {
            findTreeChild(res.children)
          }
        })
      }

      findTreeChild(treeData)
      ;(function fun() {
        if (list.length == 0) {
          return
        }
        findTreeChild(treeData)
      })()

      return treeData
    },
    show(data, params) {
      this.LeftTableData = []
      this.FooterTableHead = []
      this.treeData = []
      this.params = JSON.parse(JSON.stringify(params))
      this.$set(this.params, 'S_Type', 'PackageDetail')

      this.treeData = this.formatTreeData(
        JSON.parse(JSON.stringify(data[0] ? data[0] : []))
      )

      this.treeData && this.getClickNode(this.treeData[0])
      this.$nextTick(function () {
        let currentNodeKey = this.treeData[0] ? this.treeData[0].SN : ''
        if (currentNodeKey) {
          this.$refs.tree.setCurrentKey(currentNodeKey)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page_container {
  overflow: auto;
  ::v-deep .el-table {
    &::before {
      background-color: transparent;
    }
  }
  ::v-deep .cell_class_name {
    border: none;
  }
  .el-container {
    .el-main {
      padding: 10px;
      .left_table {
        &:hover {
          transform: translateY(-4px);
          border-color: transparent;
          box-shadow: 0 6px 16px rgb(200 200 200 / 94%);
        }
      }
    }
  }
  .el-footer {
    padding: 0;
    box-sizing: border-box;
    .el-tabs {
      height: 100%;
      ::v-deep .el-tabs__content {
        height: calc(100% - 60px);
        .el-tab-pane {
          height: 100%;
          .footer_table_container {
            height: calc(100% - 0px);
          }
        }
      }
    }
  }
}
</style>