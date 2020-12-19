<template>
    <v-card class="card-t1">
        <v-card-text class="py-1">
            <h3 class="overline font-weight-bold">Browse player base</h3>
        </v-card-text>

        <v-card
            elevation
            raised
            class=""
        >
            <v-form
                class="search-toolbar py-2 my-0 mx-2 d-flex flex-wrap flex-md-nowrap align-center justify-space-between"
                @submit.prevent="onSubmit"
            >
                <v-text-field
                    clearable
                    dense
                    hide-details
                    label="Name"
                    prepend-icon="fa-search"
                    v-model="queryParams.name"
                    @input="onInput"
                />

                <v-menu
                    ref="menuLastPlayedMin"
                    v-model="menuLastPlayedMin"
                    :close-on-content-click="false"
                    :return-value.sync="queryParams.lastPlayedMin"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            clearable
                            dense
                            hide-details
                            label="Last time played min."
                            prepend-icon="mdi-calendar"
                            readonly
                            v-model="queryParams.lastPlayedMin"
                            v-bind="attrs"
                            v-on="on"
                            @input="onSubmit"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        v-model="queryParams.lastPlayedMin"
                        no-title
                        scrollable
                    >
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="menuLastPlayedMin = false"
                        >
                            Cancel
                        </v-btn>
                        <v-btn
                            text
                            color="primary"
                            @click="$refs.menuLastPlayedMin.save(queryParams.lastPlayedMin); onSubmit();"
                        >
                            OK
                        </v-btn>
                    </v-date-picker>
                </v-menu>

                <v-select
                    dense
                    hide-details
                    prepend-icon="fa-filter"
                    label="Sort by"
                    v-model="sortByValue"
                    :items="sortByList"
                    required
                    @change="onSubmit"
                />

                <v-btn
                    class="d-none"
                    type="submit"
                    small
                    tile
                    color="primary darken-3"
                >
                    Refresh
                </v-btn>
            </v-form>
        </v-card>

        <div v-if="playerBaseResponse && playerBaseResponse.results.length > 0">
            <v-simple-table dense fixed-header>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="overline px-0"></th>
                            <th class="overline">Player</th>
                            <th class="overline text-right">
                                <v-tooltip top transition="fade-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            <v-icon size="20">mdi-database-clock</v-icon>
                                        </span>
                                    </template>
                                    <span>Time spent waiting in public lobbies</span>
                                </v-tooltip>
                            </th>
                            <th class="overline text-right">
                                <v-tooltip top transition="fade-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            <v-icon size="20">mdi-lightning-bolt</v-icon>
                                        </span>
                                    </template>
                                    <span>Number of public games in total</span>
                                </v-tooltip>
                            </th>
                            <th class="overline text-right">
                                <v-tooltip top transition="fade-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            <v-icon size="20">mdi-calendar-range-outline</v-icon>
                                        </span>
                                    </template>
                                    <span>Average number of public games per day</span>
                                </v-tooltip>
                            </th>
                            <th class="overline text-right">
                                <v-tooltip top transition="fade-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            <v-icon size="20">mdi-routes-clock</v-icon>
                                        </span>
                                    </template>
                                    <span>Time spent waiting in self hosted public lobbies</span>
                                </v-tooltip>
                            </th>
                            <th class="overline text-right">
                                <v-tooltip top transition="fade-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            <v-icon size="20">mdi-lighthouse-on</v-icon>
                                        </span>
                                    </template>
                                    <span>Number of hosted public games in total</span>
                                </v-tooltip>
                            </th>
                            <th class="overline text-right">
                                <v-tooltip top transition="fade-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            <v-icon size="20">mdi-table-eye</v-icon>
                                        </span>
                                    </template>
                                    <span>Last time seen in public game</span>
                                </v-tooltip>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in playerBaseResponse.results" :key="i">
                            <td class="px-0 text-right">
                                <span class="font-weight-medium text--secondary">{{ i + 1 }}.</span>
                            </td>
                            <td>
                                <profile-item :profile="item.profile"/>
                            </td>
                            <td class="text-right">
                                <span class="text--secondary" style="font-family: monospace;">
                                    {{ formatRelativeTime(item.timeSpentWaiting) }}
                                </span>
                            </td>
                            <td class="text-right">
                                <v-tooltip top transition="fade-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            <span
                                                class="body-1 font-weight-bold red--text text--lighten-2"
                                                v-if="item.lobbiesStarted > 0"
                                            >
                                                {{ item.lobbiesStarted }}
                                            </span>
                                            <span class="font-weight-medium text--secondary" v-else>
                                                0
                                            </span>
                                        </span>
                                    </template>
                                    <span>
                                        <span
                                            class="red--text text--lighten-2"
                                            v-if="item.lobbiesStarted > 0"
                                        >
                                            <strong>{{ (item.lobbiesStarted / item.lobbiesJoined * 100).toFixed(1) }}%</strong>
                                            have started
                                            (out of <strong>{{ item.lobbiesJoined }}</strong> total joined)
                                        </span>
                                    </span>
                                </v-tooltip>
                            </td>
                            <td class="text-right">
                                <span
                                    class="body-2 font-weight-medium red--text text--lighten-3"
                                    v-if="item.lobbiesStartedDiffDays > 0"
                                >
                                    {{ (item.lobbiesStarted / item.lobbiesStartedDiffDays).toFixed(1) }}
                                </span>
                                <span class="font-weight-medium text--secondary" v-else>
                                    0
                                </span>
                            </td>
                            <td class="text-right">
                                <span class="text--secondary" style="font-family: monospace;">
                                    {{ formatRelativeTime(item.timeSpentWaitingAsHost) }}
                                </span>
                            </td>
                            <td class="text-right">
                                <v-tooltip top transition="fade-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            <span
                                                class="body-1 font-weight-bold lime--text text--lighten-2"
                                                v-if="item.lobbiesHostedStarted > 0"
                                            >
                                                {{ item.lobbiesHostedStarted }}
                                            </span>
                                            <span class="font-weight-medium text--secondary" v-else>
                                                0
                                            </span>
                                        </span>
                                    </template>
                                    <span>
                                        <span
                                            class="lime--text text--lighten-2"
                                            v-if="item.lobbiesHostedStarted > 0"
                                        >
                                            <strong>{{ (item.lobbiesHostedStarted / item.lobbiesHosted * 100).toFixed(1) }}%</strong>
                                            have started
                                            (out of <strong>{{ item.lobbiesHosted }}</strong> total hosted)
                                        </span>
                                    </span>
                                </v-tooltip>
                            </td>
                            <td class="text-right">
                                <span class="font-weight-light text--secondary" v-if="!item.lastPlayedAt.getTime()">Never</span>
                                <span
                                    class="green--text text--darken-1"
                                    v-else-if="(new Date()).getTime() - item.lastPlayedAt.getTime() < 3600 * 24 * 1000"
                                >
                                    Today
                                </span>
                                <v-tooltip top transition="fade-transition" v-else-if="item.lastPlayedAt.getTime()">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span class="font-weight-light blue--text text--lighten-3" v-bind="attrs" v-on="on">
                                            {{ $dfns.formatDistanceToNowStrict(item.lastPlayedAt, {
                                                addSuffix: true,
                                                unit: 'day',
                                                roundingMethod: 'round'}) }}
                                        </span>
                                    </template>
                                    <span>{{ $dfns.formatISO9075(item.lastPlayedAt, { representation: 'complete' }) }}</span>
                                </v-tooltip>
                            </td>
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
                                    {{ queryParams.limit }}
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

                        <!-- <v-btn
                            color="blue darken-4"
                            tile
                            class="mr-1"
                            :disabled="!playerBaseResponse.page.prev"
                            @click="pageGo('prev')"
                        >
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn
                            color="blue darken-4"
                            tile
                            class="ml-1"
                            :disabled="!playerBaseResponse.page.next"
                            @click="pageGo('next')"
                        >
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn> -->
                    </v-row>
                </v-col>
            </v-container>
        </div>

        <p class="px-2 mt-2" v-if="playerBaseResponse && playerBaseResponse.results.length === 0">No data available</p>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import ProfileItem from '@/components/ProfileItem.vue';
