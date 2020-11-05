<template>
    <v-card class="card-t1">
        <div v-if="matchHistoryResponse && matchHistoryResponse.results.length > 0">
            <v-simple-table dense fixed-header>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th>Map</th>
                            <th>Type</th>
                            <th>Result</th>
                            <th>Date</th>
                            <th>Lobby</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in matchHistoryResponse.results" :key="i">
                            <td class="px-0">
                                <template v-if="item.map">
                                    <v-btn
                                        tile
                                        large
                                        text
                                        color="primary accent-1"
                                        style="text-transform: none !important; padding-left: 0; padding-right: 10px;"
                                        :title="item.map.name"
                                        :to="{ name: 'map_base', params: { regionId: item.map.regionId, mapId: item.map.bnetId } }"
                                    >
                                        <v-img
                                            :src="$starc.depotImage(item.map.iconHash, item.map.regionId).url"
                                            max-width="70"
                                            height="35"
                                            contain
                                            class="float-left my-0"
                                        />
                                        {{ item.map.name }}
                                    </v-btn>
                                </template>
                            </td>
                            <td class="match-type">
                                <span class="text--secondary overline">{{ item.type }}</span>
                            </td>
                            <td>
                                <span :class="`overline font-weight-bold match-decision-${item.decision}`">{{ item.decision }}</span>
                            </td>
                            <td class="text-no-wrap font-weight-light">
                                <v-tooltip top transition="fade-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            {{ $dfns.formatDistanceStrict(new Date(item.date), new Date(), {
                                                addSuffix: true,
                                                roundingMethod: 'floor'}) }}
                                        </span>
                                    </template>
                                    <span>{{ $dfns.formatISO9075(new Date(item.date), { representation: 'complete' }) }}</span>
                                </v-tooltip>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

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
                            :disabled="!matchHistoryResponse.page.prev"
                            @click="pageGo('prev')"
                        >
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn
                            color="blue darken-4"
                            tile
                            class="ml-1"
                            :disabled="!matchHistoryResponse.page.next"
                            @click="pageGo('next')"
                        >
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
                    </v-row>
                </v-col>
            </v-container>
        </div>

        <p class="px-2 mt-2" v-if="matchHistoryResponse && matchHistoryResponse.results.length === 0">No results</p>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';
import ProfileBaseView from './Base.vue';

@Component
export default class ProfileMatchHistoryView extends Vue {
    private itemsPerPageArray = [20, 40, 60, 80, 100, 150, 200];
    private currentPaginationParams!: starc.CursorPaginationQuery;
    private matchHistoryResponse: starc.ProfileMatchHistoryResponse | null = null;

    @SGuard({
        onHttpError: function (this, err) {
            if (err.response!.status === 403) {
                (this.$parent as ProfileBaseView).isAccessRestricted = true;
                return true;
            }
        }
    })
    private async refreshList() {
        const profParams = {
            regionId: Number(this.$route.params.regionId),
            realmId: Number(this.$route.params.realmId),
            profileId: Number(this.$route.params.profileId),
        };
        this.matchHistoryResponse = (await this.$starc.getProfileMatches({
            ...profParams,
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
        if (where === 'next' && this.matchHistoryResponse!.page.next) {
            this.currentPaginationParams.after = this.matchHistoryResponse!.page.next;
        }
        else if (where === 'prev' && this.matchHistoryResponse!.page.prev) {
            this.currentPaginationParams.before = this.matchHistoryResponse!.page.prev;
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
@import '~vuetify/src/styles/settings/_index';

.match-type span {
    font-weight: 500 !important;
    letter-spacing: 1px !important;
}

.match-decision {
    &-left {
        color: map-get($grey, 'darken-1');
    }
    &-win {
        color: map-get($green, 'base');
    }
    &-loss {
        color: map-get($red, 'darken-1');
    }
    &-tie {
        color: map-get($blue, 'lighten-3');
    }
    &-observer {
        color: map-get($blue, 'darken-2');
    }
}
</style>
