<template>
    <div style="width: 100%;">
        <kb-uploaded-item v-if="type == 'Uploaded' " :file="file" :index="index"></kb-uploaded-item>
        <kb-in-progress-item v-if="type == 'In Progress' " :file="file" :progress="progress" :index="index"></kb-in-progress-item>
    </div>
</template>

<script>
import KBUploadedItem from "./KBUploadedItem.vue"
import KBInProgressItem from './KBInProgressItem.vue'

export default {
    components: {
        'kb-uploaded-item': KBUploadedItem,
        'kb-in-progress-item': KBInProgressItem
    },
    props: {
        type: String,
        file: Object,
        index: Number,
        progress: Number
    }
}
</script>

<style>

</style>