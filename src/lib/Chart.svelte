<script lang="ts">
    import {Chart} from "chart.js/auto";
    import {onMount} from "svelte";
    import type {EnphaseDataImproved} from "./enphase";

    export let values: EnphaseDataImproved[] = [];
    let ctx;
    let chartCanvas;
    let myChart;

    $: {
        let datasetsImported = {
            label: 'Imported',
            data: values.map(value => value.imported),
            backgroundColor: 'red',
        };
        let datasetsExported = {
            label: 'Exported',
            data: values.map(value => -value.exported),
            backgroundColor: 'blue',
        };
        let datasetsProduced = {
            label: 'Produced',
            data: values.map(value => value.production),
            backgroundColor: 'green',
        };
        let datasetsConsumed = {
            label: 'Consumed',
            data: values.map(value => -value.consumption),
            backgroundColor: 'violet',
        };
        let datasetsBattery = {
            label: 'Battery',
            data: values.map(value => -value.battery),
            backgroundColor: 'yellow',
        };

        let chartLabels = values.map(value => new Date(value.timestamp * 1000).toISOString().split('T')[1].substring(0, 5));
        if(myChart !== undefined) {
            myChart.destroy();
        }
        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [ datasetsProduced, datasetsImported, datasetsConsumed, datasetsBattery, datasetsExported]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Chart.js Bar Chart - Stacked'
                    },
                },
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });
    }

    onMount(async () => {
        ctx = chartCanvas.getContext('2d');
    });
</script>

<div style="width: 1600px;"><canvas bind:this={chartCanvas} id="myChart"></canvas></div>