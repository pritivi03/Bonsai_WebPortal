<template>
    <div id="container" style="overflow: auto;">
        <knowldege-header
            :onInputSearch="onSearchSubmit"
            :deleteDisabled="anyFilesSelected"
            :downloadDisabled="anyFilesSelected"
            :deleteClicked="deleteClicked"
        ></knowldege-header>
        <ve-table 
            :columns="columns"
            :table-data="filteredTableData"
            :checkbox-option="checkboxOption"
            row-key-field-name="rowKey"
            :virtual-scroll-option="virtualScrollOption"
        />
        <woot-modal
            :show="loading"
            noClose="true"
        >
            <woot-modal-header
                :header-title="modalTitle"
                :header-content="modalContent"
            />
            <div
                style="width: 40 rem; display: flex; flex-direction: row; justify-content: center; margin-top: 30px; margin-bottom: 30px;"
            >
                <spinner size="size"/>
            </div>
            <!-- <div
            class="modal-footer delete-item"
            >
            <button
                class="button success large expanded nice"
                @click="$emit('show-create-account-modal')"
            >
                {{ $t('CREATE_ACCOUNT.NEW_ACCOUNT') }}
            </button>
            </div> -->
        </woot-modal>

        <woot-modal
            :show="showAnnotationModal"
            noClose="true"
            size="medium"
        >
            <woot-modal-header
                :header-title="modalTitle"
                :header-content="modalContent"
            />
            <div
                style="display: flex; flex-direction: row; justify-content: center; margin: 30px;"
            >
                <form class="row" @submit.prevent="addAgent()" style="padding: 8px; ">
                    <div class="medium-12 columns" style="height: 300px; box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5); padding: 15px;">
                        <annotation-highlight 
                            :text="textToRender" 
                            :annotations="annotationsToHighlight"
                            :highlightComponent="MyHighlightComponent"
                            :highlightStyle="{
                                backgroundColor: 'lightblue', 
                                border: '1px solid lightblue',        
                                borderRadius: '4px'
                            }"
                            style="font-size: 12px;"
                        />
                    </div>

                    <!-- <div class="medium-1 columns" style="">
                        
                    </div>

                    <div class="medium-7 columns" style="background-color: lightgray; border-radius: 8px; padding: 8px;">
                        
                    </div> -->
                    
                    <div class="modal-footer"  style="width: 100%; margin-top: 15px;">
                        <div class="medium-12 columns" style="display: flex; flex-direction: row; justify-content: space-between; width: 100%;">
                            <button class="button clear" @click.prevent="annotateButtonInModalClicked">
                                Annotate
                            </button>
                            <div>
                                <button class="button clear" @click.prevent="onClose">
                                    Cancel
                                </button>

                                <woot-submit-button
                                    button-text="Finish"
                                />
                            </div>
                            
                            
                        </div>
                    </div>
                </form>
                
            </div>
            <!-- <div
            class="modal-footer delete-item"
            >
            <button
                class="button success large expanded nice"
                @click="$emit('show-create-account-modal')"
            >
                {{ $t('CREATE_ACCOUNT.NEW_ACCOUNT') }}
            </button>
            </div> -->
        </woot-modal>
    </div>
</template>

<script>
import SettingsHeader from "../../settings/SettingsHeader.vue"
import KnowldegeHeader from "./KBDashboardHeader.vue"
import { mapGetters } from 'vuex';
import { VeTable } from 'vue-easytable';
import Spinner from "../../../../../shared/components/Spinner.vue"
import { AnnotationHighlight } from 'vue-annotation-highlight'
import MyHighlightComponent from "./MyHighlightComponent.vue"

