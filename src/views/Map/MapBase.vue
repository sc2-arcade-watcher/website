<template>
    <div>
        <h2 class="display-1" v-if="mapInfo">{{ mapInfo.name }}</h2>
        <v-card v-if="mapInfo" class="map-base-card mt-2 d-flex flex-wrap flex-md-nowrap justify-space-between" raised>
            <v-container fluid>
                <div class="row">
                    <v-list-item class="py-0">
                        <v-list-item-subtitle class="d-flex flex-wrap flex-md-nowrap justify-space-between align-center mr-3">
                            <v-chip-group class="map-tags">
                                <v-chip outlined color="primary" small>{{ mapInfo.type.replace('_', ' ') }}</v-chip>
                                <v-chip outlined color="blue-grey darken-2" small v-if="mapInfo.currentVersion.isPrivate">Private</v-chip>
                            </v-chip-group>
                            &nbsp;
                            <v-btn small outlined text :href="$starc.battleMapLink(mapInfo.regionId, mapInfo.bnetId)">
                                {{ $starc.battleMapLink(mapInfo.regionId, mapInfo.bnetId) }}
                            </v-btn>
                        </v-list-item-subtitle>
                        <v-list-item-action-text class="justify-sm-end" style="min-width: 80px;">
                            v{{ mapInfo.currentVersion.majorVersion }}.{{ mapInfo.currentVersion.minorVersion }}
                            <v-img class="d-inline-block float-right" :src="require(`../../assets/region-${mapInfo.regionId}.png`)" width="20" height="20" />
                        </v-list-item-action-text>
                    </v-list-item>
                </div>
                <dl class="d-info row">
                    <dt class="col-12 col-sm-3 col-md-2">Author</dt>
                    <dd class="col-12 col-sm-9 col-md-10">
                        <template v-if="author">
                            <router-link
                                :to="{ name: 'profile_base', params: { regionId: author.regionId, realmId: author.realmId, profileId: author.profileId } }"
                                class="map-author"
                            >
                                <img v-if="author.avatarUrl" :src="author.avatarUrl" class="avatar-img"/>
                                <div v-else class="blank-avatar"></div>

                                <span v-if="author.deleted" v-html="`${$starc.profileHandle(author)}`"></span>
                                <span v-else v-html="author.name"></span>
                            </router-link>
                        </template>
                    </dd>

                    <template v-if="mapInfo.type === 'arcade_map'">
                        <dt class="col-12 col-sm-3 col-md-2">Genre</dt>
                        <dd class="col-12 col-sm-9 col-md-10">
                            {{ mapCategory.name }}
                        </dd>
                    </template>

                    <template v-if="mapInfo.type === 'arcade_map' || mapInfo.type === 'melee_map'">
                        <dt class="col-12 col-sm-3 col-md-2">Max players</dt>
                        <dd class="col-12 col-sm-9 col-md-10">{{ mapInfo.maxPlayers }}</dd>
                    </template>

                    <dt class="col-12 col-sm-3 col-md-2">Description</dt>
                    <dd class="col-12 col-sm-9 col-md-10">
                        <span v-html="$helpers.formatDescription(mapInfo.description)"/>
                    </dd>

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
            <div class="details-right py-2 px-2">
                <div class="map-icon">
                    <img class="d-block" :src="$starc.depotImage(mapInfo.iconHash, mapInfo.regionId).url"/>
                </div>
                <div class="meta">
                    <div>
                        <small>
                            Published:
                            <strong>
                                {{ $dfns.lightFormat(new Date(mapInfo.publishedAt), 'yyyy-MM-dd HH:mm') }}
                            </strong>
                            <v-icon color="primary" x-small style="width: 25px;" title="Published">fas fa-newspaper</v-icon>
                        </small>
                    </div>
                    <div>
                        <small>
                            Updated:
                            <strong>
                                {{ $dfns.lightFormat(new Date(mapInfo.updatedAt), 'yyyy-MM-dd HH:mm') }}
                            </strong>
                            <v-icon color="primary" x-small style="width: 25px;" title="Updated">fas fa-file-medical-alt</v-icon>
                        </small>
                    </div>
                </div>
            </div>
        </v-card>

        <v-tabs
            v-show="!isAccessRestricted"
            v-model="activeTab"
            background-color="transparent"
            show-arrows
        >
            <v-tab v-for="(tab, i) of tabs" :key="i" :to="tab.route">
                {{ tab.name }}
            </v-tab>
        </v-tabs>

        <v-flex v-if="!isAccessRestricted">
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </v-flex>
        <template v-else>
            <v-banner>
                <v-avatar
                    slot="icon"
                    color="grey darken-3"
                    size="40"
                >
                    <v-icon>fas fa-user-secret</v-icon>
                </v-avatar>

                <span class="text-button">Further details about this map cannot be shown, due to author's privacy preferences.</span>
            </v-banner>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';

