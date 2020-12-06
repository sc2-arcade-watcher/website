<template>
    <v-container class="info-p">
        <v-layout row wrap>
            <v-flex xs12 md3 lg2>
                <v-list
                    nav
                    color="primary darken-2"
                >
                    <v-list-item
                        v-for="(item, i) in nav"
                        :key="i"
                        :to="item.location"
                    >
                        <v-list-item-icon v-if="item.icon">
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{ item.text }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-flex>
            <v-flex xs12 md9 lg10>
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';
import { RawLocation } from 'vue-router';

@Component
export default class InfoBaseView extends Vue {
    private nav: {
        icon?: string | null;
        text: string;
        location: RawLocation;
    }[] = [
        {
            text: 'About',
            icon: 'fa-book',
            location: {
                name: 'info_about',
            },
        },
        {
            text: 'Donate',
            icon: 'fa-donate',
            location: {
                name: 'info_donate',
            },
        },
        {
            text: 'Discord Bot',
            icon: 'fab fa-discord',
            location: {
                name: 'info_discord_bot',
            },
        },
        {
            text: 'Contact',
            icon: 'fa-envelope',
            location: {
                name: 'info_contact',
            },
        },
    ];
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/_variables';

@media #{map-get($display-breakpoints, 'lg-and-up')} {
    .container.info-p {
        max-width: 1185px;
    }
}
</style>
