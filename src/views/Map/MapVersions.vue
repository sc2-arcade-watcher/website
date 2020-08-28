<template>
    <v-card class="py-2 px-2 card-t1">
        <v-data-iterator
            v-if="versionHistory && !mapDetails"
            :items="versionHistory.versions"
            :items-per-page.sync="itemsPerPage"
            :page="page"
            :search="search"
            :custom-filter="customFilter"
            :sort-by="['majorVersion', 'minorVersion']"
            :sort-desc="[true, true]"
            :multi-sort="true"
            hide-default-footer
        >
            <template v-slot:header>
                <v-toolbar
                    class="mb-1"
                    color="light-blue darken-4"
                >
                    <v-text-field
                        background-color="blue darken-4"
                        v-model="search"
                        clearable
                        flat
                        solo-inverted
                        hide-details
                        label="Search"
                        prepend-inner-icon="fa-search"
                        dense
                    ></v-text-field>
                </v-toolbar>
            </template>

            <template v-slot:default="props">
                <v-list-item v-for="item in props.items" :key="$starc.encodeMapVersion(item.majorVersion, item.minorVersion)" class="" dense>
                    <v-list-item-title>
                        v{{ item.majorVersion }}.{{ item.minorVersion }}
                    </v-list-item-title>
                    <v-list-item-subtitle style="text-transform: uppercase; font-weight: bold;">
                        <v-chip x-small color="blue-grey darken-2" v-if="item.isPrivate">Private</v-chip>
                        <v-chip x-small color="green darken-2" v-if="!item.isPrivate">Public</v-chip>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                        {{ $dfns.lightFormat(new Date(item.uploadedAt), 'yyyy-MM-dd HH:mm') }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                        <v-chip small color="green" outlined>{{ $helpers.formatBytes(item.archiveSize) }}</v-chip>
                    </v-list-item-subtitle>
                    <v-list-item-action-text class="d-flex flex-wrap flex-sm-nowrap">
                        <v-btn
                            tile
                            small
                            text
                            color="primary"
                            title="View details"
                            :to="{ name: 'map_versions', params: { regionId: versionHistory.regionId, mapId: versionHistory.bnetId}, query: { majorVersion: item.majorVersion, minorVersion: item.minorVersion } }"
                        >
                            <v-icon small>fas fa-info-circle</v-icon>
                        </v-btn>
                        <v-btn
                            tile
                            small
                            text
                            color="primary"
                            title="Download S2MA archive"
                            :href="$starc.depotLink(item.archiveHash, 's2ma', versionHistory.regionId)" target="_blank"
                        >
                            <v-icon small>fas fa-download</v-icon>
                        </v-btn>
                    </v-list-item-action-text>
                </v-list-item>
            </template>

            <template v-slot:footer>
                <v-container fluid>
                    <v-divider/>
                    <v-row class="mt-2" align="center" justify="center">
                        <span class="grey--text">Items per page</span>
                        <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    dark
                                    text
                                    color="primary"
                                    class="ml-2"
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    {{ itemsPerPage }}
                                    <v-icon>mdi-chevron-down</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item
                                    v-for="(number, index) in itemsPerPageArray"
                                    :key="index"
                                    @click="updateItemsPerPage(number)"
                                >
                                    <v-list-item-title>{{ number }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>

                        <v-spacer></v-spacer>

                        <span
                            class="mr-4
                            grey--text"
                        >
                            Page {{ page }} of {{ numberOfPages }}
                        </span>
                        <v-btn
                            color="blue darken-4"
                            tile
                            class="mr-1"
                            @click="formerPage"
                        >
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn
                            color="blue darken-4"
                            tile
                            class="ml-1"
                            @click="nextPage"
                        >
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
                    </v-row>
                </v-container>
            </template>
        </v-data-iterator>

        <div v-if="mapDetails">
            <h3>Version {{ mapDetails.majorVersion }}.{{ mapDetails.minorVersion }}</h3>
            <v-divider/>
            <pre class="my-4" style="max-width: 100%; overflow-x: scroll; font-size: 0.9rem; border: 2px solid #111;">{{ JSON.stringify(mapDetails, void 0, '\t') }}</pre>
        </div>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';

@Component
export default class MapVersionsView extends Vue {
    private mapDetails: starc.MapDetails | null = null;
    private versionHistory: starc.MapVersionHistory | null = null;
    private itemsPerPage = 20;
    private itemsPerPageArray = [20, 40, 60, 80, 100, 150, 200];
    private page = 1;
    private search = '';

    private get numberOfPages() {
        return Math.ceil(this.versionHistory!.versions.length / this.itemsPerPage)
    }

    private nextPage() {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
    }

    private formerPage() {
        if (this.page - 1 >= 1) this.page -= 1
    }

    private updateItemsPerPage(number: number) {
        this.itemsPerPage = number
        this.page = 1;
    }

    private customFilter(items: starc.MapHeader[], search: string) {
        return items.filter(x => {
            const currVer = `v${x.majorVersion}.${x.minorVersion}`;
            if (currVer.indexOf(search) !== -1) return true;

            const dateUploaded = this.$dfns.lightFormat(new Date(x.uploadedAt), 'yyyy-MM-dd')
            if (dateUploaded.indexOf(search) !== -1) return true;

            return false;
        });
    }

    @SGuard()
    private async fetchHistory() {
        this.versionHistory = (await this.$starc.getMapVersionHistory(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId)
        )).data;
    }

    private async loadMapDetails() {
        this.mapDetails = (await this.$starc.getMapDetails(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId),
            {
                majorVersion: Number(this.$route.query.majorVersion),
                minorVersion: Number(this.$route.query.minorVersion),
            }
        )).data;
    }
    @Watch('$route')
    private reloadMapDetails() {
        if (typeof this.$route.query.majorVersion !== 'undefined' && typeof this.$route.query.minorVersion !== 'undefined') {
            this.loadMapDetails();
        }
        else {
            this.mapDetails = null;
        }
    }

    private async created() {
        await this.fetchHistory();
        await this.reloadMapDetails();
    }
}
</script>
