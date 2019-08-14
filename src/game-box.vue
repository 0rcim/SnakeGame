<template>
    <div class="game-box">
        <div class="game-container">
            <div class="game-settings">
                
            </div>
            <div class="score">
                <span>score: <span v-text="score">0000</span></span>
            </div>
            <svg class="game-main" :width="config.width" :height="config.height">
                <!-- <ruler></ruler> -->
                <g>
                    <!-- food -->
                    <path
                        fill="red"
                        :d="foodPath"
                    />
                    <!-- snake -->
                    <!-- fill -->
                    <path 
                        :d="getPath(d2tod1_snake)"
                        fill="white"
                    />
                    <!-- outline -->
                    <path 
                        :d="drawPath(snakeMap)"
                        stroke="green"
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
import ruler from "./ruler.vue";
import { drawPath } from "./core";
export default {
    name: "gameBox",
    components: { ruler },
    computed: {
        col () {
            return that.config.width/10;
        },
        row () {
            return that.config.height/10;
        },
        tot () {
            return that.col*that.row;
        },
        foodPath () {
            return `M${that.food[0]*10}\ ${that.food[1]*10}h10v10h-10z`
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
        d2tod1_food () {
            let item = that.food, x = item[0], y = item[1];
            return [[
                item,
                [ x+1 , y ],
                [ x+1 , y+1 ],
                [ x , y+1 ],
            ]]
        },
        score () {
            let len = (that.tot+'').length;
            let sc = that.score_count;
            return (Array(len).join(0) + sc).slice(-len);
        }
    },
    methods: {
        drawPath (arr) {
            return drawPath(arr);
        },
        getPath (arr) { // 处理 d2tod1 并返回 path d
            return arr.map(item => {
                return "M" + item.map(where => {
                    return `${where[0]*10}\ ${where[1]*10}`
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
                let x = that.random(0, that.col-1), y = that.random(0, that.row-1);
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
            if (that.events.up) {
                that.snakeMap[0][1]--;
                if (that.snakeMap[0][1] < 0) {
                    that.snakeMap[0][1] = that.row-1;
                }
            }
            if (that.events.down) {
                that.snakeMap[0][1]++;
                if (that.snakeMap[0][1] >= that.row) {
                    that.snakeMap[0][1] = 0;
                }
            }
            if (that.events.left) {
                that.snakeMap[0][0]--;
                if (that.snakeMap[0][0] < 0) {
                    that.snakeMap[0][0] = that.col-1;
                }
            }
            if (that.events.right) {
                that.snakeMap[0][0]++;
                if (that.snakeMap[0][0] >= that.col) {
                    that.snakeMap[0][0] = 0;
                }
            }
            // 如果头接触边界，则关闭定时器
            // if (
            //     that.snakeMap[0][0]*10 >= that.config.height || that.snakeMap[0][0] < 0 || 
            //     that.snakeMap[0][1]*10 >= that.config.width || that.snakeMap[0][1] < 0
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
                console.log("crossed!")
            }
            that.snakeMap.pop()
        }
    },
    data () {
        return {
            config: {
                width: 510,
                height: 510,
                speed: 60
            },
            x: 0,
            y: 0,
            gameTimer: null,
            snakeMap: [
                
            ],
            // snake: {
            //     head: [1,4],
            //     end: [2,6]
            // },
            events: {
                up: false,
                down: false,
                left: true,
                right: false
            },
            food: [],
            randomRange: "[]",
            score_count: 0,
            gameEnd: false
        }
    },
    created () {
        that = this;
        // 游戏本体放在正中央
        that.snakeMap = [[Math.round(that.col/2), Math.round(that.row/2)], [Math.round(that.col/2), Math.round(that.row/2)+1]]
        // that.snakeMap = [[35,42],[35,43],[35,44]];
        // that.food = [0,0];
        // that.drawPath(that.snakeMap)
        // ---- //
        let arr = [];
        for (let i=0; i<that.row; i++) 
            for (let j=0; j<that.col; j++) 
                arr[i*that.row+j] = JSON.stringify([j, i]);
        that.randomRange = JSON.stringify(arr);
        // ---- //
        that.setFood();
        // window.timer = that.gameTimer = setInterval(that.startGameNow, that.config.speed)
        document.onkeydown = function (e) {
            switch (e.keyCode) {
                case 38: // ↑
                    if (that.events.down) return;
                    that.events.up = true;
                    that.events.down = false; 
                    that.events.left = false;
                    that.events.right = false;
                    break;
                case 40: // ↓  
                    if (that.events.up) return;
                    that.events.up = false;
                    that.events.down = true; 
                    that.events.left = false;
                    that.events.right = false;
                    break;
                case 37: // ← 
                    if (that.events.right) return;
                    that.events.up = false;
                    that.events.down = false; 
                    that.events.left = true;
                    that.events.right = false;
                    break;
                case 39: // →
                    if (that.events.left) return;
                    that.events.up = false;
                    that.events.down = false; 
                    that.events.left = false;
                    that.events.right = true;
                    break;
                case 32: // spacebar
                    clearInterval(that.gameTimer)
                    break;
                default: break;
            }
        };
    },
    beforeMount () {
    },
    mounted () {
    }
};
</script>