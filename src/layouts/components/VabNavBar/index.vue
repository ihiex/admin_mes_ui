<template>
  <div class="nav-bar-container">
    <el-row :gutter="15">
      <el-col :xs="4" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="left-panel">
          <i :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" :title="collapse ? $t('unfold') : $t('packUp')"
            class="fold-unfold" @click="handleCollapse"></i>
          <vab-breadcrumb class="hidden-xs-only" />
        </div>
      </el-col>
      <el-col :xs="20" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="right-panel">
          <right-logo class="hidden-xs-only"></right-logo>
          <vab-error-log />
          <!-- @refresh="refreshRoute" -->
          <vab-full-screen-bar class="hidden-xs-only" />
          <!-- <vab-theme-bar class="hidden-xs-only" /> -->
          <!-- 重载所有路由 -->
          <vab-icon class="hidden-xs-only" :title="$t('ReloadAllRoutes')" :pulse="pulse" :icon="['fas', 'redo']"
            @click="refreshRoute" />
          <vab-icon class="hidden-xs-only" :icon="['fas', 'cut']" @click="handleCapture"></vab-icon>
          <!-- 语言切换 -->
          <!-- <language></language> -->
          <vab-avatar />
          <!-- <vab-icon
            title="退出系统"
            :icon="['fas', 'sign-out-alt']"
            @click="logout"
          /> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import Language from '../Language'
import RightLogo from '../RightLogo'
import capture from '@/utils/capture.js'

/* 横向布局，左侧显示菜单 */
export default {
  name: 'VabNavBar',
  components: {
    // Language,
    RightLogo
  },
  data() {
    return {
      pulse: false,
    }
  },
  computed: {
    ...mapGetters({
      collapse: 'settings/collapse',
      visitedRoutes: 'tabsBar/visitedRoutes',
      device: 'settings/device',
      routes: 'routes/routes',
    }),
  },
  created() {
    // this.handleCollapse()
  },
  methods: {
    handleCapture() {
      capture()
    },
    ...mapActions({
      changeCollapse: 'settings/changeCollapse',
    }),
    handleCollapse() {
      this.changeCollapse()
    },
    async refreshRoute() {
      this.$baseEventBus.$emit('reload-router-view')
      this.pulse = true
      setTimeout(() => {
        this.pulse = false
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
.nav-bar-container {
  position: relative;
  height: $base-nav-bar-height;
  padding-right: $base-padding;
  padding-left: $base-padding;
  overflow: hidden;
  user-select: none;
  background: $base-color-white;
  box-shadow: $base-box-shadow;

  .left-panel {
    display: flex;
    align-items: center;
    justify-items: center;
    height: $base-nav-bar-height;

    .fold-unfold {
      color: $base-color-gray;
      cursor: pointer;
      font-size: $base-font-size-coustom;
    }

    ::v-deep {
      .breadcrumb-container {
        margin-left: 10px;
      }
    }
  }

  .right-panel {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: flex-end;
    height: $base-nav-bar-height;

    ::v-deep {
      svg {
        width: 1em;
        height: 1em;
        margin-right: 15px;
        font-size: $base-font-size-coustom;
        color: $base-color-gray;
        cursor: pointer;
        fill: $base-color-gray;
      }

      button {
        svg {
          margin-right: 0;
          color: $base-color-white;
          cursor: pointer;
          fill: $base-color-white;
        }
      }

      .el-badge {
        margin-right: 15px;
      }
    }
  }
}
</style>
