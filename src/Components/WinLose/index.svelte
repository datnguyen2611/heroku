<script>
    import { betResult, selectedCurrency } from '../../store';
    import close_icon from '../../Assets/images/icon/close.svg';
</script>

<style lang="scss">
    @import './style.scss';
</style>

<div
    class="notice_container"
    class:win={$betResult > 0}
    class:lose={$betResult < 0}
    class:hide={$betResult === 0}>
    <div
        class="close_btn"
        on:click={() => {
            $betResult = 0;
        }}>
        <img src={close_icon} alt="" />
    </div>
    <div class="body">
        <p class="title">
            {$betResult > 0 ? 'You have received the reward' : 'Good luck next time'}
        </p>
        <p class="amount">
            {$betResult > 0 ? `+ ${$betResult}` : $betResult}
            {$selectedCurrency}
        </p>
    </div>
    <div class="footer">
        <p class="result">{$betResult > 0 ? 'You Win' : 'You Lose'}</p>
    </div>
</div>
