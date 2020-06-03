
<template>
    <v-card class="py-2 px-2">
        <p>History</p>
        <v-simple-table dense>
            <template v-if="lobbiesHistory" v-slot:default>
                <thead>
                    <tr>
                        <th class="text-left">ID</th>
                        <th class="text-left">Status</th>
                        <th class="text-left">Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in lobbiesHistory" :key="item.bnetRecordId">
                        <td>
                            <router-link :to="{
                                name: 'lobby',
                                params: {
                                    regionId: $route.params.regionId,
                                    bnetBucketId: item.bnetBucketId,
                                    bnetRecordId: item.bnetRecordId,
                                },
                            }">
                                {{ item.bnetRecordId }}
                            </router-link>
                        </td>
                        <td>{{ item.status }}</td>
                        <td>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
                                        {{ $dfns.formatDistanceStrict(new Date(item.closedAt), new Date(), {
                                            addSuffix: true,
                                            roundingMethod: 'floor'}) }}
                                    </span>
                                </template>
                                <span>{{ $dfns.formatISO9075(new Date(item.closedAt), { representation: 'complete' }) }}</span>
                            </v-tooltip>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';

@Component
export default class MapLobbiesHistoryView extends Vue {
    private lobbiesHistory: any[] | null = null;

    private async created() {
        const loading = this.$loading({ fullscreen: true });
        this.lobbiesHistory = (await this.$starc.getMapLobbiesHistory(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId)
        )).data.results;
        loading.close();
    }
}
</script>
