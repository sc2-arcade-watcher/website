<template>
    <v-card class="map-stats">
        <v-card class="d-flex justify-space-between">
            <v-card-title class="headline">
                <span>Popularity statistics</span>
            </v-card-title>
            <div class="mt-2 mr-2">
                <v-select :items="periodItemKinds" v-model="periodItem" solo dense @change="onPeriodChange"></v-select>
            </div>
        </v-card>
        <highcharts :constructorType="'chart'" :options="chartOptions" ref="chart"></highcharts>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';
import { SGuard } from '../../helpers';

@Component
export default class MapStatsView extends Vue {
    private mapStats: starc.MapStatData | null = null;
    private periodItemKinds = [
        'daily',
        'weekly',
        'monthly',
    ];
    private periodItem = 'weekly';

    private chartOptions: Highcharts.Options = {
        chart: {
            height: 500,
            zoomType: 'x',
        },
        title: void 0,
        // subtitle: {
        // },
        // xAxis: {
        //     type: 'datetime',
        //     categories: ['d1', 'd2', 'd4'],
        // },
        series: [
            // {
            //     id: 'lobbiesHosted',
            //     name: 'Hosted lobbies',
            // },
        ] as any,
        legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        tooltip: {
            // split: true,
            shared: true,
        },
    };

    @SGuard()
    private async refresh() {
        this.mapStats = (await this.$starc.getMapStats(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId),
            {
                kind: this.periodItem as keyof typeof starc.StatsPeriodKind,
            }
        )).data;
        const dKeys = {
            'lobbiesHosted': 'Lobbies Hosted',
            'lobbiesStarted': 'Lobbies Started',
            'participantsTotal': 'Participants Total',
            'participantsUniqueTotal': 'Participants Unique Total',
        };
        this.chartOptions.xAxis = {
            type: 'datetime',
            categories: this.mapStats!.date,
        };
        this.chartOptions.series = [];
        for (const k in dKeys) {
            (this.chartOptions.series as Highcharts.SeriesAreaOptions[]).push({
                type: 'area',
                name: (dKeys as any)[k],
                data: (this.mapStats as any)[k] as number[],
                visible: ['participantsTotal'].find(v => v === k) === void 0,
                fillOpacity: 0.25,
            });
        }
    }

    private created() {
        this.refresh();
    }

    private mounted() {
    }

    private onPeriodChange() {
        this.refresh();
    }
}
</script>
