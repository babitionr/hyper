import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

export function ReportOverviewChart({ dataChart = [], chartType = 'recept' }) {
  const labelOption = {
    show: true,
    position: 'insideBottom',
    // distance: app.config.distance,
    align: 'left',
    verticalAlign: 'middle',
    rotate: 90,
    formatter: '',
    fontSize: 16,
    rich: {
      name: {},
    },
  };
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['Tiền điều trị', 'Doanh thu', 'Thực thu'],
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
    },
    xAxis: [
      {
        type: 'category',
        axisTick: { show: true },
        axisLabel: {
          rotate: 0,
          interval: 0, // display all axis labels
          width: 'auto', // let axis labels wrap to multiple lines
          // textStyle: {
          //   fontSize: 12, // set a smaller font size to fit longer labels
          // },
          formatter: function (value) {
            return value.length > 12 ? value.substring(0, 10) + '...' : value;
          },
        },
        data: dataChart.map((i) => i.month),
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Tiền điều trị',
        type: 'bar',
        barGap: 0,
        label: labelOption,
        emphasis: {
          focus: 'series',
        },
        data: dataChart.map((i) => i.treatment),
        color: ['#F94144'],
      },
      {
        name: 'Doanh thu',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series',
        },
        data: dataChart.map((i) => i.revenue),
        color: ['#90BE6D'],
      },
      {
        name: 'Thực thu',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series',
        },
        data: dataChart.map((i) => i.realMoney),
        color: ['#2D9CDB'],
      },
    ],
  };

  return <ReactEcharts option={option} echarts={echarts} />;
}
