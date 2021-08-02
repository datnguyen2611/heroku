<script>
    import {
        isMobile,
        showNumberKeyboard,
        balanceOf,
        balance,
    } from '../../store';
    import deleteTextIcon from '../../Assets/images/icon/delete-text.svg';
    $balanceOf = '';
    let percent = 0;
    $: if ($balanceOf == 0) {
        $balanceOf = '';
    }
    function addString(number) {
        $balanceOf = $balanceOf.toString();
        $balanceOf = $balanceOf.concat('', number);
    }

    function deleteText() {
        $balanceOf = $balanceOf.slice(0, -1);
    }
    $: if (percent > 0) {
        $balanceOf = (($balance * percent) / 100).toString();
    }
</script>

<style lang="scss">
    @import './key-board-number.scss';
</style>

<div class="numberfield-wrap" class:show-numberfield={$showNumberKeyboard}>
    <div
        class="numberfield-wrap-bg-black"
        on:click={() => {
            $showNumberKeyboard = false;
        }} />
    <div class="input-wrap">
        <div class="input-value">
            <div class="input-passdata">
                <input
                    type="text"
                    class="number"
                    placeholder="0"
                    disabled
                    bind:value={$balanceOf} />
            </div>
            <div class="input-ranger">
                <input
                    type="range"
                    class="range"
                    min="0"
                    max="100"
                    bind:value={percent} />
            </div>
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
        <div class="number-table">
            <button
                on:click={() => {
                    addString('1');
                }}>
                1
            </button>
            <button
                on:click={() => {
                    addString('2');
                }}>
                2
            </button>
            <button
                on:click={() => {
                    addString('3');
                }}>
                3
            </button>
            <button
                on:click={() => {
                    addString('4');
                }}>
                4
            </button>
            <button
                on:click={() => {
                    addString('5');
                }}>
                5
            </button>
            <button
                on:click={() => {
                    addString('6');
                }}>
                6
            </button>
            <button
                on:click={() => {
                    addString('7');
                }}>
                7
            </button>
            <button
                on:click={() => {
                    addString('8');
                }}>
                8
            </button>
            <button
                on:click={() => {
                    addString('9');
                }}>
                9
            </button>
            {#if $balanceOf.includes('.')}
                <button>.</button>
            {:else}
                <button
                    on:click={() => {
                        addString('.');
                    }}>
                    .
                </button>
            {/if}
            <button
                on:click={() => {
                    addString('0');
                }}>
                0
            </button>
            <button
                on:click={() => {
                    deleteText();
                }}
                class="delete">
                <img src={deleteTextIcon} alt="" />
            </button>
        </div>
    </div>
</div>
