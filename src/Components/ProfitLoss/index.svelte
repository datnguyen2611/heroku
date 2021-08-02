<script>
    import {
        expanded,
        component,
        selected,
        userAddress,
        addressBNB,
        abi_contract,
        isMobile,
        selectWallet,
        provider,
        userInfo,
    } from '../../store';
    import { ethers } from 'ethers';
    import Highcharts from 'highcharts';
    import { onMount } from 'svelte';

    let contract,
        signer,
        net = 0,
        orderNum = 0,
        winNum = 0,
        volume = 0,
        loserTotal = 0,
        winnerTotal = 0,
        averageReturn = 0;

    if ($userAddress) {
        volume = $userInfo.volume;
        orderNum = $userInfo.orderNum;
        winNum = $userInfo.winNum;
        winnerTotal = $userInfo.winnerTotal;
        net = $userInfo.depositTotal - volume;
        loserTotal = volume - winnerTotal;
        averageReturn =
            winnerTotal > loserTotal
                ? winnerTotal / orderNum
                : loserTotal / orderNum;
    }
    // contract = new ethers.Contract($addressBNB, $abi_contract, $provider);
    // $: if (window.ethereum) {
    //     signer = $provider.getSigner();
    //     contract = new ethers.Contract($addressBNB, $abi_contract, signer);
    // }
    // async function getInfo(unit) {
    //     round = await contract.order($userAddress, 0);
    //     round = Number(round.round);
    //     totalProfitValue =
    //         Number(
    //             await contract.betValue($userAddress, unit).totalBetProfitValue,
    //         ) /
    //         10 ** 18;
    //     totalBetValue =
    //         Number(await contract.betValue($userAddress, unit).totalBetValue) /
    //         10 ** 18;
    //     totalWith =
    //         Number(await contract.betValue($userAddress, unit).totalWithdraw) /
    //         10 ** 18;
    //     totalBetLose =
    //         Number(
    //             await contract.betValue($userAddress, unit).totalBetLoseValue,
    //         ) /
    //         10 ** 18;
    //     net = totalBetValue ? totalWith - totalBetValue : 0;
    //     totalBet = Number(await contract.betCount($userAddress).totalBet)
    //         ? Number(await contract.betCount($userAddress).totalBet)
    //         : 0;
    //     totalBetWin = Number(await contract.betCount($userAddress).totalBetWin)
    //         ? Number(await contract.betCount($userAddress).totalBetWin)
    //         : 0;
    // }
    // $: getInfo('0x9fbC43c5CD22C8E1Ed181b4efB0648ca955992bA');

    let x =
        orderNum && orderNum != 0 ? Math.floor((winNum * 100) / orderNum) : 0;
    let status = false;
    $: if ($userAddress) {
        setTimeout(() => {
            Highcharts.chart('chart-profit-loss', {
                chart: {
                    height: 120,
                    width: 200,
                    type: 'pie',
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                },
                title: {
                    text: '',
                },
                subtitle: {
                    text: `<div tysle='text-align:center;'>
                        <p style='font-size: 10px;margin:0;font-weight:400;'>Won</p>
                        <p style='font-size: 12px;margin:0;font-weight:700;'>${winNum}/${orderNum}</p>
                        <p style='font-size: 10px;margin:0;font-weight:400;'>${x}%</p>
                    </div> `,
                    align: 'center',
                    verticalAlign: 'left',
                    style: {
                        textAlign: 'center',
                        color: '#FFFFFF',
                    },
                    x: 0,
                    y: -2,
                    useHTML: true,
                },
                plotOptions: {
                    pie: {
                        size: 100,
                        center: [20, 35],
                        allowPointSelect: true,
                        cursor: 'pointer',
                        borderColor: 'transparent',
                    },
                },
                accessibility: {
                    point: {
                        valueSuffix: '%',
                    },
                },
                series: [
                    {
                        type: 'pie',
                        enableMouseTracking: false,
                        innerSize: '70%',
                        dataLabels: {
                            enabled: false,
                        },
                        data: [
                            {
                                y: orderNum - winNum,
                                color: '#ED4B9E',
                            },
                            {
                                y: winNum,
                                color: '#31D0AA',
                            },
                        ],
                    },
                ],
            });
        }, 1000);
    }
    onMount(() => {});
</script>

<style lang="scss">
    @import './profit-loss.scss';
    :global(.highcharts-subtitle) {
        left: 8% !important;
        top: 50% !important;
        transform: translateY(-50%);
        display: inline-block !important;
        width: 70px !important;
    }
