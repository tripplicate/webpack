const   path = require("path");

const   HtmlWebpackPlugin = require("html-webpack-plugin"),
        {CleanWebpackPlugin} = require('clean-webpack-plugin'),
        MiniCssExtractPlugin = require("mini-css-extract-plugin");


const CONFIG = {
    outputFolder: "build",
    sourceFolder: "src/",
}        

module.exports = {
    mode: process.env.WEBPACK_MODE || "production",
    entry: {
        index: path.resolve(__dirname, "src/index.js")
    },
    output: {
        filename: "js/[contenthash].js",
        path: path.resolve(__dirname, CONFIG.outputFolder),
        publicPath: "/" 
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, CONFIG.sourceFolder),
            components: path.resolve(__dirname, CONFIG.sourceFolder, "components/"),
            images: path.resolve(__dirname, CONFIG.sourceFolder, "assets/images/"),
        },
        extensions: [".js", ".jsx"]
    },
    optimization: {
        splitChunks: {
          chunks: 'all',
        },
    },
    module: {
        rules: [
            {
                test: /.m?jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-transform-runtime"]
                    }
                } 
            },
            {
                test: /\.(css|scss|sass)$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 
                {
                  loader: 'postcss-loader',
                  options: {
                      postcssOptions: {
                          plugins: [
                              ["postcss-preset-env"],
                              process.env.WEBPACK_MODE === "production" ? ["cssnano"] : ""
                          ]
                      }
                  }
                },
                  "sass-loader"]
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
                use: [
                    {
                      loader: 'file-loader',
                      options: {
                        publicPath: '../',
                        name: `assets/images/[contenthash].[ext]`,
                      },
                    },
                  ],
            },
            {
                test: /\.(mp3|mp4)$/i,
                use: [
                    {
                      loader: 'file-loader',
                      options: {
                        publicPath: '../',
                        name: `assets/audio/[contenthash].[ext]`,
                      },
                    },
                  ],
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/,
                use: [
                    {
                      loader: 'file-loader',
                      options: {
                        publicPath: '../',
                        name: `assets/fonts/[contenthash]].[ext]`,
                      },
                    },
                  ],
            },
        ]
    },
    devServer: {
        historyApiFallback: true,
        proxy:{
            "/": {
                target: "http://localhost:8081"
            }
        },
        contentBase: path.resolve(__dirname, `./build}`),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, CONFIG.sourceFolder, "index.html"),
            minify:false
        }),
        new MiniCssExtractPlugin({
            filename: "css/[contenthash].css"
        }),
        new CleanWebpackPlugin()
    ]
}