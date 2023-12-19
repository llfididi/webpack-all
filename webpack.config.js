const path = require("path");
const webpack = require("webpack");

// require('html-loader!htmlFile.html')

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

class MyPlugin {
  apply (compiler) {
    console.log('MyPlugin 启动')

    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        console.log(name)
        console.log(compilation.assets[name].source())
        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source()
          const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length
          }
        }
      }
    })
  }
}

module.exports = {
  // 这个属性有三种取值，分别是 production、development 和 none。
  // 1. 生产模式下，Webpack 会自动优化打包结果；
  // 2. 开发模式下，Webpack 会自动优化打包速度，添加一些调试过程中的辅助；
  // 3. None 模式下，Webpack 就是运行最原始的打包，不做任何额外处理；
  mode: "none",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    publicPath: "",
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
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
      // meta: {
      //   viewport: 'width=device-width'
      // },

      meta: {
        viewport: "width=device-width, initial-scale=15, shrink-to-fit=no",
      },
      scriptLoading: "blocking",
      template: "./src/index.html",
    }),

    // new HtmlWebpackPlugin({
    //   filename: 'gooters.html',
    //   template: './src/footer.html'
    // }),
    new CopyWebpackPlugin({ patterns: [{ from: "public" }] }),
    new MyPlugin()
  ],
};
