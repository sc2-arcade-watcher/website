<template>
    <v-card class="py-2 px-2 card-t1" v-if="mapDetails !== null">
        <v-row>
            <v-col md="5" sm="12">
                <v-card outlined>
                    <v-list-item>
                        <v-list-item-title>Description</v-list-item-title>
                        <v-list-item-subtitle>{{ mapInfo.workingSet.description }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>Max players</v-list-item-title>
                        <v-list-item-subtitle>{{ mapInfo.workingSet.maxPlayers }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item v-if="mapInfo.arcadeInfo && mapInfo.arcadeInfo.website">
                        <v-list-item-title>Website</v-list-item-title>
                        <v-list-item-subtitle>
                            <a :href="mapInfo.arcadeInfo.website" target="_blank">{{ mapInfo.arcadeInfo.website }}</a>
                        </v-list-item-subtitle>
                    </v-list-item>
                </v-card>
            </v-col>
            <v-col md="7" sm="12">
                <!-- <v-img :src="mapThumbnail.url" :max-width="mapThumbnail.width" contain></v-img> -->
                <v-carousel v-if="arcadeScreenshots" cycle interval="8000" style="max-width: 800px" height="600">
                    <v-carousel-item
                        v-for="(item,i) in arcadeScreenshots"
                        :key="i"
                        :src="item.picture.url"
                    >
                        <v-subheader class="font-weight-bold text-center justify-center">{{ arcadeScreenshots[i].caption }}</v-subheader>
                    </v-carousel-item>
                </v-carousel>
            </v-col>
        </v-row>

        <v-divider></v-divider>
        <v-subheader>Variants</v-subheader>
        <v-card raised outlined>
            <v-simple-table dense>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Genre</th>
                            <th>Max team size</th>
                            <th>Max human players</th>
                            <th>Max open slots</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in mapInfo.variants" :key="i">
                            <td>{{ item.modeName }}</td>
                            <td>{{ item.modeDescription }}</td>
                            <td>{{ item.categoryName }}</td>
                            <td>{{ item.maxTeamSize }}</td>
                            <td>{{ item.maxHumanPlayers }}</td>
                            <td>{{ item.maxOpenSlots }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-card>

        <v-divider></v-divider>
        <v-subheader>Attributes</v-subheader>
        <v-card raised outlined>
            <v-simple-table dense>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Tip</th>
                            <th>Values</th>
                            <th>Access</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in mapInfo.attributes" :key="i">
                            <td>{{ item.instance.namespace }}/{{ item.instance.id }}</td>
                            <td>{{ item.visual.text }}</td>
                            <td>{{ item.visual.tip }}</td>
                            <td>
                                <ul class="my-2">
                                    <li v-for="(subitem, i) in item.values" :key="i">
                                        {{ subitem.visual.text }}
                                        <code class="float-right">{{ subitem.value }}</code>
                                    </li>
                                </ul>
                            </td>
                            <td>{{ item.access }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-card>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';

@Component
export default class MapInfoView extends Vue {
    private mapDetails: starc.MapDetails | null = null;

    private get mapInfo() {
        if (!this.mapDetails) return null;
        return this.mapDetails.info;
    }

    private get mapThumbnail() {
        if (!this.mapInfo) return null;
        const img = this.mapInfo.workingSet.thumbnail ?? this.mapInfo.workingSet.bigMap;
        if (!img) return null;
        return this.$starc.depotImage(img, this.mapInfo.meta.region);
    }

    private get arcadeScreenshots() {
        if (!this.mapInfo || !this.mapInfo.arcadeInfo) return null;
        const screenshots = [
            ...this.mapInfo.arcadeInfo.gameInfoScreenshots,
            ...this.mapInfo.arcadeInfo.howToPlayScreenshots,
        ].map(x => {
            return {
                caption: x.caption,
                picture: this.$starc.depotImage(x.picture, this.mapInfo!.meta.region)
            } as starc.MapScreenshot<string | null, starc.MapImageResolved>;
        })
        if (!screenshots.length) return null;
        return screenshots;
    }

    private async created() {
        this.mapDetails = (await this.$starc.getMapDetails(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId)
        )).data;
    }
}
</script>
