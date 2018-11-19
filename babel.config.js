module.exports = {
  "presets": [["@babel/preset-env", { 'modules': false }], "@babel/preset-typescript", "@babel/preset-react"],
  "plugins": [
    "babel-plugin-styled-components",
    "@babel/plugin-transform-typescript",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    '@babel/plugin-transform-react-inline-elements',
    '@babel/plugin-transform-react-constant-elements',
    '@babel/plugin-syntax-dynamic-import',
    "react-hot-loader/babel"
  ]
}