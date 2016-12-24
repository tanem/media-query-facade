import path from 'path'
import webpack from 'webpack'

export default function makeWebpackConfig (buildType) {
  const baseConfig = {
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/
        }
      ]
    }
  }

  if (buildType === 'example') {
    return Object.assign(baseConfig, {
      entry: './example/main.js',
      externals: {},
      output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '../example')
      }
    })
  }

  if (buildType === 'umd') {
    return Object.assign(baseConfig, {
      entry: './src/media-query-facade.js',
      output: {
        filename: 'media-query-facade.js',
        library: 'media-query-facade',
        libraryTarget: 'umd',
        path: path.join(__dirname, '../dist')
      },
      plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        })
      ]
    })
  }

  if (buildType === 'umd:min') {
    return Object.assign(baseConfig, {
      entry: './src/media-query-facade.js',
      output: {
        filename: 'media-query-facade.min.js',
        library: 'media-query-facade',
        libraryTarget: 'umd',
        path: path.join(__dirname, '../dist')
      },
      plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            screw_ie8: true,
            warnings: false
          }
        })
      ]
    })
  }
}
