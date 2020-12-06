<template>
    <div>
        <v-card
            tile
            raised
        >
            <v-container>
                <h2 class="headline">Contact</h2>
                <p>
                    For general questions/suggestions/bug reports please use one of the following:
                </p>
                <div class="d-flex flex-wrap flex-lg-nowrap align-center justify-space-around">
                    <v-btn
                        color="blue-grey darken-3"
                        href="https://github.com/sc2-arcade-watcher/server/issues"
                        target="_blank"
                    >
                        <v-icon left>fab fa-github</v-icon>
                        Issue tracker on GitHub
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        href="https://discord.gg/VxAJYjF"
                        target="_blank"
                    >
                        <v-icon left>fab fa-discord</v-icon>
                        <strong>#arcade-watcher</strong> @ SC2Mapster Discord
                    </v-btn>
                </div>

                <v-divider class="my-2"/>

                <h3 class="headline">Other</h3>
                <p>
                    E-mail:
                    <v-btn
                        small
                        color="primary darken-3"
                        :href="`mailto:${'sc2arcade.com' + '@' + 'gmail.com'}`"
                        target="_blank"
                    >
                        <v-icon left small>fa fa-envelope</v-icon>
                        <span>{{ 'sc2arcade.com' + '@' + 'gmail.com' }}</span>
                    </v-btn>
                </p>
            </v-container>
        </v-card>
    </div>
</template>
