<template>
    <div id="mainContainer">
        <settings-header
            button-route="new"
            header-title="Upload to Knowledge Base"
        />
        <div id="contentContainer">
            <div id="focusContainer" width="700">
                <div id="uploadContainer">
                    <input type="file" id="uploader" multiple @change="filesSelected" ref="file"/>
                    <img width="350" id="dragImage" src="../assets/DragArea.svg" v-on:click="uploadImageClicked"/>
                    <p>Drag & drop files here, or click to select files</p>
                </div>
                <div id="thumbsContainer">
                    <kb-file-item v-for="(file, index) in this.files" :file="file" :type="file.status" :index="index" :key="file.name"></kb-file-item>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SettingsHeader from "../../settings/SettingsHeader.vue"
import { mapGetters } from 'vuex';

class UploadObject  {
  constructor (name, size, status, progress) {
    this.name = name
    this.size = size
    this.status = status
    this.progress = progress
  }

  get getProgress() {
    return this.progress
  }
  
  set setProgress(newProgress) {
    this.progress = newProgress
  }
}

class Annotation {
    constructor(question, start, end, text) {
      this.question = question
      this.start = start
      this.end = end
      this.text = text
    }
  }

class PackagedAnnotation {
    constructor (file, annotations) {
        this.file = file
        this.annotations = annotations
    }
}

export default {
    components: {
        SettingsHeader,
        'kb-file-item': () => import('./KBFileItem.vue')
    },
    computed: {
        fileType : function (index) {
            
        },
        api : function () {
            return "https://ngvi1z9egk.execute-api.us-east-2.amazonaws.com/beta/"
        },
        ...mapGetters({
            accountId: 'getCurrentAccountId',
        })
    },
    methods: {
        uploadImageClicked () {
            document.getElementById("uploader").click();
        },
        async getPresignedUploadURL (fileName) {
            var url = this.api + "file/getUploadURL?file_name=" + fileName + "&url_type=POST"
            const response = await fetch(url)
            const jsonResponse = await response.json()
            console.log(jsonResponse["post_url"])
            return jsonResponse["post_url"]
        },
        async performUpload(url, uploadObject, file, index) {
            console.log(url)
            const self = this
            return new Promise(function (resolve, reject) {

                let request = new XMLHttpRequest();
                request.open('PUT', url, true); 

                // upload progress event
                
                request.upload.onprogress = function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = parseInt((evt.loaded / evt.total) * 100);
                        uploadObject.progress = percentComplete
                        self.progress = percentComplete
                        console.log("Upload: " + percentComplete + "% complete")
                    }
                }

                // request finished event
                request.addEventListener('load', function(e) {
                    // HTTP status message (200, 404 etc)
                    console.log(request.status);

                    // request.response holds response from the server

                    uploadObject.status = "Uploaded"
                    self.fileState = "Uploaded"
                    //setFileState("Uploaded")

                    // 1. Make a shallow copy of the items
                    let items = [...self.statuses];
                    // 2. Make a shallow copy of the item you want to mutate
                    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
                    items[index] = "Uploaded";
                    // 5. Set the state to our new copy
                    self.statuses = items
                    //setStatuses(items)

                    if (self.currentIndex < self.files.length) {
                        self.currentIndex = self.currentIndex + 1
                        //setCurrentIndex(currentIndex + 1)
                    }

                    self.fileState = "In Progress"
                    //setFileState("In Progress")
                    console.log("Finished")
                    resolve({})
                });

                request.onerror = function () {
                    reject({})
                }
                
                var formData = new FormData();
                formData.append("myFile", file);

                // send POST request to server
                request.send(formData);
            })
        },
        async filesSelected () {
            var acceptedFiles = this.$refs.file.files

            for (var i = 0; i < acceptedFiles.length; i++) {

                //first add to the files
                var thisFile = acceptedFiles[i];
                console.log(thisFile)
                var newFileUpload = new UploadObject(thisFile.name, thisFile.size, "In Progress", 0)
                this.statuses.push("In Progress");
                //setStatuses(oldStatuses => [...oldStatuses, "In Progress"])
                this.files.push(newFileUpload)
                //setFiles(oldFiles => [...oldFiles, newFileUpload])
                console.log(this.files)
                //perform the upload operation
                //get the presigned url for the upload
                var uploadURL = await this.getPresignedUploadURL(this.accountId + "/" + thisFile.name)
                console.log("GENERATED UPLOAD URL " + uploadURL)

                //perform a put on the url to upload
                await this.performUpload(uploadURL, newFileUpload, thisFile, i)

                if (i == acceptedFiles.length - 1) {
                    this.fileState = "Uploaded"
                    //setFileState("Uploaded")
                }
            }

        }
    },
    data: function () {
        return {
            files: [new UploadObject("Something_Else.xlsx", 39439, "In Progress", 0)],
            progress: 0,
            fileState: "In Progress",
            statuses: [],
            currentIndex: 0
        }
    }
}
</script>

<style scoped>
#mainContainer {
    width: 100%;
    height: 100%;
}

#focusContainer {
    display: flex;
    flex-direction: row;
}

#contentContainer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%
}

#uploadContainer {
    display: flex ;
    flex-direction: column;
    width: 400px;
    height: 100%;
    align-items: center;
    justify-content: center;
    margin-right: 90px;
}

#thumbsContainer {
    display: flex;
    flex-direction: column;
    margin-left: 50px;
    width: 450px;
}

#dragImage {
    width: 350 !important;
}

#uploader {
    display: none;
}
</style>