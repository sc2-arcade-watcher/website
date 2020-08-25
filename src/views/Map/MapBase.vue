<template>
    <div>
        <v-card v-if="mapInfo" color="basil" class="">
            <v-list-item three-line>
                <v-list-item-content>
                    <v-list-item-title class="headline mb-1">{{ mapInfo.name }}</v-list-item-title>
                    <div class="overline">
                        v{{ mapInfo.currentMajorVersion }}.{{ mapInfo.currentMinorVersion }}
                        |
                        {{ mapInfo.type }}
                    </div>
                    <!-- <v-list-item-subtitle>{{ mapInfo.type }}</v-list-item-subtitle> -->
                    <v-img :src="require(`../../assets/region-${mapInfo.regionId}.png`)" max-width="24" />
                </v-list-item-content>

                <v-list-item-avatar tile min-width="200" max-width="300" height="140">
                    <v-img :src="$starc.bnetDepotImage(mapInfo.iconHash)" contain></v-img>
                </v-list-item-avatar>
            </v-list-item>
        </v-card>

        <v-tabs
            v-show="mapInfo"
            v-model="activeTab"
            background-color="transparent"
            color="basil"
            show-arrows=""
        >
            <v-tab v-for="tab of tabs" :key="tab.name" :to="tab.route">
                {{ tab.name }}
            </v-tab>
        </v-tabs>

        <v-flex>
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </v-flex>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';

@Component
export default class MapBaseView extends Vue {
    private mapInfo: starc.Map | null = null;
    private activeTab = null;

    private get tabs() {
        return [
            {
                name: 'Details',
                route: {
                    name: 'map_details', params: {
                        regionId: this.$route.params.regionId,
                        mapId: this.$route.params.mapId,
                    },
                },
            },
            {
                name: 'Versions',
                route: {
                    name: 'map_versions', params: {
                        regionId: this.$route.params.regionId,
                        mapId: this.$route.params.mapId,
                    },
                },
            },
            {
                name: 'Dependencies',
                route: {
                    name: 'map_dependencies', params: {
                        regionId: this.$route.params.regionId,
                        mapId: this.$route.params.mapId,
                    },
                },
            },
            {
                name: 'Stats',
                route: {
                    name: 'map_stats', params: {
                        regionId: this.$route.params.regionId,
                        mapId: this.$route.params.mapId,
                    },
                },
            },
            {
                name: 'Recent lobbies',
                route: {
                    name: 'map_recent_lobbies', params: {
                        regionId: this.$route.params.regionId,
                        mapId: this.$route.params.mapId,
                    },
                },
            },
        ];
    }

    @SGuard()
    private async loadMap() {
        this.mapInfo = (await this.$starc.getMapInfo(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId)
        )).data;
    }

    private async created() {
        await this.loadMap();
    }

    @Watch('$route')
    private async watchRoute() {
        await this.loadMap();
    }
}
</script>

<style>
/* Helper classes */
.basil {
    /* background-color: #FFFBE6 !important; */
}
.basil--text {
    /* color: #356859 !important; */
}
</style>
