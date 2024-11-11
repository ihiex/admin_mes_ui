# 安装依赖
npm i、cnpm i

# 备注：
如果从SVN上下载项目后 发现在本地无法运行 可以将node_modules目录删除（该目录与自己本地的nodejs的版本及npm版本相关）版本不对时会报错
上传该目录主要是为了方便，如果该目录不想上传可以在本的svn设置屏蔽该目录（node_modules）。然后重新npm install或cnpm install
developer/C04m0@VTHJ

# 本地开发 启动项目
npm run serve  默认为s1x项目
npm run serve:dev_S2X  运行的结果指向为S2X项目

# 打包 
npm run build 默认为s1x
npm run build:pro_S2X 打包的结果指向为S2X项目

# node.js版本说明 v16.14.2  npm 6.14.8
node安装版本16.14.2; 安装完后npm的版本会比较高，此时可以将npm安装成指定的6.14.8的版本。原因是最新的npm版本在安装其它模块时会对所有安装版本进行检查，最后会导致模块无法下载的现象;
安装指定版本 npm install -g npm@6.14.8

# 多服务器页面配置(线上) 
src/config/setting.config.js
字段：multiServer 按json的方式及现有key的方式添加; 如：/api+_+项目名称

# 多服务器页面配置(本地开发)
vue-config.js 的代理设置中添加 

