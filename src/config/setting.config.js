/**
 * @description 导出默认通用配置
 */
const appId = "system";
const activeSystemCode = "openauth"; //系统编码

let setting = {
  // 开发以及部署时的URL
  publicPath: '',
  // 生产环境构建文件的目录名
  // outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 开发环境每次保存时是否输出为eslint编译警告
  lintOnSave: true,
  // 进行编译的依赖
  transpileDependencies: [],
  //标题 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
  title: 'SFC',
  //简写
  abbreviation: 'vab',
  //开发环境端口号
  devPort: '8088',
  //版本号
  version: process.env.VUE_APP_VERSION,
  //版权
  copyright: 'vab',
  //是否显示页面底部自定义版权信息
  footerCopyright: false,
  //是否显示顶部进度条
  progressBar: true,
  //缓存路由的最大数量
  keepAliveMaxNum: 99,
  // 路由模式，可选值为 history 或 hash
  routerMode: 'hash',
  //不经过token校验的路由
  routesWhiteList: ['/login', /* '/register', */ '/404', '/403', '/401', '/MultiServerDashboardPage', '/emailServer', '/multiObjectDashboard'],
  //加载时显示文字
  loadingText: 'loading...',
  //token名称
  tokenName: 'AccessToken',
  // tokenName: 'token',
  //token在localStorage、sessionStorage存储的key的名称
  tokenTableName: 'NEWSFC-2022',
  //token存储位置localStorage sessionStorage
  storage: 'sessionStorage',
  //token失效回退到登录页时是否记录本次的路由
  recordRoute: true,
  //是否显示logo，不显示时设置false，显示时请填写remixIcon图标名称，暂时只支持设置remixIcon
  logo: 'cosmo',
  //是否显示在页面高亮错误
  errorLog: ['development', 'production'],
  //是否开启登录拦截
  loginInterception: true,
  //是否开启登录RSA加密
  loginRSA: false,
  //intelligence和all两种方式，前者后端权限只控制permissions不控制view文件的import（前后端配合，减轻后端工作量），all方式完全交给后端前端只负责加载
  authentication: 'intelligence',
  //vertical布局时是否只保持一个子菜单的展开
  uniqueOpened: true,
  //vertical布局时默认展开的菜单path，使用逗号隔开建议只展开一个
  defaultOopeneds: ['/index'],
  //需要加loading层的请求，防止重复提交
  debounce: ['doEdit'],
  //需要自动注入并加载的模块
  providePlugin: { maptalks: 'maptalks', 'window.maptalks': 'maptalks' },
  //npm run build时是否自动生成7z压缩包
  build7z: false,
  //代码生成机生成在view下的文件夹名称
  templateFolder: 'project',
  /**
  * 应用Id
  */
  appId: appId,
  /**
   * 应用密钥
   */
  appSecret: '87135AB0160F706D8B47F06BDABA6FC6',
  //授权类型
  tokenGrantType: 'client_credential',
  /**
  * 当前访问系统代码
  */
  activeSystemCode: activeSystemCode,
  //多服务器配置
  multiServer: {

    // '/api_TH-J21': 'http://172.16.192.16:63402',
    // '/api_TH-J11': 'http://172.16.192.16:63400',

    /*  '/api_TH-S4X': 'http://172.16.192.3:44320',
     '/api_TH-S3X': 'http://172.16.192.16:63401',
     '/api_TH-J21b': 'http://172.16.192.16:63409',
     '/api_TH-J23': 'http://172.16.192.16:63403', */


    // '/api_DG-T4X': 'http://10.26.136.11:44328',
    // '/api_DG-J21': 'http://172.16.10.131:44328',

    '/api_DG-J31': 'http://172.16.10.88:44320',
    '/api_DG-T3X': 'http://172.16.10.63:33328',
    '/api_DG-A13': 'http://172.16.10.120:44328',
    '/api_DG-J21b': 'http://172.16.10.131:44329',
    '/api_DG-P11': 'http://10.26.136.77:44329',


  },
  multiServerForm: {
    username: 'MultiServerDashboard',
    password: '12345678',
    appId: appId,
    systemCode: activeSystemCode,
  },
  indexedDBName: 'CosmoDB',
  indexedDBVersion: 20220801,
  emailServerConfig: {
    serve: {
      // 东莞
      // '/api_DG-T4X': 'http://10.26.136.11:44328',
      // '/api_DG-J21B': 'http://172.16.10.131:44329',

      /* '/api_DG-T3X': 'http://172.16.10.63:33328',
      '/api_DG-J31': 'http://172.16.10.88:44320',
      '/api_DG-A13': 'http://172.16.10.120:44328',
      '/api_DG-P11': 'http://10.26.136.77:44329', */

      // 泰国
      /*
       '/api_TH-J23': 'http://172.16.192.16:63403',
       '/api_TH-S1X': 'http://172.16.192.16:63404',
       '/api_TH-S2X': 'http://172.16.192.16:63405',
       '/api_TH-S3X': 'http://172.16.192.16:63401',
       '/api_TH-PX': 'http://172.16.192.16:63406',
       '/api_TH-S4X': 'http://172.16.192.3:44320',
      '/api_TH-J21': 'http://172.16.192.16:63402',*/

      '/api_TH-S1X': 'http://172.16.192.16:63404',
      '/api_TH-S2X': 'http://172.16.192.16:63405',
      '/api_TH-J21': 'http://172.16.192.16:63402',
      '/api_TH-J23': 'http://172.16.192.16:63403',
      '/api_TH-S3X': 'http://172.16.192.16:63401',

      '/api_TH-J21B': 'http://172.16.192.16:63409',
      '/api_TH-P4X': 'http://10.27.149.19:44328',
      '/api_TH-S4X': 'http://10.27.149.3:44320',

    },

    // emailAddress: ['jason.zou@cosmo.io', 'howard.liu@cosmo.io', 'vincent.wang@cosmo.io','james.bian@cosmo.io', 'toby.chen@cosmo.io'],
    // 东莞
    // emailAddress: ['jason.zou@cosmo.io', 'howard.liu@cosmo.io', 'vincent.wang@cosmo.io'], //DG
    // title: "CosmoDG SFC hourly data report",
    // content: "CosmoDG SFC hourly data report",
    // ProfileName: "165_Test_Mail",

    // 泰国
    emailAddress: ['jason.zou@cosmo.io', 'vincent.wang@cosmo.io', 'howard.liu@cosmo.io'], //TH
    title: "CosmoTH SFC hourly data report",
    content: "CosmoTH SFC hourly data report",
    ProfileName: "92_5_Mail",  // S4X

    MovePath: "",
    rootPath: 'D:\\EmailFiles\\'
  }
}
module.exports = setting
