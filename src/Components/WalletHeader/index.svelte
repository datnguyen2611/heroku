<script>
    import {
        userAddress,
        openAddressProfile,
        selectWallet,
        chainId,
        walletImg,
        provider,
        account_option,
        isMobile,
    } from '../../store';
    import { ethers } from 'ethers';
    import AccountOption from '@Components/AccountOption';
    import Withdraw from '@Components/Withdraw';
    import Deposit from '@Components/Deposit';
    import user_icon from '../../Assets/images/icon/user.svg';
    import down_icon from '../../Assets/images/icon/down_icon.svg';

    import { onMount } from 'svelte';
    let signer;
    let renderComponent = '';

    $: switch ($account_option) {
        case 'option':
            renderComponent = AccountOption;
            break;
        case 'withdraw':
            renderComponent = Withdraw;
            break;
        case 'deposit':
            renderComponent = Deposit;
            break;

        default:
            renderComponent = '';
            break;
    }

    document.addEventListener(
        'click',
        function(event) {
            if (
                !event.target.closest('.address') &&
                !event.target.closest('.account') &&
                !event.target.closest('.network_active')
            ) {
                $account_option = '';
            }
        },
        false,
    );

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
    // $: if (window.ethereum) {
    //     $provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    //     $provider.on('network', (newNetwork, oldNetwork) => {
    //         if (oldNetwork) {
    //             window.location.reload();
    //         }
    //     });
    // }

    // $: window.ethereum &&
    //     window.ethereum.on('chainChanged', id => {
    //         $provider.getNetwork().then(res => {
    //             if (res.chainId != 56 && $userAddress) {
    //                 setTimeout(() => {
    //                     userAddress.set('');
    //                     window.location.reload();
    //                 }, 2000);
    //             } else if (res.chainId != 56 && $userAddress == '') {
    //                 window.location.reload();
    //                 userAddress.set('');
    //             }
    //         });
    //     });

    // async function getChainID() {
    //     let res = await $provider.getNetwork();
    //     $chainId = res.chainId;
    // }
    // $: window.ethereum &&
    //     window.ethereum.on('accountsChanged', function(accounts) {
    //         signer = $provider.getSigner();
    //         signer.getAddress().then(_address => {
    //             userAddress.set(_address);
    //             location.reload();
    //         });
    //     });

    // async function checkUnlockMetamask() {
    //     await window.ethereum._metamask.isUnlocked().then(result => {
    //         if (result == false) {
    //             userAddress.set('');
    //         }
    //     });
    // }
    // onMount(async () => {
    //     await getChainID();
    //     // await checkUnlockMetamask();
    // });
</script>

<style lang="scss">
    @import './header.scss';
</style>

<div class="connect-wallet">
    {#if !$userAddress}
        <button
            class="address"
            on:click={() => {
                $selectWallet = true;
            }}>
            Connect Wallet
        </button>
    {:else}{/if}

    {#if $userAddress}
        <div
            class="address"
            on:click={() => {
                getComponent('option');
            }}>
            {$userAddress.substr(0, 4) + '...' + $userAddress.substr(-4, 4)}
        </div>
        <div class="account_option">
            <svelte:component this={renderComponent} />
        </div>
    {/if}
</div>
