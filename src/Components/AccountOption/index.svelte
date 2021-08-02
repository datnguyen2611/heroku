<script>
    import add_money from '../../Assets/images/icon/add.svg';
    import exchange from '../../Assets/images/icon/exchange.svg';
    import setting from '../../Assets/images/icon/setting.svg';
    import logout from '../../Assets/images/icon/logout.svg';
    import search_icon_dark from '../../Assets/images/icon/search-icon-dark.svg';
    import { account_option, userAddress } from '../../store';
</script>

<style lang="scss">
    @import './style.scss';
</style>

<div class="account">
    <p class="title">My account</p>
    <div class="list">
        <div
            class="option"
            on:click={() => {
                $account_option = 'deposit';
            }}>
            <img src={add_money} alt="" />
            <p>Deposit</p>
        </div>
        <div
            class="option"
            on:click={() => {
                $account_option = 'withdraw';
            }}>
            <img src={exchange} alt="" />
            <p>Withdraw</p>
        </div>
        <div class="option">
            <img src={search_icon_dark} alt="" />
            <a
                href="https://bscscan.com/address/{$userAddress}"
                target="_blank"
                style="text-decoration: none;">
                View on Scan
            </a>
        </div>
        <div
            class="option"
            on:click={() => {
                $userAddress = '';
            }}>
            <img src={logout} alt="" />
            <p>Log out</p>
        </div>
    </div>
</div>
