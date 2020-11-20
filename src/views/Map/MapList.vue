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
                        v-model="mapQueryParams.name"
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
                        v-model="mapQueryParams.regionId"
                        :items="regionsList"
                        @change="onSubmit"
                    ></v-select>
                    <v-select
                        dense
                        solo
                        hide-details
                        append-outer-icon="fa-archive"
                        label="Type"
                        clearable
                        v-model="mapQueryParams.type"
                        :items="mapTypesList"
                        @change="onSubmit"
                    ></v-select>
                    <v-select
                        dense
                        solo
                        hide-details
                        append-outer-icon="fa-layer-group"
                        label="Genre"
                        clearable
                        v-model="mapQueryParams.mainCategoryId"
                        :items="arcadeCategories"
                        item-text="name"
                        item-value="id"
                        @change="onSubmit"
                    ></v-select>
                    <v-switch
                        hide-details
                        append-icon="fa-unlock-alt"
                        v-model="mapQueryParams.showPrivate"
                        @change="onSubmit"
                    >
                        <template v-slot:label>
                            <span class="overline">Include private maps</span>
                        </template>
                    </v-switch>
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
                    <!-- <v-divider/> -->
                    <v-btn
                        class="d-none"
                        type="submit"
                        small
                        tile
                        color="primary darken-3"
                        @click="refresh">
                        Refresh
                    </v-btn>
                    <!-- <div class="d-flex justify-end mt-2">
                        <v-btn
                            small
                            tile
                            @click="reset"
                        >
                            Clear form
                        </v-btn>
                    </div> -->
                </v-form>
            </v-container>
        </v-card>

        <div class="search-content" v-if="mapResults.length">
            <div class="map-list">
                <map-item
                    v-for="(item) in mapResults"
                    :key="item.id"
                    :map="item"
                />
            </div>

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
                        large
                        class="mr-1"
                        :disabled="mapList === null || !mapList.page.prev"
                        @click="pageGo('prev')"
                    >
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <v-btn
                        color="blue darken-4"
                        tile
                        large
                        class="ml-1"
                        :disabled="mapList === null || !mapList.page.next"
                        @click="pageGo('next')"
                    >
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                </v-row>
            </v-container>
        </div>

        <template v-if="mapList && mapResults.length === 0">
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
import { Debounce } from 'vue-debounce-decorator';
import MapItem from '@/components/MapItem.vue';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';

@Component({
    components: {
        MapItem,
    },
})
export default class MapListView extends Vue {
    private itemsPerPageArray = [40, 80, 120, 160, 200, 300];
    private mapList: starc.MapListResponse | null = null;
    private mapQueryParams!: starc.MapListQuery
    private currentPaginationParams!: starc.CursorPaginationQuery;
    private sortByValue!: string;

    private regionsList = [
        { value: 1, text: 'US' },
        { value: 2, text: 'EU' },
        { value: 3, text: 'KR' },
        { value: 5, text: 'CN' },
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
        { value: 'published,desc', text: 'Published: Newest first' },
        { value: 'published,asc', text: 'Published: Oldest first' },
        { value: 'name,asc', text: 'Name: A-Z' },
        { value: 'name,desc', text: 'Name: Z-A' },
        { value: 'popularity,desc', text: 'Popularity' },
    ];

    private get arcadeCategories() {
        return starc.availableCategories.filter(x => !x.isMelee);
    }

    private get mapResults() {
        if (!this.mapList) return [];
        return this.mapList.results;
    }

    private created() {
        this.applyParamsFromRouteQuery();
        this.refreshList();
    }

    private updateItemsPerPage(n: number) {
        this.currentPaginationParams.limit = n;
        this.renavigate();
    }

