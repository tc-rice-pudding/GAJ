<template>
	<div
		class="home"
		ref="rootWarpRef"
		v-loading="loading"
		element-loading-text="Loading..."
		:element-loading-spinner="svg"
		element-loading-svg-view-box="-10, -10, 50, 50"
		element-loading-background="rgba(122, 122, 122, 0.2)"
	>
		<header ref="headerRef">
			<div class="query-row">
				<div class="query-row-item" v-show="checkedCities.includes('Machineroom_num')">
					<span>机房名称</span>
					<el-input v-model="queryInfo.Machineroom_num" size="small" clearable></el-input>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('name')">
					<span>所在机柜</span>
					<el-input v-model="queryInfo.name" size="small" clearable></el-input>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('device_num')">
					<span>编号</span>
					<el-input v-model="queryInfo.device_num" size="small" clearable></el-input>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('Usage')">
					<span>使用状态</span>
					<el-select v-model="queryInfo.Usage" placeholder="请选择" size="small" clearable >
						<el-option
							v-for="item in UsageOptions"
							:key="item.code"
							:label="item.name"
							:value="item.code"
						/>
					</el-select>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('u')">
					<span>高度</span>
					<el-input-number v-model="queryInfo.u" size="small" clearable></el-input-number>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('Empty_U_cfcient')">
					<span>空U系数</span>
					<el-input-number v-model="queryInfo.Empty_U_cfcient" size="small" clearable></el-input-number>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('device_type_cn')">
					<span>设备类型</span>
					<el-cascader :props="props" v-model="queryInfo.device_type_cn" size="small" clearable />
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('power')">
					<span>设备额定功率（KW）</span>
					<el-input-number v-model="queryInfo.power" size="small" clearable></el-input-number>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('electric_socket')">
					<span>设备电源</span>
					<el-input-number v-model="queryInfo.electric_socket" size="small" clearable></el-input-number>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('Networking_type')">
					<span>联网类型</span>
					<el-select
						v-model="queryInfo.Networking_type"
						placeholder="请选择"
						size="small"
						clearable
						
					>
						<el-option
							v-for="item in Networking_typeOptions"
							:key="item.code"
							:label="item.name"
							:value="item.code"
						/>
					</el-select>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('Business_system_name')">
					<span>业务系统上报名称</span>
					<el-input v-model="queryInfo.Business_system_name" size="small" clearable></el-input>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('Business_system_Dispname')">
					<span>业务系统展示名称</span>
					<el-input v-model="queryInfo.Business_system_Dispname" size="small" clearable></el-input>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('User_name')">
					<span>使用单位</span>
					<el-input v-model="queryInfo.User_name" size="small" clearable></el-input>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('department')">
					<span>使用部门</span>
					<el-select v-model="queryInfo.department" placeholder="请选择" size="small" clearable >
						<el-option
							v-for="item in departmentOptions"
							:key="item.code"
							:label="item.name"
							:value="item.code"
						/>
					</el-select>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('owner')">
					<span>设备管理人</span>
					<el-select v-model="queryInfo.owner" placeholder="请选择" size="small" clearable >
						<el-option
							v-for="item in ownerOptions"
							:key="item.code"
							:label="item.name"
							:value="item.code"
						/>
					</el-select>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('Telephone')">
					<span>联系电话</span>
					<el-input v-model="queryInfo.Telephone" size="small" clearable></el-input>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('description')">
					<span>资产备注</span>
					<el-input v-model="queryInfo.description" size="small" clearable></el-input>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('create_date')">
					<span>导入时间</span>
					<el-date-picker v-model="queryInfo.create_date" type="datetime" size="small" />
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('system_name')">
					<span>虚拟机</span>
					<el-input v-model="queryInfo.system_name" size="small" clearable></el-input>
				</div>
				<div class="query-row-item" v-show="checkedCities.includes('use_unit')">
					<span>虚拟机使用单位</span>
					<el-input v-model="queryInfo.use_unit" size="small" clearable></el-input>
				</div>
			</div>
			<div class="btn-row">
				<el-button
					style="background: transparent; color: #73e0cd; margin-left: 10px"
					type="primary"
					size="small"
					@click="onSearch"
					>查询</el-button
				>
				<el-button
					style="background: transparent; color: #73e0cd; margin-left: 10px"
					type="primary"
					size="small"
					@click="onExportAll"
					>全部导出</el-button
				>
				<el-button
					style="background: transparent; color: #73e0cd; margin-left: 10px"
					type="primary"
					size="small"
					@click="onExportMuti"
					>选中导出</el-button
				>

				<el-popover placement="bottom" :width="400" trigger="click">
					<template #reference>
						<el-button
							style="background: transparent; color: #73e0cd; margin-left: 10px"
							type="primary"
							size="small"
							@click="onSetQueryFilds"
							>设置查询字段</el-button
						>
					</template>
					<el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
						>全选</el-checkbox
					>
					<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
						<el-checkbox style="width: 150px" v-for="city in cities" :key="city" :label="city.value">{{
							city.label
						}}</el-checkbox>
					</el-checkbox-group>
				</el-popover>

				<el-popover placement="bottom" :width="400" trigger="click" popper-class="custom-popper-class">
					<template #reference>
						<el-button
							style="background: transparent; color: #73e0cd; margin-left: 10px"
							type="primary"
							size="small"
							@click="columnsDropHandler"
							>设置展示字段</el-button>
					</template>
					<el-checkbox v-model="checkAllColumns" :indeterminate="isIndeterminateColumns" @change="handleColumnsCheckAllChange"
						>全选</el-checkbox
					> <span style="vertical-align: text-top; font-size: 12px; margin-left: 20px; color: #aba8a8;">支持拖动展示排序</span>
					<el-checkbox-group v-model="checkedColumns" @change="handleCheckedColumnsChange">
						<el-checkbox class="dragItem move" style="width: 150px" v-for="col in tableColumns" :key="col" :label="col.label">{{col.label}}</el-checkbox>
					</el-checkbox-group>
				</el-popover>
			</div>
		</header>

		<section
			v-loading="loading1"
			element-loading-text="Loading..."
			:element-loading-spinner="svg"
			element-loading-svg-view-box="-10, -10, 50, 50"
			element-loading-background="rgba(122, 122, 122, 0.2)"
		>
			<el-table header-row-class-name="table-header" :data="resInfo.tableStatData" stripe style="width: 100%">
				<el-table-column prop="userName" label="使用单位" />
				<el-table-column prop="systemNum" label="系统数量" />
				<el-table-column prop="roomNum" label="机房数量" />
				<el-table-column prop="deviceNum" label="设备数量" />
				<el-table-column prop="typeNum" label="设备类型" />
			</el-table>
		</section>

		<section ref="tableContainerRef" style="height: calc(100% - 100px); overflow: hidden">
			<el-table
				v-if="reflushTable"
				header-row-class-name="table-header"
				:height="tableHeight"
				:data="resInfo.tableData"
				stripe
				style="width: 100%"
				:row-key="(row) => row.resource_id"
				@selection-change="(list) => (resInfo.selectedData = list)"
				@sort-change="sortChange"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column type="index" width="80" label="序号" align="center" sortable />
				<el-table-column v-for="field in tableColumns.filter(col=>col.show)" :key="field.prop"
					:prop="field.prop"
					:label="field.label"
					:min-width="field.minWidth"
					show-overflow-tooltip
					align="center"
					:sortable="field.sortable"
				/>
				<!-- 虚拟机 -->
				<el-table-column v-for="field in resInfo.trendFields" :key="field.prop"
					:prop="field.prop"
					:label="field.label"
					show-overflow-tooltip
					align="center"
				/>
			</el-table>
			<el-pagination
				class="pagenation"
				:current-page="currentPage"
				:page-size="pageSize"
				:page-sizes="[10, 30, 50, 100]"
				small="small"
				layout="total, sizes, prev, pager, next"
				:total="total"
				@size-change="(size) => (pageSize = size)"
				@current-change="(inx) => (currentPage = inx)"
			/>
		</section>
	</div>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, watchEffect } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { exportHandler, resizeWindow } from '@/utils/index.js';
