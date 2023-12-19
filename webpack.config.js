const path = require("path");
const webpack = require("webpack");

// require('html-loader!htmlFile.html')

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const TerserWebpackPlugin = require('terser-webpack-plugin')
class MyPlugin {
  apply(compiler) {
    console.log("MyPlugin 启动");

    compiler.hooks.emit.tap("MyPlugin", (compilation) => {
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        console.log(name + "@@@@@@@@");
        // console.log(compilation.assets[name].source())
        if (name.endsWith(".js")) {
          const contents = compilation.assets[name].source();
          const withoutComments = contents.replace(/\/\*\*+\*\//g, "");
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length,
          };
        }
      }
    });
  }
}

const allModes = [
  "eval",
  "cheap-eval-source-map",
  "cheap-module-eval-source-map",
  "eval-source-map",
  "cheap-source-map",
  "cheap-module-source-map",
  "inline-cheap-source-map",
  "inline-cheap-module-source-map",
  "source-map",
  "inline-source-map",
  "hidden-source-map",
  "nosources-source-map",
];

module.exports = {
  // 这个属性有三种取值，分别是 production、development 和 none。
  // 1. 生产模式下，Webpack 会自动优化打包结果；
  // 2. 开发模式下，Webpack 会自动优化打包速度，添加一些调试过程中的辅助；
  // 3. None 模式下，Webpack 就是运行最原始的打包，不做任何额外处理；
  mode: "none",
  entry: {index:"./src/index.js",heading:"./src/heading.js"},
  output: {
    filename: "[name]-[contenthash:8].bundle.js",
    path: path.join(__dirname, "dist"),
    publicPath: "",
  },
  devtool: "source-map",

  optimization: {
    // 模块只导出被使用的成员 tree shaking
    usedExports: true,
    // 尽可能合并每一个模块到一个函数中
    concatenateModules: true,
    // 压缩输出结果
    // minimize: true
    sideEffects: true,

    splitChunks: {
      // 自动提取所有公共模块到单独 bundle
      chunks: 'all'
    },
    minimizer: [
      //内置打包 因为在这里minimizer 默认不压缩js了
      new TerserWebpackPlugin(),
      new OptimizeCssAssetsWebpackPlugin()
    ]
  },

  devServer: {
    // contentBase: './public',
    proxy: {
      "/api": {
        // http://localhost:8080/api/users -> https://api.github.com/api/users
        target: "https://api.github.com",
        // http://localhost:8080/api/users -> https://api.github.com/users
        pathRewrite: {
          "^/api": "",
        },
        // 不能使用 localhost:8080 作为请求 GitHub 的主机名
        changeOrigin: true,
      },
    },
    hot: true,
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              // 如果 Babel 加载模块时已经转换了 ESM，则会导致 Tree Shaking 失效
              // ['@babel/preset-env', { modules: 'commonjs' }]
              // ['@babel/preset-env', { modules: false }]
              // 也可以使用默认配置，也就是 auto，这样 babel-loader 会自动关闭 ESM 转换
              ['@babel/preset-env', { modules: 'auto' }]
            ]
          },
        },
      },
      {
        test: /.css$/,
        // use: ["style-loader", "css-loader"],
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      //   {
      //     test: /.png$/,
      //     use: 'file-loader'
      //   },

      // {
      //   test: /\.html$/i,
      //     loader: 'html-loader',
      //     options:{
      //       sources: {
      //         list:[
      //           {
      //             tag: "a",
      //             attribute: "href",
      //             type: "src",
      //           },
      //           {
      //             tag: "img",
      //             attribute: "src",
      //             type: "src",
      //           },
      //           // {
      //           //   tag:"script",
      //           //   attribute: "src",
      //           //   type: "src",

      //           // }

      //         ]
      //       }
      //     }
      // },

      // {
      //   test: /.png$/,
      //   use: {
      //     loader: "url-loader",
      //     options: {
      //       limit: 10 *1024, // 10 KB 小文件使用base64 大文件使用url,
      //       name:'[hash:10].[ext]'
      //     },
      //   },
      // },

      {
        test: /\.png/,
        type: "asset/resource",
        generator: {
          // 重新生成文件夹
          // filename: 'img/[name].[hash:7].[ext]',
        },
      },

      {
        test: /.md$/,
        use: ["html-loader", "./markdown-loader"],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      title: "Webpack Plugin Sample",
      meta: {
        viewport: "width=device-width, initial-scale=15, shrink-to-fit=no",
      },
      scriptLoading: "blocking",
      template: "./src/index.html",
      chunks:["index"]
    }),

    new HtmlWebpackPlugin({
      title: "2",
      meta: {
        viewport: "width=device-width, initial-scale=15, shrink-to-fit=no",
      },
      scriptLoading: "blocking",
      template: "./src/album.html",
      chunks:["album"],
      filename:'album.html'

    }),

    // new HtmlWebpackPlugin({
    //   filename: 'gooters.html',
    //   template: './src/footer.html'
    // }),
    new CopyWebpackPlugin({ patterns: [{ from: "public" }] }),
    new MyPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      // 值要求的是一个代码片段
      API_BASE_URL: JSON.stringify('https://api.example.com')
    }),

    // 提取css
    new MiniCssExtractPlugin({
      filename:'[name]-[contenthash:8].bundle.css'
    }),

    // 在 minimizer
    // new OptimizeCssAssetsWebpackPlugin()

  ],
};

















// module.exports = (env, argv) => {
//   const config = {
//     mode: 'development',
//     entry: './src/main.js',
//     output: {
//       filename: 'js/bundle.js'
//     },
//     devtool: 'cheap-eval-module-source-map',
//     devServer: {
//       hot: true,
//       contentBase: 'public'
//     },
//     module: {
//       rules: [
//         {
//           test: /\.css$/,
//           use: [
//             'style-loader',
//             'css-loader'
//           ]
//         },
//         {
//           test: /\.(png|jpe?g|gif)$/,
//           use: {
//             loader: 'file-loader',
//             options: {
//               outputPath: 'img',
//               name: '[name].[ext]'
//             }
//           }
//         }
//       ]
//     },
//     plugins: [
//       new HtmlWebpackPlugin({
//         title: 'Webpack Tutorial',
//         template: './src/index.html'
//       }),
//       new webpack.HotModuleReplacementPlugin()
//     ]
//   }

//   if (env === 'production') {
//     config.mode = 'production'
//     config.devtool = false
//     config.plugins = [
//       ...config.plugins,
//       new CleanWebpackPlugin(),
//       new CopyWebpackPlugin(['public'])
//     ]
//   }

//   return config
// }
