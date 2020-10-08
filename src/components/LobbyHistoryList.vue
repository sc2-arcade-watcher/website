<template>
    <v-simple-table dense fixed-header>
        <template v-slot:default>
            <thead>
                <tr>
                    <th></th>
                    <th>Map / Mod</th>
                    <th>Title</th>
                    <th>Host</th>
                    <th>Players</th>
                    <th>Date</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in lobbiesHistory" :key="item.bnetRecordId">
                    <td>
                        <template v-if="item.status === 'started'">
                            <v-icon color="green" small title="Started">fas fa-calendar-check</v-icon>
                        </template>
                        <template v-else-if="item.status === 'abandoned'">
                            <v-icon color="red" small title="Abandoned">fas fa-calendar-times</v-icon>
                        </template>
                        <template v-else-if="item.status === 'open'">
                            <v-icon color="yellow" small title="Open">fas fa-hourglass-start</v-icon>
                        </template>
                        <template v-else-if="item.status === 'unknown'">
                            <v-icon color="grey" small title="Unknown">fas fa-question-circle</v-icon>
                        </template>
                    </td>
                    <td class="text-left">
                        <template v-if="item.map && item.map.bnetId !== mapId">
                            <router-link
                                class="d-inline-block"
                                :title="item.map.name"
                                :to="{ name: 'map_base', params: { regionId: item.map.regionId, mapId: item.map.bnetId } }"
                            >
                                <v-img
                                    :src="$starc.depotImage(item.map.iconHash, item.map.regionId).url"
                                    max-width="80"
                                    height="50"
                                    contain
                                    class="float-left my-0 mt-1"
                                />
                            </router-link>
                        </template>
                        <template v-if="item.extMod && item.extMod.bnetId !== mapId">
                            <router-link
                                class="d-inline-block"
                                :title="item.extMod.name"
                                :to="{ name: 'map_base', params: { regionId: item.extMod.regionId, mapId: item.extMod.bnetId } }"
                            >
                                <!-- <v-img
                                    :src="$starc.depotImage(item.extMod.iconHash, item.extMod.regionId).url"
                                    max-width="80"
                                    height="50"
                                    contain
                                    class="float-left my-0 mt-1"
                                /> -->
                                {{ item.extMod.name }}
                            </router-link>
                        </template>
                    </td>
                    <td>
                        {{ item.lobbyTitle }}
                    </td>
                    <td>
                        {{ item.hostName }}
                    </td>
                    <td>
                        <v-tooltip top v-if="item.slots.length">
                            <template v-slot:activator="{ on, attrs }">
                                <span v-bind="attrs" v-on="on">
                                    {{ item.slots.filter(x => x.kind === 'human').length }}&nbsp;/&nbsp;{{ item.slots.filter(x => x.kind !== 'ai').length }}
                                </span>
                            </template>
                            <ol>
                                <li v-for="slot in item.slots.filter(x => x.kind !== 'open')" :key="slot.slotNumber">
                                    <span v-if="slot.kind === 'ai'">AI</span>
                                    <span v-else><strong>{{ slot.name }}</strong></span>
                                </li>
                            </ol>
                        </v-tooltip>
                        <span v-else></span>
                    </td>
                    <td>
                        <v-tooltip top v-if="item.closedAt !== null">
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
                    <td>
                        <v-btn
                            tile
                            small
                            text
                            color="primary"
                            title="View details"
                            :to="{
                                name: 'lobby',
                                params: {
                                    regionId: $route.params.regionId,
                                    bnetBucketId: item.bnetBucketId,
                                    bnetRecordId: item.bnetRecordId,
                                },
                            }"
                        >
                            <v-icon small>fas fa-info-circle</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '@/helpers';

@Component
export default class LobbyHistoryList extends Vue {
    @Prop({
        required: true,
    })
    readonly lobbiesHistory!: starc.GameLobbyData[];
    private mapId: number | null = null;

    created() {
        this.mapId = Number(this.$route.params.mapId);
    }
}
</script>

<style lang="scss" scoped>
.v-data-table {
    background: transparent !important;
}
</style>
