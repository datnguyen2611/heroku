<script>
    import {
        isMobile,
        userAddress,
        annotationPoint,
        sig,
        balanceOf,
        showNumberKeyboard,
        betValue,
        coinType,
        mode,
        selectedCurrency,
        currencyAddress,
        betTime,
        network,
        allCurrency,
        userInfo,
        exchange,
        currentActiveBetSeries,
        notification,
    } from '../../store';
    import NavRightItem from '@Components/NavRightItem';
    import { ethers } from 'ethers';
    import { onMount, createEventDispatcher } from 'svelte';
    import bull_icon from '../../Assets/images/icon/bull-icon.svg';
    import bear_icon from '../../Assets/images/icon/bear-icon.svg';
    import bnb_icon from '../../Assets/images/logo/bnb-icon.svg';
    import settingIcon from '../../Assets/images/icon/setting-icon.svg';
    import restore from '../../Assets/images/icon/restore.svg';
    import { Bo } from '../../Services/Bo';
    import LiveLine from '@Components/LiveLine';
    let balance = 0;

    let tokenAddress = '',
        tokenArr = [];
    $network = $network;
    async function selectBinance() {
        ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: '0x38',
                    chainName: 'Binance Smart Chain',
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    nativeCurrency: {
                        name: 'BNB',
                        symbol: 'BNB',
                        decimals: 18,
                    },
                    blockExplorerUrls: ['https://bscscan.com'],
                },
            ],
        });
    }
    async function selectPolygon() {
        ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: '0x89',
                    chainName: 'Matic Mainnet',
                    rpcUrls: ['https://rpc-mainnet.matic.network'],
                    nativeCurrency: {
                        name: 'MATIC',
                        symbol: 'MATIC',
                        decimals: 18,
                    },
                    blockExplorerUrls: ['https://explorer.matic.network/'],
                },
            ],
        });
    }
    async function selectEthereum() {
        ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }],
        });
    }
    $: switch ($network) {
        case 'ethereum':
            selectEthereum();
            tokenArr = $currencyAddress[0];
            tokenArr = tokenArr;
            $selectedCurrency = tokenArr[0].symbol;
            tokenAddress = tokenArr[0].address;
            break;
        case 'smartchain':
            selectBinance();
            tokenArr = $currencyAddress[1];
            tokenArr = tokenArr;
            $selectedCurrency = tokenArr[0].symbol;
            tokenAddress = tokenArr[0].address;
            break;
        case 'polygon':
            selectPolygon();
            tokenArr = $currencyAddress[2];
            tokenArr = tokenArr;
            $selectedCurrency = tokenArr[0].symbol;
            tokenAddress = tokenArr[0].address;
            break;
        case 'demo':
            tokenArr = $currencyAddress[3];
            tokenArr = tokenArr;
            $selectedCurrency = tokenArr[0].symbol;
            tokenAddress = tokenArr[0].address;
            break;
    }
    let percent = 0;
    function getByValue(map, searchValue) {
        for (let [key, value] of map.entries()) {
            if (value === searchValue) return key;
        }
    }
    async function getBalance() {
        $userInfo = await Bo.getUserInfo({ userId: $userAddress });
        balance =
            $userInfo.balance[getByValue($allCurrency, $selectedCurrency)];
    }
    $: $selectedCurrency && getBalance();
    $: $userInfo && getBalance();
    $: $sig = $sig;
    $betValue = $balanceOf;
    $balanceOf = 0;
    $: percent == 0
        ? ($balanceOf = Number((balance * percent) / 100))
        : ($balanceOf = Number((balance * percent) / 100).toFixed(4));
    async function bet() {
        if ($balanceOf == 0) return;
        if (new Date().getSeconds() > 30) {
            $notification = {
                message: 'Wait for next round',
                type: 'info',
                timeout: 3000,
            };
            return;
        }
        try {
            $betValue = Number($balanceOf);
            await Bo.bet({
                userId: $userAddress,
                quantity: Number($balanceOf),
                currency: Number(getByValue($allCurrency, $selectedCurrency)),
                side: $sig,
                network: $network,
                symbol: $coinType,
                exchange: $exchange,
                mode: $mode,
                copyFrom: $userAddress,
            });
            percent = 0;
            $balanceOf = 0;
            Bo.getUserInfo({
                userId: $userAddress,
            }).then(() => {
                getBalance();
            });
            $betTime = Date.now();
        } catch (ex) {
            $balanceOf = 0;
        }
    }
    let activeOption = false;

    document.addEventListener(
        'click',
        function(event) {
            if (!event.target.closest('#option-wallet')) {
                activeOption = false;
            }
        },
        false,
    );
