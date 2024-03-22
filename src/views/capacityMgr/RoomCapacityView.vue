<template>
	<!-- 机房容量视图 -->
	<container-warp>
		<template #title> 机房容量视图 </template>
		<template #body>
			<el-tabs style="height: 35px; overflow: hidden; padding: 0 20px" v-model="tabInfo.activeName"
				class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane v-for="room in roomList" :key="room.resourceId" :label="room.roomName"
					:name="room.resourceId" />
			</el-tabs>

			<div class="room-system-view">
				<section class="left-content">
					<RoomView ref="roomViewRef" :roomResourceId="roomInfo.resourceId" toolType="capacity"
						:deviceCountMap="currCabinetObj" :tooltipFieldMap="currCabinetObj"
						@cabinetClickHandler="cabinetClickHandler"></RoomView>
				</section>
				<section class="right-content">
					<div class="room-info">
						<span class="room-info-item">
							<div class="title">机房名称</div>
							<div class="content">{{ roomInfo.roomName }}</div>
						</span>
						<span class="room-info-item">
							<div class="title">全部机柜数</div>
							<div class="content">{{ roomInfo.totalCount }}</div>
						</span>
					</div>
					<div class="totol-info">
						<span :class="{ 'totol-info-item': true, 'totol-info-item-active': utype === '2u' }"
							@click="onCabinetCheck(roomInfo.cabinet2u, '2u')">
							<div class="content">{{ roomInfo.device2UCount }} 台</div>
							<div class="title">可部署 2U 设备</div>
						</span>
						<span :class="{ 'totol-info-item': true, 'totol-info-item-active': utype === '3u' }"
							@click="onCabinetCheck(roomInfo.cabinet3u, '3u')">
							<div class="content">{{ roomInfo.device3UCount }} 台</div>
							<div class="title">可部署 3U 设备</div>
						</span>
						<span :class="{ 'totol-info-item': true, 'totol-info-item-active': utype === '23u' }"
							@click="onCabinetCheck(roomInfo.cabinet23u, '23u')">
							<div class="content">{{ roomInfo.device23UCount }} 台</div>
							<div class="title">可部署 2+3U 设备</div>
						</span>
					</div>
					<div class="table-info">
						<el-table header-row-class-name="table-header" :data="roomInfo.cabinetList"
							style="width: 100%; height: 100%">
							<el-table-column prop="deviceNum" label="机柜编号" min-width="100" align="center" />
							<el-table-column prop="freeU" label="可用U位数" min-width="95" align="center" />
							<el-table-column prop="device2UCount" label="可部署2U设备" min-width="120" align="center" />
							<el-table-column prop="device3UCount" label="可部署3U设备" min-width="120" align="center" />
							<el-table-column prop="device23UCount" label="可部署2+3U设备" min-width="130" align="center" />
						</el-table>
					</div>
				</section>
			</div>
		</template>
	</container-warp>

	<!-- 机柜展示 -->
	<dialogCabinet ref="cabinetRef" :dialogInfo="dialogInfo"></dialogCabinet>
</template>
<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import RoomView from '@/components/RoomView.vue';
import DialogCabinet from './dialogCabinet.vue';

