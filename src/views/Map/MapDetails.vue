<template>
    <v-card class="py-2 px-2 card-t1 map-details" v-if="mapDetails !== null">
        <v-row v-if="mapInfo.arcadeInfo">
            <v-col md="5" sm="12" v-if="mapInfo.arcadeInfo.howToPlaySections && mapInfo.arcadeInfo.howToPlaySections.length">
                <h4 class="section-title">How to play</h4>
                <v-card class="mb-2" v-for="(section, i) in mapInfo.arcadeInfo.howToPlaySections" :key="i" tile raised>
                    <v-card-title class="headline">
                        <span>{{ section.title }}</span>
                    </v-card-title>
                    <v-card-subtitle v-if="section.subtitle">
                        <span>{{ section.subtitle }}</span>
                    </v-card-subtitle>
                    <v-card-text>
                        <ul>
                            <li v-for="(line, l) in section.items" :key="l">
                                <span v-html="$helpers.formatDescription(line)"/>
                            </li>
                        </ul>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col md="7" sm="12" v-if="arcadeScreenshots">
                <h4 class="section-title">Screenshots</h4>
                <!-- <v-img :src="mapThumbnail.url" :max-width="mapThumbnail.width" contain></v-img> -->
                <v-carousel v-if="arcadeScreenshots" cycle interval="8000" style="max-width: 800px" height="600">
                    <v-carousel-item
                        v-for="(item, i) in arcadeScreenshots"
                        :key="i"
                        :src="item.picture.url"
                    >
                        <v-subheader class="font-weight-bold text-center justify-center">{{ arcadeScreenshots[i].caption }}</v-subheader>
                    </v-carousel-item>
                </v-carousel>
            </v-col>
        </v-row>

        <template v-if="patchNotes && patchNotes.length">
            <h4 class="section-title">Patch notes</h4>
            <v-card class="mt-1 mb-3" v-for="(section) in patchNotes" :key="section.subtitle" tile raised outlined color="transparent">
                <v-card-title>
                    <span>{{ section.title }}</span>
                </v-card-title>
                <v-card-subtitle v-if="section.subtitle">
                    <span>{{ section.subtitle }}</span>
                </v-card-subtitle>
                <v-card-text>
                    <ul>
                        <li v-for="(line, l) in section.items" :key="l" style="list-style-type: none;">
                            <span v-if="typeof line === 'string'" v-html="$helpers.formatDescription(line)"/>
                        </li>
                    </ul>
                </v-card-text>
            </v-card>
        </template>

        <template v-if="mapInfo.variants && mapInfo.variants.length">
            <h4 class="section-title">Game Variants</h4>

            <v-list-item
                class="mb-3"
                dense
                v-for="(item, i) in mapInfo.variants"
                :key="i"
            >
                <v-list-item-title>
                    <span class="overline">{{ item.modeName }}</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                    {{ item.modeDescription }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                    {{ item.categoryName }}
                </v-list-item-subtitle>
                <v-list-item-action-text>
                    <v-chip-group>
                        <v-chip small title="Max team size">
                            <v-icon x-small left>fas fa-clone</v-icon>
                            <strong>{{ item.maxTeamSize }}</strong>
                        </v-chip>
                        <v-chip small title="Max human players">
                            <v-icon x-small left>fas fa-users</v-icon>
                            <strong>{{ item.maxHumanPlayers }}</strong>
                        </v-chip>
                        <v-chip small title="Max open slots">
                            <v-icon x-small left>fas fa-sitemap</v-icon>
                            <strong>{{ item.maxOpenSlots }}</strong>
                        </v-chip>
                    </v-chip-group>
                </v-list-item-action-text>
            </v-list-item>
        </template>

        <template v-if="publicAttributes && publicAttributes.length">
            <h4 class="section-title">Game Attributes</h4>
            <v-simple-table dense>
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Tip</th>
                            <th>Values</th>
                            <th>Access</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in publicAttributes" :key="i">
                            <td>
                                {{ item.visual.text }}
                                <br>
                                <small>[{{ item.instance.namespace }}/{{ item.instance.id }}]</small>
                            </td>
                            <td>{{ item.visual.tip }}</td>
                            <td>
                                <ul class="my-2">
                                    <li v-for="subitem in item.values" :key="subitem.value">
                                        {{ subitem.visual.text }}
                                        <!-- <code class="float-right">{{ subitem.value }}</code> -->
                                    </li>
                                </ul>
                            </td>
                            <td>
                                <v-chip small outlined style="text-transform: uppercase;">
                                    {{ attributeRestrictionLabel(item.access) }}
                                </v-chip>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </template>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard, isAxiosError } from '../../helpers';
import MapBaseView from './MapBase.vue';

@Component
export default class MapInfoView extends Vue {
    private mapDetails: starc.MapDetails | null = null;

    private attributeRestrictionLabel(kind: starc.AttributeRestrictionKind) {
        return starc.AttributeRestrictionKind[kind];
    }

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

    private get patchNotes() {
        if (!this.mapInfo || !this.mapInfo.arcadeInfo || !this.mapInfo.arcadeInfo.patchNoteSections) return null;
        return this.mapInfo.arcadeInfo.patchNoteSections.reverse();
    }

    private get publicAttributes() {
        if (!this.mapInfo) return null;
        return this.mapInfo.attributes.filter(x => x.access !== starc.AttributeRestrictionKind.None);
    }

    @SGuard({
        onHttpError: function (this, err) {
            if (err.response!.status === 403) {
                (this.$parent as MapBaseView).isAccessRestricted = true;
                return true;
            }
        },
    })
    private async fetchDetails() {
        this.mapDetails = (await this.$starc.getMapDetails(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId)
        )).data;
    }

    private async created() {
        await this.fetchDetails();
    }
}
</script>

<style lang="scss">
.map-details {
    .v-data-table {
        background: transparent !important;
    }
}
</style>
