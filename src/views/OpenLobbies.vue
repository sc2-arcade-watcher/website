<template>
    <div>
        <v-card
            raised
            class="search-toolbar px-2 py-0 mt-0 mb-2"
        >
            <v-form
                class="d-flex flex-wrap flex-lg-nowrap align-center justify-space-between"
                @submit.prevent="onSubmit"
            >
                <div class="f-phrase flex-grow-1 d-flex align-center">
                    <v-tooltip bottom transition="fade-transition">
                        <template v-slot:activator="{ on, attrs }">
                            <span v-bind="attrs" v-on="on">
                                <v-btn color="primary" text x-small min-width="20"><v-icon x-small>fas fa-info</v-icon></v-btn>
                            </span>
                        </template>
                        <div>
                            You can search for:<br>
                            - Map name <br>
                            - Extension mod name <br>
                            - Name of the person who's current host of the lobby<br>
                            Additionally it's possible to search for multiple things at once, by separating the keywords with <code>;</code> (semicolon).
                            <br>
                            Examples: <br>
                            - <code>Direct Strike ; Ice Baneling Escape</code> - will filter results to open lobbies of those two custom maps.
                        </div>
                    </v-tooltip>
                    <v-text-field
                        clearable
                        flat
                        solo
                        hide-details
                        label="Search"
                        prepend-inner-icon="fa-search"
                        dense
                        v-model="localParams.searchPhrase"
                        @input="onInput"
                    ></v-text-field>
                </div>

                <div class="f-region d-flex flex-wrap flex-md-nowrap align-center justify-space-around flex-grow-1" style="max-width: 1000px;">
                    <v-switch
                        color="primary"
                        dense
                        inset
                        v-for="item in regionsList"
                        :key="item.id"
                        :value="item.id"
                        v-model="localParams.regions"
                        @change="onSubmit"
                    >
                        <template v-slot:label>
                            <img class="d-inline-block mr-1" :src="require(`../assets/region-${item.id}.png`)" style="max-width: 20px;" />
                            <span class="overline" :title="item.name">
                                {{ item.code }}
                                <span
                                    class="primary--text"
                                    v-if="activeLobbies"
                                    v-html="`(${activeLobbies.filter(x => x.regionId === item.id).length})`"
                                />
                            </span>
                        </template>
                    </v-switch>
                </div>
            </v-form>
        </v-card>

        <div class="refresh-progress-container" style="min-height: 4px;">
            <v-progress-linear
                v-model="refreshProgress"
                :class="refreshing ? 'indeterminate' : 'linear'"
                :active="refreshing"
                :indeterminate="refreshing"
                :query="!refreshing"
                :key="refreshing"
            ></v-progress-linear>
        </div>

        <div class="open-lobbies-container">
            <table v-if="currentLobbies && currentLobbies.length">
                <thead>
                    <tr>
                        <th class="overline c-region"><v-icon x-small title="Region">mdi-earth</v-icon></th>
                        <th class="overline c-map">Map</th>
                        <th class="overline c-variant">Mode</th>
                        <th class="overline c-title">Title</th>
                        <th class="overline c-slots"><v-icon small title="Human player slots">fas fa-users</v-icon></th>
                        <th class="overline c-host">Host</th>
                        <th class="overline c-created"><v-icon small title="Created at (X ago)">fas fa-clock</v-icon></th>
                        <th class="overline c-action"></th>
                    </tr>
                </thead>
                <transition-group tag="tbody" name="fade">
                    <tr v-for="item in currentLobbies" v-bind:key="`${item.bnetBucketId}/${item.bnetRecordId}`">
                        <td class="c-region">
                            <img class="d-inline-block" :src="require(`../assets/region-${item.regionId}.png`)" style="max-width: 18px; vertical-align: middle;" />
                        </td>
                        <td class="c-map">
                            <div>
                                <v-btn
                                    tile
                                    large
                                    text
                                    class="b-map"
                                    color="primary accent-1"
                                    style="text-transform: none !important;"
                                    :title="item.map ? item.map.name : ''"
                                    :to="{ name: 'map_details', params: { regionId: item.regionId, mapId: item.mapBnetId } }"
                                >
                                    <v-img
                                        v-if="item.map"
                                        :src="$starc.depotImage(item.map.iconHash, item.map.regionId).url"
                                        max-width="70"
                                        height="35"
                                        contain
                                        class="float-left my-0"
                                    />
                                    <span class="name" v-if="item.map">{{ item.map.name }}</span>
                                    <span class="name text--secondary" v-else>Unknown {{ item.mapBnetId }}</span>
                                </v-btn>

                                <v-btn
                                    v-if="item.extModBnetId"
                                    tile
                                    small
                                    text
                                    class="b-ext-mod"
                                    color="deep-orange lighten-2"
                                    style="text-transform: none !important; padding-left: 6px; padding-right: 6px;"
                                    :title="item.extMod ? item.extMod.name : ''"
                                    :to="{ name: 'map_details', params: { regionId: item.regionId, mapId: item.extModBnetId } }"
                                >
                                    <v-icon x-small color="grey lighten-1" class="mr-1">fas fa-plus</v-icon>
                                    <span class="name" v-if="item.extMod">{{ item.extMod.name }}</span>
                                    <span class="name text--secondary" v-else>Unknown {{ item.extModBnetId }}</span>
                                </v-btn>
                            </div>
                        </td>
                        <td class="c-variant">
                            <span>{{ item.mapVariantMode }}</span>
                        </td>
                        <td class="c-title">
                            <transition name="slide-fade" mode="out-in">
                                <span v-bind:key="item.lobbyTitle" :title="item.lobbyTitle">{{ item.lobbyTitle }}</span>
                            </transition>
                        </td>
                        <td class="c-slots">
                            <transition name="slide-fade" mode="out-in">
                                <!-- <span class="d-block" v-bind:key="item.slotsHumansTaken">{{ item.slotsHumansTaken }}/{{ item.slotsHumansTotal }}</span> -->
                                <span
                                    v-if="item.slots.length"
                                    v-bind:key="item.slots.filter(x => x.kind === 'human').length"
                                >
                                    {{ item.slots.filter(x => x.kind === 'human').length }}/{{ item.slots.filter(x => x.kind !== 'ai').length }}
                                </span>
                                <span
                                    v-else
                                    v-bind:key="item.slotsHumansTaken"
                                >
                                    {{ item.slotsHumansTaken }}/{{ item.slotsHumansTotal }}
                                </span>
                            </transition>
                        </td>
                        <td class="c-host">
                            <profile-item v-if="item.hostProfile" :profile="item.hostProfile" class="small"/>
                            <span v-else-if="item.slots.length && false">{{ item.hostName }}</span>
                        </td>
                        <td class="c-created">
                            <span>{{ $helpers.formatDateDistanceToNow(item.createdAt, { precisionLevel: 1 }) }}</span>
                        </td>
                        <td class="c-action">
                            <v-btn
                                color="primary"
                                text
                                x-small
                                :to="{ name: 'lobby', params: { regionId: item.regionId, bnetBucketId: item.bnetBucketId, bnetRecordId: item.bnetRecordId } }"
                                tile
                                title="Show details"
                            >
                                <v-icon small>mdi-page-next-outline</v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </transition-group>
            </table>

            <div v-else-if="activeLobbies">
                <v-banner>
                    <v-avatar
                        slot="icon"
                        color="grey darken-2"
                        size="36"
                    >
                        <v-icon small>fas fa-search-minus</v-icon>
                    </v-avatar>

                    <span class="text-button">There are currently no open lobbies which match given critera.</span>
                </v-banner>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Debounce } from 'vue-debounce-decorator';
