export const lineChartOptions = {
	responsive: true,
	pointStyle: false,
	maintainAspectRatio: false,
	interaction: {
		mode: 'index',
		intersect: false
	},
	plugins: {
		//TODO:THIS DOES NOT WORK
		decimation: {
			enabled: true,
			algorithm: 'lttb'
		},
		title: {
			display: true,
			text: 'Fermenting',
			font: {
				weight: 'bold',
				size: 16
			}
		}
	},
	scales: {
		yDensity: {
			title: {
				display: true,
				text: 'Density (SG 20/20)',
				font: {
					weight: 'bold',
					size: 16
				},
				color: '#27013F'
			},
			display: true,
			position: 'left',
			yAxisID: 'y-densities',
			borderJoinStyle: 'round',
			grid: {
				drawOnChartArea: true,
				drawTicks: true
			}
		},
		yTemperature: {
			title: {
				display: true,
				text: 'Temperature (°C)',
				font: {
					weight: 'bold',
					size: 16
				},
				color: '#F27405'
			},
			display: true,
			position: 'right',
			yAxisID: 'y-temperatures',
			borderJoinStyle: 'round',
			grid: {
				drawOnChartArea: false
			}
		},
		x: {
			grid: {
				offset: false
			}
		}
	}
};
