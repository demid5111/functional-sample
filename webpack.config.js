module.exports = {
    entry: "./src/main",
    output: {
        filename: "app.js"
    },
    module: {
        loaders: [
            {
                test: /.ts$/,
                loaders: [
                    "ts-loader",
                    "lodash-ts-imports-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
};
