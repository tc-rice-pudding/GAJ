<template>
	<!-- 机房组件 -->
	<div class="room-component-view" v-loading="loading" element-loading-background="rgba(122, 122, 122, 0.2)">
		<nav>
			<label class="title">{{ roomName }}</label>
		</nav>
		<section class="room-matrix">
			<div class="cabinet-column" v-for="col in roomConstruction" :key="col">
				<div class="cabinet-column-title">{{ col.cabinetRowInfo.name }}</div>
				<template v-for="cabinet in col.cabinetList" :key="cabinet">
					<el-popover
						placement="right"
						:width="230"
						trigger="hover"
						:disabled="!(cabinet.resourceId in deviceCountMap)"
					>
						<template #reference>
							<div
								class="cabinet-item empty-cabinet"
								:class="{ 'use-cabinet-item': cabinet.resourceId in deviceCountMap }"
								:data-rid="cabinet.resourceId"
								@click="cabinetClickHandler(cabinet)"
							></div>
						</template>
						<!-- 资产展示 -->
						<template v-if="toolType === 'property'">
							<div class="tip-row">
								<label class="tip-title maxWidth">机柜编号：</label>
								<label class="tip-content">{{ cabinet.deviceNum }}</label>
							</div>
							<div class="tip-row">
								<label class="tip-title maxWidth">系统名称：</label>
								<label class="tip-content">{{ cabinet.name }}</label>
							</div>
							<div class="tip-row" v-if="'userName' in tooltipFieldMap">
								<label class="tip-title maxWidth">使用单位：</label>
								<label class="tip-content">{{ tooltipFieldMap.userName }}</label>
							</div>
							<div class="tip-row">
								<label class="tip-title maxWidth">设备数量：</label>
								<label class="tip-content">{{ deviceCountMap[cabinet.resourceId] }}</label>
							</div>
						</template>
						<!-- 资产 展示 -->
						<template v-if="toolType === 'capacity'">
							<div class="tip-row">
								<label class="tip-title">机柜编号：</label>
								<label class="tip-content">{{ cabinet.deviceNum }}</label>
							</div>
							<div class="tip-row">
								<label class="tip-title">可用U位：</label>
								<label class="tip-content algin-right">{{
									deviceCountMap[cabinet.resourceId]?.freeU || ''
								}}</label>
							</div>
							<div class="tip-row">
								<label class="tip-title">可部署2U数：</label>
								<label class="tip-content algin-right">{{
									deviceCountMap[cabinet.resourceId]?.device2UCount || ''
								}}</label>
							</div>
							<div class="tip-row">
								<label class="tip-title">可部署3U数：</label>
								<label class="tip-content algin-right">{{
									deviceCountMap[cabinet.resourceId]?.device3UCount || ''
								}}</label>
							</div>
							<div class="tip-row">
								<label class="tip-title">可部署2+3U数：</label>
								<label class="tip-content algin-right">{{
									deviceCountMap[cabinet.resourceId]?.device23UCount || ''
								}}</label>
							</div>
						</template>
					</el-popover>
				</template>
			</div>
		</section>
	</div>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { roomConstruct } from './mockData.js';

export default defineComponent({
	name: 'RoomComponent',
	props: {
		roomName: {
			type: String,
			require: true,
		},
		// 机房 resourceId
		roomResourceId: {
			type: String,
			require: true,
		},
		// 哪个模块
		toolType: {
			type: String,
			require: true,
		},
		// 当前机房下所有机柜中的数量信息 { resourceId: deviceCount }
		deviceCountMap: {
			type: Object,
			require: true,
			default: () => ({}),
		},
		// 需要外部传入的字段，tooltip 展示
		tooltipFieldMap: {
			type: Object,
			default: () => ({}),
		},
	},
	setup(props, { attrs, slots, emit }) {
		const loading = ref(true);
		// 机房空间结构信息
		const roomConstruction = ref([]);
		// fix: 测试数据
		roomConstruction.value = roomConstruct;

		// 根据机房id获取机房的空间结构信息
		watch(
			() => props.roomResourceId,
			async (val) => {
				if (val) {
					try {
						loading.value = true;
						const res = await axios.get(`/dcim/custom/room/list?resourceId=${props.roomResourceId}`);
						roomConstruction.value = res.data || [];
						loading.value = false;
					} catch (error) {
						console.log(error);
						loading.value = false;
					}
				}
			},
			{ immediate: true }
		);

		const cabinetClickHandler = (cabinetInfo) => {
			emit('cabinetClickHandler', cabinetInfo, props.roomName);
		};

		return { loading, roomConstruction, cabinetClickHandler };
	},
});
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';
.room-component-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	font-size: 16px;
	background: @background;
	padding: 10px 20px;

	> nav {
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		.title {
			height: 30px;
			line-height: 30px;
			font-size: 20px;
			color: #fff;
			font-weight: 600;
			// &::before {
			// 	content: '<';
			// 	padding-right: 15px;
			// }
			// &::after {
			// 	content: '>';
			// 	padding-left: 15px;
			// }
		}
	}
	> section {
		height: calc(100% - 70px);
		padding: 10px 0;
		display: flex;
		justify-content: center;
		overflow: auto;

		.cabinet-column {
			margin: 0 5px;
			.cabinet-column-title {
				height: 30px;
				color: #9cc9f1;
				font-weight: 600;
			}
			.cabinet-item {
				width: 60px;
				height: 25px;
				margin-bottom: 10px;
				background: grey;
				cursor: pointer;
				background-repeat: no-repeat;
				background-size: 100%;
				transition: all 0.3s;
			}
			.empty-cabinet {
				background-image: url('@/assets/images/roomView/empty-cabinet.png');
			}
			.use-cabinet-item {
				background-image: url('@/assets/images/roomView/used-cabinet.png');
			}
			.use-cabinet-item:hover {
				background-image: url('@/assets/images/roomView/cabinet-hover.png');
			}
		}
	}
}

.tip-row {
	padding: 2px 0;
	display: flex;
	> label {
		display: inline-block;
	}
	.tip-title {
		color: #fff;
		flex: 2;
	}
	.maxWidth{
		max-width: 80px;
	}
	.tip-content {
		color: #2fc3ff;
		flex: 1;
	}
	.algin-right {
		flex: 1;
		text-align: right;
	}
}
</style>