export const useRoomInfo = () => {
	const route = useRoute();
	const tabInfo = reactive({ activeName: '' });

	// 多个机房信息
	const roomList = ref([
		// fix: 测试数据
		{
			resourceId: '222', // 机房ID
			roomName: '222', //机房名称
			totalCount: 60, //机柜总数
			device2UCount: 10, //可部署2U数
			device3UCount: 20, //可部署3U数
			device23UCount: 30,
			cabinetList: [
				{
					resourceId: '0_101', //资源ID
					deviceNum: 'xxx_0001', //机柜名称
					freeU: 42, //可用U位
					device2UCount: 11, //可部署2U数
					device3UCount: 4, //可部署3U数
					device23UCount: 1, //可部署2+3U数
				},
			],
		},
		{
			resourceId: '111', // 机房ID
			roomName: '111', //机房名称
			totalCount: 0, //机柜总数
			device2UCount: 0, //可部署2U数
			device3UCount: 0, //可部署3U数
			device23UCount: 0,
			// todo
			cabinet2u: 'number0_101',
			cabinet3u: 'number0_102',
			cabinet23u: 'number0_103',
			cabinetList: [
				{
					resourceId: '0_101', //资源ID
					deviceNum: 'number0_101', //机柜名称
					freeU: 42, //可用U位
					device2UCount: 11, //可部署2U数
					device3UCount: 4, //可部署3U数
					device23UCount: 1, //可部署2+3U数
					// todo
					startu2u: '41,38,35,32,29,26,23,20',
					startu3u: '41,37,33,29,25,21,17',
					startu23u: '41,34,27,20',
					deviceInfo: "[{startU:1,u:2}]"
				},
				{
					resourceId: '0_102', //资源ID
					deviceNum: 'number0_102', //机柜名称
					freeU: 42, //可用U位
					device2UCount: 11, //可部署2U数
					device3UCount: 4, //可部署3U数
					device23UCount: 1, //可部署2+3U数
					// todo
					startu2u: '41,38,35,32,29,26,23,20',
					startu3u: '41,37,33,29,25,21,17',
					startu23u: '41,34,27,20',
					deviceInfo: "[{startU:1,u:2}]"
				},
				{
					resourceId: '0_103', //资源ID
					deviceNum: 'number0_103', //机柜名称
					freeU: 42, //可用U位
					device2UCount: 11, //可部署2U数
					device3UCount: 4, //可部署3U数
					device23UCount: 1, //可部署2+3U数
					// todo
					startu2u: '41,38,35,32,29,26,23,20',
					startu3u: '41,37,33,29,25,21,17',
					startu23u: '41,34,27,20',
					deviceInfo: "[{startU:1,u:2}]"
				},
			],
		},
	]);

	// 当前机房信息
	const roomInfo = reactive({
		resourceId: 'room_resourceId', // 机房ID
		roomName: '', //机房名称
		totalCount: 0, //机柜总数
		device2UCount: 0, //可部署2U数
		device3UCount: 0, //可部署3U数
		device23UCount: 0,
		// todo
		cabinet2u: 'number0_101',
		cabinet3u: 'number0_102',
		cabinet23u: 'number0_103',
		cabinetList: [
			// fix: 测试数据
			{
				resourceId: '0_101', //资源ID
				deviceNum: 'number0_101', //机柜名称
				freeU: 42, //可用U位
				device2UCount: 11, //可部署2U数
				device3UCount: 4, //可部署3U数
				device23UCount: 1, //可部署2+3U数
				// todo
				startu2u: '41,38,35,32,29,26,23,20',
				startu3u: '41,37,33,29,25,21,17',
				startu23u: '41,34,27,20',
				deviceInfo: "[{startU:1,u:2}]"
			},
			{
				resourceId: '0_102', //资源ID
				deviceNum: 'number0_102', //机柜名称
				freeU: 42, //可用U位
				device2UCount: 11, //可部署2U数
				device3UCount: 4, //可部署3U数
				device23UCount: 1, //可部署2+3U数
				// todo
				startu2u: '41,38,35,32,29,26,23,20',
				startu3u: '41,37,33,29,25,21,17',
				startu23u: '41,34,27,20',
				deviceInfo: "[{startU:1,u:2}]"
			},
			{
				resourceId: '0_103', //资源ID
				deviceNum: 'number0_103', //机柜名称
				freeU: 42, //可用U位
				device2UCount: 11, //可部署2U数
				device3UCount: 4, //可部署3U数
				device23UCount: 1, //可部署2+3U数
				// todo
				startu2u: '41,38,35,32,29,26,23,20',
				startu3u: '41,37,33,29,25,21,17',
				startu23u: '41,34,27,20',
				deviceInfo: "[{startU:1,u:2}]"
			},
		],
	});

	const tableHandler = async () => {
		try {
			const { data: res } = await axios.get(`/dcim/custom/capacity/cabinet/count/room/${route.params.id}`);
			roomList.value = res || [];

			const currRoom = roomList.value[0] || {};
			tabInfo.activeName = currRoom.resourceId;
			Object.assign(roomInfo, currRoom);
		} catch (error) {
			console.log(error);
		} finally {
		}
	};

	watch(
		() => route.params.id,
		(val) => {
			if (val) {
				tableHandler();
			}
		},
		{
			immediate: true,
		}
	);

	const currCabinetObj = computed(() => {
		const map = roomInfo.cabinetList.reduce((map, curr) => {
			map[curr.resourceId] = curr;
			return map;
		}, {});
		return map;
	});

	const handleClick = () => {
		const currRoom = roomList.value.find((room) => room.resourceId === tabInfo.activeName) || {};
		Object.assign(roomInfo, currRoom);
	};

	const roomViewRef = ref(null);
	const utype = ref('');
	const onCabinetCheck = (cabinetNumbers, utypeArg) => {
		console.log('高亮的机柜：' + cabinetNumbers.split(','));
		utype.value = utypeArg;
		roomViewRef.value.highlightCabinetNumberList = cabinetNumbers.split(',');
	};


	const cabinetRef = ref(null);
	const dialogInfo = reactive({
		dialogCabinetVisible: false,
		cabinetName: '',
	});
	const evalTransform = (fn) => {
		let Fn = Function; // 一个变量指向Function，防止有些前端编译工具报错
		return new Fn('return ' + fn)();
	};
	const cabinetClickHandler = (currCabinet) => {
		Object.assign(dialogInfo, currCabinet, { dialogCabinetVisible: true, cabinetName: currCabinet.deviceNum });
		// 根据 currCabinetObj 展示u位信息
		console.log(currCabinet);
		const cabinetInfo = roomInfo.cabinetList.find(cabinet => cabinet.deviceNum === currCabinet.deviceNum);

		if (cabinetInfo) {
			cabinetRef.value.setHighlightUInfo({
				list2u: cabinetInfo.startu2u && cabinetInfo.startu2u.split(',').reduce((map, currU) => {
					map[currU] = { uHeight: 2 };
					return map;
				}, {}),
				list3u: cabinetInfo.startu2u && cabinetInfo.startu2u.split(',').reduce((map, currU) => {
					map[currU] = { uHeight: 3 };
					return map;
				}, {}),
				list23u: cabinetInfo.startu2u && cabinetInfo.startu2u.split(',').reduce((map, currU) => {
					map[currU] = { uHeight: 6 };
					return map;
				}, {}),
			},
				evalTransform(cabinetInfo.deviceInfo || '').reduce((map, currU) => {
					map[currU.startU] = { uHeight: currU.u };
					return map;
				}, {})
			);
		}
	};
	return { tabInfo, roomList, roomInfo, currCabinetObj, handleClick, utype, onCabinetCheck, cabinetClickHandler, roomViewRef, cabinetRef, dialogInfo };
};

