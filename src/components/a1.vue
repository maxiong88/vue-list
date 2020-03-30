<template>
    <div class="main-wrap">
        <template v-if="list_cur && list_cur.length > 0">
            <mv-loadmore
                ref="loadmore"
                :top-method="pull_refresh"
            >
                <div
                    ref="cont"
                    class="pannelwrap"
                    :style="{paddingTop:to_rem(padding_top),paddingBottom:to_rem(padding_bottom)}"
                >
                    <div
                        v-for="(item, index) in list_cur"
                        :key="item.name"
                        class="wb-item-wrap"
                        :data-id="item.id"
                    >
                        <div class="wb-item">
                            <div>
                                <div>{{item.name}}</div>
                                <div>{{item.title}}</div>
                                <div>{{item.text}}</div>
                                <div>{{item.price}}----{{item.natural}}</div>
                                <div style="height:1rem;background:#ddd"></div>
                            </div>
                        </div>
                        <!-- <card
                            v-if="item.card_type && 9 != item.card_type"
                            :card="item"
                        />
                        <div class="wb-item" v-else>
                            <weibo
                                :item="item.mblog || item"
                                :showTriangle="show_triangle"
                                :showOgRCL="true"
                                :showRpRCL="false"
                            />
                        </div> -->
                    </div>
                </div>
                <!-- <div
                    v-if="re_do"
                    class="m-tips m-tips-tp cursor"
                    @click="() => load_more(nextPageApi)"
                >网络异常，请稍后点击重试~</div> -->
                <mv-nextpage
                    :requesting="is_request"
                />
                <div
                    ref="hei"
                    class="temporary">
                    <div
                        v-for="(item, index) in diff_items"
                        :key="item.feed_id"
                        class="wb-item-wrap"
                    >
                        <div class="wb-item">
                            <div>
                                <div>{{item.name}}</div>
                                <div>{{item.title}}</div>
                                <div>{{item.text}}</div>
                                <div>{{item.price}}----{{item.natural}}</div>
                                <div style="height:1rem;background:#ddd"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </mv-loadmore>
            <!-- <friendships
                v-if="followerInfo"
                :isFirstFollow="true"
            /> -->
        </template>
        <template v-else>
            <div v-if="net_error.flag">
                <no-data
                    :msg="net_error"
                />
            </div>
            <div v-if="net_error.flag && no_data.flag">
                <no-data
                    :msg="net_error"
                />
            </div>
            <div v-if="!(net_error.flag || no_data.flag)">
  
            </div>
        </template>
    </div>