import { ElMessage } from 'element-plus';
import Sortable from 'sortablejs';

const useReLayout = () => {
	const rootWarpRef = ref(null);
	const headerRef = ref(null);
	const tableContainerRef = ref(null);
	let tableHeight = ref(500);

	const layout = () => {
		setTimeout(() => {
			if (tableContainerRef.value) {
				const tableWarpHeight = rootWarpRef.value.clientHeight - headerRef.value.clientHeight;
				const containerH = tableWarpHeight - 40 - 34 - 122; // 减去分页的高度
				tableHeight.value = `${containerH}`;
			}
		}, 100);
	};

	resizeWindow(layout);

	onMounted(() => {
		layout();
	});

	return { rootWarpRef, headerRef, tableContainerRef, tableHeight, layout };
};

const useCustomFields = () => {
	const checkAll = ref(false);
	const isIndeterminate = ref(true);
	const checkedCities = ref(['Machineroom_num', 'name', 'device_num', 'Usage', 'startU']);
	let lastCheckedCities = (window.localStorage.getItem('assetSearch_checkedCities')||'').split(',').filter(it=>it);
	const cities = [
		{ value: 'Machineroom_num', label: '机房名称/机房编码' },
		{ value: 'name', label: '所在机柜' },
		{ value: 'device_num', label: '编号' },
		{ value: 'Usage', label: '使用状态' },
		{ value: 'u', label: '高度' },
		{ value: 'Empty_U_cfcient', label: '空U系数' },
		{ value: 'device_type_cn', label: '设备类型' },
		{ value: 'power', label: '设备额定功率（KW）' },
		{ value: 'electric_socket', label: '设备电源' },
		{ value: 'Networking_type', label: '联网类型' },
		{ value: 'Business_system_name', label: '业务系统上报名称' },
		{ value: 'Business_system_Dispname', label: '业务系统展示名称' },
		{ value: 'User_name', label: '使用单位' },
		{ value: 'department', label: '使用部门' },
		{ value: 'owner', label: '设备管理人' },
		{ value: 'Telephone', label: '联系电话' },
		{ value: 'description', label: '资产备注' },
		{ value: 'create_date', label: '导入时间' },
		{ value: 'system_name', label: '虚拟机' },
		{ value: 'use_unit', label: '虚拟机使用单位' },
	];
	if(lastCheckedCities.length){
		checkedCities.value = lastCheckedCities;
		checkAll.value = checkedCities.value.length ===cities.length;
	}

	const handleCheckAllChange = (val) => {
		checkedCities.value = val ? cities.map((it) => it.value) : [];
		isIndeterminate.value = false;
		window.localStorage.setItem('assetSearch_checkedCities',checkedCities.value.toString());
	};
	const handleCheckedCitiesChange = (list) => {
		const checkedCount = list.length;
		checkAll.value = checkedCount === cities.length;
		isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length;
		window.localStorage.setItem('assetSearch_checkedCities',list.toString());
	};

	const reLayout = useReLayout();
	const layoutHandler = reLayout.layout;

	watch(checkedCities, () => {
		layoutHandler();
	});

	return {
		...toRefs(reLayout),
		checkAll,
		isIndeterminate,
		checkedCities,
		cities,
		handleCheckAllChange,
		handleCheckedCitiesChange,
	};
};

