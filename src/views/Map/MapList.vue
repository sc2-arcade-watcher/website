<template>
    <div class="d-flex" style="position: relative;">
        <div class="search-panel">
            <v-container>
                <v-form @submit.prevent="onSubmit">
                    <v-select
                        v-model="mapQueryParams.regionId"
                        :items="regionsList"
                        label="Region"
                        clearable
                        chips
                        @change="onSubmit"
                    ></v-select>
                    <v-select
                        v-model="mapQueryParams.type"
                        :items="mapTypesList"
                        label="Type"
                        clearable
                        @change="onSubmit"
                    ></v-select>
                    <v-text-field
                        v-model="mapQueryParams.name"
                        label="Name"
                        clearable
                        @blur="onSubmit"
                    ></v-text-field>
                    <v-switch
                        v-model="mapQueryParams.showPrivate"
                        label="Show private"
                        @change="onSubmit"
                    ></v-switch>
                    <v-select
                        v-model="sortByValue"
                        :items="sortByList"
                        label="Sort by"
                        required
                        @change="onSubmit"
                    ></v-select>
                    <v-btn type="submit" block style="display: none;">Search</v-btn>
                </v-form>
            </v-container>

            <v-row justify="center" align="center">
                <v-col class="text-left" cols="6">
                    <v-btn block tile :disabled="mapsResponse === null || !mapsResponse.data.page.prev" @click="pageGo('prev')">
                        <v-icon left>fa-chevron-left</v-icon>
                        Previous
                    </v-btn>
                </v-col>
                <v-col class="text-right" cols="6">
                    <v-btn block tile :disabled="mapsResponse === null || !mapsResponse.data.page.next" @click="pageGo('next')">
                        Next
                        <v-icon right>fa-chevron-right</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </div>

        <div class="search-content">
            <div class="d-flex flex-wrap">
                <v-card class="mx-auto mt-2 flex-grow-1 mr-1 ml-1" width="350" max-width="500" outlined v-for="(item, i) in mapResults" :key="i" :to="{ name: 'map_info', params: { regionId: item.regionId, mapId: item.bnetId } }">
                    <v-list-item two-line>
                        <v-list-item-content>
                            <v-img class="mb-2" :src="require(`../../assets/region-${item.regionId}.png`)" max-width="24" />
                            <v-list-item-title class="mb-1">{{ item.name }}</v-list-item-title>
                            <v-list-item-subtitle>v{{ item.currentVersion.majorVersion }}.{{ item.currentVersion.minorVersion }}</v-list-item-subtitle>
                            <v-list-item-subtitle>
                            </v-list-item-subtitle>
                        </v-list-item-content>

                        <v-list-item-avatar tile size="120">
                            <v-img :src="$starc.bnetDepotImage(item.iconHash)" contain></v-img>
                        </v-list-item-avatar>
                    </v-list-item>
                </v-card>
            </div>

            <div class="text-center">
                <v-container style="max-width: 500px;">
                    <v-row justify="center" align="center">
                        <v-col class="text-left" cols="5">
                            <v-btn block tile large :disabled="mapsResponse === null || !mapsResponse.data.page.prev" @click="pageGo('prev')">
                                <v-icon left>fa-chevron-left</v-icon>
                                Previous
                            </v-btn>
                        </v-col>
                        <v-col class="text-left" cols="2"/>
                        <v-col class="text-right" cols="5">
                            <v-btn block tile large :disabled="mapsResponse === null || !mapsResponse.data.page.next" @click="pageGo('next')">
                                Next
                                <v-icon right>fa-chevron-right</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';

@Component
export default class MapListView extends Vue {
    private currentPage = Number(this.$route.query?.page ?? 1);
    private mapsResponse: starc.MapListResponse | null = null;
    private mapQueryParams!: starc.MapListQuery
    private sortByValue!: string;
    private currentPaginationParams!: starc.CursorPaginationQuery;

