const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');
module.exports = {
    entry: './src/app/index.js',
    output:{
        path: __dirname + '/src/public/js',
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader',
                    options: {
                        presets:['@babel/preset-env'],
                    },
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },{
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                    ]
            },{
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env':{
              NODE_ENV:'"development"'
            },
            __VUE_OPTIONS_API__:true,
            __VUE_PROD_DEVTOOLS__:true
        })
    ]
}