const useGetOptions = () => {
	let departmentOptions = ref([]);
	let ownerOptions = ref([]);
	let UsageOptions = ref([]);
	let Networking_typeOptions = ref([]);

	Promise.all([
		axios.post('/dcim/space/getSelectMessage', { key: 'department' }),
		axios.post('/dcim/space/getSelectMessage', { key: 'owner' }),
		axios.post('/dcim/space/getSelectMessage', { key: 'Usage' }),
		axios.post('/dcim/space/getSelectMessage', { key: 'Networking_type' }),
	])
		.then(([res1, res2, res3, res4]) => {
			console.log(res1, res2, res3, res4);
			if (res1.data.status === 200) {
				departmentOptions.value = res1.data.data;
			}
			if (res2.data.status === 200) {
				ownerOptions.value = res2.data.data;
			}
			if (res3.data.status === 200) {
				UsageOptions.value = res3.data.data;
			}
			if (res4.data.status === 200) {
				Networking_typeOptions.value = res4.data.data;
			}
		})
		.catch((error) => {
			console.log(error);
		});

	return {
		departmentOptions,
		ownerOptions,
		UsageOptions,
		Networking_typeOptions,
	};
};

export default {
	name: 'AssetSearch',
	components: {},
	setup() {
		const loadingInfo = reactive({
			loading: ref(false),
			svg: `
				<path class="path" d="
				M 30 15
				L 28 17
				M 25.61 25.61
				A 15 15, 0, 0, 1, 15 30
				A 15 15, 0, 1, 1, 27.99 7.5
				L 15 15
				" style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>`,
		});

		let tableColumns = ref([
			{ prop:"Machineroom_num",label:"机房名称",minWidth:'110',show: true,sortable: true},
			{ prop:"name",label:"所在机柜",minWidth:'110',show: true,sortable: true},
			{ prop:"device_num",label:"编号",minWidth:'110',show: true,sortable: true},
			{ prop:"Usage",label:"使用状态",minWidth:'110',show: true,sortable: true},
			{ prop:"startU",label:"起始U位",minWidth:'110',show: true},
			{ prop:"endU",label:"结束U位",minWidth:'110',show: true},
			{ prop:"u",label:"高度",minWidth:'110',show: true,sortable: true},
			{ prop:"Empty_U_cfcient",label:"空U系数",minWidth:'110',show: true,sortable: true},
			{ prop:"device_type_cn",label:"设备类型",minWidth:'110',show: true,sortable: true},
			{ prop:"manufacture",label:"设备品牌",minWidth:'110',show: true},
			{ prop:"logo",label:"设备型号",minWidth:'110',show: true},
			{ prop:"power",label:"设备额定功率（KW）",minWidth:'200',show: true,sortable: true},
			{ prop:"electric_socket",label:"设备电源",minWidth:'110',show: true,sortable: true},
			{ prop:"Networking_type",label:"联网类型",minWidth:'110',show: true,sortable: true},
			{ prop:"Business_system_name",label:"业务系统上报名称",minWidth:'180',show: true,sortable: true},
			{ prop:"Business_system_Dispname",label:"业务系统展示名称",minWidth:'180',show: true,sortable: true},
			{ prop:"User_name",label:"使用单位",minWidth:'110',show: true,sortable: true},
			{ prop:"department",label:"使用部门",minWidth:'110',show: true,sortable: true},
			{ prop:"owner",label:"设备管理人",minWidth:'130',show: true,sortable: true},
			{ prop:"Telephone",label:"联系电话",minWidth:'110',show: true,sortable: true},
			{ prop:"description",label:"资产备注",minWidth:'110',show: true,sortable: true},
			{ prop:"create_date",label:"导入时间",minWidth:'110',show: true,sortable: true},
		]);

		const props = {
			lazy: true,
			lazyLoad(node, resolve) {
				const { level, data } = node;
				console.log(node);
				axios
					.post(
						'/dcim/overviewController/getDeviceTypeOrVendor',
						{ level: level + 1, parentId: data.id || '' },
						{ headers: { 'content-type': ' multipart/form-data' } }
					)
					.then((res) => {
						console.log(res);
						console.log(res);
						console.log(res);
						if (res.status === 200) {
							resolve(
								res.data.map((it) => ({
									id: it.id,
									value: it.id,
									label: it.value,
									parent_id: it.parent_id,
									leaf: it.level >= 3,
								}))
							);
						}
					})
					.catch((err) => {
						console.log(err);
						resolve([]);
					});

				// setTimeout(() => {
				// 	const nodes = Array.from({ length: level + 1 }).map((item) => {
				// 		let id = Math.random();
				// 		return {
				// 			value: id,
				// 			label: `Option - ${id}`,
				// 			parent_id: `${id}_parent`,
				// 			leaf: level >= 2,
				// 		};
				// 	});
				// 	console.log(nodes);
				// 	resolve(nodes);
				// }, 1000);
			},
		};

		const queryInfo = reactive({
			userName:'',
			Machineroom_num: '', //机房名称
			// Machineroom_num: '', //机房编码
			name: '', // 所在机柜
			device_num: '', // 编号
			Usage: '', // 使用状态
			// startU: '', // 起始U位
			// endU: '', // 结束U位
			u: '', // 高度
			Empty_U_cfcient: '', // 空U系数
			device_type_cn: '', // 设备类型
			// manufacture: '', // 设备品牌
			// logo: '', // 设备型号
			power: '', // 设备额定功率（KW）
			electric_socket: '', // 设备电源
			Networking_type: '', // 联网类型
			Business_system_name: '', // 业务系统上报名称
			Business_system_Dispname: '', // 业务系统展示名称
			User_name: '', // 使用单位
			department: '', // 使用部门
			owner: '', // 设备管理人
			Telephone: '', // 联系电话
			description: '', // 资产备注
			create_date: '', // 导入时间
			use_unit: '',
			system_name: '',
		});

		const resInfo = reactive({
			tableStatData: [],
			tableData: [],
			selectedData: [],
			trendFields: [],
		});
		const pageInfo = reactive({
			currentPage: 1,
			pageSize: 50,
			total: 0,
		});


		const propList = ['Machineroom_num',
			'name',
			'Usage',
			'Empty_U_cfcient',
			'Networking_type',
			'Business_system_name',
			'Business_system_Dispname',
			'User_name',
			'Telephone'];
		const spotsList = ['u','power','electric_socket'];
		const getParams = (pageInx, pageSize, prop, order) => {
			const terms = [];
			// fix: 动态属性
			if (queryInfo.Machineroom_num) {
				terms.push({
					field: 'properties.Machineroom_num',
					value: `%${queryInfo.Machineroom_num}%`,
					operator: 'like',
				});
			}
			if (queryInfo.name) {
				terms.push({
					field: 'location_cn',
					value: `%/%${queryInfo.name}%`,
					operator: 'like',
				});
			}
			if (queryInfo.Usage) {
				terms.push({
					field: 'properties.Usage',
					value: queryInfo.Usage,
					operator: 'eq',
				});
			}
			if (queryInfo.Empty_U_cfcient) {
				terms.push({
					field: 'properties.Empty_U_cfcient',
					value: queryInfo.Empty_U_cfcient,
					operator: 'eq',
				});
			}
			if (queryInfo.Networking_type) {
				terms.push({
					field: 'properties.Networking_type',
					value: queryInfo.Networking_type,
					operator: 'eq',
				});
			}
			if (queryInfo.Business_system_name) {
				terms.push({
					field: 'properties.Business_system_name',
					value: `%${queryInfo.Business_system_name}%`,
					operator: 'like',
				});
			}
			if (queryInfo.Business_system_Dispname) {
				terms.push({
					field: 'properties.Business_system_Dispname',
					value: `%${queryInfo.Business_system_Dispname}%`,
					operator: 'like',
				});
			}
			if (queryInfo.User_name) {
				terms.push({
					field: 'properties.User_name',
					value: `%${queryInfo.User_name}%`,
					operator: 'like',
				});
			}
			if (queryInfo.Telephone) {
				terms.push({
					field: 'properties.Telephone',
					value: `%${queryInfo.Telephone}%`,
					operator: 'like',
				});
			}
			// fix: 测点属性
			if (queryInfo.u) {
				terms.push({
					field: 'spots.u',
					value: queryInfo.u,
					operator: 'eq',
				});
			}
			if (queryInfo.power) {
				terms.push({
					field: 'spots.power',
					value: queryInfo.power,
					operator: 'eq',
				});
			}
			if (queryInfo.electric_socket) {
				terms.push({
					field: 'spots.electric_socket',
					value: queryInfo.electric_socket,
					operator: 'eq',
				});
			}
			// fix: 正常属性
			if (queryInfo.device_num) {
				terms.push({
					field: 'device_num',
					value: `%${queryInfo.device_num}%`,
					operator: 'like',
				});
			}
			if (
				queryInfo.device_type_cn &&
				Array.isArray(queryInfo.device_type_cn) &&
				queryInfo.device_type_cn.length
			) {
				terms.push({
					field: 'device_type',
					value: `${queryInfo.device_type_cn.toString().split(',').pop()}.%`,
					operator: 'like',
				});
			}
			if (queryInfo.department) {
				terms.push({
					field: 'department',
					value: queryInfo.department,
					operator: 'eq',
				});
			}
			if (queryInfo.owner) {
				terms.push({
					field: 'owner',
					value: queryInfo.owner,
					operator: 'eq',
				});
			}
			if (queryInfo.description) {
				terms.push({
					field: 'description',
					value: queryInfo.description,
					operator: 'eq',
				});
			}
			if (queryInfo.create_date) {
				terms.push({
					field: 'create_date',
					value: dayjs(queryInfo.create_date).format('YYYY-MM-DD HH:mm:ss'),
					operator: 'lte',
				});
			}

			const termsList2 = [];
			if (queryInfo.use_unit) {
				termsList2.push({
					field: 'use_unit',
					value: queryInfo.use_unit,
					operator: 'eq',
				});
			}
			if (queryInfo.system_name) {
				termsList2.push({
					field: 'system_name',
					value: queryInfo.system_name,
					operator: 'eq',
				});
			}

			return {
				where: [
					{
						terms: [
							{ field: 'ci_type', value: '2', operator: 'eq' },
							{ field: 'device_type', value: '1.%', operator: 'like' },
							{ field: 'location', value: 'project_root%', operator: 'like' },
							...terms,
						],
					},
				],
				where2: termsList2.length?[{ terms: [ ...termsList2 ]}]:[],
				page: { number: pageInx, size: pageSize },
				sorts:  prop && order ? 
					[{ field: propList.includes(prop)?`properties.${prop}`:spotsList.includes(prop)?`spots.${prop}`:prop, type: order === 'ascending' ? 'ASC' : 'DESC'}]:
					 [{ field: 'create_date', type: 'DESC' }],
				translate: 1,
			};
		};

		// 获取动态属性
		const findTrendFields = (row)=>{
			const list = Object.entries(row).map(arr=>arr[0]);
			resInfo.trendFields = [
				...list.filter(it => it.startsWith('system_name')).sort((a, b) => a.slice(-1) - b.slice(-1)).map((it, inx) => ({
					label: `虚拟机${it.slice(-1)}`,
					prop: it,
					index: inx * 2
				})),
				...list.filter(it => it.startsWith('use_unit')).sort((a, b) => a.slice(-1) - b.slice(-1)).map((it, inx) => ({
					label: `虚拟机使用单位${it.slice(-1)}`,
					prop: it,
					index: inx * 2 + 1
				}))
			].sort((a, b) => a.index - b.index);
		};

		const findTrendFieldsByNum = (count)=>{
			if(isNaN(Number(count))) return;
			resInfo.trendFields = [];
			for(let i=0; i<count; i++){
				resInfo.trendFields.push({label:`虚拟机${i+1}`,prop: `system_name${i+1}`});
				resInfo.trendFields.push({label:`虚拟机使用单位${i+1}`,prop: `use_unit${i+1}`});
			}
		};

		// 列表接口
		const tableHandler = async (prop, order) => {
			try {
				loadingInfo.loading = true;
				const res = await axios.post(
					'/dcim/space/getAssetList',
					getParams(pageInfo.currentPage, pageInfo.pageSize, prop, order)
				);
				if (res.status === 200) {
					resInfo.tableData = res.data.data || [];
					pageInfo.total = res.data.total;
					// findTrendFields(resInfo.tableData[0]);
					findTrendFieldsByNum(res.data.vmCount);
				}
			} catch (error) {
				console.log(error);
				resInfo.tableData = [];
				// findTrendFieldsByNum(4);
			} finally {
				loadingInfo.loading = false;
			}
		};
		// 统计接口
		const tableStatHandler = async () => {
			try {
				loadingInfo.loading1 = true;
				const res = await axios.post(
					`/dcim/space/assetListDetail?userName=${queryInfo.userName}`,
					getParams(pageInfo.currentPage, 100000)
				);
				if (res.data.status === 200) {
					resInfo.tableStatData = res.data.result;
				}
			} catch (error) {
				console.log(error);
			} finally {
				loadingInfo.loading1 = false;
			}
		};

		const sortChange = ({ prop, order }) =>{
			tableStatHandler();
			tableHandler(prop, order);
		};

		const onSearch = () => {
			tableStatHandler();
			tableHandler();
		};
		const onExportAll = () => {
			loadingInfo.loading = true;
			const params = getParams();
			delete params.page;
			exportHandler('/dcim/space/exportAssetList', params, () => (loadingInfo.loading = false));
		};
		const onExportMuti = () => {
			if (!resInfo.selectedData.length) {
				ElMessage.warning('请选择要导出的数据！');
				return;
			}
			const params = getParams();
			delete params.page;
			params.where = [
				{
					terms: [
						{
							field: 'resource_id',
							value: resInfo.selectedData.map((it) => it.resource_id),
							operator: 'in',
						},
					],
				},
			];
			exportHandler('/dcim/space/exportAssetList', params);
		};

		// 分页
		watch([() => pageInfo.pageSize, () => pageInfo.currentPage], () => {
			tableStatHandler();
			tableHandler();
		});

		watchEffect(() => {
			console.log(1111);
		});

		onMounted(() => {
			tableHandler();
			tableStatHandler();
		});

		console.log(useGetOptions());


		// 字段展示
		const checkAllColumns = ref(false);
		const isIndeterminateColumns = ref(true);
		const checkedColumns = ref([...tableColumns.value.filter(col=>col.show).map(col=>col.label)]);

		let lastTableColumns = window.localStorage.getItem('assetSearch_tableColumns');
		if(lastTableColumns){
			lastTableColumns = JSON.parse(lastTableColumns) || [];
			checkAllColumns.value = tableColumns.value.length ===lastTableColumns.length;
		}
		if(Array.isArray(lastTableColumns)&&lastTableColumns.length){
			tableColumns.value = lastTableColumns;
		}

		const handleColumnsCheckAllChange = (val) => {
			checkedColumns.value = val ? tableColumns.value.map(col=>col.label) : [];
			isIndeterminateColumns.value = false;

			tableColumns.value.forEach(col=>{
				col.show=checkedColumns.value.includes(col.label)?true:false;
			});
			window.localStorage.setItem('assetSearch_tableColumns', JSON.stringify(tableColumns.value));
		};
		const handleCheckedColumnsChange = (list) => {
			const checkedCount = list.length;
			checkAllColumns.value = checkedCount === tableColumns.value.length;
			isIndeterminateColumns.value = checkedCount > 0 && checkedCount < tableColumns.value.length;
			
			list.length && tableColumns.value.forEach(col=>{
				col.show=list.includes(col.label)?true:false;
			});
			window.localStorage.setItem('assetSearch_tableColumns', JSON.stringify(tableColumns.value));
		};

		let reflushTable = ref(true);
		const columnsDropHandler = ()=>{
			const tbody = document.querySelector('.custom-popper-class .el-checkbox-group');
			Sortable.create(tbody, {
				draggable:'.dragItem',
				animation: 1000,
				handle: '.move',
				onEnd: ({newIndex,oldIndex})=>{
					reflushTable.value=false;
					[tableColumns.value[newIndex],tableColumns.value[oldIndex]]=[tableColumns.value[oldIndex],tableColumns.value[newIndex]];
					console.log(tableColumns.value);
					setTimeout(()=>{
						reflushTable.value=true;
						handleCheckedColumnsChange([]);
					},100);
				}
			});
		};

		return {
			queryInfo,
			...toRefs(pageInfo),
			...toRefs(loadingInfo),
			...toRefs(useGetOptions()),
			...toRefs(useCustomFields()),
			props,
			resInfo,
			onSearch,
			sortChange,
			onExportAll,
			onExportMuti,
			tableColumns,
			checkedColumns,
			handleCheckedColumnsChange,
			columnsDropHandler,
			reflushTable,
			checkAllColumns,isIndeterminateColumns,handleColumnsCheckAllChange
		};
	},
};
</script>

