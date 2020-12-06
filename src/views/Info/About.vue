<template>
    <div>
        <v-card
            tile
            raised
        >
            <v-container>
                <h2 class="headline">About</h2>
                <p class="body-1">
                    SC2Arcade.com is an online database of StarCraft II Arcade content (custom maps). <br> Features:
                </p>

                <v-list
                    dense
                    class="mb-2"
                >
                    <v-list-item
                        dense
                        v-for="(item, i) in [
                            'Monitoring of open lobbies 24/7',
                            'Discord bot (Arcade Watcher) posting about lobbies available to any public server',
                            'Catalog of all maps published to arcade',
                            'Player & author profiles',
                            'Match history tracking',
                            'Popularity statistics & other data metrics for map authors',
                            'Supports all 4 regions! <em class=\'text--secondary\'>(Although CN integration is not yet solid..)</em>',
                            '.. and more',
                        ]"
                        :key="i"
                    >
                        <v-list-item-icon>
                            <v-icon small color="primary">fa fa-check</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title v-html="item"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <p class="text-right body-1">
                    <em>sc2arcade.com</em> is developed and maintained by: Talv <router-link :to="{ name: 'info_contact' }">(contact)</router-link>
                </p>

                <v-divider class="my-2"/>
                <h3 class="headline">Credits</h3>
                <p>
                    <strong class="subtitle">Aduolu</strong>
                    <ul>
                        <li>Provides & maintains a secondary dedicated machine tailored for running customized SC2 clients - helps greatly in distributing the load and keeping the service working nearly 24/7.</li>
                        <li>Morale support during early prototyping :)</li>
                    </ul>
                </p>
                <p>
                    <strong class="subtitle">Nil</strong>
                    <ul>
                        <li>Help with optimizations concerning <a href="https://github.com/sc2-arcade-watcher/s2mdec" target="_blank">decoding of s2mh</a>.</li>
                        <li>Testing and feedback of the WebAPI.</li>
                        <li>Author of <a href="https://top.gg/bot/675998947374006283" target="_blank">Starcraft2ArcadeTracker</a>.</li>
                        <li>Misc consulting.</li>
                    </ul>
                </p>
                <p>
                    <strong class="subtitle">MengLuoRJ</strong>
                    <ul>
                        <li>Provided CN region accounts, which allowed expansion of the service to China region.</li>
                    </ul>
                </p>
                <p>
                    <strong class="subtitle">SC2Mapster community</strong>
                    <ul>
                        <li>Feedback and general support.</li>
                    </ul>
                </p>
            </v-container>
        </v-card>
    </div>
</template>
