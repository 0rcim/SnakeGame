<template>
    <div class="options pixel-font">
        <div class="opt" v-for="(group, idx) in groups" :key="idx">
            <div class="option-sort">
                <span v-text="group.title"></span>
            </div>
            <div class="option" v-for="(item, index) in group.opts" :key="index">
                <div class="option-title"><span v-text="item.name"></span></div>
                <div class="option-content type-themes" v-if="item.themes">
                    <button :class="{'actived': item.act[i], 'chessboard': sty.chessboard}" v-for="(sty, i) in item.val" :key="i" @click="opt_click(item, idx, index, i)" @touchstart="opt_click(item, idx, index, i)">
                        <svg width="44" height="24">
                            <path :fill="sty.color" :stroke="sty.borderColor" :stroke-width="sty.borderWidth" :d="`M2 2h40v20h-40z${sty.cross ? 'M22 2v20' : ''}`"/>
                        </svg>
                    </button>
                </div>
                <div class="option-content" v-else>
                    <button v-for="(n, i) in item.opt" :class="{'actived': item.act[i]}" :key="n" @click="opt_click(item, idx, index, i)" @touchstart="opt_click(item, idx, index, i)"><span v-text="n"></span></button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
var that = null;
export default {
    name: "gameOptions",
    methods: {
        opt_click (obj, idx, index, i) {
            let n_act = that.fls(that.groups[idx].opts[index].act.length, i);
            that.groups[idx].opts[index].act = n_act;
            let change_tar = that.groups[idx].opts[index].val[i];
            // let configs = {};
            for (let key in change_tar) {
                that.$parent.config[key] = that.configs[key] = change_tar[key];
            }
            // 触发父组件 speed 的 watcher
            that.$parent.speed = !that.$parent.speed;
            localStorage.setItem("configs", JSON.stringify(that.configs));
            
            let opts = localStorage.getItem("opts");
            localStorage.setItem("opts", JSON.stringify(that.groups));
        },
        fls (num, i) {
            let a = []; for (let i=0; i<num; a[i++] = false); a[i] = true; return a;
        },
        getOptLabels () {
            let cfg = {};
            that.groups.forEach((a, b) => {
                cfg[a.title] = {};
                a.opts.forEach((c, d) => {
                    if (c.opt) cfg[a.title][c.name] = c.opt.filter((e, f) => {
                        return c.act[f];
                    });
                
                })
            });
            return cfg;
        }
    },
    created () {
        that = this;
    },
    data () {
        return {
            configs: {},
            groups: [{
                    title: "DISPLAY",
                    opts: [{
                            name: "Viewport",
                            opt: ["Large", "Medium", "Small"],
                            val: [{'col': 55, 'row': 39},{'col': 39, 'row': 39},{'col': 31, 'row': 31}],
                            act: [false, false, true]
                        },{
                            name: "Themes",
                            themes: true,
                            val: [
                                {'color': 'none', 'borderColor': 'white', 'borderWidth': 2, 'chessboard': false, 'cross': false},
                                {'color': 'none', 'borderColor': 'black', 'borderWidth': 2, 'chessboard': true, 'cross': false},
                                {'color': 'gray', 'borderColor': 'black', 'borderWidth': 2, 'chessboard': true, 'cross': false},
                                {'color': 'white', 'borderColor': 'black', 'borderWidth': 0, 'chessboard': false, 'cross': false},
                                {'color': 'white', 'borderColor': 'black', 'borderWidth': 2, 'chessboard': false, 'cross': true}
                            ],
                            act: [true, false, false, false]
                        },{
                            name: "Speed",
                            opt: ["Slow", "Fast", "Crazy"],
                            val: [{'speed': 100},{'speed': 60},{'speed': 40}],
                            act: [true, false, false]
                        }]
                }, {
                    title: "BASIC",
                    opts: [{
                            name: "Game Mode",
                            opt: ["Normal", "Free"],
                            act: [true, false]
                        },{
                            name: "Cell",
                            opt: ["15x15", "16x16", "18x18"],
                            val: [{'step':15},{'step':16},{'step':18}],
                            act: [false, false, true]
                        },{
                            name: "Controller",
                            opt: ["OFF", "ON"],
                            val: [{'controller':false},{'controller':true}],
                            act: [true, false]
                        }
                    ]
                }
            ]
        }
    },
    mounted () {
        let opts = localStorage.getItem("opts");
        let configs = localStorage.getItem("configs");
        opts && (that.groups = JSON.parse(opts));
        configs && (that.configs = JSON.parse(configs));
    }
}
</script>