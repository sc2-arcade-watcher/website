<template>
    <div>
        <v-card v-if="profile" class="profile-card" raised>
            <div class="d-flex flex-wrap flex-md-nowrap justify-space-between">
                <div class="avatar-wrapper mr-3">
                    <img
                        class="avatar-img"
                        v-if="profile.avatarUrl"
                        :src="profile.avatarUrl"
                    />
                </div>
                <div class="profile-head flex-grow-1">
                    <h1 class="h1 font-weight-regular">
                        <span v-if="profile.name">{{ profile.name }}</span>
                        <span v-else>[ DELETED ]</span>
                        <small v-if="profile.discriminator" v-html="`#${profile.discriminator}`" class="grey--text"></small>
                        <v-img class="d-inline-block my-2 float-right" :src="require(`@/assets/region-${profile.regionId}.png`)" width="24" height="24" />
                    </h1>
                    <p v-if="profile.regionId !== 5" class="mb-0"><a :href="sc2ProfileURL" target="_blank">See on StarCraft2.com</a></p>
                    <dl class="d-info row">
                        <dt class="col-12 col-sm-3 col-md-2">Profile handle</dt>
                        <dd class="col-12 col-sm-9 col-md-10">
                            <span>{{ $starc.profileHandle(profile) }}</span>
                        </dd>
                        <dt class="col-12 col-sm-3 col-md-2">Last seen online</dt>
                        <dd class="col-12 col-sm-9 col-md-10">
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
                        </dd>
                    </dl>
                </div>
            </div>
        </v-card>

        <v-tabs
            v-model="activeTab"
            background-color="transparent"
            show-arrows
        >
            <v-tab v-for="(tab, i) of tabs" :key="i" :to="tab.route">
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
export default class ProfileBaseView extends Vue {
    private activeTab = null;
    private profile: starc.Profile | null = null;

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
                name: 'Published maps',
                route: { name: 'profile_published_maps', params: dparams },
            },
            // {
            //     name: 'Lobbies history',
            //     route: { name: 'profile_lobbies_history', params: dparams },
            // },
            // {
            //     name: 'Match history',
            //     route: { name: 'profile_match_history', params: dparams },
            // },
        ];
        return tabs;
    }

    private get sc2ProfileURL() {
        return `https://starcraft2.com/en-us/profile/${this.profile!.regionId}/${this.profile!.realmId}/${this.profile!.profileId}`;
    }

    @SGuard()
    async loadProfile() {
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
            if (this.$route.name === 'profile_base') {
                await this.$router.replace({
                    name: 'profile_summary',
                    params: this.$route.params,
                });
            }
        }
    }
}
</script>

<style lang="scss">
.profile-card {
    .avatar-wrapper {
    }
}
</style>
