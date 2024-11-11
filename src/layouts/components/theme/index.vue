<template>
  <div>
    <div @click="handleOpenThemeBar">
      <vab-icon :title="$t('themeConfig')" :icon="['fas', 'palette']" />
      {{ $t('themeConfig') }}
    </div>
    <!-- 右侧主题配置按钮  -->
    <div v-if="themeBarRight" class="theme-bar-setting">
      <div @click="handleOpenThemeBar">
        <vab-icon :icon="['fas', 'palette']" />
        <p>{{ $t('themeConfig') }}</p>
      </div>
    </div>

    <el-drawer :title="$t('themeConfig')" :visible.sync="drawerVisible" direction="rtl" append-to-body size="500px"
      class="theme_drawer">
      <el-scrollbar style="height: 94vh; overflow: hidden">
        <div class="el-drawer__body">
          <el-form ref="form" :model="theme" label-position="top">
            <el-form-item :label="$t('menu')">
              <el-radio-group v-model="theme.name">
                <el-radio-button label="default">
                  {{ $t('default') }}
                </el-radio-button>
                <el-radio-button label="green">
                  {{ $t('GreenPastures') }}
                </el-radio-button>
                <el-radio-button label="glory">
                  {{ $t('GloryCollection') }}
                </el-radio-button>
                <el-radio-button label="orean">
                  {{ $t('HeartOfTheSea') }}
                </el-radio-button>
                <el-radio-button label="red">
                  {{ $t('MonthOnHeavyFire') }}
                </el-radio-button>
                <el-radio-button label="customMenuColor">
                  {{ $t('custom') }}
                </el-radio-button>
              </el-radio-group>
              <div style="padding: 10px">
                <span>{{ $t('custom') }}</span>
                <!-- <input v-model="theme.customMenuColor" type="color" /> -->
                <el-color-picker v-model="theme.customMenuColor" class="menu-picker"></el-color-picker>
              </div>
            </el-form-item>
            <el-form-item :label="$t('theme')">
              <!-- <div style="padding: 10px">
                <span>自定义</span>
                <input v-model="theme.themeColor" type="color" />
              </div> -->
              <el-color-picker v-model="theme.themeColor" class="u-theme-picker" :predefine="themeList"></el-color-picker>
            </el-form-item>
            <el-form-item :label="$t('layout')">
              <el-radio-group v-model="theme.layout">
                <el-radio-button label="vertical">
                  {{ $t('VerticalLayout') }}
                </el-radio-button>
                <el-radio-button label="horizontal">
                  {{ $t('HorizontalLayout') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('head')">
              <el-radio-group v-model="theme.header">
                <el-radio-button label="fixed">
                  {{ $t('FixedHead') }}
                </el-radio-button>
                <el-radio-button label="noFixed">
                  {{ $t('UnfixedHead') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('multiLabel')">
              <el-radio-group v-model="theme.tabsBar">
                <el-radio-button label="true">{{ $t('open') }}</el-radio-button>
                <el-radio-button label="false">
                  {{ $t('NotOpen') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveTheme">
                {{ $t('save') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script>
import variables from '@/styles/variables.scss'
import { mapActions, mapGetters } from 'vuex'
import { layout as defaultLayout } from '@/config'

/* 主题配置 */
export default {
  name: 'Theme',
  data() {
    return {
      drawerVisible: false,
      theme: {
        name: 'default',
        layout: '',
        header: 'fixed',
        tabsBar: '',
        customMenuColor: '',
        themeColor: '',
      },
      menuColor: {
        default: '#282c34',
        green: 'rgb(5, 218, 5)',
        glory: '#655074',
        orean: '#1848a6',
        red: '#f99a30',
        customMenuColor: '',
      },
      themeList: [
        '#111111',
        '#41b584',
        '#3C6CFE',
        '#00AE8A',
        '#30BDF4',
        '#6772E5',
        '#FB6B01',
        '#353D64',
        '#7A40F2',
      ],
    }
  },
  computed: {
    ...mapGetters({
      layout: 'settings/layout',
      header: 'settings/header',
      tabsBar: 'settings/tabsBar',
      themeBar: 'settings/themeBar',
      themeColor: 'settings/themeColor',
      themeBarRight: 'settings/themeBarRight'
    }),
  },
  created() {
    this.$baseEventBus.$on('theme', () => {
      this.handleOpenThemeBar()
    })
    let theme = localStorage.getItem('kader-theme')
    if (null !== theme) {
      this.theme = JSON.parse(theme)
      this.menuColor.customMenuColor = this.theme.customMenuColor
      this.handleSetTheme()
    } else {
      this.theme.layout = this.layout
      this.theme.header = this.header
      this.theme.tabsBar = this.tabsBar
      this.theme.customMenuColor = variables['menu-background']
      this.theme.themeColor = this.themeColor
    }
  },
  methods: {
    ...mapActions({
      changeLayout: 'settings/changeLayout',
      changeHeader: 'settings/changeHeader',
      changeTabsBar: 'settings/changeTabsBar',
    }),
    handleClick() { },
    handleIsMobile() {
      return document.body.getBoundingClientRect().width - 1 < 992
    },
    handleOpenThemeBar() {
      this.drawerVisible = true
    },
    handleSetTheme() {
      let { name, layout, header, tabsBar, customMenuColor, themeColor } =
        this.theme
      this.menuColor.customMenuColor = customMenuColor
      localStorage.setItem(
        'kader-theme',
        `{
            "name":"${name}",
            "layout":"${layout}",
            "header":"${header}",
            "tabsBar":"${tabsBar}",
            "customMenuColor": "${customMenuColor}",
            "themeColor": "${themeColor}"
          }`
      )
      if (!this.handleIsMobile()) this.changeLayout(layout)
      this.changeHeader(header)
      this.changeTabsBar(tabsBar)
      //菜单
      document.body.style.setProperty('--baseMenu', this.menuColor[name])
      //主题
      document.body.style.setProperty('--themeColor', themeColor)
      this.drawerVisible = false
    },
    handleSaveTheme() {
      this.handleSetTheme()
    },
    handleSetDfaultTheme() {
      let { name } = this.theme
      document
        .getElementsByTagName('body')[0]
        .classList.remove(`kader-theme-${name}`)
      localStorage.removeItem('kader-theme')
      this.$refs['form'].resetFields()
      Object.assign(this.$data, this.$options.data())
      this.changeHeader(defaultLayout)
      this.theme.name = 'default'
      this.theme.layout = this.layout
      this.theme.header = this.header
      this.theme.tabsBar = this.tabsBar
      this.drawerVisible = false
      location.reload()
    },
  },
}
</script>
<style lang="scss"></style>
<style lang="scss" scoped>
@mixin right-bar {
  position: fixed;
  right: 0;
  z-index: $base-z-index;
  width: 60px;
  min-height: 60px;
  text-align: center;
  cursor: pointer;
  background: $base-color-blue;
  border-radius: $base-border-radius;

  >div {
    padding-top: 10px;
    border-bottom: 0 !important;

    &:hover {
      opacity: 0.9;
    }

    &+div {
      border-top: 1px solid $base-color-white;
    }

    p {
      padding: 0;
      margin: 0;
      font-size: $base-font-size-small;
      line-height: 30px;
      color: $base-color-white;
    }
  }
}

.menu-picker {
  position: relative;
  top: 12px;
  left: 5px;
}

.theme-bar-setting {
  @include right-bar;

  top: calc((100vh - 110px) / 2);

  ::v-deep {
    svg:not(:root).svg-inline--fa {
      display: block;
      margin-right: auto;
      margin-left: auto;
      color: $base-color-white;
    }

    .svg-icon {
      display: block;
      margin-right: auto;
      margin-left: auto;
      font-size: 20px;
      color: $base-color-white;
      fill: $base-color-white;
    }
  }
}

.el-drawer__body {
  padding: 20px;
}
</style>
<style lang="scss">
.el-drawer__wrapper {
  outline: none !important;

  * {
    outline: none !important;
  }
}

.vab-color-picker {
  .el-color-dropdown__link-btn {
    display: none;
  }
}

.theme_drawer {
  .el-drawer__body {
    overflow: hidden;
  }
}
</style>
