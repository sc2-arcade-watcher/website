<template>
    <div>
        <v-card
            tile
            raised
        >
            <v-container>
                <v-alert
                    dense
                    text
                    color="white"
                    icon="mdi-clock-fast"
                    border="left"
                >
                    <h2 class="headline">This guidelines is outdated as of September 1, 2022</h2>
                    <p>There was <a href="https://discord.com/blog/welcome-to-the-new-era-of-discord-apps" target="_blank">a major change in the Discord API</a> that significantly affected the bot, and the whole process of configuration.</p>
                    <p>Fortunately.. <strong>there's a workaround!</strong>.. see below:</p>
                </v-alert>
                <p>Basically, @Arcade Watcher no longer receives/sees messages in which it isn't mentioned or tagged other way. Thus it's no longer capable of responding to casual commands.. its prompts system is a bit bugged too...</p>
                <p>
                <p>To be able to use the bot until I'll find the time to update it on my end, <strong>you need to use reply to message feature of Discord</strong>, when communicating with the bot. See examples:</p>
                <div class="text-center">
                    <v-img class="d-inline-block" :src="require('@/assets/info/discord-bot/discord-aw-workaround1.png')" alt="" />

                    <v-img class="d-inline-block" :src="require('@/assets/info/discord-bot/discord-aw-workaround1.png') " alt="" />
                </div>
            </v-container>
        </v-card>

        <v-divider class="my-5" />

        <v-card
            tile
            raised
        >
            <v-container>
                <h2 class="headline">Discord bot - Arcade Watcher</h2>
                <v-img
                    class="d-inline-block float-sm-right mx-1"
                    :src="require('@/assets/info/discord-bot/bot1.png')"
                />
                <p>
                    <strong>Arcade Watcher</strong> is a Discord bot, which main purpose is to notify players (via DM or through a public channel) and mod makers about upcoming games on Arcade platform.
                </p>
                <p>
                    To use it, you'll need to configure a subscription for specific map or set of maps. Then bot will monitor open lobbies list in SC2, seeking any publicly hosted lobbies that matches with your subscription. Once detected it'll post a message about the lobby it has found, and will continue to update it until lobby is closed.
                </p>
                <p>
                    To install bot on your server use the following link, and fill the form.
                </p>

                <p class="text-center">
                    <v-btn
                        large
                        tile
                        color="primary darken-1"
                        href="https://discord.com/oauth2/authorize?client_id=672155669633171488&scope=bot&permissions=379968"
                        target="_blank"
                    >
                        <v-icon left>fas fa-external-link-alt</v-icon>
                        Install bot on Discord Server
                    </v-btn>
                </p>
                <p>
                    Upon successful installation, send <code>.help</code> command to retrieve basic instructions and a list of available commands. (It can be sent in any public channel available to the bot, or through DM).
                </p>

                <v-divider class="my-3"/>
                <h3 class="headline">Setting up subscription on a server</h3>
                <ol>
                    <li>Send a <code>.sub.new</code> command on any channel accessible to the bot.</li>
                    <li>In a follow-up message provide name of the map, and channel where bot should post about lobbies.</li>
                </ol>

                <v-alert
                    type="warning"
                    dense
                    text
                >
                    <p>There are two methods of providing arguments for the commands, and depending on the method you choose you need to remember when to surround arguments with quotes, and when not to</p>
                    <p>
                        <strong>Upfront:</strong> It's possible to provide all arguments for the command upfront, in which case you may need to surround arguments with quotes (otherwise it'll treat space as a delimeter). <br>
                        Example: <code>.sub.new "NAME OF THE MAP" #channel-name</code>
                    </p>
                    <p>
                        <strong>Prompts:</strong> You may ommit some, or even all arguments. Bot will then prompt for every required argument individually. In this mode you should not use quotes! Since each message you sent will be treated separately, and any extra characters included will be taken as is.<br>
                        Example: <code>.sub.new</code> -> <code>NAME OF THE MAP</code> -> <code>#channel-name</code>
                    </p>
                </v-alert>

                <div class="my-2 text-center">
                    <v-img class="d-inline-block" :src="require('@/assets/info/discord-bot/sub-server-cave.png')" />
                </div>

                <v-alert
                    type="warning"
                    dense
                    text
                >
                    If bot isn't posting lobbies in a specified channel, while the subscription was configured correctly, ensure it has permissions to send messages. It's best to configure the bot in the same channel - if it can respond to commands, it means it has permissions to send messages.
                </v-alert>

                <v-alert
                    type="info"
                    dense
                    text
                >
                    One of the most common setups, is to create separate channel for each region, such as <code>#lobbies-us</code>, <code>#lobbies-eu</code>. Then for every created channel, create a corresponding subscription. And reconfigure (<code>.sub.config</code>) its region parameter, so that it points to a matching SC2 region of a channel.
                </v-alert>

                <v-divider class="my-3"/>
                <h3 class="headline">Setting up personal subscriptions via DM</h3>
                <ol>
                    <li>Send a <code>.sub.new.dm</code> command through DM.</li>
                    <li>In a follow-up message provide name of the map/extension mod.</li>
                </ol>
                <div class="my-2 text-center">
                    <v-img class="d-inline-block" :src="require('@/assets/info/discord-bot/sub-dm-ibecv.png')" />
                    <v-img class="d-inline-block" :src="require('@/assets/info/discord-bot/sub-dm-ibecv-sc2.png')" />
                </div>
            </v-container>
        </v-card>
    </div>
</template>
