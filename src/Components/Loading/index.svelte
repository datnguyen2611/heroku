<script>
    import LoadingImg from '../../Assets/images/loading.gif';
    import { isLoading, darkMode } from '../../store';
</script>

<style lang="scss">
    @import '../../Assets/stylesheets/variable.scss';
    .loading {
        position: fixed;
        width: 100vw;
        height: 100vh;
        left: 0;
        top: 0;
        z-index: 10000;
        display: grid;
        place-items: center;
        background-color: var(--background-10);
    }
    img {
        max-width: 200px;
    }
</style>

{#if $isLoading}
    <div class="loading">
        <img src={LoadingImg} alt="" />
    </div>
{/if}
