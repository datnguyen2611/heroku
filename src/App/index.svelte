<script>
    import Layout from '@Components/Layout';
    import HeaderLine from '@Components/HeaderList';
    import HeaderAddress from '@Components/WalletHeader';
    import LiveChart from '@Components/LiveChart';
    import CoinType from '@Components/CoinType';
    import NavRight from '@Components/NavRight';
    import NavLeft from '@Components/NavLeft';
    import AddressProfile from '@Components/AddressProfile';
    import SelectWallet from '@Components/SelectWallet';
    import Loading from '@Components/Loading';
    import Header from '@Components/Header';
    import CandleLiveChart from '@Components/CandleLiveChart';
    import NavRighItem from '@Components/NavRightItem';
    import KeyBoardNumber from '@Components/KeyBoardNumber';
    import { Bo } from '../Services/Bo';
    import Notification from '@Components/Notification';
    import {
        isMobile,
        selectWallet,
        userAddress,
        chartType,
        period,
        coinType,
        userInfo,
        provider,
    } from '../store';

    async function getUserInfo() {
        $userInfo = await Bo.getUserInfo({ userId: $userAddress });
    }
    $: $userAddress && getUserInfo();

    let component, signer;
    function changeTime() {
        if ($chartType === 'area') {
            component = LiveChart;
        } else {
            component = CandleLiveChart;
        }
    }

    changeTime();

    $: $period.value && changeTime();
    $: $chartType && changeTime();

    document.addEventListener(
        'click',
        function(event) {
            if (
                !event.target.closest('.highcharts-popup') &&
                !event.target.closest('#indicators')
            ) {
                if (document.querySelector('.highcharts-popup')) {
                    document.querySelector('.highcharts-popup').style.display =
                        'none';
                }
            }
        },
        false,
    );

    let focus = true;
    let afkTimer = 0;

    function handleFocus() {
        let now = new Date().getTime();
        if (!focus && now - afkTimer > 30000) {
            //Reload page after 30 seconds of inactivity

            window.location.reload();
        }
    }
    $: window.ethereum &&
        window.ethereum.on('accountsChanged', function(accounts) {
            $userAddress = '';
            window.location.reload();
        });
</script>

<style src="./style.scss">

</style>

<svelte:window
    on:focus={handleFocus}
    on:blur={() => {
        focus = false;
        afkTimer = new Date().getTime();
    }} />
<Layout>
    <div class="wrapper">
        <div class="main-wrapper">
            <Header />
            {#if $selectWallet && $userAddress == ''}
                <SelectWallet />
            {/if}
            <AddressProfile />
            <main class="main">
                {#if $isMobile}
                   <div class="top">
                    <NavRighItem />
                    <div class="chart-wrap">
                        <svelte:component
                            this={component}
                            interval={$period.value} />
                    </div>
                   </div>
                   <div class="bottom">
                    <div class="nav-right">
                        <NavRight />
                    </div>
                    <div class="nav-left">
                        <NavLeft />

                    </div>
                   </div>
                {:else}
                    <div class="nav-left">
                        <NavLeft />
                    </div>
                    <div class="chart-wrap">

                        <svelte:component
                            this={component}
                            interval={$period.value} />

                    </div>
                    <div class="nav-right">
                        <NavRight />
                    </div>
                {/if}
            </main>
        </div>
    </div>
    <Loading />
    <Notification />
</Layout>
