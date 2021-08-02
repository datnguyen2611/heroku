<script>
    import { notification } from '../../store';
    import { fade } from 'svelte/transition';
    $: $notification;
    $: if ($notification.timeout) {
        setTimeout(() => {
            $notification = {
                message: '',
                type: '',
                timeout: 0,
            };
        }, $notification.timeout);
    }
    function closeNotification() {
        $notification = {
            message: '',
            type: '',
            timeout: 3000,
        };
    }
</script>

<style lang="scss">
    @import './style.scss';
</style>

{#if $notification.message}
    <div class="notification {$notification.type}" transition:fade>
        <div class="icon">
            {#if $notification.type === 'success'}
                <i class="far fa-check-circle" />
            {:else if $notification.type === 'error'}
                <i class="fas fa-exclamation-circle" />
            {:else}
                <i class="fas fa-info-circle" />
            {/if}
            <p>{$notification.message}</p>
        </div>
        <div class="text">

            <button on:click={closeNotification}>
                <i class="fas fa-times" />
            </button>
        </div>
    </div>
{/if}
