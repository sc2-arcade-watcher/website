<template>
    <v-card class="card-t1" v-show="matchHistoryResponse">
        <div v-if="matchHistoryResponse && matchHistoryResponse.results.length > 0">
            <v-simple-table dense fixed-header>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Type</th>
                            <th>Result</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in matchHistoryResponse.results" :key="i">
                            <td>
                                <profile-item :profile="item.profile"/>
                            </td>
                            <td class="match-type">
                                <span class="text--secondary overline">{{ item.type }}</span>
                            </td>
                            <td>
                                <span :class="`overline font-weight-bold match-decision-${item.decision}`">{{ item.decision }}</span>
                            </td>
                            <td>
                                <v-tooltip top transition="fade-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span class="font-weight-light" v-bind="attrs" v-on="on">
                                            {{ $dfns.formatISO9075(new Date(item.date), { representation: 'complete' }) }}
                                        </span>
                                    </template>
                                    <span>
                                        {{ $dfns.formatDistanceStrict(new Date(item.date), new Date(), {
                                            addSuffix: true,
                                            roundingMethod: 'floor'}) }}
                                    </span>
                                </v-tooltip>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

            <v-divider/>
            <list-nav-toolbar :current-pagination-result="matchHistoryResponse" :current-pagination-params="queryParams"/>
        </div>

        <p class="px-2 mt-2" v-if="matchHistoryResponse && matchHistoryResponse.results.length === 0">No results</p>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import ProfileItem from '@/components/ProfileItem.vue';
import ListNavToolbar from '@/components/ListNavToolbar.vue';
import { SGuard } from '../../helpers';

@Component({
    components: {
        ProfileItem,
        ListNavToolbar,
    },
})
export default class MapMatchHistoryView extends Vue {
    private queryParams!: starc.MapMatchHistoryParams & starc.CursorPaginationQuery;
    private matchHistoryResponse: starc.MapMatchHistoryResponse | null = null;

    @SGuard()
    private async refreshList() {
        this.matchHistoryResponse = (await this.$starc.getMapMatchHistory(this.queryParams)).data;
    }

    private applyParamsFromRouteQuery() {
        this.queryParams = {
            regionId: Number(this.$route.params.regionId),
            mapId: Number(this.$route.params.mapId),
            orderBy: this.$route.query?.orderBy ? String(this.$route.query.orderBy) : void 0,
            orderDirection: this.$route.query?.orderDirection ? String(this.$route.query.orderDirection) : void 0,
            before: this.$route.query?.before ? String(this.$route.query?.before) : void 0,
            after: this.$route.query?.after ? String(this.$route.query?.after) : void 0,
            limit: this.$route.query?.limit ? Number(this.$route.query?.limit) : void 0,
        };
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
