const onwarn = ()=>{}

export default{
  //要打包的文件源路径（应用程序的主要入口点）
  input: "src/main.js",
  //文件输出配置
  output:{
    file:"dist/bundle.cjs.js", //打包后生产的文件位置及文件名
    format:"cjs", //文件的输出格式（CommonJS规范，是Node.js的官方模块化规范）
    name:'virtual-phone-sdk', //包得全局变量名称
    sourcemap:true, //生成bundle.map.js文件，方便调试

  },
  //插件
  plugins:[
    babel([{
      exclude:'node_modules/**' //排除node_modules文件夹下，只编译我们的源代码
    }])
  ],
  onwarn
}
