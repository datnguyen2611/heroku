<script>
    import {
        timeWait,
        coinType,
        pairSelected,
        pairInfo,
        parent,
    } from '../../store';

    import bnb_icon from '../../Assets/images/logo/bnb-icon.svg';

    setInterval(() => {
        let now = new Date().getSeconds();
        $timeWait = 60 - now;
    }, 1000);

    async function closeCoinType(symbol) {
        if ($pairSelected.length === 1) return;
        for (let i in $pairSelected) {
            if ($pairSelected[i].symbol === symbol) {
                if ($coinType == symbol) break;
                await $pairSelected.splice(i, 1);
            }
        }
        $pairSelected = $pairSelected;
    }

    // document.addEventListener(
    //     'click',
    //     function(e) {
    //         if (!e.target.closest('.time-count')) {
    //             openStatus = false;
    //         }
    //     },
    //     false,
    // );
    if (
        window.location.search.includes('?') &&
        !window.location.search.includes('ref')
    ) {
        let pair = window.location.search.slice(
            window.location.search.indexOf('?') + 1,
        );
        let obj;
        for (let item of $pairInfo) {
            if (item.symbol === pair) {
                $coinType = pair;
                obj = {
                    symbol: item.symbol,
                    token0: item.baseAsset,
                    token1: item.quoteAsset,
                    tokenImg: ``,
                    status: true,
                };
                break;
            }
        }
        let check = true;
        for (let item of $pairSelected) {
            if (item.symbol === pair) {
                check = false;
                break;
            }
        }
        if (check) {
            $pairSelected.pop();
            $pairSelected.unshift(obj);
        }
    } else if (window.location.search.includes('?ref=')) {
        $parent = window.location.search.slice(
            window.location.search.indexOf('=') + 1,
        );
        window.location = window.location.origin + window.location.pathname;
    }

    $: $pairSelected = $pairSelected;
</script>

<style lang="scss">
    @import './coin-type.scss';
</style>

<div class="coin-type-wrap">
    <div class="coin-type">
        {#each $pairSelected as item}
            <div class="item" class:active={$coinType === item.symbol}>

                <div
                    class="wrap"
                    on:click={() => {
                        $coinType = item.symbol;
                        window.location.search = '?' + $coinType;
                    }}>
                    <img
                        class="token-image"
                        src={require(`../../Assets/images/logo/${item.token0.toLowerCase()}-icon.svg`)}
                        alt="" />
                    <p>{item.token0}/{item.token1}</p>
                </div>
                <div class="close">
                    <button
                        on:click={() => {
                            closeCoinType(item.symbol);
                        }}>
                        <i class="fas fa-times" />
                    </button>
                </div>
            </div>
        {/each}
    </div>

</div>
