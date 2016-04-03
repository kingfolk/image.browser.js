var path = require('path')
var webpack = require('webpack')
var config = {
    watch: true,
    entry: {
        // 'daemon': 'daemon',
        'daemonSpec': 'daemonSpec',
        'imageBufferSpec': 'imageBufferSpec',
        'imageBuffer': ['imageBuffer'],
    },
    output: {
        path: path.join(__dirname, 'public/'),
        filename: '[name].bundle.js'
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false }
        })
    ],
    resolve: {
        extensions: ["", ".js", ".jsx", '.es6'],
        root: [path.join(__dirname, '/src/'), path.join(__dirname, '/spec/')],
        modulesDirectories: ["node_modules"]
    }
}


module.exports = config;
