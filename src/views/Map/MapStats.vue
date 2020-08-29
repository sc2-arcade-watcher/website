<template>
    <v-card class="map-stats">
        <v-card class="d-flex justify-space-between">
            <v-card-title class="headline">
                <span>Statistics</span>
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

        <div class="chart-wrapper" v-if="mapStats">
            <highcharts class="mt-5" :constructorType="'chart'" :options="chartLobbies"></highcharts>
            <highcharts class="mt-5" :constructorType="'chart'" :options="chartParticipants"></highcharts>
            <highcharts class="mt-5" :constructorType="'chart'" :options="chartPendingTime"></highcharts>
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

    private dKeys = {
        'lobbiesHosted': 'Lobbies Hosted',
        'lobbiesStarted': 'Lobbies Started',
        'lobbiesAbandoned': 'Lobbies Abandoned',
        'participantsTotal': 'Participants Total',
        'participantsUniqueTotal': 'Participants Unique Total',
        'pendingTimeAverage': 'Pending time average',
    };

    private chartBasicOptions: Highcharts.Options = {
        chart: {
            zoomType: 'x',
            panKey: 'shift',
            panning: {
                enabled: true,
                type: 'x',
            },
        },
        title: {
        },
        series: [] as any,
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
            shared: true,
        },
    };

    private get chartLobbies() {
        if (this.mapStats === null) return null;

        const chartOpts = this.$helpers.deepCopy(this.chartBasicOptions);
        chartOpts.title = {
            text: 'Lobbies',
        };

        chartOpts.xAxis = {
            type: 'datetime',
            categories: this.mapStats!.date,
        };
        (chartOpts.series as Highcharts.SeriesColumnOptions[]).push({
            type: 'column',
            name: (this.dKeys as any)['lobbiesStarted'],
            data: (this.mapStats as any)['lobbiesStarted'] as number[],
            stacking: 'normal',
            borderWidth: 0,
            color: '#90ee7e',
        });
        (chartOpts.series as Highcharts.SeriesColumnOptions[]).push({
            type: 'column',
            name: (this.dKeys as any)['lobbiesAbandoned'],
            data: (this.mapStats as any)['lobbiesAbandoned'] as number[],
            stacking: 'normal',
            borderWidth: 0,
            color: '#DF5353',
        });

        return chartOpts;
    }

    private get chartParticipants() {
        if (this.mapStats === null) return null;

        const chartOpts = this.$helpers.deepCopy(this.chartBasicOptions);
        chartOpts.title = {
            text: 'Participants',
        };
        chartOpts.tooltip = {
            split: true,
            shared: true,
        };

        chartOpts.xAxis = {
            type: 'datetime',
            categories: this.mapStats!.date,
        };
        (chartOpts.series as Highcharts.SeriesColumnOptions[]).push({
            type: 'column',
            name: (this.dKeys as any)['participantsTotal'],
            data: (this.mapStats as any)['participantsTotal'] as number[],
            visible: true,
            borderColor: 'rgba(0,0,0,0.5)',
        });
        (chartOpts.series as Highcharts.SeriesAreaOptions[]).push({
            type: 'area',
            name: (this.dKeys as any)['participantsUniqueTotal'],
            data: (this.mapStats as any)['participantsUniqueTotal'] as number[],
            visible: true,
            fillOpacity: 0.7,
        });

        return chartOpts;
    }

    private get chartPendingTime() {
        if (this.mapStats === null) return null;

        const chartOpts = this.$helpers.deepCopy(this.chartBasicOptions);
        chartOpts.title = {
            text: 'Pending time average',
        };
        chartOpts.legend = {
            enabled: false,
        };
        chartOpts.tooltip = {
            pointFormatter: function(this) {
                let t = Number(this.y);
                let minutes = 0;
                let seconds = 0;
                if (t > 60) {
                    minutes = (t / 60);
                    t %= 60;
                }
                return `~${minutes.toFixed(0)}m ${t.toFixed(0)}s`;
            }
        },

        chartOpts.xAxis = {
            type: 'datetime',
            categories: this.mapStats!.date,
        };
        (chartOpts.series as Highcharts.SeriesColumnOptions[]).push({
            type: 'column',
            name: (this.dKeys as any)['pendingTimeAverage'],
            data: (this.mapStats as any)['pendingTimeAverage'] as number[],
            visible: true,
            borderColor: 'rgba(0,0,0,0.5)',
            color: '#DF5353',
        });

        return chartOpts;
    }

    @SGuard()
    private async refresh() {
        this.mapStats = (await this.$starc.getMapStats(
            Number(this.$route.params.regionId),
            Number(this.$route.params.mapId),
            {
                kind: this.periodItem as keyof typeof starc.StatsPeriodKind,
            }
        )).data;
        (this.mapStats as any)['lobbiesAbandoned'] = ((this.mapStats as any)['lobbiesHosted'] as number[]).map((x, i) => {
            return x - (this.mapStats as any)['lobbiesStarted'][i];
        });
    }

    private created() {
        this.refresh();
    }

    private onPeriodChange() {
        this.refresh();
    }
}
</script>
