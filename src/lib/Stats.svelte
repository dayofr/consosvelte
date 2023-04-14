<script lang="ts">
    export let data = {
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
            imported: 0
    };
    function animateValue(obj, start, end, duration) {
        4
        if (obj === null) {
            return;
        }
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    $: {
        animateValue(document.getElementById("production"), 0, data.production / 1000, 5000);
        animateValue(document.getElementById("consumption"), 0, data.consumption / 1000, 5000);
        animateValue(document.getElementById("net"), 0, data.net / 1000, 5000);
        animateValue(document.getElementById("batteryStored"), 0, data.batteryStored / 1000, 5000);
        animateValue(document.getElementById("buy"), 0, data.buy, 5000);
        animateValue(document.getElementById("sell"), 0, data.sell, 5000);
        animateValue(document.getElementById("autoConsumption"), 0, data.autoConsumption, 5000);
        animateValue(document.getElementById("dependency"), 0, data.dependency, 5000);
    }
</script>

<div>
    <div class="value">
        <p class="display">Production <span class="display-value"><span id="production">0</span><span class="display-end">kWh</span></span></p>
        <p class="display">Consumption <span class="display-value"><span id="consumption">0</span><span class="display-end">kWh</span></span></p>
        <p class="display">Net <span class="display-value"><span id="net">0</span><span class="display-end">kWh</span></span></p>
        <p class="display">BatteryStored <span class="display-value"><span id="batteryStored">0</span><span class="display-end">kWh</span></span></p>
    </div>
    <div class="value">
        <p class="display">AutoConsumption <span class="display-value"><span id="autoConsumption">0</span><span class="display-end">%</span></span></p>
        <p class="display">Dependency <span class="display-value"><span id="dependency">0</span><span class="display-end">%</span></span></p>
        <p class="display">Buy <span class="display-value"><span id="buy">0</span><span class="display-end">€</span></span></p>
        <p class="display">Sell <span class="display-value"><span id="sell">0</span><span class="display-end">€</span></span></p>
    </div>
</div>

<style>
    .value {
        display: flex;
    }

    .display {
        flex-basis: 100%;
    }

    .display-value {
        display: block;
        font-size: 72px;
        background: linear-gradient(#004444, #008800);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }

    .display-end {
        font-size: 24px;
    }
</style>