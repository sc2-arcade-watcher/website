<template>
    <v-card class="py-2 px-2 card-t1" v-if="mapDependency">
        <v-list-item v-for="item in mapDependency.list" :key="item.mapHeader.id" class="" dense>
            <v-list-item-title>
                <router-link :to="{
                    name: 'map_base',
                    params: {
                        regionId: item.map.regionId,
                        mapId: item.map.bnetId,
                    },
                }">
                    {{ item.map.name }}
                </router-link>
            </v-list-item-title>
            <v-list-item-subtitle>
                <v-tooltip top v-if="item.requestedVersion !== 0">
                    <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on"><v-icon small left color="green">fas fa-thumbtack</v-icon></span>
                    </template>
                    <span>Locked on specific version</span>
                </v-tooltip>
                <span>v{{ item.mapHeader.majorVersion }}.{{ item.mapHeader.minorVersion }}</span>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
                <v-icon small left color="primary">fas fa-file-upload</v-icon>
                {{ $dfns.lightFormat(new Date(item.mapHeader.uploadedAt), 'yyyy-MM-dd HH:mm') }}
            </v-list-item-subtitle>
            <v-list-item-subtitle class="text-sm-right justify-sm-end">
                <!-- <v-img :src="require('../../assets/ui_battlenet_glues_login_blizzlogo.png')" class="d-inline-block" max-width="56" v-if="item.tags.indexOf('BLIZ') !== -1"/> -->
                <!-- <v-chip small color="primary" outlined dense v-if="item.tags.indexOf('BLIZ') !== -1">BLIZ</v-chip> -->
                <small
                    v-if="item.mapHeader.archiveSize < 256"
                    style="text-transform: uppercase;"
                    color="primary"
                >
                    Built-in
                </small>
                <v-chip small color="green" outlined v-else>{{ $helpers.formatBytes(item.mapHeader.archiveSize) }}</v-chip>
            </v-list-item-subtitle>
            <v-list-item-action-text style="min-width: 50px;">
                <v-btn
                    v-if="item.mapHeader.archiveSize >= 256 && item.mapHeader.archiveHash"
                    :href="$starc.depotLink(item.mapHeader.archiveHash, 's2ma', mapDependency.regionId)"
                    fab
                    small
                    text
                    color="primary"
                    target="_blank"
                >
                    <v-icon small>fas fa-download</v-icon>
                </v-btn>
            </v-list-item-action-text>
        </v-list-item>
        <v-divider/>
        <v-list-item>
            <v-list-item-subtitle class="text-sm-right justify-sm-end d-flex align-center">
                <v-subheader>Total size</v-subheader>
                <v-chip small color="green" outlined>{{ $helpers.formatBytes(totalSize) }}</v-chip>
            </v-list-item-subtitle>
            <v-list-item-action-text style="min-width: 50px;">
            </v-list-item-action-text>
        </v-list-item>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard, isAxiosError } from '../../helpers';
import MapBaseView from './MapBase.vue';

@Component
export default class MapVersionsView extends Vue {
    private mapDependency: starc.MapDependencyInfo | null = null;

    private get totalSize() {
        return this.mapDependency!.list
            .filter(x => x.mapHeader.archiveSize >= 256)
            .map(x => x.mapHeader.archiveSize)
            .reduce((prev, curr) => prev + curr, 0)
        ;
    }

    @SGuard({
        onHttpError: function (this, err) {
            if (err.response!.status === 403) {
                (this.$parent as MapBaseView).isAccessRestricted = true;
                return true;
            }
        },
    })
    private async fetchData() {
        this.mapDependency = (await this.$starc.getMapDependencies(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId)
        )).data;
    }

    private async created() {
        await this.fetchData();
    }
}
</script>
