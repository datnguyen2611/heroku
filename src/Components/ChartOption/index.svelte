<script>
    import {
        component,
        expanded,
        darkMode,
        isMobile,
        chartType,
        period,
    } from '../../store';
    import candle_icon_dark from '../../Assets/images/icon/candle-icon-dark.svg';
    import candle_icon_light from '../../Assets/images/icon/candle-icon-light.svg';
    import clock_icon_dark from '../../Assets/images/icon/clock-icon-dark.svg';
    import clock_icon_light from '../../Assets/images/icon/clock-icon-light.svg';
    import area_icon_dark from '../../Assets/images/icon/area-icon-dark.svg';
    import area_icon_light from '../../Assets/images/icon/area-icon-light.svg';
    import compass_icon_dark from '../../Assets/images/icon/compass-icon-dark.svg';
    import compass_icon_light from '../../Assets/images/icon/compass-icon-light.svg';

    let option = '',
        chart_time = '1s';

    document.addEventListener(
        'click',
        function(event) {
            if (!event.target.closest('.selection-item')) {
                option = '';
            }
        },
        false,
    );
</script>

<style lang="scss">
    @import './style.scss';
</style>

<div class="chart-selection">
    <div
        class="selection-item"
        on:click={() => {
            if (option == 'type') return (option = '');
            option = 'type';
        }}>
        <img
            src={$darkMode === 'dark' ? candle_icon_dark : candle_icon_light}
            alt="" />
    </div>
    <div
        class="selection-item"
        on:click={() => {
            if (option == 'time') return (option = '');
            option = 'time';
        }}>
        <!-- <img
            src={$darkMode === 'dark' ? clock_icon_dark : clock_icon_light}
            alt="" /> -->
        <p class="time-label">{$period.label}</p>
    </div>
    <div
        class="selection-item"
        id="indicators"
        on:click={() => {
            if (document.querySelector('.highcharts-popup')?.style.display == 'block') document.querySelector('.highcharts-popup').style.display = 'none';
            else {
                document.querySelector('.highcharts-indicators').click();
                option = '';
            }
        }}>
        <img
            src={$darkMode === 'dark' ? compass_icon_dark : compass_icon_light}
            alt="" />
    </div>

    <div class="chart_list type_list" class:hide={option !== 'type'}>
        <div class="close_btn">
            <i
                class="fas fa-times close_icon"
                on:click={() => {
                    option = '';
                }} />
        </div>
        <p class="title">Type</p>
        <div
            class="option"
            class:option_active={$chartType === 'area'}
            on:click={() => {
                $chartType = 'area';
            }}>
            <img
                src={$darkMode === 'dark' ? area_icon_dark : area_icon_light}
                alt="" />
            <p>Area</p>
        </div>
        <div
            class="option"
            class:option_active={$chartType === 'candle'}
            on:click={() => {
                $chartType = 'candle';
            }}>
            <img
                src={$darkMode === 'dark' ? candle_icon_dark : candle_icon_light}
                alt="" />
            <p>Candlestick</p>
        </div>
    </div>
    <div class="chart_list time_list" class:hide={option !== 'time'}>
        <div class="close_btn">
            <i class="fas fa-times close_icon" />
        </div>
        <p class="title">Time</p>
        {#if $chartType === 'area'}
            <div
                class="option"
                class:option_active={$period.label === '1s'}
                on:click={() => {
                    $period = { label: '1s', value: 1000 };
                    window.location.reload();
                }}>
                <p>1 second</p>
            </div>
        {/if}
        <div
            class="option"
            class:option_active={$period.label === '5s'}
            on:click={() => {
                $period = { label: '5s', value: 5000 };
                window.location.reload();
            }}>
            <p>5 seconds</p>
        </div>
        <div
            class="option"
            class:option_active={$period.label === '15s'}
            on:click={() => {
                $period = { label: '15s', value: 15000 };
                window.location.reload();
            }}>
            <p>15 seconds</p>
        </div>
        <div
            class="option"
            class:option_active={$period.label === '30s'}
            on:click={() => {
                $period = { label: '30s', value: 30000 };
                window.location.reload();
            }}>
            <p>30 seconds</p>
        </div>
        <div
            class="option"
            class:option_active={$period.label === '1m'}
            on:click={() => {
                $period = { label: '1m', value: 60000 };
                window.location.reload();
            }}>
            <p>1 minute</p>
        </div>
        <div
            class="option"
            class:option_active={$period.label === '5m'}
            on:click={() => {
                $period = { label: '5m', value: 300000 };
                window.location.reload();
            }}>
            <p>5 minutes</p>
        </div>
        <div
            class="option"
            class:option_active={$period.label === '15m'}
            on:click={() => {
                $period = { label: '15m', value: 900000 };
                window.location.reload();
            }}>
            <p>15 minutes</p>
        </div>
        <div
            class="option"
            class:option_active={$period.label === '30m'}
            on:click={() => {
                $period = { label: '30m', value: 1800000 };
                window.location.reload();
            }}>
            <p>30 minutes</p>
        </div>
        <div
            class="option"
            class:option_active={$period.label === '1h'}
            on:click={() => {
                $period = { label: '1h', value: 3600000 };
                window.location.reload();
            }}>
            <p>1 hour</p>
        </div>
        <!-- <div
            class="option"
            class:option_active={$period.label === '3h'}
            on:click={() => {
                $period = { label: '3h', value: 3 * 60 * 60 * 1000 };
                window.location.reload();
            }}>
            <p>3 hours</p>
        </div> -->
        <div
            class="option"
            class:option_active={$period.label === '1d'}
            on:click={() => {
                $period = { label: '1d', value: 24 * 60 * 60 * 1000 };
                window.location.reload();
            }}>
            <p>1 day</p>
        </div>
        <div
            class="option"
            class:option_active={$period.label === '1M'}
            on:click={() => {
                $period = { label: '1M', value: 30 * 24 * 60 * 60 * 1000 };
                window.location.reload();
            }}>
            <p>30 days</p>
        </div>
    </div>
</div>