<style lang="less" scoped>
@import 'src/css/conponents.less';
@background: #051b3d;
@comp-background: #09367a;
@form-item-width: 180px;

.home {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 10px;
	background: @background;
	overflow: hidden;

	> header {
		.query-row {
			display: flex;
			padding-bottom: 10px;
			flex-wrap: wrap;
			align-items: center;
			.query-row-item {
				display: flex;
				flex-direction: column;
				align-content: flex-start;
				align-items: flex-start;
				background: @background;
				color: #98c9de;
				font-size: 14px;
				padding: 0 5px;
				> span {
					display: inline-block;
					padding: 5px 0 2px;
				}
			}
		}
		.btn-row {
			display: flex;
			justify-content: flex-end;
		}
	}
	> section {
		padding: 10px 0;
		background: @background;
		overflow: hidden;
		.pagenation {
			display: flex;
			justify-content: flex-end;
			padding: 10px 5px;
		}
	}
}

::v-deep(section) {
	.el-table {
		--el-table-header-bg-color: @background;
		--el-table-tr-bg-color: @background;
		--el-fill-color-lighter: #0d2156;
		--el-table-bg-color: @background;
		--el-table-row-hover-bg-color: #0d2156;
		--el-table-border-color: @comp-background;
		--el-text-color-secondary: #9ce1fc;
	}

	.el-pagination__sizes .is-first {
		margin: 0 5px;
	}
	.el-pagination--small .btn-next,
	.el-pagination--small .btn-prev,
	.el-pagination--small .el-pager li {
		margin: 0 1px;
	}

	.table-header th {
		background-color: @background !important;
		height: 40px !important;
		border-top: 1px solid @comp-background !important;
	}

	.el-table th,
	.el-table td {
		padding: 0px !important;
		height: 40px !important;
	}

	.el-table__header-wrapper {
		border-top: 1px solid @comp-background;
	}
	.el-table thead {
		// color: #606266;
		filter: blur(0.3px);
		color: #fff;
	}
}

::v-deep(header) {
	.el-input,
	.el-select,
	.el-input-number {
		--el-fill-color-blank: @background;
		--el-fill-color-regular: @background;
		--el-border-color: @comp-background;
		--el-border: 1px solid #554f4f;
		width: @form-item-width;
	}
}
::v-deep(#app) {
	.el-popper.is-light {
		--el-bg-color-overlay: @background;
		--el-border-color-light: @comp-background;
	}
	.el-popper.is-light {
		background: @background;
		border: 1px solid @comp-background;
	}
}
</style>
