<template>
    <v-card class="py-2 px-2 card-t1 map-details" v-if="mapDetails !== null">
        <div
            v-if="mapInfo.arcadeInfo && mapInfo.arcadeInfo.howToPlaySections && mapInfo.arcadeInfo.howToPlaySections.length"
        >
            <h4 class="section-title mb-0 mt-2">How to play</h4>

            <v-row>
                <v-col lg="4" md="6" sm="12" cols="**1" v-for="(section, i) in mapInfo.arcadeInfo.howToPlaySections" :key="i" class="d-flex align-stretch justify-space-around">
                    <v-card
                        class="mb-2 d-flex flex-wrap align-stretch justify-space-around"
                        style="flex: 1;"
                        tile
                        raised
                        elevation
                    >
                        <v-card-title class="overline" style="font-size: 1.1em !important;">
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
            </v-row>
        </div>

        <div
            v-if="arcadeScreenshots"
        >
            <h4 class="section-title">Screenshots</h4>

            <div class="screenshots-container">
                <v-card
                    class="mx-auto"
                    v-for="(item, i) in arcadeScreenshots"
                    :key="i"
                >
                    <v-dialog
                        v-model="dialog[i]"
                        width="850px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <div
                                v-ripple
                                v-bind="attrs"
                                v-on="on"
                            >
                                <v-img
                                    :src="item.picture.url"
                                    :lazy-src="require('@/assets/UI_Arcade_IconTBattlecruiser.png')"
                                >
                                    <template v-slot:placeholder>
                                        <v-row
                                            class="fill-height ma-0"
                                            align="center"
                                            justify="center"
                                        >
                                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>
                                <!-- class="overline"
                                style="line-height: 1.35em;" -->
                                <v-card-subtitle
                                >
                                    <span>{{ arcadeScreenshots[i].caption }}</span>
                                </v-card-subtitle>
                            </div>
                        </template>
                        <v-card>
                            <v-card-text class="text-center justify-center">
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        style="float: right;"
                                        color="primary darken-1"
                                        text
                                        @click="dialog[i] = false"
                                    >
                                        Close
                                    </v-btn>
                                </v-card-actions>
                                <v-img
                                    :src="item.picture.url"
                                    max-width="800"
                                    max-height="600"
                                    title="asd"
                                    style="margin-left: auto; margin-right: auto;"
                                    class="mb-3"
                                />
                                <span class="overline">{{ arcadeScreenshots[i].caption }}</span>
                            </v-card-text>
                        </v-card>
                    </v-dialog>
                </v-card>
            </div>
        </div>

        <template v-if="patchNotes && patchNotes.length">
            <h4 class="section-title">Patch notes</h4>
            <v-card class="mt-1 mb-3" v-for="(section) in patchNotes" :key="section.title" tile raised outlined color="transparent">
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
                class="mb-3 flex-wrap flex-sm-nowrap"
                dense
                v-for="(item, i) in mapInfo.variants"
                :key="i"
            >
                <v-list-item-title>
                    <span class="overline">{{ item.modeName }}</span>
                </v-list-item-title>
                <v-list-item-subtitle class="text-wrap">
                    {{ item.modeDescription }}
                </v-list-item-subtitle>
                <v-list-item-subtitle class="text-wrap">
                    {{ item.categoryName }}
                </v-list-item-subtitle>
                <v-list-item-action-text>
                    <v-chip-group>
                        <v-chip small title="Lobby delay">
                            <v-icon x-small left>fas fa-clock</v-icon>
                            <strong>{{ getLobbyDelayOfVariant(item) }}</strong>
                        </v-chip>
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
    private dialog = {};
    private lobbyDelayValues = [
        '3',
        '5',
        '7',
        '10',
        '15',
        '20',
        '25',
        '30',
    ];

    private attributeRestrictionLabel(kind: starc.AttributeRestrictionKind) {
        return starc.AttributeRestrictionKind[kind];
    }

    private getDefaultAttrValueOfVariant(variant: starc.Variant<string | null>, attrId: number) {
        return variant.attributeDefaults.find(x => {
            return x.attribute.namespace === 999 && x.attribute.id === attrId;
        });
    }

    private getLobbyDelayOfVariant(variant: starc.Variant<string | null>) {
        const dvalue = this.getDefaultAttrValueOfVariant(variant, 3006);
        if (!dvalue) {
            return 10;
        }
        return Number(this.lobbyDelayValues[(dvalue!.value as starc.AttributeValue).index]);
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

<style lang="scss" scoped>
.map-details {
    .v-data-table {
        background: transparent !important;
    }
}

.screenshots-container {
    // display: flex;
    // flex-wrap: wrap;
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax(350px, 1fr) );
    gap: 8px;

    >.v-sheet.v-card {
        // flex: 350px;
        // max-width: 350px;
        // margin: 0.5rem !important;
        min-width: 350px;
        // max-width: 600px;
    }
}
</style>
