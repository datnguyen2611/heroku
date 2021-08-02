<script>
    import { ethers } from 'ethers';
    import { onMount } from 'svelte';
    import back_icon from '../../Assets/images/icon/back.svg';
    import coin_icon from '../../Assets/images/icon/coin.svg';
    import bnb_icon from '../../Assets/images/logo/bnb-icon.svg';
    import {
        account_option,
        currencyAddress,
        addressBNB,
        abi_contract,
        exchange,
        selectedCurrency,
        provider,
        userAddress,
        parent,
        allCurrency,
        userInfo,
        network,
    } from '../../store';
    import { Bo } from '../../Services/Bo';
    $provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    let signer = $provider.getSigner();
    let contract = new ethers.Contract($addressBNB, $abi_contract, $provider);
    let contractSigner = new ethers.Contract(
        $addressBNB,
        $abi_contract,
        signer,
    );
    async function getParent() {
        $parent = await contract.parent($userAddress);
        if ($parent == '0x0000000000000000000000000000000000000000') {
            if ($parent) return;
            $parent = '0x56F20e6a4Fa1c92B480106914955B7877e0e33b5';
        }
    }

    let tokenAddress = '',
        tokenArr = [],
        amountInput = 0,
        balance = 0;
    function getByValue(map, searchValue) {
        for (let [key, value] of map.entries()) {
            if (value === searchValue) return key;
        }
    }
    function getBalance() {
        balance =
            $userInfo.balance[getByValue($allCurrency, $selectedCurrency)];
    }
    $: $selectedCurrency && getBalance();
    onMount(async () => {
        getParent();
    });

    $network = $network;
    async function selectBinance() {
        ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: '0x38',
                    chainName: 'Binance Smart Chain',
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    nativeCurrency: {
                        name: 'BNB',
                        symbol: 'BNB',
                        decimals: 18,
                    },
                    blockExplorerUrls: ['https://bscscan.com'],
                },
            ],
        });
    }
    async function selectPolygon() {
        ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId: '0x89',
                    chainName: 'Matic Mainnet',
                    rpcUrls: ['https://rpc-mainnet.matic.network'],
                    nativeCurrency: {
                        name: 'MATIC',
                        symbol: 'MATIC',
                        decimals: 18,
                    },
                    blockExplorerUrls: ['https://explorer.matic.network/'],
                },
            ],
        });
    }
    async function selectEthereum() {
        ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }],
        });
    }
    $: switch ($network) {
        case 'ethereum':
            selectEthereum();
            tokenArr = $currencyAddress[0];
            tokenArr = tokenArr;
            $selectedCurrency = tokenArr[0].symbol;
            tokenAddress = tokenArr[0].address;
            break;
        case 'smartchain':
            selectBinance();
            tokenArr = $currencyAddress[1];
            tokenArr = tokenArr;
            $selectedCurrency = tokenArr[0].symbol;
            tokenAddress = tokenArr[0].address;
            break;
        case 'polygon':
            selectPolygon();
            tokenArr = $currencyAddress[2];
            tokenArr = tokenArr;
            $selectedCurrency = tokenArr[0].symbol;
            tokenAddress = tokenArr[0].address;
            break;
    }
    async function deposit() {
        if (tokenArr[0].symbol == $selectedCurrency) {
            let res = await contractSigner.deposit($parent, {
                value: ethers.utils.parseEther(amountInput.toString()),
                gasLimit: 3000000,
            });
        } else {
            let res = await contractSigner.depositToken(
                $parent,
                tokenAddress,
                amountInput * 10 ** 18,
            );
        }
    }
</script>

<style lang="scss">
    @import './style.scss';
</style>

<div class="account">
    <div class="title">
        <img
            src={back_icon}
            alt=""
            on:click={() => {
                $account_option = 'option';
            }} />
        <p>Deposit</p>
    </div>
    <div class="select">
        <p class="header">Select Network</p>
        <div class="item">
            <div class="option">
                <input
                    type="radio"
                    id="Ethereum"
                    name="select_network"
                    checked={$network === 'ethereum'}
                    value="Ethereum"
                    on:change={() => {
                        $network = 'ethereum';
                    }} />
                <label for="Ethereum">Ethereum</label>
            </div>
            <img src={coin_icon} alt="" />
        </div>
        <div class="item">
            <div class="option">
                <input
                    type="radio"
                    id="Polygon"
                    name="select_network"
                    checked={$network === 'polygon'}
                    value="Polygon"
                    on:change={() => {
                        $network = 'polygon';
                    }} />
                <label for="Polygon">Polygon</label>
            </div>
            <img src={coin_icon} alt="" />
        </div>
        <div class="item">
            <div class="option">
                <input
                    type="radio"
                    id="Smartchain"
                    name="select_network"
                    checked={$network === 'smartchain'}
                    value="Smartchain"
                    on:change={() => {
                        $network = 'smartchain';
                    }} />
                <label for="Smartchain">Smartchain</label>
            </div>
            <img src={coin_icon} alt="" />
        </div>
    </div>

    <div class="select">
        <p class="header">Select Token</p>

        {#each tokenArr as { symbol, address }}
            <div class="item">
                <div class="option">
                    <input
                        type="radio"
                        id={symbol}
                        name="select_token"
                        checked={$selectedCurrency === symbol}
                        value={symbol}
                        on:change={() => {
                            $selectedCurrency = symbol;
                            tokenAddress = address;
                        }} />
                    <label for={symbol}>{symbol}</label>
                </div>
                <img src={coin_icon} alt="" />
            </div>
        {/each}

    </div>

    <div class="value">
        <p class="text">Enter the amount of deposit</p>
        <div class="balance">
            <p class="content">Balance:</p>
            <p class="balance_amount">{balance}</p>
            <img src={bnb_icon} alt="" />
            <p class="token">{$selectedCurrency}</p>
        </div>
    </div>

    <div class="form">
        <input type="number" class="amount_input" bind:value={amountInput} />
        <button class="confirm_btn" on:click={deposit}>Confirm</button>
    </div>
</div>
