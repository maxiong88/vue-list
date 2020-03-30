<template>
    <div>
        <template v-if="list_cur && list_cur.length > 0">
            <div class="pannelwrap" ref="cont" :style="{'padding-top':to_rem(padding_top),'padding-bottom':to_rem(padding_bottom)}">
                <div v-for="(item, index) in list_cur" class="wb-item-wrap" :key="item.id">
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
        </template>
    </div>

</template>
<script>
import axios from 'axios';
export default {
    data(){
        return {
            list_cur:[],
            padding_top:0,
            padding_bottom:0
        }
    },
    mounted(){
        this.init_first_data()
    },
    methods:{
        to_rem(t){
            return Math.ceil(t)+"px";
        },
        init_first_data(){
            axios.get('//localhost/a.php')
            .then((res) => {
                console.log(res)
                let ei = res.data.data;
                let i = ei.list;
                this.list_cur = i;
                this.$nextTick(() => {
                    
                });
            })

        },
        scrolling(){
            let that = this,
                rootElement = document.scrollingElement || document.documentElement ||document.body,
                rootScrollTop = rootElement.scrollTop;
            !this.is_refresh && rootScrollTop > 0 &&
            (rootScrollTop >= this.lastHeight ? this.is_upglide =true : this.is_upglide = false),
            this.lastHeight = rootScrollTop,
            this.is_scrolling !== true &&
            (this.is_scrolling = true,
            
                setTimeout(function(){
                    if(this.is_scrolling = false, this.$refs.cont && !(this.padding_top === 0 && rootScrollTop < this.first_scroll)){
                        
                        var rootElementA = rootScrollTop - this.first_scroll - this.last_scrolltop;
                        if(rootElementA > 0 && rootScrollTop - this.last_scrolltop > 0){
                            if(Math.abs(rootElementA) >= this.get_item_H("start", 1)){
                                var is = this.get_scroll_items(rootElementA, "max");
                                if(Object.prototype.toString.call(is) === "[object Object]"){
                                    if(is.wb_list_top.length > 0 && is.wb_list_bottom.length > 0){
                                        this.padding_top += this.get_wb_hei(is.wb_list_top),
                                        this.padding_bottom > this.get_wb_hei(is.wb_list_bottom) ? this.padding_bottom -= this.get_wb_hei(is.wb_list_bottom)
                                        : this.padding_bottom=0;
                                        var list_cur_c = this.list_cur.slice(is.diff_wb_list.length);
                                        this.list_cur = list_cur_c.concat(is.add_wb_list),
                                        this.max = this.list_cur[this.list_cur.length - 1].feed_id,
                                        this.since = this.list_cur[0].feed_id,
                                        this.last_scrolltop += this.get_wb_hei(is.wb_list_top),
                                        this.is_loading = false;
                                    }
                                }else{
                                    this.load_more(this.nextpageApi);
                                    this.is_loading = true;
                                }
                            }


                        }else if(rootElementA < 0 && rootScrollTop-(this.last_scrolltop + this.first_scroll)<0 && Math.abs(rootElementA) >=this.get_item_H("end", 1) ){
                            var ns = this.get_scroll_items(Math.abs(rootElementA), "since");
                            if(Object.prototype.toString.call(ns) === "[object Object]"){
                                if(ns.wb_list_top.length > 0 && ns.wb_list_bottom.length > 0){
                                    this.padding_bottom += this.get_wb_hei(ns.wb_list_bottom);
                                    this.padding_top > this.get_wb_hei(ns.wb_list_top) ? this.padding_top == this.get_wb_hei(ns.wb_list_top) : this.padding_top = 0;
                                    var list_cur_length = this.list_cur.length,
                                        list_cur_A = this.list_cur.slice(0, ns.diff_wb_list.length);
                                    this.list_cur = ns.add_wb_list.concat(list_cur_A),
                                    this.max = this.list_cur[this.list_cur.length - 1].feed_id,
                                    this.since = this.list_cur[0].feed_id,
                                    0 === s ? this.last_scrolltop = 0 : this.last_scrolltop == this.get_wb_hei(ns.wb_lisr_top);
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