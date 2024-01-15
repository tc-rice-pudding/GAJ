<template>
	<!-- 资产管理：机房使用单位 -->
	<container-warp>
		<template #title> 机房使用单位 </template>
		<template #body>
			<div class="room-using-unit-view">
				<section class="left-content">
					<RoomView
						:roomName="roomName"
						:roomResourceId="currRoomInfo.resourceId"
						toolType="property"
						:deviceCountMap="currCabinetObj"
						:tooltipFieldMap="{ userName: roomInfo.userName }"
						@cabinetClickHandler="cabinetClickHandler"
					></RoomView>
				</section>
				<section class="right-content">
					<div class="room-info">
						<span class="room-info-item unit-bg">
							<div class="title">使用单位</div>
							<div class="content">{{ roomInfo.userName }}</div>
						</span>
						<span class="room-info-item system-bg">
							<div class="title">系统名称</div>
							<div class="content">{{ roomInfo.systemName }}</div>
						</span>
					</div>
					<div class="room-info">
						<span class="room-info-item room-bg">
							<div class="title">机房数量</div>
							<div class="content">{{ roomInfo.roomCount }}</div>
						</span>
						<span class="room-info-item device-bg">
							<div class="title">设备数量</div>
							<div class="content">{{ roomInfo.deviceCount }}</div>
						</span>
					</div>
					<div class="table-info">
						<el-table
							header-row-class-name="table-header"
							:data="roomInfo.roomList"
							style="width: 100%; height: 100%"
							@row-click="rowClick"
						>
							<el-table-column prop="roomName" label="机房名称" min-width="100" align="center" />
							<el-table-column prop="cabinetCount" label="机柜数量" min-width="95" align="center" />
							<el-table-column prop="deviceCount" label="设备数量" min-width="120" align="center" />
						</el-table>
					</div>
				</section>
			</div>
		</template>
	</container-warp>
</template>
<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import RoomView from '@/components/RoomView.vue';

export default defineComponent({
	name: 'RoomUsingUnit',
	components: {
		RoomView,
	},
	setup() {
		const router = useRouter();
		// 机柜视图所有的机柜数量信息 => { resourceId: deviceCount}
		const currCabinetObj = reactive({
			// fix:测试数据
			cab1: 20,
			cab2: 40,
			cab3: 50,
			cab4: 60,
		});
		const currRoomInfo = reactive({});

		const route = useRoute();
		const roomInfo = reactive({
			userName: '',
			systemName: '',
			roomCount: '',
			deviceCount: '',
			roomList: [
				// fix:测试数据
				// {
				// 	resourceId: '',
				// 	roomName: '',
				// 	deviceCount: 14,
				// 	cabinetCount: 2,
				// 	cabinetList: [
				// 		// 机柜视图悬浮框内容
				// 		{
				// 			resourceId: '',
				// 			deviceCount: 0,
				// 		},
				// 	],
				// },
			],
		});

		// 获取右侧信息
		const tableHandler = async () => {
			try {
				const res = await axios.post('/dcim/custom/room/data', {
					userName: route.query.userName.split(','),
					systemName: route.query.systemName.split(','),
				});
				Object.assign(roomInfo, res);

				// 左侧机房的操作
				currRoomInfo = res.roomList[0]; // 默认展示第一个机房
				rowClick(currRoomInfo);
			} catch (error) {
				console.log(error);
			} finally {
			}
		};
		tableHandler();

		// 切换机房视图，统计当前机房所有设备数量
		const rowClick = (row) => {
			const transformObj = row.cabinetList.reduce((map, curr) => {
				map[curr.resourceId] = curr.deviceCount;
				return map;
			}, {});

			Object.assign(currCabinetObj, transformObj);
		};

		const cabinetClickHandler = (cabinet, roomName) => {
			// 跳转到机柜视图
			router.push({
				path: '/cabinetInfo',
				query: { cabinetRid: cabinet.resourceId, name: `${roomName || ''} - ${cabinet.name || ''}` },
			});
		};

		return { roomInfo, rowClick, currCabinetObj, currRoomInfo, cabinetClickHandler };
	},
});
</script>
<style lang="less" scoped>
@import 'src/css/conponents.less';

.room-using-unit-view {
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
		height: 100%;
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
			height: 90px;
			padding: 10px 0;
			display: flex;
			justify-content: space-evenly;
			color: #fff;
			&-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding-left: 140px;
				align-items: flex-start;
			}

			.unit-bg {
				background-repeat: no-repeat;
				background-position: 70px 50%;
				background-image: url('@/assets/images/roomView/room.png');
			}
			.device-bg {
				background-repeat: no-repeat;
				background-position: 70px 50%;
				background-image: url('@/assets/images/roomView/device.png');
			}
			.room-bg {
				background-repeat: no-repeat;
				background-position: 70px 50%;
				background-image: url('@/assets/images/roomView/unit.png');
			}
			.system-bg {
				background-repeat: no-repeat;
				background-position: 70px 50%;
				background-image: url('@/assets/images/roomView/system.png');
			}
		}
		.table-info {
			height: calc(100% - 220px);
		}

		.content {
			font-weight: 600;
			color: #0ae1f9;
			font-size: 16px;
			height: 20px;
		}
		.title {
			font-size: 15px;
		}
	}
}
</style>
