import React, { useCallback, useEffect, useState } from 'react';
import { exportIcons, formatCurrency } from 'utils';
import { HookDataTable } from 'hooks';
import { ColumnExpectedRevenue } from '../columns/columnExpectedRevenue';
import { ReportService } from 'services/report';
import moment from 'moment';
import { DatePicker, Select } from 'antd';
import { fortmatType } from 'utils/constants';

function Page({ type }) {
  const [isLoading, setIsLoading] = useState(false);
  const organizationUuid = localStorage.getItem('keyOrganizationUuid');
  const branchUuid = localStorage.getItem('branchUuid');
  // const navigate = useNavigate();
  // const branchUuid = localStorage.getItem('branchUuid');
  const [listDataRevenueByBranch, setListDataRevenueByBranch] = useState([]);
  const [dataSummary, setDataSummary] = useState([]);

  const calculateSummary = useCallback(() => {
    const total = dataSummary.reduce((a, b) => a + b.totalPaymentAmount, 0);
    const payment = dataSummary.reduce((a, b) => a + b.paidAmount, 0);
    const expect = dataSummary.reduce((a, b) => a + b.balanceAmount, 0);

    return { total, payment, expect };
  }, [dataSummary]);

  const [filter, setFiler] = useState({
    branch: branchUuid,
    startDate: moment().startOf('months').utc().format(fortmatType.formatDateTimeSend),
    endDate: moment().endOf('months').utc().format(fortmatType.formatDateTimeSend),
  });

  const performSearch = (data = [], searchTerm = '') => {
    if (!data || data.length === 0) {
      // Handle the case when customers array is undefined or empty
      return;
    }

    const newData = data.filter((customer) => {
      const customerName = customer.createdUserName ? customer.createdUserName?.toLowerCase() : '';
      return customerName.includes(searchTerm?.toLowerCase());
    });

    return newData;
  };

  const [handleChange, DataTable, params] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {},
    }),
    showSearch: true,
    fullTextSearch: 'search',
    save: false,
    isLoading,
    setIsLoading,
    Get: async (params) => {
      const res = await ReportService.expectedRevenueReport(
        {
          startDate: filter.startDate,
          endDate: filter.endDate,
        },
        organizationUuid,
      );
      setListDataRevenueByBranch(res.data ?? []);
      const item = res.data.find((i) => i.branchUuid === filter.branch);
      setDataSummary(item?.saleOrderList ?? []);
      return {
        data: performSearch(item?.saleOrderList, params && params?.search) ?? [],
        count: item?.saleOrderList?.length ?? 0,
      };
    },
    loadFirst: false,
    columns: ColumnExpectedRevenue(),
    showPagination: false,

    rightHeader: (
      <div className="w-full flex justify-end gap-4 flex-col xl:flex-row">
        <Select
          allowClear={false}
          className="w-full sm:w-[300px]"
          showSearch
          value={filter.branch}
          optionFilterProp="children"
          placeholder="Tát cả chi nhánh"
          onChange={(v) => {
            if (!v) {
              setFiler({ ...filter, branch: branchUuid });
            }
            setFiler({ ...filter, branch: v });
          }}
          // onSearch={onSearch}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          options={listDataRevenueByBranch.map((i) => ({ label: i.branchName, value: i.branchUuid }))}
        />

        <DatePicker.RangePicker
          allowClear={false}
          className="w-full sm:w-[300px] h-[42px] !bg-white"
          value={[moment(filter.startDate).add(7, 'hours'), moment(filter.endDate).add(7, 'hours')]}
          onChange={(v) => {
            if (v === null || v === undefined) {
              setFiler({
                ...filter,
                startDate: undefined,
                endDate: undefined,
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
      </div>
    ),
  });
  useEffect(() => {
    handleChange();
  }, [filter.branch, filter.startDate, filter.endDate]);
  useEffect(() => {
    if (params?.search) {
      handleChange();
    }
  }, [params?.search]);

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-[10px] p-4 pb-16">
        <h2 className="font-bold text-lg text-zinc-600 mb-4">DỰ KIẾN DOANH THU</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 max-sm:grid-cols-1 max-sm:gap-y-4 mb-4">
          <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-4">
            <div>{exportIcons('REVENUE_BLUE')}</div>
            <div className="text-right">
              <p className="text-gray-600 font-bold text-sm mb-2">Tổng tiền điều trị</p>
              <h3 className="text-base font-bold text-blue-500">
                {formatCurrency(calculateSummary().total || 0, ' VND')}
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-4">
            <div>{exportIcons('REVENUE_GREEN')}</div>
            <div className="text-right">
              <p className="text-gray-600 font-bold text-sm mb-2">Tổng số thanh toán</p>
              <h3 className="text-base font-bold text-green-600">
                {formatCurrency(calculateSummary().payment || 0, ' VND')}
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-4">
            <div>{exportIcons('REVENUE_RED')}</div>
            <div className="text-right">
              <p className="text-gray-600 font-bold text-sm mb-2">Dự kiến doanh thu</p>

              <h3 className="text-base font-bold text-rose-500">
                {formatCurrency(calculateSummary().expect || 0, ' VND')}
              </h3>
            </div>
          </div>
        </div>
        <div>{DataTable()}</div>
      </div>
    </div>
  );
}

export default Page;
