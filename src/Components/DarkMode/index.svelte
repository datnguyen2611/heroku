<script>
    import { darkMode } from '../../store';
    import dark_mode from '../../Assets/images/icon/dark-mode.svg';
    import light_mode from '../../Assets/images/icon/light-mode.svg';
    let mode = false;
    function toggleDarkMode() {
        mode = !mode;
        if (mode) {
            $darkMode = 'dark';
        } else {
            $darkMode = 'dark'; // TODO: disable dark mode
        }
    }
    $: if (mode == false && $darkMode == 'dark') {
        mode = true;
    }
    $: window.document.body.setAttribute('mode', $darkMode);
</script>

<style lang="scss">
    @import './header.scss';
</style>

<div class="btn-dark-mode" on:click={toggleDarkMode}>

    <img src={$darkMode === 'dark' ? dark_mode : light_mode} alt="" />

</div>
