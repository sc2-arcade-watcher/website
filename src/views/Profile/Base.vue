<template>
    <div>
        <v-card v-if="profile" class="profile-card d-flex flex-wrap flex-md-nowrap" raised>
            <div class="avatar-wrapper">
                <img
                    class="avatar-img"
                    v-if="profile.avatar"
                    :src="$starc.profileAvatarUrl(profile.avatar)"
                />
            </div>
            <div class="profile-head flex-grow-1">
                <h1 class="h1 font-weight-regular">
                    <span v-if="profile.name">{{ profile.name }}</span>
                    <span v-else>[ DELETED ]</span>
                    <small v-if="profile.discriminator" v-html="`#${profile.discriminator}`" class="grey--text"></small>
                    <v-img class="d-inline-block my-2 float-right" :src="require(`@/assets/region-${profile.regionId}.png`)" width="24" height="24" />
                </h1>
                <p class="mb-0">
                    <v-btn color="primary" small outlined text :href="sc2ProfileURL" target="_blank">
                        See on StarCraft2.com
                    </v-btn>
                </p>
            </div>
            <div class="profile-details">
                <dl class="d-info row">
                    <dt class="col-12 col-sm-4 col-md-3">Handle</dt>
                    <dd class="col-12 col-sm-8 col-md-9">
                        <span>{{ $starc.profileHandle(profile) }}</span>
                    </dd>
                    <template v-if="profile.profileGameId">
                        <dt class="col-12 col-sm-4 col-md-3">Game link</dt>
                        <dd class="col-12 col-sm-8 col-md-9">
                            <span>{{ $sTypes.profileGameLink(profile) }}</span>
                        </dd>
                    </template>
                    <template v-if="profile.battleTag">
                        <dt class="col-12 col-sm-4 col-md-3">Battle tag</dt>
                        <dd class="col-12 col-sm-8 col-md-9">
                            <span>{{ profile.battleTag }}</span>
                        </dd>
                    </template>
                </dl>
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

        <v-flex v-show="!isAccessRestricted" class="sub-loading-container" ref="subLoadingContainer">
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </v-flex>
        <template v-if="isAccessRestricted">
            <v-banner>
                <v-avatar
                    slot="icon"
                    color="grey darken-3"
                    size="40"
                >
                    <v-icon>fas fa-user-secret</v-icon>
                </v-avatar>

                <span class="text-button">This user's public profile is hidden.</span>
            </v-banner>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';

@Component
export default class ProfileBaseView extends Vue {
    public isAccessRestricted: boolean = false;
    private activeTab = null;
    private profile: starc.ProfileInfo | null = null;

    private get tabs() {
        if (!this.profile) return [];
        const dparams = {
            regionId: this.$route.params.regionId,
            realmId: this.$route.params.realmId,
            profileId: this.$route.params.profileId,
        };
        const tabs = [
            {
                name: 'Summary',
                route: { name: 'profile_summary', params: dparams },
            },
            {
                name: 'Most played',
                route: { name: 'profile_most_played', params: dparams },
            },
            {
                name: 'Lobbies history',
                route: { name: 'profile_lobbies_history', params: dparams },
            },
            {
                name: 'Match history',
                route: { name: 'profile_match_history', params: dparams },
            },
            {
                name: 'Published maps',
                route: { name: 'profile_published_maps', params: dparams },
            },
        ];
        return tabs;
    }

    private get sc2ProfileURL() {
        return `https://starcraft2.com/profile/${this.profile!.regionId}/${this.profile!.realmId}/${this.profile!.profileId}`;
    }

    @SGuard()
    async loadProfile() {
        this.isAccessRestricted = false;
        this.profile = (await this.$starc.getProfile({
            regionId: Number(this.$route.params.regionId),
            realmId: Number(this.$route.params.realmId),
            profileId: Number(this.$route.params.profileId),
        })).data;
    }

    async created() {
        await this.watchRoute();
    }

    @Watch('$route')
    private async watchRoute() {
        if (
            !this.profile ||
            this.profile.regionId !== Number(this.$route.params.regionId) ||
            this.profile.realmId !== Number(this.$route.params.realmId) ||
            this.profile.profileId !== Number(this.$route.params.profileId)
        ) {
            await this.loadProfile();
        }
    }
}
</script>

<style lang="scss">
.profile-card {
    overflow: hidden;

    >div {
        margin-right: 1rem;
    }

    .avatar-wrapper,
    .profile-details {
        display: flex;
        align-items: center;
    }

    .avatar-wrapper {
        img {
            display: block;
        }
    }

    .profile-head {
        max-width: 340px;
    }

    .profile-details {
        flex-grow: 1;
    }
}
</style>
