<script>
    import { expanded, isMobile, component, userAddress } from '../../store';
    import { Bo } from '../../Services/Bo';
    import { onMount } from 'svelte';
    import DownIconLight from '../../Assets/images/icon/down_icon.svg';
    let expand = false;
    let tabActive = 'bnb';
    export let tops = [];
    let x;
    // async function postData(url = '') {
    //     fetch(url)
    //         .then(response => response.json())
    //         .then(data => (x = data));
    // }
    let detailed = [];
    onMount(async () => {
        // await postData('https://api.bo.finance/top');
        x = await Bo.getTopTrading();
    });

    $: x && (tops = x);
</script>

<style lang="scss">
    @import './top-trading.scss';
</style>

<!-- {#if $isMobile} -->
<div class="trading-expand ">
    <div class="title">
        <p>Top Trading</p>
        <button
            on:click={() => {
                $component = '';
                $expanded = false;
            }}>
            <!-- {#if $isMobile == false} -->
            <i class="fas fa-times" />
            <!-- {/if} -->
        </button>
    </div>

    <div class="content">
        <!-- <table>
            <thead>
                <th>No</th>
                <th>Address</th>
                <th>Volume</th>
            </thead>
        
            <tbody>
                {#each tops as top, i}
                    <tr>
                        <td class="address">{i + 1}</td>
                        <td>
                            {top.userId.substr(0, 7) + '...' + top.userId.substr(-7, 7)}
                        </td>
                        <td>
                            {top.volume}
                        </td>
                    
                    </tr>

                {/each}
            </tbody>
        </table> -->
        <div class="top-header">

            <p>No</p>
            <p>Address</p>
            <p>Volume</p>
        </div>
        {#each tops as top, i}
            <div class="item">
                <div
                    class="header"
                    on:click={() => (detailed[i] = !detailed[i])}>
                    <p>{i + 1}</p>
                    <p>
                        {top.userId.substr(0, 7) + '...' + top.userId.substr(-7, 7)}
                    </p>
                    <p>{top.volume}</p>
                    <!-- <img src={DownIconLight} alt=""> -->
                </div>
                <div class="details" class:active={detailed[i]}>
                    <div class="details-item">
                        <p>Order Number</p>
                        <p>{top.orderNum}</p>
                    </div>
                    <div class="details-item">
                        <p>Win Number</p>
                        <p>{top.winNum}</p>
                    </div>
                    <div class="details-item">
                        <p>Total Deposit</p>
                        <p>${top.depositTotal}</p>
                    </div>
                    <div class="details-item">
                        <p>Total Winning</p>
                        <p>${top.winnerTotal}</p>
                    </div>
                </div>

            </div>
        {/each}
    </div>
</div>
<!-- {:else} -->
<!-- <div class="btn-top-trading" on:click={() => (expand = !expand)}>
        Top Trading
        <i class="fas fa-caret-up dropdown" />
    </div>
    <div class="trading-expand" class:trading-expand--active={expand}>
        <div class="toggle" on:click={() => (expand = !expand)}>
            Top Trading
            <i class="fas fa-caret-down dropdown" />
        </div>

        <div class="content">
            <table>
                <th>No.</th>
                <th>Address</th>
                <th>Volume</th>
                <th style="text-align: right;">Win</th>
                {#each tops as top, i}
                <tr>
                    <td>{i + 1}</td>
                    <td>{top.userId}</td>
                    <td>${top.volume}</td>
                    <td>${top.volume}</td>
                </tr>
                {/each}
            </table>
        </div>
    </div> -->
<!-- {/if} -->
