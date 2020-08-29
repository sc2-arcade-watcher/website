<template>
    <v-card>
        <v-card class="d-flex justify-space-between">
            <v-card-title class="headline">
                <span>Global activity</span>
            </v-card-title>
            <div class="mt-2 mr-2">
                <v-select
                    solo
                    hide-details
                    prepend-icon="fa-calendar-week"
                    label="Period"
                    style="text-transform: uppercase; letter-spacing: 2px; font-weight: 600;"
                    :items="periodItemKinds"
                    v-model="periodItem"
                    @change="onPeriodChange"
                />
            </div>
        </v-card>

        <div class="chart-wrapper" @mousemove="onChartSyncMove" ref="chartWrapper" v-if="regionStats">
            <highcharts class="mt-5" :constructorType="'chart'" :options="lobbiesChart" :callback="chartInit"></highcharts>
            <highcharts class="mt-5" :constructorType="'chart'" :options="participantsChart" :callback="chartInit"></highcharts>
            <highcharts class="mt-5" :constructorType="'chart'" :options="participantsUniqueChart" :callback="chartInit"></highcharts>
        </div>

        <v-container fluid>
            <v-card color="primary darken-3">
                <blockquote class="py-2 px-2">
                    <strong>Zoom</strong>: Press and hold <kbd>LMB</kbd> to designate area you want to enlarge.<br>
                    <strong>Navigate</strong>: Hold <kbd>SHIFT</kbd> while dragging to pan around.
                </blockquote>
            </v-card>
        </v-container>
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

    private dKeys = {
        'lobbiesHosted': 'Lobbies Hosted',
        'lobbiesStarted': 'Lobbies Started',
        'participantsTotal': 'Participants Total',
        'participantsUniqueTotal': 'Participants Unique Total',
    };

    private baseOpts: Highcharts.Options = {
        chart: {
            zoomType: 'x',
            panKey: 'shift',
            panning: {
                enabled: true,
                type: 'x',
            },
        },
        title: {
            text: '-',
        },
        legend: {
            enabled: true
        },
        tooltip: {
            shared: true,
            split: true,
        },
        xAxis: {
            crosshair: true,
        },
        yAxis: {
            title: {
                text: null
            },
        },
        series: [],
    }

    private get lobbiesChart() {
        const opts: Highcharts.Options = Object.assign({}, this.$helpers.deepCopy(this.baseOpts));

        const name = 'lobbiesStarted';
        opts.title!.text = this.dKeys[name];
        (opts.xAxis as any).categories = this.regionStats!.date;

        for (const k of ['US', 'EU', 'KR']) {
            (opts.series as Highcharts.SeriesColumnOptions[]).push({
                type: 'column',
                name: k,
                data: (this.regionStats as any)[name + k] as number[],
                borderWidth: 0,
            });
        }

        return opts;
    }

    private get participantsChart() {
        const opts: Highcharts.Options = Object.assign({}, this.$helpers.deepCopy(this.baseOpts));

        const name = 'participantsTotal';
        opts.title!.text = this.dKeys[name];
        (opts.xAxis as any).categories = this.regionStats!.date;

        for (const k of ['US', 'EU', 'KR']) {
            (opts.series as Highcharts.SeriesAreaOptions[]).push({
                type: 'area',
                name: k,
                data: (this.regionStats as any)[name + k] as number[],
                fillOpacity: 0.25,
            });
        }

        return opts;
    }

    private get participantsUniqueChart() {
        const opts: Highcharts.Options = Object.assign({}, this.$helpers.deepCopy(this.baseOpts));

        const name = 'participantsUniqueTotal';
        opts.title!.text = this.dKeys[name];
        (opts.xAxis as any).categories = this.regionStats!.date;

        for (const k of ['US', 'EU', 'KR']) {
            (opts.series as Highcharts.SeriesAreaOptions[]).push({
                type: 'area',
                name: k,
                data: (this.regionStats as any)[name + k] as number[],
                fillOpacity: 0.25,
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
