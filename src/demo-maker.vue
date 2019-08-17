<template>
    <div class="game-box">
        <div class="game-container">
            <div class="score">
                <span>SCORE: <span v-text="score">0000</span></span>
            </div>
            <svg class="game-main" :width="width" :height="height">
                <ruler></ruler>
                <g>
                    <!-- food -->
                    <path
                        fill="red"
                        :d="foodPath"
                    />
                    <!-- snake -->
                    <!-- fill -->
                    <!-- <path 
                        :d="getPath(d2tod1_snake)"
                        :fill="config.color"
                    /> -->
                    <!-- outline -->
                    <path 
                        :d="drawPath(snakeMap)"
                        :stroke="config.borderColor"
                        stroke-linecap="round"
                        stroke-width="2"
                    />
                </g>
            </svg>
        </div>
    </div>
</template>
<script>
var that = null;
window.demo = {
    snakeMap: [],
    speed: 0,
    control: [],
    food: []
};
let tst_start = new Date().valueOf();
import ruler from "./ruler.vue";
import { drawPath } from "./core";
export default {
    name: "gameBox",
    components: { ruler },
    computed: {
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
            // console.log(new Date().valueOf()-tst_start, "food", that.food);
            that.gameEnd ? clearInterval(that.gameTimer) : (that.food = newFood);
            window.demo.food.push(that.food);
            console.log(that.food);
        },
        startGameNow () {
            that.snakeMap.unshift([that.snakeMap[0][0], that.snakeMap[0][1]]);
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
            config: {
                // width: 310,
                // height: 350,
                col: 35,
                row: 35,
                speed: 100,
                step: 15,
                color: "white",
                borderColor: "black"
            },
            x: 0,
            y: 0,
            gameTimer: null,
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
            gameOnSettingsPage: true,
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
        // 游戏本体放在正中央
        that.snakeMap = [[Math.round(that.config.col/2), Math.round(that.config.row/2)], [Math.round(that.config.col/2), Math.round(that.config.row/2)+1]];
        console.log(that.snakeMap)
        window.timer = that.gameTimer = setInterval(
            that.startGameNow, that.config.speed
        );
        window.demo.snakeMap = JSON.parse(JSON.stringify(that.snakeMap));
        window.demo.speed = that.config.speed;
        window.demo.col = that.config.col;
        window.demo.row = that.config.row;
        // that.snakeMap = [[35,42],[35,43],[35,44]];
        // that.food = [0,0];
        // that.drawPath(that.snakeMap)
        that.setFood();
    },
    mounted () {
        console.log(that.$refs);
        document.onkeydown = function (e) {
            switch (e.keyCode) {
                case 38: // ↑
                    that.events = that.controls["up"];
                    window.demo.control.push({point: that.snakeMap[0], event: "up"});
                    break;
                case 40: // ↓  
                    if (that.events.up) return;
                    that.events = that.controls["down"];
                    window.demo.control.push({point: that.snakeMap[0], event: "down"});
                    break;
                case 37: // ← 
                    if (that.events.right) return;
                    that.events = that.controls["left"];
                    window.demo.control.push({point: that.snakeMap[0], event: "left"});
                    break;
                case 39: // →
                    if (that.events.left) return;
                    that.events = that.controls["right"];
                    window.demo.control.push({point: that.snakeMap[0], event: "right"});
                    break;
                case 32: // spacebar
                    clearInterval(that.gameTimer)
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