import * as starc from '@/starc-api/starc';
import ProfileItem from '@/components/ProfileItem.vue';
import { SGuard, deepCopy } from '@/helpers';

interface LobbyFilters {
    searchPhrase: string;
    regions: starc.GameRegion[];
}

function lobbySearchTest(lobby: starc.GameLobbyData, search: string) {
    if (
        (!lobby.map || lobby.map.name.toLowerCase().indexOf(search) === -1) &&
        (!lobby.extMod || lobby.extMod.name.toLowerCase().indexOf(search) === -1) &&
        // (lobby.lobbyTitle.toLowerCase().indexOf(search) === -1) &&
        // lobby.hostName.toLowerCase().indexOf(search) === -1
        lobby.hostName.toLowerCase() !== search
    ) {
        return false;
    }
    return true;
}

@Component({
    components: {
        ProfileItem,
    },
})
export default class OpenLobbiesView extends Vue {
    private queryParams: LobbyFilters = {
        regions: [starc.GameRegion.US, starc.GameRegion.EU, starc.GameRegion.KR],
        searchPhrase: '',
    };
    private localParams: LobbyFilters | null = null;
    private refreshTimer: number | null = null;
    private refreshProgress: number = 100;
    private refreshing: boolean = true;
    private readonly refreshInterval = 8000;

