<template>
    <div class="game-box">
        <div class="game-container">
            <div class="game-settings">
                <div class="panel" v-if="nav[0]">
                    <div class="panel-title pixel-font"><span>PIXEL SNAKE</span></div>
                    <div class="panel-content" ref="buttons">
                        <button class="pixel-font">START</button>
                        <button class="pixel-font" page="1" @click="navto($event)">OPTIONS</button>
                        <button class="pixel-font" page="2" @click="navto($event)">RECORDS</button>
                        <button class="pixel-font" page="3" @click="navto($event)">ABOUT</button>
                    </div>
                </div>
                <div class="panel" v-if="nav[1]">
                    <div class="panel-title pixel-font"><span>OPTIONS</span></div>
                    <div class="panel-content" style="padding-top: 0; height: auto">
                        <div class="option back-btn pixel-font"><button page="0" @click="navto($event)">&lt;</button></div>
                        <game-options></game-options>
                    </div>
                </div>
                <div class="panel" v-if="nav[2]">
                    <div class="panel-title pixel-font"><span>RECORDS</span></div>
                    <div class="panel-content">
                        <div class="option back-btn pixel-font"><button page="0" @click="navto($event)">&lt;</button></div>
                    </div>
                </div>
                <div class="panel" v-if="nav[3]">
                    <div class="panel-title pixel-font"><span>ABOUT</span></div>
                    <div class="panel-content">
                        <div class="option back-btn pixel-font"><button page="0" @click="navto($event)">&lt;</button></div>
                    </div>
                </div>
            </div>
            <div class="score">
                <span>SCORE: <span v-text="score">0000</span></span>
            </div>
            <svg class="game-main" :width="width" :height="height">
                <ruler v-if="config.chessboard" :col="config.col" :row="config.row" :size="config.step" :tot="tot"></ruler>
                <g>
                    <!-- food -->
                    <path
                        fill="red"
                        :d="foodPath"
                    />
                    <!-- snake -->
                    <!-- fill -->
                    <path v-if="config.color !== 'none' && !config.cross"
                        :d="getPath(d2tod1_snake)"
                        :fill="config.color"
                    />
                    <!-- fill -->
                    <path v-if="config.cross"
                        :d="getPath(d2tod1_snake)"
                        stroke="black"
                        stroke-width="2"
                        :fill="config.color"
                    />
                    <!-- outline -->
                    <path v-if="!config.cross"
                        :d="drawPath(snakeMap)"
                        :stroke="config.borderColor"
                        stroke-linecap="round"
                        :stroke-width="config.borderWidth"
                    />
                </g>
            </svg>
            <game-controller v-show="config.controller"></game-controller>
        </div>
    </div>
