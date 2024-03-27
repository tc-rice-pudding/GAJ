<template>
	<!-- 异常能耗机柜 -->
	
	<container-warp>
		<template #title> 异常能耗机柜 </template>
		<template #body>
			<div class="abnormal-energy-cabinet">
				<header>
					<div class="query-item">
						<span>机房</span>
	
						<el-select v-model="queryInfo.floors" style="width: 140px" placeholder="请选择" clearable multiple
							collapse-tags collapse-tags-tooltip>
							<el-option v-for="item in optionMap.roomsOptions" :key="item.value" :label="item.label"
								:value="item.value" />
						</el-select>
					</div>
	
					<div class="query-item">
						<span>机柜编号</span>
	
						<el-input type="text" style="width: 140px" v-model="queryInfo.deviceNum" />
					</div>
	
					<div class="query-item">
						<span>产生原因</span>
	
						<el-select v-model="queryInfo.reasons" style="width: 140px" placeholder="请选择" clearable multiple
							collapse-tags collapse-tags-tooltip>
							<el-option v-for="item in optionMap.reasonsOptions" :key="item.value" :label="item.label"
								:value="item.value" />
						</el-select>
					</div>
	
					<div class="query-item">
						<span>上升/下降</span>
	
						<el-select v-model="queryInfo.sort" style="width: 100px !important" placeholder="请选择" clearable>
							<el-option key="上升" label="上升" value="asc" />
	
							<el-option key="下降" label="下降" value="desc" />
						</el-select>
					</div>
	
					<div class="query-item">
						<span>产生日期</span>
	
						<el-date-picker v-model="queryInfo.timeRange" type="daterange" style="width: 200px"
							range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
							popper-class="custom-date-picker" value-format="YYYY-MM-DD" />
					</div>
	
					<div class="query-item">
						<span>核对日期</span>
	
						<el-date-picker v-model="queryInfo.checkTimeRange" type="daterange" style="width: 200px"
							range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
							popper-class="custom-date-picker" value-format="YYYY-MM-DD" />
					</div>
	
					<el-button class="btn" type="primary" @click="onSearch">查询</el-button>
					<el-button class="btn" type="primary" @click="checkDialog = true">核对</el-button>
					<el-button class="btn" type="primary" @click="sheldDialog = true">屏蔽</el-button>
				</header>
	
				<section ref="tableContainerRef" style="height: calc(100% - 80px); overflow: hidden" v-loading="loading"
					element-loading-text="Loading..." :element-loading-spinner="svg"
					element-loading-svg-view-box="-10, -10, 50, 50" element-loading-background="rgba(122, 122, 122, 0.2)"
					@selection-change="(selectedList)=>selectedData=selectedList"
					>
					<el-table header-row-class-name="table-header" :height="tableHeight" :data="abnormalData" stripe border
						style="width: 100%">
						<el-table-column
							type="selection"
							align="center"
							fixed
							width="50"
							:reserve-selection="true"
						></el-table-column>
						<el-table-column type="index" width="60" label="序号" align="center" />
						<el-table-column prop="deviceNum" label="机柜编号" show-overflow-tooltip min-width="90" align="left" />
						<el-table-column prop="name" label="机房编号" show-overflow-tooltip min-width="90" align="left" />
						<el-table-column prop="avgValue" label="近8天平均功率(W)" show-overflow-tooltip min-width="120" align="left" />
						<el-table-column prop="value" label="昨日平均功率(W)" show-overflow-tooltip min-width="120" align="left" />
						<el-table-column prop="volatility" label="波动率 %" show-overflow-tooltip min-width="90"
							align="center">
							<template v-slot="{ row }">
								<span style="color: #d80000" v-if="(row.volatility || '').includes('上升')">{{ row.volatility
									}}</span>
	
								<span style="color: #2aca6e" v-else>{{ row.volatility }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="time" label="产生日期" show-overflow-tooltip min-width="90" align="left" />
						<el-table-column prop="reason" label="波动原因" show-overflow-tooltip min-width="90" align="left" />
						<el-table-column prop="checkSpec" label="核对说明" show-overflow-tooltip min-width="90" align="left" />
						<el-table-column prop="checkPerson" label="核对人" show-overflow-tooltip min-width="90" align="left" />
						<el-table-column prop="checkTime" label="核对时间" show-overflow-tooltip min-width="90" align="left" />
					</el-table>
					<el-pagination class="pagenation" :current-page="currentPage" :page-size="pageSize"
						:page-sizes="[10, 15, 30, 50, 100]" small="small" layout="sizes, prev, pager, next" :total="total"
						@size-change="handleSizeChange" @current-change="handleCurrentChange" />
				</section>
			</div>
		</template>
	</container-warp>
	
	<el-dialog v-model="checkDialog" title="核对" width="440" class="custom-dialog">
		<div style="display: flex; line-height: 32px; margin-bottom: 10px">
			<label style="width: 80px">波动原因：</label>
			<el-autocomplete v-model="checkInfo.reasion" style="width: 300px; display: flex; align-content: flex-start"
				:fetch-suggestions="querySearch" clearable />
		</div>
		<div style="display: flex; line-height: 32px">
			<label style="width: 80px">核对说明：</label>
			<el-input v-model="checkInfo.checkSpec" style="width: 300px; display: flex; align-content: flex-start"
				:autosize="{ minRows: 2, maxRows: 4 }" type="textarea" />
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="onCheck">确定</el-button>
				<el-button type="primary" @click="checkDialog = false">取消</el-button>
			</div>
		</template>
	</el-dialog>


	<el-dialog v-model="sheldDialog" title="设置屏蔽机柜" width="500" class="custom-dialog">
		<p style="font-size: 18px;">选择机柜，设置数据屏蔽规则，机柜平均功耗将使用屏蔽结束后的数据重新计算</p>
		<div style="display: flex; line-height: 32px; margin-bottom: 10px">
			<label style="width: 80px"><span style="color:red;">*</span>选择机柜：</label>
			<!-- todo -->
			<el-select v-model="sheldInfo.cabinet" style="width: 350px" placeholder="请选择" clearable multiple filterable
							collapse-tags collapse-tags-tooltip>
				<el-option v-for="item in cabinetsOptions" :key="item.value" :label="item.name"
					:value="item.cabinetId" />
			</el-select>
		</div>
		<div style="display: flex; line-height: 32px">
			<label style="width: 80px"><span style="color:red;">*</span>忽略日期：</label>
			<el-date-picker v-model="sheldInfo.timeRange" type="daterange" style="width: 300px"
							range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
							popper-class="custom-date-picker" value-format="YYYY-MM-DD" />
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="primary" @click="onSheld">确定</el-button>
				<el-button type="primary" @click="sheldDialog = false">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script>
import { toRefs, reactive, onMounted, watch, ref, defineComponent } from "vue";
import axios from "axios";
import { useOptions } from "@/views/energyMgr/floor/cabinet.vue";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "AbnormalEnergyCabinet",
  setup() {
    let checkDialog = ref(false);
    let sheldDialog = ref(false);
    const checkInfo = reactive({
      reasion: "",
      checkSpec: "",
    });
    const sheldInfo = reactive({
		cabinetIds:[], 
		timeRange:[]
	});
	let cabinetsOptions = ref([]);
    const queryInfo = reactive({
      deviceNum: "",
      floors: [],
      sort: "",
      timeRange: [],
      checkTimeRange: [],
      reasons: [],
    });

    const abnormalData = ref([
      { volatility: "-10%" },
      { volatility: "10%" },
      { volatility: "50%" },
      { volatility: "-50%" },
      { volatility: "-20%" },
    ]);
    const pageInfo = reactive({
      currentPage: 1,
      pageSize: 50,
      total: 0,
    });
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
				" style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
			`,
    });

    let tableContainerRef = ref(null);
    let tableHeight = ref(500);
    let selectedData = ref([]);
    const getAbnormalInfo = async () => {
      try {
        const [start, end] = queryInfo.timeRange || [];
        const [checkStart, checkEnd] = queryInfo.checkTimeRange || [];
        const {
          data: { total, rows },
        } = await axios.post("/dcim/custom/energy/abnormal/list", {
          page: {
            number: pageInfo.currentPage,
            size: pageInfo.pageSize,
          },
          deviceNum: queryInfo.deviceNum,
          floors: queryInfo.floors,
          sort: queryInfo.sort,
          reasons: queryInfo.reasons,
          startTime: start || "",
          endTime: end || "",
          checkStartTime: checkStart || "",
          checkEndTime: checkEnd || "",
        });
        pageInfo.total = total;
        abnormalData.value = rows || [];
      } catch (error) {
        console.log(error);
      }
    };
    getAbnormalInfo();
	
    const getCabinetsOptions = async () => {
      try {
        const { data } = await axios.post("/dcim/custom/energy/location", {
			spaceType: 8,
			location: 'project_root/0_970/0_971/0_972',
        });
		cabinetsOptions.value = data||[];
      } catch (error) {
        console.log(error);
      }
    };
	getCabinetsOptions();

    const handleSizeChange = (size) => {
      pageInfo.pageSize = size;
      getAbnormalInfo();
    };
    const handleCurrentChange = (inx) => {
      pageInfo.currentPage = inx;
      getAbnormalInfo();
    };

    const onSearch = () => {
      getAbnormalInfo();
    };

    onMounted(() => {
      setTimeout(() => {
        if (tableContainerRef.value) {
          const containerH = tableContainerRef.value.clientHeight - 54; // 减去分页的高度
          tableHeight.value = `${containerH}`;
        }
      }, 100);
    });

    const querySearch = async (queryString, cb) => {
      try {
        const { data } = await axios.post("/dcim/custom/energy/getReason", {
          name: queryString,
        });
        cb(data || []);
      } catch (error) {
        console.log(error);
        cb([]);
      }
    };

    const onSheld = async() => {
		try {
			// fix
			const [start, end] = sheldInfo.timeRange || [];
			const { code } = await axios.post("/dcim/custom/energy/save/ignore", {
				locationDtos: cabinetsOptions.value.filter(it=>sheldInfo.cabinetIds.includes(it.cabinetIds)),
				startTime: start || "",
				endTime: end || "",
			});
			if(code===200){
				ElMessage.success('操作成功');
				sheldInfo.timeRange=[];
				sheldInfo.cabinetIds=[];
      			sheldDialog.value=false;
			}
		} catch (error) {
			console.log(error);
		}
    };

	// 核对
    const onCheck = async() => {
	  if(!selectedData.value.length){
		ElMessage.warning('请选择数据！');
		return;
	  }
	  
	  try {
		const paramsList = selectedData.value.map(it=>({id:it.id,...checkInfo}));
        const { code } = await axios.post("/dcim/custom/energy/update/abnormal", paramsList);
		if(code===200){
			ElMessage.success('操作成功');
			checkInfo.checkSpec='';
			checkInfo.reasion='';
			checkDialog.value=false;
		}
      } catch (error) {
        console.log(error);
      }
    };

    return {
		cabinetsOptions,
      checkDialog,
      sheldDialog,
      queryInfo,
      ...toRefs(pageInfo),
      ...toRefs(loadingInfo),
      ...toRefs(useOptions()),
      onSearch,
      handleSizeChange,
      handleCurrentChange,
      tableContainerRef,
      tableHeight,
	  selectedData,
      onSheld,
      onCheck,
      checkInfo,
	  sheldInfo,
      querySearch,
	  abnormalData,
    };
  },
});
</script>

<style lang="less" scoped>
@import "src/css/conponents.less";

.abnormal-energy-cabinet {
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	font-size: 16px;
	color: #c5dff9;

	>header {
		height: 50px;
		display: flex;
		flex-direction: row;
		align-items: flex-end;
		color: #c5dff9;
		padding: 10px;

		.query-item {
			margin-right: 20px;
			display: flex;
			flex-direction: column;
			align-items: flex-start;

			>span {
				font-size: 16px;
				vertical-align: middle;
				display: inline-block;
				margin-right: 5px;
			}
		}

		.btn {
			width: 80px;
			background: #0576bf;
			border-radius: 4px;
			color: #c5dff9;
			line-height: 30px;
		}
	}

	>section {
		padding: 0 0 10px;
		overflow: hidden;

		.pagenation {
			display: flex;
			justify-content: flex-end;
			padding: 10px 5px;
		}
	}
}

.el-dialog {
	background-color: rgb(160, 207, 255);
}

::v-deep(.root-view) {
	.custom-dialog {
		background: #051b3d;

		.el-dialog__header {
			text-align: left;
		}

		.el-dialog__body {
			padding: 5px;
		}
	}
}
</style>

<style lang="less">
.el-dialog {
	background: #01192e;
	border: 1px solid #005eb1;

	.el-dialog__header {
		text-align: left;

		.el-dialog__title {
			color: #fff;
		}
	}

	.el-dialog__body {
		padding: 10px 20px;
	}
}
</style>
