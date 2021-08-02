<script>
    import {
        timeWait,
        sig,
        locked_price,
        isMobile,
        last_price,
        selectedCurrency,
        exchange,
        mode,
        coinType,
        network,
        allCurrency,
    } from '../../store';
    import { ethers } from 'ethers';
    import Highcharts from 'highcharts';
    import { onMount } from 'svelte';
    import live_icon from '../../Assets/images/icon/live-icon.svg';
    import bear_icon from '../../Assets/images/icon/bear-icon.svg';
    import bull_icon from '../../Assets/images/icon/bull-icon.svg';
    import ChartOption from '@Components/ChartOption';
    import { Bo } from '../../Services/Bo';
    import LiveLine from '@Components/LiveLine';

    let openLastPrice = false;

    let prizePoolBull = 0,
        prizePoolBear = 0;
    let yResponsive = '30%';
    let textRespoive = -50;
    if (window.innerWidth < 1281 && window.innerWidth > 1023) {
        yResponsive = '18%';
        textRespoive = -100;
    } else {
        yResponsive = '30%';
        textRespoive = -50;
    }
    function getByValue(map, searchValue) {
        for (let [key, value] of map.entries()) {
            if (value === searchValue) return key;
        }
    }
    async function getPrizePools() {
        let res = await Bo.getLiveBullBear({
            exchange: $exchange,
            symbol: $coinType,
            mode: $mode,
            currency: Number(getByValue($allCurrency, $selectedCurrency)),
        });
        prizePoolBear = res['bear'] ? res['bear'] : 0;
        prizePoolBull = res['bull'] ? res['bull'] : 0;
    }

    setInterval(async () => {
        await getPrizePools();

        // await getPrice();
    }, 1000);

    $: prizePoolBull = prizePoolBull;
    $: prizePoolBear = prizePoolBear;
    $: price = price;
    $: $sig = $sig;
    $: prizeBlack = (0.03 * (prizePoolBull + prizePoolBear)) / 0.97;
    $: total = prizePoolBull + prizePoolBear + prizeBlack;
    onMount(() => {
        Highcharts.chart('chart-up-down', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                backgroundColor: 'transparent',
                events: {
                    load() {
                        setInterval(() => {
                            this.series[0].data[0].update({
                                y: (prizePoolBull / total) * 100,
                            });
                            this.series[0].data[1].update({ y: 3 });
                            this.series[0].data[2].update({
                                y: (prizePoolBear / total) * 100,
                            });
                        }, 1000);
                    },
                },
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
            },
            stockTools: {
                gui: {
                    enabled: false,
                },
            },
            accessibility: {
                point: {
                    valueSuffix: '%',
                },
            },
            plotOptions: {
                pie: {
                    startAngle: -150,
                    endAngle: 150,
                    center: ['50%', yResponsive],
                    size: '70%',
                    borderColor: 'transparent',
                    borderWidth: 6,
                    borderColor: null,
                    innerSize: '97%',
                },
            },

            title: {
                verticalAlign: 'middle',
                floating: true,
                text:
                    "<p style='color:#31D0AA;margin-bottom:2px;'>BULL</p><br/><p style='color:#ED4B9E;'>BEAR</p>",
                align: 'center',
                style: {
                    fontWeight: 700,
                    fontSize: 16,
                },
                y: textRespoive,
            },
            series: [
                {
                    type: 'pie',
                    name: 'Browser share',
                    // slicedOffset: 5,
                    data: [
                        {
                            name: 'BULL',
                            color: '#31D0AA',
                            //   sliced: true,
                            dataLabels: {
                                enabled: false,
                            },
                            y: 0,
                        },
                        {
                            color: '#101323',
                            sliced: true,
                            dataLabels: {
                                enabled: false,
                            },
                            y: 10,
                        },
                        {
                            name: 'BEAR',
                            color: '#ED4B9E',
                            className: 'bear-data',
                            //   sliced: true,
                            dataLabels: {
                                enabled: false,
                            },
                            y: 0,
                        },
                    ],
                },
            ],
        });
    });

    document.addEventListener(
        'click',
        function(event) {
            if (
                !event.target.closest('#live-line') &&
                !event.target.closest('#last-price')
            ) {
                openLastPrice = false;
            }
        },
        false,
    );
</script>

<style lang="scss">
    @import './nav-right-item.scss';
</style>

<div class="nav-right-item-wrap">
    <div class="wrap-line">
        <div
            class="live-line"
            id="live-line"
            on:click={() => {
                openLastPrice = !openLastPrice;
            }}>

            {#if $isMobile}
                <div class="title">
                    <p>
                        <img src={live_icon} alt="" />
                        Live
                    </p>
                    {#if $isMobile}
                        <p class="time-wait">
                            {$timeWait > 10 ? `0:${$timeWait}` : `0:0${$timeWait}`}s
                            <i
                                class="fas fa-chevron-{openLastPrice ? `up` : `down`}
                                dropdown-icon" />
                        </p>
                    {/if}
                </div>
                <LiveLine />
            {/if}
        </div>
        {#if $isMobile}
            <ChartOption />
        {/if}
    </div>
    <div class="last-price" id="last-price" class:open-mobile={openLastPrice}>
        <div class="title">Last Price:</div>
        <div class="price">
            <p>${Number($last_price).toFixed(3)}</p>
            <button class:increase={Number($last_price) - $locked_price > 0}>

                {#if Number($last_price) - $locked_price > 0}
                    <img src={bull_icon} alt="" />
                    +{(Number($last_price) - $locked_price).toFixed(3)}
                {:else}
                    <img src={bear_icon} alt="" />
                    -{((Number($last_price) - $locked_price) * -1).toFixed(3)}
                {/if}
            </button>
        </div>
        <div class="lock-price">
            <p>Locked Price:</p>
            <p>${Number($locked_price).toFixed(3)}</p>
        </div>
        <div class="price-pool">
            <div class="title">
                Prize Pool:
                <span>
                    {(prizePoolBull + prizePoolBear).toFixed(3)}
                    {$selectedCurrency}
                </span>
            </div>
            <div class="price-btn">
                <div class="price-btn-right">
                    <button>
                        <p>Up</p>
                        <p>
                            X{prizePoolBull * prizePoolBear != 0 ? ((prizePoolBull + prizePoolBear) / prizePoolBull).toFixed(1) : 0}
                        </p>
                    </button>
                    <button>
                        <p>Down</p>
                        <p>
                            X{prizePoolBull * prizePoolBear != 0 ? ((prizePoolBull + prizePoolBear) / prizePoolBear).toFixed(1) : 0}
                        </p>
                    </button>
                </div>
            </div>
        </div>
        <div id="chart-up-down" />
    </div>

</div>