</template>
<script>
import axios from 'axios';
import noData from './nodata.vue';
export default {
    name:"a1",
    data(){
        return {
            show_triangle: !0,
            timer: null,
            is_upglide: !1,
            is_refresh: !1,
            lastHeight: 0,
            first_scroll: 0,
            is_scrolling: !1,
            is_loading: !1,
            is_request: !1,
            re_do: !1,
            count: 20,
            feed_id: 5e3,
            max:"",
            page: 1,
            last_scrolltop: 0,
            diff_items: [],
            list_all:[],
            is_refresh:false,
            padding_top: 0,
            padding_bottom: 0,
            no_data: {
                flag: !1,
                msg: "暂无数据"
            },
            net_error: {
                flag: !1,
                msg: "网络异常，请稍后刷新重试~"
            },
            list_cur:[],
            pageLoaded: false
        }
    },
    created(){
        console.log('a1')
    },
    components:{
        "no-data" : noData
    },
    destroyed(){
        this.is_refresh = false;
    },
    computed:{
        isRefreshRotate: function() {
            return this.is_refresh && this.is_request
        },
        nextPageApi(){
            var t = new URL("http://localhost/a.php");

            t.searchParams.set("page", this.page);
            return t;
        }
    },
     mounted(){
         this.clear_storage(),
        this.init_first_data()
    },
    methods:{
        save_height: function(t) {
            // 获取数据，渲染成不可见dom，通过offsetheight获取元素高度和唯一标识
            var e, s, i, r, c = t.list,
                o = c.length,
                l = this;
            l.diff_items = c,
            l.$nextTick(function() {
                if (l.$refs.hei.children.length === o) {
                    for (e = l.$refs.hei.children, s = 0; s < o; s++){
                        i = e[s].offsetHeight, 
                        r = this.feed_id++, 
                        Object.assign(c[s], {
                            hei: i,
                            feed_id: r
                        });
                    };
                    l.set_list_all(t), l.diff_items = []
                }
            })
        },
        set_list_all: function(t) {
            // 获取数据的高度以后，将数据插入到整体数据中
            var e = this;
            e.is_request = !1;
            var s = t.list;
            this.list_all = this.list_all.concat(s)
        },
        get_item_H: function(t, a) {
            /**
             * 获取第一个/最后一个元素高度
            */
            var e = 0;
            if (this.$refs.cont) {
                var s, i = this.$refs.cont.children,
                    r = i.length;
                if("start" === t) {
                    e += i[0].offsetHeight;
                }else{
                    e += i[r - 1].offsetHeight;
                }
            }
            return e
        },
        get_wb_hei: function(t) {
            // 读取每列高度累加
            var a, e = 0;
            for (a = 0; a < t.length; a++) e += t[a].hei;
            return e
        },
        get_scroll_items: function(t, a) {
            /**
             * this.max 获取当前数组最后一个元素的标识
             * r 当前
            */
            var e, s, i = this.list_all.length,
                r = "",
                c = [],
                n = [],
                o = [],
                l = [],
                d = 0,
                u = 0,
                m = 0,
                p = 0;
            for(e = 0; e < i; e++){
                if(
                    "since" === a && this.since === this.list_all[e].feed_id || 
                    "max" === a && this.max === this.list_all[e].feed_id
                ){
                    r = e;
                    break;
                }
            }
            if ("max" === a) {
                var f = r + 1 - this.list_cur.length;
                for (e = f; e < i; e++) {
                    if (!(m + this.list_all[e].hei <= t)) break;
                    m += this.list_all[e].hei, d++
                }
                for (s = r + 1; s < i; s++) {
                    if (!(p + this.list_all[s].hei <= t)) break;
                    p += this.list_all[s].hei, u++
                }
                if (this.list_all[s] && p + this.list_all[s].hei >= t && this.list_all[r + 1 + u]){
                    return n = this.list_all.slice(r + 1, r + 1 + u), 
                    o = this.list_all.slice(u > this.count ? r + 1 + u - this.count : r + 1, r + 1 + u), 
                    c = this.list_all.slice(f, f + d), 
                    l = d > this.list_cur.length ? this.list_cur : 
                    this.list_all.slice(f, f + d), {
                        add_wb_list: o,
                        wb_list_top: c,
                        wb_list_bottom: n,
                        diff_wb_list: l
                    }
                }
            }
            if ("since" === a && this.list_all[r - 1]) {
                var v = r - 1 + this.list_cur.length;
                for (e = v; e >= 0; e--) {
                    if (!(p + this.list_all[e].hei <= t)) break;
                    p += this.list_all[e].hei, u++
                }
                for (s = r - 1; s >= 0; s--) {
                    if (!(m + this.list_all[s].hei <= t)) break;
                    m += this.list_all[s].hei, d++
                }
                var _ = Math.max(r - d, 0);
                return c = this.list_all.slice(_, r), 
                n = this.list_all.slice(Math.max(v + 1 - u, 0), v + 1), 
                r - d <= 0 ? (o = this.list_all.slice(0, this.count), l = this.list_cur) : 
                (o = this.list_all.slice(_, d > this.count ? _ + this.count : r), l = u > this.list_cur.length ? 
                this.list_cur : this.list_all.slice(Math.max(v + 1 - u, 0), v + 1)), {
                    add_wb_list: o,
                    wb_list_top: c,
                    wb_list_bottom: n,
                    diff_wb_list: l
                }
            }
            return ""
        },
        clear_storage(){

        },
        pull_refresh: function() {
            var t = document.scrollingElement || document.body;
            t.scrollTop = 0, this.padding_top = 0, this.padding_bottom = 0, this.last_scrolltop = 0, this.clear_storage(), this.init_first_data()
        },
        to_rem(t){
            return Math.ceil(t)+"px";
        },
        load_more(t){
            // 加载更多
            var e = this;
            !0 !== this.is_request && (this.is_request = !0,
            axios.get(t)
            .then((res) => {
                if(!res.data || !res.data.code){
                    throw new Error({
                        msg: '我也不知道怎么了'
                    })
                }
                if(res.data && res.data.code === 1){
                    if(res.data.data.car_type === 22){
                        this.is_request = !1, 
                        this.$refs.loadmore.mvLoadEnd()
                    }else{
                        e.save_height(res.data.data)
                        this.page += 1;
                    }
                }
            })).catch((t) => {

            })
        },
        init_first_data(){
            /**
             * HTMElement.offsetHeight 获取当前元素的高度
             * document.documentElement 返回文档对象document的根元素只读属性，html文档中的<html>元素
             * document.body 返回当前文档中<body>元素
             * document.documentElement.clientHeight document.body.clientHeight 可视区域的高度
             * */
            axios.get('http://localhost/a.php?page='+this.page)
            .then((res) => {
                if(res.data && res.data.code === 1){
                    let ei = res.data.data;
                    let i = ei.list;
                    if(i.length > 0){
                        this.list_cur = i;
                        this.$nextTick(() => {
                            var t, a, e, r = this.$refs.cont.children;
                            for (t = 0; t < r.length; t++) a = r[t].offsetHeight,  e = this.feed_id++,Object.assign(i[t], {
                                hei: a,
                                feed_id: e
                            });
                            this.page += 1;
                            this.list_all = i;
                            var c = document.documentElement.clientHeight || window.innerHeight,
                                o = this.list_cur.length;
                            // 最后一个元素的id
                            this.max = this.list_cur[o - 1].feed_id,
                            // first_scroll 
                            this.first_scroll = .5 * this.$refs.cont.offsetHeight - c / 2, 
                            window.onscroll = this.scrolling
                        }), 
                        this.no_data.flag = !1
                    }else{
                        this.no_data.flag = !0
                    }
                }else{
                    this.net_error.flag = !0, this.net_error.msg = res.data.msg || this.net_error.msg;
                }
                this.$nextTick(() => {
                    console.log(this.$refs.loadmore);
                    this.is_request = !1, this.is_refresh = !1, this.$refs.loadmore.mvLoadEnd();
                });
                console.log(this.$data,'this.$data')
            })

        },
        scrolling(){
            /**
            *rootELement html根元素
            * rootScrollTop 一个元素的 scrollTop 值是这个元素的顶部到视口可见内容（的顶部）的距离的度量。
            * lastHeight 最后滚动到页面的（位置）高度
            * first_scroll 滚动到展示内同的一半
            * 
            */
            let that = this,
                rootElement = document.scrollingElement || document.documentElement ||document.body,
                rootScrollTop = rootElement.scrollTop;
                console.log(this.is_refresh, rootScrollTop, this.lastHeight,this.is_scrolling )
            !this.is_refresh && rootScrollTop > 0 &&
            // 滑动方向
            (rootScrollTop >= this.lastHeight ? this.is_upglide =true : this.is_upglide = false),
            this.lastHeight = rootScrollTop,
            this.is_scrolling !== true &&
            (this.is_scrolling = true,
                console.log('scroll滚动中'),
                setTimeout(() => {
                    console.log('scroll滚动中-300毫秒');
                    // 滚动轴滚动到可视区域一半时触发
                    if(this.is_scrolling = false, this.$refs.cont && !(this.padding_top === 0 && rootScrollTop < this.first_scroll)){
                        console.log('小于',rootScrollTop , this.first_scroll)
                        var rootElementA = rootScrollTop - this.first_scroll - this.last_scrolltop;
                        if(rootElementA > 0 && rootScrollTop - this.last_scrolltop > 0){
                            console.log('向上滑')
                            // 向上滑动
                            if(Math.abs(rootElementA) >= this.get_item_H("start", 1)){
                                var is = this.get_scroll_items(rootElementA, "max");
                                if(Object.prototype.toString.call(is) === "[object Object]"){
                                    if(is.wb_list_top.length > 0 && is.wb_list_bottom.length > 0){
                                        this.padding_top += this.get_wb_hei(is.wb_list_top),
                                        this.padding_bottom > this.get_wb_hei(is.wb_list_bottom) ? 
                                        this.padding_bottom -= this.get_wb_hei(is.wb_list_bottom)
                                        : this.padding_bottom=0;
                                        var list_cur_c = this.list_cur.slice(is.diff_wb_list.length);
                                        this.list_cur = list_cur_c.concat(is.add_wb_list),
                                        this.max = this.list_cur[this.list_cur.length - 1].feed_id, 
                                        this.since = this.list_cur[0].feed_id,
                                        this.last_scrolltop += this.get_wb_hei(is.wb_list_top),
                                        this.is_loading = false;
                                    }
                                }else{
                                    console.log(1199)
                                    this.load_more(this.nextPageApi);
                                    this.is_loading = true;
                                }
                            }


                        }else if(rootElementA < 0 && rootScrollTop-(this.last_scrolltop + this.first_scroll)<0 && Math.abs(rootElementA) >=this.get_item_H("end", 1) ){
                            console.log(2)
                            var ns = this.get_scroll_items(Math.abs(rootElementA), "since");
                            if(Object.prototype.toString.call(ns) === "[object Object]"){
                                if(ns.wb_list_top.length > 0 && ns.wb_list_bottom.length > 0){
                                    this.padding_bottom += this.get_wb_hei(ns.wb_list_bottom);
                                    this.padding_top > this.get_wb_hei(ns.wb_list_top) ? this.padding_top -= this.get_wb_hei(ns.wb_list_top) : this.padding_top = 0;
                                    var list_cur_length = this.list_cur.length,
                                        list_cur_A = this.list_cur.slice(0, list_cur_length - ns.diff_wb_list.length);
                                    this.list_cur = ns.add_wb_list.concat(list_cur_A),
                                    this.max = this.list_cur[this.list_cur.length - 1].feed_id,this.since = this.list_cur[0].feed_id,
                                    0 === rootScrollTop ? this.last_scrolltop = 0 : this.last_scrolltop -= this.get_wb_hei(ns.wb_list_top);
                                }else{
                                    this.padding_top = 0;
                                }
                            }
                        }

                    }

                }, 300)
            
            );
        }
    }
}
</script>