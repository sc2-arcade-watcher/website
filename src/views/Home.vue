<template>
    <v-content>
        <v-container class="home-container">
            <v-layout row wrap>
                <v-flex xs12 mb-3>
                    <v-subheader>
                        <div class="overline">StarCraft II Arcade database</div>
                    </v-subheader>
                    <v-layout row wrap>
                        <v-flex xs12 sm6 md6 lg4 pa-1>
                            <v-card hover ripple :to="{ name: 'open_lobbies' }" color="grey darken-4" outlined>
                                <v-card-title class="px-0 pt-0 mb-3">
                                    <v-avatar tile>
                                        <v-icon>fa-globe</v-icon>
                                    </v-avatar>
                                    <h3 class="headline">Open lobbies</h3>
                                </v-card-title>

                                <v-card-subtitle>
                                    <span>Live list of currently open lobbies from all regions!</span>
                                </v-card-subtitle>
                            </v-card>
                        </v-flex>

                        <v-flex xs12 sm6 md6 lg4 pa-1>
                            <v-card hover ripple :to="{ name: 'map_list' }" color="grey darken-4" outlined>
                                <v-card-title class="px-0 pt-0 mb-3">
                                    <v-avatar tile>
                                        <v-icon>fa-database</v-icon>
                                    </v-avatar>
                                    <h3 class="headline">Maps</h3>
                                </v-card-title>

                                <v-card-subtitle>
                                    <span>Catalog of published maps.</span>
                                </v-card-subtitle>
                            </v-card>
                        </v-flex>

                        <v-flex xs12 sm6 md6 lg4 pa-1>
                            <v-card hover ripple :to="{ name: 'profile_list' }" color="grey darken-4" outlined>
                                <v-card-title class="px-0 pt-0 mb-3">
                                    <v-avatar tile>
                                        <v-icon>fa-users</v-icon>
                                    </v-avatar>
                                    <h3 class="headline">Profiles</h3>
                                </v-card-title>

                                <v-card-subtitle>
                                    <span>Player & map author profiles.</span>
                                </v-card-subtitle>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>

                <v-flex xs12 mb-3>
                    <v-subheader>
                        <div class="overline">Discord integrations</div>
                    </v-subheader>
                    <v-layout row wrap>
                        <v-flex xs12 sm6 md6 lg4 pa-1>
                            <v-card hover ripple :to="{ name: 'info_discord_bot' }" color="grey darken-4" outlined>
                                <v-card-title class="px-0 pt-0 mb-3">
                                    <v-avatar tile>
                                        <v-icon>fab fa-discord</v-icon>
                                    </v-avatar>
                                    <h3 class="headline">Discord Bot</h3>
                                </v-card-title>

                                <v-card-subtitle>
                                    <span>Install bot to get notifications about lobbies on your server.</span>
                                </v-card-subtitle>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>

                <v-flex xs12 mb-3>
                    <v-subheader>
                        <div class="overline">Info</div>
                    </v-subheader>
                    <v-layout row wrap>
                        <v-flex xs12 sm6 md6 lg4 pa-1>
                            <v-card hover ripple :to="{ name: 'info_about' }" color="grey darken-4" outlined>
                                <v-card-title class="px-0 pt-0 mb-3">
                                    <v-avatar tile>
                                        <v-icon>fa-book</v-icon>
                                    </v-avatar>
                                    <h3 class="headline">About</h3>
                                </v-card-title>

                                <v-card-subtitle>
                                    <span>Learn more about the project.</span>
                                </v-card-subtitle>
                            </v-card>
                        </v-flex>

                        <v-flex xs12 sm6 md6 lg4 pa-1>
                            <v-card hover ripple :to="{ name: 'info_donate' }" color="grey darken-4" outlined>
                                <v-card-title class="px-0 pt-0 mb-3">
                                    <v-avatar tile>
                                        <v-icon>fa-donate</v-icon>
                                    </v-avatar>
                                    <h3 class="headline">Donate</h3>
                                </v-card-title>

                                <v-card-subtitle>
                                    <span>Help financially with the costs of maintenance.</span>
                                </v-card-subtitle>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>

        </v-container>
    </v-content>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class HomeView extends Vue {
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/settings/_index';

.route.home {
    background: url('../assets/body-bg.jpg') no-repeat top center !important;
    background-size: cover;
    background-attachment: fixed;

    >div {
        // background: rgba(#000, 0.95);
    }

    .home-container {
        // background: rgba(map-get($grey, 'darken-3'), 0.95);
        padding: 15px 15px;
    }
}
</style>
