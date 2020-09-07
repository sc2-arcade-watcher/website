<template>
    <p>AccountInfoView</p>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';

@Component
export default class AccountInfoView extends Vue {
    @SGuard()
    async doLogout() {
        await this.$starc.accountLogout();
        delete this.$starc.axios.defaults.headers['Authorization'];
        localStorage.removeItem('user_token');
        this.$store.battleAccount = null;
    }

    @Watch('$route')
    async checkLogout() {
        if (typeof this.$route.query.logout !== 'undefined') {
            await this.doLogout();
            if (!this.$store.battleAccount) {
                this.$router.go(-1);
            }
        }
        else {
            if (!this.$store.battleAccount) {
                await this.$router.push({ name: 'account_auth' });
            }
        }
    }

    async created() {
        await this.checkLogout();
    }
}
</script>
