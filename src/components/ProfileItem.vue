<template>
    <div class="profile-item">
        <router-link
            :to="{ name: 'profile_base', params: {
                regionId: profile.regionId,
                realmId: profile.realmId,
                profileId: profile.profileId
            }}"
            class="player-link"
        >
            <v-list-item-avatar
                tile
            >
                <v-img v-if="profile.avatarUrl" :src="profile.avatarUrl" class="avatar-img" cover/>
                <v-avatar
                    v-else
                    class="blank-avatar"
                    color="grey darken-3"
                    tile
                >
                    <v-icon dark>
                        mdi-account-question
                    </v-icon>
                </v-avatar>
            </v-list-item-avatar>
            <span v-if="profile.name" v-html="profile.name"/>
            <span v-else v-html="`${$starc.profileHandle(author)}`"/>
        </router-link>
        <small v-if="showDiscriminator && profile.discriminator" v-html="`#${profile.discriminator}`" class="grey--text"></small>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';

@Component
export default class ProfileItem extends Vue {
    @Prop({
        required: true,
    })
    readonly profile!: starc.Profile;

    @Prop({
        default: false,
    })
    readonly showDiscriminator!: boolean;

    private get regionCode() {
        return starc.GameRegion[this.profile.regionId];
    }

    created() {
    }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/_index';

.profile-item {
}
</style>
