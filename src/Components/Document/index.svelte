<script>
    import { expanded, component, isMobile, userAddress } from '../../store';
    import AvatarImage from '../../Assets/images/avt-img.png';
    import documentImg from '../../Assets/images/document-img.png';
</script>

<style lang="scss">
    @import './document.scss';
</style>

<div class="document">
    <div class="title">
        <p>Document</p>
        {#if $isMobile}
            <button
                on:click={() => {
                    $expanded = false;
                    $component = 'hamburger';
                }}>
                <i class="fas fa-chevron-left" />
            </button>
        {:else}
            <button
                on:click={() => {
                    $expanded = false;
                    $component = '';
                }}>
                <i class="fas fa-times" />
            </button>
        {/if}
    </div>
    <div class="document-wrap">
        <div class="document-wrap-item">
            <div class="document-wrap-item-title">
                <img src={AvatarImage} alt="" />
                <div class="text">
                    <h3>Transaction history</h3>
                    <p>Today at 08:53</p>
                </div>
            </div>
            <div class="document-wrap-item-content">
                <p>
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor
                    do amet sint. Velit officia consequat duis enim velit
                    mollit.
                </p>
            </div>
            <div class="document-wrap-item-img">
                <img src={documentImg} alt="" />
            </div>
        </div>
        <div class="document-wrap-item">
            <div class="document-wrap-item-title">
                <img src={AvatarImage} alt="" />
                <div class="text">
                    <h3>Transaction history</h3>
                    <p>Today at 08:53</p>
                </div>
            </div>
            <div class="document-wrap-item-content">
                <p>
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor
                    do amet sint. Velit officia consequat duis enim velit
                    mollit.
                </p>
            </div>
            <div class="document-wrap-item-img">
                <img src={documentImg} alt="" />
            </div>
        </div>
    </div>
</div>
