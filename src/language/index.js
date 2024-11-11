import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import thLocale from 'element-ui/lib/locale/lang/th'
import cnLocale from 'element-ui/lib/locale/lang/zh-CN'
import CN from './cn'
import EN from './en'
import TH from './thai'

Vue.use(VueI18n)

let messages = {
  EN: {
    ...EN,
    ...enLocale
  },
  CN: {
    ...CN,
    ...cnLocale
  },
  TH: {
    ...TH,
    ...thLocale
  }
}

// Create VueI18n instance with options
let i18n = new VueI18n({
  locale: localStorage.getItem('language') || 'CN', // set locale
  messages, // set locale messages
})
locale.i18n((key,value)=>i18n.t(key, value))

export default i18n;