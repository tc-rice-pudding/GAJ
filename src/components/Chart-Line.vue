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
				color: ['#007EFF', '#FFCD75', '#0ED3A0', '#2BBDF7'],
				title: {
					text: '资源使用率趋势图',
					top: '10',
					left: '10',
					textStyle: {
						fontSize: 16,
						color: '#fff',
					},
				},
				tooltip: {
					trigger: 'axis',
					formatter: '{b}: {c}',
					textStyle: { fontSize: 12 },
				},
				legend: {
					left: 'center',
					top: '5%',
					// icon: 'rect',
					textStyle: {
						color: '#fff',
						fontSize: 12,
					},
					data: ['功率使用率', '机柜使用率', '单位3', '单位4'],
				},
				grid: {
					left: '3%',
					right: '3%',
					bottom: '5%',
					containLabel: true,
					show: false,
				},
				xAxis: {
					type: 'category',
					boundaryGap: true,
					axisTick: {
						show: false,
						alignWithLabel: true,
					},
					splitLine: {
						show: false,
					},
					axisLabel: {
						color: '#9CAEC6',
					},
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
				},
				yAxis: {
					type: 'value',
					axisLabel: {
						color: '#9CAEC6',
					},
					splitLine: {
						// y轴线条样式
						lineStyle: {
							color: 'rgba(127, 127, 127, 1)',
							type: 'dashed', // 线型为虚线
						},
					},
				},
				series: [
					{
						name: '功率使用率',
						type: 'line',
						areaStyle: {
							opacity: 0.2,
						},
						symbol: 'emptyCircle',
						symbolSize: 6,
						data: [20, 32, 51, 74, 60, 80, 30],
					},
					{
						name: '机柜使用率',
						type: 'line',
						areaStyle: {
							opacity: 0.2,
						},
						symbol: 'emptyCircle',
						symbolSize: 6,
						data: [20, 32, 10, 54, 10, 20, 30],
					},
					{
						name: '单位3',
						type: 'line',
						areaStyle: {
							opacity: 0.2,
						},
						symbol: 'emptyCircle',
						symbolSize: 6,
						data: [80, 42, 30, 14, 20, 90, 20],
					},
					{
						name: '单位4',
						type: 'line',
						areaStyle: {
							opacity: 0.2,
						},
						symbol: 'emptyCircle',
						symbolSize: 6,
						data: [87, 22, 56, 54, 35, 20, 45],
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
