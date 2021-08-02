<script>
    import { expanded, isMobile, component } from '../../store';
    let itemFaq = [
        {
            id: 1,
            question: 'What is Bo Finance?',
            content:
                'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
            toggle: false,
        },
        {
            id: 2,
            question: 'What is Bo Finance?',
            content:
                'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
            toggle: false,
        },
        {
            id: 3,
            question: 'What is Bo Finance?',
            content:
                'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
            toggle: false,
        },
    ];
</script>

<style lang="scss">
    @import './support.scss';
</style>

<div class="support">
    <div class="title">
        <p>Support</p>
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

    <div class="btn-link">

        <a href="/">
            <img src="@Assets/images/icon/twitter-icon.svg" alt="" />
            Twitter
        </a>
        <a href="/">
            <img src="@Assets/images/icon/twitter-icon.svg" alt="" />
            Telegram
        </a>
    </div>

    <div class="support-main">
        <div class="title">FAQ?</div>
        <div class="search-input">
            <input type="search" placeholder="Search for keywords..." />
        </div>
        <div class="list-faq">
            {#each itemFaq as { id, question, content, toggle }, i}
                <div class="list-faq-item">
                    <div
                        class="list-faq-item-question"
                        on:click={() => {
                            toggle = !toggle;
                        }}>
                        <p>{question}</p>
                        <img
                            src="../../Assets/images/icon/{toggle ? 'up' : 'down'}-icon.svg"
                            alt="" />
                    </div>
                    <div class="content" class:active-content={toggle}>
                        <p>{content}</p>
                    </div>
                </div>
            {/each}

        </div>
    </div>
</div>
