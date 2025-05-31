const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, arguments) => {
    return {
        entry: {
            index: path.join(__dirname, 'src', 'index.js'),
        },
        devtool: Boolean(arguments.mode === 'development') ? 'inline-source-map' : false,
        watch: Boolean(arguments.mode === 'development'),
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].[hash]-runtime.min.js',
        },
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        module: {
            rules: [
                {
                    test: /\.(js)x?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            cacheDirectory: true,
                            presets: ['@babel/preset-react'],
                            plugins: [
                                ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
                                ['@babel/plugin-proposal-class-properties'],
                                ['@babel/transform-runtime'],
                            ],
                        },
                    },
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(png|jp(e*)g|gif|svg)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: path.join(__dirname, 'public', 'index.html'),
                chunks: ['index'],
            }),
        ],
    };
};
