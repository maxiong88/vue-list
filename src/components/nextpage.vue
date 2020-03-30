<template>
    <div v-show="requesting" class="m-tips m-tips-tp">
        <div class="m-loading m-loading-dark">
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
            <span></span>
        </div>
    </div>
</template>
<script>
export default {
    name: "nextpage",
    props: {
        requesting: {
            type: Boolean,
            default: !1
        }
    }
}
</script>
<style scoped>
.m-tips {
    font-size: .875rem;
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    position: relative;
}
.m-tips-tp {
    color: #7c7c7c;
    background: 0 0;
}
.m-tips.m-tips-tp {
    font-size: .75rem;
}
.m-tips{
    margin: 0 auto;
    padding-top: .625rem;
    display: block;
}


</style>