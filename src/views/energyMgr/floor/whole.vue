<template>
	<!-- 整体能耗 -->
	<div class="whole-view">
		<section class="info">
			<div class="info-item">
				<span>{{ floorInfo.floorName }} 昨日总用电量</span>
				<label>{{ totalElectricity }} kWh</label>
			</div>
			<div class="info-item">
				<span>{{ floorInfo.floorName }} 实时功率</span>
				<label>{{ realPower }} kW</label>
			</div>
		</section>
		<section class="echarts-comp horizontal">
			<Chart-Bar ref="electricityMinRef" class="chart-item" :options="electricityMinimumOps"></Chart-Bar>
			<Chart-Line class="chart-item" :options="totalEnergyOps" />
		</section>
		<section class="echarts-comp vertical">
			<Chart-Bar ref="electricityHighRef" class="chart-item" :options="electricityHighestOps"></Chart-Bar>
			<Chart-Line class="chart-item" :options="ITEnergyOps" />
		</section>
	</div>

	<!-- 机柜展示 -->
	<dialogCabinet ref="cabinetRef" :dialogInfo="dialogInfo"></dialogCabinet>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import ChartBar from '@/components/Chart-Bar.vue';
import ChartLine from '@/components/Chart-Line.vue';
import { barOpsDefault, lineOpsDefault } from '../options';
import DialogCabinet from './dialogCabinet.vue';
import { deepClone } from '@/utils';

export const useInfo = ({floorId, floorName}) => {
	let realPower = ref('');
	let totalElectricity = ref('');

	const getFloorInfo = async () => {
		try {
			const { data: res } = await axios.post('/dcim/custom/energy/batch/point', {
				pointIds: [`${floorId}_1_6027_0`, `${floorId}_1_6028_0`],
			});

			totalElectricity.value = res[`${floorId}_1_6028_0`];
			realPower.value = res[`${floorId}_1_6027_0`];
		} catch (error) {
			console.log(error);
		}
	};
	getFloorInfo();

	return { realPower, totalElectricity };
};

// 用电最低、用电最高
export const useElectricityTopAndBottom = ({ floorId, floorName }) => {
	const electricityMinRef = ref(null);
	const electricityHighRef = ref(null);

	const cabinetRef = ref(null);
	const dialogInfo = reactive({
		dialogCabinetVisible: false,
		cabinetName: '',
	});

	let top10 = ref([
		// fix
		{
			resourceId: '11',
			deviceNum: 'dxc1101',
			value: '1',
		},
		{
			resourceId: '22',
			deviceNum: 'dxc11012',
			value: '2',
		},
		{
			resourceId: '33',
			deviceNum: 'dxc11013',
			value: '3',
		},
		{
			resourceId: '44',
			deviceNum: 'dxc11014',
			value: '4',
		},
		{
			resourceId: '55',
			deviceNum: 'dxc11015',
			value: '5',
		},
	]);
	let bot10 = ref([
		// fix
		{
			resourceId: '1',
			deviceNum: '1',
			value: '1',
		},
		{
			resourceId: '2',
			deviceNum: '2',
			value: '2',
		},
		{
			resourceId: '3',
			deviceNum: '3',
			value: '3',
		},
		{
			resourceId: '4',
			deviceNum: '4',
			value: '4',
		},
		{
			resourceId: '5',
			deviceNum: '5',
			value: '5',
		},
	]);
	let hash = reactive({
		// fix
		dxc11015: {
			resourceId: '55',
			deviceNum: 'dxc11015',
			value: '5',
		},
	}); // {机柜name：机柜info}

	const getFloorInfo = async () => {
		try {
			const { data: { top10List, bot10List } } = await axios.get(
				`/dcim/custom/energy/cabinet/power/topAndBot10/${floorId}`
			);
			top10.value = top10List || [];
			bot10.value = bot10List || [];
			hash = [...top10.value, ...bot10.value].reduce((map, curr) => {
				map[curr.deviceNum] = curr;
				return map;
			}, {});
		} catch (error) {
			console.log(error);
		}
	};
	getFloorInfo();

	// 最低
	let electricityMinimumOps = computed(() => {
		let defaultOps = deepClone(barOpsDefault);

		defaultOps.color = ['#00DEFF'];
		defaultOps.title.text = '机柜用电最低（kW）';
		defaultOps.xAxis.data = bot10.value.map((it) => it.deviceNum) || [];
		defaultOps.series[0].data = bot10.value.map((it) => it.value) || [];

		return defaultOps;
	});

	// 最高
	let electricityHighestOps = computed(() => {
		let defaultOps = deepClone(barOpsDefault);

		defaultOps.color = ['#00DEFF'];
		defaultOps.title.text = '机柜用电最高（kW）';
		defaultOps.xAxis.data = top10.value.map((it) => it.deviceNum) || [];
		defaultOps.series[0].data = top10.value.map((it) => it.value) || [];

		return defaultOps;
	});

	const chartHandler = (params) => {
		const cabinetRid = hash[params.name]?.resourceId;
		Object.assign(dialogInfo, { dialogCabinetVisible: true, cabinetName: `机柜编号：${params.name}` });
		setTimeout(() => {
			cabinetRef.value?.init(cabinetRid); // 获取机柜信息
		}, 300);
	};
	onMounted(() => {
		electricityMinRef.value?.myChart.on('click', chartHandler);
		electricityHighRef.value?.myChart.on('click', chartHandler);
	});

	return {
		electricityMinimumOps,
		electricityHighestOps,
		electricityMinRef,
		electricityHighRef,
		cabinetRef,
		dialogInfo,
	};
};

