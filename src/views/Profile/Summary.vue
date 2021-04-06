<template>
    <v-container fluid v-if="profileSummary !== null">
        <dl class="d-info row">
            <dt class="col-12 col-sm-4 col-md-3">Last seen online</dt>
            <dd class="col-12 col-sm-8 col-md-9">
                <v-tooltip top transition="fade-transition">
                    <template v-slot:activator="{ on, attrs }">
                        <span class="font-weight-light" v-bind="attrs" v-on="on">
                            {{ $dfns.formatDistanceStrict(new Date(profileSummary.profile.lastOnlineAt), new Date(), {
                                addSuffix: true,
                                roundingMethod: 'floor'}) }}
                        </span>
                    </template>
                    <span>{{ $dfns.formatISO9075(new Date(profileSummary.profile.lastOnlineAt), { representation: 'complete' }) }}</span>
                </v-tooltip>
            </dd>
        </dl>
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
        supressErrorCodes: [404],
        onHttpError: function (this, err) {
            if (err.response!.status === 403) {
                (this.$parent as ProfileBaseView).isAccessRestricted = true;
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
        await this.fetchSummary();
    }
}
</script>
