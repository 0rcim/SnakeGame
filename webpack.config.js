
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const argvs = require("process").argv;
module.exports = {
    entry: './src/game.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: argvs[argvs.indexOf("--mode")+1] === "development" ? "/dist/" : "./dist/",
        filename: 'build.js'
    },
    devServer: {
        historyApiFallback: true,
        overlay: true, 
        clientLogLevel: "none"
    },
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js"
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    "css-loader"
                ]
            },
            { // 此处添加 balbel-loader
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env"]
                    }
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};