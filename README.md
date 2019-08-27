# SnakeGame
 VueJS + Webpack + SVG + 贪吃蛇游戏
### 本地单机  
【webpack + VueJS + SVG 练习】
一个本地单机小游戏，使用SVG制作  
### 截图  
![screen-capture](https://images.cnblogs.com/cnblogs_com/Orcim/1508992/o_vue-snakegame-project.png)
### 加载运行
``` shell
# 运行
npm run game
```
``` shell
# 开发模式
npm run dev
```
### webpack 打包
``` shell
# build
npm run build
```
### about
**package.json**
```json
{
  "name": "snake-game",
  "version": "1.0.0",
  "description": "Snake Game in Vue & SVG",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server --open --hot --mode development",
    "build": "webpack --progress --hide-modules --mode production"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@babel/core": "^7.5.5",
    "@babel/preset-env": "^7.5.5",
    "@babel/preset-react": "^7.0.0",
    "babel-loader": "^8.0.6",
    "css-loader": "^3.2.0",
    "vue": "^2.6.10",
    "vue-loader": "^15.7.1",
    "vue-style-loader": "^4.1.2",
    "vue-template-compiler": "^2.6.10",
    "webpack": "^4.39.1",
    "webpack-dev-server": "^3.7.2"
  },
  "devDependencies": {
    "webpack-cli": "^3.3.6"
  }
}
```
### Others
 &nbsp; ![project-type](https://img.shields.io/badge/NodeJS-10.15.3-81b448.svg) &nbsp; ![project-type](https://img.shields.io/badge/Webpack-4.39.1-8ed6fb.svg)