    private regionsList = [
        { value: 1, text: 'US' },
        { value: 2, text: 'EU' },
        { value: 3, text: 'KR' },
    ];
    private mapTypesList = [
        { value: starc.MapType.MeleeMap, text: 'Melee Map' },
        { value: starc.MapType.ArcadeMap, text: 'Arcade Map' },
        { value: starc.MapType.ExtensionMod, text: 'Extension Mod' },
        { value: starc.MapType.DependencyMod, text: 'Dependency Mod' },
    ];
    private sortByList = [
        { value: 'updated,desc', text: 'Updated: Newest first' },
        { value: 'updated,asc', text: 'Updated: Oldest first' },
        { value: 'name,asc', text: 'Name: A-Z' },
        { value: 'name,desc', text: 'Name: Z-A' },
        { value: 'popularity,desc', text: 'Popularity' },
    ];

    private get mapResults() {
        if (!this.mapsResponse) return [];
        return this.mapsResponse.data.results;
    }

    private created() {
        this.applyParamsFromRouteQuery();
        this.refreshList();
    }

    private applyParamsFromRouteQuery() {
        this.mapQueryParams = {
            regionId: this.$route.query?.regionId ? (Number(this.$route.query.regionId)) : void 0,
            type: this.$route.query?.type ? (String(this.$route.query.type) as starc.MapType) : void 0,
            name: String(this.$route.query?.name ?? ''),
            // mainCategoryId
            showPrivate: Boolean(this.$route.query?.showPrivate ?? false),
            orderBy: this.$route.query?.orderBy ? String(this.$route.query.orderBy) : 'updated',
            orderDirection: this.$route.query?.orderDirection ? String(this.$route.query.orderDirection) : 'desc',
        };
        this.currentPaginationParams = {
            before: this.$route.query?.before ? String(this.$route.query?.before) : void 0,
            after: this.$route.query?.after ? String(this.$route.query?.after) : void 0,
            limit: this.$route.query?.limit ? Number(this.$route.query?.limit) : 30,
        };
        this.sortByValue = [this.mapQueryParams.orderBy, this.mapQueryParams.orderDirection].join(',');
    }

    private async refreshList() {
        this.mapsResponse = (await this.$starc.getMapList({
            ...this.mapQueryParams,
            ...this.currentPaginationParams,
        }));
    }

    private renavigate() {
        this.$router.push({
            name: this.$route.name!,
            query: {
                ...(Object.fromEntries(Object.entries(this.mapQueryParams).filter(x => x[1] !== null && x[1] !== void 0).map<[string, string]>(x => [ x[0], (x[1] as string) ]))),
                ...(Object.fromEntries(Object.entries(this.currentPaginationParams).filter(x => x[1] !== null && x[1] !== void 0).map<[string, string]>(x => [ x[0], String(x[1]) ]))),
            },
        })
    }

    private pageGo(where: 'prev' | 'next') {
        this.currentPaginationParams.before = void 0;
        this.currentPaginationParams.after = void 0;
        if (where === 'next' && this.mapsResponse!.data.page.next) {
            this.currentPaginationParams.after = this.mapsResponse!.data.page.next;
        }
        else if (where === 'prev' && this.mapsResponse!.data.page.prev) {
            this.currentPaginationParams.before = this.mapsResponse!.data.page.prev;
        }
        else return;
        this.renavigate();
    }

    private onPageChage(page: number) {
        this.renavigate();
    }

    private onSubmit() {
        [ this.mapQueryParams.orderBy, this.mapQueryParams.orderDirection ] = this.sortByValue.split(',');
        this.currentPaginationParams.before = void 0;
        this.currentPaginationParams.after = void 0;
        this.renavigate();
    }

    @Watch('$route')
    private watchRoute() {
        this.applyParamsFromRouteQuery();
        this.refreshList();
    }
}
</script>

<style lang="scss">
.search-panel {
    background: rgba(#fff, 0.08);
    position: sticky;
    top: 0px;
    bottom: 0;
    margin-left: -12px;
    align-self: flex-start;
    min-width: 250px;
}
</style>
