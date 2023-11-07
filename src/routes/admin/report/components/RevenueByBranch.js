import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

export function RevenueByBranch({ dataChart = [], chartType }) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: dataChart.map((i) => i.branchName),
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Doanh thu',
        type: 'bar',
        barWidth: '60%',
        data: chartType === 'real-money' ? dataChart.map((i) => i.paidAmount) : dataChart.map((i) => i.receiptAmount),
      },
    ],
  };

  return <ReactEcharts option={option} echarts={echarts} />;
}

// option = {
//   legend: {},
//   tooltip: {},
//   dataset: {
//     dimensions: ['product', '2015', '2016', '2017'],
//     source: [
//       { product: 'Matcha Latte', 2015: 43.3, 2016: 85.8, 2017: 93.7 },
//       { product: 'Milk Tea', 2015: 83.1, 2016: 73.4, 2017: 55.1 },
//       { product: 'Cheese Cocoa', 2015: 86.4, 2016: 65.2, 2017: 82.5 },
//       { product: 'Walnut Brownie', 2015: 72.4, 2016: 53.9, 2017: 39.1 },
//        { product: 'Matcha Latte 2', 2015: 43.3, 2016: 85.8, 2017: 93.7 },
//       { product: 'Milk Tea 3', 2015: 83.1, 2016: 73.4, 2017: 55.1 },
//       { product: 'Cheese Cocoa 4', 2015: 86.4, 2016: 65.2, 2017: 82.5 },
//       { product: 'Walnut Brownie 3', 2015: 72.4, 2016: 53.9, 2017: 39.1 }
//     ]
//   },
//   xAxis: { type: 'category',axisTick: { show: true },
//         axisLabel: {
//           rotate: 30,
//           interval: 0, // display all axis labels
//           width: 'auto', // let axis labels wrap to multiple lines
//           textStyle: {
//             fontSize: 12, // set a smaller font size to fit longer labels
//           },

//         }, },
//   yAxis: {},
//   // Declare several bar series, each will be mapped
//   // to a column of dataset.source by default.
//   series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
// };
