const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    output: {
        filename: 'ssr.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['ignore-loader']
              },
        ]
    }
})