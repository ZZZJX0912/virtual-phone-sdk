module.exports = {

  "presets": [
    [
      "@babel/preset-env",  //编译ES6+语法
      {
        "useBuiltIns": "entry" //此选项配置如何@babel/preset-env处理 polyfill
      }
    ],
    "@babel/preset-typescript"
  ]
}
