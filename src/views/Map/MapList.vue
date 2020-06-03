<template>
    <div>
        <v-card-title class="headline">
            <span>Maps list</span>
        </v-card-title>
        <v-card>
            <v-card-title class="d-flex justify-space-between flex-grow-1">
                <v-form @submit.prevent="onSubmit" class="flex-grow-1">
                    <v-text-field
                        v-model="searchPhrase"
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
                        <v-list-item-subtitle>v{{ item.currentMajorVersion }}.{{ item.currentMinorVersion }}</v-list-item-subtitle>
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
            <v-container>
                <v-row justify="center">
                    <v-col cols="8">
                        <v-container class="max-width">
                            <v-pagination
                                v-model="currentPage"
                                class="my-4"
                                :length="numberOfPages"
                                @input="onPageChage"
                            ></v-pagination>
                        </v-container>
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
    private searchPhrase = String(this.$route.query?.name ?? '');
    private mapsResponse: starc.MapListResponse | null = null;

    private get mapResults() {
        if (!this.mapsResponse) return [];
        return this.mapsResponse.data.results;
    }

    private get numberOfPages() {
        if (!this.mapsResponse) return 1;
        return Math.ceil(this.mapsResponse.data.count / 60);
    }

    private created() {
        this.refreshList();
    }

    private async refreshList() {
        this.mapsResponse = (await this.$starc.getMapList({
            name: this.searchPhrase,
            offset: 60 * (this.currentPage - 1),
            limit: 60,
        }));
    }

    private renavigate() {
        this.$router.push({
            name: this.$route.name!,
            query: {
                name: this.searchPhrase,
                page: String(this.currentPage),
            },
        })
    }

    private onPageChage(page: number) {
        this.renavigate();
    }

    private onSubmit() {
        this.currentPage = 1;
        this.renavigate();
    }

    @Watch('$route')
    private watchRoute() {
        this.refreshList();
    }
}
</script>
