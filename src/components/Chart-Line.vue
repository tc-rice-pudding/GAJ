<template>
	<div class="line-container">
		<div ref="lineDomRef" class="chart-line" :style="{ width: `${chartWidth}px`, height: `${chartHeight}px` }" />
	</div>
</template>

<script>
import { markRaw } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import cloneDeep from 'lodash/cloneDeep';

echarts.use([LineChart, GridComponent, TitleComponent, TooltipComponent, CanvasRenderer, LegendComponent]);

export default {
	props: {
		w: {
			type: [Number, String],
			default: 'auto',
		},
		h: {
			type: [Number, String],
			default: 250,
		},
		options: {
			type: Object,
			default: () => ({
				color: ['#FFB00D', '#29E1E5', '#70BB19', '#55B6FF', '#D951D9'],
				title: {
					text: '资源使用率趋势图',
					top: '10',
					left: '10',
					textStyle: {
						fontSize: 16,
						color: '#666',
					},
				},
				tooltip: {
					trigger: 'axis',
					formatter: '{b}: {c}',
					textStyle: { fontSize: 12 },
				},
				legend: {
					left: '10%',
					top: '18%',
					icon: 'rect',
					textStyle: {
						color: '#666',
						fontSize: 12,
					},
					data: ['功率使用率', '机柜使用率'],
				},
				grid: {
					left: '3%',
					right: '3%',
					bottom: '3%',
					containLabel: true,
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					axisTick: {
						show: false,
						alignWithLabel: true,
					},
					splitLine: {
						show: true,
					},
					data: ['2021-01', '2021-02', '2021-03', '2021-04', '2021-05', '2021-06', '2021-07'],
				},
				yAxis: {
					type: 'value',
					min: 0,
					max: 100,
					axisLabel: {
						interval: 2,
						formatter: (value) => `${value}%`,
					},
				},
				series: [
					{
						name: '功率使用率',
						type: 'line',
						symbol: 'none',
						data: [20, 32, 51, 74, 60, 80, 30],
					},
					{
						name: '机柜使用率',
						type: 'line',
						symbol: 'none',
						data: [20, 32, 10, 54, 10, 20, 30],
					},
				],
			}),
		},
	},
	data() {
		return {
			myChart: null,
		};
	},
	mounted() {
		if (this.$refs.lineDomRef) {
			this.myChart = markRaw(echarts.init(this.$refs.lineDomRef));
			this.myChart.setOption(this.optionsRef);
		}
	},
	watch: {
		chartWidth() {
			if (this.$refs.lineDomRef) this.$refs.lineDomRef.resize({ width: w, height: h });
		},
		chartHeight() {
			if (this.$refs.lineDomRef) this.$refs.lineDomRef.resize({ width: w, height: h });
		},
		optionsRef: {
			handler() {
				if (this.$refs.lineDomRef) {
					this.$refs.lineDomRef.clear();
					this.$refs.lineDomRef.setOption(this.optionsRef);
				}
			},
			deep: true,
			immediate: true,
		},
	},
	computed: {
		chartWidth() {
			return this.w;
		},
		chartHeight() {
			return this.h;
		},
		optionsRef() {
			return cloneDeep(this.options);
		},
	},
};
</script>

<style lang="less" scoped>
.line-container {
	.chart-line {
		margin: 0 auto;
	}
}
</style>