import { SGuard } from '../../helpers';
import { Debounce } from 'vue-debounce-decorator';
import { subDays, formatISO } from 'date-fns';

@Component({
    components: {
        ProfileItem,
    },
})
export default class MapPlayerBaseView extends Vue {
    private itemsPerPageArray = [100, 200, 300, 400, 500];
    private queryParams!: starc.MapPlayerBaseParams & starc.CursorPaginationQuery;
    private playerBaseResponse: starc.MapPlayerBaseResponse | null = null;
    private sortByList = [
        { value: 'lobbiesStarted,desc', text: 'Lobbies started' },
        { value: 'lobbiesHostedStarted,desc', text: 'Lobbies hosted started' },
        // { value: 'lobbiesStarted,desc', text: 'Lobbies started: Highest first' },
        // { value: 'lobbiesStarted,asc', text: 'Lobbies started: Lowest first' },
        // { value: 'lobbiesHostedStarted,desc', text: 'Lobbies hosted: Highest first' },
        // { value: 'lobbiesHostedStarted,asc', text: 'Lobbies hosted: Lowest first' },
        // { value: 'name,asc', text: 'Name: A-Z' },
        // { value: 'name,desc', text: 'Name: Z-A' },
    ];
    private sortByValue!: string;
    private menuLastPlayedMin: boolean = false;

