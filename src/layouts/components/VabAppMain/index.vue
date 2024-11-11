<template>
  <div v-if="routerView" id="AppMainContainer" class="app-main-container">
    <!-- <vab-github-corner /> -->
    <transition mode="out-in" name="fade-transform">
      <keep-alive :include="cachedRoutes" :max="keepAliveMaxNum">
        <router-view :key="key" class="app-main-height" />
      </keep-alive>
    </transition>
    <footer v-show="footerCopyright" class="footer-copyright"></footer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { copyright, footerCopyright, keepAliveMaxNum, title } from '@/config'

export default {
  name: 'VabAppMain',
  data() {
    return {
      show: false,
      fullYear: new Date().getFullYear(),
      copyright,
      title,
      keepAliveMaxNum,
      routerView: true,
      footerCopyright,
    }
  },
  computed: {
    ...mapGetters({
      visitedRoutes: 'tabsBar/visitedRoutes',
      device: 'settings/device',
      tabsBar: 'settings/tabsBar',
    }),
    cachedRoutes() {
      let cachedRoutesArr = new Set()
      let add = function (visitedRoutes) {
        visitedRoutes.forEach((item) => {
          if (!item.meta.noKeepAlive) {
            cachedRoutesArr.add(item.name)
          }
          if(Array.isArray(item.matched) && item.matched.length > 0){
            add(item.matched)
          }
        })
      };

      add(this.visitedRoutes)

      return Array.from(cachedRoutesArr)
    },
    key() {
      return this.$route.path
    },
  },
  watch: {
    $route: {
      handler(route) {
        if ('mobile' === this.device) this.foldSideBar()
      },
      immediate: true,
    },
    tabsBar: function (val, oval) {
      //监听是否显示多标签
    },
  },
  created() {
    //重载所有路由
    this.$baseEventBus.$on('reload-router-view', () => {
      this.routerView = false
      this.$nextTick(() => {
        this.routerView = true
      })
    })
  },
  mounted() {},
  methods: {
    ...mapActions({
      foldSideBar: 'settings/foldSideBar',
    }),
  },
}
</script>

<style lang="scss" scoped>
.app-main-container {
  position: relative;
  height: calc(100vh - 175px);
  box-sizing: border-box;

  .vab-keel {
    margin: $base-padding;
  }
  .app-main-height {
    min-height: $base-app-main-height;
  }

  .footer-copyright {
    min-height: 55px;
    line-height: 55px;
    color: rgba(0, 0, 0, 0.45);
    text-align: center;
    border-top: 1px dashed $base-border-color;
    a {
      color: #ccc;
      &:hover,
      &:active {
        color: #ccc;
      }
    }
  }
}
</style>
