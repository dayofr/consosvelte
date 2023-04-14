<script lang="ts">
    import DropFile from "./lib/DropFile.svelte";
    import dayjs from "dayjs";
    import customParseFormat from 'dayjs/plugin/customParseFormat'
    import Tabs from "./lib/Tabs.svelte";
    import Daily from "./lib/Daily.svelte";
    import {datas, batteryMax, multiplier} from "./stores";
    import Weekly from "./lib/Weekly.svelte";

    let datasValue;

    datas.subscribe(value => {
        datasValue = value;
    });

    dayjs.extend(customParseFormat)

    const onDrop = (files: File[]) => {
        const reader = new FileReader();
        datas.set([]);
        reader.onload = function () {
            // By lines
            const lines = (this.result as string).split('\n');
            for (let line = 1; line < lines.length - 1; line++) {
                const d = lines[line].split((','));
                $datas = [...$datas,{
                    timestamp: dayjs(d[0], "YYYY-MM-DD hh:mm:ss ZZ").unix(),
                    production: parseInt(d[1]),
                    consumption: parseInt(d[2])
            }];
            }
        };
        files.forEach(file => {
            reader.readAsText(file);
        })
    }

    let items = [
        { label: "Daily",
            value: 1,
            component: Daily
        },
        { label: "Weekly",
            value: 2,
            component: Weekly
        },
        { label: "Monthly",
            value: 3,
            component: Daily
        },
        { label: "Yearly",
            value: 4,
            component: Daily
        },
    ];
</script>

<main>
    <div class="card">
        <DropFile onDrop={onDrop}/>
    </div>
    <p>{datasValue.length} items</p>
    <button on:click={datas.set([])}>Clear</button>
    <br/>
    <div class="top-input">
        <div class="input">
            <label for="battery">Battery</label>
            <input bind:value={$batteryMax} type="number" step="1000" id="battery">
        </div>
        <div class="input">
            <label for="multiplier">Production Multiplier</label>
            <input bind:value={$multiplier} type="number" step="1" id="multiplier">
        </div>
    </div>

    <Tabs {items} />
</main>

<style>
    .card {
        min-width: 400px;
    }

    .top-input {
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    .input {
        display: flex;
        flex-direction: column;
        max-width: 200px;
    }
</style>
