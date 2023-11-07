import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

export function DoctorIncomeChart({ listRecept = [], listExpenseRevenue = [], chartType = 'recept' }) {
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
      data: ['Tiền mặt', 'Chuyển khoản', 'POS', 'Trả góp'],
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
          rotate: 30,
          interval: 0, // display all axis labels
          width: 'auto', // let axis labels wrap to multiple lines
          // textStyle: {
          //   fontSize: 12, // set a smaller font size to fit longer labels
          // },
          formatter: function (value) {
            return value.length > 12 ? value.substring(0, 10) + '...' : value;
          },
        },
        data:
          chartType === 'recept'
            ? listRecept?.map((i) => ({ value: i.doctorName }))
            : listExpenseRevenue?.map((i) => ({ value: i.paymentGroupName })),
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Tiền mặt',
        type: 'bar',
        barGap: 0,
        label: labelOption,
        emphasis: {
          focus: 'series',
        },
        data:
          chartType === 'recept'
            ? [...listRecept.map((i) => i.cashAmount)]
            : [...listExpenseRevenue.map((i) => i.cashAmount)],
        color: ['#F94144'],
      },
      {
        name: 'Chuyển khoản',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series',
        },
        data:
          chartType === 'recept'
            ? [...listRecept.map((i) => i.bankAmount)]
            : [...listExpenseRevenue.map((i) => i.cashAmount)],
        color: ['#90BE6D'],
      },
      {
        name: 'POS',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series',
        },
        data:
          chartType === 'recept'
            ? [...listRecept.map((i) => i.posAmount)]
            : [...listExpenseRevenue.map((i) => i.posAmount)],
        color: ['#3B82F6'],
      },
      {
        name: 'Trả góp',
        type: 'bar',
        label: labelOption,
        emphasis: {
          focus: 'series',
        },
        data:
          chartType === 'recept'
            ? [...listRecept.map((i) => i.insAmount)]
            : [...listExpenseRevenue.map((i) => i.insAmount)],
        color: ['#EAB308'],
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
