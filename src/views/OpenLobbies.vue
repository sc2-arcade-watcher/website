<template>
    <div>
        <v-tabs v-model="activeRegion" ref="region" @change="onRegionChanged"
            right
        >
            <v-tab v-for="(item, i) in regionList" :key="i">{{ item.title }} ({{ item.count }})</v-tab>
        </v-tabs>
        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="searchPhrase"
                    append-icon
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
            </v-card-title>
            <v-data-table
                :loading="currentLobbies.length <= 0"
                :headers="basic.headers"
                :items="currentLobbies"
                :search="searchPhrase"
                :items-per-page="200"
                :custom-filter="filterItems"
                hide-default-footer
            >
                <template v-slot:item.image="{ item }">
                    <router-link :to="{ name: 'map_base', params: { regionId: item.regionId, mapId: item.mapBnetId } }" class="" v-if="item.map">
                        <v-img
                            :src="$starc.bnetDepotImage(item.map.iconHash)"
                            max-width="80"
                            height="50"
                            contain
                            class="float-left my-1"
                        />
                    </router-link>
                </template>
                <template v-slot:item.map="{ item }">
                    <v-img class="d-inline-block float-right" :src="require(`../assets/region-${item.regionId}.png`)" max-width="20" />
                    <router-link v-if="item.map" :to="{ name: 'map_base', params: { regionId: item.regionId, mapId: item.mapBnetId } }">
                        {{ item.map.name }}
                    </router-link>
                    <router-link v-if="item.extMod" :to="{ name: 'map_base', params: { regionId: item.regionId, mapId: item.extModBnetId } }">
                        <br>
                        {{ item.extMod.name }}
                    </router-link>
                </template>
                <template v-slot:item.lobby="{ item }">
                    <router-link :to="{ name: 'lobby', params: { regionId: item.regionId, bnetBucketId: item.bnetBucketId, bnetRecordId: item.bnetRecordId } }">
                        {{ item.bnetRecordId }}
                    </router-link>
                </template>
                <template v-slot:item.slotsStatus="{ item }">
                    <span v-if="item.slots.length">
                        {{ item.slots.filter(x => x.kind === 'human').length }}/{{ item.slots.filter(x => x.kind !== 'ai').length }}
                    </span>
                    <span v-else>{{ item.slotsHumansTaken }}/{{ item.slotsHumansTotal }}</span>
                </template>
                <template v-slot:item.createdAt="{ item }">
                    <span>
                        {{ $dfns.formatDistanceStrict(new Date(item.createdAt), new Date(), {
                            includeSeconds: true,
                            addSuffix: true,
                            roundingMethod: 'floor'}) }}
                    </span>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../helpers';

@Component
export default class OpenLobbiesView extends Vue {
    private refreshTimer: number | null = null;
    private searchPhrase = '';
    private activeLobbies: starc.GameLobbyData[] | null = null;
    private activeRegion: number = 0;
    private regionList = [
        {
            regionId: null,
            title: 'Global',
            count: 0,
        },
        {
            regionId: 1,
            title: 'America',
            count: 0,
        },
        {
            regionId: 2,
            title: 'Europe',
            count: 0,
        },
        {
            regionId: 3,
            title: 'Asia',
            count: 0,
        },
        {
            regionId: 5,
            title: 'China',
            count: 0,
        },
    ];

    private basic = {
        headers: [
            {
                text: '',
                sortable: false,
                value: 'image',
            },
            {
                text: 'Map',
                value: 'map',
                filterable: true,
            },
            {
                text: 'Mode',
                value: 'mapVariantMode',
            },
            {
                text: 'Title',
                value: 'lobby',
            },
            {
                text: 'Host',
                value: 'hostName',
            },
            {
                text: 'Slots',
                value: 'slotsStatus',
            },
            {
                text: 'Created',
                value: 'createdAt',
            },
        ],
    };

    private get currentLobbies() {
        const regionId = this.regionList[this.activeRegion].regionId;
        return this.activeLobbies?.filter(x => x.regionId === regionId || regionId === null) ?? [];
    }

    private async refreshList() {
        this.refreshTimer = null;
        this.activeLobbies = (await this.$starc.getLobbiesActive({
            includeMapInfo: true,
            includeSlots: true,
            includeSlotsJoinInfo: false,
            includeJoinHistory: false,
            recentlyClosedThreshold: 0,
        })).data;
        this.regionList.forEach(x => x.count = 0);
        this.activeLobbies.forEach(x => ++this.regionList.find(y => x.regionId === y.regionId)!.count);
        this.regionList[0].count = this.activeLobbies.length;
        this.refreshTimer = setTimeout(this.refreshList.bind(this), 10000);
    }

    private filterItems(value: any, search: string | null, item: starc.GameLobbyData): boolean {
        if (typeof search !== 'string') return false;
        search = search.toLowerCase();
        if (
            (item.map && item.map.name.toLowerCase().indexOf(search) >= 0) ||
            item.lobbyTitle.toLowerCase().indexOf(search) >= 0 ||
            item.hostName.toLowerCase().indexOf(search) >= 0
        ) {
            return true;
        }
        return false;
    }

    @SGuard()
    private async fetchData() {
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

    private mounted() {
    }

    private onRegionChanged(idx: number) {
    }
}
</script>
