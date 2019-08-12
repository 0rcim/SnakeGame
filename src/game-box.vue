<template>
    <div class="game-box">
        <div class="game-container">
            <svg class="game-main" :width="config.width" :height="config.height">
                <!-- <ruler></ruler> -->
                <g>
                    <!-- snake -->
                    <path 
                        fill="#fff" 
                        :d="getPath(d2tod1_snake)"
                    />
                    <!-- food -->
                    <path
                        fill="grey"
                        :d="getPath(d2tod1_food)"
                    />
                </g>
            </svg>
        </div>
    </div>
</template>
<script>
var that = null;
import ruler from "./ruler.vue";
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
        }
    },
    methods: {
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
            let range = JSON.parse(that.randomRange);
            for (let i=0, l=that.snakeMap.length; i<l; i++) {
                let idx = range.indexOf(JSON.stringify(that.snakeMap[i]));
                range[idx] = "";
            };
            let newRange = range.filter(item => {
                return item;
            });
            let food_idx = that.random(0, newRange.length-1);
            console.log(food_idx, newRange)
            newRange.length && (that.food = JSON.parse(newRange[food_idx]));
            newRange.length || console.log("Game End!");
            console.log(newRange[food_idx])
        }
    },
    data () {
        return {
            config: {
                width: 510,
                height: 450,
                speed: 80
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
            randomRange: "[]"
        }
    },
    created () {
        that = this;
        // 游戏本体放在正中央
        that.snakeMap = [[Math.round(that.col/2), Math.round(that.row/2)], [Math.round(that.col/2), Math.round(that.row/2)+1]]
        // ---- //
        let arr = [];
        for (let i=0; i<that.row; i++) 
            for (let j=0; j<that.col; j++) 
                arr[i*that.row+j] = JSON.stringify([j, i]);
        that.randomRange = JSON.stringify(arr);
        // ---- //
        that.setFood();
        window.timer = that.gameTimer = setInterval(()=>{
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
                let l = that.snakeMap.length-1;
                that.snakeMap.push([that.snakeMap[l][0], that.snakeMap[l][1]]);
                that.setFood();
                console.log("crossed!")
            }
            that.snakeMap.pop()
        }, that.config.speed)
        document.onkeydown = function (e) {
            switch (e.keyCode) {
                case 38: // ↑
                    that.events.up = true;
                    that.events.down = false; 
                    that.events.left = false;
                    that.events.right = false;
                    break;
                case 40: // ↓  
                    that.events.up = false;
                    that.events.down = true; 
                    that.events.left = false;
                    that.events.right = false;
                    break;
                case 37: // ← 
                    that.events.up = false;
                    that.events.down = false; 
                    that.events.left = true;
                    that.events.right = false;
                    break;
                case 39: // →
                    that.events.up = false;
                    that.events.down = false; 
                    that.events.left = false;
                    that.events.right = true;
                    break;
                default: break;
            }
        };
    },
    beforeMount () {
    },
    mounted () {
    }
}
</script>