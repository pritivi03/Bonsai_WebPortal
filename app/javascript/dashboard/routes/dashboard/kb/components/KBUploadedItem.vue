<template>
  <div id="container">
        <div id="left">
            <kb-file-icon :type="getFileExtension(this.file.name)" style="margin-right: 10px;"></kb-file-icon>
            <div style="display: 'flex', flexDirection: 'column'">
                <h6><b>{{this.file.name}}</b></h6>
                <p>{{this.formatBytes(this.file.size)}}</p>
            </div>
        </div>
        <div id="right">
            <woot-button style="margin-right: 10px;">Annotate</woot-button>
            <fluent-icon icon="checkmark-circle" style="color: green;" size="20" class="icon icon--font" />
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
        file: Object
    },
    computed: {
        
        
    },
    methods: {
        getFileExtension: function(name) {
            const extension = name.toString().split('.').pop();
            return extension
        },
        formatBytes(bytes, decimals = 2) {
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