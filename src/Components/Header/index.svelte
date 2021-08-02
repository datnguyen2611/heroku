<script>
    import { isMobile, darkMode } from '../../store';
    import HeaderList from '@Components/HeaderList';
    import WalletHeader from '@Components/WalletHeader';
    import DarkMode from '@Components/DarkMode';
    import CoinType from '@Components/CoinType';
    import Network from '@Components/Network';
    import WinLose from '@Components/WinLose';
    import logo from '../../Assets/images/logo/logo.svg';
    import logo_dark from '../../Assets/images/logo/logo-dark.svg';
</script>

<style lang="scss">
    @import './header.scss';
</style>

{#if $isMobile == false}

    <div class="header-wrap">
        <div class="logo">
            <img src={$darkMode === 'light' ? logo : logo_dark} alt="" />
        </div>
        <CoinType />
        <HeaderList />

        <div class="right-header">
            <Network />
            <WalletHeader />
            <DarkMode />
        </div>
    </div>
{:else}
    <div class="header-wrap">
        <div class="logo">
            <img src={$darkMode === 'light' ? logo : logo_dark} alt="" />
        </div>
        <div class="right-header">
            <Network />
            <WalletHeader />
        </div>
    </div>
    <CoinType />
{/if}