</style>

<div class="profit-loss-wrap">
    <div class="title">
        <p>Profit Loss</p>
        <!-- {#if $isMobile == false} -->
        <button
            on:click={() => {
                $expanded = false;
                $component = '';
            }}>
            <i class="fas fa-times" />
        </button>
        <!-- {/if} -->
    </div>
    {#if $userAddress === ''}
        <button
            class="connect_btn"
            on:click={() => {
                $selectWallet = true;
            }}>
            Connect to wallet
        </button>
    {:else}
        <div class="your-story">
            <div class="circle-chart">
                <div id="chart-profit-loss" />
                <div class="result">
                    <p class="result-title">Net results</p>
                    <p class="result-price">${net}</p>
                </div>
            </div>

            <div class="average-return">
                <div class="average-return-item">
                    <p class="titles">Average return / round</p>
                    <p class="price">
                        {winnerTotal > loserTotal ? '+' : '-'} ${orderNum ? averageReturn.toFixed(4) : 0}
                    </p>

                </div>
                <!-- <div class="average-return-item">
                        <p class='titles'>Best round: #7142</p>
                        <p class="price">+0.145 {$selected.toUpperCase()} <span>(2.10x)</span></p>
                        <p class="sub">~$3.432</p>
                    </div>  -->
                <div class="average-return-item ">
                    <p class="titles">Average position entered / round</p>
                    <p class="price text-blue">
                        $ {orderNum ? (volume / orderNum).toFixed(4) : 0}
                    </p>
                </div>
            </div>

            <div class="list-history">
                <div class="list-history-item">
                    <div class="item-left">
                        <p class="titles">Won</p>
                        <p class="round" style="color:#31D0AA;">
                            {winNum} rounds
                        </p>
                        <p class="price">{x}%</p>
                    </div>
                    <div class="item-right">
                        <!-- {#if totalBetValue >= totalBetLose}
                            <p class="round" style="color:#31D0AA;">
                                +{totalProfitValue} {$selected.toUpperCase()}
                            </p>
                            <p class="price">
                                ~${(totalProfitValue) * convert}
                            </p>
                        {:else}
                            <p class="round" style="color:#31D0AA;">
                                0 {$selected.toUpperCase()}
                            </p>
                            <p class="price">~$0</p>
                        {/if} -->
                        <p class="round" style="color:#31D0AA;">
                            + ${winnerTotal}
                        </p>

                    </div>
                </div>
                <div class="list-history-item">
                    <div class="item-left">
                        <p class="titles">Lost</p>
                        <p class="round" style="color:#ED4B9E;">
                            {orderNum - winNum} rounds
                        </p>
                        <p class="price">{100 - x}%</p>
                    </div>
                    <div class="item-right">
                        <p class="round" style="color:#ED4B9E;">
                            - ${loserTotal}
                        </p>
                    </div>
                </div>
                <div class="list-history-item">
                    <div class="item-left">
                        <p class="titles">Entered</p>
                        <!-- {#if totalBetWin >= totalBet - totalBetWin}
                            <p class="round" style="color:#31D0AA;">
                                {totalBet} rounds
                            </p>
                        {:else}
                            <p class="round" style="color:#ED4B9E;">
                                {totalBet} rounds
                            </p>
                        {/if} -->
                        <p class="round" style="color:#1FC7D4;">
                            {orderNum} rounds
                        </p>
                        <p class="price">Total</p>
                    </div>
                    <div class="item-right">
                        <!-- {#if totalBetValue >= totalBetValue - totalBetLose}
                            <p class="round" style="color:#31D0AA;">
                                +{totalBetValue - totalBetLose > 0 ? totalBetValue - totalBetLose : 0}
                                {$selected.toUpperCase()}
                            </p>
                        {:else}
                            <p class="round" style="color:#ED4B9E;">
                                -{totalBetValue - totalBetLose > 0 ? totalBetValue - totalBetLose : 0}
                                {$selected.toUpperCase()}
                            </p>
                        {/if} -->
                        <p class="round" style="color:#1FC7D4;">${volume}</p>
                        <!-- <p class="price">~${volume * convert}</p> -->
                    </div>
                </div>
            </div>

            <a
                href="https://bscscan.com/address/{$userAddress}"
                target="_blank"
                class="btn-view">
                <p>View Reclaimed & Won</p>
                <img src="../../Assets/images/icon/share-icon.svg" alt="" />
            </a>
        </div>
    {/if}
</div>
