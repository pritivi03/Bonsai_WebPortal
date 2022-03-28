<template>
    <div>
        <img width="33" height="33" v-if="type == 'zip' " src="../assets/ZIP.svg"/>
        <img width="33" height="33" v-if="type == 'pdf' " src="../assets/PDF.svg"/>
        <img width="33" height="33" v-if="type == 'doc' " src="../assets/Doc.svg"/>
        <img width="33" height="33" v-if="type == 'docx' " src="../assets/Doc.svg"/>
        <img width="33" height="33" v-if="type == 'xlsx' " src="../assets/Excel.svg"/>
    </div>
</template>

<script>
export default {
    props: {
        type: String
    },
    computed: {
    }

}
</script>

<style>

</style>