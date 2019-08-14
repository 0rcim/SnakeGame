<template>
    <g>
        <g class="grid-row" v-for="(item, index) in screen" :key="index" :transform="line(index)">
            <rect v-for="(v, i) in item" :key="i" :x="i*10" :y="0" :fill="color(v)" @mousemove="paint($event, index, i)" @mousedown="tst($event, i, index)" @mouseup="cancel($event, index, i)"/>
        </g>
    </g>
</template>
<script>
var that = null;
export default {
    name: "grid-row",
    computed: {
        col () {
            return that.$parent.config.width/10;
        },
        row () {
            return that.$parent.config.height/10;
        },
        tot () {
            return that.col*that.row;
        },
        screen () {
            var map = [];
            for (let i=0; i<that.tot; i+=that.col) {
                map.push(that.screenMap.slice(i, i+that.col));
            };
            return map;
        }
    },
    methods: {
        color (n) {
            return this.ref.color[n]
        },
        line (n) {
            return `translate(0, ${n*10})`;
        },
        paint (e, x, y) {
            if (!that.canpaint) return;
            that.canpaint && e.target.setAttribute("fill", "blue");
            if (that.canpaint && (that.prev_cell[0] !== x || that.prev_cell[1] !== y)) {
                // console.log("body", [x, y])
            }
            that.prev_cell = [x, y];
        },
        cancel (e, x, y) {
            that.canpaint = false;
            // console.log("end", [x, y])
        },
        tst (event, x, y) {
            that.canpaint = true;
            event.target.setAttribute("fill", "blue");
            console.log("head", [x, y])
            // console.log(JSON.parse(that.$parent.randomRange).indexOf(JSON.stringify([y,x])))
        }
    },
    data () {
        return {
            canpaint: false,
            prev_cell: [],
            screenMap: [],
            ref: {
                color: {
                    "-2": "#eee",
                    "-1": "#f00",
                    "0": "#000",
                    "1": "#fff",
                    "2": "#aaa"
                }
            }
        }
    },
    created () {
        that = this;
        for (let i=0; i<that.tot; that.screenMap[i++]=i%2===0?-2:2);

    }
}
</script>
<style>
rect:hover {opacity: .5; cursor: pointer;}
</style>