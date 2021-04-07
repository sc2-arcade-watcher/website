<template>
    <v-card class="card-t1">
        <v-card-text class="py-1">
            <h3 class="overline font-weight-bold">User reviews</h3>
        </v-card-text>

        <div v-if="response && response.results.length > 0">
            <list-nav-toolbar
                :current-pagination-result="response"
                :current-pagination-params="queryParams"
                :sort-options="sortOptions"
            />

            <div class="map-reviews-list">
                <map-review-item v-for="(item, i) in response.results" :key="i" :review="item"/>
            </div>

            <list-nav-toolbar :current-pagination-result="response" :current-pagination-params="queryParams"/>
        </div>

        <p class="px-2 mt-2" v-if="response && response.results.length === 0">No results</p>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import ProfileItem from '@/components/ProfileItem.vue';
import ListNavToolbar from '@/components/ListNavToolbar.vue';
import MapReviewItem from '@/components/MapReviewItem.vue';
import { SGuard } from '../../helpers';
import { subDays, formatISO } from 'date-fns';

@Component({
    components: {
        ProfileItem,
        MapReviewItem,
        ListNavToolbar,
    },
})
export default class MapPlayerBaseView extends Vue {
    private queryParams!: starc.MapUserReviewsParams & starc.CursorPaginationQuery;
    private response: starc.MapUserReviewsResponse | null = null;
    private sortOptions = [
        { value: 'updated,desc', text: 'Posted: Newest first' },
        { value: 'updated,asc', text: 'Posted: Oldest first' },
        { value: 'rating,desc', text: 'Most favorable' },
        { value: 'rating,asc', text: 'Most critical' },
        { value: 'helpful,desc', text: 'Most helpful' },
    ];
    private sortByValue!: string;

    @SGuard()
    private async refreshList() {
        this.response = (await this.$starc.getMapUserReviews(this.queryParams)).data;
    }

    private applyParamsFromRouteQuery() {
        this.queryParams = {
            regionId: Number(this.$route.params.regionId),
            mapId: Number(this.$route.params.mapId),
            orderBy: this.$route.query?.orderBy ? String(this.$route.query.orderBy) : 'updated',
            orderDirection: this.$route.query?.orderDirection ? String(this.$route.query.orderDirection) : 'desc',
            before: this.$route.query?.before ? String(this.$route.query?.before) : void 0,
            after: this.$route.query?.after ? String(this.$route.query?.after) : void 0,
            limit: this.$route.query?.limit ? Number(this.$route.query?.limit) : 50,
        };
        this.sortByValue = [this.queryParams.orderBy, this.queryParams.orderDirection].join(',');
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
