<template>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link">
      <i slot="reference" class="el-icon-setting" @click="handleClick"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <div class="popover">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <span class="reset_btn" @click="handleReset">重置</span>
        <div
          style="margin: 15px 0 8px 0; border-bottom: 1px solid #ececec"
        ></div>
        <el-checkbox-group
          v-model="checkedCities"
          @change="handleCheckedCitiesChange"
        >
          <vuedraggable v-model="cities">
            <transition-group>
              <div
                v-for="city in cities"
                :key="city[valueKey]"
                class="checkbox_clo"
              >
                <span class="svg_icon">
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 8 16"
                    fill="currentColor"
                  >
                    <g id="surface5">
                      <path
                        d="M 5 4.003906 C 5 3.449219 5.449219 3 6.003906 3 C 6.558594 3 7.007812 3.449219 7.007812 4.003906 C 7.007812 4.558594 6.558594 5.007812 6.003906 5.007812 C 5.449219 5.007812 5 4.558594 5 4.003906 Z M 5 8.25 C 5 7.695312 5.449219 7.246094 6.003906 7.246094 C 6.558594 7.246094 7.007812 7.695312 7.007812 8.25 C 7.007812 8.804688 6.558594 9.253906 6.003906 9.253906 C 5.449219 9.253906 5 8.804688 5 8.25 Z M 5 12.496094 C 5 11.941406 5.449219 11.492188 6.003906 11.492188 C 6.558594 11.492188 7.007812 11.941406 7.007812 12.496094 C 7.007812 13.050781 6.558594 13.5 6.003906 13.5 C 5.449219 13.5 5 13.050781 5 12.496094 Z M 9.554688 4.003906 C 9.554688 3.449219 10.003906 3 10.558594 3 C 11.113281 3 11.5625 3.449219 11.5625 4.003906 C 11.5625 4.558594 11.113281 5.007812 10.558594 5.007812 C 10.003906 5.007812 9.554688 4.558594 9.554688 4.003906 Z M 9.554688 8.25 C 9.554688 7.695312 10.003906 7.246094 10.558594 7.246094 C 11.113281 7.246094 11.5625 7.695312 11.5625 8.25 C 11.5625 8.804688 11.113281 9.253906 10.558594 9.253906 C 10.003906 9.253906 9.554688 8.804688 9.554688 8.25 Z M 9.554688 12.496094 C 9.554688 11.941406 10.003906 11.492188 10.558594 11.492188 C 11.113281 11.492188 11.5625 11.941406 11.5625 12.496094 C 11.5625 13.050781 11.113281 13.5 10.558594 13.5 C 10.003906 13.5 9.554688 13.050781 9.554688 12.496094 Z M 9.554688 12.496094 "
                        style="
                          fill-opacity: 1;
                          fill-rule: nonzero;
                          stroke: none;
                        "
                      ></path>
                    </g>
                  </svg>
                </span>
                <el-checkbox :label="city[valueKey]">
                  {{ city[labelKey] }}
                </el-checkbox>
              </div>
            </transition-group>
          </vuedraggable>
        </el-checkbox-group>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import vuedraggable from 'vuedraggable'
export default {
  components: {
    vuedraggable,
  },
  props: {
    dataList: {
      type: Array,
      default: () => {
        return []
      },
    },
    value: {
      type: Array,
      default: () => {
        return []
      },
    },
    checked: {
      type: Array,
      default: () => {
        return []
      },
    },
    valueKey: {
      type: String,
      default: () => {
        return 'prop'
      },
    },
    labelKey: {
      type: String,
      default: () => {
        return 'label'
      },
    },
  },

  data() {
    return {
      changeDatas: JSON.parse(JSON.stringify(this.dataList)),
      visible: false,
      checkAll: this.checked,
      checkedCities: this.checked,
      cities: JSON.parse(JSON.stringify(this.dataList)),
      isIndeterminate: true,
      cacheList: JSON.parse(JSON.stringify(this.dataList)),
    }
  },
  watch: {
    dataList: function () {
      this.cities = [...this.dataList]
    },
    checked: function () {
      this.checkedCities = [...this.checked]
      if (this.checked.length == this.cities.length) {
        // this.$nextTick(function () {
        this.checkAll = true
        this.isIndeterminate = false
        // })
      }
    },
    cities: function (value, oval) {
      let arr = []
      value.forEach((res) => {
        let flag = this.checkedCities.find((val) => val === res[this.valueKey])
        if (flag) {
          arr.push(res)
        }
      })
      this.$emit('change', arr)
    },
  },
  mounted() {},
  methods: {
    handleClick() {
      this.visible = !this.visible
      // this.$forceUpdate()
      this.checkedCities = [...this.checked]
      if (this.checked.length == this.cities.length) {
        // this.$nextTick(function () {
        this.checkAll = true
        this.isIndeterminate = false
        // })
      }
    },
    handleReset() {
      this.cities = JSON.parse(JSON.stringify(this.cacheList))
    },
    handleCheckAllChange(val) {
      this.checkedCities = val
        ? this.cities.map((val) => val[this.valueKey])
        : []
      this.isIndeterminate = false
      if (val) {
        this.$emit('change', this.cities)
      } else {
        this.$emit('change', [])
      }
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
      //勾选的还不能在对应的位置显示
      this.changeDatas = []
      this.cities.forEach((val) => {
        let str = value.find((v) => val[this.valueKey] === v)
        if (str && str != '') {
          this.changeDatas.push(val)
        }
      })
      this.$emit('change', this.changeDatas)
    },
  },
}
</script>
<style lang="scss" scoped>
.popover {
  position: relative;
  min-width: 200px;
  padding: 12px;
  box-sizing: border-box;
  .reset_btn {
    color: #41b584;
    cursor: pointer;
    position: absolute;
    right: 15px;
  }
  .checkbox_clo {
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    position: relative;
    .svg_icon {
      position: absolute;
      left: -12px;
    }
  }
  .el-checkbox {
    margin-left: 5px;
  }
}
</style>