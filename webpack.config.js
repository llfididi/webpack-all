const path = require("path");

module.exports = {
  // 这个属性有三种取值，分别是 production、development 和 none。
  // 1. 生产模式下，Webpack 会自动优化打包结果；
  // 2. 开发模式下，Webpack 会自动优化打包速度，添加一些调试过程中的辅助；
  // 3. None 模式下，Webpack 就是运行最原始的打包，不做任何额外处理；
  mode: "none",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    // path: path.join(__dirname, 'output'),
    publicPath: "dist/",
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


      {
        test: /\.html$/i,
          loader: 'html-loader',
          options:{
            sources: {
              list:[
                {
                  tag: "a",
                  attribute: "href",
                  type: "src",
                },
                {
                  tag: "img",
                  attribute: "src",
                  type: "src",
                },

              ]
            }
          }
 
      },
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
        type: 'asset/resource',
        generator: {
          // 重新生成文件夹

          // filename: 'img/[name].[hash:7].[ext]',
        },
      },

      {
        test: /.md$/,
        use: [
          'html-loader',
          './markdown-loader'
        ]
      }


      
    ],
  },
};
