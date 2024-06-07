<script lang="ts">
	import { Jellyfish } from 'svelte-loading-spinners';
	export let text = 'Loading...';
</script>

<div class="Loading-Wrapper">
	<Jellyfish size="80" color="#27013F" unit="px" duration="1s" />
	<span>{text}</span>
</div>

<style lang="scss">
	.Loading-Wrapper {
		padding: 50px;
		display: flex;
		flex-direction: column;
		align-items: center;
		& > span {
			padding-top: 10px;
		}
	}
</style>
