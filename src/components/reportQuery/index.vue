<template>
  <div class="component_container">
    <div style="height: 40px; line-height: 40px;">
      <div style="position: absolute; right: 10px; display: inline-block;">
        <el-button icon="el-icon-search" type="primary" @click="handleSearch">{{ $t('query')
        }}</el-button>
        <el-button plain  icon="el-icon-refresh-right" :style="{ 'margin-right': !$slots.button ? '20px' : '' }"
          @click="handleReset">{{ $t('reset') }}</el-button>
        <slot name="button" :style="{ 'margin-right': defaultSlot ? '20px' : '' }"></slot>
        <div v-if="defaultSlot" style="display: inline-block;">
          <span v-if="!show" size="mini" class="unfold_btn" @click="show = !show">
            {{ $t('unfold') }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <span v-else size="mini" class="unfold_btn" @click="show = !show">
            {{ $t('packUp') }}
            <i class="el-icon-arrow-up el-icon--right"></i>
          </span>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="show" id="Search" ref="searchContainer">
        <slot></slot>
      </div>
    </transition>

    <div :style="{ height: `calc(100% - 95px - ${height})` }">
      <slot name="table"></slot>
    </div>
    <el-pagination v-if="showPagination" style="text-align: left;" :current-page="currentPageIndex"
      :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
import { pageSizes } from '@/config'

export default {
  props: {
    pageSizes: {
      type: Array,
      default: () => {
        return pageSizes
      }
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 100
    },
    currentPageIndex: {
      type: Number,
      default: 1
    },
    showPagination: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      height: this.showPagination ? '0px' : '-45px',
      defaultSlot: this.$slots.default ? true : false
    }
  },
  watch: {
    show(val, oval) {
      if (val) {
        let that = this;
        setTimeout(function () {
          let dom = getComputedStyle(that.$refs.searchContainer, 'height')
          that.height = that.showPagination ? dom.height : `${dom.height} + 45px`;
        }, 500)
      } else {
        this.height = this.showPagination ? '0px' : '-45px';
      }
    }
  },
  methods: {
    handleSearch() {
      this.show = false
      this.$emit('search', {
        PageSize: this.pageSize,
        CurrentPageIndex: 1
      })
    },
    handleReset() {
      this.$emit('reset')
    },
    handleSizeChange(val) {
      this.$emit('search', {
        PageSize: val,
        CurrentPageIndex: this.currentPageIndex,
      })
    },
    handleCurrentChange(val) {
      this.$emit('search', {
        PageSize: this.pageSize,
        CurrentPageIndex: val,
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.component_container {
  position: relative;
  padding: 0 5px;
  height: inherit;
  overflow-y: hidden;
  min-width: 360px;
  min-height: 500px;
  // border: 1px solid red;
  background-color: #fff;
  box-sizing: border-box;
}
</style>