// 总功耗
export const useTotalEnergy = ({ floorId, floorName }) => {
	const totalEnergyList = ref([
		// fix
		{ value: '1', time: '2020-01' },
		{ value: '2', time: '2020-02' },
		{ value: '3', time: '2020-03' },
		{ value: '4', time: '2020-04' },
		{ value: '5', time: '2020-05' },
		{ value: '6', time: '2020-05' },
	]);
	const getTotalEnergy = async () => {
		try {
			const { data: list } = await axios.get(`/dcim/custom/energy/floor/power/statistics/${floorId}/2`);
			totalEnergyList.value = list || [];
		} catch (error) {
			console.log(error);
		}
	};
	getTotalEnergy();

	let totalEnergyOps = computed(() => {
		let defaultOps = deepClone(lineOpsDefault);
		defaultOps.color = ['#00DEFF'];
		defaultOps.title.text = '总功耗统计';
		defaultOps.xAxis.data = totalEnergyList.value.map((it) => it.time) || [];
		defaultOps.legend = null;
		defaultOps.series = {
			type: 'line',
			areaStyle: {
				opacity: 0.2,
			},
			symbol: 'emptyCircle',
			symbolSize: 6,
			data: totalEnergyList.value.map((it) => it.value) || [],
		};
		return defaultOps;
	});

	return { totalEnergyOps };
};

// IT功耗
export const useITEnergy = ({ floorId, floorName }) => {
	const ITEnergyList = ref([
		// fix
		{ value: '1', time: '2020-01' },
		{ value: '2', time: '2020-02' },
		{ value: '3', time: '2020-03' },
		{ value: '4', time: '2020-04' },
		{ value: '5', time: '2020-05' },
		{ value: '6', time: '2020-05' },
	]);
	const getITEnergy = async () => {
		try {
			const { data: list } = await axios.get(`/dcim/custom/energy/floor/itpower/statistics/${floorId}/2`);
			ITEnergyList.value = list || [];
		} catch (error) {
			console.log(error);
		}
	};
	getITEnergy();

	let ITEnergyOps = computed(() => {
		let defaultOps = deepClone(lineOpsDefault);
		defaultOps.color = ['#00DEFF'];
		defaultOps.title.text = 'IT功耗统计';
		defaultOps.xAxis.data = ITEnergyList.value.map((it) => it.time) || [];
		defaultOps.legend = null;
		defaultOps.series = {
			type: 'line',
			areaStyle: {
				opacity: 0.2,
			},
			symbol: 'emptyCircle',
			symbolSize: 6,
			data: ITEnergyList.value.map((it) => it.value) || [],
		};

		return defaultOps;
	});
	return { ITEnergyOps };
};

export default defineComponent({
	name: 'whole',
	components: {
		ChartBar,
		ChartLine,
		DialogCabinet,
	},
	setup() {
		const route = useRoute();
		const floorInfo = computed(() => ({
			floorId: route.query.floorId,
			floorName: route.query.floorName,
		}));

		return {
			floorInfo,
			...toRefs(useInfo(floorInfo)),
			...toRefs(useElectricityTopAndBottom(floorInfo.value)),
			...toRefs(useTotalEnergy(floorInfo.value)),
			...toRefs(useITEnergy(floorInfo.value)),
		};
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';

.whole-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	overflow-y: auto;

	.info {
		min-height: 100px;
		width: 500px;
		background-image: url('@/assets/images/roomView/roomWarp.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		margin-left: 10px;
		display: flex;
		.info-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding-left: 100px;
			background-repeat: no-repeat;
			> span {
				color: #fff;
				font-size: 14px;
			}
			> label {
				color: #0be7fb;
				font-size: 18px;
			}
		}
		.info-item:first-of-type {
			background-image: url('@/assets/images/roomView/elec.png');
			background-position: 55px 50%;
		}
		.info-item:last-of-type {
			background-image: url('@/assets/images/roomView/power.png');
			background-position: 70px 50%;
		}
	}

	.echarts-comp {
		min-height: 250px;
		width: 100%;
		flex: 1;
		display: flex;
		position: relative;
		.chart-item {
			width: 50%;
			height: 100%;
			padding: 5px;
		}
	}
	.horizontal::after {
		content: '';
		background-image: linear-gradient(to right, transparent, #0262af, transparent);
		height: 2px;
		width: 400px;
		display: block;
		position: absolute;
		z-index: 10;
		transform: translateX(-200px) rotateZ(270deg);
		margin-left: 50%;
		bottom: 0;
	}
	.vertical::before {
		content: '';
		background-image: linear-gradient(to right, transparent, #0262af, transparent);
		height: 2px;
		width: 800px;
		display: block;
		position: absolute;
		z-index: 10;
		transform: translateX(-400px);
		margin-left: 50%;
	}
}
</style>
