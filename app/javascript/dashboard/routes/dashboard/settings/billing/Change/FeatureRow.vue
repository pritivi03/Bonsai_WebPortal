<template>
    <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 3px;">
        <fluent-icon icon="checkmark-circle"  style="color: green; margin-right: 5px;"/>
        <span>{{text}}</span>
    </div>
</template>

<script>
export default {
    props: {
        text: String
    }
}
</script>

<style>

</style>