export default {
    components: {
        SettingsHeader,
        KnowldegeHeader,
        VeTable,
        Spinner,
        "annotation-highlight": AnnotationHighlight,
    },
    computed: {
        ...mapGetters({
            accountId: 'getCurrentAccountId',
        }),
        anyFilesSelected() {
            return (this.selectedRowKeys.length <= 0);
        }
    },
    data: function () {
        return {
            columns: [
                {
                    field: "",
                        key: "a",
                        // type=checkbox
                        type: "checkbox",
                        title: "",
                        width: 50,
                        align: "center",
                },
                {
                    field: "file_name",
                    key: "b",
                    title: "Name",
                    align: "left",
                },
                {
                    field: "uploaded_date",
                    key: "c",
                    title: "Date",
                    align: "left",
                    renderBodyCell: ({ row, column, rowIndex }, h) => {
                        return (
                            <span>
                                {new Date(this.tableData[rowIndex]["uploaded_date"]).toLocaleString()}
                            </span>
                        );
                    },
                },
                {
                    field: "file_size",
                    key: "d",
                    title: "Size",
                    align: "left",
                    renderBodyCell: ({ row, column, rowIndex }, h) => {
                        return (
                            <span>
                                {this.bytesToSize(this.tableData[rowIndex]["file_size"])}
                            </span>
                        );
                    },
                },
                {
                    field: "actions",
                    key: "e",
                    title: "Actions",
                    align: "center",
                    renderBodyCell: ({ row, column, rowIndex }, h) => {
                        const self = this
                        return h('div', [
                            h('woot-button', {
                                props: {icon: "edit", size: "tiny", title: "Annotate"},
                                style: {marginRight: '10px'},
                                on: {
                                    click: function () {
                                        self.annotateClicked(rowIndex)
                                    }
                                }
                            }),
                            h('woot-button', {
                                props: {icon: "eye-show", size: "tiny"},
                                on: {
                                    click: function () {
                                        self.previewClicked(rowIndex)
                                    }
                                }
                            })
                        ])
                    }, 
                }
            ],
            tableData: [],
            filteredTableData: [],
            searchQuery: "",
            selectedRowKeys: [],
            checkboxOption: {
                // row select change event
                selectedRowChange: ({ row, isSelected, selectedRowKeys }) => {
                    this.selectedRowKeys = selectedRowKeys
                    console.log("Single Selection")
                    console.log(row, isSelected, selectedRowKeys);
                },
                // selected all change event
                selectedAllChange: ({ isSelected, selectedRowKeys }) => {
                    this.selectedRowKeys = selectedRowKeys
                    console.log("Selected ALL")
                    console.log(isSelected, selectedRowKeys);
                },
            },
            fetchData: true,
            loading: false,
            showAnnotationModal: false,
            modalTitle: "Annotating XYZDocument.txt",
            modalContent: "Highlight any part of the document and click on the 'Annotate' button. Click on an annotation to delete it.",
            searchText: "",
            textToRender: 'An annotation is extra information associated with a particular point in a document or other piece of information.',
            annotationsToHighlight: [
                { begin: 3, length: 10, source:'PRED', confidence:'0.9' },
                { begin: 53, length: 16, source:'PRED', confidence:'0.7' }
            ],
            MyHighlightComponent: MyHighlightComponent,
            virtualScrollOption: {
                    enable: false,
            },

        }

    },
    methods: {
        onSearchSubmit(event) {
            var searchQuery = event.target.value
            if (searchQuery === '') {
                this.filteredTableData = this.tableData
            } else {
                this.filteredTableData = this.tableData.filter((item)=>{
                    return item["file_name"].toLowerCase().includes(searchQuery.toLowerCase())
                })
            }
        },
        bytesToSize(bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0 Byte';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        },
        makeRequest(method, url, data) {
            return new Promise(function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.open(method, url, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };
                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };
                xhr.send(JSON.stringify(data));
            });
        },

        async deleteClicked() {
            //using the selected row keys call the delete method on all those ones
            this.modalTitle = "Deleting..."
            this.modalContent = "Sprucing your trees with some water and sunlight."
            this.loading = true
            var api = "http://127.0.0.1:5000/"
            var selected_files = this.tableData.filter(row => {
                return this.selectedRowKeys.includes(row["file_id"]);
            })

            var file_names = selected_files.map(row => row['file_name']);
            var file_paths = selected_files.map(row => this.accountId + "/" + row['file_name'])
            var file_ids = selected_files.map(row => row["file_id"])

            //delete from ml model
            var deleteResponse = await this.makeRequest("POST", api + "kb/deleteFiles", {files: file_names})

            //delete from dynamodb
            var deleteDBResponse = await this.makeRequest("POST", api + "kb/deleteFilesDB", {files: file_ids, company_id: this.accountId})

            //delete from s3
            var deleteS3Response = await this.makeRequest("POST", api + "kb/deleteFilesS3", {files: file_paths})
            
            this.loading = false
            window.location = `/app/accounts/${this.accountId}/knowledge-base`
        },
        annotateClicked(index) {
            console.log(index)
        },
        async previewClicked(index) {
            //call the backend to request a download url for this file
            var api = "http://127.0.0.1:5000/"
            var thisFile = this.filteredTableData[index]
            var filePath = this.accountId + "/" + thisFile["file_name"]
            var url = api + "kb/getPresignedURL?file_path=" + filePath + "&url_type=GET"
            const response = await fetch(url).catch((error) => console.log(error))
            const jsonResponse = await response.json()
            var file_url = jsonResponse["body"]["get_url"]
            //now take this 
            var docs_viewer_url = "https://docs.google.com/viewer?url=" + encodeURIComponent(file_url)
            window.open(docs_viewer_url, "_blank")
        },
        getAnnotationColor: function(annotation) {
            const classToColor = {
                'process': '#f44283',
                'tool': '#41acf4',
            }
            const color = classToColor[annotation.class]
            return color  // Must return hex value
        },
        getSpanClasses: function(span) {
            const classes = ['my-span-class']
            const annotationIds = span.annotationIds
            if (annotationIds.length > 0) {
                classes.push('annotated')
            }
            return classes
        },
        onClose: function () {
            this.showAnnotationModal = false;
        },
        annotateButtonInModalClicked: function() {
            console.log(window.getSelection())
            var selection = window.getSelection()
            var thisBit = window.getSelection()['anchorNode']['textContent']
            var start = this.textToRender.indexOf(thisBit) + selection['anchorOffset'];
            var end = this.textToRender.indexOf(thisBit) + selection['extentOffset']
            this.annotationsToHighlight.push({begin: start, length: end-start+1, question: this.textToRender.substring(start, end+1)})
            console.log(this.textToRender.substring(start, end+1))
            //use anchorNode and anchorOffset in getSelection 
        }
    },
    mounted: function () {
        //get the files with the url
        //var api = "https://ngvi1z9egk.execute-api.us-east-2.amazonaws.com/beta/"
        window.annotateClicked = this.annotateClicked
        var api = "http://127.0.0.1:5000/"
        //var url = api + "knowledgebase?company_id=" + this.accountId
        if (this.fetchData) {
            var url = api + "kb/getFiles?company_id=" + this.accountId
            const self = this;
            fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                var row_data = jsonResponse["body"].map((obj, index)=> ({ ...obj, rowKey: obj["file_id"]}))
                self.tableData = row_data
                self.filteredTableData = row_data
                console.log(self.tableData)
            });
        }
    }
}
</script>

<style lang="scss" scoped>
#container {
    width: 100%;
}

.my-span-class:hover {
  outline: 1px solid black;
}
.annotated {
  font-weight: bold;  
}

.modal-container {
    width: 80rem !important;
}


</style>