@Component
export default class MapBaseView extends Vue {
    public isAccessRestricted: boolean = false;
    private mapInfo: starc.Map | null = null;
    private activeTab = null;

    private get author() {
        if (!this.mapInfo) return null;
        return this.mapInfo.author;
    }

    private get isPublic() {
        if (!this.mapInfo) return null;
        return !this.mapInfo.currentVersion.isPrivate;
    }

    private get mapCategory() {
        if (this.mapInfo === null) return null;
        return starc.availableCategories.find(x => x.id === this.mapInfo!.mainCategoryId);
    }

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
        this.isAccessRestricted = false;
        this.mapInfo = (await this.$starc.getMapInfo(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId)
        )).data;
    }

    private async created() {
        await this.loadMap();
        if (this.$route.name === 'map_base') {
            await this.$router.replace({
                name: 'map_details',
                params: {
                    regionId: this.$route.params.regionId,
                    mapId: this.$route.params.mapId,
                },
            });
        }
    }

    @Watch('$route')
    private async watchRoute() {
        if (
            !this.mapInfo ||
            this.mapInfo.regionId !== Number(this.$route.params.regionId) ||
            this.mapInfo.bnetId !== Number(this.$route.params.mapId)
        ) {
            await this.loadMap();
            if (this.$route.name === 'map_base') {
                await this.$router.replace({
                    name: 'map_details',
                    params: {
                        regionId: this.$route.params.regionId,
                        mapId: this.$route.params.mapId,
                    },
                });
            }
        }
    }
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/settings/_variables';

.map-author {
    display: inline-block;

    .avatar-img,
    .blank-avatar {
        display: inline-block;
        width: 32px;
        height: 32px;
        box-sizing: border-box;
        margin-right: 0.75rem;
    }

    .avatar-img,
    .blank-avatar {
        vertical-align: top;
    }

    .avatar-img {
    }

    .blank-avatar {
        border: 1px solid rgba(255,255,255,0.1);
    }

    span {
        display: inline-block;
        font-weight: 500;
        font-size: 1.2em;
        letter-spacing: 1px;
    }
}

.map-base-card {

    .row {
    }

    .row >* {
        padding-top: 0.5em;
        padding-bottom: 0.5em;
    }

    .map-tags {
        text-transform: uppercase;
        font-weight: 500;
    }

    .details-right {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        flex-direction: column;

        .meta {
            margin-top: 5px;
            line-height: 1.2rem;
            text-align: right;
            white-space: nowrap;

            strong {
                font-weight: 600;
                border-bottom: 1px dotted rgba(#fff, 0.2);
            }
        }
    }

    .map-icon {
        display: flex;
        flex-grow: 1;
        align-items: center;

        img {
            border: 2px solid rgba(#000, 0.2);
            box-shadow: 1px 1px 3px rgba(#000, 0.35);
            max-width: 400px;
        }
    }

    @media #{map-get($display-breakpoints, 'md-and-down')} {
        .details-right {
            flex-grow: 1;
        }

        .map-icon {
            img {
                max-width: 100%;
            }
        }
    }
}
</style>
