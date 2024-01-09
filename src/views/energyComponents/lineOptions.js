export const lineOpsDefault = {
    color: ['#FFB00D', '#29E1E5', '#70BB19', '#55B6FF', '#D951D9'],
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
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
            show: false,
            alignWithLabel: true,
        },
        splitLine: {
            show: true,
        },
        data: ['2021-01', '2021-02', '2021-03', '2021-04', '2021-05', '2021-06', '2021-07'],
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
            interval: 2,
            formatter: (value) => `${value}%`,
        },
    },
    series: [
        {
            name: '功率使用率',
            type: 'line',
            symbol: 'none',
            data: [20, 32, 51, 74, 60, 80, 30],
        },
        {
            name: '机柜使用率',
            type: 'line',
            symbol: 'none',
            data: [20, 32, 10, 54, 10, 20, 30],
        },
    ],
};