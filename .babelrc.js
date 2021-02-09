const presets = [
  [
    "@babel/preset-env",
    {
      "targets": {
        "node": "14"
      }
    }
  ], "@babel/preset-react"]

const plugins = [
  "@babel/plugin-transform-async-to-generator",
  [
    "babel-plugin-transform-imports",
    {
      "@material-ui/core": {
        // Use "transform: '@material-ui/core/${member}'," if your bundler does not support ES modules
        "transform": "@material-ui/core/esm/${member}",
        "preventFullImport": true
      },
      "@material-ui/icons": {
        // Use "transform: '@material-ui/icons/${member}'," if your bundler does not support ES modules
        "transform": "@material-ui/icons/esm/${member}",
        "preventFullImport": true
      }
    }
  ]
];

module.exports = {presets, plugins};