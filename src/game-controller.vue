<template>
    <div class="controller">
        <div class="outer">
            <div v-for="(item, i) in controller" :key="item" :id="`c-${item}`" :class="{'active': active[i]}" @mousedown="mousedown($event, i)"></div>
        </div>
    </div>
</template>
<script>
var that = null;
export default {
    name: "gameController",
    computed: {
        active () {
            let bool = [false, false, false, false];
            that.act_key !== -1 && (bool[that.act_key] = true);
            return bool;
        }
    },
    methods: {
        mousedown (e, i) {
            let tar = e.target;
            that.act_key = i;
            window.onmousemove = () => {
                return false;
            };
            window.onmouseup = () => {
                that.act_key = -1;
                window.onmouseup = null;
                return false;
            };
            if (that.$parent.config.isDemo) return;
            const rsMap = ["down", "up", "right", "left"];
            if (that.$parent.events[rsMap[i]]) return;
            that.$parent.events = that.$parent.controls[that.controller[i]];
        }
    },
    created () {
        that = this;
    },
    mounted () {
        window.onkeydown = (event) => {
            if (that.$parent.controllerShouldReflect) {
                switch (event.keyCode) {
                    case 38: case 87: that.act_key = 0; break; // up
                    case 40: case 83: that.act_key = 1; break; // down
                    case 37: case 65: that.act_key = 2; break; // left
                    case 39: case 68: that.act_key = 3; break; // right
                    default: break;
                }
                window.onkeyup = () => {
                    that.act_key = -1;
                    window.onkeyup = null;
                    return false;
                };
            }
        };
        let keys = document.querySelectorAll(".controller .outer div");
        const mMap = ["c-up", "c-down", "c-left", "c-right"];
        for (let i = 0; i < keys.length; i++) {
            const el = keys[i];
            el.addEventListener("touchstart", (e) => {
                let j = mMap.indexOf(e.target.id);
                that.act_key = j;
                el.addEventListener("touchend", (e) => {
                    that.act_key = -1;
                }, {passive: false});
                if (that.$parent.config.isDemo) return;
                const rsMap = ["down", "up", "right", "left"];
                if (that.$parent.events[rsMap[j]]) return;
                that.$parent.events = that.$parent.controls[that.controller[j]];
            }, {passive: false});
        }
    },
    data () {
        return {
            act_key: -1,
            controller: ["up", "down", "left", "right"]
        }
    }
}
</script>