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
    },
    data: function () {
        return {
            
            searchText: ""
        }

    },
    methods: {

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

    },

}
</script>

<style lang="sass" scoped>
#container {
    width: 100%;
}

</style>