<template>
    <div class="game-lobby-view" v-if="lobby">
        <v-row>
            <v-col md="6" sm="12">
                <v-card tile raised>
                    <v-card-title class="display-1">
                        <template v-if="lobby.map">
                            {{ lobby.map.name }}
                        </template>
                        <template v-else>
                            Unknown map {{ lobby.mapBnetId }}
                        </template>
                    </v-card-title>
                    <v-list-item dense>
                        <v-list-item-title :class="`lobby-status status-${lobby.status}`" style="flex-basis: 50%;">
                            <template v-if="lobby.status === 'started'">
                                <v-icon color="green" dense>fas fa-calendar-check</v-icon>
                            </template>
                            <template v-else-if="lobby.status === 'abandoned'">
                                <v-icon color="red" dense>fas fa-door-closed</v-icon>
                            </template>
                            <template v-else-if="lobby.status === 'open'">
                                <v-icon color="yellow" dense>fas fa-hourglass-start</v-icon>
                            </template>
                            <template v-else-if="lobby.status === 'unknown'">
                                <v-icon color="grey" dense>fas fa-question-circle</v-icon>
                            </template>
                            {{ lobby.status }}
                        </v-list-item-title>
                        <v-list-item-subtitle style="flex-basis: 25%;">
                            Mode:
                            <span class="primary--text">{{ lobby.mapVariantMode }}</span>
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="justify-end text-end" style="flex-basis: 25%;">
                            <span class="px-2">{{ regionsList.find(x => x.id === lobby.regionId).name }}</span>
                            <v-img class="d-inline-block" style="vertical-align: middle;" :src="require(`@/assets/region-${lobby.regionId}.png`)" max-width="24" />
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-card>

                <v-subheader class="overline" v-if="lobby.status === 'started'">
                    <strong>Match status</strong>
                    <div class="flex-grow-1 justify-end text-end" v-if="!isMatchSummaryLoading">
                        <span v-if="matchSummary && matchSummary.completedAt">
                            <span class="font-weight-light">Completed</span>
                            <span class="primary--text">
                                ({{ $dfns.formatDistance(new Date(matchSummary.completedAt), new Date(lobby.closedAt), {
                                    roundingMethod: 'floor'}) }})
                            </span>
                        </span>
                        <span class="red--text text--darken-3" v-else-if="matchSummary">Failed to identify</span>
                        <span class="grey--text text--darken-2" v-else>Unknown / In-progress</span>
                    </div>
                    <div v-else>
                        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </div>
                </v-subheader>
                <v-subheader class="overline" v-else>Slots</v-subheader>

                <v-list subheader v-for="currTeam in teamSlots" :key="currTeam.team">
                    <v-subheader class="overline" style="height: 26px; background: rgba(255,255,255,0.05);">{{ currTeam.name }}</v-subheader>
                    <v-list-item v-for="currSlot in currTeam.slots" :key="currSlot.slotNumber">
                        <v-list-item-title v-if="currSlot.kind === 'human'">
                            <span v-if="!currSlot.profile">{{ currSlot.name }}</span>
                            <profile-item v-if="currSlot.profile" :profile="currSlot.profile"/>
                            <span v-if="currSlot.name === lobby.hostName" class="overline"> (host)</span>
                        </v-list-item-title>

                        <v-list-item-subtitle v-if="currSlot.profile && matchSummary && getMatchPlayerResult(currSlot.profile)">
                            <span :class="`overline font-weight-bold match-decision-${getMatchPlayerResult(currSlot.profile).decision}`">
                                {{ getMatchPlayerResult(currSlot.profile).decision }}
                            </span>
                        </v-list-item-subtitle>
                        <v-list-item-subtitle v-else v-text="currSlot.kind.toUpperCase()"/>
                    </v-list-item>
                </v-list>
            </v-col>

            <v-col md="6" sm="12">
                <div class="d-flex flex-wrap">
                    <map-item class="flex-grow-1 mr-2" v-if="lobby.map" :map="lobby.map"/>
                    <map-item class="flex-grow-1 mr-2" v-if="lobby.extMod" :map="lobby.extMod"/>
                    <map-item class="flex-grow-1 mr-2" v-if="lobby.multiMod" :map="lobby.multiMod"/>
                </div>

                <v-subheader class="overline">Event log</v-subheader>
                <v-list class="join-history">
                    <transition-group name="list" tag="div">
                        <v-list-item v-for="(jevent, i) in joinEvents" :key="i" dense>
                            <v-list-item-title class="meta">
                                <v-icon color="green" x-small v-if="jevent.type === 'join'">fas fa-sign-in-alt</v-icon>
                                <v-icon color="grey accent-2" x-small v-else-if="jevent.type === 'left'">fas fa-sign-out-alt</v-icon>
                                <v-icon color="primary accent-2" x-small v-else-if="jevent.type === 'title'">fas fa-bullhorn</v-icon>
                                <v-icon color="yellow" x-small v-else-if="jevent.type === 'open'">fas fa-hourglass-start</v-icon>
                                <v-icon color="grey" x-small v-else-if="jevent.type === 'close'">fas fa-door-closed</v-icon>
                                <v-icon color="primary" x-small v-else-if="jevent.type === 'completed'">fas fa-check</v-icon>
                                <span class="d-inline-block">{{ joinEvents.length - i }}. </span>
                            </v-list-item-title>

                            <v-list-item-subtitle class="profile">
                                <router-link
                                    v-if="jevent.profile"
                                    :to="{ name: 'profile_summary', params: {
                                        regionId: jevent.profile.regionId,
                                        realmId: jevent.profile.realmId,
                                        profileId: jevent.profile.profileId,
                                    }}"
                                >
                                    {{ jevent.profile.name }}
                                </router-link>
                            </v-list-item-subtitle>

                            <v-list-item-subtitle class="content">
                                <span v-if="jevent.type === 'title' && jevent.message"><em>{{ jevent.message }}</em></span>
                                <span v-else-if="jevent.message">{{ jevent.message }}</span>
                            </v-list-item-subtitle>

                            <v-list-item-subtitle class="date">
                                <v-tooltip top transition="fade-transition" v-if="lobby.closedAt === null">
                                    <template v-slot:activator="{ on, attrs }">
                                        <span class="font-weight-light" v-bind="attrs" v-on="on">
                                            {{ $dfns.formatDistanceStrict(new Date(jevent.date), new Date(), {
                                                addSuffix: true,
                                                roundingMethod: 'floor'}) }}
                                        </span>
                                    </template>
                                    <span>{{ $dfns.formatISO9075(new Date(jevent.date), { representation: 'complete' }) }}</span>
                                </v-tooltip>
                                <span class="font-weight-light" v-else>
                                    {{ $dfns.formatISO9075(new Date(jevent.date), { representation: 'complete' }) }}
                                </span>
                            </v-list-item-subtitle>
                        </v-list-item>
                    </transition-group>
                </v-list>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MapItem from '@/components/MapItem.vue';
