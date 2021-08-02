<script>
    import bear_icon from '../../Assets/images/icon/bear-icon.svg';
    let showStory = false;
    export let getArray;
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
</script>

<style lang="scss">
    @import './profit-recept.scss';
</style>

<div class="list-winner">
    <div
        class="your-result"
        on:click={() => {
            showStory = !showStory;
        }}>
        <div class="left">
            <p>{getArray.event.toUpperCase()}</p>

        </div>
        <div class="right {getArray.status}">
            <!-- <button>{getArray.yourPrediction}</button> -->
            <div class="right-result">
                <!-- <div class="sub">Your Result</div> -->
                <p>
                    <!-- {#if getArray.status == 'win'}
                        + {getArray.yourPosition + getArray.profit}
                    {:else}- {getArray.yourPosition}{/if} -->
                    {getArray.value.toFixed(2)} {currency[getArray.currency]}
                </p>
                <p>{new Date(getArray.timestamp).toUTCString()}</p>
            </div>
            <!-- <i class="fas fa-caret-down" /> -->
        </div>
    </div>
    <!-- <div class="your-story" class:active-story={showStory}>
        <div class="your-story-recept">
            <div class="title">
                <p>Your History</p>
                <div class="icon">
                    <p class="text-{getArray.status}">{getArray.status}</p>
                    <img
                        src="../assets/images/icon/flag-icon-{getArray.status}.svg"
                        alt="" />
                </div>
            </div>
            <div class="item">
                <div class="your-redection">
                    <div class="your-redection-item">
                        <p>Your direction</p>
                        <button class={getArray.yourPrediction}>
                            <img
                                src="../assets/images/icon/{getArray.yourPrediction}-icon.svg"
                                alt="" />
                            <span>{getArray.yourPrediction}</span>
                        </button>
                    </div>
                    <div class="your-redection-item">
                        <p>Your position</p>
                        <p>{getArray.yourPosition}{getArray.yourPosition}</p>
                    </div>
                    <div class="your-redection-item">
                        <p>Your result</p>
                        <p class="text-{getArray.status}">
                            +0.025 {getArray.coinType}
                        </p>
                    </div>
                    <div class="text-right">~$9.272</div>
                </div>
            </div>
        </div>
        <div class="round-recept">
            <div class="title">
                <p>Round History</p>

            </div>
            <div class="item">
                <div class="your-redection">
                    <div class="your-redection-item">
                        <p class="pink-color">$370.258</p>

                        <button class={getArray.roundPredicType}>
                            <img src={bear_icon} alt="" />

                            <span>-$0.886</span>
                        </button>
                    </div>
                    <div class="your-redection-item">
                        <p>Locked Price:</p>
                        <p>$371.144</p>
                    </div>
                    <div class="text-right">108.591 {getArray.coinType}</div>
                    <div class="your-redection-item">
                        <p>Up</p>
                        <p>4.95%/21.947 {getArray.coinType}</p>
                    </div>
                    <div class="your-redection-item">
                        <p>Down</p>
                        <p>1.25%/86.644 {getArray.coinType}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="opening-block">
            <div class="opening-block-item">
                <p>Opening Block</p>
                <p>8165158</p>
            </div>
            <div class="opening-block-item">
                <p>Closing Block</p>
                <p>8165261</p>
            </div>
        </div>
    </div> -->

</div>