    private formatRelativeTime(seconds: number) {
        if (seconds <= 0) return 'none';
        return this.$helpers.formatDateDistanceToNow(this.$dfns.addSeconds(new Date(), -seconds));
    }

    @SGuard()
    private async refreshList() {
        this.playerBaseResponse = (await this.$starc.getMapPlayerBase(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId),
            {
                ...this.queryParams,
            }
        )).data;
    }

    private renavigate() {
        this.$router.push({
            name: this.$route.name!,
            query: {
                ...this.$helpers.stringifyQueryParams(this.queryParams),
            },
        });
        this.$vuetify.goTo(this);
    }

    private updateItemsPerPage(n: number) {
        this.queryParams.limit = n;
        this.renavigate();
    }

    private applyParamsFromRouteQuery() {
        this.queryParams = {
            name: this.$route.query?.name ? String(this.$route.query?.name) : void 0,
            lastPlayedMin: this.$route.query?.lastPlayedMin ? String(this.$route.query?.lastPlayedMin) : void 0,
            orderBy: this.$route.query?.orderBy ? String(this.$route.query.orderBy) : 'lobbiesStarted',
            orderDirection: this.$route.query?.orderDirection ? String(this.$route.query.orderDirection) : 'desc',
            before: this.$route.query?.before ? String(this.$route.query?.before) : void 0,
            after: this.$route.query?.after ? String(this.$route.query?.after) : void 0,
            limit: this.$route.query?.limit ? Number(this.$route.query?.limit) : this.itemsPerPageArray[0],
        };
        // if (!this.queryParams.lastPlayedMin) {
        //     this.queryParams.lastPlayedMin = formatISO(subDays(new Date(), 90), { representation: 'date' });
        // }
        this.sortByValue = [this.queryParams.orderBy, this.queryParams.orderDirection].join(',');
    }

    private pageGo(where: 'prev' | 'next') {
        this.queryParams.before = void 0;
        this.queryParams.after = void 0;
        if (where === 'next' && this.playerBaseResponse!.page.next) {
            this.queryParams.after = this.playerBaseResponse!.page.next;
        }
        else if (where === 'prev' && this.playerBaseResponse!.page.prev) {
            this.queryParams.before = this.playerBaseResponse!.page.prev;
        }
        else return;
        this.renavigate();
    }

    @Debounce({ time: 800 })
    private onInput() {
        if (
            this.queryParams.name === String(this.$route.query.name ?? '')
        ) return;
        this.onSubmit();
    }

    private onSubmit() {
        [ this.queryParams.orderBy, this.queryParams.orderDirection ] = this.sortByValue.split(',');
        this.queryParams.before = void 0;
        this.queryParams.after = void 0;
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
.search-toolbar {
    padding-bottom: 0.5rem;

    >div {
        margin-left: 0.3rem;
        margin-right: 0.3rem;
        margin-top: 0.5rem !important;
        margin-bottom: 0.5rem !important;
    }
}
</style>
