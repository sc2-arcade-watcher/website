<template>
    <v-app :class="`route ${$route.name}`">
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
            <v-btn
                href="https://github.com/SC2-Arcade-Watcher"
                target="_blank"
                text
            >
                <v-icon>fab fa-github</v-icon>
            </v-btn>
        </v-app-bar>

        <v-content>
            <v-container fluid style="min-height: 100%;">
                <transition name="fade">
                    <router-view></router-view>
                </transition>
            </v-container>
        </v-content>

        <v-footer>
            <v-spacer></v-spacer>
            <small>Not affiliated with Blizzard Entertainment.</small>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'App',
});
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