</script>

<style lang="scss">
    @import './nav-right.scss';
</style>

<div class="wrap-right">
    {#if $isMobile == false}
        <LiveLine />
    {/if}
    <div class="title">
        <p>Prize Pool:</p>
        <div class="btn-select-token">
            <div class="btn-token">
                {#each tokenArr as { symbol, address }}
                    <button
                        class:active={$selectedCurrency === symbol}
                        on:click={() => {
                            $selectedCurrency = symbol;
                            tokenAddress = address;
                        }}>
                        {symbol}
                    </button>
                {/each}

            </div>
            <div class="btn-option" id="option-wallet">
                <div
                    class="selected"
                    on:click={() => {
                        activeOption = !activeOption;
                    }}>
                    <img src={settingIcon} alt="" />
                </div>
                <div class="option" class:active-option={activeOption}>
                    <div class="network">
                        <p>Select Network</p>
                        <div class="select">

                            <button
                                id="ethereum"
                                on:click={() => {
                                    $network = 'ethereum';
                                }}
                                class:get-selected={$network === 'ethereum'}>
                                Ethereum
                            </button>
                            <button
                                id="polygon"
                                on:click={() => {
                                    $network = 'polygon';
                                }}
                                class:get-selected={$network === 'polygon'}>
                                Polygon
                            </button>
                            <button
                                id="smartchain"
                                on:click={() => {
                                    $network = 'smartchain';
                                }}
                                class:get-selected={$network === 'smartchain'}>
                                Smartchain
                            </button>
                            <button
                                id="demo"
                                on:click={() => {
                                    $network = 'demo';
                                }}
                                class:get-selected={$network === 'demo'}>
                                Demo
                            </button>
                        </div>
                    </div>
                    <!-- <div class="prize-pool">
                        <p>Prize Pool:</p>
                        <div class="select">
                            {#each tokenArr as { symbol, address }}
                                <button
                                    id={symbol}
                                    name="network"
                                    class:get-selected={$selectedCurrency === symbol}
                                    on:click={() => {
                                        $selectedCurrency = symbol;
                                        tokenAddress = address;
                                    }}>
                                    {symbol}
                                </button>
                            {/each}

                        </div>
                    </div> -->
                </div>
            </div>
        </div>

    </div>
    <div class="multiple-single">
        <button
            class:active-mode={$mode === 'singleprice'}
            on:click={() => {
                if ($currentActiveBetSeries.length == 0) {
                    $mode = 'singleprice';
                }
            }}>
            Single
        </button>
        <button
            class:active-mode={$mode === 'multiprice'}
            on:click={() => {
                if ($currentActiveBetSeries.length == 0) {
                    $mode = 'multiprice';
                }
            }}>
            Multiple
        </button>
    </div>
    {#if $isMobile}
    <div class="price-pool">
            <div class="input-value">
                <div class="percent-input">
                    <button
                        on:click={() => {
                            percent = 10;
                        }}
                        class:percent-active={percent === 10}>
                        10%
                    </button>
                    <button
                        on:click={() => {
                            percent = 25;
                        }}
                        class:percent-active={percent === 25}>
                        25%
                    </button>
                    <button
                        on:click={() => {
                            percent = 50;
                        }}
                        class:percent-active={percent === 50}>
                        50%
                    </button>
                    <button
                        on:click={() => {
                            percent = 75;
                        }}
                        class:percent-active={percent === 75}>
                        75%
                    </button>
                    <button
                        on:click={() => {
                            percent = 100;
                        }}
                        class:percent-active={percent === 100}>
                        100%
                    </button>
                </div>
        <div class="commit-text">
            <p>Commit:</p>
            <div class="balance">
                Balance: {Number(balance).toFixed(3)}
                <div class="coin-icon">
                    {#if $selectedCurrency == 'dUSD'}
                        {$selectedCurrency}
                        <img
                            style="cursor: pointer"
                            src={restore}
                            on:click={async () => {
                                await Bo.restore({ userId: $userAddress });
                                Bo.getUserInfo({
                                    userId: $userAddress,
                                }).then(() => {
                                    getBalance();
                                });
                            }}
                            alt="" />
                    {:else}
                        <img src={bnb_icon} alt="" />
                        {$selectedCurrency}
                    {/if}

                </div>
            </div>
        
        </div>
        <input
        type="number"
        class="number"
        placeholder="0"
        inputmode="numeric"
        bind:value={$balanceOf}
 />
    </div>

        <div class="btn-bull-beap">
            <button
                on:mouseout={() => {
                    $annotationPoint = null;
                }}
                on:mouseover={() => {
                    $annotationPoint = 6720;
                }}
                on:click={() => {
                    $sig = 'bull';
                    bet();
                }}>
                BULL
                <img src={bull_icon} alt="" />

            </button>
            <button
                on:mouseout={() => {
                    $annotationPoint = null;
                }}
                on:mouseover={() => {
                    $annotationPoint = 0;
                }}
                on:click={() => {
                    $sig = 'bear';
                    bet();
                }}>
                BEAR
                <img src={bear_icon} alt="" />

            </button>
        </div>
    </div>
        {:else}
        <div class="price-pool">
            <div class="commit-text">
                <p>Commit:</p>
                <div class="balance">
                    Balance: {Number(balance).toFixed(3)}
                    <div class="coin-icon">
                        {#if $selectedCurrency == 'dUSD'}
                            {$selectedCurrency}
                            <img
                                style="cursor: pointer"
                                src={restore}
                                on:click={async () => {
                                    await Bo.restore({ userId: $userAddress });
                                    Bo.getUserInfo({
                                        userId: $userAddress,
                                    }).then(() => {
                                        getBalance();
                                    });
                                }}
                                alt="" />
                        {:else}
                            <img src={bnb_icon} alt="" />
                            {$selectedCurrency}
                        {/if}
    
                    </div>
                </div>
            </div>
            <div class="input-value">
                    <input
                        type="number"
                        class="number"
                        placeholder="0"
                        inputmode="numeric"
                        bind:value={$balanceOf}
                 />
                    <input
                        type="range"
                        class="range"
                        min="0"
                        max="100"
                        bind:value={percent} />
                    <div class="percent-input">
                        <button
                            on:click={() => {
                                percent = 10;
                            }}
                            class:percent-active={percent === 10}>
                            10%
                        </button>
                        <button
                            on:click={() => {
                                percent = 25;
                            }}
                            class:percent-active={percent === 25}>
                            25%
                        </button>
                        <button
                            on:click={() => {
                                percent = 50;
                            }}
                            class:percent-active={percent === 50}>
                            50%
                        </button>
                        <button
                            on:click={() => {
                                percent = 75;
                            }}
                            class:percent-active={percent === 75}>
                            75%
                        </button>
                        <button
                            on:click={() => {
                                percent = 100;
                            }}
                            class:percent-active={percent === 100}>
                            100%
                        </button>
                    </div>
            </div>
    
            <div class="btn-bull-beap">
                <button
                    on:mouseout={() => {
                        $annotationPoint = null;
                    }}
                    on:mouseover={() => {
                        $annotationPoint = 6720;
                    }}
                    on:click={() => {
                        $sig = 'bull';
                        bet();
                    }}>
                    BULL
                    <img src={bull_icon} alt="" />
    
                </button>
                <button
                    on:mouseout={() => {
                        $annotationPoint = null;
                    }}
                    on:mouseover={() => {
                        $annotationPoint = 0;
                    }}
                    on:click={() => {
                        $sig = 'bear';
                        bet();
                    }}>
                    BEAR
                    <img src={bear_icon} alt="" />
    
                </button>
            </div>
                <NavRightItem />
        </div>
    {/if}
</div>
