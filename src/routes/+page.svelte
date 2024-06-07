<script lang="ts">
	import { onMount } from 'svelte';
	import { Line } from 'svelte-chartjs';
	import Loading from '$lib/components/Loading.svelte';
	import type { FermentationDataResponse } from '$lib/types/responseType';
	import { lineChartOptions } from '$lib/helper/chartConfig';

	//THIS IS NEEDED - CAN BE REPLACED IF EVERYTHING IMPORTED SEPARATELY
	import Chart from 'chart.js/auto';

	const UUID = '018fe8f1-920c-714a-858c-04416e0ccef4';
	// const UUID = '018fe8fa-919f-7fde-8e3c-8cfeb582df5c';

	let data: any;
	let temperatureInput: number | undefined;
	let dateInput: Date | undefined;
	let densityInput: number | undefined;
	let inputError = '';

	onMount(() => {
		fetchMeasurementData();
	});

	/**Reduces data to unique combinations of time (hourly), temperature and density*/
	function getCleanData(json: FermentationDataResponse) {
		let cleanedData = {
			measuredAts: [] as string[],
			temperatures: [] as number[],
			densities: [] as number[]
		};

		let lastDate, lastDensity, lastTemperature;

		for (let i = 0; i < json.measuredAts.length; i++) {
			const tempTime = new Date(json.measuredAts[i] * 1000).toLocaleDateString('De-de', {
				day: '2-digit',
				month: 'short',
				hour: 'numeric'
			});

			const tempTemperature = +json.temperatures[i].toFixed(1);
			const tempDensities = json.densities[i];

			if (
				tempTime === lastDate &&
				tempTemperature === lastTemperature &&
				tempDensities === lastDensity
			) {
				continue;
			}

			cleanedData.measuredAts.push(tempTime);
			cleanedData.temperatures.push(tempTemperature);
			cleanedData.densities.push(tempDensities);

			lastDate = tempTime;
			lastTemperature = tempTemperature;
			lastDensity = tempDensities;
		}
		return cleanedData;
	}

	async function fetchMeasurementData() {
		try {
			const res = await fetch('https://fermentationdatasample.azurewebsites.net/api/query', {
				headers: {
					'X-User': UUID
				}
			});

			const json = (await res.json()) as FermentationDataResponse;
			const cleanedData = getCleanData(json);

			data = {
				labels: cleanedData.measuredAts,
				datasets: [
					{
						label: 'Density',
						data: cleanedData.densities,
						borderColor: '#27013F',
						backgroundColor: 'white',
						yAxisID: 'yDensity',
						cubicInterpolationMode: 'default',
						tension: 0.4
					},
					{
						label: 'Temperature',
						data: cleanedData.temperatures,
						borderColor: '#F27405',
						backgroundColor: 'white',
						yAxisID: 'yTemperature',
						cubicInterpolationMode: 'monotone',
						tension: 0.4
					}
				]
			};
		} catch (e) {
			//TODO BETTER ERROR HANDLING
			console.error(e);
		}
	}

	async function handleAddMeasurements() {
		if (!temperatureInput) {
			inputError = 'Please enter a temperature!';
			return;
		}
		if (!densityInput) {
			inputError = 'Please enter a density!';
			return;
		}
		if (!dateInput) {
			inputError = 'Please enter a date!';
			return;
		}

		const date = new Date(dateInput);
		const unix = date.getTime() / 1000;
		const body = JSON.stringify({
			measuredAt: unix,
			temperature: temperatureInput,
			density: densityInput
		});

		try {
			const res = await fetch('https://fermentationdatasample.azurewebsites.net/api/write', {
				headers: {
					'X-User': UUID,
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				method: 'POST',
				mode: 'cors',
				body: body
			});
			if (!res.ok) throw Error;

			//TODO: CURRENTLY THIS COULD RESULT IN A DIFFERENT CHART THAN NORMAL INIT (exact same input)
			data.labels.push(
				date.toLocaleDateString('De-de', {
					day: '2-digit',
					month: 'short',
					hour: 'numeric'
				})
			);
			data.datasets[0].data.push(densityInput);
			data.datasets[1].data.push(temperatureInput);

			data = data;

			dateInput = undefined;
			temperatureInput = undefined;
			densityInput = undefined;
		} catch (e) {
			inputError = 'Adding measurements failed';
		}
	}
</script>

<div class="Main-Content-Wrapper">
	{#if data}
		<div class="Line-Container">
			{#key data}
				<Line multiple={true} bind:data options={lineChartOptions} />
			{/key}
		</div>
		<div class="Input-Container">
			<h3>Add Measurement</h3>
			<div class="error">{inputError}</div>
			<div class="input-label-container">
				<input
					type="datetime-local"
					class="time"
					bind:value={dateInput}
					placeholder="Date"
					required
				/>
				<div class="input-label">
					{new Date().toLocaleDateString('De-de', {
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
						hour: 'numeric',
						minute: 'numeric'
					})}
				</div>
			</div>
			<div class="input-label-container">
				<input
					type="number"
					class="temperature"
					bind:value={temperatureInput}
					placeholder="Temperature"
					required
				/>
				<div class="input-label">°C</div>
			</div>
			<div class="input-label-container">
				<input
					type="number"
					class="density"
					bind:value={densityInput}
					placeholder="Density"
					required
				/>
				<div class="input-label">SG 20/20</div>
			</div>
			<button on:click|preventDefault={handleAddMeasurements}>Add</button>
		</div>
	{:else}
		<Loading text="Loading graph..." />
	{/if}
</div>

<style lang="scss">
	.Main-Content-Wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 30px;
	}
	.Line-Container {
		width: clamp(300px, 98vw, 700px);
		min-height: 400px;
		height: 400px;
	}
	.Input-Container {
		background: var(--foreground);
		width: 320px;
		display: flex;
		flex-direction: column;
		padding: 20px 10px;
		border-radius: 5px;
		box-shadow: 0 2px 2px 1px lightgray;
		gap: 5px;
		h3 {
			text-align: center;
		}
		.input-label-container {
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid var(--label-color);
			align-items: baseline;

			& > input {
				border: none;
				padding: 5px;
				background: none;
				&:focus-visible {
					outline: none;
				}
			}
		}
		.input-label-container:last-of-type {
			border: none;
		}
		button {
			background: var(--violett);
			color: var(--foreground);
			font-size: 1.2rem;
			border-radius: 50px;
			width: 200px;
			margin-inline: auto;
			box-shadow: 0 2px 2px #00000077;
			padding: 5px 0;
			cursor: pointer;
			transition: 0.4s;
			&:hover {
				background: lighten(#27013f, 10%);
			}
			&:active {
				box-shadow: none;
			}
		}
		.error {
			color: darkred;
			padding: 5px;
			text-align: center;
			font-weight: bold;
		}
	}
</style>
