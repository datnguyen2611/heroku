<script>
    import { afterUpdate, onDestroy, onMount } from 'svelte';
    import {
        period,
        isLoading,
        darkMode,
        coinType,
        last_price,
        locked_price,
        sig,
        currentActiveBetSeries,
        betTime,
        betValue,
        balanceOf,
        selectedCurrency,
        betResult,
        singlePrice,
        mode,
    } from '../../store.js';
    import WinLose from '@Components/WinLose';
    import Binance from 'binance-api-node';
    import Highcharts from 'highcharts';
    import stock from 'highcharts/modules/stock';
    import data from 'highcharts/modules/data';
    import exportdata from 'highcharts/modules/export-data';
    import accessibility from 'highcharts/modules/accessibility';
    import dragPanes from 'highcharts/modules/drag-panes';
    import indicatorsAll from 'highcharts/indicators/indicators-all';
    import fullScreen from 'highcharts/modules/full-screen';
    import stockTools from 'highcharts/modules/stock-tools';
    import annotations from 'highcharts/modules/annotations';
    import annotationsAdvanced from 'highcharts/modules/annotations-advanced';
    import priceindicator from 'highcharts/modules/price-indicator';
    import indicators from 'highcharts/indicators/indicators';
    import ema from 'highcharts/indicators/ema';
    import bb from 'highcharts/indicators/bollinger-bands';
    import ao from 'highcharts/indicators/ao';

    const LIMIT_ITEMS = 100;
    const client = Binance();
    $isLoading = true;
    export let interval;

    if ($period.value == '1000') {
        $period = {
            label: '5s',
            value: 5000,
        };
    }

    let colors = {
        red: '#ff3333',
        yellow: '#ffe81a',
        green: '#33ff4b',
        purple: '#8b66ff',
    };

    priceindicator(Highcharts);
    data(Highcharts);
    exportdata(Highcharts);
    stock(Highcharts);
    annotations(Highcharts);
    annotationsAdvanced(Highcharts);
    accessibility(Highcharts);
    fullScreen(Highcharts);
    dragPanes(Highcharts);
    indicatorsAll(Highcharts);
    indicators(Highcharts);
    ema(Highcharts);
    bb(Highcharts);
    ao(Highcharts);
    stockTools(Highcharts);
    const createCandleFromListTrade = (tradeList = [0]) => {
        return {
            open: tradeList[0],
            high: Math.max(...tradeList),
            low: Math.min(...tradeList),
            close: tradeList[tradeList.length - 1],
        };
    };

    let openTime = 0;
    let openPrice = 0;
    let livePrice = 0;
    let timeSecond;
    let time;
    let screenChange = 450;
    if (window.innerWidth < 769 && window.innerWidth > 500) {
        screenChange = 550;
    } else {
        screenChange = 480;
    }
    const getCandleDatas = async () => {
        let res;
        if ($period.value < 60000) {
            res = await fetch(
                `https://price.bo.finance/v1/bo/candlestickes?symbol=${$coinType}&timeInterval=${interval}`,
            );

            res = await res.json();

            const tradesLostInTransaction = await client.aggTrades({
                symbol: $coinType,
                startTime: res[res.length - 1].closedTime + 1,
                endTime: Date.now(),
            });

            let curOpenTime = res[res.length - 1].closedTime + 1;
            const groupTrade = tradesLostInTransaction.reduce(function(rv, x) {
                rv[curOpenTime] = rv[curOpenTime] || [];
                const lastTrade = x.price;
                if (x.timestamp < curOpenTime + interval) {
                    rv[curOpenTime].push(parseFloat(x.price));
                } else {
                    if (rv[curOpenTime].length === 0) {
                        const lastPrice =
                            rv[curOpenTime - interval] &&
                            rv[curOpenTime - interval].length
                                ? rv[curOpenTime - interval][
                                      rv[curOpenTime - interval].length - 1
                                  ]
                                : lastTrade;

                        rv[curOpenTime].push(lastPrice);
                    }
                    curOpenTime += interval;
                }
                return rv;
            }, {});

            const listLostCandle = Object.keys(groupTrade).map(tradeIndex => {
                const candleData = createCandleFromListTrade(
                    groupTrade[tradeIndex],
                );
                return [
                    parseFloat(tradeIndex),
                    candleData.open,
                    candleData.high,
                    candleData.low,
                    candleData.close,
                ];
            });

            openTime =
                listLostCandle.length > 0
                    ? listLostCandle[listLostCandle.length - 1][0]
                    : res[res.length - 1].openTime;
            openPrice =
                listLostCandle.length > 0
                    ? listLostCandle[listLostCandle.length - 1][4]
                    : res[res.length - 1].close;
            livePrice = openPrice;
            $locked_price = livePrice;
            return res
                .map((item, idx) => {
                    return [
                        item.openTime,
                        item.open,
                        item.high,
                        item.low,
                        item.close,
                    ];
                })
                .concat(listLostCandle);
        } else {
            res = await client.candles({
                symbol: $coinType,
                interval: $period.label,
                limit: LIMIT_ITEMS,
            });
            openTime = res[res.length - 1].openTime;
            openPrice = res[res.length - 1].close;
            livePrice = openPrice;
            $locked_price = livePrice;
            return res.map((item, idx) => {
                return [
                    item.openTime,
                    parseFloat(item.open),
                    parseFloat(item.high),
                    parseFloat(item.low),
                    parseFloat(item.close),
                ];
            });
        }
    };
    const renderPoint = (
        chart,
        x,
        y,
        distanceToEnd,
        sig,
        betValue,
        selectedCurrency,
    ) => {
        chart.addSeries({
            id: `bet_point${chart.series.length}`,
            name: `bet_point${chart.series.length}`,
            type: 'scatter',
            dataLabels: {
                enabled: true,
                format: `<div style="display: flex; margin-bottom: -25px; margin-left: -142px">
                    <div style="display: flex;
                    width: 120px;
                    background:${sig == 'bull' ? '#31D0AA' : '#ED4B9E'};
                    font-size: 10px;
                    font-weight: 700;  
                    color: #ffffff;
                    border-top-left-radius: 2px;
                    border-bottom-left-radius: 2px;">
                    <div style="padding: 4px;
                    border-radius: 2px;
                    background: #00000033;
                    margin: 3px;">
                        ${sig == 'bull' ? 'BULL' : 'BEAR'}
                    </div>
                    <div style="padding: 7px 3px;">
                        ${betValue} ${selectedCurrency}
                    </div>

                    </div>
                    <div style="  width: 0; 
                    height: 0; 
                    border-top: 14px solid transparent;
                    border-bottom: 14px solid transparent;  
                    border-left: 5px solid ${
                        sig == 'bull' ? '#31D0AA' : '#ED4B9E'
                    };">  
                    </div>
                    <div style="margin: auto 0;
                        width: {point.distanceToEnd}px;
                        border-bottom: 2px solid #FCC21B;
                        margin-left: 10px;
                        overflow: hidden;
                        ">
                    </div>
                    </div>`,
                useHTML: true,
                align: 'left',
                crop: false,
                overflow: 'allow',
            },
            animation: {
                duration: 500,
            },
            marker: {
                enabled: true,
                symbol: 'line',
                radius: 6,
                fillColor: '#FCC21B',
                lineColor: '#FFFFFF',
                lineWidth: 2,
            },
            data: [
                {
                    x: x,
                    y: y,
                    label: y,
                    distanceToEnd: distanceToEnd,
                },
            ],
        });
    };

    const addBetPoint = (chart, x, y) => {
        const distanceToEnd =
            chart.xAxis[0].toPixels(
                x + (60 - new Date(x).getSeconds()) * 1000,
            ) - chart.xAxis[0].toPixels(x);
        renderPoint(
            chart,
            x,
            y,
            distanceToEnd,
            $sig,
            $betValue,
            $selectedCurrency,
        );
        $currentActiveBetSeries.push({
            x,
            y,
            distanceToEnd,
            sig: $sig,
            betValue: $betValue,
            selectedCurrency: $selectedCurrency,
        });
        $currentActiveBetSeries = $currentActiveBetSeries;
    };

    const countingResult = (closeTime, closePrice) => {
        let result = 0;
        $currentActiveBetSeries.forEach(series => {
            if (closeTime - series.x < 60000) {
                if ($mode == 'singleprice') {
                    if ($singlePrice < closePrice) {
                        series.sig === 'bull'
                            ? (result += series.betValue)
                            : (result -= series.betValue);
                    } else {
                        series.sig === 'bear'
                            ? (result += series.betValue)
                            : (result -= series.betValue);
                    }
                } else {
                    if (series.y < closePrice) {
                        series.sig === 'bull'
                            ? (result += series.betValue)
                            : (result -= series.betValue);
                    } else {
                        series.sig === 'bear'
                            ? (result += series.betValue)
                            : (result -= series.betValue);
                    }
                }
            }
        });

        return result;
    };

    const removeBetPoints = chart => {
        const betSeries = chart.series
            .filter(s => s.getName().includes('bet_point'))
            .map(bets => {
                return bets.getName();
            });
        betSeries.forEach(e => {
            chart.get(e).remove();
        });
        $currentActiveBetSeries = [];
    };
    let myChart;
    onMount(async () => {
        const chartData = await getCandleDatas();
        // candle mode
        myChart = Highcharts.stockChart({
            rangeSelector: {
                enabled: false,
            },
            stockTools: {
                gui: {
                    enabled: true,
                    buttons: ['indicators'],
                },
            },
            chart: {
                renderTo: 'container',
                events: {
                    load() {
                        const series = this.series[0];
                        const seriesPoint = this.series[1];
                        if ($currentActiveBetSeries.length > 0) {
                            $currentActiveBetSeries.forEach(series => {
                                if (Date.now() - series.x < 60000) {
                                    renderPoint(
                                        this,
                                        series.x,
                                        series.y,
                                        series.distanceToEnd,
                                        series.sig,
                                        series.betValue,
                                        series.selectedCurrency,
                                    );
                                }
                            });
                        }

                        // for candle getting from Tulpo API for time interval 1s, 5s, 30s
                        if ($period.value < 60000) {
                            // for candle getting from Tulpo API for time interval 1s, 5s, 30s

                            let candleLive = openPrice;
                            client.ws.aggTrades($coinType, trade => {
                                candleLive = parseFloat(trade.price);
                            });

                            setInterval(() => {
                                livePrice = candleLive;
                                this.annotations[0].points[0].options.y = livePrice;
                                this.annotations[0].points[1].options.y = livePrice;
                                this.annotations[0].points[0].options.x = openTime;
                                this.annotations[0].points[1].options.x =
                                    openTime + 1; // update second point by a value which greater than last x ponit
                                const lastCandle =
                                    series.data[series.data.length - 1];
                                lastCandle.update({ close: livePrice });
                                seriesPoint.data[0].update({
                                    y: livePrice,
                                });
                                if (livePrice > openPrice) {
                                    if (livePrice > lastCandle.high) {
                                        lastCandle.update(
                                            { high: livePrice },
                                            true,
                                            true,
                                        );
                                    }
                                } else {
                                    if (livePrice < lastCandle.low) {
                                        lastCandle.update(
                                            { low: livePrice },
                                            true,
                                            true,
                                        );
                                    }
                                }
                            }, 1000);
                            setInterval(() => {
                                openPrice = livePrice;
                                openTime = openTime + interval;
                                if (new Date(openTime).getSeconds() == 30) {
                                    $singlePrice = livePrice;
                                }
                                series.addPoint(
                                    [
                                        openTime,
                                        openPrice,
                                        openPrice,
                                        openPrice,
                                        openPrice,
                                    ],
                                    true,
                                    true,
                                ); //ohlc
                                seriesPoint.data[0].update({
                                    x: openTime,
                                    y: livePrice,
                                });
                            }, interval);

                            //end
                        } else {
                            // For candle getting from Binance API

                            client.ws.futuresCandles(
                                $coinType,
                                $period.label,
                                item => {
                                    livePrice = parseFloat(item.close);
                                    this.annotations[0].points[0].options.y = livePrice;
                                    this.annotations[0].points[1].options.y = livePrice;
                                    this.annotations[0].points[0].options.x = openTime;
                                    this.annotations[0].points[1].options.x =
                                        openTime + 1; // update second point by a value which greater than last x ponit
                                    seriesPoint.data[0].update({
                                        y: livePrice,
                                    });
                                    if (openTime < item.startTime) {
                                        openTime = item.startTime;
                                        seriesPoint.data[0].update({
                                            x: openTime,
                                            y: livePrice,
                                        });
                                        if (
                                            new Date(openTime).getSeconds() ==
                                            30
                                        ) {
                                            $singlePrice = livePrice;
                                        }
                                        series.addPoint(
                                            [
                                                openTime,
                                                parseFloat(item.open),
                                                parseFloat(item.high),
                                                parseFloat(item.low),
                                                parseFloat(item.close),
                                            ],
                                            true,
                                            true,
                                        ); //ohlc
                                    }

                                    const last =
                                        series.data[series.data.length - 1];

                                    last.update(
                                        [
                                            parseFloat(item.open),
                                            parseFloat(item.high),
                                            parseFloat(item.low),
                                            parseFloat(item.close),
                                        ],
                                        true,
                                        true,
                                    );
                                },
                            );
                        }

                        // init annotation
                        seriesPoint.data[0].update({
                            x: openTime,
                            y: livePrice,
                        });
                        this.annotations[0].points[0].options.y = livePrice;
                        this.annotations[0].points[1].options.y = livePrice;
                        this.annotations[0].points[0].options.x = openTime;
                        this.annotations[0].points[1].options.x = openTime + 1; // update second point by a value which greater than last x ponit

                        this.annotations[1].points[0].options.y = livePrice;
                        this.annotations[1].points[1].options.y =
                            livePrice + 10;
                        const timeSecondGap =
                            new Date().getSeconds() -
                            (new Date().getSeconds() % (interval / 1000));
                        this.annotations[1].points[0].options.x =
                            openTime + (30 - timeSecondGap) * 1000;
                        this.annotations[1].points[1].options.x =
                            openTime + (30 - timeSecondGap) * 1000;
                        this.annotations[2].points[0].options.x =
                            openTime + (30 - timeSecondGap) * 1000 + 30000;
                        this.annotations[2].points[1].options.x =
                            openTime + (30 - timeSecondGap) * 1000 + 30000;

                        this.annotations[1].labels[0].update({
                            point: {
                                xAxis: 0,
                                x: this.annotations[1].points[1].options.x,
                            },
                        });

                        this.annotations[2].labels[0].update({
                            point: {
                                xAxis: 0,
                                x: this.annotations[2].points[1].options.x,
                            },
                        });

                        // end init

                        setInterval(() => {
                            if ($isLoading) $isLoading = !$isLoading;
                            series.yAxis.setExtremes(
                                Math.min(series.dataMin, livePrice),
                                Math.max(series.dataMax, livePrice),
                                true,
                                true,
                            );

                            series.xAxis.setExtremes(
                                series.xAxis.dataMax - 60 * interval, // candle interval 5s, show 60 candle in front block
                                series.xAxis.dataMax + 30 * interval, // candle interval 5s, show 30 candle in behind block
                                true,
                                true,
                            );
                            let a = this.xAxis[0].toPixels(
                                series.xAxis.dataMax + 30 * interval,
                            );
                            let b = this.xAxis[0].toPixels(
                                series.xAxis.dataMax,
                            );

                            seriesPoint.options.dataLabels.x = a - b;

                            time =
                                60 - new Date().getSeconds() < 10
                                    ? '0' +
                                      (60 - new Date().getSeconds()).toString()
                                    : '' +
                                      (60 - new Date().getSeconds()).toString();

                            timeSecond =
                                30 - new Date().getSeconds() < 0
                                    ? '00'
                                    : 30 - new Date().getSeconds() < 10
                                    ? '0' +
                                      (30 - new Date().getSeconds()).toString()
                                    : '' +
                                      (30 - new Date().getSeconds()).toString();
                            // reset position every 60s
                            if (new Date().getSeconds() === 0) {
                                this.annotations[1].points[0].options.x += 60000;
                                this.annotations[1].points[1].options.x += 60000;
                                this.annotations[2].points[0].options.x += 60000;
                                this.annotations[2].points[1].options.x += 60000;
                                $locked_price = livePrice;

                                setTimeout(() => {
                                    this.annotations[1].labels[0].update({
                                        point: {
                                            xAxis: 0,
                                            x:
                                                this.annotations[1].labels[0]
                                                    .points[0].x + 60000,
                                        },
                                    });
                                    this.annotations[2].labels[0].update({
                                        point: {
                                            xAxis: 0,
                                            x:
                                                this.annotations[2].labels[0]
                                                    .points[0].x + 60000,
                                        },
                                    });
                                }, 1200);
                                // reset point
                                const result = countingResult(
                                    Date.now(),
                                    livePrice,
                                );
                                $betResult = result;
                                removeBetPoints(this);
                            } else {
                                this.annotations[1].labels[0].options.text = timeSecond;
                                this.annotations[2].labels[0].options.text = time;
                            }
                        }, 1000);
                    },
                },
                backgroundColor: (function() {
                    if ($darkMode === 'dark') {
                        return '#16182D';
                    }
                    return '#E7EBF3';
                })(),
            },
            annotations: [
                {
                    type: 'infinityLine',
                    zIndex: 0,
                    draggable: false,
                    animation: {
                        enabled: false,
                    },
                    labelOptions: {
                        shape: 'circle',
                        backgroundColor: '#40424F',
                        borderColor: '#40424F',
                        zIndex: 100,
                        x: 0,
                    },
                    shapeOptions: {
                        stroke: '#F1F1F1',
                        strokeWidth: 1,
                    },
                    typeOptions: {
                        type: 'lay',
                        draggable: false,
                        points: [
                            {
                                x: 1,
                                y: 31810,
                            },
                            {
                                x: 2,
                                y: 31810,
                            },
                        ],
                        xAxis: 0,
                        yAxis: 0,
                    },
                    events: {
                        click: function() {
                            this.setControlPointsVisibility(this.cpVisibility);
                        },
                    },
                },
                {
                    type: 'infinityLine',
                    zIndex: 0,
                    draggable: false,
                    animation: {
                        enabled: true,
                        duration: 0,
                    },
                    colors: [],

                    labelOptions: {
                        shape: 'circle',
                        backgroundColor: 'var(--background-14)',
                        borderColor: '#F1F1F1',
                        zIndex: 100,
                        y: 0,
                        animation: {
                            enabled: true,
                            duration: 0,
                        },
                    },
                    labels: [
                        {
                            point: {
                                x: 0,
                                y: 0,
                            },
                            text: '00',
                            style: {
                                color: '#F1F1F1',
                                fontSize: 12,
                                fontWeight: 700,
                            },
                        },
                    ],

                    shapeOptions: {
                        stroke: '#F1F1F1',
                        strokeWidth: 2,
                    },
                    typeOptions: {
                        type: 'line',
                        draggable: false,
                        points: [
                            {
                                x: 3,
                                y: 1,
                            },
                            {
                                x: 3,
                                y: 2,
                            },
                        ],

                        xAxis: 0,
                        yAxis: 0,
                    },
                    events: {
                        click: function() {
                            this.setControlPointsVisibility(this.cpVisibility);
                        },
                    },
                },
                {
                    type: 'infinityLine',
                    zIndex: 0,
                    draggable: false,
                    animation: {
                        enabled: true,
                        duration: 0,
                    },
                    colors: [],

                    labelOptions: {
                        shape: 'circle',
                        backgroundColor: 'var(--background-14)',
                        borderColor: '#ed4b9e',
                        zIndex: 100,
                        y: 0,
                    },
                    labels: [
                        {
                            point: {
                                x: 0,
                                y: 0,
                            },
                            text: '00',
                            style: {
                                color: '#ed4b9e',
                                fontSize: 12,
                                fontWeight: 700,
                            },
                        },
                    ],
                    shapeOptions: {
                        stroke: '#ed4b9e',
                        strokeWidth: 2,
                    },
                    typeOptions: {
                        type: 'line',
                        draggable: false,
                        points: [
                            {
                                x: 3,
                                y: 1,
                            },
                            {
                                x: 3,
                                y: 2,
                            },
                        ],

                        xAxis: 0,
                        yAxis: 0,
                    },
                    events: {
                        click: function() {
                            this.setControlPointsVisibility(this.cpVisibility);
                        },
                    },
                },
            ],
            // responsive: {
            //     rules: [
            //         {
            //             condition: {
            //                 maxWidth: 769,
            //             },
            //             chartOptions: {
            //                 chart: {
            //                     height: window.innerHeight - screenChange,
            //                 },
            //             },
            //         },
            //     ],
            // },
            navigator: {
                enabled: false,
            },
            scrollbar: {
                enabled: false,
            },
            tooltip: {
                enabled: false,
            },
            legend: {
                enabled: true,
                floating: true,
                verticalAlign: 'top',
                align: 'left',
                layout: 'vertical',
                itemHiddenStyle: {
                    color: '#666',
                },
                itemStyle: {
                    color: '#ccc',
                },
                itemHoverStyle: {
                    color: '#fff',
                },
            },
            plotOptions: {
                pointInterval: 5, // one day
                pointIntervalUnit: 'second',
                candlestick: {
                    color: '#ED4B9E',
                    lineColor: '#ED4B9E',
                    upColor: '#31D0AA',
                    upLineColor: '#31D0AA',
                    lineWidth: 2,
                    showInLegend: false,
                },
                scatter: {
                    showInLegend: false,
                },
                series: {
                    showInLegend: true,
                    states: {
                        inactive: {
                            opacity: 1,
                        },
                        hover: {
                            enabled: false,
                        },
                    },
                    marker: {
                        enabled: false,
                    },
                    lineWidth: 1,
                    color: colors.red,
                },
                bb: {
                    color: colors.purple,
                },
                ao: {
                    marker: {
                        enabled: true,
                    },
                    lowerBarColor: '#ED4B9E',
                    greaterBarColor: '#31D0AA',
                },
                ema: {
                    color: colors.yellow,
                },
                dema: {
                    color: colors.green,
                },
                keltnerchannels: {
                    color: colors.green,
                },
                pivotpoints: {
                    color: colors.yellow,
                },
                priceenvelopes: {
                    color: colors.purple,
                },
                abands: {
                    color: colors.yellow,
                },
                ikh: {
                    opacity: 0.5,
                    senkouSpanA: {
                        styles: {
                            lineColor: '#33ff4b',
                        },
                    },
                    senkouSpanB: {
                        styles: {
                            lineColor: '#ff3333',
                        },
                    },
                    kijunLine: {
                        styles: {
                            lineColor: '#ff3333',
                        },
                    },
                    tenkanLine: {
                        styles: {
                            lineColor: '#33ffff',
                        },
                    },
                    chikouLine: {
                        styles: {
                            lineColor: '#ffe81a',
                        },
                    },
                    senkouSpan: {
                        color: '#1f2a25',
                        negativeColor: '#292024',
                    },
                },
            },
            time: {
                useUTC: false,
            },
            xAxis: {
                type: 'datetime',
                overscroll: 30 * interval,
                lineWidth: 0,
                tickWidth: 0,
                dateTimeLabelFormats: {
                    millisecond: '%H:%M',
                },
                crosshair: {
                    snap: false,
                    color: '#40424F',
                    label: {
                        enabled: false,
                    },
                },
            },
            yAxis: [
                {
                    gridLineColor: '#40424F',
                    gridZIndex: -1,
                    tickAmount: 7,
                    crosshair: {
                        snap: false,
                        color: '#40424F',
                        label: {
                            enabled: true,
                            format: '{value:.2f}',
                        },
                    },
                    labels: {
                        align: 'left',
                    },
                },
                {
                    gridLineColor: '#40424F',
                    gridZIndex: -1,
                    tickAmount: 3,
                    top: '90%',
                    height: '10%',
                    color: '#40424F',
                    offset: 5,
                    labels: {
                        enabled: false,
                    },
                },
            ],
            series: [
                {
                    type: 'candlestick',
                    id: 'Crypto',
                    data: [...chartData],
                },
                {
                    id: 'end_point',
                    type: 'scatter',
                    dataLabels: {
                        enabled: true,
                        x: 1000,
                        y: 2,
                        z: 100000,
                        backgroundColor: '#F1F1F1',
                        verticalAlign: 'middle',
                        style: {
                            fontSize: '12px',
                            height: '15px',
                            color: 'black',
                            textOutline: '',
                        },
                    },
                    marker: {
                        enabled: false,
                    },
                    data: [[0, 0]],
                },
            ],
        });
    });

    function handleBet(input) {
        if (myChart) {
            addBetPoint(myChart, openTime, livePrice);
        }
    }
    $: handleBet($betTime);
    $: $last_price = livePrice;
