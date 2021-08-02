<script>
    import { component, expanded, darkMode, isMobile } from '../../store';
    import Investment from '@Components/Investment';
    import History from '@Components/History';
    import Profit from '@Components/Profit';
    import ProfitLoss from '@Components/ProfitLoss';
    import Affiliate from '@Components/Affiliate';
    import Document from '@Components/Document';
    import Support from '@Components/Support';
    import TopTrading from '@Components/TopTrade';
    import DarkMode from '@Components/DarkMode';
    import ChartOption from '@Components/ChartOption';
    import Line from '@Components/Line';
    import profit_icon_dark from '../../Assets/images/icon/profit-icon-dark.svg';
    import profit_icon_light from '../../Assets/images/icon/profit-icon-light.svg';
    import profit_icon_light_active from '../../Assets/images/icon/profit-icon-light-active.svg';
    import profit_icon_active from '../../Assets/images/icon/profit-icon-active.svg';
    import home_icon_dark from '../../Assets/images/icon/home-icon-dark.svg';
    import home_icon_light from '../../Assets/images/icon/home-icon-light.svg';
    import home_icon_light_active from '../../Assets/images/icon/home-icon-light-active.svg';
    import home_icon_active from '../../Assets/images/icon/home-icon-active.svg';
    import profit_loss_icon_dark from '../../Assets/images/icon/profit-loss-icon-dark.svg';
    import profit_loss_icon_light from '../../Assets/images/icon/profit-loss-icon-light.svg';
    import profit_loss_icon_light_active from '../../Assets/images/icon/profit-loss-icon-light-active.svg';
    import profit_loss_icon_active from '../../Assets/images/icon/profit-loss-icon-active.svg';
    import hamburger_dark from '../../Assets/images/icon/hamburger-dark.svg';
    import hamburger_light from '../../Assets/images/icon/hamburger-light.svg';
    import hamburger_active from '../../Assets/images/icon/hamburger-active.svg';
    import hamburger_light_active from '../../Assets/images/icon/hamburger-light-active.svg';
    import investment_icon_dark from '../../Assets/images/icon/investment-icon-dark.svg';
    import investment_icon_light from '../../Assets/images/icon/investment-icon-light.svg';
    import investment_icon_active from '../../Assets/images/icon/investment-icon-active.svg';
    import affiliate_icon_dark from '../../Assets/images/icon/affiliate-icon-dark.svg';
    import affiliate_icon_light from '../../Assets/images/icon/affiliate-icon-light.svg';
    import affiliate_icon_active from '../../Assets/images/icon/affiliate-icon-active.svg';
    import trading_icon_dark from '../../Assets/images/icon/trading-icon-dark.svg';
    import trading_icon_light from '../../Assets/images/icon/trading-icon-light.svg';
    import trading_icon_active from '../../Assets/images/icon/trading-icon-active.svg';
    import transaction_icon_light from '../../Assets/images/icon/transaction-icon-light.svg';
    import transaction_icon_dark from '../../Assets/images/icon/transaction-icon-dark.svg';
    import transaction_icon_active from '../../Assets/images/icon/transaction-icon-active.svg';

    let renderComponent = '';

    function getComponent(input) {
        if ($component == '') {
            $expanded = true;
            $component = input;
        } else {
            if ($component == input) {
                $component = '';
                $expanded = false;
            } else {
                $expanded = true;
                $component = input;
            }
        }
    }

    // document.addEventListener(
    //     'click',
    //     function(event) {
    //         if (
    //             !event.target.closest('.nav-left-active') &&
    //             !event.target.closest('.item')
    //         ) {
    //             $expanded = false;
    //             $component = '';
    //         }
    //     },
    //     false,
    // );

    $: switch ($component) {
        case 'investment':
            renderComponent = Investment;
            break;
        case 'history':
            renderComponent = History;
            break;
        case 'profit':
            renderComponent = Profit;
            break;
        case 'profit-loss':
            renderComponent = ProfitLoss;
            break;
        case 'affiliate':
            renderComponent = Affiliate;
            break;
        case 'document':
            renderComponent = Document;
            break;
        case 'support':
            renderComponent = Support;
            break;
        case 'top-trading':
            renderComponent = TopTrading;
            break;

        case 'line':
            renderComponent = Line;
            break;
        default:
            break;
    }
    // document.addEventListener(
    //     'click',
    //     function(event) {
    //         if (!event.target.closest('.selection-item')) {
    //             option = '';
    //         }
    //     },
    //     false,
    // );
