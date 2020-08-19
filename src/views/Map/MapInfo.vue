<template>
    <v-card class="py-2 px-2">
        <p>...</p>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';

@Component
export default class MapInfoView extends Vue {
    private mapInfo: starc.Map | null = null;

    private async created() {
        // const loading = this.$loading({ fullscreen: true });
        // this.mapInfo = (await this.$starc.getMapInfo(
        //     Number(this.$route.params.regionId),
        //     Number(this.$route.params.mapId)
        // )).data;
        // loading.close();
    }
}
</script>
