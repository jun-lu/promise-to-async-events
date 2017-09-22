
var fs = require("fs")
var webpack = require("webpack")
var version = require("./package.json").version
var HtmlWebpackPlugin = require("html-webpack-plugin")
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");

//当前环境 daily  dist
//cross-env NODE_ENV=dist webpack
var environment = process.env.NODE_ENV || "dev" // daily dev dist
//源文件目录
var rootPath = "./test";
//发布文件目录
var distPath = "./build";

//cdn
var daily_publicPath = "./";
var dist_publicPath = "./build";
//本地开发环境通常不需要配置
var dev_publicPath = null;

var dev_environment = environment.indexOf("dev"); // 本地开发环境 webpack dev
var daily_environment = environment.indexOf("daily"); // daily环境 webpack daily
var dist_environment = environment.indexOf("dist"); // 生产环境 webpack dist

var publicPath = daily_environment != -1 ? daily_publicPath : (dist_environment != -1 ? dist_publicPath : dev_publicPath);

var extractLESS = new ExtractTextPlugin('[name].css');



//读取.js文件作为入口
var entry = {};
fs.readdirSync(rootPath).map(function(item){
  if(/\.js$/.test(item)){
    entry[item.replace(".js", "")] = [rootPath+"/"+item]
  }
});

var config = {

    /**
    babel-polyfill' 可让浏览器支持最新的语法和扩展方法，比如 Object.assign 方法
    entry: ['babel-polyfill','./src/index.js'],
    */
     // entry:{
     //   main:["./src/main.js"],
     //   index:["./src/index.js"],
     //   test:["./src/test.js"]
     // },
     entry:entry,
     output: {
         path:path.resolve(__dirname, distPath),
         publicPath:publicPath,
         filename: '[name].bundle.js'
     },
     module:{
      loaders: [
        {
          test: /\.js$/,
          /**
            excule必须写一个目录不然会发出一个警告
          */
          exclude:path.resolve(__dirname, 'node_modules/'),
          /**

        babel-loader  需要配置 .babelrc
          */
          loader:'babel',
          query: {

              // 不适用async await 函数可以不要  transform-runtime 和 stage-3
              presets: ['react','es2015','stage-3','stage-1'],
              plugins: ['transform-runtime'],

              //presets: ['react','es2015'],

              //打包速度更快
              cacheDirectory: true
          }
        },
        {
        test: /\.less$/,
        /**
          css-loader less-loader autoprefixer
        extractLESS.extract 独立打包 css文件
        ['css','less','autoprefixer'] ==> ['css-loader','less-loader','autoprefixer-loader'] 的简写
        */
        loader:extractLESS.extract(['css','less','autoprefixer'])
      }

    ]
     },
     plugins: [
      extractLESS
    ]
 }



/**
  多入口的的配置
  js文件名和html文件名一一对应

  比如

    index.js
    index.html

    main.js
    main.html

*/

Object.keys(config.entry).map(function(key){

  if( fs.existsSync( path.resolve(rootPath, `${key}.html`) )){
    console.log(`ADD entry ${key}.html`);
    config.plugins.push(
      new HtmlWebpackPlugin({
        chunks:[key],
          filename:path.resolve(distPath, `${key}.html`),
          template:path.resolve(rootPath, `${key}.html`),
          inject:'body',
          hash:true,
          minify:{
            removeComments:false,
            collapseWhitespace:false
          }
      })
    )
  }
})

//线上打包需要压缩代码
if(dist_environment != -1){
  config.plugins.unshift(
    new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    )
}

/**
  热加载需要的两个插件
*/
if(dev_environment != -1){
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.plugins.push(new webpack.NoErrorsPlugin({"process.env.NODE_ENV":"development"}))
}

module.exports = config;
