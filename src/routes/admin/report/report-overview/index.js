import { DatePicker, Select } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { formatCurrency } from 'utils';
import { ReportService } from 'services/report';
import moment from 'moment';
// import { HookDataTable } from 'hooks';
import { fortmatType } from 'utils/constants';
import { ReportOverviewChart } from '../components/ReportOverViewChart';
// import { columnRealMoneyByBrahch } from '../columns/ColumnRealMoneyByBranch';
import './index.less';
import { useLocation } from 'react-router';
function Page({ type }) {
  const organizationUuid = localStorage.getItem('keyOrganizationUuid');
  const branchUuid = localStorage.getItem('branchUuid');

  // const [isLoading, setIsLoading] = useState(false)
  const [filter, setFiler] = useState({
    branch: branchUuid,
    startDate: moment().startOf('months').utc().format(fortmatType.formatDateTimeSend),
    endDate: moment().endOf('months').utc().format(fortmatType.formatDateTimeSend),
  });
  console.log('filter: ', filter);

  const [dataList, setDataList] = useState([]);
  // const [dataItem, setDataItem] = useState({})

  const dataItem = useMemo(() => {
    const item = dataList.find((item) => item.branchUuid === filter.branch);
    return item;
  }, [dataList, filter]);
  const location = useLocation();

  useEffect(() => {
    const getReceiptList = async () => {
      try {
        const res = await ReportService.overviewReport(
          { startDate: filter.startDate, endDate: filter.endDate },
          organizationUuid,
        );
        // setDataItem(item)
        setDataList(res.data ?? []);
      } catch (error) {
        console.log('error: ', error);
      }
    };
    getReceiptList();
  }, [location.pathname, filter.startDate, filter.endDate]);

  // useEffect(() => {
  //   handleChange()
  // }, [filter.startDate, filter.endDate]);

  // const [handleChange, DataTable] = HookDataTable({
  //   isLoading, setIsLoading,
  //   showSearch: false,
  //   columns: columnRealMoneyByBrahch({}),
  //   showPagination: false,
  //   loadFirst: false,
  //   Get: async (params) => {
  //     const res = await ReportService.overviewReport({ startDate: filter.startDate, endDate: filter.endDate }, organizationUuid)
  //     setDataList(res.data ?? [])

  //     return {
  //       data: res.data ?? [],
  //       count: res.data?.length ?? 0,
  //     }
  //   },
  // });

  return (
    <div className="min-h-screen">
      <div className="bg-white p-4 rounded-lg pb-6">
        <h2 className="font-bold text-lg text-zinc-600 mb-4">BÁO CÁO TỔNG QUAN</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center justify-between gap-4 mb-4">
          <div className="border border-gray-200 rounded-xl p-5 text-left h-full">
            <h3 className="text-sm font-normal mb-2 ">Quỹ tiền</h3>
            <p className="text-lg text-amber-500 font-bold">{formatCurrency(dataItem?.cashFund ?? 0, ' ')}</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 text-left h-full">
            <h3 className="text-sm font-normal mb-2 ">Quỹ ngân hàng</h3>
            <p className="text-lg text-fuchsia-500 font-bold">{formatCurrency(dataItem?.bankFund ?? 0, ' ')}</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 text-left h-full">
            <h3 className="text-sm font-normal mb-2 ">Nợ phải thu từ KH</h3>
            <p className="text-lg text-blue-500 font-bold">{formatCurrency(dataItem?.customerDebt ?? 0, ' ')}</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 text-left h-full">
            <h3 className="text-sm font-normal mb-2 ">Nợ phải trả NCC</h3>
            <p className="text-lg text-rose-500 font-bold">{formatCurrency(dataItem?.supplierDebt ?? 0, ' ')}</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 text-left h-full">
            <h3 className="text-sm font-normal mb-2 ">Dự kiến thu</h3>
            <p className="text-lg text-orange-500 font-bold">{formatCurrency(dataItem?.expectedRevenue ?? 0, ' ')}</p>
          </div>
        </div>
        <div className="w-full flex justify-start gap-4 flex-col xl:flex-row mb-4">
          <DatePicker.RangePicker
            allowClear={false}
            className="w-full sm:w-[300px] h-[42px] !bg-white"
            value={[moment(filter.startDate).add(7, 'hours'), moment(filter.endDate).add(7, 'hours')]}
            onChange={(v) => {
              console.log('v: ', v);
              if (v === null || v === undefined) {
                setFiler({
                  ...filter,
                });
              } else {
                setFiler({
                  ...filter,
                  startDate: `${moment(v[0]).startOf('months').utc().format(fortmatType.formatDateTimeSend)}`,
                  endDate: `${moment(v[1]).endOf('months').utc().format(fortmatType.formatDateTimeSend)}`,
                });
              }
            }}
            picker="month"
            placeholder={['MM/YYYY', 'MM/YYYY']}
            format={'MM/YYYY'}
          />
          {/* <DatePicker.RangePicker
            allowClear={false}
            className="w-full sm:w-[300px] h-[42px] !bg-white"
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
          /> */}
          <Select
            allowClear={false}
            value={filter.branch}
            className="w-full sm:w-[300px]"
            showSearch
            optionFilterProp="children"
            placeholder="Tát cả chi nhánh"
            onChange={(v) => {
              if (v === null || v === undefined) {
                setFiler({ ...filter, branch: branchUuid });
                return null;
              }
              setFiler({ ...filter, branch: v });
            }}
            // onSearch={onSearch}
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            options={dataList.map((i) => ({ label: i.branchName, value: i.branchUuid }))}
          />
        </div>

        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-10">
            <div>
              {' '}
              <h5 className="font-bold text-[#828282] mb-2">TIỀN ĐIỀU TRỊ - DOANH THU - THỰC THU</h5>
              {/* <h1 className="text-4xl text-[#0B1354] mb-3 font-bold">{formatCurrency(calculateSummary().total ?? 0, ' VND')}</h1> */}
            </div>
          </div>
          <ReportOverviewChart dataChart={dataItem?.overviewReportItemDtos ?? []} chartType="recept" />
        </div>
        <div>{/* {DataTable()} */}</div>
      </div>
    </div>
  );
}

export default Page;
