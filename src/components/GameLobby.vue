<template>
    <div class="game-lobby-view" v-if="lobby">
        <v-row>
            <v-col md="5" sm="12">
                <v-card outlined>
                    <v-list-item dense>
                        <v-list-item-title>
                            <v-img :src="require(`../assets/region-${lobby.regionId}.png`)" max-width="24" />
                        </v-list-item-title>
                        <v-list-item-subtitle>#{{ lobby.regionId }}/{{ lobby.bnetBucketId }}/{{ lobby.bnetRecordId }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item dense>
                        <v-list-item-title>Status</v-list-item-title>
                        <v-list-item-subtitle>{{ lobby.status.toUpperCase() }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item dense>
                        <v-list-item-title>Created at</v-list-item-title>
                        <v-list-item-subtitle>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
                                        {{ $dfns.formatDistanceStrict(new Date(lobby.createdAt), new Date(), {
                                            addSuffix: true,
                                            roundingMethod: 'floor'}) }}
                                    </span>
                                </template>
                                <span>{{ $dfns.formatISO9075(new Date(lobby.createdAt), { representation: 'complete' }) }}</span>
                            </v-tooltip>
                        </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item dense v-if="lobby.closedAt">
                        <v-list-item-title>Closed at</v-list-item-title>
                        <v-list-item-subtitle>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
                                        {{ $dfns.formatDistanceStrict(new Date(lobby.closedAt), new Date(), {
                                            addSuffix: true,
                                            roundingMethod: 'floor'}) }}
                                    </span>
                                </template>
                                <span>{{ $dfns.formatISO9075(new Date(lobby.closedAt), { representation: 'complete' }) }}</span>
                            </v-tooltip>
                        </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item dense>
                        <v-list-item-title>Title</v-list-item-title>
                        <v-list-item-subtitle>{{ lobby.lobbyTitle }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item dense>
                        <v-list-item-title>Variant</v-list-item-title>
                        <v-list-item-subtitle>{{ lobby.mapVariantMode }}</v-list-item-subtitle>
                    </v-list-item>
                </v-card>

                <div>
                    <v-subheader>Map info</v-subheader>
                    <v-card outlined>
                        <v-list-item two-line v-if="lobby.map">
                            <v-list-item-content>
                                <v-list-item-title class="headline mb-1">{{ lobby.map.name }}</v-list-item-title>
                                <div class="overline">v{{ lobby.mapMajorVersion }}.{{ lobby.mapMinorVersion }}</div>
                                <v-btn text :to="{ name: 'map_details', params: { regionId: lobby.map.regionId, mapId: lobby.map.bnetId } }">Details</v-btn>
                            </v-list-item-content>

                            <v-list-item-avatar tile size="100" color="grey">
                                <v-img :src="$starc.bnetDepotImage(lobby.map.iconHash)"></v-img>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-card>
                </div>

                <div v-if="lobby.extMod">
                    <v-subheader>Extension mod info</v-subheader>
                    <v-card outlined>
                        <v-list-item two-line>
                            <v-list-item-content>
                                <v-list-item-title class="headline mb-1">{{ lobby.extMod.name }}</v-list-item-title>
                                <div class="overline">v{{ lobby.extMod.currentMajorVersion }}.{{ lobby.extMod.currentMinorVersion }}</div>
                                <v-btn text :to="{ name: 'map_details', params: { regionId: lobby.extMod.regionId, mapId: lobby.extMod.bnetId } }">Details</v-btn>
                            </v-list-item-content>

                            <v-list-item-avatar tile size="100" color="grey">
                                <v-img :src="$starc.bnetDepotImage(lobby.extMod.iconHash)"></v-img>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-card>
                </div>
            </v-col>
            <v-col md="7" sm="12">
                <!-- <v-card v-for="teamSect in teamSlots" :key="teamSect.team">
                </v-card> -->
                <v-list subheader v-for="currTeam in teamSlots" :key="currTeam.team" dense>
                    <v-subheader style="height: 30px; background: rgba(255,255,255,0.05);">{{ currTeam.name }}</v-subheader>
                    <v-list-item v-for="currSlot in currTeam.slots" :key="currSlot.slotNumber">
                        <v-list-item-avatar tile v-if="currSlot.kind === 'human'">
                            <v-img :src="require('../assets/Kachinsky_SC2_Portrait1.jpg')"></v-img>
                        </v-list-item-avatar>

                        <v-list-item-title v-if="currSlot.kind === 'human'">
                            <span v-if="!currSlot.profile">{{ currSlot.name }}</span>
                            <a v-if="currSlot.profile" :href="`https://starcraft2.com/en-us/profile/${currSlot.profile.regionId}/${currSlot.profile.realmId}/${currSlot.profile.profileId}`" target="_blank">{{ currSlot.name }}</a>
                            <span v-if="currSlot.name === lobby.hostName"> (host)</span>
                        </v-list-item-title>
                        <v-list-item-subtitle v-if="currSlot.kind !== 'human'" v-text="currSlot.kind.toUpperCase()"/>
                        <v-list-item-subtitle v-if="currSlot.kind === 'human' && currSlot.joinInfo">
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <span v-bind="attrs" v-on="on">
                                        {{ $dfns.formatDistanceStrict(new Date(currSlot.joinInfo.joinedAt), new Date(), {
                                            addSuffix: true,
                                            roundingMethod: 'floor'}) }}
                                    </span>
                                </template>
                                <span>{{ $dfns.formatISO9075(new Date(currSlot.joinInfo.joinedAt), { representation: 'complete' }) }}</span>
                            </v-tooltip>
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';

@Component
export default class GameLobby extends Vue {
    private refreshTimer: number | null = null;
    private lobby: starc.GameLobbyData | null = null;

    private get teamSlots() {
        type rType = {[key: number]: {
            team: number;
            name: string;
            slots: starc.GameLobbySlot[],
        }};
        const results: rType = {};
        for (const currSlot of this.lobby!.slots!) {
            if (!results[currSlot.team]) {
                results[currSlot.team] = {
                    team: currSlot.team,
                    name: `Team ${currSlot.team}`,
                    slots: [],
                };
            }
            results[currSlot.team].slots.push(currSlot);
        }
        return results;
    }

    private async refresh() {
        this.refreshTimer = null;
        this.lobby = (await this.$starc.getLobbyDetails(
            Number(this.$route.params.regionId),
            Number(this.$route.params.bnetBucketId),
            Number(this.$route.params.bnetRecordId)
        )).data;
        this.refreshTimer = setTimeout(this.refresh.bind(this), 10000);
    }

    private async created() {
        const loading = this.$loading({ fullscreen: true });
        await this.refresh();
        loading.close();
    }

    private beforeDestroy() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    private mounted() {
    }
}
</script>
