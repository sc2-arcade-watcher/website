<template>
    <div class="text-center">
        <v-menu
            v-model="menuVisibile"
            offset-y
            :close-on-content-click="false"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    :color="$store.battleAccount ? 'primary darken-1' : 'primary darken-1'"
                    :outlined="$store.battleAccount === null"
                    small
                    height="44"
                    v-bind="attrs"
                    v-on="on"
                >
                    <v-icon :color="$store.battleAccount ? 'white accent-3' : 'primary'" size="34">fab fa-battle-net</v-icon>
                </v-btn>
            </template>
            <v-list v-if="$store.battleAccount">
                <v-card>
                    <v-card-text>
                        Logged in as <strong>{{ $store.battleAccount.battleTag }}</strong>
                    </v-card-text>
                </v-card>
                <v-list-item
                    v-for="(profile, i) in $store.battleAccount.profiles"
                    :key="i"
                    :to="{ name: 'about' }"
                    @click="menuVisibile = false"
                    dense
                >
                    <v-list-item-avatar rounded>
                        <img :src="profile.avatarUrl" alt="">
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>
                            {{ profile.name }}
                            <small v-if="profile.discriminator" v-html="`#${profile.discriminator}`" class="grey--text"></small>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <v-img class="d-inline-block float-right" width="16" :src="require(`@/assets/region-${profile.regionId}.png`)" max-width="24" />
                            {{ regionsList.find(x => x.id === profile.regionId).name }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider/>
                <v-list-item
                    :to="{ name: 'account_settings' }"
                    @click="menuVisibile = false"
                    dense
                >
                    <v-list-item-title>
                        <v-icon small left>fas fa-user-cog</v-icon>
                        Settings
                    </v-list-item-title>
                </v-list-item>
                <v-list-item
                    :to="{ name: 'account_info', query: { logout: null } }"
                    @click="menuVisibile = false"
                    dense
                >
                    <v-list-item-title>
                        <v-icon small left>fas fa-sign-out-alt</v-icon>
                        Logout
                    </v-list-item-title>
                </v-list-item>
            </v-list>
            <v-list v-else>
                <v-list-item
                    :to="{ name: 'account_auth', query: { method: 'bnet' } }"
                    @click="menuVisibile = false"
                >
                    <v-list-item-title>
                        <v-icon small left>fas fa-sign-in-alt</v-icon>
                        Login via Battle.net
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';

@Component
export default class UserNav extends Vue {
    private menuVisibile: boolean = false;
    private regionsList = starc.regionsList;
}
</script>
