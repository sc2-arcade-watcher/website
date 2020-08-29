
<template>
    <v-card class="py-2 px-2 card-t1">
        <div v-if="lobbiesHistory && lobbiesHistory.results.length > 0">
            <v-simple-table dense>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Map / Mod</th>
                            <th>Title</th>
                            <th>Host</th>
                            <th>Players</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in lobbiesHistory.results" :key="item.bnetRecordId">
                            <td>
                                <template v-if="item.status === 'started'">
                                    <v-icon color="green" small title="Started">fas fa-calendar-check</v-icon>
                                </template>
                                <template v-else-if="item.status === 'abandoned'">
                                    <v-icon color="red" small title="Abandoned">fas fa-calendar-times</v-icon>
                                </template>
                                <template v-else-if="item.status === 'open'">
                                    <v-icon color="yellow" small title="Open">fas fa-hourglass-start</v-icon>
                                </template>
                                <template v-else-if="item.status === 'unknown'">
                                    <v-icon color="grey" small title="Unknown">fas fa-question-circle</v-icon>
                                </template>
                            </td>
                            <td class="text-left">
                                <template v-if="item.map && item.map.bnetId !== mapId">
                                    <router-link
                                        class="d-inline-block"
                                        :title="item.map.name"
                                        :to="{ name: 'map_details', params: { regionId: item.map.regionId, mapId: item.map.bnetId } }"
                                    >
                                        <v-img
                                            :src="$starc.bnetDepotImage(item.map.iconHash)"
                                            max-width="80"
                                            height="50"
                                            contain
                                            class="float-left my-0 mt-1"
                                        />
                                    </router-link>
                                </template>
                                <template v-if="item.extMod && item.extMod.bnetId !== mapId">
                                    <router-link
                                        class="d-inline-block"
                                        :title="item.extMod.name"
                                        :to="{ name: 'map_details', params: { regionId: item.extMod.regionId, mapId: item.extMod.bnetId } }"
                                    >
                                        <!-- <v-img
                                            :src="$starc.bnetDepotImage(item.extMod.iconHash)"
                                            max-width="80"
                                            height="50"
                                            contain
                                            class="float-left my-0 mt-1"
                                        /> -->
                                        {{ item.extMod.name }}
                                    </router-link>
                                </template>
                            </td>
                            <td>
                                {{ item.lobbyTitle }}
                            </td>
                            <td>
                                {{ item.hostName }}
                            </td>
                            <td>
                                <v-tooltip top v-if="item.status === 'started'">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            {{ item.slots.filter(x => x.kind === 'human').length }}&nbsp;/&nbsp;{{ item.slots.filter(x => x.kind !== 'ai').length }}
                                        </span>
                                    </template>
                                    <ol>
                                        <li v-for="slot in item.slots.filter(x => x.kind !== 'open')" :key="slot.slotNumber">
                                            <span v-if="slot.kind === 'ai'">AI</span>
                                            <span v-else><strong>{{ slot.name }}</strong></span>
                                        </li>
                                    </ol>
                                </v-tooltip>
                            </td>
                            <td>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            {{ $dfns.formatDistanceStrict(new Date(item.closedAt), new Date(), {
                                                addSuffix: true,
                                                roundingMethod: 'floor'}) }}
                                        </span>
                                    </template>
                                    <span>{{ $dfns.formatISO9075(new Date(item.closedAt), { representation: 'complete' }) }}</span>
                                </v-tooltip>
                            </td>
                            <td>
                                <v-btn
                                    tile
                                    small
                                    text
                                    color="primary"
                                    title="View details"
                                    :to="{
                                        name: 'lobby',
                                        params: {
                                            regionId: $route.params.regionId,
                                            bnetBucketId: item.bnetBucketId,
                                            bnetRecordId: item.bnetRecordId,
                                        },
                                    }"
                                >
                                    <v-icon small>fas fa-info-circle</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

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
                        :disabled="!lobbiesHistory.page.prev"
                        @click="pageGo('prev')"
                    >
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                        color="blue darken-4"
                        tile
                        class="ml-1"
                        :disabled="!lobbiesHistory.page.next"
                        @click="pageGo('next')"
                    >
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-row>
            </v-container>
        </div>

        <p v-if="lobbiesHistory && lobbiesHistory.results.length === 0">No public lobbies recorded</p>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';

@Component
export default class MapLobbiesHistoryView extends Vue {
    private itemsPerPageArray = [20, 40, 60, 80, 100, 150, 200];
    private currentPaginationParams!: starc.CursorPaginationQuery;
    private mapRegionId: number | null = null;
    private mapId: number | null = null;
    private lobbiesHistory: any | null = null;

    @SGuard()
    private async refreshList() {
        this.lobbiesHistory = (await this.$starc.getMapLobbiesHistory(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId),
            {
                ...this.currentPaginationParams,
            }
        )).data;
    }

    private renavigate() {
        this.$router.push({
            name: this.$route.name!,
            query: {
                ...(Object.fromEntries(Object.entries(this.currentPaginationParams).filter(x => x[1] !== null && x[1] !== void 0).map<[string, string]>(x => [ x[0], String(x[1]) ]))),
            },
        });
    }

    private updateItemsPerPage(n: number) {
        this.currentPaginationParams.limit = n;
        this.renavigate();
    }

    private applyParamsFromRouteQuery() {
        this.mapRegionId = Number(this.$route.params.regionId);
        this.mapId = Number(this.$route.params.mapId);
        this.currentPaginationParams = {
            before: this.$route.query?.before ? String(this.$route.query?.before) : void 0,
            after: this.$route.query?.after ? String(this.$route.query?.after) : void 0,
            limit: this.$route.query?.limit ? Number(this.$route.query?.limit) : this.itemsPerPageArray[0],
        };
    }

    private pageGo(where: 'prev' | 'next') {
        this.currentPaginationParams.before = void 0;
        this.currentPaginationParams.after = void 0;
        if (where === 'next' && this.lobbiesHistory!.page.next) {
            this.currentPaginationParams.after = this.lobbiesHistory!.page.next;
        }
        else if (where === 'prev' && this.lobbiesHistory!.page.prev) {
            this.currentPaginationParams.before = this.lobbiesHistory!.page.prev;
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

<style lang="scss" scoped>
.v-data-table {
    background: transparent !important;
}
</style>