    private applyParamsFromRouteQuery() {
        this.mapQueryParams = {
            regionId: this.$route.query?.regionId ? (Number(this.$route.query.regionId)) : void 0,
            type: this.$route.query?.type ? (String(this.$route.query.type) as starc.MapType) : void 0,
            name: String(this.$route.query?.name ?? ''),
            mainCategoryId: this.$route.query?.mainCategoryId ? (Number(this.$route.query.mainCategoryId)) : void 0,
            showPrivate: this.$route.query?.showPrivate === 'true',
            orderBy: this.$route.query?.orderBy ? String(this.$route.query.orderBy) : 'updated',
            orderDirection: this.$route.query?.orderDirection ? String(this.$route.query.orderDirection) : 'desc',
        };
        this.currentPaginationParams = {
            before: this.$route.query?.before ? String(this.$route.query?.before) : void 0,
            after: this.$route.query?.after ? String(this.$route.query?.after) : void 0,
            limit: this.$route.query?.limit ? Number(this.$route.query?.limit) : 60,
        };
        this.sortByValue = [this.mapQueryParams.orderBy, this.mapQueryParams.orderDirection].join(',');
    }

    @SGuard()
    private async refreshList() {
        this.mapList = (await this.$starc.getMapList({
            ...this.mapQueryParams,
            ...this.currentPaginationParams,
        })).data;
    }

    private renavigate() {
        this.$router.push({
            name: this.$route.name!,
            query: {
                ...this.$helpers.stringifyQueryParams(this.mapQueryParams),
                ...this.$helpers.stringifyQueryParams(this.currentPaginationParams),
            },
        })
        this.$vuetify.goTo(this.$parent);
    }

    private pageGo(where: 'prev' | 'next') {
        this.currentPaginationParams.before = void 0;
        this.currentPaginationParams.after = void 0;
        if (where === 'next' && this.mapList!.page.next) {
            this.currentPaginationParams.after = this.mapList!.page.next;
        }
        else if (where === 'prev' && this.mapList!.page.prev) {
            this.currentPaginationParams.before = this.mapList!.page.prev;
        }
        else return;
        this.renavigate();
    }

    @Debounce({ time: 400 })
    private onInput() {
        if (this.mapQueryParams.name === String(this.$route.query.name ?? '')) return;
        this.onSubmit();
    }

    private onSubmit() {
        [ this.mapQueryParams.orderBy, this.mapQueryParams.orderDirection ] = this.sortByValue.split(',');
        this.currentPaginationParams.before = void 0;
        this.currentPaginationParams.after = void 0;
        this.renavigate();
    }

    private refresh(ev: Event) {
        ev.preventDefault();
        this.refreshList();
    }

    private reset() {
        this.$router.push({ name: this.$route.name as string });
    }

    @Watch('$route')
    private watchRoute() {
        this.applyParamsFromRouteQuery();
        this.refreshList();
    }
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/settings/_index';

.search-container {
}

.search-panel {
    background: rgba(#fff, 0.04);
    // border: 1px solid map-get($grey, 'darken-3') !important;

    form {
        >div {
            margin-top: 0 !important;
            margin-bottom: 0.55rem !important;
        }
    }

    .v-input__control {
        margin: 0 !important;
    }

    .v-input__append-inner {
        // display: none;
        .v-icon {
            font-size: 20px;
            color: #555;
        }
    }

    .v-input__append-outer {
        .v-icon {
            font-size: 20px;
        }
    }
}

.search-content {
}

.map-list {
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax(190px, 1fr) );
    gap: 10px;
}

@media #{map-get($display-breakpoints, 'xs-only')} {
    .map-list {
        grid-template-columns: repeat( auto-fit, minmax(170px, 1fr) );
        gap: 5px;
    }
}

@media #{map-get($display-breakpoints, 'md-and-up')} {
    .search-container {
        display: flex;
    }

    .search-content {
        flex-grow: 1;
    }

    .search-panel {
        top: 12px;
        position: sticky;
        min-width: 250px;
        max-width: 300px;
        margin-right: 1rem;
        align-self: flex-start;
    }
}

@media #{map-get($display-breakpoints, 'lg-and-up')} {
    .map-list {
        grid-template-columns: repeat( auto-fit, minmax(210px, 1fr) );
    }
}
</style>
