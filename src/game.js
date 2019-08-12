import Vue from "vue";
import gameBox from "./game-box.vue";
new Vue({
    el: "#game-box",
    template: "<game-box/>",
    components: { gameBox }
});