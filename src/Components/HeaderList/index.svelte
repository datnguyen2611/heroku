<script>
    import Binance from 'binance-api-node';
    import { onMount } from 'svelte';

    const client = Binance();
    let listPair = [
        {
            symbol: 'BTCUSDT',
            baseAsset: 'BTC',
            quoteAsset: 'USDT',
            price: 0,
            change: 0,
        },
        {
            symbol: 'ETHUSDT',
            baseAsset: 'ETH',
            quoteAsset: 'USDT',
            price: 0,
            change: 0,
        },
        {
            symbol: 'BNBUSDT',
            baseAsset: 'BNB',
            quoteAsset: 'USDT',
            price: 0,
            change: 0,
        },
        {
            symbol: 'MATICUSDT',
            baseAsset: 'MATIC',
            quoteAsset: 'USDT',
            price: 0,
            change: 0,
        },
        {
            symbol: 'DOTUSDT',
            baseAsset: 'DOT',
            quoteAsset: 'USDT',
            price: 0,
            change: 0,
        },
        {
            symbol: 'ADAUSDT',
            baseAsset: 'ADA',
            quoteAsset: 'USDT',
            price: 0,
            change: 0,
        },
        {
            symbol: 'SOLUSDT',
            baseAsset: 'SOL',
            quoteAsset: 'USDT',
            price: 0,
            change: 0,
        },
        {
            symbol: 'DOGEUSDT',
            baseAsset: 'DOGE',
            quoteAsset: 'USDT',
            price: 0,
            change: 0,
        },
        {
            symbol: 'ICPUSDT',
            baseAsset: 'ICP',
            quoteAsset: 'USDT',
            price: 0,
            change: 0,
        },
        {
            symbol: 'EURUSDT',
            baseAsset: 'EUR',
            quoteAsset: 'USDT',
            price: 0,
            change: 0,
        },
    ];

    async function getPrice() {
        for (let i in listPair) {
            let dailyStats = await client.dailyStats({
                symbol: listPair[i].symbol,
            });

            listPair[i].price = Number(dailyStats.lastPrice).toFixed(3);
            listPair[i].change = Number(dailyStats.priceChangePercent).toFixed(
                3,
            );
            listPair = listPair;
        }
    }

    onMount(async () => {
        getPrice();
    });
</script>

<style lang="scss">
    @import './header.scss';
</style>

<div class="wrap-list">
    <div class="wrap-items">
        <div class="list-items">
            {#each listPair as item}
                <div class="item">
                    <div class="text-coin">
                        {item.baseAsset}/{item.quoteAsset}
                    </div>
                    <div class="hour">(24h)</div>
                    {#if item.change >= 0}
                        <div class="status" style="color:#31D0AA">
                            <p>{item.change}%</p>
                            <i class="fas fa-caret-up dropdown" />
                        </div>
                    {:else}
                        <div class="status" style="color:#ED4B9E ">
                            <p>{item.change}%</p>
                            <i class="fas fa-caret-down dropdown" />
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>
