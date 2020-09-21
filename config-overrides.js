const { override, fixBabelImports, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css'
  }),
  addWebpackAlias({
    'src': path.resolve(__dirname, 'src')
  })
)
