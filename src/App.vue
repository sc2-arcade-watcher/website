<template>
    <v-app :class="`route ${$route.name}`">
        <v-overlay :value="isLoading" ref="gloader">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>

        <v-app-bar max-height="64px">
            <router-link :to="{ name: 'home' }">
                <div class="d-flex align-center">
                    <v-img
                        alt="SC2 Arcade"
                        class="shrink mr-2"
                        cover
                        :src="require('./assets/arcade-icon.png')"
                        transition="scale-transition"
                        width="50"
                    />
                </div>
            </router-link>

            <v-spacer></v-spacer>

            <v-btn :to="{ name: 'open_lobbies' }" text>
                <span>Open lobbies</span>
            </v-btn>
            <v-btn :to="{ name: 'map_list' }" text>
                <span>Maps</span>
            </v-btn>
            <v-btn :to="{ name: 'stats' }" text>
                <span>Global stats</span>
            </v-btn>
            <user-nav/>
        </v-app-bar>

        <v-content>
            <v-container fluid style="min-height: 100%;">
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </v-container>
        </v-content>

        <v-footer>
            <div
                class="float-left"
            >
                <v-btn
                    href="https://github.com/sc2-arcade-watcher"
                    target="_blank"
                    text
                >
                    <v-icon>fab fa-github</v-icon>
                </v-btn>
                <v-btn
                    :href="`${$starc.axios.defaults.baseURL}/docs/api/`"
                    target="_blank"
                    text
                >
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
import * as starc from '@/starc-api/starc';
import UserNav from './components/UserNav.vue';

@Component({
    components: {
        UserNav,
    },
})
export default class App extends Vue {
    private isLoading = false;

    async created() {
        const userToken = localStorage.getItem('user_token');

        if (userToken) {
            this.$starc.axios.defaults.headers['Authorization'] = `Bearer ${userToken}`;
            try {
                const response = (await this.$starc.accountInfo()).data;
                this.$store.battleAccount = response.battleAccount;
            }
            catch (err) {
                if (this.$helpers.isAxiosError(err) && err.response!.status == 401) {
                    localStorage.removeItem('user_token');
                    this.$store.battleAccount = null;
                }
                else {
                    throw err;
                }
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
