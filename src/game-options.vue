<template>
    <div class="options pixel-font">
        <div class="opt" v-for="(group, i) in groups" :key="i">
            <div class="option-sort">
                <span v-text="group.title"></span>
            </div>
            <div class="option" v-for="(item, index) in group.opts" :key="index">
                <div class="option-title"><span v-text="item.name"></span></div>
                <div class="option-content type-themes" v-if="item.themes">
                    <button :class="{'actived': item.act[i], 'chessboard': sty.chessboard}" v-for="(sty, i) in item.themes" :key="i">
                        <svg width="44" height="24">
                            <path :fill="sty.fill" :stroke="sty.borderColor" :stroke-width="sty.borderWidth" :d="`M2 2h40v20h-40z${sty.cross ? 'M22 2v20' : ''}`"/>
                        </svg>
                    </button>
                </div>
                <div class="option-content" v-else>
                    <button v-for="(n, i) in item.opt" :class="{'actived': item.act[i]}" :key="n"><span v-text="n"></span></button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "gameOptions",
    data () {
        return {
            groups: [{
                    title: "DISPLAY",
                    opts: [{
                            name: "Screen Size",
                            opt: ["Large", "Medium", "Small"],
                            val: [{'col': 50, 'row': 45},{'col': 39, 'row': 39},{'col': 20, 'row': 20}],
                            act: [false, true, false]
                        },{
                            name: "Themes",
                            themes: [
                                {'fill': 'none', 'borderColor': 'white', 'borderWidth': 2},
                                {'fill': 'none', 'borderColor': 'black', 'borderWidth': 2, 'chessboard': true},
                                {'fill': 'grey', 'borderColor': 'black', 'borderWidth': 2, 'chessboard': true},
                                {'fill': 'white', 'borderColor': 'black', 'borderWidth': 2},
                                {'fill': 'white', 'borderColor': 'black', 'borderWidth': 2, 'cross': true}
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
                            opt: ["10x10", "12x12", "15x15"],
                            val: [{'step':10},{'step':12},{'step':15}],
                            act: [false, false, true]
                        },{
                            name: "Controller",
                            opt: ["WSAD", "TDLR", "Both", "none"],
                            act: [false, true, false, false]
                        }
                    ]
                }
            ]
        }
    }
}
</script>