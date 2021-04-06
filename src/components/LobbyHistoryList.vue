<template>
    <v-simple-table dense fixed-header>
        <template v-slot:default>
            <thead>
                <tr>
                    <th></th>
                    <th v-if="showMapModColumn">Map / Mod</th>
                    <th>Variant</th>
                    <th>Players</th>
                    <th>Closed at</th>
                    <th>Match info</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in lobbiesHistory" :key="item.bnetRecordId">
                    <td class="px-1 text-center" style="width: 46px;">
                        <template v-if="item.status === 'started'">
                            <v-icon color="green" small title="Started">fas fa-calendar-check</v-icon>
                        </template>
                        <template v-else-if="item.status === 'abandoned'">
                            <v-icon color="red" small title="Abandoned">fas fa-door-closed</v-icon>
                        </template>
                        <template v-else-if="item.status === 'open'">
                            <v-icon color="yellow" small title="Open">fas fa-hourglass-start</v-icon>
                        </template>
                        <template v-else-if="item.status === 'unknown'">
                            <v-icon color="grey" small title="Unknown">fas fa-question-circle</v-icon>
                        </template>
                    </td>
                    <td class="text-left" v-if="showMapModColumn">
                        <template v-if="item.map && item.map.bnetId !== mapId">
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
                                    max-width="70"
                                    height="35"
                                    contain
                                    class="float-left my-0"
                                />
                                <span v-if="!item.extMod">{{ item.map.name }}</span>
                            </v-btn>
                        </template>
                        <template v-if="item.extMod && item.extMod.bnetId !== mapId">
                            <v-btn
                                tile
                                small
                                text
                                class="overline my-1"
                                color="deep-orange lighten-2"
                                style="text-transform: none !important; padding-left: 6px; padding-right: 6px;"
                                :title="item.extMod.name"
                                :to="{ name: 'map_details', params: { regionId: item.extMod.regionId, mapId: item.extMod.bnetId } }"
                            >
                                <v-icon x-small color="grey lighten-1" left>fas fa-plus</v-icon>
                                <!-- <v-img
                                    :src="$starc.depotImage(item.extMod.iconHash, item.extMod.regionId).url"
                                    max-width="80"
                                    height="50"
                                    contain
                                    class="float-left my-0 mt-1"
                                /> -->
                                {{ item.extMod.name }}
                            </v-btn>
                        </template>
                    </td>
                    <td class="text--secondary overline text-no-wrap">
                        <span v-if="item.mapVariantMode">{{ item.mapVariantMode }}</span>
                        <span v-else>[{{ item.mapVariantIndex }}]</span>
                    </td>
                    <td>
                        <template v-if="item.status === 'started'">
                            <v-tooltip top v-if="item.slots && item.slots.length">
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on" class="overline teal--text text--lighten-2">
                                        {{ item.slots.filter(x => x.kind === 'human').length }}/{{ item.slots.filter(x => x.kind !== 'ai').length }}
                                    </span>
                                </template>
                                <ol>
                                    <li v-for="slot in item.slots.filter(x => x.kind !== 'open')" :key="slot.slotNumber">
                                        <span v-if="slot.kind === 'ai'">AI</span>
                                        <span v-else><strong>{{ slot.name }}</strong></span>
                                    </li>
                                </ol>
                            </v-tooltip>
                            <div v-else>
                                <v-tooltip top transition="fade-transition">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span v-bind="attrs" v-on="on">
                                            <span class="overline teal--text text--lighten-2">{{ item.slotsHumansTaken }}/{{ item.slotsHumansTotal }}</span>
                                            <v-icon color="primary" right v-if="item.lobbyTitle" x-small>fas fa-info</v-icon>
                                        </span>
                                    </template>
                                    <div v-if="item.hostName">
                                        <span class="overline d-inline-block pr-1">Host:</span>
                                        <span class="body-2 font-weight-normal text--secondary">{{ item.hostName }}</span>
                                    </div>
                                    <div v-if="item.lobbyTitle">
                                        <span class="overline d-inline-block pr-1">Lobby name:</span>
                                        <span class="body-2 font-weight-normal text--secondary">{{ item.lobbyTitle }}</span>
                                    </div>
                                </v-tooltip>
                            </div>
                        </template>
                        <template v-else>
                        </template>
                    </td>
                    <td class="text-no-wrap font-weight-light">
                        <v-tooltip top transition="fade-transition" v-if="item.closedAt !== null">
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
                        <template v-if="item.status === 'started'">
                            <template v-if="item.match && item.match.completedAt">
                                <span class="overline primary--text text--lighten-2">{{ $helpers.formatDateDistance(item.match.completedAt, item.closedAt, { lowestTier: 'm' }) }} <v-icon x-small color="grey">fa-clock</v-icon></span>
                                <template v-if="profileSelf && getMatchPlayerResult(item, profileSelf)">
                                    <small class="text--secondary d-inline-block px-2">|</small>
                                    <span :class="`overline font-weight-bold match-decision-${getMatchPlayerResult(item, profileSelf).decision}`">{{ getMatchPlayerResult(item, profileSelf).decision }}</span>
                                </template>
                            </template>
                            <template v-else-if="item.match">
                                <small class="font-weight-normal red--text">E({{ item.match.result }})</small>
                            </template>
                            <template v-else-if="(Date.now() - item.closedAt.getTime()) / 1000 < 3600 * 10">
                                <small class="font-weight-normal text--secondary">Ongoing</small>
                            </template>
                            <template v-else>
                                <v-icon color="grey" x-small title="Not available">fa fa-times</v-icon>
                            </template>
                        </template>
                    </td>
                    <td class="pr-2">
                        <v-btn
                            class="float-right"
                            tile
                            small
                            text
                            color="primary"
                            :to="{
                                name: 'lobby',
                                params: {
                                    regionId: $route.params.regionId,
                                    bnetBucketId: item.bnetBucketId,
                                    bnetRecordId: item.bnetRecordId,
                                },
                            }"
                        >
                            <v-icon small left>mdi-page-next-outline</v-icon>
                            Details
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

    @Prop({
        required: false,
    })
    readonly profileSelf?: starc.ProfileBase;

    private mapId: number | null = null;
    private showMapModColumn = true;

    private getMatchPlayerResult(lobby: starc.GameLobbyData, profile: starc.ProfileBase) {
        if (!lobby.match) return;
        return lobby.match?.profileMatches.find(x => {
            return x.profile.realmId === profile.realmId && x.profile.profileId === profile.profileId;
        });
    }

    created() {
        this.mapId = Number(this.$route.params.mapId);
        if (this.lobbiesHistory.length) {
            this.showMapModColumn = (
                Number(this.$route.params.mapId) !== this.lobbiesHistory[0].mapBnetId ||
                this.lobbiesHistory.findIndex(x => x.extModBnetId) !== -1
            );
        }
        else {
            this.showMapModColumn = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.v-data-table {
    background: transparent !important;
}
</style>
