<script>
    import { userAddress, openAddressProfile, notification } from '../../store';
    import share_icon from '../../Assets/images/icon/share-violet-icon.svg';
    import close_icon from '../../Assets/images/icon/close-icon.svg';
    import copy_icon from '../../Assets/images/icon/copy-icon.svg';

    const copyTextToClipboard = async text => {
        await navigator.clipboard.writeText(text);
        $notification = {
            message: 'Copied to clipboard!',
            type: 'info',
            timeout: 3000,
        };
    };
</script>

<style type="scss">
    @import './style.scss';
</style>

<div class="address-profile" class:active={$openAddressProfile}>
    <div
        class="black-bg"
        on:click={() => {
            $openAddressProfile = false;
        }} />
    <div class="profile">
        <div class="content">
            <p>Your wallet</p>
            <img
                src={close_icon}
                alt=""
                on:click={() => {
                    $openAddressProfile = false;
                }} />
        </div>
        <div class="address">
            <p>{$userAddress}</p>
        </div>
        <div class="link">
            <a
                href="https://bscscan.com/address/{$userAddress}"
                target="_blank"
                style="text-decoration: none;">
                <button>

                    <p>View on BscScan</p>
                    <img src={share_icon} alt="" />
                </button>
            </a>

            <button
                on:click={() => {
                    copyTextToClipboard($userAddress);
                }}>
                <p>Copy Address</p>
                <img src={copy_icon} alt="" />
            </button>
        </div>

        <div
            class="btn-logout"
            on:click={() => {
                $userAddress = '';
                $openAddressProfile = false;
            }}>
            <button>Logout</button>
        </div>
    </div>
</div>
