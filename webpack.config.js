const path = require('path');//处理路径信息
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCssWebpack = require('purifycss-webpack');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');//引入html-webpack-plugin
const webpack = require('webpack');//热更新
const uglify = require('uglifyjs-webpack-plugin');//压缩js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');//压缩css插件

const config = {
    mode: 'development', // development || production
    entry: path.resolve(__dirname, 'src/index.js'),//webpack 打包入口文件
    output: {
        path: path.resolve(__dirname, 'dist'),//打包完成放置位置
        filename: 'main.js',//打包后的文件名
    },
    module: {//例如如何解读css,图片如何转换，压缩等
        rules: [
            {
                test: /\.js$/, //匹配所有的js文件
                exclude: /(node_modules|bower_components)/,//除了node_modules等以外
                use: {
                    loader: "babel-loader",
                    options:{
                        plugins:['transform-class-properties']
                    }
                }
            },
            //配置css loaders
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader', // 编译后用什么loader来提取css文件
                    use: ['css-loader', 'postcss-loader'],//需要什么样的loader去编译文件
                    publicPath: '../' //解决css背景图的路径问题
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader','less-loader']//防置再最后的loader首先被执行
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test:/\.(png|jpg|gif|jpeg)/,  //匹配图片文件后缀名称
                use:[{
                    loader:'url-loader', //是指定使用的loader和loader的配置参数
                    options:{
                        limit:500  //把小于500B的文件打成Base64的格式，写入JS
                    }
                }]
            }
        ]
    },
    //插件，用于生产模板和各项功能
    plugins: [
        new uglify(),//压缩js文件
        new ExtractTextPlugin("styles.css"),
        new OptimizeCssAssetsPlugin(),//执行压缩抽离出来的css
        new webpack.HotModuleReplacementPlugin(),//在webpack工程中要实现热加载，就是只更新局部的修改
        new webpack.NoEmitOnErrorsPlugin(),//热更相关插件
        new HtmlWebpackPlugin({
            template: 'src/index.html', //模板地址
            filename:'index.html',//生成的dist下的模板名称
            minify:{
                removeComments:true,
                collapseWhitespace:true
            }
        }),
        new PurifyCssWebpack({ //消除冗余代码
            // 首先保证找路径不是异步的,所以这里用同步的方法
            // path.join()也是path里面的方法,主要用来合并路径的
            // 'src/*.html' 表示扫描每个html的css
            paths: glob.sync(path.join(__dirname, 'src/*.html'))
        })
    ],
    //配置webpack开发服务器功能
    devServer: {
        // 设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        //服务器的ip地址 可以使用ip也可以使用localhost
        host: 'localhost',
        //服务器压缩是否开启
        compress: true,
        //配置服务端口号
        port: 9999,
        //启动webpack-dev-server时自动打开浏览器
        open:false,
        //启用热更
        hot:true
    }
}
module.exports = config