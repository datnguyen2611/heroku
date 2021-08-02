<script>
    import { afterUpdate, onDestroy, onMount } from 'svelte';
    import {
        darkMode,
        timeWait,
        isLoading,
        period,
        coinType,
        last_price,
        locked_price,
        sig,
        selectedCurrency,
        currentActiveBetSeries,
        betTime,
        betValue,
        balanceOf,
        mode,
        betResult,
        singlePrice,
    } from '../../store';
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
    import { Bo } from '../../Services/Bo';

    const LIMIT_ITEMS = 100;
    const client = Binance();
    $isLoading = true;

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

    export let interval;
    let openTime = 0;
    let openPrice = 0;
    let livePrice = 0;
    let timeSecond;
    let time;
    let screenChange = 450;
    if (window.innerWidth < 769 && window.innerWidth > 500) {
        screenChange = 550;
    } else {
        screenChange = 420;
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
            const initialCandles = res.map(item => {
                return [
                    item.openTime,
                    item.open,
                    item.high,
                    item.low,
                    item.close,
                ];
            });

            return initialCandles.concat(listLostCandle);
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
        let distanceToEnd =
            chart.xAxis[0].toPixels(
                x + (60 - new Date(x).getSeconds()) * 1000,
            ) - chart.xAxis[0].toPixels(x);
        if ($mode == 'singleprice')
            distanceToEnd = chart.xAxis[0].toPixels(30000);

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
        myChart = new Highcharts.stockChart({
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
                            let candleLive = openPrice;
                            // for candle getting from Tulpo API for time interval 1s, 5s, 30s
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

                                lastCandle.update({ y: livePrice });
                                seriesPoint.data[0].update({
                                    y: livePrice,
                                });
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
                                    if (new Date(openTime).getSeconds() == 30) {
                                        $singlePrice = livePrice;
                                    }
                                    if (openTime < item.startTime) {
                                        openTime = item.startTime;

                                        seriesPoint.data[0].update({
                                            x: openTime,
                                            y: livePrice,
                                        });
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

                                    last.update({ y: livePrice }, true, true);
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
                    if ($darkMode == 'dark') {
                        return '#16182D';
                    }
                    return '#E7EBF3';
                })(),
            },
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
            stockTools: {
                gui: {
                    enabled: true,
                    buttons: ['indicators'],
                },
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
            annotations: [
                {
                    type: 'infinityLine',
                    zIndex: 0,
                    draggable: false,
                    animation: {
                        enabled: false,
                    },
                    labelOptions: {
                        formatter: function() {
                            return (this.series.dataMax - this.y).toFixed(2);
                        },
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
                    },
                    colors: [],

                    labelOptions: {
                        shape: 'circle',
                        backgroundColor: 'var(--background-14)',
                        borderColor: '#F1F1F1',
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
                                color: '#F1F1F1',
                                fontSize: 12,
                                fontWeight: 700,
                            },
                        },
                    ],

                    shapeOptions: {
                        stroke: '#F1F1F1',
                        strokeWidth: 1,
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
                        strokeWidth: 1,
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
            rangeSelector: {
                enabled: false,
            },
            navigator: {
                enabled: false,
            },
            scrollbar: {
                enabled: false,
            },
            tooltip: {
                enabled: false,
                shadow: false,
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
            yAxis: {
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
            },
            plotOptions: {
                pointInterval: 5, // one day
                pointIntervalUnit: 'second',
                series: {
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
                    showInLegend: true,
                },
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1,
                        },
                        stops: [
                            [0.6, 'rgba(31, 199, 212, 0.21)'],
                            [1, 'rgba(16, 19, 35, 0.21)'],
                        ],
                    },
                    lineWidth: 2,
                    showInLegend: false,
                },
                scatter: {
                    showInLegend: false,
                },
                ema: {
                    color: colors.yellow,
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
                sma: {
                    color: colors.red,
                },
                wma: {
                    color: colors.red,
                },
                tema: {
                    color: colors.red,
                },
                dema: {
                    color: colors.green,
                },
                abands: {
                    color: colors.yellow,
                },
                trendline: {
                    color: colors.red,
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
            colors: ['#1FC7D4'],
            series: [
                {
                    id: 'Crypto',
                    type: 'area',
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
                        enabled: true,
                        symbol: 'circle',
                        radius: 8,
                        fillColor: '#1FC7D4',
                        lineColor: '#FFFFFF',
                        lineWidth: 3,
                    },
                    data: [[0, 0]],
                },
            ],
        });
    });
    function handleBet(input) {
        if (myChart) {
            console.log($mode);
            if ($mode == 'singleprice') {
                if ($currentActiveBetSeries.length == 0) {
                    addBetPoint(myChart, openTime, livePrice);
                    //myChart.annotations[1].points[1].options.x
                }
            } else {
                addBetPoint(myChart, openTime, livePrice);
            }
        }
    }
    $: handleBet($betTime);
    $: $last_price = livePrice;
</script>

<style lang="scss">
    @import './style.scss';
    /* 
    Setting custom css variables enables the user to use css to target a custom
    element by an attribute and change css properties that you want to expose.
    */
    :global(#container) {
        min-width: 100%;
        height: calc(100vh - 60px);
        margin: 0 auto;
        @media only screen and (max-width: 997px) {
            height: 100%;
        }
    }
</style>

<WinLose />
<div style="position: relative;">
    <div id="container" style="" />
    <!-- <div class="info">
        <div class="info_item">
            <p class="text1">0.543 BNB</p>
            <p class="text2">Betting amount</p>
        </div>
        <div class="info_item">
            <p class="text1">0.543 BNB</p>
            <p class="text2">Expected profit</p>
        </div>
        <div class="info_item">
            <p class="text1">
                {openTime + (30 - new Date().getSeconds()) * 1000 + 30000}s
            </p>
            <p class="text2">Time left</p>
        </div>
    </div> -->
</div>

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
