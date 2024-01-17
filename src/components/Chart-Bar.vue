<template>
	<div class="bar-container">
		<div ref="barDomRef" class="chart-bar" :style="{ width: `${chartWidth}px`, height: `${chartHeight}px` }" />
	</div>
</template>

<script>
import { markRaw } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent, TooltipComponent, GridComponent } from 'echarts/components';
import cloneDeep from 'lodash/cloneDeep';

echarts.use([TitleComponent, TooltipComponent, BarChart, CanvasRenderer, GridComponent]);

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
				color: ['#5483FF'],
				title: {
					text: '--',
					top: '10',
					left: '10',
					textStyle: {
						fontSize: 16,
						color: '#666',
					},
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true,
				},
				tooltip: {
					trigger: 'axis',
					formatter: '{b}: {c}',
					axisPointer: { type: 'none' },
					textStyle: { fontSize: 12 },
				},
				xAxis: [
					{
						type: 'category',
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
						axisTick: { show: false, alignWithLabel: true },
					},
				],
				yAxis: [
					{
						type: 'value',
						axisLine: {
							show: true,
						},
					},
				],
				series: [
					{
						name: '--',
						type: 'bar',
						barWidth: '35%',
						label: {
							show: true,
							position: 'top',
							color: '#5483FF',
						},
						data: [10, 52, 200, 334, 380, 330, 220],
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
		if (this.$refs.barDomRef) {
			this.myChart = markRaw(echarts.init(this.$refs.barDomRef));
			this.myChart.setOption(this.optionsRef);
		}

		window.addEventListener('resize', this.handleResize);
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.handleResize);
	},
	watch: {
		chartWidth() {
			if (this.$refs.barDomRef) this.$refs.barDomRef.resize({ width: w, height: h });
		},
		chartHeight() {
			if (this.$refs.barDomRef) this.$refs.barDomRef.resize({ width: w, height: h });
		},
		optionsRef: {
			handler() {
				if (this.$refs.barDomRef) {
					this.$refs.barDomRef.clear();
					this.$refs.barDomRef.setOption(this.optionsRef);
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
	methods: {
		handleResize() {
			let _resizeTimeout = null;
			clearTimeout(_resizeTimeout);
			_resizeTimeout = setTimeout(() => {
				this.myChart && this.myChart.resize();
			}, 100);
		},
	},
};
</script>

<style lang="less" scoped>
.bar-container {
	.chart-bar {
		margin: 0 auto;
	}
}
</style>
