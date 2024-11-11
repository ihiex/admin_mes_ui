<template>
  <el-breadcrumb class="breadcrumb-container" separator="/">
    <el-breadcrumb-item v-for="item in list" :key="item.path">
      {{ item.meta.language ? $t(item.meta.language) : item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
/* 面包屑 */
export default {
  name: 'VabBreadcrumb',
  data() {
    return {
      list: this.getBreadcrumb(),
    }
  },
  watch: {
    $route() {
      this.list = this.getBreadcrumb()
    },
  },
  methods: {
    getBreadcrumb() {
      return this.$route.matched.filter((item) => item.name && item.meta.title)
    },
  },
}
</script>

<style lang="scss" scoped>
.breadcrumb-container {
  height: $base-nav-bar-height;
  font-size: $base-font-size-default;
  line-height: $base-nav-bar-height;

  ::v-deep {
    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        a {
          display: flex;
          float: left;
          font-weight: normal;
          color: #515a6e;

          i {
            margin-right: 3px;
          }
        }
      }

      &:last-child {
        .el-breadcrumb__inner {
          a {
            color: #999;
          }
        }
      }
    }
  }
}
</style>
<style>
.el-breadcrumb__separator {
  margin: 0 3px !important;
  font-weight: bold;
  color: #c0c4cc;
}
</style>