    private activeLobbies: starc.GameLobbyData[] | null = null;

    private get regionsList() {
        return starc.regionsList;
    }

    private get currentLobbies() {
        return this.activeLobbies?.filter(item => {
            if (this.queryParams.regions.findIndex(y => y === item.regionId) === -1) {
                return false;
            }

            if (this.queryParams.searchPhrase) {
                const searchList = this.queryParams.searchPhrase.split(';').map(x => x.trim().toLowerCase()).filter(x => x.length);
                if (searchList.length) {
                    let matches = false;
                    for (const currSearch of searchList) {
                        if (lobbySearchTest(item, currSearch)) {
                            matches = true;
                            break;
                        }
                    }
                    if (!matches) {
                        return false;
                    }
                }
            }

            if (item.slots?.length && !item.hostProfile) {
                item.hostProfile = item.slots.find(x => x.name === item.hostName)?.profile;
            }

            return true;
        }) ?? [];
    }

    private applyParamsFromRouteQuery() {
        if (this.$route.query?.searchPhrase) {
            this.queryParams.searchPhrase = String(this.$route.query.searchPhrase);
        }
        else {
            this.queryParams.searchPhrase = '';
        }

        if (this.$route.query?.regions) {
            this.queryParams.regions = String(this.$route.query.regions).split(',').map(Number).sort();
        }
        else {
            // this.queryParams.regions = Object.values(starc.GameRegion).filter(x => typeof x === 'number') as starc.GameRegion[];
            this.queryParams.regions = [starc.GameRegion.US, starc.GameRegion.EU, starc.GameRegion.KR];
        }

        // apply
        if (!this.localParams) {
            this.localParams = deepCopy(this.queryParams);
        }
        this.localParams.searchPhrase = this.queryParams.searchPhrase;
        this.localParams.regions = this.queryParams.regions;
    }

    private renavigate() {
        return this.$router.replace({
            name: this.$route.name!,
            query: this.$helpers.stringifyQueryParams(this.localParams),
        })
    }

    private onSubmit() {
        this.renavigate();
    }

    @Debounce({ time: 500 })
    private onInput() {
        if (this.localParams?.searchPhrase === this.queryParams.searchPhrase) return;
        this.onSubmit();
    }

    private async refreshList() {
        this.refreshTimer = null;
        this.refreshProgress = 0;
        this.refreshing = true;
        try {
            this.activeLobbies = (await this.$starc.getLobbiesActive({
                includeMapInfo: true,
                includeSlots: true,
                includeSlotsJoinInfo: false,
                includeJoinHistory: false,
                recentlyClosedThreshold: 0,
            })).data;
            this.refreshing = false;
            this.refreshProgress = 100;
        }
        catch (err) {
            console.error(err);
            this.activeLobbies = null;
        }
        // if (this.refreshProgress >= 100) {
        // }
        // else {
        //     this.refreshProgress += 5000 / this.refreshInterval * 100;
        // }
        this.refreshTimer = setTimeout(this.refreshList.bind(this), this.refreshInterval);
    }

    @SGuard()
    private async fetchData() {
        this.applyParamsFromRouteQuery();
        await this.refreshList();
    }

    private created() {
        this.fetchData();
    }

    private beforeDestroy() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    @Watch('$route')
    private watchRoute() {
        this.applyParamsFromRouteQuery();
    }

