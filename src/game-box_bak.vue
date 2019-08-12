<template>
    <div class="game-box">
        <div class="game-container">
            <svg class="game-main" :width="config.width" :height="config.height">
                <!-- <ruler></ruler> -->
                <g>
                    <path 
                        fill="#fff" 
                        :d="getPath(d2tod1)"
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
        d2tod1 () { // 方块化为 4 个点 平面转点
            return that.snakeMap.map(item => {
                let x = item[0], y = item[1];
                return [
                    item,
                    [ x+1 , y ],
                    [ x+1 , y+1 ],
                    [ x , y+1 ],
                ]
            })
        }
    },
    methods: {
        getPath (arr) { // 处理 d2tod1 并返回 path d
            return arr.map(item => {
                return "M" + item.map(where => {
                    return `${where[0]*10}\ ${where[1]*10}`
                }).join("\ L")
            }).join("Z");
        }
    },
    data () {
        return {
            config: {
                width: 650,
                height: 650
            },
            x: 0,
            y: 0,
            snakeMap: [
                [48,25],[47,25]
            ],
            snake: {
                head: [1,4],
                end: [2,6]
            },
            events: {
                up: false,
                down: false,
                left: false,
                right: false
            }

        }
    },
    created () {
        that = this;
        that.getPath(that.d2tod1);
        let x1 = 0, y1 = 0;
        setInterval(()=>{
            if (that.events.up) {
                that.snakeMap.unshift([that.snakeMap[0][0], that.snakeMap[0][1]]);
                that.snakeMap[0][1]--;
                that.snakeMap.pop()
            }
            if (that.events.down) {
                that.snakeMap.unshift([that.snakeMap[0][0], that.snakeMap[0][1]]);
                that.snakeMap[0][1]++;
                that.snakeMap.pop()
            }
            if (that.events.left) {
                that.snakeMap.unshift([that.snakeMap[0][0], that.snakeMap[0][1]]);
                that.snakeMap[0][0]--;
                that.snakeMap.pop()
                
            }
            if (that.events.right) {
                that.snakeMap.unshift([that.snakeMap[0][0], that.snakeMap[0][1]]);
                that.snakeMap[0][0]++;
                that.snakeMap.pop()
            }
        }, 80)
        document.onkeydown = function (e) {
            switch (e.keyCode) {
                case 38: // ↑
                    that.events.up = true;
                    break;
                case 40: // ↓  
                    that.events.down = true; 
                    break;
                case 37: // ← 
                    that.events.left = true;
                    break;
                case 39: // →
                    that.events.right = true;
                    break;
                default: break;
            }
        }
        document.onkeyup = function (e) {
            switch (e.keyCode) {
                case 38: // ↑
                    that.events.up = false;
                    break;
                case 40: // ↓  
                    that.events.down = false; 
                    break;
                case 37: // ← 
                    that.events.left = false;
                    break;
                case 39: // →
                    that.events.right = false;
                    break;
                default: break;
            }
        }
    },
    beforeMount () {
    },
    mounted () {
    }
}
</script>