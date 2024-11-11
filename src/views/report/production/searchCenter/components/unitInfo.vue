<template>
  <div v-loading="loading" class="page_container">
    <el-container id="UnitInfoContainer" style="height: 40%">
      <!-- v-rightDrag="WHInfo" -->
      <!-- style="border-right: 3px solid #efefef; padding:10px" -->
      <el-aside id="UnitInfoAside" width="50%">
        <el-table :data="tableData" size="mini" stripe :show-header="false" cell-class-name="cell_class_name"
          height="100%">
          <el-table-column prop="Type" label="Type" width="200">
            <template slot-scope="scope">
              {{ scope.row.Type }}
              <i :class="icons[scope.row.Type]"></i>
              <vab-icon :icon="['fas', icons[scope.row.Type]]"></vab-icon>
            </template>
          </el-table-column>
          <el-table-column prop="Num" label="Num" min-width="150"></el-table-column>
        </el-table>
      </el-aside>
      <el-main id="UnitInfoMain">
        <el-table :data="LeftTableData" class="left_table" style="width: 100%" size="small" :show-header="false"
          cell-class-name="cell_class_name" height="100%">
          <el-table-column prop="Type" label="Type" width="200">
            <template slot-scope="scope">
              <div class="attr_title">{{ scope.row.Type }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="Num" label="Num" min-width="150"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <!-- v-topDrag="WHInfo" -->
    <el-footer id="UnitInfoFooter" style="height: 60%; border-top: 1px solid #efefef">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="History" name="History">
          <div class="footer_table_container">
            <el-table :data="HistoryTableData" style="width: 100%" size="mini" stripe :fit="true" height="100%" border>
              <el-table-column v-for="item in HistoryTableHead" :key="item" :prop="item" :label="item" sortable
                :min-width="item == 'ID' || item == 'UnitID' || item == 'Status'
                  ? '90'
                  : (item == 'Employee' || item == 'LooperCount')
                    ? '130'
                    : '200'
                  " :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Defect" name="Defect">
          <div class="footer_table_container">
            <el-table :data="DefectTableData" style="width: 100%" size="mini" stripe border :fit="true"
              height="inherit">
              <el-table-column v-for="item in DefectTableHead" :key="item" :prop="item" :label="item" sortable
                :min-width="item == 'ID' ? '90' : '200'" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-footer>
  </div>
</template>

<script>
export default {
  name: 'UnitInfo',
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
      title: 'unitInfo',
      activeName: 'History',
      tableData: [],
      LeftTableData: [],
      HistoryTableData: [],
      HistoryTableHead: [],
      DefectTableData: [],
      DefectTableHead: [],
      icons: {
        UnitState: 'allergies',
        UnitStatus: 'chalkboard-teacher',
        Station: 'server',
        Line: 'el-icon-c-scale-to-original',
        Employee: 'el-icon-user-solid',
        AlterTime: 'el-icon-timer',
        LastUpdate: 'hourglass-end',
        ProductionOrder: 'luggage-cart',
        PartNumber: 'dice-d6',
      },
      WHInfo: {
        height: 0,
        width: 0,
      },
    }
  },
  watch: {
    'WHInfo.height': function (val, oval) {
      document.querySelector('#UnitInfoContainer').style.height =
        parseInt(
          getComputedStyle(document.querySelector('#UnitInfoContainer'), null)
            .height
        ) +
        val +
        'px'
      document.querySelector('#UnitInfoFooter').style.height =
        parseInt(
          getComputedStyle(document.querySelector('#UnitInfoFooter'), null)
            .height
        ) -
        val +
        'px'
    },
    'WHInfo.width': function (val, oval) {
      document.querySelector('#UnitInfoAside').style.width =
        parseInt(
          getComputedStyle(document.querySelector('#UnitInfoAside'), null).width
        ) +
        val +
        'px'
    },
  },
  methods: {
    show(data) {
      this.HistoryTableData = []
      this.DefectTableData = []
      this.tableData = data[0]
      this.LeftTableData = data[1]
      this.HistoryTableHead =
        data[2] && data[2].length > 0 ? Object.keys(data[2][0]) : []

      let index = this.HistoryTableHead.findIndex(res => res == "ID")
      if (index > -1) {
        this.HistoryTableHead.splice(index, 1);
      }

      this.DefectTableHead =
        data[3] && data[3].length > 0 ? Object.keys(data[3][0]) : []
      this.$nextTick(function () {
        this.HistoryTableData = data[2]
        this.DefectTableData = data[3]
      })
    },
    handleClick(tabs, event) { },
  },
}
</script>

<style lang="scss" scoped>
.page_container {
  overflow: auto;

  // user-select: none;
  ::v-deep .el-table {
    &::before {
      background-color: transparent;
    }
  }

  ::v-deep .cell_class_name {
    border: none;
  }

  .el-container {
    .el-aside {
      padding: 10px;
      box-sizing: border-box;

      .el-table {
        &:hover {
          transform: translateY(-4px);
          border-color: transparent;
          box-shadow: 0 6px 16px rgb(200 200 200 / 94%);
        }
      }
    }

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
