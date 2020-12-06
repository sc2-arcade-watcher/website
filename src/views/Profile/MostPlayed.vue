<template>
    <v-container fluid v-if="mapStats !== null" class="pt-0">
        <v-row>
            <v-card class="card-t1 flex-grow-1 profile-summary" raised elevation outlined>
                <v-card-text class="py-1">
                    <h3 class="overline font-weight-bold">Most played custom maps &amp; extension mods</h3>
                </v-card-text>

                <v-simple-table fixed-header>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="overline"></th>
                                <th class="overline">Name</th>
                                <th class="overline">Genre</th>
                                <th class="overline">Public lobbies</th>
                                <th class="overline">Last time played</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, i) in mapStats" :key="i">
                                <td>
                                    <span class="font-weight-medium text--secondary">{{ i + 1 }}.</span>
                                </td>
                                <td>
                                    <v-btn
                                        tile
                                        large
                                        text
                                        color="primary accent-1"
                                        style="text-transform: none !important; padding-left: 0; padding-right: 10px;"
                                        :title="item.map.name"
                                        :to="{ name: 'map_details', params: { regionId: item.map.regionId, mapId: item.map.bnetId } }"
                                    >
                                        <v-img
                                            :src="$starc.depotImage(item.map.iconHash, item.map.regionId).url"
                                            width="70"
                                            height="35"
                                            contain
                                            class="float-left my-0"
                                        />
                                        {{ item.map.name }}
                                    </v-btn>
                                </td>
                                <td>
                                    <span class="overline secondary--text text--lighten-2" v-html="$sTypes.categoryById(item.map.mainCategoryId).name"/>
                                </td>
                                <td>
                                    <span class="body-1 font-weight-bold red--text text--lighten-2" v-html="item.lobbiesStarted"/>
                                </td>
                                <td>
                                    <v-tooltip top transition="fade-transition">
                                        <template v-slot:activator="{ on, attrs }">
                                            <span class="font-weight-light" v-bind="attrs" v-on="on">
                                                {{ $dfns.formatDistanceStrict(new Date(item.lastPlayedAt), new Date(), {
                                                    addSuffix: true,
                                                    roundingMethod: 'floor'}) }}
                                            </span>
                                        </template>
                                        <span>{{ $dfns.formatISO9075(new Date(item.lastPlayedAt), { representation: 'complete' }) }}</span>
                                    </v-tooltip>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-card>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard, isAxiosError } from '../../helpers';
import ProfileBaseView from './Base.vue';

@Component
export default class MostPlayedView extends Vue {
    private mapStats: starc.ProfileMostPlayedResponse | null = null;

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
    private async fetchData() {
        this.mapStats = (await this.$starc.getProfileMostPlayed({
            regionId: Number(this.$route.params.regionId),
            realmId: Number(this.$route.params.realmId),
            profileId: Number(this.$route.params.profileId),
        })).data;
    }

    private async created() {
        await this.fetchData();
    }
}
</script>