</template>
<script>
var that = null;
let tabIdx = 0;
import gameOptions from "./game-options.vue";
import gameController from "./game-controller.vue";
import ruler from "./ruler.vue";
// import { drawPath, demo, demoFn } from "./core";
import core from "./core";
let drawPath = core.drawPath;
let demo = core.demo;
console.log(demo)
let demoFn = core.demoFn;
export default {
    name: "gameBox",
    components: { gameOptions , ruler , gameController },
    watch: {
        speed () {
            that.rePlayDemo();
        }
    },
    computed: {
        nav () {
            let a = [false, false, false, false];
            a.splice(that.act_page, 1, true);
            return a;
        },
        width () {
            return that.config.col*that.config.step;
        },
        height () {
            return that.config.row*that.config.step;
        },
        tot () {
            return that.config.col*that.config.row;
        },
        foodPath () {
            if (!that.food.length) return 'M0 0z';
            return `M${that.food[0]*that.config.step}\ ${that.food[1]*that.config.step}h${that.config.step}v${that.config.step}h${-that.config.step}z`
        },
        d2tod1_snake () { // 方块化为 4 个点 （平面转点）
            return that.snakeMap.map(item => {
                let x = item[0], y = item[1];
                return [
                    item,
                    [ x+1 , y ],
                    [ x+1 , y+1 ],
                    [ x , y+1 ],
                ]
            })
        },
        score () {
            let len = (that.tot+'').length;
            let sc = that.score_count;
            return (Array(len).join(0) + sc).slice(-len);
        }
    },
    methods: {
        // 依赖 localStorage
        // saveOpts () {
        //     let opts = localStorage.getItem("opts");
        //     localStorage.setItem("opts", JSON.stringify(that.$refs["opts"].groups));
        //     console.log(JSON.parse(localStorage.getItem("opts")));
        //     // let configs = localStorage.getItem("configs");
        //     // localStorage.setItem("configs", JSON.stringify(that.$refs["opts"].groups));
        // },
        rePlayDemo () {
            clearInterval(that.gameTimer);
            demo = demoFn(that.config.col, that.config.row)
            that.snakeMap = demo.snakeMap;
            that.food = demo.food[0];
            that.events = that.controls["left"];
            that.config.demoTick = {snake: 0, food: 0};
            window.timer = that.gameTimer = setInterval(
                that.startGameNow,
                that.config.speed
            )
        },
        navto (e) {
            let tar = e.target;
            that.act_page = tar.getAttribute("page")*1;
            that.gameOnFrontPage = !that.act_page;
            !that.act_page && (tabIdx = 0);
        },
        drawPath (arr) {
            return drawPath(arr, that.config.step);
        },
        getPath (arr) { // 处理 d2tod1 并返回 path d
            if (!arr.length) return 'M0 0z';
            return arr.map(item => {
                return "M" + item.map(where => {
                    return `${where[0]*that.config.step}\ ${where[1]*that.config.step}`
                }).join("L")
            }).join("Z") + "Z";
        },
        random(Min, Max){
            var Range = Max - Min;
            var Rand = Math.random();
            var num = Min + Math.round(Rand * Range);
            return num;
        },
        setFood () { // 投放食物
            if (that.config.isDemo) return;
            let newFood = [0,0];
            let emp = [];
            var food = function () {
                let x = that.random(0, that.config.col-1), y = that.random(0, that.config.row-1);
                newFood = [x,y];
                if (emp.indexOf(JSON.stringify) === -1) emp.push(JSON.stringify(newFood));
                for (let i=0, l=that.snakeMap.length; i<l; i++) {
                    if (newFood[0] === that.snakeMap[i][0] && newFood[1] === that.snakeMap[i][1]) food();
                    if (emp.length >= that.tot) {console.log("game_end!"); that.gameEnd = true; break;}
                }
            };
            food();
            that.gameEnd ? clearInterval(that.gameTimer) : (that.food = newFood);
        },
        startGameNow () {
            that.snakeMap.unshift([that.snakeMap[0][0], that.snakeMap[0][1]]);
            if (that.config.isDemo) {
                that.config.demoTick.snake === demo.control.length && (that.config.demoTick.snake = 0);
                // that.config.demoTick.snake === demo.control.length && that.rePlayDemo();
                // // that.config.demoTick.food === demo.food.length-1 && (that.config.demoTick.food = 0);
                var c = demo.control[that.config.demoTick.snake];
                let head = that.snakeMap[0];
                if (c && c.point[0] === head[0] && c.point[1] === head[1]) {
                    // console.log(c)
                    that.events = that.controls[c.event];
                    that.config.demoTick.snake++;
                    // loops
                }
                if (head[0] === that.food[0] && head[1] === that.food[1]) {
                    that.config.demoTick.food++;
                    that.food = demo.food[that.config.demoTick.food] || [-1,-1];
                    // that.food = demo.food[that.config.demoTick.food];
                }
            }
            if (that.events.up) {
                that.snakeMap[0][1]--;
                if (that.snakeMap[0][1] < 0) {
                    that.snakeMap[0][1] = that.config.row-1;
                }
            }
            if (that.events.down) {
                that.snakeMap[0][1]++;
                if (that.snakeMap[0][1] >= that.config.row) {
                    that.snakeMap[0][1] = 0;
                }
            }
            if (that.events.left) {
                that.snakeMap[0][0]--;
                if (that.snakeMap[0][0] < 0) {
                    that.snakeMap[0][0] = that.config.col-1;
                }
            }
            if (that.events.right) {
                that.snakeMap[0][0]++;
                if (that.snakeMap[0][0] >= that.config.col) {
                    that.snakeMap[0][0] = 0;
                }
            }
            // 如果头接触边界，则关闭定时器
            // if (
            //     that.snakeMap[0][0]*that.config.step >= that.config.height || that.snakeMap[0][0] < 0 || 
            //     that.snakeMap[0][1]*that.config.step >= that.config.width || that.snakeMap[0][1] < 0
            // ) {
            //     clearInterval(that.gameTimer);
            // }
            // 如果碰到食物
            if (
                that.snakeMap[0][0] === that.food[0] &&
                that.snakeMap[0][1] === that.food[1]
            ) {
                that.score_count++;
                let l = that.snakeMap.length-1;
                that.snakeMap.push([that.snakeMap[l][0], that.snakeMap[l][1]]);
                that.setFood();
                // console.log("crossed!")
            }
            that.snakeMap.pop()
        }
    },
    data () {
        return {
            speed: false,
            config: {
                // width: 310,
                // height: 350,
                col: 39,
                row: 39,
                speed: 100,
                isDemo: true,
                demoTick: {
                    snake: 0,
                    food: 0
                },
                step: 18,
                color: "none",
                borderColor: "white",
                borderWidth: 2,
                chessboard: false,
                cross: false,
                controller: false
            },
            act_page: 0,
            x: 0,
            y: 0,
            gameTimer: null,
            demoTimer: null,
            snakeMap: [],
            events: {
                up: false,
                down: false,
                left: true,
                right: false
            },
            food: [],
            score_count: 0,
            gameEnd: false,
            gameOnFrontPage: true,
            controls: {
                "up": {
                    up: true,
                    down: false,
                    left: false,
                    right: false
                },
                "down": {
                    up: false,
                    down: true,
                    left: false,
                    right: false
                },
                "left": {
                    up: false,
                    down: false,
                    left: true,
                    right: false
                },
                "right": {
                    up: false,
                    down: false,
                    left: false,
                    right: true
                }
            }
        }
    },
    created () {
        that = this;
        if (that.config.isDemo) {
            that.snakeMap = demo.snakeMap;
            that.config.col = demo.col;
            that.config.row = demo.row;
            that.food = demo.food[0];
        }else{
            // 游戏本体放在正中央
            that.setFood();
            that.snakeMap = [[Math.round(that.config.col/2), Math.round(that.config.row/2)], [Math.round(that.config.col/2), Math.round(that.config.row/2)+1]];
        }
        window.timer = that.gameTimer = setInterval(
            that.startGameNow, 
            that.config.isDemo ? demo.speed : that.config.speed
        )
        console.log(JSON.parse(localStorage.getItem("configs")))
        let config = localStorage.getItem("configs");
        if (config) {
            let cfg = JSON.parse(config);
            for (let key in cfg) {
                that.config[key] = cfg[key]
            }
        }
        // that.snakeMap = [[35,42],[35,43],[35,44]];
        // that.food = [0,0];
        // that.drawPath(that.snakeMap)
        // that.setFood();
        // clearInterval(that.gameTimer)
    },
    mounted () {
        console.log(that.$refs);
        document.onkeydown = function (e) {
            switch (e.keyCode) {
                case 38: case 87:// ↑ W
                    if (that.config.isDemo) return;
                    if (that.events.down || that.config.isDemo) return;
                    that.events = that.controls["up"];
                    console.log("up", that.snakeMap[0]);
                    break;
                case 40: case 83:// ↓ S
                    if (that.config.isDemo) return;
                    if (that.events.up) return;
                    that.events = that.controls["down"];
                    break;
                case 37: case 65:// ← A
                    if (that.config.isDemo) return;
                    if (that.events.right) return;
                    that.events = that.controls["left"];
                    break;
                case 39: case 68: // → D
                    if (that.config.isDemo) return;
                    if (that.events.left) return;
                    that.events = that.controls["right"];
                    break;
                case 32: // spacebar
                    clearInterval(that.gameTimer)
                    break;
                case 9: // tab
                    if (that.gameOnFrontPage) {
                        let buttons = that.$refs["buttons"].querySelectorAll("button");
                        buttons[tabIdx%buttons.length].focus();
                        tabIdx++;
                        return false; // 阻止默认 tab 事件
                    }
                    break;
                case 27: // escape
                    if (that.act_page !== 0) {
                        that.act_page = 0;
                    }
                    break;
                default: break;
            };
        };
    }
};
</script>
<style>
@import "./main.css";
</style>