<template>
    <div
        v-if="msg && msg.msg"
        class="empty_failed"
    >
        <p v-text="msg.msg"></p>
    </div>
</template>
<script>
export default {
    props:["msg"]
}
</script>