    @Watch('currentLobbies')
    private watchLobbies() {
        const openRegions = this.regionsList.map(x => `${x.code}: ${this.activeLobbies?.filter(y => y.regionId === x.id).length ?? '?'}`);
        document.title = `${this.currentLobbies.length} open lobbies | ${openRegions.join(' ')}`;
    }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/_variables';

.refresh-progress-container {
    // .v-progress-linear {
    //     transition-duration: 5s;
    //     transition-property: width,left;
    //     transition-timing-function: linear;
    // }
    // .v-progress-linear.indeterminate {
    //     transition-duration: 0.3s;
    // }

    .v-progress-linear__background {
    }
    .v-progress-linear:not(.indeterminate) {
        .v-progress-linear__background {
        }
    }
}

.slide-fade-enter-active {
    transition: all .25s ease;
}
.slide-fade-leave-active {
    transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter {
    transform: translateY(-20px);
}
.slide-fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}

.search-toolbar {
    .f-region {

    }
}

.open-lobbies-container {
    width: 100%;
    overflow-x: auto;

    table {
        border-spacing: 0;
        border-collapse: separate;
    }

    tbody tr:nth-child(odd) {
        background-color: rgba(#fff, 0.02);
    }

    tbody tr:nth-child(even) {
        background-color: rgba(#fff, 0.06);
    }

    th {
    }

    td {
        vertical-align: middle;
    }

    td span {
        display: inline-block;
    }

    td.c-title {
        color: map-get($grey, 'lighten-1');
        font-size: 0.85rem;
    }

    td.c-variant {
        font-family: 'Roboto', sans-serif !important;
        text-transform: uppercase;
        font-weight: 500;
        font-size: 0.85rem;
        // color: map-get($brown, 'lighten-3');
    }

    td.c-slots,
    td.c-created {
        font-family: monospace;
    }

    td.c-slots {
        color: map-get($green, 'lighten-2');
    }

    td.c-created {
        color: map-get($orange, 'lighten-3');
    }

    td.c-map {
        >div {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
        }

        .v-btn {
            padding-left: 0;
            padding-right: 5px;

        }

        .v-btn span.name {
            // max-width: 300px;
            display: inline-block;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
}

@media #{map-get($display-breakpoints, 'md-and-up')} {
    .open-lobbies-container {
        table {
            width: 100%;
        }

        th, td {
            padding: 0;
            padding-left: 6px;
            margin: 0;
        }

        td {
            font-size: 0.9rem;
        }

        .c-region {
            width: 26px;
        }

        .c-map {
            padding-left: 0 !important;
        }

        td.c-map .v-btn span.name{
            max-width: 250px;
        }

        td.c-map .v-btn.b-ext-mod span.name{
            max-width: 200px;
        }

        td.c-host {
            padding-left: 10px;
        }

        td.c-title span,
        td.c-variant span {
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        td.c-title span,
        td.c-variant span {
            max-width: 180px;
        }

        .c-slots,
        .c-created,
        .c-action {
            text-align: right !important;
        }
    }
}

@media #{map-get($display-breakpoints, 'lg-and-up')} {
    .open-lobbies-container {
        td.c-map .v-btn span.name {
            max-width: 350px;
        }

        td.c-variant span,
        td.c-title span {
            max-width: 300px;
        }
    }
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
    .open-lobbies-container {
        table {
            display: block !important;
        }

        thead {
            display: none;
        }

        tbody {
            display: block;
        }

        tr {
            width: 100%;
            max-width: 100%;
            display: flex;
            flex-wrap: wrap;
            padding: 0.5rem;
            margin-top: 0.5rem;
        }

        td {
            display: flex;
            // align-items: stretch;
            // justify-content: stretch;
            width: 100%;
            flex-basis: 100%;
            margin-top: 0.2rem;
        }

        td:not(:last-child) {
            border-bottom: 1px dotted rgba(#fff, 0.08);
        }

        td::before {
            display: block;
            flex-grow: 1;

            // padding-top: 0.75rem !important;
            font-size: 0.75rem !important;
            font-weight: 500;
            letter-spacing: 0.1666666667em !important;
            line-height: 1.8rem;
            text-transform: uppercase;
            font-family: "Roboto", sans-serif !important;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #fff;

            content: '';
        }

        td.c-map::before {
            display: none;
        }

        td.c-map {
            >div {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
                flex-basis: 100%;
            }
        }

        td.c-variant::before {
            content: 'Variant:';
        }

        td.c-title::before {
            content: 'Title:';
        }

        td.c-slots::before {
            content: 'Slots:';
        }

        td.c-host::before {
            content: 'Host:';
        }

        td.c-created::before {
            content: 'Age:';
        }

        td.c-variant {
            // >span {
            //     align-self: flex-end;
            // }
        }
    }
}
</style>
