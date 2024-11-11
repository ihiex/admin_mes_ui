<template>
  <div class="kader-wrapper" :class="classObj">
    <div v-if="'horizontal' === layout" class="layout-container-horizontal" :class="{
      fixed: header === 'fixed',
      'no-tabs-bar': tabsBar === 'false' || tabsBar === false,
    }">
      <div :class="header === 'fixed' ? 'fixed-header' : ''">
        <vab-top-bar />
        <div v-if="tabsBar === 'true' || tabsBar === true" :class="{ 'tag-view-show': tabsBar }">
          <div class="vab-main">
            <vab-tabs-bar />
          </div>
        </div>
      </div>
      <div class="vab-main main-padding">
        <vab-ad />
        <vab-app-main />
      </div>
    </div>
    <div v-else class="layout-container-vertical" :class="{
      fixed: header === 'fixed',
      'no-tabs-bar': tabsBar === 'false' || tabsBar === false,
    }">
      <div v-if="device === 'mobile' && collapse === false" class="mask" @click="handleFoldSideBar" />
      <vab-side-bar />
      <div class="vab-main" :class="collapse ? 'is-collapse-main' : ''">
        <div :class="header === 'fixed' ? 'fixed-header' : ''">
          <vab-nav-bar />
          <vab-tabs-bar v-if="tabsBar === 'true' || tabsBar === true" />
        </div>
        <vab-ad />
        <vab-app-main />
      </div>
    </div>
    <el-backtop />
    <div id="WaterMark">
      <span>{{ waterMark }}</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { tokenName } from '@/config'
import VabAppMain from '@/layouts/components/VabAppMain/index.vue'
export default {
  name: 'Layout',
  components: {
    VabAppMain
  },
  data() {
    return {
      oldLayout: '',
      waterMark: process.env.VUE_APP_PROJECT_NAME ? process.env.VUE_APP_PROJECT_NAME : ''
    }
  },
  computed: {
    ...mapGetters({
      layout: 'settings/layout',
      tabsBar: 'settings/tabsBar',
      collapse: 'settings/collapse',
      header: 'settings/header',
      device: 'settings/device',
    }),
    classObj() {
      return {
        mobile: this.device === 'mobile',
      }
    },
  },
  beforeMount() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  mounted() {
    this.oldLayout = this.layout
    let userAgent = navigator.userAgent
    if (userAgent.includes('Juejin')) {
      this.$baseAlert('不支持在掘金内置浏览器演示')
    }
    let isMobile = this.handleIsMobile()
    if (isMobile) {
      if (isMobile) {
        //横向布局时如果是手机端访问那么改成纵向版
        this.$store.dispatch('settings/changeLayout', 'vertical')
      } else {
        this.$store.dispatch('settings/changeLayout', this.oldLayout)
      }
      this.$store.dispatch('settings/toggleDevice', 'mobile')
      setTimeout(() => {
        this.$store.dispatch('settings/foldSideBar')
      }, 2000)
    } else {
      this.$store.dispatch('settings/openSideBar')
    }
    this.$nextTick(() => {
      window.addEventListener(
        'storage',
        (e) => {
          if (e.key === tokenName || e.key === null) window.location.reload()
          if (e.key === tokenName && e.value === null) window.location.reload()
        },
        false
      )
    })
  },
  methods: {
    ...mapActions({
      handleFoldSideBar: 'settings/foldSideBar',
    }),
    handleIsMobile() {
      return document.body.getBoundingClientRect().width - 1 < 992
    },
    handleResize() {
      if (!document.hidden) {
        let isMobile = this.handleIsMobile()
        if (isMobile) {
          //横向布局时如果是手机端访问那么改成纵向版
          this.$store.dispatch('settings/changeLayout', 'vertical')
        } else {
          this.$store.dispatch('settings/changeLayout', this.oldLayout)
        }

        this.$store.dispatch(
          'settings/toggleDevice',
          isMobile ? 'mobile' : 'desktop'
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@mixin fix-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: $base-z-index - 2;
  width: 100%;
  overflow: hidden;
}

#WaterMark {
  position: fixed;
  z-index: 10000;
  height: 99.8%;
  width: 99.8%;
  user-select: none;
  background-color: rgba(255, 255, 255, 0);
  top: 0;
  transform: translate(1% / 2, 1% / 2);
  pointer-events: none;
  &>span {
    font-size: 30px;
    // transform-origin: center center;
    // transform: rotate(45deg);
    position: fixed;
    top: 115px;
    right: calc(50% - 80px);
    opacity: 0.3;
  }
}

.kader-wrapper {
  position: relative;
  // width: 100%;
  // height: 100%;
  // border: 1px solid blue;
  // height: calc(100vh - 200px);

  .layout-container-horizontal {
    position: relative;

    &.fixed {
      padding-top: calc(#{$base-top-bar-height} + #{$base-tabs-bar-height});
    }

    &.fixed.no-tabs-bar {
      padding-top: $base-top-bar-height;
    }

    ::v-deep {
      .vab-main {
        width: 90%;
        margin: auto;
      }

      .fixed-header {
        @include fix-header;
      }

      .tag-view-show {
        background: $base-color-white;
        box-shadow: $base-box-shadow;
      }

      .nav-bar-container {
        .fold-unfold {
          display: none;
        }
      }

      .main-padding {
        .app-main-container {
          margin-top: $base-padding;
          // margin-bottom: $base-padding;
          // background: $base-color-white;
        }
      }
    }
  }

  .layout-container-vertical {
    position: relative;

    .mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: $base-z-index - 1;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background: #000;
      opacity: 0.5;
    }

    &.fixed {
      padding-top: calc(#{$base-nav-bar-height} + #{$base-tabs-bar-height});
    }

    &.fixed.no-tabs-bar {
      padding-top: $base-nav-bar-height;
    }

    .vab-main {
      position: relative;
      // min-height: 100%;
      margin-left: $base-left-menu-width;
      background: #f6f8f9;
      transition: $base-transition;

      ::v-deep {
        .fixed-header {
          @include fix-header;

          left: $base-left-menu-width;
          width: $base-right-content-width;
          box-shadow: $base-box-shadow;
          transition: $base-transition;
        }

        .nav-bar-container {
          position: relative;
          box-sizing: border-box;
        }

        .tabs-bar-container {
          box-sizing: border-box;
        }

        .app-main-container {
          width: calc(100% - #{$base-padding} - #{$base-padding});
          margin: $base-padding auto;
          // background: $base-color-white;
          // border-radius: $base-border-radius;
        }
      }

      &.is-collapse-main {
        margin-left: $base-left-menu-width-min;

        ::v-deep {
          .fixed-header {
            left: $base-left-menu-width-min;
            width: calc(100% - 65px);
          }
        }
      }
    }
  }

  /* 手机端开始 */
  &.mobile {
    ::v-deep {

      .el-pager,
      .el-pagination__jump {
        display: none;
      }

      .layout-container-vertical {
        .el-scrollbar.side-bar-container.is-collapse {
          width: 0;
        }

        .vab-main {
          width: 100%;
          margin-left: 0;
        }
      }

      .vab-main {
        .fixed-header {
          left: 0 !important;
          width: 100% !important;
        }
      }
    }
  }

  /* 手机端结束 */
}
</style>
