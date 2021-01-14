const path = require("path");

module.exports = (env, argv) => {
    let devMode = (argv.mode === 'development')
    let devtool = devMode ? "source-map" : "nosources-source-map"
    return ({
        devtool: devtool,
        entry : {
            main: './frontend/src/index.js',
        },
        output: {
            filename: "main.js",
            path    : path.resolve(__dirname, "./frontend/static/frontend")
        },
        module: {
            rules: [
                {
                    test   : /\.js$/,
                    exclude: /node_modules/,
                    use    : {
                        loader: 'babel-loader',
                    }
                }
            ],
        },
    })
};