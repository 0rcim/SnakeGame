<template>
    <g>
        <g v-for="(item, index) in screen" :key="index" :transform="line(index)">
            <rect v-for="(v, i) in item" :key="i" :x="i*size" :width="size" :height="size" :data-fill="color(v)" :fill="color(v)" @mousemove="paint($event, index, i)" @mousedown="tst($event, i, index)" @mouseup="cancel($event, index, i)"/>
        </g>
    </g>
</template>
<script>
var that = null;
export default {
    name: "grid-row",
    props: ["col", "row", "size"],
    computed: {
        width () {
            return that.col*that.size;
        },
        height () {
            return that.row*that.size;
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
        },
        screenMap () {
            let screenMap = [];
            for (let i=0; i<that.tot; screenMap[i++]=i%2===0?-2:2);
            return screenMap;
        }
    },
    methods: {
        color (n) {
            return this.ref.color[n]
        },
        line (n) {
            return `translate(0, ${n*that.size})`;
        },
        paint (e, x, y) {
            if (!that.canpaint) return;
            that.canpaint && e.target.setAttribute("fill", "blue");
            if (that.canpaint && (that.prev_cell[0] !== x || that.prev_cell[1] !== y)) {
            }
            that.prev_cell = [x, y];
        },
        cancel (e, x, y) {
            that.canpaint = false;
        },
        tst (event, x, y) {
            that.canpaint = true;
            var tar = event.target;
            tar.getAttribute("fill") === "blue" ? tar.setAttribute("fill", tar.getAttribute("data-fill")) : tar.setAttribute("fill", "blue")
            console.log("head", [x, y])
        }
    },
    data () {
        return {
            canpaint: false,
            prev_cell: [],
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
    }
}
</script>
<style>
rect:hover {opacity: .5; cursor: pointer;}
</style>