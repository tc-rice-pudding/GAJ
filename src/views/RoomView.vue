<template>
    <div class="room-system-view">
        <div class="title-panel">
            <div class="panel-left">
                <div class="title-iocn"></div>
                <div class="title-font">机房视图</div>
            </div>
        </div>
        <div class="room-switch"></div>
        <section
			ref="tableContainerRef"
			style="height: calc(100% - 180px); overflow: hidden"
			v-loading="loading"
			element-loading-text="Loading..."
			:element-loading-spinner="svg"
			element-loading-svg-view-box="-10, -10, 50, 50"
			element-loading-background="rgba(122, 122, 122, 0.8)"
		>
            <div class="section-center">
                <div class="room-view">

                </div>
                <div class="room-table">
                    <div>
                        <div class="room-count">
                            <div class="item">
                                <span>使用单位</span>
                                <span class="span-gl">{{resInfo.usingUnitObj.userName}}</span>
                            </div>
                            <div class="item">
                                <span>系统名称</span>
                                <span class="span-gl">{{resInfo.usingUnitObj.systemName}}</span>
                            </div>
                        </div>
                        <div class="room-count">
                            <div class="item">
                                <span>机房数量</span>
                                <span class="span-gl">{{resInfo.usingUnitObj.roomCount}}</span>
                            </div>
                            <div class="item">
                                <span>设备数量</span>
                                <span class="span-gl">{{resInfo.usingUnitObj.deviceCount}}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="room-item"  v-for="(room,index) in resInfo.usingUnitObj.roomList" >
                            <div class="item">
                                <span>机房名称</span>
                                <span class="span-gl">{{room.roomName}}</span>
                            </div>
                            <div class="item">
                                <span>机柜数量</span>
                                <span class="span-gl">{{room.cabinetCount}}</span>
                            </div>
                            <div class="item">
                                <span>设备数量</span>
                                <span class="span-gl">{{room.deviceCount}}</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
import { toRefs, reactive, onMounted, watch, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
export default {
	name: 'RoomSystemView',
    setup() {
        // 获取当前路由对象
        const router = useRouter(); 
        //查询参数
		const queryInfo = reactive({
			userName: router.currentRoute._value.query.userName,
			systemName: router.currentRoute._value.query.systemName,
		});
        const resInfo = reactive({
            //右边的使用单位、系统信息
            usingUnitObj:{
                userName:queryInfo.userName,
                systemName:queryInfo.systemName,
                roomCount:0,//机房数量
                deviceCount:0,//设备数量
                roomList:[
                    {
                        roomName:"6F信息机房", 
                        cabinetCount:6, 
                        deviceCount:10,//设备数量
                    },
                    {
                        roomName:"7F信息机房", 
                        cabinetCount:6, 
                        deviceCount:15,//设备数量
                    },
                ],
            },
            //左边的机房视图数据
            currentRoomObj:{
               roomName: '信息机房',
               cabinetCount:0,
               deviceCount:0,
               resourceId:'',
               columnList:[],
               cabinetList:[],
            }
		});
        // 使用单位与系统名称对应的机房设备数量列表以及统计
		const getRoomList = async () => {
			try {
                let params={};
                if(queryInfo.userName){
                    params['userName']=[queryInfo.userName];
                }
                if(queryInfo.systemName){
                    params['systemName']=[queryInfo.systemName];
                }
				const res = await axios.post(`/dcim/custom/room/data`,params);
                resInfo.usingUnitObj.roomCount=res.roomCount;
                resInfo.usingUnitObj.deviceCount=res.deviceCount;
                resInfo.usingUnitObj.roomList = res.roomList;
                if(resInfo.usingUnitObj.roomList.length>0){
                    resInfo.currentRoomObj.roomName=resInfo.usingUnitObj.roomList[0].roomName;
                    resInfo.currentRoomObj.cabinetCount=resInfo.usingUnitObj.roomList[0].cabinetCount;
                    resInfo.currentRoomObj.deviceCount=resInfo.usingUnitObj.roomList[0].deviceCount;
                    resInfo.currentRoomObj.resourceId=resInfo.usingUnitObj.roomList[0].resourceId;
                }
			} catch (error) {
				console.log(error);
			}
		};
        // 获取机房信息
		const getRoomInfo = async () => {
			try {
                let params = {resourceId: resInfo.currentRoomObj.resourceId};
				const res = await axios.post(`/dcim/custom/room/list`,params);
                resInfo.currentRoomObj.columnList=res.columnList;
                resInfo.currentRoomObj.cabinetList=res.cabinetList;
			} catch (error) {
				console.log(error);
			}
		};
        //点击左边的机房信息触发事件
        const roomClick = (row) => {
            getRoomInfo();
		};
        //初始化右边的使用单位、系统信息数据
        getRoomList();
        //初始化机房视图数据
        getRoomInfo();
        return {
			queryInfo,
			resInfo,
            roomClick,
		};
    },

};
</script>
<style lang="less" scoped>
  @background: #051b3d;
  .room-system-view{
    width: 100%;
	height: 100%;
	box-sizing: border-box;
	padding: 10px;
	background: @background;
    font-size: 16px;
    font-family: Microsoft YaHei;
    //font-weight: 400;
    color: #C5DFF9;
    .title-panel{
        display: flex;
		flex-direction: row;
		align-items: left;
        width: 100%;
        height: 42px;
        background: linear-gradient(90deg, rgba(0,122,251,0.3), rgba(0,122,251,0.2));
        //opacity: 0.3;
        .panel-left{
            height:100%;
            width:171px;
            height:42px;
            display: flex;
		    flex-direction: row;
		    align-items: left;
            background-image: url('@/assets/images/asset/title-panl.png');
            .title-iocn{
                background-image: url('@/assets/images/asset/title-query.png');
                width:42px;
                height:44px;
            }
            .title-font{
                font-size: 20px;
                font-family: PangMenZhengDaoBiaoTiTiMianFeiBan-4;
                font-weight: 400;
                color: #FFFFFF;
                padding-top:8px;
                padding-left:5px;
            }
        }
    }
    .room-switch{
        height:80px;
        width:100%;
    }
    .section-center{
        width: 100%;
        height:80%;
        display: flex;
		flex-direction: row;
		align-items:center;
        vertical-align: top;
        .room-view{
            width:70%;
            height:100%;
        }
         .room-table{
            width:30%;
            height:100%;
            align-items:center;
            .room-count{
                width:100%;
                height:80px;
                display: flex;
                flex-direction: row;
                align-items:center;
                .item{
                    width:40%;
                    height:50px;
                    display: grid;
                    background-image: url('@/assets/images/asset/number_bg.png');
                    margin:20px;
                    padding:5px;
                    span{
                         width:100%;
                    }
                    .span-gl{
                        color: #2BBDF7;
                    }
                }

            }
            .room-item{
                width:100%;
                height:60px;
                display: flex;
                flex-direction: row;
                align-items:center;
                border-top: solid 1px  #2BBDF7;
                cursor: pointer;
                .item{
                    height:40px;
                    width:30%;
                    display: grid;
                    margin:20px;
                    padding:5px;
                    span{
                         width:100%;
                         padding-bottom: 5px;
                    }
                    .span-gl{
                        color: #2BBDF7;
                        font-family: Microsoft YaHei;
                    }
                }

            }
        }

    }
  }
   
</style>
