<template>
  <div id="container">
        <kb-file-icon :type="getFileExtension(this.file.name)"></kb-file-icon>
        <div id="innerContent">
            <div id="top">
                <h6 style="alignSelf: flex-start;"><b>{{this.file.name}}</b></h6>
                <p style="alignSelf: flex-start;">{{formatBytes(file.size)}}</p>
                <v-progress-linear value="15"></v-progress-linear>

            </div>
            <fluent-icon icon="dismiss-circle" size="20" style="color: red;" class="icon icon--font" />
        </div>
    </div>
</template>

<script>
import KBFileIcon from "./KBFileIcon.vue"
export default {
    components: {
        'kb-file-icon': KBFileIcon
    },
    props: {
        file: Object,
        index: Number
    },
    computed: {
        
    },
    methods: {
        getFileExtension: function(name) {
            const extension = name.toString().split('.').pop();
            console.log(extension)
            return extension
        },
        formatBytes: function (bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';

            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
    },
    data: function () {
        return {
        }
    }
}
</script>
    
<style>
#container {
    width: 100%;
    height: 125px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

#innerContent {
    display: flex; 
    flex-direction: row;
    align-items: center;
    margin-left: 20px;
    width: 100%;
}

#top {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

#left {
    display: flex;
    flex-direction: row;
    align-items: center;
}

#right {
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>