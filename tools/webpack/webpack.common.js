const path = require('path');
const appRoot = require('app-root-path').toString();

const SRC_DIR = path.join(appRoot, 'src/client');
const BUILD_DIR = path.join(appRoot, 'build');

module.exports = {
    entry: {
        app: path.join(SRC_DIR, 'index.js')
    },
    output: {
        filename: '[name].bundle.js',
        path: BUILD_DIR
    },
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          },
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.less$/i,
            use: ['style-loader', 'css-loader', 'less-loader']
          },
          {
            test: /\.svg$/,
            loader: 'svg-inline-loader'
          }
        ]
    }
};