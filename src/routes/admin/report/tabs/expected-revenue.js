// import { DatePicker } from 'antd';
import React, { useState } from 'react';
import { exportIcons, formatCurrency } from 'utils';

// import { useNavigate } from 'react-router';
// import { ReportService } from 'services/report';
// import moment from 'moment';
import { HookDataTable } from 'hooks';
import { ColumnExpectedRevenue } from '../columns/columnExpectedRevenue';

function ReportDate({ type }) {
  const [isLoading, setIsLoading] = useState(false);
  // const navigate = useNavigate();
  // const branchUuid = localStorage.getItem('branchUuid');
  // const [filterDate, setFilterDate] = useState(moment().format('YYYY-MM-DD 00:00:00'))
  // const [dataRevenue, setDataRevenue] = useState()

  // useEffect(() => {
  //   const getDataRevenue = async () => {
  //     try {
  //       const res = await ReportService.getDataRevenue({ branchUuid, date: filterDate })
  //       setDataRevenue(res.data)
  //     } catch (error) {
  //       console.log('error: ', error);
  //     }
  //   }
  //   getDataRevenue()
  // }, [location.pathname, filterDate]);

  // useEffect(() => {
  //   const getReceiptList = async () => {
  //     try {
  //       const res = await ReportService.getReceiptList({ branchUuid, date: filterDate })
  //       setListRecept(res.data ?? [])
  //     } catch (error) {
  //       console.log('error: ', error);
  //     }
  //   }
  //   getReceiptList()
  // }, [location.pathname, filterDate]);

  const [, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {},
    }),
    showSearch: true,
    fullTextSearch: 'search',
    save: false,
    isLoading,
    setIsLoading,
    Get: async (params) => {
      return {
        data: [],
        count: 0,
      };
    },
    loadFirst: false,
    columns: ColumnExpectedRevenue(),

    // rightHeader: (

    //   <div className="w-full flex justify-end gap-4 flex-col xl:flex-row">
    //     <Select
    //       allowClear
    //       className="w-full sm:w-[300px]"
    //       showSearch
    //       optionFilterProp="children"
    //       placeholder="Nhà cung cấp"
    //       onChange={(v) => {
    //         setFiler({ ...filter, supplier: v });
    //       }}
    //       // onSearch={onSearch}
    //       filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
    //       options={supplier.map((i) => ({ label: i.name, value: i.uuid }))}
    //     />

    //     <RangePicker
    //       allowClear
    //       className="w-full sm:w-[300px] h-[42px] !bg-white"
    //       // defaultValue={moment(new Date()).format('DD/MM/YYYY')}
    //       onChange={(v) => {
    //         if (v === null || v === undefined) {
    //           setFiler({
    //             ...filter,
    //             startTime: undefined,
    //             endTime: undefined,
    //           });
    //         } else {
    //           setFiler({
    //             ...filter,
    //             startTime: `${moment(v[0]).format('YYYY-MM-DD hh:mm:ss')}`,
    //             endTime: `${moment(v[1]).format('YYYY-MM-DD hh:mm:ss')}`,
    //           });
    //         }
    //       }}
    //       format={'DD/MM/YYYY'}
    //     />
    //   </div>

    // ),
  });

  return (
    <div>
      {/* <DatePicker allowClear={false} format={'DD/MM/YYYY'} className="w-full sm:w-[245px] mb-4 !bg-white" defaultValue={moment()} onChange={(value) => {
        if (!value) {
          setFilterDate('')
        }
        setFilterDate(moment(value).format('YYYY-MM-DD 00:00:00'))
      }} /> */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 max-sm:grid-cols-1 max-sm:gap-y-4 mb-4">
        <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-4">
          <div>{exportIcons('REVENUE_BLUE')}</div>
          <div className="text-right">
            <p className="text-gray-600 font-bold text-sm mb-2">Tổng tiền điều trị</p>
            <h3 className="text-base font-bold text-blue-500">{formatCurrency(0, ' VND')}</h3>
          </div>
        </div>
        <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-4">
          <div>{exportIcons('REVENUE_GREEN')}</div>
          <div className="text-right">
            <p className="text-gray-600 font-bold text-sm mb-2">Tổng số thanh toán</p>
            <h3 className="text-base font-bold text-green-600">{formatCurrency(0, ' VND')}</h3>
          </div>
        </div>
        <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-4">
          <div>{exportIcons('REVENUE_RED')}</div>
          <div className="text-right">
            <p className="text-gray-600 font-bold text-sm mb-2">Dự kiến doanh thu</p>

            <h3 className="text-base font-bold text-rose-500">{formatCurrency(0, ' VND')}</h3>
          </div>
        </div>
      </div>
      <div>{DataTable()}</div>
    </div>
  );
}

export default ReportDate;