</script>

<style lang="scss">
    @import './nav-left.scss';
</style>

<div class="nav-left-wrap" class:flex={$expanded}>
    <div class="nav-left-item">
        {#if $isMobile}
            <div
                class="item"
                class:active-nav={$component === 'profit'}
                on:click={() => {
                    getComponent('profit');
                }}>
                {#if $darkMode === 'dark'}
                    <img
                        src={$component === 'profit' ? profit_icon_dark : profit_icon_active}
                        alt="" />
                {:else}
                    <img
                        src={$component === 'profit' ? profit_icon_light_active : profit_icon_light}
                        alt="" />
                {/if}

                <p>Profit</p>
            </div>
            <div
                class="item"
                class:active-nav={$component === 'top-trading'}
                on:click={() => {
                    getComponent('top-trading');
                }}>

                <img
                    src={$component === 'top-trading' ? trading_icon_dark : $darkMode === 'dark' ? trading_icon_active : trading_icon_light}
                    alt="" />

                <p>Top Trading</p>
            </div>

            <div
                class="item"
                class:active-nav={$component === ''}
                on:click={() => {
                    $component = '';
                    $expanded = false;
                }}>
                {#if $darkMode === 'dark'}
                    <img
                        src={$component === '' ? home_icon_dark : home_icon_active}
                        alt="" />
                {:else}
                    <img
                        src={$component === '' ? home_icon_light_active : home_icon_light}
                        alt="" />
                {/if}
                <p>Terminal</p>
            </div>
            <div
                class="item"
                class:active-nav={$component === 'profit-loss'}
                on:click={() => {
                    getComponent('profit-loss');
                }}>
                {#if $darkMode === 'dark'}
                    <img
                        src={$component === 'profit-loss' ? profit_loss_icon_dark : profit_loss_icon_active}
                        alt="" />
                {:else}
                    <img
                        src={$component === 'profit-loss' ? profit_loss_icon_light_active : profit_loss_icon_light}
                        alt="" />
                {/if}
                <p>Profit & Loss</p>
            </div>
            <div
                class="item"
                class:active-nav={$component === 'hamburger'}
                on:click={() => {
                    // getComponent('hamburger');
                    $component = 'hamburger';
                }}>
                {#if $darkMode === 'dark'}
                    <img
                        src={$component === 'hamburger' ? hamburger_dark : hamburger_active}
                        alt="" />
                {:else}
                    <img
                        src={$component === 'hamburger' ? hamburger_light_active : hamburger_light}
                        alt="" />
                {/if}
                <p>More</p>
            </div>
        {:else}
            <div
                class="item"
                class:active-nav={$component === 'investment'}
                on:click={() => {
                    getComponent('investment');
                }}>

                <img
                    src={$component === 'investment' ? investment_icon_active : $darkMode === 'dark' ? investment_icon_dark : investment_icon_light}
                    alt="" />

                <p>Investment portfolio</p>
            </div>
            <div
                class="item"
                class:active-nav={$component === 'history'}
                on:click={() => {
                    getComponent('history');
                }}>

                <img
                    src={$component === 'history' ? transaction_icon_active : $darkMode === 'dark' ? transaction_icon_dark : transaction_icon_light}
                    alt="" />

                <p>History</p>
            </div>
            <div
                class="item"
                class:active-nav={$component === 'profit'}
                on:click={() => {
                    getComponent('profit');
                }}>

                <img
                    src={$component === 'profit' ? profit_icon_active : $darkMode === 'dark' ? profit_icon_dark : profit_icon_light}
                    alt="" />

                <p>Profit statistics</p>
            </div>
            <div
                class="item"
                class:active-nav={$component === 'profit-loss'}
                on:click={() => {
                    getComponent('profit-loss');
                }}>

                <img
                    src={$component === 'profit-loss' ? profit_loss_icon_active : $darkMode === 'dark' ? profit_loss_icon_dark : profit_loss_icon_light}
                    alt="" />

                <p>Profit & Loss</p>
            </div>
            <div
                class="item"
                class:active-nav={$component === 'affiliate'}
                on:click={() => {
                    getComponent('affiliate');
                }}>

                <img
                    src={$component === 'affiliate' ? affiliate_icon_active : $darkMode === 'dark' ? affiliate_icon_dark : affiliate_icon_light}
                    alt="" />

                <p>Affiliate Marketing</p>
            </div>

            <div
                class="item"
                class:active-nav={$component === 'top-trading'}
                on:click={() => {
                    getComponent('top-trading');
                }}>

                <img
                    src={$component === 'top-trading' ? trading_icon_active : $darkMode === 'dark' ? trading_icon_dark : trading_icon_light}
                    alt="" />

                <p>Top Trading</p>
            </div>
            <!-- <div
                class="item" class:active-nav={$component === 'document'}
                on:click={() => {
                getComponent("document");
                }}
            >
                <img src={$component === 'document' ? document_icon_active : $darkMode === 'dark' ? document_icon_dark : document_icon_light} alt="" />
                <p>Document</p>
            </div>
            <div 
                class="item" class:active-nav={$component === 'support'}
                on:click={() => {
                getComponent("support");
                }}
            >
                <img src={$component === 'support' ? support_icon_active : $darkMode === 'dark' ? support_icon_dark : support_icon_light} alt="" />
                <p>Support</p>
            </div> -->
        {/if}
    </div>

    {#if $isMobile}
        <div
            class="open-hamburger"
            class:active-hamburger={$component === 'hamburger'}>
            <div class="dark-mode">
                <p>More</p>
                <div class="btn-mode">
                    <DarkMode />
                    <button
                        on:click={() => {
                            $expanded = false;
                            $component = '';
                        }}>
                        <i class="fas fa-times" />
                    </button>
                </div>
            </div>
            <div
                class="open-hamburger-item"
                class:active-nav={$component === 'investment'}
                on:click={() => {
                    getComponent('investment');
                }}>

                <img
                    src={$component === 'investment' ? investment_icon_active : $darkMode === 'dark' ? investment_icon_dark : investment_icon_light}
                    alt="" />

                <p>Investment portfolio</p>
            </div>
            <div
                class="open-hamburger-item"
                class:active-nav={$component === 'affiliate'}
                on:click={() => {
                    getComponent('affiliate');
                }}>

                <img
                    src={$component === 'affiliate' ? affiliate_icon_active : $darkMode === 'dark' ? affiliate_icon_dark : affiliate_icon_light}
                    alt="" />

                <p>Affiliate Marketing</p>
            </div>
            <!-- <div
                class="open-hamburger-item"
                class:active-nav={$component === 'top-trading'}
                on:click={() => {
                    getComponent('top-trading');
                }}>

                <img
                    src={$component === 'top-trading' ? trading_icon_active : $darkMode === 'dark' ? trading_icon_dark : trading_icon_light}
                    alt="" />

                <p>Top Trading</p>
            </div> -->
            <!-- <div
                class="open-hamburger-item"
                class:active-nav={$component === 'line'}
                on:click={() => {
                    getComponent('line');
                }}>

                {#if $component === 'line'}
                    <img src={line_icon_active} alt="" />
                {:else}
                    <img
                        src={$darkMode === 'dark' ? line_icon_dark : line_icon_light}
                        alt="" />
                {/if}

                <p>Option</p>
            </div> -->
            <!-- <div class="open-hamburger-item" class:active-nav={$component === 'document'} on:click={() => {getComponent("document");}}>
                <img src={$component === 'document' ? document_icon_active : $darkMode === 'dark' ? document_icon_dark : document_icon_light} alt="" />
                <p>Document</p>
            </div>
            <div class="open-hamburger-item" class:active-nav={$component === 'support'}  on:click={() => {getComponent("support");}}>
                <img src={$component === 'support' ? support_icon_active : $darkMode === 'dark' ? support_icon_dark : support_icon_light} alt="" />
                <p>Support</p>
            </div> -->
        </div>
    {/if}
    <div
        class="nav-left-active"
        class:active-tab={$expanded}
        class:top-trading-size={$component === 'top-trading'}>
        <svelte:component this={renderComponent} />
    </div>
</div>

{#if $isMobile == false}
    <ChartOption />
{/if}
