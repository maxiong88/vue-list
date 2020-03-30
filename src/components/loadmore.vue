<template>
    <div
        :style="{transform:translate,transitionDuration:transition}"
        @mousedown="startDrag"
        @touchstart="startDrag"
        @mousemove="(e) => {return e.stopPropagation(),onDrag(e)}"
        @touchmove="(e)=>{return e.stopPropagation(),onDrag(e)}"
        @mouseup="stopDrag"
        @touchend="stopDrag"
        @mouseleave="stopDrag"
        @transitionend="transitionEnd"
    >
        <div
            class="m-tips m-tips-tp"
        >
            <template v-if="showArrow">
                <div
                    v-if="requesting"
                    class="m-loading m-loading-drak"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <i
                    v-else
                    class="m-font m-font-down m-font-down-ani"
                    :class="{up:dragging && dY > topDistance}"
                ></i>
            </template>
            <span
                v-if="showText"
                class="main-link"
                v-text="status"
            >

            </span>
        </div>
        <slot></slot>
        <div style="position:fixed"></div>
    </div>
</template>
<script>
function r(e){
    var t = e;
    while(t && "HTML" !== t.tagName && "BODY" !==t.tagName && 1 === t.nodeType){
        var n = document.defaultView.getComputedStyle(t).overflowY;
        if("sroll" === n || "auto" === n){return t}
        t = t.parentNode
    }
    return document.documentElement
}
export default {
    name: "loadmore",
    created(){
        console.log(1)
        this.$nextTick(() => {
            console.log(2)
            this.topBarHeight = this.$el.children[0].clientHeight;
        });
    },
    mounted(){
        console.log(3)
        this.scrollTarget = r(this.$el);
    },
    props:{
        topDistance: {
            type: Number,
            default: 100
        },
        topPullText: {
            type: String,
            default: "下拉刷新"
        },
        topDropText: {
            type: String,
            default: "加载中..."
        },
        topLoadingText: {
            type: String,
            default: "释放更新"
        },
        showText: {
            type: Boolean,
            default: !0
        },
        showArrow: {
            type: Boolean,
            default: !0
        },
        topMethod: {
            type: Function
        }
    },
    data(){
        return {
            scrollTarget: null,
            topBarHeight: 0,
            requesting: false,
            dragging: false,
            startY: 0,
            dY:0,
            reset:true
        }
    },
    computed:{
        transition: function() {
            return this.dragging || 0 === this.dY && this.reset ? "0s" : "200ms"
        },
        translate: function() {
            var e = 80 * Math.atan(this.dY / 200) - this.topBarHeight;
            return "translateY("+e+"px)"
        },
        status: function() {
            return this.dragging && this.dY > this.topDistance ?
            this.topLoadingText : this.requesting ?
            this.topDropText : this.topPullText
        }
    },
    watch:{
        requesting(e){
            console.log(e, this.dY,'=====watch, loadmore')
            e || (this.dY = 0)
        }
    },
    methods:{
        mvLoadEnd:function(){
            this.loadEnd()
        },
        mvLoadStart:function(){
            this.scrollTarget.scrollTop = 0;
            this.loadStart();
        },
        loadStart: function() {
            this.requesting = !0, this.topMethod(), this.dY = this.topDistance
        },
        loadEnd: function() {
            this.requesting = !1
        },
        startDrag: function(e) {
            var t = e.changedTouches ? e.changedTouches[0] : e;
            this.scrollTarget.scrollTop <= 0 && (this.startY = t.pageY, this.dragging = !0, this.reset = !1)
        },
        onDrag: function(e) {
            var t = e.changedTouches ? e.changedTouches[0] : e;
            this.dragging && t.pageY - this.startY > 0 && window.scrollY <= 0 && 
            (e.preventDefault(), this.dY = t.pageY - this.startY, this.requesting && (this.dY = this.dY + this.topDistance))
        },
        stopDrag: function() {
            this.dragging = !1, this.dY > this.topDistance && window.scrollY <= 0 ? this.loadStart() : this.dY = 0
        },
        transitionEnd: function() {
            this.dY !== this.topDistance || this.requesting || (this.dY = 0), 0 === this.dY && (this.reset = !0)
        }
    }
}
</script>