export default defineComponent({
	name: 'RoomCapacityView',
	components: {
		RoomView,
		DialogCabinet
	},
	setup() {
		return {
			...toRefs(useRoomInfo()),
		};
	},
});
</script>
<style lang="less" scoped>
@import 'src/css/conponents.less';

.room-system-view {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	font-size: 16px;
	background: @background;
	color: #c5dff9;
	display: flex;

	.left-content {
		flex: 1;
		min-width: 800px;
		height: 100%;
	}

	.right-content {
		height: calc(100% - 35px);
		width: 640px;
		padding: 0 20px;
		position: relative;

		&::after {
			content: '';
			width: 2px;
			height: 80%;
			display: inline-block;
			position: absolute;
			left: -5px;
			top: 10px;
			background-image: linear-gradient(to bottom, transparent 20%, #0266b7 56%, transparent);
		}

		.room-info {
			height: 110px;
			display: flex;
			justify-content: space-evenly;
			color: #fff;
			background-image: url('@/assets/images/roomView/roomWarp.png');
			background-repeat: no-repeat;
			background-size: 100% 100%;

			&-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				background-repeat: no-repeat;
				background-position: 70px 50%;
				padding-left: 140px;
				align-items: flex-start;
			}

			&-item:first-child {
				background-image: url('@/assets/images/roomView/room.png');
			}

			&-item:last-child {
				background-image: url('@/assets/images/roomView/device.png');
			}
		}

		.totol-info {
			margin: 10px 0;
			height: 80px;
			display: flex;
			justify-content: center;
			color: #fff;

			&-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				background-image: url('@/assets/images/roomView/warp.png');
				background-repeat: no-repeat;
				background-size: 100% 100%;
				cursor: pointer;
			}

			&-item-active,
			&-item:hover {
				background-image: url('@/assets/images/roomView/warpHover.png');
				background-repeat: no-repeat;
				background-size: 100% 100%;
			}
		}

		.table-info {
			height: calc(100% - 210px);
		}

		.content {
			font-weight: 600;
			color: #0ae1f9;
			font-size: 16px;
		}

		.title {
			font-size: 15px;
		}
	}
}

::v-deep(.el-tabs__item) {
	color: #fff;
}

::v-deep(.el-tabs__item.is-top.is-active) {
	color: #409eff !important;
}
</style>
