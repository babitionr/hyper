import { HookDataTable } from 'hooks';
import React, { useEffect, useState } from 'react';
import { columnReportReceiptDetail } from './columns/columnReportReceiptDetail';
import { useLocation, useSearchParams } from 'react-router-dom';
import { DatePicker } from 'antd';
import './index.less';
import { columnReportPaymentDetail } from './columns/columnReportPaymentDetail';
import { ReportService } from 'services/report';
import dayjs from 'dayjs';

const ReportDateDetail = () => {
  const branchUuid = localStorage.getItem('branchUuid');
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') ?? 'receipt';
  const [isLoading, setIsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(
    location?.state?.dateFilter
      ? dayjs(location?.state?.dateFilter).format('YYYY-MM-DD 00:00:00')
      : dayjs().format('YYYY-MM-DD 00:00:00'),
  );
  const [handleChange, DataTable] = HookDataTable({
    Get: async (params) => {
      const res =
        type === 'receipt'
          ? await ReportService.getDetailRecept({ ...params, branchUuid, date: filterDate })
          : await ReportService.getDetailPayment({ ...params, branchUuid, date: filterDate });
      return { data: res.content ?? [], count: res.totalElements ?? 0 };
    },
    columns: type === 'receipt' ? columnReportReceiptDetail() : columnReportPaymentDetail(),
    loadFirst: false,
    save: false,
    isLoading,
    setIsLoading,
    className: 'head-table data-table',
    showSearch: false,
    leftHeader: (
      <div className="flex">
        <DatePicker
          defaultValue={dayjs(filterDate)}
          format={'DD/MM/YYYY'}
          className="w-full sm:w-[245px] mb-4 bg-white label-1"
          onChange={(date) => {
            if (!date) {
              setFilterDate('');
              return;
            }
            setFilterDate(dayjs(date).format('YYYY-MM-DD 00:00:00'));
          }}
        />
      </div>
    ),
  });
  useEffect(() => {
    handleChange();
  }, [filterDate]);

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-lg p-4">
        <h1 className="text-lg font-bold mb-4 text-gray-900">
          {type === 'receipt' ? 'BÁO CÁO TIỀN THU CHI TIẾT' : type === 'payment' ? 'BÁO CÁO TIỀN CHI CHI TIẾT' : null}
        </h1>
        <div className="p-2">{DataTable()}</div>
      </div>
      <div className="flex justify-start mt-4">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-11 py-2 text-base font-medium  "
          type="button"
          onClick={() => window.history.back()}
        >
          Trở về
        </button>
      </div>
    </div>
  );
};

export default ReportDateDetail;
