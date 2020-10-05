<template>
    <div class="search-container">
        <v-card class="search-panel" elevation raised>
            <v-container>
                <h2 class="overline mb-2">Search & filter</h2>
                <v-form @submit.prevent="onSubmit">
                    <v-text-field
                        dense
                        solo
                        hide-details
                        label="Name"
                        clearable
                        v-model="queryParams.name"
                        @input="onInput"
                    />
                    <v-select
                        dense
                        solo
                        hide-details
                        append-outer-icon="fa-globe-americas"
                        label="Region"
                        chips
                        deletable-chips
                        v-model="queryParams.regionId"
                        :items="regionsList"
                        @change="onSubmit"
                    ></v-select>
                    <v-text-field
                        dense
                        solo
                        hide-details
                        append-outer-icon="fa-passport"
                        label="Handle (X-S2-X-XXXXX)"
                        clearable
                        v-model="queryParams.profileHandle"
                        @input="onInput"
                    />
                    <v-select
                        dense
                        solo
                        hide-details
                        append-outer-icon="fa-filter"
                        label="Sort by"
                        v-model="sortByValue"
                        :items="sortByList"
                        required
                        @change="onSubmit"
                    ></v-select>
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
            </v-container>
        </v-card>

        <div class="search-content" v-if="queryResults && queryResults.length">
            <v-simple-table fixed-header>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Handle</th>
                            <th>Name</th>
                            <th>Last online</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="profile in queryResults" :key="$starc.profileHandle(profile)">
                            <td>
                                <v-img
                                    class="d-flex"
                                    width="18"
                                    max-width="24"
                                    :src="require(`@/assets/region-${profile.regionId}.png`)"
                                />
                            </td>
                            <td>
                                <span class="text--secondary">{{ $starc.profileHandle(profile) }}</span>
                            </td>
                            <td>
                                <router-link
                                    :to="{ name: 'profile_base', params: {
                                        regionId: profile.regionId,
                                        realmId: profile.realmId,
                                        profileId: profile.profileId
                                    }}"
                                    class="map-author"
                                >
                                    <img v-if="profile.avatarUrl" :src="profile.avatarUrl" class="avatar-img"/>
                                    <div v-else class="blank-avatar"></div>

                                    <span v-html="profile.name"></span>
                                </router-link>
                                <small v-if="profile.discriminator" v-html="`#${profile.discriminator}`" class="grey--text"></small>
                            </td>
                            <td>
                                <v-tooltip top transition="fade-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span class="font-weight-light" v-bind="attrs" v-on="on">
                                            {{ $dfns.formatDistanceStrict(new Date(profile.lastOnlineAt), new Date(), {
                                                addSuffix: true,
                                                roundingMethod: 'floor'}) }}
                                        </span>
                                    </template>
                                    <span>{{ $dfns.formatISO9075(new Date(profile.lastOnlineAt), { representation: 'complete' }) }}</span>
                                </v-tooltip>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

            <v-container fluid>
                <v-divider/>
                <v-row class="mt-2 px-4" align="center" justify="center">
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

                    <v-btn
                        color="blue darken-4"
                        tile
                        large
                        class="mr-1"
                        :disabled="queryResponse === null || !queryResponse.page.prev"
                        @click="pageGo('prev')"
                    >
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                        color="blue darken-4"
                        tile
                        large
                        class="ml-1"
                        :disabled="queryResponse === null || !queryResponse.page.next"
                        @click="pageGo('next')"
                    >
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-row>
            </v-container>
        </div>

        <template v-if="queryResults && queryResults.length === 0">
            <v-banner>
                <v-avatar
                    slot="icon"
                    color="primary darken-2"
                    size="40"
                >
                    <v-icon>fas fa-search-minus</v-icon>
                </v-avatar>

                There are no results matching given criteria.
            </v-banner>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';
import { Debounce } from 'vue-debounce-decorator';

@Component
export default class ProfileListView extends Vue {
    private queryParams!: starc.ProfileListParams & starc.CursorPaginationQuery;
    private queryResponse: starc.ProfileListResponse | null = null;
    private itemsPerPageArray = [40, 80, 120, 160, 200, 300];
    private sortByList = [
        { value: 'lastOnlineAt,desc', text: 'Last online: Newest' },
        { value: 'lastOnlineAt,asc', text: 'Last online: Oldest' },
        { value: 'name,asc', text: 'Name: A-Z' },
        { value: 'name,desc', text: 'Name: Z-A' },
    ];
    private sortByValue!: string;

    private get queryResults() {
        if (!this.queryResponse) return null;
        return this.queryResponse.results;
    }

    private get regionsList() {
        return starc.regionsList.map(x => {
            return { value: x.id, text: x.code };
        });
    }

    private updateItemsPerPage(n: number) {
        this.queryParams.limit = n;
        this.renavigate();
    }

    private applyParamsFromRouteQuery() {
        this.queryParams = {
            profileHandle: this.$route.query?.profileHandle ? String(this.$route.query.profileHandle) : void 0,
            regionId: this.$route.query?.regionId ? (Number(this.$route.query.regionId)) : void 0,
            name: String(this.$route.query?.name ?? ''),
            orderBy: this.$route.query?.orderBy ? String(this.$route.query.orderBy) : 'lastOnlineAt',
            orderDirection: this.$route.query?.orderDirection ? String(this.$route.query.orderDirection) : 'desc',
            before: this.$route.query?.before ? String(this.$route.query?.before) : void 0,
            after: this.$route.query?.after ? String(this.$route.query?.after) : void 0,
            limit: this.$route.query?.limit ? Number(this.$route.query?.limit) : 60,
        };
        this.sortByValue = [this.queryParams.orderBy, this.queryParams.orderDirection].join(',');
    }

    @SGuard()
    private async refreshList() {
        this.queryResponse = (await this.$starc.getProfileList(this.queryParams)).data;
    }

    private async created() {
        this.applyParamsFromRouteQuery();
        await this.refreshList();
    }

    private renavigate() {
        this.$router.push({
            name: this.$route.name!,
            query: this.$helpers.stringifyQueryParams(this.queryParams),
        })
    }

    private pageGo(where: 'prev' | 'next') {
        this.queryParams.before = void 0;
        this.queryParams.after = void 0;
        if (where === 'next' && this.queryResponse!.page.next) {
            this.queryParams.after = this.queryResponse!.page.next;
        }
        else if (where === 'prev' && this.queryResponse!.page.prev) {
            this.queryParams.before = this.queryResponse!.page.prev;
        }
        else return;
        this.renavigate();
    }

    @Debounce({ time: 400 })
    private onInput() {
        if (
            this.queryParams.name === String(this.$route.query.name ?? '') &&
            this.queryParams.profileHandle === String(this.$route.query.profileHandle ?? '')
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
    private watchRoute() {
        this.applyParamsFromRouteQuery();
        this.refreshList();
    }
}
</script>
