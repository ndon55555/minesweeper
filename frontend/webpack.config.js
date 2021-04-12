const CopyPlugin = require("copy-webpack-plugin")

module.exports = (env) => {
    if (env.minesweeper_static_folder === undefined) {
        throw "Need to set 'minesweeper_static_folder' variable"
    }

    return {
        entry: "./src/index.ts",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: "./index.html",
                        to: "index.html"
                    },
                    {
                        from: "./css/",
                        to: "css/"
                    },
                    {
                        from: "./favicon.ico",
                        to: "favicon.ico"
                    }
                ]
            })
        ],
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
        output: {
            filename: "js/index.js",
            path: env.minesweeper_static_folder,
        },
        devtool: "source-map"
    }
}