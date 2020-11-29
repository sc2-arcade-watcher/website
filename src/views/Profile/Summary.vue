<template>
    <v-container fluid v-if="profileSummary !== null">
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';
import ProfileBaseView from './Base.vue';

@Component
export default class ProfileSummaryView extends Vue {
    private profileSummary: any | null = null;

    @SGuard({
        onHttpError: function (this, err) {
            if (err.response!.status === 403) {
                (this.$parent as ProfileBaseView).isAccessRestricted = true;
                return true;
            }
            if (err.response!.status === 404) {
                return true;
            }
        }
    })
    private async fetchSummary() {
        this.profileSummary = (await this.$starc.getProfileSummary({
            regionId: Number(this.$route.params.regionId),
            realmId: Number(this.$route.params.realmId),
            profileId: Number(this.$route.params.profileId),
        })).data;
    }

    private async created() {
        // await this.fetchSummary();
    }
}
</script>
