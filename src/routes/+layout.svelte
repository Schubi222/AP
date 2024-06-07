<script lang="ts">
	import { theme } from '$lib/stores/settings.js';
	import '$lib/styles/global.scss';
	import '$lib/styles/variables.scss';
	import '$lib/styles/utils.scss';
</script>

<div class={`content  ${$theme === 'light' ? 'light' : 'dark'}`}>
	<slot />
</div>

<style lang="scss">
	.content {
		min-height: 100vh;
		width: 100vw;
		background: var(--background);
		color: var(--text-color);
		padding-top: 20px;
		box-sizing: border-box;
	}
</style>
