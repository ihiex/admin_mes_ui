/**
 * @author Jason.zou 305043598@qq.com
 * @description cli配置
 */
const { exec } = require('child_process'); //exec命令执行函数，可删除空目录
const fse = require('fs-extra'); //删除非空目录
const HappyPack = require('happypack')
const path = require('path')
let {
  publicPath,
  assetsDir,
  // outputDir,
  // lintOnSave,
  transpileDependencies,
  title,
  abbreviation,
  devPort,
  build7z,
  multiServer,
  emailServerConfig
} = require('./src/config')

let { version, author } = require('./package.json')
let Webpack = require('webpack')
let WebpackBar = require('webpackbar')
let FileManagerPlugin = require('filemanager-webpack-plugin')
let dayjs = require('dayjs')
let date = dayjs().format('YYYY_M_D')
let time = dayjs().format('YYYY-M-D HH:mm:ss')
process.env.VUE_APP_TITLE = title || 'cosmo'
process.env.VUE_APP_AUTHOR = author || '305043598@qq.com'
process.env.VUE_APP_UPDATE_TIME = time
process.env.VUE_APP_VERSION = version
var happyThreadPool = HappyPack.ThreadPool({ size: 5 });

let resolve = (dir) => path.join(__dirname, dir)
let mockServer = () => {
  if (process.env.NODE_ENV === 'development') return require('./mock')
  else return
}

/* function deleteStaticDir() {
  exec(`rm -rf ${resolve(process.env.OUTPUT_DIR + '/static/software')}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行的错误: ${JSON.stringify(error)}`);
      return;
    }
    console.log(`stdout: ${JSON.stringify(stdout)}`);
    console.error(`stderr: ${JSON.stringify(stderr)}`);
  });
}
 */

function deleteDir() {
  fse.remove(resolve(process.env.OUTPUT_DIR + '/static/software'), (error) => {
    if (error) {
      console.error(`clean software error: ${JSON.stringify(error)}`);
      return;
    } else {
      // 设置源目录和7z文件路径
      // const sourceDir = resolve(`output/${process.env.VUE_APP_PROJECT_NAME}`);
      // const outputFile = resolve(`output/${process.env.VUE_APP_PROJECT_NAME}.7z`);// 打包后的文件名
      const sourceDir = `./output/${process.env.VUE_APP_PROJECT_NAME}`;
      const outputFile = `./output/${process.env.VUE_APP_PROJECT_NAME}.7z`;// 打包后的文件名
      // 构建7zip命令，该命令需在本地安装7z软件并配置环境变量
      const command = `7z a -r ${outputFile} ${sourceDir}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`package error: ${JSON.stringify(error)}`);
          return;
        } else {
          fse.remove(resolve(`output/${process.env.VUE_APP_PROJECT_NAME}`), (error) => {
            console.error(`clean dir error: ${JSON.stringify(error)}`);
          })
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    }
  });
}

const config = {
  publicPath,
  assetsDir,
  outputDir: process.env.OUTPUT_DIR,
  // lintOnSave,
  productionSourceMap: process.env.NODE_ENV === 'development' ? true : false,
  transpileDependencies,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    // https: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    after: mockServer(),
    proxy: {}
  },
  configureWebpack() {
    return {
      // resolve: {
      //   alias: {
      //     '@': resolve('src'),
      //   },
      // },
      plugins: [
        new HappyPack({
          id: 'js',
          // threads: 5,
          threadPool: happyThreadPool,
          use: [{
            //用 babel-loader 把es6转es5
            loader: "babel-loader",
          }]
        }),
        new HappyPack({
          id: 'css',
          // threads: 5,
          threadPool: happyThreadPool,
          use: [
            "style-loader",
            "css-loader",
            "postcss-loader"]
        }),

        new Webpack.ProgressPlugin((percentage, message) => {
          // 当编译进度达到100%时，删除指定目录
          if (Math.floor(percentage * 100) === 100 && process.env.NODE_ENV === 'production') {
              deleteDir();
          }
        }),
      ]
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugin('provide').use(Webpack.ProvidePlugin, [{ 'window.Quill': 'quill' }])
    config.plugin('delete-static-dir').use(Webpack.DefinePlugin, [{
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__VUE_PROD_DEVTOOLS__': JSON.stringify(false),
    }]).after('define')
    /*  config.module
       .rule('svg')
       .exclude.add(resolve('src/remixIcon'))
       .add(resolve('src/colorfulIcon'))
       .end() */

    config.module
      .rule('remixIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/remixIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'remix-icon-[name]' })
      .end()

    config.module
      .rule('colorfulIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/colorfulIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'colorful-icon-[name]' })
      .end()

    /*  config.module
       .rule('svg')
       .exclude.add(resolve('src/icons'))
       .end() */
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
    config.optimization.minimizer('terser').tap((args) => {
      // 去除生产环境console
      args[0].terserOptions.compress.drop_console = true
      return args
    })
    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.performance.set('hints', false)
      // config.devtool('none')
      // config.devtool("cheap-source-map");
      config.devtool("cheap-module-source-map");
      config.optimization.splitChunks({
        automaticNameDelimiter: '-',
        chunks: 'all',
        cacheGroups: {
          chunk: {
            name: 'vab-chunk',
            test: /[\\/]node_modules[\\/]/,
            minSize: 131072,
            maxSize: 524288,
            chunks: 'async',
            minChunks: 2,
            priority: 10,
          },
          vue: {
            name: 'vue',
            test: /[\\/]node_modules[\\/](vue(.*)|core-js)[\\/]/,
            chunks: 'initial',
            priority: 20,
          },
          /*  elementUI: { //该方式引入 会导致发布后 偶有图标乱码现象
             name: 'element-ui',
             test: /[\\/]node_modules[\\/]element-ui(.*)[\\/]/,
             priority: 30,
           }, */
          extra: {
            name: 'vab-layouts',
            test: resolve('src/layouts'),
            priority: 40,
          },
        },
      })

    })
    /*  if (build7z) {
       config.when(process.env.NODE_ENV === 'production', (config) => {
         config
           .plugin('fileManager')
           .use(FileManagerPlugin, [
             {
               onEnd: {
                 delete: [`./${outputDir}/video`, `./${outputDir}/data`],
                 archive: [
                   {
                     source: `./${outputDir}`,
                     destination: `./${outputDir}/${abbreviation}_${outputDir}_${date}.7z`,
                   },
                 ],
               },
             },
           ])
           .end()
       })
     } */
  },
  runtimeCompiler: true,
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      scss: {
        /*sass-loader 8.0语法 */
        //prependData: '@import "~@/styles/variables.scss";',

        /*sass-loader 9.0写法，感谢github用户 shaonialife*/
        additionalData(content, loaderContext) {
          let { resourcePath, rootContext } = loaderContext
          let relativePath = path.relative(rootContext, resourcePath)
          if (
            relativePath.replace(/\\/g, '/') !== 'src/styles/variables.scss'
          ) {
            return '@import "~@/styles/variables.scss";' + content
          }
          return content
        },
      },
    },
  }
}

let serveKeys = { ...multiServer, ...emailServerConfig?.serve }

Object.keys(serveKeys).forEach(key => {
  config.devServer.proxy[key] = {
    target: serveKeys[key],
    ws: true,
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      [`^${key}`]: ""
    }
  }
})
config.devServer.proxy['/api'] = {
  target: process.env.VUE_APP_BASE_URL,
  ws: true,
  secure: false,
  changeOrigin: true,
  pathRewrite: {
    '^/api': ""
  }
}

module.exports = config
