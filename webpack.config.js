const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Entry point to your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory for the bundled files
    filename: 'bundle.js', // Output file name
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // This will include .js and .jsx files
        exclude: /node_modules/, // Exclude files in node_modules
        use: {
          loader: 'babel-loader', // Use babel-loader to transpile JSX
        },
      },
      {
        test: /\.css$/, // This will include .css files
        use: ['style-loader', 'css-loader'], // Use style-loader and css-loader for CSS
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: 'images/',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these file extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Path to your HTML template
    }),
  ],
  devServer: {
    static: './dist', // Serve content from the dist folder
    hot: true, // Enable Hot Module Replacement (HMR)
  },
  mode: 'development', // Set the mode to development
};
