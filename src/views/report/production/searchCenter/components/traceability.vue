<template>
  <div v-loading="loading" class="page_container">
    <el-container>
      <!-- v-rightDrag="WHInfo" -->
      <el-aside
        id="TraceabilityAside"
        width="30%"
        style="border-right: 1px solid #efefef"
      >
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
            :filter-node-method="filterNode"
            @current-change="getClickNode"
          >
            <span slot-scope="{ node }" class="custom-tree-node">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <el-table
          v-loading="load"
          :data="TableData"
          style="width: 100%"
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
          <el-table-column prop="Num" label="Num"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { GetSearchCenter } from '@/api/report.js'

export default {
  name: 'Traceability',
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
      title: 'traceability',
      TableData: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'SN',
      },
      params: {},
      load: false,
      WHInfo: {
        width: 0,
      },
    }
  },
  watch: {
    'WHInfo.width': function (val, oval) {
      document.querySelector('#TraceabilityAside').style.width =
        parseInt(
          getComputedStyle(document.querySelector('#TraceabilityAside'), null)
            .width
        ) +
        val +
        'px'
    },
  },
  methods: {
    getTableData() {
      return this.TableData
    },
    getClickNode(obj) {
      if (!obj.ChildUnitID) {
        this.TableData = []
        return
      }
      this.$set(this.params, 'S_SNs', obj.ChildUnitID)
      this.TableData = []
      this.load = true
      GetSearchCenter(this.params)
        .then((res) => {
          if (res.Success) {
            this.TableData = res.ResData[0]
          }
          this.load = false
        })
        .catch((error) => {
          this.load = false
        })
    },
    show(data, params) {
      this.TableData = []
      this.params = JSON.parse(JSON.stringify(params))
      this.$set(this.params, 'S_Type', 'TraceabilityDetail')

      this.treeData = this.formatTreeData(
        JSON.parse(JSON.stringify(data[0] ? data[0] : []))
      )
      this.treeData &&
        this.getClickNode(this.treeData[0] ? this.treeData[0] : {})
      this.$nextTick(function () {
        let currentNodeKey = this.treeData[0] ? this.treeData[0].SN : ''
        if (currentNodeKey) {
          this.$refs.tree.setCurrentKey(currentNodeKey)
        }
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
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
  },
}
</script>

<style lang="scss" scoped>
.page_container {
  .el-container {
    height: 100%;
    .el-main {
      ::v-deep .cell_class_name {
        border: none;
      }
      ::v-deep .el-table {
        &::before {
          background-color: transparent;
        }
      }
    }
  }
}
</style>