import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';

@Component
export class AppStore extends Vue {
    // userAccount: starc.AccountInfoResponse | null = null;
    battleAccount: starc.AccountBattleInfo | null = null;
}

export default new AppStore();
