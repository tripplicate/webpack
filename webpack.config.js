let webpack = require('webpack') 
    path = require("path"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin');

let _alias = require("./webpack/alias"),
    _extensions = require("./webpack/extensions"),
    constants = require("./webpack/constants");

const {entryFilename, outputFilename, outputFolder, sourceFolder} = constants;

let config =  {
    mode: process.env.WEBPACK_MODE,
    entry: path.resolve(__dirname,`${sourceFolder}/${entryFilename}` ),
    output: {
        filename: "js/" + outputFilename,
        path: path.resolve(__dirname, outputFolder),
        publicPath: '/',
    },
    resolve: {
        alias: _alias,
        extensions: _extensions
    },
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: ["@babel/plugin-proposal-class-properties"]
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
                                process.env.WEBPACK_MODE === "production" === "production" ? ["cssnano"] : ""
                            ]
                        }
                    }
                  },
                    "sass-loader"]
              },
              {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[contenthash][ext][query]'
                }
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/,
                type: 'asset/inline',
                generator: {
                    filename: 'assets/fonts/[contenthash][ext][query]'
                }
            },
            {
                test: /\.svg$/,
                type: 'asset/inline',
                generator: {
                    filename: 'assets/svg/[contenthash][ext][query]'
                }
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
        contentBase: path.resolve(__dirname, `./${outputFolder}`),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, `${sourceFolder}/index.html`),
            minify: false
        }),
        new MiniCssExtractPlugin({
            filename: "css/[contenthash].css"
        }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ]
}
module.exports = config;