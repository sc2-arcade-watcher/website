<template>
    <div v-if="maps">
        <v-card
            raised
            class="search-toolbar mt-0 mb-2 d-flex flex-wrap flex-md-nowrap align-center justify-space-between"
        >
            <v-text-field
                clearable
                flat
                solo
                hide-details
                label="Name"
                prepend-inner-icon="fa-search"
                dense
                v-model="mapQueryParams.name"
            ></v-text-field>
            <v-select
                dense
                solo
                hide-details
                prepend-inner-icon="fa-archive"
                label="Type"
                clearable
                v-model="mapQueryParams.type"
                :items="mapTypesList"
            ></v-select>
            <v-switch
                hide-details
                append-icon="fa-unlock-alt"
                v-model="mapQueryParams.showPrivate"
                @change="onFormChange"
            >
                <template v-slot:label>
                    <span class="overline">Include private maps</span>
                </template>
            </v-switch>
        </v-card>
        <div v-if="filteredMaps.length">
            <div class="map-list">
                <map-item
                    v-for="(item) in filteredMaps"
                    :key="item.id"
                    :map="item"
                />
            </div>
        </div>
        <div v-else>
            <v-banner>
                <v-avatar
                    slot="icon"
                    color="primary darken-2"
                    size="40"
                >
                    <v-icon>fas fa-search-minus</v-icon>
                </v-avatar>

                <span v-if="errorMsg">{{ errorMsg }}</span>
                <span v-else>There are no results matching given criteria.</span>
            </v-banner>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import MapItem from '@/components/MapItem.vue';
import * as starc from '@/starc-api/starc';
import { SGuard, isAxiosError } from '../../helpers';

@Component({
    components: {
        MapItem,
    },
})
export default class ProfilePublishedMapsView extends Vue {
    private errorMsg: string | null = null;
    private maps: starc.Map[] | null = null;
    private mapQueryParams: starc.MapListQuery = {
        name: void 0,
        type: void 0,
        showPrivate: false,
    };

    private mapTypesList = [
        { value: starc.MapType.MeleeMap, text: 'Melee Map' },
        { value: starc.MapType.ArcadeMap, text: 'Arcade Map' },
        { value: starc.MapType.ExtensionMod, text: 'Extension Mod' },
        { value: starc.MapType.DependencyMod, text: 'Dependency Mod' },
    ];

    private get filteredMaps() {
        if (!this.maps) return null;
        return this.maps.filter(item => {
            if (typeof this.mapQueryParams.name === 'string' && this.mapQueryParams.name.length > 0) {
                const phrase = this.mapQueryParams.name.toLowerCase().trim();
                if (phrase.length && item.name.toLowerCase().indexOf(phrase) === -1) {
                    return false;
                }
            }
            if (typeof this.mapQueryParams.type === 'string') {
                if (this.mapQueryParams.type !== item.type.toString()) {
                    return false;
                }
            }
            // if (item.currentVersion.isPrivate && !this.mapQueryParams.showPrivate) {
            //     return false;
            // }
            return true;
        });
    }

    private async onFormChange() {
        await this.fetchData();
    }

    @SGuard({
        expectedHttpErrorCodes: [403],
    })
    private async fetchData() {
        const profParams = {
            regionId: Number(this.$route.params.regionId),
            realmId: Number(this.$route.params.realmId),
            profileId: Number(this.$route.params.profileId),
        };
        try {
            this.maps = (await this.$starc.getMapList({
                authorHandle: this.$starc.profileHandle(profParams),
                showPrivate: this.mapQueryParams.showPrivate,
                orderBy: 'updated',
                limit: 500,
            })).data.results;
            this.errorMsg = null;
        }
        catch (err) {
            if (!isAxiosError(err)) {
                throw err;
            }

            this.maps = [];
            if (err.response!.status === 403) {
                this.errorMsg = err.response!.data?.message ?? null;
            }
        }
    }

    private async created() {
        await this.fetchData();
    }
}
</script>

<style lang="scss" scoped>
.search-toolbar {
    padding-bottom: 0.5rem;

    >div {
        margin-left: 0.3rem;
        margin-right: 0.3rem;
        margin-top: 0.5rem !important;
        margin-bottom: 0 !important;
    }
}
</style>