import ProfileItem from '@/components/ProfileItem.vue';
import * as starc from '@/starc-api/starc';
import { SGuard, isAxiosError } from '../helpers';

interface LobbyEvent {
    type: 'join' | 'left' | 'title' | 'open' | 'close' | 'completed';
    date: Date;
    profile?: starc.ProfileBase;
    message?: string;
}

@Component({
    components: {
        MapItem,
        ProfileItem,
    },
})
export default class LobbyView extends Vue {
    private refreshTimer: number | null = null;
    private lobby: starc.GameLobbyData | null = null;
    private matchSummary: starc.LobbyMatchSummary | null = null;
    private isMatchSummaryLoading = false;
    private readonly regionsList = starc.regionsList;

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
        if (!this.lobby) return [];

        let events: LobbyEvent[] = [];

        for (const item of this.lobby.joinHistory!) {
            events.push({
                type: 'join',
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

        for (const item of this.lobby.titleHistory!) {
            events.push({
                type: 'title',
                date: new Date(item.date),
                profile: item.profile,
                message: item.title,
            });
        }

        events = events.sort((a, b) => a.date.getTime() - b.date.getTime());
        if (this.lobby.closedAt !== null) {
            events.push({
                type: 'close',
                date: new Date(this.lobby.closedAt),
                message: this.lobby.status.toUpperCase(),
            });
        }
        if (this.matchSummary?.completedAt) {
            events.push({
                type: 'completed',
                date: new Date(this.matchSummary.completedAt),
                message: 'COMPLETED',
            });
        }
        events = events.reverse();
        events.push({
            type: 'open',
            date: new Date(this.lobby.createdAt),
            message: this.lobby.joinHistory!.length === 0 ? this.lobby.hostName : 'OPENED' ,
        });

        return events;
    }

    private getMatchPlayerResult(profile: starc.ProfileBase) {
        if (!this.matchSummary) return;
        return this.matchSummary?.profileMatches.find(x => {
            return x.profile.realmId === profile.realmId && x.profile.profileId === profile.profileId;
        });
    }

    private async refresh() {
        this.refreshTimer = null;
        this.lobby = (await this.$starc.getLobbyDetails(
            Number(this.$route.params.regionId),
            Number(this.$route.params.bnetBucketId),
            Number(this.$route.params.bnetRecordId)
        )).data;
        if (this.lobby.status === starc.GameLobbyStatus.Open) {
            this.refreshTimer = setTimeout(this.refresh.bind(this), 7500);
        }
        else if (this.lobby.status === starc.GameLobbyStatus.Started) {
            this.isMatchSummaryLoading = true;
            try {
                this.matchSummary = (await this.$starc.getLobbyMatchSummary(
                    Number(this.$route.params.regionId),
                    Number(this.$route.params.bnetBucketId),
                    Number(this.$route.params.bnetRecordId)
                )).data;
            }
            catch (err) {
                if (isAxiosError(err) && err.response?.status === 404) {
                    this.matchSummary = null;
                }
                else {
                    throw err;
                }
            }
            finally {
                this.isMatchSummaryLoading = false;
            }
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
@import '~vuetify/src/styles/settings/_index';

.game-lobby-view {
    max-width: 1500px;

    .profile-item {
        display: inline-block;
    }
}

.lobby-status {
    font-size: 1.35em !important;
    font-weight: 500 !important;
    letter-spacing: 1px;
    text-transform: uppercase;

    &.status-open {
        color: map-get($yellow, 'accent-3');
    }
    &.status-started {
        color: map-get($green, 'base');
    }
    &.status-abandoned {
        color: map-get($red, 'darken-1');
    }
}

.join-history {
    .v-list-item {
        padding: 0 6px;
        min-height: 30px;
        border-bottom: 1px dashed rgba(#fff, 0.05);

        >* {
            flex-basis: auto;
        }

        .v-list-item__title {
        }

        >.meta {
            min-width: 50px;
            margin-right: 6px;
            flex-grow: 0;

            .v-icon {
                width: 16px;
            }

            >span {
                float: right;
                font-weight: 300;
                min-width: 25px;
                text-align: right;
            }
        }

        >.profile {
            flex-grow: 0;
            min-width: 90px;
        }

        >.content {
            flex-grow: 1;
            padding: 7px 10px;
            white-space: normal;
        }

        >.date {
            flex-grow: 0;
            flex-basis: auto;
            min-width: 100px;
        }
    }
}
</style>
