<script>
    import {
        expanded,
        component,
        isMobile,
        addressBNB,
        abi_contract,
        userAddress,
        selectWallet,
        provider,
        userInfo,
        selectedCurrency,
        exchange,
        network,
    } from '../../store';
    import ProfitWin from '@Components/ProfitWin';
    import { ethers } from 'ethers';
    import { onMount } from 'svelte';
    import { Bo } from '../../Services/Bo';

    let signer, contract;

    // contract = new ethers.Contract($addressBNB, $abi_contract, $provider);
    // $: if (window.ethereum) {
    //     signer = $provider.getSigner();
    //     contract = new ethers.Contract($addressBNB, $abi_contract, signer);
    // }
    // export let userHis = [];
    // let x, y;
    // async function postData(url = '') {
    //     fetch(url)
    //         .then(response => response.json())
    //         .then(data => (x = data));
    // }
    // onMount(async () => {
    //     await postData(`https://api.bo.finance/user/${$userAddress}`);
    // });
    // $: x && (userHis = x) && getData();
    // function getData() {
    //     for (let i in x.round) {
    //         if (x.round != [null]) return;
    //         let item = {
    //             id: i,
    //             txnHash: x.round[i].round,
    //             status:
    //                 x.round[i].round == x.user.bet[i].position ? 'win' : 'lose',
    //             coinType: 'BNB',
    //             yourPrediction: x.user.bet[i].position ? 'bull' : 'bear',
    //             yourPosition: x.user.bet[i].value,
    //             profit: '-',
    //             roundPrice: x.round[i].price,
    //             roundPredic: '-',
    //             roundPredicType: x.round[i].round ? 'bull' : 'bear',
    //             lockedPrice: '-',
    //             upPercen: '-',
    //             upPrice: '-',
    //             downPercen: '-',
    //             downPrice: '-',
    //             openingBlock: x.round[i].block - 20,
    //             closeBlock: x.round[i].block,
    //         };
    //         data.unshift(item);
    //         data = data;
    //     }
    // }

    let filter = ['withdraw', 'deposit', 'winner', 'referral'];
    let userEvent = 'withdraw';
    let data;
    let eventHistory;

    if ($userAddress) {
        eventHistory = $userInfo.history?.filter(item =>
            filter.includes(item.event),
        );
        data = eventHistory?.filter(item => {
            return item.event === userEvent;
        });
    }
    const handleUserEventSelected = userEventSelected => {
        userEvent = userEventSelected;
        data = eventHistory.filter(item => {
            return item.event === userEventSelected;
        });
    };

    // async function getTotalHistory(unit){
    //      totalCommision =  Number(await contract.betValue().totalBetProfitValue)?Number(await contract.betValue().totalBetProfitValue) * 10**18: 0;
    //      totalWin = (Number(await contract.betCount($userAddress).totalBetWin))?Number(await contract.betCount($userAddress).totalBetWin): 0
    // }

    // $:getTotalHistory('0x9fbC43c5CD22C8E1Ed181b4efB0648ca955992bA')
</script>

<style lang="scss">
    @import './profit.scss';
</style>

<div class="investment">
    <div class="title">
        <p>Profit Statistics</p>
        <!-- {#if $isMobile == false} -->
        <button
            on:click={() => {
                $expanded = false;
                $component = '';
            }}>
            <i class="fas fa-times" />
        </button>
        <!-- {/if} -->
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
        <div class="btn-event">
            <button
                class:active={userEvent === 'withdraw'}
                on:click={() => handleUserEventSelected('withdraw')}>
                Withdraw
            </button>
            <button
                class:active={userEvent === 'deposit'}
                on:click={() => handleUserEventSelected('deposit')}>
                Deposit
            </button>
            <button
                class:active={userEvent === 'winner'}
                on:click={() => handleUserEventSelected('winner')}>
                Winner
            </button>
            <button
                class:active={userEvent === 'referral'}
                on:click={() => handleUserEventSelected('referral')}>
                Referral
            </button>
        </div>
        <div class="list-history">
            {#each data as newData}
                <ProfitWin getArray={newData} />
            {/each}
        </div>
        <!-- <div class="main-history">
            <h2>Your History</h2>
            <div class="item">
                <p>Total commision</p>
                <p>{totalCommision} {selectedCurrency}</p>
            </div>
            <div class="item">
                <p>Total win</p>
                <p>{totalWin}</p>
            </div>
        </div>
        <div class="collect-btn" on:click={withdraw}>Collect</div> -->
    {/if}
</div>
