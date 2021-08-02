<script>
    import {
        isMobile,
        component,
        userAddress,
        selectWallet,
        darkMode,
        lineBB,
        lineEMA,
        expanded,
    } from '../../store';
</script>

<style lang="scss">
    @import './line.scss';
</style>

<div class="line-wrap">
    <div class="title">
        <button
            on:click={() => {
                $component = 'hamburger';
                $expanded = false;
            }}>
            {#if $isMobile}
                <i class="fas fa-chevron-left" />
            {:else}
                <i class="fas fa-times" />
            {/if}
        </button>
        <p>Indicators</p>

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
        <div class="line-wrap-item-wrap">
            {#if $isMobile}
                <div
                    class="item"
                    on:click={() => {
                        $lineBB = !$lineBB;
                        $component = '';
                        $expanded = false;
                    }}>
                    <div class="item-content">
                        <img
                            src={import(`../../Assets/images/icon/bb-icon-${$darkMode}.svg`)}
                            alt="" />
                        <p>Bollinger bands</p>
                    </div>
                    <div class="status">
                        <img
                            src={import(`../../Assets/images/icon/eye-${$lineBB ? 'open' : 'close'}-icon.svg`)}
                            alt="" />
                    </div>
                </div>
                <div
                    class="item"
                    on:click={() => {
                        $lineEMA = !$lineEMA;
                        $component = '';
                        $expanded = false;
                    }}>
                    <div class="item-content">
                        <img
                            src="../../Assets/images/icon/ema-icon-{$darkMode}.svg"
                            alt="" />
                        <p>EMA indicator</p>
                    </div>
                    <div class="status">
                        <img
                            src={import(`../../Assets/images/icon/eye-${$lineEMA ? 'open' : 'close'}-icon.svg`)}
                            alt="" />
                    </div>
                </div>
            {:else}
                <div
                    class="item"
                    on:click={() => {
                        $lineBB = !$lineBB;
                    }}>
                    <div class="item-content">
                        <img
                            src={import(`../../Assets/images/icon/bb-icon-${$darkMode}.svg`)}
                            alt="" />
                        <p>Bollinger bands</p>
                    </div>
                    <div class="status">
                        <img
                            src={import(`../../Assets/images/icon/eye-${$lineBB ? 'open' : 'close'}-icon.svg`)}
                            alt="" />
                    </div>
                </div>
                <div
                    class="item"
                    on:click={() => {
                        $lineEMA = !$lineEMA;
                    }}>
                    <div class="item-content">
                        <img
                            src={import(`../../Assets/images/icon/ema-icon-${$darkMode}.svg`)}
                            alt="" />
                        <p>EMA indicator</p>
                    </div>
                    <div class="status">
                        <img
                            src={import(`../../Assets/images/icon/eye-${$lineEMA ? 'open' : 'close'}-icon.svg`)}
                            alt="" />
                    </div>
                </div>
            {/if}

        </div>
    {/if}
</div>
