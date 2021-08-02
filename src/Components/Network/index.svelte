<script>
    import { account_option } from '../../store';
    import walletIcon from '../../Assets/images/icon/wallet-icon.svg';

    function getComponent(input) {
        if ($account_option == '') {
            $account_option = input;
        } else {
            if ($account_option == input) {
                $account_option = '';
            } else {
                $account_option = input;
            }
        }
    }
</script>

<style lang="scss">
    @import './network.scss';
</style>

<div class="network">
    <div
        class="network_active"
        on:click={() => {
            getComponent('deposit');
        }}>
        <p style="text-transform: capitalize ;">deposit</p>
        <img src={walletIcon} alt="" />
    </div>
</div>
