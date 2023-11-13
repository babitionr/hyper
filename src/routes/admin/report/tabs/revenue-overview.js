import { DatePicker, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { RevenueGroupCustomer } from '../components/RevenuebyGroupCustomer';
import { columnGroupTreatment } from '../columns/columnGroupTreatment';
import { columnGroupCustomer } from '../columns/columnGroupCustomer';
import { HookDataTable } from 'hooks';
import { fortmatType } from 'utils/constants';
// import moment from 'moment';
import dayjs from 'dayjs';
import { ReportService } from 'services/report';
import { formatCurrency } from 'utils';
import { formatPrice } from 'utils/func';

function RevenueOverview() {
  const branchUuid = localStorage.getItem('branchUuid');
  const [filter, setFilter] = useState({
    fromDate: dayjs().format('YYYY-MM-DD 00:00:00'),
    toDate: dayjs().format('YYYY-MM-DD 00:00:00'),
  });
  const [total, setTotal] = useState({
    totalCustomer: 0,
    totalTreatment: 0,
  });

  const [data, setData] = useState({
    dataCustomer: [],
    dataTreatment: [],
  });
  const [handleChange, DataTableGroupCustomer] = HookDataTable({
    columns: columnGroupCustomer(),
    loadFirst: false,
    showSearch: false,
    xScroll: '100%',
    Get: async (params) => {
      const res = await ReportService.getListRevenueByGroupCustomer({
        ...params,
        branchUuid,
        fromDate: filter.fromDate,
        toDate: filter.toDate,
      });
      setTotal((prev) => ({ ...prev, totalCustomer: res.count }));
      setData((prev) => ({ ...prev, dataCustomer: res.data }));
      return res;
    },
    showPagination: false,
    summary: (data) => {
      const total = data.reduce((a, c) => {
        return a + c.amount;
      }, 0);
      if (data && data.length === 0) return null;
      return (
        <Table.Summary.Row className="bg-gray-100">
          <Table.Summary.Cell align="left">
            <span className="font-bold text-sm">Tổng cộng</span>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="left">
            <span className="font-bold text-sm">{formatPrice(total)}</span>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      );
    },
  });
  const [handleChange2, DataTableGroupTreatment] = HookDataTable({
    columns: columnGroupTreatment(),
    loadFirst: false,
    showSearch: false,
    Get: async (params) => {
      const res = await ReportService.getListRevenueByGroupService({
        ...params,
        branchUuid,
        fromDate: filter.fromDate,
        toDate: filter.toDate,
      });
      setTotal((prev) => ({ ...prev, totalTreatment: res.count }));
      setData((prev) => ({ ...prev, dataTreatment: res.data }));
      return res;
    },
    xScroll: '100%',
    showPagination: false,
    summary: (data) => {
      const total = data.reduce((a, c) => {
        return a + c.amount;
      }, 0);
      if (data && data.length === 0) return null;
      return (
        <Table.Summary.Row className="bg-gray-100">
          <Table.Summary.Cell align="left">
            <span className="font-bold text-sm">Tổng cộng</span>
          </Table.Summary.Cell>
          <Table.Summary.Cell align="left">
            <span className="font-bold text-sm">{formatPrice(total)}</span>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      );
    },
  });
  useEffect(() => {
    handleChange();
    handleChange2();
  }, [filter.fromDate, filter.toDate]);
  console.log(filter);
  // const [pickerValue, setPickerValue] = React.useState(moment(filter.fromDate));
  // React.useEffect(() => {
  //   setTimeout(() => setPickerValue(moment(filter.toDate)));
  // }, []);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 my-5 gap-4">
        <DatePicker.RangePicker
          allowClear={false}
          value={[dayjs(filter.fromDate), dayjs(filter.toDate)]}
          className="w-full sm:w-[300px] h-[42px] !bg-white label-1"
          format={'DD/MM/YYYY'}
          onChange={(date) => {
            if (!date) {
              setFilter((prev) => ({
                ...prev,
                fromDate: dayjs().format(fortmatType.formatDateTimeSend),
                toDate: dayjs().format(fortmatType.formatDateTimeSend),
              }));
              return;
            }
            setFilter((prev) => ({
              ...prev,
              fromDate: dayjs(date[0]).format(fortmatType.formatDateTimeSend),
              toDate: dayjs(date[1]).format(fortmatType.formatDateTimeSend),
            }));
          }}
        />
      </div>
      <div className="grid grid-cols-2 items-start gap- label-1">
        <div className="rounded-xl border border-gray-200">
          <div className="py-6 px-10 border-b border-gray-200 mb-4">
            {' '}
            <h5 className="font-bold text-zinc-600 mb-2">Doanh thu theo nhóm khách hàng</h5>
            <h1 className="text-4xl text-[#0B1354] mb-3 font-bold">{formatCurrency(total.totalCustomer, ' VND')}</h1>
            <p className="text-gray-2">Tổng thu</p>
          </div>
          <RevenueGroupCustomer data={data.dataCustomer} />
          <div className="p-4">{DataTableGroupCustomer()}</div>
        </div>
        <div className="rounded-xl border border-gray-200">
          <div className="py-6 px-10 border-b border-gray-200 mb-4">
            <h5 className="font-bold text-zinc-600 mb-2">Doanh thu theo nhóm điều trị</h5>
            <h1 className="text-4xl text-[#0B1354] mb-3 font-bold">{formatCurrency(total.totalTreatment, ' VND')}</h1>
            <p className="text-gray-2">Tổng thu</p>
          </div>
          <RevenueGroupCustomer data={data.dataTreatment} />
          <div className="p-4">{DataTableGroupTreatment()}</div>
        </div>
      </div>
    </div>
  );
}

export default RevenueOverview;
