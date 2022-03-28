<template>
    <div id="container">
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
    </div>
</template>

<script>
import SettingsHeader from "../../settings/SettingsHeader.vue"
import KnowldegeHeader from "./KBDashboardHeader.vue"
import { mapGetters } from 'vuex';
import { VeTable } from 'vue-easytable';
import Spinner from "../../../../../shared/components/Spinner.vue"

export default {
    components: {
        SettingsHeader,
        KnowldegeHeader,
        VeTable,
        Spinner
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
                        /*return (
                            <div>
                               <woot-button 
                                    icon="edit" 
                                    size="tiny"
                                    v-tooltip="Annotate"
                                    style="margin-right: 10px;"
                                ></woot-button>
                                <woot-button 
                                    icon="eye-show" 
                                    size="tiny"
                                    v-tooltip="Preview"
                                ></woot-button>
                            </div>
                        );*/
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
            loading: false,
            modalTitle: "",
            modalContent: "",
            searchText: ""
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
            var filePath = this.accountId + "/" + thisFile.name
            var url = this.api + "kb/getPresignedURL?file_path=" + filePath + "&url_type=GET"
            const response = await fetch(url)
            const jsonResponse = await response.json()
            console.log(jsonResponse["get_url"])
        }
    },
    mounted: function () {
        //get the files with the url
        //var api = "https://ngvi1z9egk.execute-api.us-east-2.amazonaws.com/beta/"
        window.annotateClicked = this.annotateClicked
        var api = "http://127.0.0.1:5000/"
        //var url = api + "knowledgebase?company_id=" + this.accountId
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
</script>

<style lang="sass" scoped>
#container {
    width: 100%;
}

</style>