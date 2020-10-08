
<template>
    <v-card class="card-t1">
        <div v-if="lobbyHistoryResponse && lobbyHistoryResponse.results.length > 0">
            <lobby-history-list :lobbies-history="lobbyHistoryResponse.results"/>

            <v-container fluid>
                <v-divider/>
                <v-col>
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
                                    {{ currentPaginationParams.limit }}
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

                        <v-btn
                            color="blue darken-4"
                            tile
                            class="mr-1"
                            :disabled="!lobbyHistoryResponse.page.prev"
                            @click="pageGo('prev')"
                        >
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn
                            color="blue darken-4"
                            tile
                            class="ml-1"
                            :disabled="!lobbyHistoryResponse.page.next"
                            @click="pageGo('next')"
                        >
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
            </v-container>
        </div>

        <p class="px-2 mt-2" v-if="lobbyHistoryResponse && lobbyHistoryResponse.results.length === 0">No public lobbies recorded</p>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import LobbyHistoryList from '@/components/LobbyHistoryList.vue';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';

@Component({
    components: {
        LobbyHistoryList,
    },
})
export default class MapLobbiesHistoryView extends Vue {
    private itemsPerPageArray = [20, 40, 60, 80, 100, 150, 200];
    private currentPaginationParams!: starc.CursorPaginationQuery;
    private lobbyHistoryResponse: starc.LobbyHistoryListResponse | null = null;

    @SGuard()
    private async refreshList() {
        this.lobbyHistoryResponse = (await this.$starc.getMapLobbiesHistory({
            ... {
                regionId: Number(this.$route.params.regionId),
                mapId: Number(this.$route.params.mapId),
            },
            ...this.currentPaginationParams,
        })).data;
    }

    private renavigate() {
        this.$router.push({
            name: this.$route.name!,
            query: {
                ...this.$helpers.stringifyQueryParams(this.currentPaginationParams),
            },
        });
    }

    private updateItemsPerPage(n: number) {
        this.currentPaginationParams.limit = n;
        this.renavigate();
    }

    private applyParamsFromRouteQuery() {
        this.currentPaginationParams = {
            before: this.$route.query?.before ? String(this.$route.query?.before) : void 0,
            after: this.$route.query?.after ? String(this.$route.query?.after) : void 0,
            limit: this.$route.query?.limit ? Number(this.$route.query?.limit) : this.itemsPerPageArray[0],
        };
    }

    private pageGo(where: 'prev' | 'next') {
        this.currentPaginationParams.before = void 0;
        this.currentPaginationParams.after = void 0;
        if (where === 'next' && this.lobbyHistoryResponse!.page.next) {
            this.currentPaginationParams.after = this.lobbyHistoryResponse!.page.next;
        }
        else if (where === 'prev' && this.lobbyHistoryResponse!.page.prev) {
            this.currentPaginationParams.before = this.lobbyHistoryResponse!.page.prev;
        }
        else return;
        this.renavigate();
    }

    @Watch('$route')
    private async watchRoute() {
        this.applyParamsFromRouteQuery();
        await this.refreshList();
    }

    private async created() {
        this.applyParamsFromRouteQuery();
        await this.refreshList();
    }
}
</script>
