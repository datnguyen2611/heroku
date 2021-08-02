<script>
    import {
        expanded,
        component,
        isMobile,
        addressBNB,
        abi_contract,
        pair_address,
        unit_address,
        provider,
        userAddress,
        selectWallet,
    } from '../../store';
    import { onMount } from 'svelte';
    import { ethers } from 'ethers';
    import { Bo } from '../../Services/Bo';
    let signer, contract;
    let currency = [
        'ETH',
        'USDT',
        'WBTC',
        'eFIBO',
        'BNB',
        'BUSD',
        'BTCB',
        'bFIBO',
        'MATIC',
        'USDC',
        'mBTC',
        'mFIBO',
        'dUSD',
    ];
    let history = [];
    let filter = 'win';
    let data = [];
    let detailed = [];

    onMount(async () => {
        if ($userAddress) {
            history = await Bo.history({ userId: $userAddress });
            data = history.filter(item => item.result === filter);
        }
    });

    const handleResultSelect = resultSelected => {
        filter = resultSelected;
        data = history.filter(item => item.result === resultSelected);
    };

    // contract = new ethers.Contract($addressBNB, $abi_contract, $provider);
    // let prizePoolBull = 0,
    //     prizePoolBear = 0,
    //     price = 0;
    // async function getPrizePools() {
    //     prizePoolBull =
    //         Number(await contract.blocks($pair_address, $unit_address, true)) /
    //             10 ** 18 || 0;
    //     prizePoolBear =
    //         (await contract.blocks($pair_address, $unit_address, false)) /
    //             10 ** 18 || 0;
    // }
    // async function getPrice() {
    //     price =
    //         Number(await contract.getPairPrice($pair_address, false)) /
    //             10 ** 8 || 0;
    // }
    // setInterval(async () => {
    //     await getPrizePools();
    //     await getPrice();
    // }, 3000);

    // $: prizePoolBull = prizePoolBull;
    // $: prizePoolBear = prizePoolBear;
    // $: price = price;
    // export let histories = [];
    // let x, y;
    // async function postData(url = '') {
    //     fetch(url)
    //         .then(response => response.json())
    //         .then(data => {
    //             x = data.reverse();
    //         });
    // }
    // onMount(async () => {
    //     await postData('https://api.bo.finance/round');
    // });
    // $: x && (histories = x) && (y = histories[0].round + 1)
</script>

<style lang="scss">
    @import './history.scss';
</style>

<div class="history-wrap">
    <div class="title">
        <p>History</p>
        <button
            on:click={() => {
                $expanded = false;
                $component = '';
            }}>
            <i class="fas fa-times" />
        </button>
    </div>

    {#if $userAddress}
        <div class="btn-event">
            <button
                class:active={filter === 'win'}
                on:click={() => handleResultSelect('win')}>
                Win
            </button>
            <button
                class:active={filter === 'lose'}
                on:click={() => handleResultSelect('lose')}>
                Lose
            </button>
            <button
                class:active={filter === 'tie'}
                on:click={() => handleResultSelect('tie')}>
                Tie
            </button>
        </div>

        <div class="history-list">

            {#each data as history, i}
                <div class="item-wrap">
                    <div
                        class="history-item"
                        class:active={detailed[i]}
                        on:click={() => (detailed[i] = !detailed[i])}>
                        <div class="left">
                            <p>#{history.orderIndex}</p>
                            <p>{history.side.toUpperCase()}</p>
                        </div>
                        <div class="right {history.result}">
                            <div class="right-result">
                                <p>
                                    {history.quantity}
                                    {currency[history.currency]}
                                </p>
                                <p>
                                    {new Date(history.timestamp).toUTCString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="details" class:active={detailed[i]}>
                        <div class="details-item">
                            <p>Mode</p>
                            <p>{history.mode.toUpperCase()}</p>
                        </div>
                        <div class="details-item">
                            <p>Symbol</p>
                            <p>{history.symbol.toUpperCase()}</p>
                        </div>
                        <div class="details-item">
                            <p>Exchange</p>
                            <p>{history.exchange.toUpperCase()}</p>
                        </div>
                        <div class="details-item">
                            <p>Network</p>
                            <p>{history.network.toUpperCase()}</p>
                        </div>
                        <div class="details-item">
                            <p>Price</p>
                            <p>{history.price}</p>
                        </div>
                        <div class="details-item">
                            <p>Session</p>
                            <p>{history.session}</p>
                        </div>
                        <div class="details-item">
                            <p>Profit Rate</p>
                            <p>{history.profitRate}</p>
                        </div>
                    </div>

                </div>
            {/each}
        </div>
    {:else}
        <button
            class="connect_btn"
            on:click={() => {
                $selectWallet = true;
            }}>
            Connect to wallet
        </button>
    {/if}

</div>
