<template>
    <v-app :class="`route ${$route.name}`">
        <v-overlay :value="isLoading" ref="gloader">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <v-app-bar
            class="d-none d-sm-block flex-grow-0"
        >
            <router-link :to="{ name: 'home' }">
                <div class="d-flex align-center">
                    <v-img
                        class="d-block d-md-none"
                        alt="SC2 Arcade"
                        cover
                        :src="require('@/assets/arcade-icon.png')"
                        transition="scale-transition"
                        width="45"
                    />
                    <v-img
                        class="d-none d-md-block"
                        alt="SC2 Arcade"
                        contain
                        :src="require('@/assets/arcade-logo.png')"
                        transition="scale-transition"
                        width="350"
                        max-height="64"
                    />
                </div>
            </router-link>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn
                    v-for="(item, i) in nav"
                    :key="i"
                    :to="item.location"
                    text
                >{{ item.text }}</v-btn>
            </v-toolbar-items>
            <user-nav/>
        </v-app-bar>

        <v-app-bar
            class="d-block d-sm-none flex-grow-0"
            dense
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <router-link :to="{ name: 'home' }" class="d-flex flex-grow-1 align-center justify-end">
                <img
                    alt="SC2 Arcade"
                    :src="require('@/assets/arcade-logo.png')"
                    width="280"
                />
            </router-link>

        </v-app-bar>

        <v-navigation-drawer
            v-model="drawer"
            absolute
            temporary
        >
            <v-list
                nav
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
            <user-nav/>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid style="min-height: 100%;">
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </v-container>
        </v-main>

        <v-footer>
            <div
                class="float-left"
            >
                <v-btn
                    href="https://github.com/sc2-arcade-watcher"
                    target="_blank"
                    small
                    tile
                    text
                >
                    <v-icon>fab fa-github</v-icon>
                </v-btn>
                <v-btn
                    href="https://discord.gg/VxAJYjF"
                    target="_blank"
                    small
                    tile
                    text
                    title="#arcade-watcher on SC2Mapster Discord"
                >
                    <v-icon>fab fa-discord</v-icon>
                </v-btn>
                <v-btn
                    href="https://api.sc2arcade.com/docs/api/"
                    target="_blank"
                    small
                    tile
                    text
                >
                    <v-icon left>fas fa-laptop-code</v-icon>
                    WebAPI
                </v-btn>
            </div>
            <v-spacer></v-spacer>
            <small>Not affiliated with Blizzard Entertainment.</small>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import * as starc from '@/starc-api/starc';
import UserNav from './components/UserNav.vue';

@Component({
    components: {
        UserNav,
    },
})
export default class App extends Vue {
    private isLoading = false;
    private drawer = false;
    private nav: {
        icon: string | null;
        text: string;
        location: RawLocation;
    }[] = [
        {
            icon: null,
            text: 'Open lobbies',
            location: {
                name: 'open_lobbies',
            },
        },
        {
            icon: null,
            text: 'Maps',
            location: {
                name: 'map_list',
            },
        },
        {
            icon: null,
            text: 'Profiles',
            location: {
                name: 'profile_list',
            },
        },
        {
            icon: null,
            text: 'Global stats',
            location: {
                name: 'stats',
            },
        },
    ];

    async created() {
        const userToken = localStorage.getItem('user_token');

        if (userToken) {
            this.$starc.axios.defaults.headers['Authorization'] = `Bearer ${userToken}`;
            try {
                const response = (await this.$starc.accountInfo()).data;
                this.$store.battleAccount = response.battleAccount;
            }
            catch (err) {
                if (this.$helpers.isAxiosError(err)) {
                    if (err.response?.status == 401) {
                        localStorage.removeItem('user_token');
                        this.$store.battleAccount = null;
                        return;
                    }
                }
                throw err;
            }
        }
    }
}

</script>

<style lang="scss">
.theme--dark.v-application {
    background-color: #181818;
}

.theme--dark.v-card,
.theme--dark.v-data-table,
.theme--dark.v-tabs-items,
.theme--dark.v-tabs .v-tabs-bar {
    background-color: #232323;
}

.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}

// ::-webkit-scrollbar {
//     width: 8px;
//     background-color: #111;
// }

// ::-webkit-scrollbar-thumb {
//     background-color: #222;
// }

// ::-webkit-scrollbar-thumb:hover {
//     background-color: #444;
// }

// ::-webkit-scrollbar-track {
//     -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.6);
//     background-color: #333;
// }

// ::-webkit-scrollbar-track:hover {
//     background-color: #292929;
// }
</style>
