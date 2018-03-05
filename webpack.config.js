
'use strict';
var webpack = require('webpack');
 //css单独打包
var ExtractTextPlugin = require("extract-text-webpack-plugin"); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    devtool: 'eval-source-map',

    entry: __dirname + '/src/entry.js', //唯一入口文件
    output: {
        path: __dirname + '/dist', //打包后的文件存放的地方
        filename: '[hash:8].bundle.js' //打包后输出文件的文件名
    },

    module: {
        loaders: [
            { test: /\.js$/, loader: "jsx!babel", include: /src/},
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css!postcss")},
            { test: /\.scss$/, loader: ExtractTextPlugin.extract("style", "css!postcss!sass")},
            { test: /\.(png|jpg)$/, loader: 'url?limit=8192'}
        ]
    },
    devServer:{
        // contentBase:'./dist',
        // historyApiFallback:true,//不跳转
        inline:true,//实时刷新
        port:'8082',
        //跨域的反向代理
        proxy:{
            '/':{
                target:'http://119.37.12.43:168',
                changeOrigin:true,
                // pathRewrite:{
                //     '^/api':''
                // }
            }
        }
    },
    postcss: [
        require('autoprefixer')    //调用autoprefixer插件,css3自动补全
    ],
    plugins: [
        new ExtractTextPlugin('main.css'),
        new webpack.ProvidePlugin({
            "React": "react",
            "ReactDOM":"react-dom",
            "$": "jquery",
        }),
        new webpack.OldWatchingPlugin(),
        new HtmlWebpackPlugin({
            template:__dirname+"/index.html"
        })
    ]

}
