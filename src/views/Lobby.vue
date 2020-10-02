<template>
    <div class="game-lobby-view" v-if="lobby">
        <v-row>
            <v-col md="5" sm="12">
                <v-card outlined>
                    <v-list-item dense>
                        <v-list-item-title>
                            <v-img :src="require(`@/assets/region-${lobby.regionId}.png`)" max-width="24" />
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

                <div v-if="lobby.map">
                    <v-subheader>Map info</v-subheader>
                    <v-card
                        class="map-card"
                        outlined
                        :to="{ name: 'map_base', params: { regionId: lobby.map.regionId, mapId: lobby.map.bnetId } }"
                    >
                        <v-list-item v-if="lobby.map">
                            <v-list-item-content>
                                <v-list-item-title class="headline">{{ lobby.map.name }}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-avatar tile size="100" color="grey">
                                <v-img :src="$starc.depotImage(lobby.map.iconHash, lobby.map.regionId).url"></v-img>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-card>
                </div>

                <div v-if="lobby.extMod">
                    <v-subheader>Extension mod info</v-subheader>
                    <v-card
                        class="map-card"
                        outlined
                        :to="{ name: 'map_base', params: { regionId: lobby.extMod.regionId, mapId: lobby.extMod.bnetId } }"
                    >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="headline">{{ lobby.extMod.name }}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-avatar tile size="100" color="grey">
                                <v-img :src="$starc.depotImage(lobby.extMod.iconHash, lobby.extMod.regionId).url"></v-img>
                            </v-list-item-avatar>
                        </v-list-item>
                    </v-card>
                </div>

                <div v-if="lobby.multiMod">
                    <v-subheader>Multi mod info</v-subheader>
                    <v-card
                        class="map-card"
                        outlined
                        :to="{ name: 'map_base', params: { regionId: lobby.multiMod.regionId, mapId: lobby.multiMod.bnetId } }"
                    >
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="headline">{{ lobby.multiMod.name }}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-avatar tile size="100" color="grey">
                                <v-img :src="$starc.depotImage(lobby.multiMod.iconHash, lobby.multiMod.regionId).url"></v-img>
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
                        <v-list-item-avatar tile v-if="currSlot.kind === 'human'" style="border: 1px solid rgba(255,255,255,0.1);">
                            <v-img v-if="currSlot.profile && currSlot.profile.avatarUrl" :src="currSlot.profile.avatarUrl"></v-img>
                            <v-avatar
                                v-else
                                color="grey darken-3"
                                tile
                            >
                                <v-icon dark>
                                    mdi-account-question
                                </v-icon>
                            </v-avatar>
                            <!-- <v-img v-else :src="require('@/assets/Kachinsky_SC2_Portrait1.jpg')"></v-img> -->
                        </v-list-item-avatar>

                        <v-list-item-title v-if="currSlot.kind === 'human'">
                            <span v-if="!currSlot.profile">{{ currSlot.name }}</span>
                            <router-link
                                v-if="currSlot.profile"
                                :to="{ name: 'profile_base', params: {
                                    regionId: currSlot.profile.regionId,
                                    realmId: currSlot.profile.realmId,
                                    profileId: currSlot.profile.profileId,
                                }}"
                            >{{ currSlot.profile.name }}</router-link>
                            <span v-if="currSlot.name === lobby.hostName"> (host)</span>
                        </v-list-item-title>
                        <v-list-item-subtitle v-text="currSlot.kind.toUpperCase()"/>
                    </v-list-item>
                </v-list>

                <v-subheader>Join history</v-subheader>
                <v-list class="join-history">
                    <v-list-item v-for="(jevent, i) in joinEvents" :key="i" dense>
                        <v-list-item-title>
                            <v-icon color="green" small left v-if="jevent.type === 'joined'">fas fa-sign-in-alt</v-icon>
                            <v-icon color="red" small left v-if="jevent.type === 'left'">fas fa-sign-out-alt</v-icon>
                            <span style="font-weight: 300;">{{ joinEvents.length - i }}. </span>
                            <router-link
                                v-if="jevent.profile"
                                :to="{ name: 'profile_base', params: {
                                    regionId: jevent.profile.regionId,
                                    realmId: jevent.profile.realmId,
                                    profileId: jevent.profile.profileId,
                                }}"
                            >
                                {{ jevent.profile.name }}
                            </router-link>
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            {{ $dfns.formatISO9075(new Date(jevent.date), { representation: 'complete' }) }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                            {{ $dfns.formatDistanceStrict(new Date(jevent.date), new Date(), {
                                addSuffix: true,
                                roundingMethod: 'floor'}) }}
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
import { SGuard } from '../helpers';

interface JoinLeaveEvent {
    type: 'joined' | 'left';
    profile: starc.Profile;
    date: Date;
}

@Component
export default class LobbyView extends Vue {
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

    private get joinEvents() {
        const events: JoinLeaveEvent[] = [];

        for (const item of this.lobby!.joinHistory!) {
            events.push({
                type: 'joined',
                date: new Date(item.joinedAt),
                profile: item.profile,
            });
            if (item.leftAt) {
                events.push({
                    type: 'left',
                    date: new Date(item.leftAt),
                    profile: item.profile,
                });
            }
        }

        return events.sort((a, b) => a.date.getTime() - b.date.getTime()).reverse();
    }

    private async refresh() {
        this.refreshTimer = null;
        this.lobby = (await this.$starc.getLobbyDetails(
            Number(this.$route.params.regionId),
            Number(this.$route.params.bnetBucketId),
            Number(this.$route.params.bnetRecordId)
        )).data;
        if (this.lobby.status === starc.GameLobbyStatus.Open) {
            this.refreshTimer = setTimeout(this.refresh.bind(this), 10000);
        }
    }

    @SGuard()
    private async fetchData() {
        await this.refresh();
    }

    private async created() {
        await this.fetchData();
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

<style lang="scss">
.map-card {
    .v-list-item {
        padding-right: 5px;
    }

    .v-list-item__title {
        white-space: normal;
    }

    .v-list-item__avatar {
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .v-avatar {
    }
}

.join-history {
    .v-list-item {
        min-height: 30px;
        border-bottom: 1px dashed rgba(#fff, 0.05);
    }
}
</style>
