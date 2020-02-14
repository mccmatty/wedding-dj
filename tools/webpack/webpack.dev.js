const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        host: '0.0.0.0',
        index: '',
        publicPath: '/build/',
        proxy: {
            '/': {
                target: 'http://0.0.0.0:3000',
                bypass: (req, res, proxyOptions) => {
                    if (req.url ===`/build/app.bundle.js`) {
                        return '/build/app.bundle.js';
                    }

                    return null;
                }
            }
        }
    },
    devtool: 'eval-source-map'
});