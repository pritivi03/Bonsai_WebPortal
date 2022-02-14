<template>
    <div id="container">
        <knowldege-header
            :searchQuery="searchQuery"
            :onSearchSubmit="onSearchSubmit"
        ></knowldege-header>
        <ve-table 
            :columns="columns"
            :table-data="tableData"
        />
    </div>
</template>

<script>
import SettingsHeader from "../../settings/SettingsHeader.vue"
import KnowldegeHeader from "./KBDashboardHeader.vue"
import { mapGetters } from 'vuex';
import { VeTable } from 'vue-easytable';

export default {
    components: {
        SettingsHeader,
        KnowldegeHeader,
        VeTable
    },
    computed: {
        ...mapGetters({
            accountId: 'getCurrentAccountId',
        })
    },
    data: function () {
        return {
            columns: [
                {
                    field: "checkbox",
                    key: "checkbox",
                    title: "",
                    align: "left",
                    width: 100,
                },
                {
                    field: "file_name",
                    key: "name",
                    title: "Name",
                    align: "left",
                },
                {
                    field: "uploaded_date",
                    key: "date",
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
                    key: "size",
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
            ],
            tableData: [],
            searchQuery: ""
        }
    },
    methods: {
        onSearchSubmit() {
            console.log(this.searchQuery)
        },
        bytesToSize(bytes) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return '0 Byte';
            var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }
    },
    mounted: function () {
        //get the files with the url
        var api = "https://ngvi1z9egk.execute-api.us-east-2.amazonaws.com/beta/"
        var url = api + "knowledgebase?company_id=" + this.accountId
        const self = this;
        fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            // do something with jsonResponse
            self.tableData = jsonResponse
            console.log(jsonResponse)
        });
    }
}
</script>

<style lang="sass" scoped>
#container {
    width: 100%;
}

</style>