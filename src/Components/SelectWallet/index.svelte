<script>
    import {
        userAddress,
        chainId,
        selectWallet,
        walletImg,
        provider,
        parent,
        userInfo,
        notification,
    } from '../../store';
    import { ethers } from 'ethers';
    import metamask from '../../Assets/images/icon/metamask-icon.svg';
    import trustwallet from '../../Assets/images/icon/trustwallet-icon.svg';
    import mathwallet from '../../Assets/images/icon/mathwallet-icon.svg';
    import tokenpocket from '../../Assets/images/icon/tokenpocket-icon.svg';
    import walletconnect from '../../Assets/images/icon/walletconnect-icon.svg';
    import binancechain from '../../Assets/images/icon/binancechainwallet-icon.svg';
    import { Bo } from '../../Services/Bo';
    let signer;
    async function getParent() {
        if ($parent) return;
        $parent = '0x56F20e6a4Fa1c92B480106914955B7877e0e33b5';
    }
    function connectWalletMetaMask() {
        try {
            getParent();
            ethereum.request({ method: 'eth_requestAccounts' }).then(() => {
                $provider = new ethers.providers.Web3Provider(
                    window.ethereum,
                    'any',
                );
                $provider.getNetwork().then(res => {
                    signer = $provider.getSigner();
                    signer.getAddress().then(_address => {
                        Bo.create({
                            userId: _address,
                            parent: $parent,
                        })
                            .then(res => {
                                $userAddress = _address;
                                Bo.getUserInfo({ userId: $userAddress })
                                    .then(res => {
                                        $selectWallet = false;
                                        $userInfo = res;
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            })
                            .catch(err => {
                                $selectWallet = false;
                                $parent =
                                    '0x56F20e6a4Fa1c92B480106914955B7877e0e33b5';
                            });
                    });
                });
            });
        } catch (error) {
            console.log('please install metaMask');
            $notification = {
                message: 'please install metaMask',
                type: 'error',
                timeout: 3000,
            };
        }
    }

    // metamask
    function getBinance() {
        try {
            getParent();
            BinanceChain.request({ method: 'eth_requestAccounts' }).then(() => {
                $provider = new ethers.providers.Web3Provider(
                    window.BinanceChain,
                    'any',
                );
                signer = $provider.getSigner();
                signer
                    .getAddress()
                    .then(async _address => {
                        $userAddress = _address;
                        $selectWallet = false;
                        Bo.create({
                            userId: $userAddress,
                            parent: $parent,
                        });
                    })
                    .catch(console.log);
            });
        } catch (error) {
            $notification = {
                message: 'Please install BinanceChain wallet!!!',
                type: 'error',
                timeout: 3000,
            };
        }
    }
    // binance

    function connectOwnerWallet() {
        try {
            signer = window.wallet;

            signer.getAddress().then(_address => {
                $userAddress = _address;
                $selectWallet = false;
            });
        } catch (error) {
            //   addNotification({
            //     text: "please install our wallet",
            //     position: "top-right",
            //     type: "danger",
            //     removeAfter: "1500",
            //   });
        }
    }
    // document.addEventListener(
    //   "click",
    //   function (e) {
    //     if (
    //       !e.target.closest(".sellect-wallet") &&
    //       !e.target.closest(".address")
    //     ) {
    //       $selectWallet = false;
    //     }
    //   },
    //   false
    // );
</script>

<style lang="scss">
    @import './sellect-wallet.scss';
</style>

<div class="select-wallet-wrap">
    <div
        class="bg-wrap"
        on:click={() => {
            $selectWallet = false;
        }} />
    <div class="sellect-wallet">
        <div class="title">
            <p>Connect to a wallet</p>
            <button
                on:click={() => {
                    $selectWallet = false;
                }}>
                <i class="fas fa-times" />
            </button>
        </div>
        <div class="wallet-item">
            <div
                class="wallet-item-item"
                on:click={() => {
                    connectWalletMetaMask();
                    $walletImg = 'metamask';
                }}>
                <p>Metamask</p>
                <img src={metamask} alt="" />
            </div>
            <div
                class="wallet-item-item"
                on:click={() => {
                    connectOwnerWallet();
                    $walletImg = 'trustwallet';
                }}>
                <p>TrustWallet</p>
                <img src={trustwallet} alt="" />
            </div>
            <div
                class="wallet-item-item"
                on:click={() => {
                    connectWalletMetaMask();
                    $walletImg = 'mathwallet';
                }}>
                <p>MathWallet</p>
                <img src={mathwallet} alt="" />
            </div>
            <div
                class="wallet-item-item"
                on:click={() => {
                    connectWalletMetaMask();
                    $walletImg = 'tokenpocket';
                }}>
                <p>TokenPocket</p>
                <img src={tokenpocket} alt="" />
            </div>
            <div
                class="wallet-item-item"
                on:click={() => {
                    connectWalletMetaMask();
                    $walletImg = 'walletconnect';
                }}>
                <p>WalletConnect</p>
                <img src={walletconnect} alt="" />
            </div>
            <div
                class="wallet-item-item"
                on:click={() => {
                    getBinance();
                    $walletImg = 'binancechain';
                }}>
                <p>Binance Chain Wallet</p>
                <img src={binancechain} alt="" />
            </div>
        </div>
    </div>
</div>
