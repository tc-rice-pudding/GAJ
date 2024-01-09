<template>
  <div class="pie-container">
    <div
      ref="pieDomRef"
      class="chart-pie"
      :style="{ width: `${chartWidth}px`, height: `${chartHeight}px` }"
    />
  </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import cloneDeep from 'lodash/cloneDeep';

echarts.use([TitleComponent, TooltipComponent, PieChart, CanvasRenderer, LegendComponent]);

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
        color: ['#5483FF', '#6BA6EA', '#31EDB4'],
        title: {
          text: '--',
          left: 'center',
          textStyle: {
            fontSize: 16,
            color: '#666',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}',
          textStyle: { fontSize: 12 },
        },
        legend: {
          orient: 'vertical',
          left: '5%',
          top: '45%',
          icon: 'circle',
          textStyle: {
            color: '#666',
            fontSize: 12,
          },
        },
        series: [
          {
            type: 'pie',
            radius: '30%',
            data: [
              { name: '已使用', value: 100 },
              { name: '预布局', value: 100 },
              { name: '未布局', value: 100 },
            ],
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
		if (this.$refs.pieDomRef) {
			this.myChart = echarts.init(this.$refs.pieDomRef);
			this.myChart.setOption(this.optionsRef);
		}
	},
	watch: {
		chartWidth() {
			if (this.$refs.pieDomRef) this.$refs.pieDomRef.resize({ width: w, height: h });
		},
		chartHeight() {
			if (this.$refs.pieDomRef) this.$refs.pieDomRef.resize({ width: w, height: h });
		},
		optionsRef: {
			handler() {
				if (this.$refs.pieDomRef) {
					this.$refs.pieDomRef.clear();
					this.$refs.pieDomRef.setOption(this.optionsRef);
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
.pie-container {
  .chart-pie {
    margin: 0 auto;
  }
}
</style>
