import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

export function RevenueGroupCustomer({ data = [] }) {
  const option = {
    title: {
      // text: 'Weather Statistics',
      // subtext: 'Fake Data',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      // formatter: '{a} <br/>{b} : {c} ({d}%)'
      formatter: '{b} : {c} ({d}%)',
    },
    legend: {
      bottom: 0,
      left: 'center',
      data: data?.map((i) => i.name),
    },
    series: [
      {
        type: 'pie',
        radius: '65%',
        center: ['50%', '50%'],
        selectedMode: 'single',
        data: data?.map((i) => ({ name: i.name, value: i.amount })),
        // data: [
        //   {
        //     value: 1548,
        //     name: 'CityE',
        //     // label: {
        //     //   formatter: [
        //     //     '{title|{b}}{abg|}',
        //     //     '  {weatherHead|Weather}{valueHead|Days}{rateHead|Percent}',
        //     //     '{hr|}',
        //     //     '  {Sunny|}{value|202}{rate|55.3%}',
        //     //     '  {Cloudy|}{value|142}{rate|38.9%}',
        //     //     '  {Showers|}{value|21}{rate|5.8%}'
        //     //   ].join('\n'),
        //     //   backgroundColor: '#eee',
        //     //   borderColor: '#777',
        //     //   borderWidth: 1,
        //     //   borderRadius: 4,
        //     //   rich: {
        //     //     title: {
        //     //       color: '#eee',
        //     //       align: 'center'
        //     //     },
        //     //     abg: {
        //     //       backgroundColor: '#333',
        //     //       width: '100%',
        //     //       align: 'right',
        //     //       height: 25,
        //     //       borderRadius: [4, 4, 0, 0]
        //     //     },
        //     //     Sunny: {
        //     //       height: 30,
        //     //       align: 'left',
        //     //       // backgroundColor: {
        //     //       //   image: weatherIcons.Sunny
        //     //       // }
        //     //     },
        //     //     Cloudy: {
        //     //       height: 30,
        //     //       align: 'left',
        //     //       // backgroundColor: {
        //     //       //   image: weatherIcons.Cloudy
        //     //       // }
        //     //     },
        //     //     Showers: {
        //     //       height: 30,
        //     //       align: 'left',
        //     //       // backgroundColor: {
        //     //       //   image: weatherIcons.Showers
        //     //       // }
        //     //     },
        //     //     weatherHead: {
        //     //       color: '#333',
        //     //       height: 24,
        //     //       align: 'left'
        //     //     },
        //     //     hr: {
        //     //       borderColor: '#777',
        //     //       width: '100%',
        //     //       borderWidth: 0.5,
        //     //       height: 0
        //     //     },
        //     //     value: {
        //     //       width: 20,
        //     //       padding: [0, 20, 0, 30],
        //     //       align: 'left'
        //     //     },
        //     //     valueHead: {
        //     //       color: '#333',
        //     //       width: 20,
        //     //       padding: [0, 20, 0, 30],
        //     //       align: 'center'
        //     //     },
        //     //     rate: {
        //     //       width: 40,
        //     //       align: 'right',
        //     //       padding: [0, 10, 0, 0]
        //     //     },
        //     //     rateHead: {
        //     //       color: '#333',
        //     //       width: 40,
        //     //       align: 'center',
        //     //       padding: [0, 10, 0, 0]
        //     //     }
        //     //   }
        //     // }
        //   },

        // ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        color: ['#FC3C00', '#8F643C', '#F765A3', '#A155B9', '#1CFF40', '#FFBE15', '#16BFD6', '#0028FC'],
      },
    ],
  };

  return <ReactEcharts option={option} echarts={echarts} />;
}
