<template>
    <g class="grid-row" :transform="line(l)">
        <rect v-for="(v, i) in base" :key="i" :x="i*10" :y="0" :fill="color(v)" @click="tst($event, l, i)"/>
    </g>
</template>
<script>
export default {
    name: "grid-row",
    methods: {
        color (n) {
            return this.ref.color[n]
        },
        line (n) {
            return `translate(0, ${n*10})`;
        },
        tst (event, x, y) {
            event.target.setAttribute("fill", "blue")
            console.log([x, y])
        }
    },
    props: {
        base: Array,
        l: Number
    },
    data () {
        return {
            ref: {
                color: {
                    "-1": "#f00",
                    "0": "#000",
                    "1": "#fff"
                }
            }
        }
    }
}
</script>
<style>
rect:hover {opacity: .5; cursor: pointer;}
</style>