<template>
    <div>
        <v-card
            tile
            raised
        >
            <v-container>
                <h2 class="headline">Contact</h2>
                <div class="d-flex flex-wrap flex-lg-nowrap justify-space-between">
                    <div>
                        <p>
                            At SC2Mapster Discord server there's dedicated channel for this project. That's the best way to get in touch with people involved in this project, and get any questions answered.
                        </p>
                        <iframe src="https://discord.com/widget?id=271701880885870594&theme=dark" width="100%" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
                    </div>

                    <div class="text-right mx-5">
                        <h3 class="headline">Links</h3>
                        <v-btn
                            small
                            color="blue darken-1"
                            href="https://discord.gg/VxAJYjF"
                            target="_blank"
                        >
                            <v-icon left>fab fa-discord</v-icon>
                            <strong>#arcade-watcher</strong> @ SC2Mapster Discord
                        </v-btn>

                        <v-spacer class="my-5" />

                        <v-btn
                            small
                            color="blue-grey darken-3"
                            href="https://github.com/sc2-arcade-watcher/issue-tracker/issues?q=is%3Aissue+"
                            target="_blank"
                        >
                            <v-icon left>fab fa-github</v-icon>
                            Issue tracker on GitHub
                        </v-btn>

                        <v-divider class="my-5"/>

                        <h3 class="headline">Other matters</h3>
                        <p>
                            E-mail:
                            <v-btn
                                small
                                color="primary darken-3"
                                :href="`mailto:${'talv' + '@' + 'sc2arcade.com'}`"
                                target="_blank"
                            >
                                <v-icon left small>fa fa-envelope</v-icon>
                                <span>{{ 'talv' + '@' + 'sc2arcade.com' }}</span>
                            </v-btn>
                        </p>
                    </div>
                </div>
            </v-container>
        </v-card>
    </div>
</template>
