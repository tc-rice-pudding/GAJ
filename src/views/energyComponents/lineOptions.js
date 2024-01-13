export const lineOpsDefault = {
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
    },
    grid: {
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: true,
        show:false,
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
        axisLabel:{
            color:"#9CAEC6",
        },
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
    },
    yAxis: {
        type: 'value',
        axisLabel:{
            color:"#9CAEC6",
        },
        splitLine: { // y轴线条样式
            lineStyle: {
                color: 'rgba(127, 127, 127, 1)',
                type: 'dashed', // 线型为虚线
            }
        },
    },
    series: [
        {
            name: '功率使用率',
            type: 'line',
            
            areaStyle: {
                opacity: 0.2
            },
            symbol: 'emptyCircle',
            symbolSize: 6,
            data: [20, 32, 51, 74, 60, 80, 30],
        },
        {
            name: '机柜使用率',
            type: 'line',
            areaStyle: {
                opacity: 0.2
            },
            symbol: 'emptyCircle',
            symbolSize: 6,
            data: [20, 32, 10, 54, 10, 20, 30],
        },{
            name: '单位3',
            type: 'line',
            areaStyle: {
                opacity: 0.2
            },
            symbol: 'emptyCircle',
            symbolSize: 6,
            data: [80, 42, 30, 14, 20, 90, 20],
        },{
            name: '单位4',
            type: 'line',
            areaStyle: {
                opacity: 0.2
            },
            symbol: 'emptyCircle',
            symbolSize: 6,
            data: [87, 22, 56, 54, 35, 20, 45],
        },
    ],
};