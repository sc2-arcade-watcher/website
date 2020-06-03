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
            v-model="activeTab"
            background-color="transparent"
            color="basil"
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';

@Component
export default class MapBaseView extends Vue {
    private mapInfo: starc.Document | null = null;
    private activeTab = null;

    private get tabs() {
        return [
            {
                name: 'Details',
                route: {
                    name: 'map_info', params: {
                        regionId: this.$route.params.regionId,
                        mapId: this.$route.params.mapId,
                    },
                },
            },
            // {
            //     name: 'Screenshots',
            // },
            // {
            //     name: 'Patch notes',
            // },
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

    private async created() {
        const loading = this.$loading({ fullscreen: true });
        this.mapInfo = (await this.$starc.getMapInfo(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId)
        )).data;
        loading.close();
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
