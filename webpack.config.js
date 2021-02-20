const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const filename = (ext) => (isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`);

module.exports = {

	context: path.resolve(__dirname, 'src'),
	mode: 'development',

	entry: [
		'@babel/polyfill',
		'./scripts/index.js',
	],

	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist'),
	},


	resolve: {
		extensions: ['.js'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},


	devtool: isDev ? 'source-map' : false,

    devServer: {
		compress: true,
		historyApiFallback: true,
		contentBase: path.resolve(__dirname, './dist'),
		open: true,
        hot: isDev,
        port: 3000,
      },

	plugins: [
		new HtmlWebpackPlugin({
			template: 'index.html',
		}),

		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: filename('css'),
		}),
	],
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
				],
			},

			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
			},
		],
	},
};
