<template>
  <div class="component_container">
    <div style="height: 40px; line-height: 40px;">
      <el-button v-if="showAdd" icon="el-icon-plus" @click="add">{{ $t('Added') }}</el-button>
      <slot name="button"></slot>
      <div style="position: absolute; right: 10px; display: inline-block;">
        <el-input v-model.trim="keywords" :placeholder="$t('keywords')"
          :class="{ 'hidden-xs-only': defaultSlot ? true : false }" clearable style="width: 200px; margin-right: 15px;"
          @input="handleInput" @keypress.native.enter="handleEnter">
        </el-input>
        <el-switch v-if="showFold" v-model="switchLock" class="hidden-xs-only" style="margin: 0 10px;"
          inactive-color="#ccc" :active-text="$t('unfold')" :inactive-text="$t('fold')" @change="handleSwitch">
        </el-switch>
        <el-button icon="el-icon-search" type="primary" @click="handleSearch">{{ $t('query')
        }}</el-button>
        <el-button plain :style="{ 'margin-right': defaultSlot ? '20px' : '' }" icon="el-icon-refresh-right"
          @click="handleReset">{{ $t('reset') }}</el-button>
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
    value: {
      type: String,
      default: ''
    },
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
    showAdd: {
      type: Boolean,
      default: true
    },
    showFold: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      switchLock: false,
      keywords: '',
      height: this.showPagination ? '0px' : '-45px',
      defaultSlot: this.$slots.default ? true : false
    }
  },
  watch: {
    value(val, oval) {
      this.keywords = val
    },
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
    handleEnter() {
      this.handleSearch()
    },
    handleInput(val) {
      this.$emit('input', val)
    },
    handleSwitch(val) {
      this.$emit('switchLock', val)
    },
    add() {
      this.$emit('add')
    },
    handleReset() {
      this.keywords = ''
      this.$emit('input', this.keywords)
      this.$emit('reset')
    },
    handleSearch() {
      this.show = false
      this.$emit('search', {
        PageSize: this.pageSize,
        CurrentPageIndex: 1
      })
    }
  },
}

</script>
<style lang="scss" scoped>
.component_container {
  position: relative;
  padding: 0 10px;
  height: inherit;
  overflow-y: hidden;
  min-width: 360px;
  min-height: 500px;
}
</style>
