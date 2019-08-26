<template>
    <div class="records">
        <div class="header">
            <div class="name pixel-font"><span>TOP</span></div>
            <div class="name pixel-font"><span>SCORE</span></div>
            <div class="name pixel-font"><span>TIME</span></div>
            <div class="name pixel-font"><span>GAME OPTIONS</span></div>
        </div>
        <div class="body">
            <div class="row pixel-font" v-for="(obj, obj_idx) in rc" :key="obj_idx">
                <div class="col" v-for="(item, index) in obj" :key="index"><span v-text="`${index === 0 ? (obj_idx+1 + (item && '.')) : ''}${index === 2 ? $parent.ms2MMssms(item) : index === 1 ? $parent.fx(item, 4) : item}`"></span></div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "gameRecords",
    data () {
        return {
            rc: []
        }
    },
    created () {
        let ls = localStorage.getItem("records") ? JSON.parse(localStorage.getItem("records")) : [];
        let item = ["", 0, 0, "-"];
        switch (ls.length) {
            case 0:
                this.rc = ls.concat([item, item, item])
                break;
            case 1:
                this.rc = ls.concat([item, item])
                break;
            case 2:
                this.rc = ls.concat([item])
                break;
            default: 
                this.rc = ls;
            break;
        };
    }
}
</script>