</script>

<style lang="scss">
    @import '../LiveChart/style.scss';

    :global(#chart-up-down .highcharts-popup) {
        display: none !important;
    }

    :global(.highcharts-stocktools-wrapper) {
        display: none !important;
    }

    :global(.highcharts-indicators) {
        background-color: initial !important;
        &:hover {
            background-color: initial !important;
        }
    }

    :global(ul.highcharts-indicator-list) {
        height: 100% !important;
    }
    :global(li.highcharts-indicator-list) {
        &:nth-child(2),
        &:nth-child(4),
        &:nth-child(5),
        &:nth-child(6),
        &:nth-child(8),
        &:nth-child(9),
        &:nth-child(10),
        &:nth-child(11),
        &:nth-child(13),
        &:nth-child(14),
        &:nth-child(17),
        &:nth-child(18),
        &:nth-child(21),
        &:nth-child(22),
        &:nth-child(23),
        &:nth-child(24),
        &:nth-child(25),
        &:nth-child(26),
        &:nth-child(28),
        &:nth-child(31),
        &:nth-child(32),
        &:nth-child(33),
        &:nth-child(34),
        &:nth-child(35),
        &:nth-child(37),
        &:nth-child(38),
        &:nth-child(39),
        &:nth-child(42),
        &:nth-child(43),
        &:nth-child(44),
        &:nth-child(45),
        &:nth-child(48) {
            display: none !important;
        }
        &:hover {
            background-color: var(--background-6) !important;
        }
        color: var(--text-default) !important;
    }

    :global(.highcharts-tab-item-content.highcharts-no-mousewheel:last-child
            li.highcharts-indicator-list) {
        display: block !important;
    }
    :global(.highcharts-popup) {
        position: absolute !important;
        bottom: 0 !important;
        top: unset !important;
        left: 0 !important;
        background-color: var(--background-10) !important;
        width: 450px !important;
        font-size: 12px !important;
        height: 455px !important;
        @media screen and (max-width: 769px) {
            width: 100% !important;
            top: 0 !important;
        }
    }

    :global(.highcharts-tab-item),
    :global(.highcharts-popup-rhs-col) {
        color: var(--text-default) !important;
        background-color: transparent !important;
    }

    :global(.highcharts-tab-item-active) {
        background-color: var(--background-6) !important;
    }

    :global(.highcharts-popup-rhs-col) {
        width: 60% !important;
    }

    :global(.highcharts-popup-lhs-col) {
        width: 40% !important;
    }

    :global(.highcharts-grid.highcharts-yaxis-grid .highcharts-grid-line) {
        stroke: #40424f !important;
    }

    :global(.highcharts-axis-resizer) {
        display: none;
    }
    :global(#container) {
        min-width: 100%;
        height: calc(100vh - 60px);
        margin: 0 auto;
        @media only screen and (max-width: 997px) {
            height: 100%;
        }
    }

    :global(.highcharts-credits) {
        display: none;
    }
</style>

<svelte:head>
    <link
        rel="stylesheet"
        type="text/css"
        href="https://code.highcharts.com/css/stocktools/gui.css" />
    <link
        rel="stylesheet"
        type="text/css"
        href="https://code.highcharts.com/css/annotations/popup.css" />
</svelte:head>

<WinLose />
<div style="position: relative;">
    <div id="container" />
</div>
