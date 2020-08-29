<template>
    <div>
        <h2 class="display-1" v-if="mapInfo">{{ mapInfo.name }}</h2>
        <v-card v-if="mapInfo" class="map-base-card mt-2 d-flex flex-wrap flex-sm-nowrap justify-space-between" raised>
            <v-container fluid>
                <div class="row">
                    <v-list-item class="py-0">
                        <v-list-item-subtitle class="d-flex flex-wrap flex-sm-nowrap justify-space-between align-center mr-3">
                            <v-chip color="primary" outlined>{{ mapInfo.type.toUpperCase() }}</v-chip>
                            &nbsp;
                            <v-btn small outlined text :href="$starc.battleMapLink(mapInfo.regionId, mapInfo.bnetId)">
                                {{ $starc.battleMapLink(mapInfo.regionId, mapInfo.bnetId) }}
                            </v-btn>
                        </v-list-item-subtitle>
                        <v-list-item-action-text class="justify-sm-end" style="min-width: 80px;">
                            v{{ mapInfo.currentMajorVersion }}.{{ mapInfo.currentMinorVersion }}
                            <v-img class="d-inline-block float-right" :src="require(`../../assets/region-${mapInfo.regionId}.png`)" width="20" height="20" />
                        </v-list-item-action-text>
                    </v-list-item>
                </div>
                <dl class="row">
                    <dt class="col-12 col-sm-3 col-md-2">Description</dt>
                    <dd class="col-12 col-sm-9 col-md-10">
                        <span v-html="$helpers.formatDescription(mapInfo.description)"/>
                    </dd>

                    <dt class="col-12 col-sm-3 col-md-2">Max players</dt>
                    <dd class="col-12 col-sm-9 col-md-10">{{ mapInfo.maxPlayers }}</dd>

                    <template v-if="mapInfo.website">
                        <dt class="col-12 col-sm-3 col-md-2">Website</dt>
                        <dd class="col-12 col-sm-9 col-md-10">
                            <v-btn color="primary" small outlined :href="mapInfo.website" target="_blank">
                                <v-icon small left>fas fa-globe</v-icon>
                                {{ mapInfo.website }}
                            </v-btn>
                        </dd>
                    </template>
                </dl>
            </v-container>
            <img class="d-inline-block my-2 mx-2" :src="$starc.bnetDepotImage(mapInfo.iconHash)"/>
        </v-card>

        <v-tabs
            v-show="mapInfo"
            v-model="activeTab"
            background-color="transparent"
            show-arrows
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
        if (!this.mapInfo) return [];
        const tabs = [
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
        ];

        if (this.mapInfo.type !== starc.MapType.DependencyMod) {
            tabs.push({
                name: 'Stats',
                route: {
                    name: 'map_stats', params: {
                        regionId: this.$route.params.regionId,
                        mapId: this.$route.params.mapId,
                    },
                },
            });
            tabs.push({
                name: 'Recent lobbies',
                route: {
                    name: 'map_recent_lobbies', params: {
                        regionId: this.$route.params.regionId,
                        mapId: this.$route.params.mapId,
                    },
                },
            });
        }

        return tabs;
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
        if (
            !this.mapInfo ||
            this.mapInfo.regionId !== Number(this.$route.params.regionId) ||
            this.mapInfo.bnetId !== Number(this.$route.params.mapId)
        ) {
            await this.loadMap();
        }
    }
}
</script>

<style lang="scss">
.map-base-card {
    .row {
    }

    .row >* {
        padding-top: 0.5em;
        padding-bottom: 0.5em;
    }

    dt, dd {
        border-top: 1px dashed #333;
    }

    dt {
        font-weight: 600;
        font-size: 0.9rem;
    }

    dd {
        font-size: 1rem;
    }

    >img {
        align-self: center;
        border: 2px solid rgba(#000, 0.2);
        box-shadow: 1px 1px 3px rgba(#000, 0.35);
        max-width: calc(100% - 15px);
    }
}
</style>
