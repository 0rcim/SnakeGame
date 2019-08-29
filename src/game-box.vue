<template>
    <div class="game-box">
        <div class="game-container">
            <div class="game-settings" v-show="cover">
                <div class="panel" v-if="nav[0]">
                    <div class="panel-title pixel-font"><span>PIXEL SNAKE</span></div>
                    <div class="panel-content" ref="buttons">
                        <button class="pixel-font" @click="game()" @touchstart="game()">START</button>
                        <button class="pixel-font" page="1" @click="navto($event)" @touchstart="navto($event)">OPTIONS</button>
                        <button class="pixel-font" page="2" @click="navto($event)" @touchstart="navto($event)">RECORDS</button>
                        <button class="pixel-font" page="3" @click="navto($event)" @touchstart="navto($event)">ABOUT</button>
                    </div>
                </div>
                <div class="panel" v-show="nav[1]">
                    <div class="panel-title pixel-font"><span>OPTIONS</span></div>
                    <div class="panel-content" style="padding-top: 0; height: auto">
                        <div class="option back-btn pixel-font"><button page="0" @click="navto($event)" @touchstart="navto($event)">&lt;</button></div>
                        <game-options ref="game-options"></game-options>
                    </div>
                </div>
                <div class="panel" v-if="nav[2]" style="height: auto;">
                    <div class="panel-title pixel-font"><span>RECORDS</span></div>
                    <div class="panel-content" style="justify-content:flex-start;">
                        <div class="option back-btn pixel-font"><button page="0" @click="navto($event)" @touchstart="navto($event)">&lt;</button></div>
                        <game-records></game-records>
                    </div>
                </div>
                <div class="panel" v-if="nav[3]">
                    <div class="panel-title pixel-font"><span>ABOUT</span></div>
                    <div class="panel-content">
                        <div class="option back-btn pixel-font"><button page="0" @click="navto($event)" @touchstart="navto($event)">&lt;</button></div>
                        <game-about></game-about>
                    </div>
                </div>
            </div>
            <div class="game-settings break" v-if="brk">
                <div class="panel">
                    <div class="panel-content" ref="buttons">
                        <button class="pixel-font" @click="resume" @touchstart="resume">RESUME</button>
                        <button class="pixel-font" @click="retry" @touchstart="retry">RETRY</button>
                        <button class="pixel-font" @click="home" @touchstart="home">HOME</button>
                    </div>
                </div>
            </div>
            <div class="game-settings over" v-if="ovr">
                <div class="panel">
                    <div class="panel-title pixel-font"><span>Game Over</span></div>
                    <div class="panel-content" ref="buttons">
                        <div class="option back-btn pixel-font"><button @click="ovr_esc" @touchstart="ovr_esc">&lt;</button></div>
                        <p class="pixel-font">Score: {{ score_count }}, Time: {{ms2MMssms(gameOverTimeStamp - gameStartTimeStamp)}}</p>
                        <p class="pixel-font" v-if="isNewRecord">New Record!</p>
                        <p v-if="isNewRecord">
                            <input class="inputBox pixel-font" type="text" placeholder="your name here" maxlength="20" @focus="controllerShouldReflect = false; $event.target.focus();" @blur="controllerShouldReflect = true" v-model="player_name">
                        </p>
                        <button class="pixel-font" @click="ovr_retry" @touchstart="ovr_retry">RETRY</button>
                    </div>
                </div>
            </div>
            <div class="score">
                <span>SCORE: <span v-text="score"></span></span>
            </div>
            <div class="score" style="right: 1rem; left: auto;">
                <span>RECORD: <span v-text="record"></span></span>
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
import gameRecords from "./game-records.vue";
import gameAbout from "./game-about.vue";
import gameController from "./game-controller.vue";
import ruler from "./ruler.vue";
import core from "./core";
let drawPath = core.drawPath;
let demo = core.demo;
let demoFn = core.demoFn;
export default {
    name: "gameBox",
    components: { gameOptions , gameRecords, gameAbout , ruler , gameController },
    watch: {
        speed () {
            that.rePlayDemo();
        }
    },
    computed: {
        strSnakeMapArr () {
            let cp = JSON.parse(JSON.stringify(that.snakeMap));
            cp.splice(0, 3);
            return cp.map(item => {
                return JSON.stringify(item)
            });
        },
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
        },
        record () {
            let rd = localStorage.getItem("records") ? JSON.parse(localStorage.getItem("records")) : [["", 0, 0, "-"]];
            return that.fx(Math.max(rd[0][1], that.score_count), (that.tot+'').length);
        }
    },
    methods: {
        fx (num, len) {
            return (Array(len).join(0) + num).slice(-len);
        },
        ms2MMssms (n) {
            let t = Math.round(n/100)*100;
            let min = this.fx(Math.floor(t/60/1000), 2), sec = this.fx(Math.floor(t/1000)%60, 2), ms = t%1000/100;
            return `${min}'${sec}"${ms}`;
        },
        game () {
            clearInterval(that.gameTimer);
            that.config.isDemo = false;
            that.cover = false;
            that.setFood();
            that.snakeMap = [[Math.round(that.config.col/2), Math.round(that.config.row/2)], [Math.round(that.config.col/2), Math.round(that.config.row/2)+1]];
            that.events = that.controls["up"];
            that.config.demoTick = {snake: 0, food: 0};
            that.score_count = 0;
            setTimeout(() => {
                that.gameStartTimeStamp = new Date().valueOf();
                window.timer = that.gameTimer = setInterval(
                    that.startGameNow,
                    that.config.speed
                );
            }, 1500)
        },
        resume () {
            that.brk = false;
            setTimeout(() => {
                window.timer = that.gameTimer = setInterval(
                    that.startGameNow,
                    that.config.speed
                );
            }, 1500)
        },
        retry () {
            that.score_count = 0;
            that.brk = false;
            that.ovr = false;
            that.game();
        },
        home () {
            that.brk = false;
            that.ovr = false;
            that.config.isDemo = true;
            that.cover = true;
            that.rePlayDemo();
        },
        addRecord () {
            let rds = localStorage.getItem("records") ? JSON.parse(localStorage.getItem("records")) : [];
            let cfgs = that.$refs["game-options"].getOptLabels();
            let rc_item = [
                that.player_name,
                that.score_count,
                that.gameOverTimeStamp - that.gameStartTimeStamp,
                [cfgs["DISPLAY"]["Speed"], cfgs["DISPLAY"]["Viewport"], cfgs["BASIC"]["Cell"]].join(",\ ")
            ];
            rds.push(rc_item);
            rds.sort((s1, s2) => {
                return s2[1] - s1[1];
            });
            rds.splice(10);
            localStorage.setItem("records", JSON.stringify(rds));
            that.isNewRecord = false;
        },
        ovr_esc () {
            that.addRecord();
            that.home();
        },
        ovr_retry () {
            that.addRecord();
            that.retry();
        },
        wasted () { // 游戏结束
            clearInterval(that.gameTimer);
            that.gameOverTimeStamp = new Date().valueOf();
            // 判断刷新记录
            let rds = localStorage.getItem("records") ? JSON.parse(localStorage.getItem("records")) : [];
            if (rds.length === 10) {
                rds.some((sc, idx) => {
                    return that.score_count > sc[1];
                }) && (that.isNewRecord = true);
            }else{
                that.isNewRecord = true;
            }
            that.ovr = true;
        },
        rePlayDemo () {
            that.score_count = 0;
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
                    if (emp.length >= that.tot) {that.gameEnd = true; break;}
                }
            };
            food();
            that.gameEnd ? clearInterval(that.gameTimer) : (that.food = newFood);
        },
        startGameNow () {
            that.snakeMap.unshift([that.snakeMap[0][0], that.snakeMap[0][1]]);
            if (that.config.isDemo) {
                that.config.demoTick.snake === demo.control.length && (that.config.demoTick.snake = 0);
                var c = demo.control[that.config.demoTick.snake];
                let head = that.snakeMap[0];
                if (c && c.point[0] === head[0] && c.point[1] === head[1]) {
                    that.events = that.controls[c.event];
                    that.config.demoTick.snake++;
                }
                if (head[0] === that.food[0] && head[1] === that.food[1]) {
                    that.config.demoTick.food++;
                    that.food = demo.food[that.config.demoTick.food] || [-1,-1];
                }
            }
            if (that.events.up) {
                that.snakeMap[0][1]--;
            }
            if (that.events.down) {
                that.snakeMap[0][1]++;
            }
            if (that.events.left) {
                that.snakeMap[0][0]--;
            }
            if (that.events.right) {
                that.snakeMap[0][0]++;
            }
            if (
                that.snakeMap[0][0] === that.food[0] &&
                that.snakeMap[0][1] === that.food[1]
            ) {
                that.score_count++;
                let l = that.snakeMap.length-1;
                that.snakeMap.push([that.snakeMap[l][0], that.snakeMap[l][1]]);
                that.setFood();
            }
            that.snakeMap.pop();
            let hd = that.snakeMap[0];
            if (
                hd[0] === that.config.col || hd[0] === -1 ||
                hd[1] === that.config.row || hd[1] === -1 
                || (that.strSnakeMapArr.indexOf(JSON.stringify(hd))) !== -1 // 撞到了自己
            ) {
                that.wasted(); // GAMEOVER！
            }
        }
    },
    data () {
        return {
            isNewRecord: false,
            gameStartTimeStamp: -1,
            gameOverTimeStamp: -1,
            speed: false,
            brk: false, // 控制游戏暂停时的对话框显示
            ovr: false, // 控制游戏结束时的对话框显示
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
            controllerShouldReflect: true,
            act_page: 0,
            cover: true,
            player_name: "",
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
        let config = localStorage.getItem("configs");
        if (config) {
            let cfg = JSON.parse(config);
            for (let key in cfg) {
                that.config[key] = cfg[key]
            }
        }
    },
    mounted () {
        document.onkeydown = function (e) {
            switch (e.keyCode) {
                case 38: case 87:// ↑ W
                    if (that.config.isDemo || that.brk) return;
                    if (that.events.down) return;
                    that.events = that.controls["up"];
                    break;
                case 40: case 83:// ↓ S
                    if (that.config.isDemo || that.brk) return;
                    if (that.events.up) return;
                    that.events = that.controls["down"];
                    break;
                case 37: case 65:// ← A
                    if (that.config.isDemo || that.brk) return;
                    if (that.events.right) return;
                    that.events = that.controls["left"];
                    break;
                case 39: case 68: // → D
                    if (that.config.isDemo || that.brk) return;
                    if (that.events.left) return;
                    that.events = that.controls["right"];
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
                    if (!that.config.isDemo && !that.ovr) { // 游戏正在进行
                        clearInterval(that.gameTimer);
                        that.brk = true; // 游戏暂停并显示对话框
                        return false;
                    }
                    if (that.ovr) { // 游戏结束时按下esc键
                        that.ovr_esc();
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