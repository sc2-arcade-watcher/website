<template>
    <div>
        <v-card-title class="headline">
            <span>Maps list</span>
        </v-card-title>
        <v-card>
            <v-card-title class="d-flex justify-space-between flex-grow-1">
                <v-form @submit.prevent="onSubmit" class="flex-grow-1">
                    <v-text-field
                        v-model="mapQueryParams.name"
                        append-icon
                        label="Name..."
                        single-line
                        hide-details
                    ></v-text-field>
                </v-form>
            </v-card-title>
        </v-card>

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
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';

@Component
export default class MapListView extends Vue {
    private currentPage = Number(this.$route.query?.page ?? 1);
    private mapsResponse: starc.MapListResponse | null = null;
    private mapQueryParams: starc.MapListQuery = {
        name: String(this.$route.query?.name ?? ''),
    };
    private currentPaginationParams: starc.CursorPaginationQuery = {
        before: this.$route.query?.before ? String(this.$route.query?.before) : void 0,
        after: this.$route.query?.after ? String(this.$route.query?.after) : void 0,
        limit: 60,
    };

    private get mapResults() {
        if (!this.mapsResponse) return [];
        return this.mapsResponse.data.results;
    }

    // private get numberOfPages() {
    //     if (!this.mapsResponse) return 1;
    //     return Math.ceil(this.mapsResponse.data.count / 60);
    // }

    private created() {
        this.refreshList();
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
                ...(Object.fromEntries(Object.entries(this.mapQueryParams).filter(x => x[1] !== null && x[1] !== void 0).map<[string, string]>(x => [ x[0], String(x[1]) ]))),
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
        this.currentPaginationParams.before = void 0;
        this.currentPaginationParams.after = void 0;
        this.renavigate();
    }

    @Watch('$route')
    private watchRoute() {
        this.refreshList();
    }
}
</script>
