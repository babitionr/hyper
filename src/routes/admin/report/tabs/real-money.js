import { DatePicker } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { formatCurrency } from 'utils';
import { ReportService } from 'services/report';
import moment from 'moment';
import { RevenueByBranch } from '../components/RevenueByBranch';
import { HookDataTable } from 'hooks';
import { fortmatType } from 'utils/constants';
import { columnRealMoneyByBrahch } from '../columns/ColumnRealMoneyByBranch';

function Page({ type }) {
  const organizationUuid = localStorage.getItem('keyOrganizationUuid');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFiler] = useState({
    startDate: moment().startOf('months').utc().format(fortmatType.formatDateTimeSend),
    endDate: moment().endOf('months').utc().format(fortmatType.formatDateTimeSend),
  });
  const [listRecept, setListRecept] = useState([]);

  const calculateSummary = useCallback(() => {
    const total = listRecept.reduce((a, b) => a + b.paidAmount, 0);
    return {
      total,
    };
  }, [listRecept]);

  // useEffect(() => {
  //   const getReceiptList = async () => {
  //     try {
  //       const res = await ReportService.listRevenueByBranch({ startDate: filter.startDate, endDate: filter.endDate },organizationUuid)
  //       setListRecept(res.data ?? [])
  //     } catch (error) {
  //       console.log('error: ', error);
  //     }
  //   }
  //   getReceiptList()
  // },
  //   [location.pathname, filter.startDate, filter.endDate]);

  useEffect(() => {
    handleChange();
  }, [filter.startDate, filter.endDate]);

  const [handleChange, DataTable] = HookDataTable({
    isLoading,
    setIsLoading,
    showSearch: false,
    columns: columnRealMoneyByBrahch({}),
    showPagination: false,
    loadFirst: false,
    Get: async (params) => {
      const res = await ReportService.listRevenueByBranch(
        { startDate: filter.startDate, endDate: filter.endDate },
        organizationUuid,
      );
      setListRecept(res.data ?? []);

      return {
        data: res.data ?? [],
        count: res.data?.length ?? 0,
      };
    },
  });

  return (
    <div>
      <DatePicker.RangePicker
        allowClear={false}
        className="w-full sm:w-[300px] h-[42px] !bg-white mb-4"
        value={[moment(filter.startDate).add(7, 'hours'), moment(filter.endDate).add(7, 'hours')]}
        onChange={(v) => {
          if (v === null || v === undefined) {
            setFiler({
              ...filter,
            });
          } else {
            setFiler({
              ...filter,
              startDate: `${moment(v[0]).utc().format(fortmatType.formatDateTimeSend)}`,
              endDate: `${moment(v[1]).utc().format(fortmatType.formatDateTimeSend)}`,
            });
          }
        }}
        placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
        format={'DD/MM/YYYY'}
      />

      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-10">
          <div>
            {' '}
            <h5 className="font-bold text-[#828282] mb-2">BIỂU ĐỒ DOANH THU THEO CHI NHÁNH</h5>
            <h1 className="text-4xl text-[#0B1354] mb-3 font-bold">
              {formatCurrency(calculateSummary().total ?? 0, ' VND')}
            </h1>
          </div>
        </div>
        <RevenueByBranch dataChart={listRecept} chartType="real-money" />
      </div>
      <div>{DataTable()}</div>
    </div>
  );
}

export default Page;
