<template>
    <v-container v-if="errorMessage">
        <template>
            <v-banner>
                <v-avatar
                    slot="icon"
                    color="red darken-4"
                    size="40"
                >
                    <v-icon>fas fa-window-close</v-icon>
                </v-avatar>

                {{ errorMessage }}
            </v-banner>
        </template>
    </v-container>
    <v-container v-else class="d-flex justify-center">
        <v-btn
            color="primary"
            large
            tile
            outlined
            :loading="isRedirecting"
            :to="{ name: 'account_auth', query: { method: 'bnet' } }"
        >
            <v-icon left color="primary accent-4">fab fa-battle-net</v-icon>
            Login via Battle.net
        </v-btn>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';

@Component
export default class AccountAuthView extends Vue {
    private isRedirecting = false;
    private errorMessage: string | null = null;

    private get redirectUri() {
        return window.location.origin + this.$route.path;
    }

    @SGuard()
    async performAuth(code: string) {
        const response = (await this.$starc.accountAuthBnet({
            code: code,
            redirectUri: this.redirectUri,
        })).data;
        this.$store.battleAccount = response.battleAccount;
        localStorage.setItem('user_token', response.accessToken);
        this.$starc.axios.defaults.headers['Authorization'] = `Bearer ${response.accessToken}`;
    }

    @Watch('$route')
    async exec() {
        if (this.$route.query.error === 'access_denied') {
            this.errorMessage = (this.$route.query.error_description as string) ?? `Authentication processed cancelled - access was denied.`;
        }
        else if (this.$route.query.code) {
            await this.performAuth(String(this.$route.query.code ?? ''));
            await this.$router.replace({ name: this.$route.name! });
            return;
        }
        else if (this.$route.query.method === 'bnet') {
            this.isRedirecting = true;
            const battleClientId = process.env.VUE_APP_STARC_BATTLE_API_CLIENT_ID;
            window.location.href = `https://us.battle.net/oauth/authorize?response_type=code&client_id=${battleClientId}&redirect_uri=${this.redirectUri}&scope=sc2.profile&state=sc2`;
        }

        if (this.$store.battleAccount) {
            await this.$router.replace({ name: 'home' });
        }
    }

    async created() {
        await this.exec();
    }
}
</script>

<style lang="scss">
</style>
