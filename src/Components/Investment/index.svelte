<script>
    import {
        expanded,
        component,
        isMobile,
        addressBNB,
        abi_contract,
        pairSelected,
        provider,
        darkMode,
        pairInfo,
    } from '../../store';
    import { ethers } from 'ethers';
    import { onMount } from 'svelte';
    import Binance from 'binance-api-node';
    import search_icon_dark from '../../Assets/images/icon/search-icon-dark.svg';
    import search_icon_light from '../../Assets/images/icon/search-icon-light.svg';
    let searchValue = '';
    const client = Binance();

    async function getPrice() {
        let symbols = [];
        for (let item of $pairInfo) {
            symbols.push(item.symbol);
        }
        for (let i in $pairInfo) {
            let dailyStats = await client.dailyStats({
                symbol: $pairInfo[i].symbol,
            });
            $pairInfo[i].price = Number(dailyStats.lastPrice).toFixed(3);
            $pairInfo = $pairInfo;
        }
    }

    $: $pairInfo = $pairInfo;
    onMount(async () => {
        getPrice();
    });

    async function searchPair() {
        let key = searchValue.toUpperCase();
        let list = document.querySelectorAll('.list-invesment-item');
        for (let i = 0; i < list.length; i++) {
            let a = list[i].querySelector('.symbol_text').innerHTML;
            if (a.toUpperCase().indexOf(key) == -1) {
                list[i].style.display = 'none';
            } else {
                list[i].style.display = '';
            }
        }
    }

    async function addPair(pair) {
        if ($pairSelected.length === 3) return;
        for (let item of $pairSelected) {
            if (
                item.token0 === pair.baseAsset &&
                item.token1 === pair.quoteAsset
            ) {
                return;
            }
        }
        let obj = {
            symbol: pair.symbol,
            token0: pair.baseAsset,
            token1: pair.quoteAsset,
            tokenImg: ``,
            status: true,
        };
        $pairSelected.push(obj);
        $pairSelected = $pairSelected;
    }
</script>

<style lang="scss">
    @import './investment.scss';
</style>

<div class="investment">
    <div class="title">
        <p>Investment Portfolio</p>
        {#if $isMobile}
            <button
                on:click={() => {
                    $expanded = false;
                    $component = 'hamburger';
                }}>
                <i class="fas fa-chevron-left" />
            </button>
        {:else}
            <button
                on:click={() => {
                    $expanded = false;
                    $component = '';
                }}>
                <i class="fas fa-times" />
            </button>
        {/if}
    </div>
    <div class="investment_search">
        <input
            type="text"
            id="search_pair"
            class="search_input"
            placeholder="Search..."
            bind:value={searchValue}
            on:keyup={() => {
                searchPair();
            }} />
        <img
            src={$darkMode === 'dark' ? search_icon_dark : search_icon_light}
            alt="" />
    </div>
    <div class="list-invesment">
        {#each $pairInfo as item}
            <div class="list-invesment-item" on:click={() => addPair(item)}>
                <div class="coin">
                    <div class="d-flex coin-pair">
                        <!-- <img width="15px" class="base-asset" src={require(`../../Assets/images/logo/${item.baseAsset.toLowerCase()}-icon.svg`)} alt="" />
                        <img width="15px" class="quote-asset" src={require(`../../Assets/images/logo/${item.quoteAsset.toLowerCase()}-icon.svg`)} alt="" /> -->
                        <img
                            src={require(`../../Assets/images/logo/${item.baseAsset.toLowerCase()}-icon.svg`)}
                            alt="" />
                    </div>
                    <p class="symbol_text">
                        {item.baseAsset}/{item.quoteAsset}
                    </p>
                </div>
                <div class="price">
                    <p>{item.price === 0 ? '--.--' : '$' + item.price}</p>
                </div>
            </div>
        {/each}
    </div>

</div>
