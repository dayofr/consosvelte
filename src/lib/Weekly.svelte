<script lang="ts">
    import Stats from "./Stats.svelte";
    import {batteryMax, datas, multiplier} from "../stores";
    import {doIt} from "./stat";
    import Chart from "./Chart.svelte";
    import {improve} from "./enphase.js";
    let startDateString = '';
    let endDateString = '';
    let selectedDateString = '';
    let selectedDate = 0;
    let values = [];
    let stats = {
        production: 0,
        consumption: 0,
        net: 0,
        batteryMax: 0,
        batteryStored: 0,
        batteryUsed: 0,
        buy: 0,
        sell: 0,
        autoConsumption: 0,
        dependency: 0,
        exported: 0,
        imported: 0,
    };

    $: startDate = $datas.length > 1 ? $datas.reduce( (p, c) => p.timestamp < c.timestamp ? p : c).timestamp: 0;
    $: endDate = $datas.length > 1 ? $datas.reduce( (p, c) => p.timestamp > c.timestamp ? p : c).timestamp : 0;

    $: {
        startDateString = new Date(startDate * 1000).toISOString().split('T')[0];
        endDateString = new Date(endDate * 1000).toISOString().split('T')[0];
        selectedDate = new Date(selectedDateString).getTime() / 1000;
    }

    $: {
        values = $datas.filter(value => value.timestamp > selectedDate && value.timestamp < selectedDate + 86400);
        console.log(selectedDate)
        stats = doIt(values, $multiplier, $batteryMax);
    }
</script>

<input type="date" min={startDateString} max={endDateString} bind:value={selectedDateString}/>
<Stats data={stats} />
<Chart values={improve($datas, $multiplier, $batteryMax, 0).data.filter(value => value.timestamp > selectedDate && value.timestamp < selectedDate + 86400 * 7)}/>