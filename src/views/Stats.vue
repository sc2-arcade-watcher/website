<template>
    <v-card>
        <v-card class="d-flex justify-space-between">
            <v-card-title class="headline">
                <span>Global activity</span>
            </v-card-title>
            <div class="mt-2 mr-2">
                <v-select :items="periodItemKinds" v-model="periodItem" solo dense @change="onPeriodChange"></v-select>
            </div>
        </v-card>
        <div class="chart-wrapper" @mousemove="onChartSyncMove" ref="chartWrapper" v-if="regionStats">
            <highcharts :constructorType="'chart'" :options="getChartOptions('lobbiesStarted')" :callback="chartInit"></highcharts>
            <highcharts :constructorType="'chart'" :options="getChartOptions('participantsTotal')" :callback="chartInit"></highcharts>
            <highcharts :constructorType="'chart'" :options="getChartOptions('participantsUniqueTotal')" :callback="chartInit"></highcharts>
        </div>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import * as starc from '@/starc-api/starc';

@Component
export default class StatsView extends Vue {
    private regionStats: starc.StatsRegionsData | null = null;
    private charts: Highcharts.Chart[] = [];
    private periodItemKinds = [
        'daily',
        'weekly',
        'monthly',
    ];
    private periodItem = 'weekly';

    private getChartOptions(name: 'lobbiesStarted' | 'participantsUniqueTotal') {
        const dKeys = {
            'lobbiesHosted': 'Lobbies Hosted',
            'lobbiesStarted': 'Lobbies Started',
            'participantsTotal': 'Participants Total',
            'participantsUniqueTotal': 'Participants Unique Total',
        };
        const opts: Highcharts.Options = {
            chart: {
                marginLeft: 60,
                spacingTop: 15,
                spacingBottom: 15,
                height: 310,
            },
            title: {
                text: dKeys[name],
                align: 'left',
                margin: 0,
                x: 40,
                y: 8,
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            tooltip: {
                positioner: function () {
                    return {
                        // right aligned
                        x: this.chart.chartWidth - (this as any).label.width,
                        y: 10 // align to title
                    };
                },
                borderWidth: 0,
                backgroundColor: 'none',
                // pointFormat: '{point.y}',
                // shared: true,
                headerFormat: '',
                shadow: false,
                style: {
                    fontSize: '18px'
                },
            },
            xAxis: {
                crosshair: true,
                categories: this.regionStats!.date,
            },
            yAxis: {
                title: {
                    text: null
                },
            },
            series: [
            ],
        };
        for (const k of ['US', 'EU', 'KR']) {
            (opts.series as Highcharts.SeriesAreaOptions[]).push({
                type: 'area',
                name: k,
                data: (this.regionStats as any)[name + k] as number[],
                fillOpacity: 0.2,
            });
        }
        return opts;
    }

    private async refresh() {
        this.regionStats = (await this.$starc.getStatsRegions({
            kind: this.periodItem as keyof typeof starc.StatsPeriodKind,
        })).data;
    }

    private created() {
        this.refresh();
    }

    private chartInit(chart: Highcharts.Chart) {
        this.charts.push(chart);
        // chart.pointer.reset = () => void 0;
    }

    private onChartSyncMove(e: (MouseEvent|PointerEvent|TouchEvent)) {
        for (const chart of this.charts) {
            const pointer = chart.pointer.normalize(e);
            // const point = (chart.series[0] as any).searchPoint(pointer, true);
            const point = chart.pointer.findNearestKDPoint(chart.series, true, pointer);
            if (point) {
                // chart.tooltip.refresh(point); // Show the tooltip
                chart.xAxis[0].drawCrosshair(pointer, point); // Show the crosshair
            }
        }
    }

    private onPeriodChange() {
        this.refresh();
    }
}

</script>
