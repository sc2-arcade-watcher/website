<template>
    <v-card
        class="map-item"
        tile
        :to="{ name: 'map_details', params: { regionId: map.regionId, mapId: map.bnetId } }"
    >
        <v-img
            :src="$starc.depotImage(map.iconHash, map.regionId).url"
            :lazy-src="require('@/assets/UI_Arcade_IconTBattlecruiser.png')"
            :key="`${map.regionId,map.bnetId}`"
            aspect-ratio="1.5"
            height="150"
            class="map-icon"
            cover
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
        <div class="map-info">
            <h4 class="title">
                {{ map.name }}
            </h4>
        </div>
        <div class="map-footer">
            <span class="region-code">
                {{ regionCode }}
            </span>

            <span class="version" v-if="map.currentVersion">
                v{{ map.currentVersion.majorVersion }}.{{ map.currentVersion.minorVersion }}
            </span>

            <span class="date" :title="`Last update at ${$dfns.lightFormat(new Date(map.updatedAt), 'yyyy-MM-dd HH:mm')}`">
                {{ $dfns.formatDistanceStrict(
                    new Date(map.updatedAt),
                    new Date(),
                    {
                        addSuffix: true,
                        roundingMethod: 'floor'
                    }) }}
            </span>

            <span
                v-if="map.currentVersion && map.currentVersion.isPrivate"
                class="private"
                title="Private map"
            >
                <v-icon right x-small color="grey accent-4">fas fa-user-secret</v-icon>
            </span>
        </div>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';

@Component
export default class MapItem extends Vue {
    @Prop({
        required: true,
    })
    readonly map!: starc.Map;

    private get regionCode() {
        return starc.GameRegion[this.map.regionId];
    }

    created() {
    }
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/settings/_index';

.map-item {
    display: flex;
    flex-direction: column;
    max-width: 300px;

    .map-icon {
        // max-height: 150px;
        flex-grow: 0;
    }

    .map-info {
        display: flex;
        align-items: center;
        margin: 0.5rem;
        margin-bottom: 0;
        font-size: 1.0rem;
        flex-grow: 1;
        // height: 2.6em;

        .title {
            font-weight: 400;
            font-size: 1.0rem !important;
            line-height: 1.3em;
            // letter-spacing: -0.02em !important;
            // height: 2.6em;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .version {
            display: none;
        }
    }

    .map-footer {
        margin: 0 0.4rem;
        margin-top: 0.1rem;

        >span {
            font-size: 0.8rem !important;
            font-weight: 300;
        }

        .version,
        .date,
        .private {
            color: map-get($grey, 'base');
            letter-spacing: -1px !important;
        }

        .version +.date {
            &::before {
                content: '|';
                padding-left: 5px;
                padding-right: 5px;
            }
        }

        .region-code {
            float: right;
            font-weight: 500;
            color: map-get($grey, 'accent-1');
        }
    }
}
</style>
