<script>
    import { timeWait } from '../../store';
    $: time = (1 / 60) * 100 * (60 - $timeWait);
</script>

<style lang="scss">
    @import './style.scss';
</style>

<div class="line">
    <div class="line-active" style="width: {time}%;" />
</div>
