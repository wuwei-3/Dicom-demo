/*
 * @Description: 系统配置，用户打包，css ，js 加载 代理等
 * @Version: 2.0
 * @Autor: wuwei3
 * @Date: 2020-01-16 14:02:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-30 15:26:27
 */
module.exports = {
  // 访问路径
  publicPath: './',
  // 打包文件目录
  outputDir: 'dist',
  // 静态资源目录
  assetsDir: 'static',
  // 哈希缓存
  filenameHashing: true,
  // eslint-loader 是否在保存的时候检查 开发环境报错，不影响线上环境
  lintOnSave: process.env.NODE_ENV === 'production',
  // 是否使用包含运行时编译器的Vue核心的构建
  runtimeCompiler: false,
  // 默认情况下 babel-loader 忽略其中的所有文件 node_modules
  transpileDependencies: [],
  // 生产环境 sourceMap
  productionSourceMap: false,
  /* 开启CDN 加载 */
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.json', '.vue', '.scss', '.css'],
    },
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      'element-ui': 'ELEMENT',
      axios: 'axios',
      echarts: 'echarts',
    },
  },
  devServer: {
    open: true, //配置自动启动浏览器
    host: '0.0.0.0',
    port: 8888, //启动端口
    https: false,
    hotOnly: false,
    // 解決前端跨域
    proxy: {
      '/service': {
        target: 'http://172.31.131.49',
        ws: true, // 开启soket
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/service': '/',
        },
      },
    },
  },
};
