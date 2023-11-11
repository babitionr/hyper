import { DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { exportIcons, formatCurrency, routerLinks } from 'utils';
import { DoctorIncomeChart } from '../components/DoctorIncome';
import { useLocation, useNavigate } from 'react-router';
import { ReportService } from 'services/report';
import moment from 'moment';

function ReportDate({ type }) {
  const navigate = useNavigate();
  const branchUuid = localStorage.getItem('branchUuid');
  const [filterDate, setFilterDate] = useState(moment().format('YYYY-MM-DD 00:00:00'));
  const [dataRevenue, setDataRevenue] = useState();
  const [listRecept, setListRecept] = useState([]);
  const [listExpenseRevenue, setListExpenseRevenue] = useState([]);

  const getDataRevenue = async () => {
    try {
      const res = await ReportService.getDataRevenue({ branchUuid, date: filterDate });
      setDataRevenue(res.data);
    } catch (error) {
      // console.log('error: ', error);
    }
  };

  const getReceiptList = async () => {
    try {
      const res = await ReportService.getReceiptList({ branchUuid, date: filterDate });
      setListRecept(res.data ?? []);
      // console.log(res?.data);
    } catch (error) {
      // console.log('error: ', error);
    }
  };

  const getListExpenseRevenue = async () => {
    try {
      const res = await ReportService.getListExpenseRevenue({ branchUuid, date: filterDate });
      setListExpenseRevenue(res.data ?? []);
    } catch (error) {
      // console.log('error: ', error);
    }
  };
  const location = useLocation();

  useEffect(() => {
    getDataRevenue();
    getReceiptList();
    getListExpenseRevenue();
  }, [location.pathname, filterDate]);

  return (
    <div>
      <DatePicker
        allowClear={false}
        format={'DD/MM/YYYY'}
        className="w-full sm:w-[245px] mb-4 !bg-white"
        defaultValue={moment()}
        onChange={(value) => {
          if (!value) {
            setFilterDate('');
          }
          setFilterDate(moment(value).format('YYYY-MM-DD 00:00:00'));
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 max-sm:grid-cols-1 max-sm:gap-y-4 mb-4">
        <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-4">
          <div>{exportIcons('REVENUE_BLUE')}</div>
          <div className="text-right">
            <p className="text-gray-600 font-bold text-sm mb-2">Số tiền tồn đầu ngày</p>
            <h3 className="text-base font-bold text-blue-500">
              {formatCurrency(dataRevenue?.beginReceiptAmount ?? 0, ' VND')}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-4">
          <div>{exportIcons('REVENUE_GREEN')}</div>
          <div className="text-right">
            <p className="text-gray-600 font-bold text-sm mb-2">Số tiền thu trong ngày</p>
            <h3 className="text-base font-bold text-green-600">
              {formatCurrency(dataRevenue?.receiptAmount ?? 0, ' VND')}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-4">
          <div>{exportIcons('REVENUE_RED')}</div>
          <div className="text-right">
            <p className="text-gray-600 font-bold text-sm mb-2">Số tiền chi trong ngày</p>

            <h3 className="text-base font-bold text-rose-500">
              {formatCurrency(dataRevenue?.paidAmount ?? 0, ' VND')}
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-4">
          <div>{exportIcons('REVENUE_YELLOW')}</div>
          <div className="text-right">
            <p className="text-gray-600 font-bold text-sm mb-2">Số tiền tồn cuối ngày</p>

            <h3 className="text-base font-bold text-yellow-500">
              {formatCurrency(dataRevenue?.endPaidAmount ?? 0, ' VND')}
            </h3>
          </div>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-10">
          <div>
            {' '}
            <h5 className="font-bold text-zinc-600 mb-2">Số tiền thu trong ngày</h5>
            <h1 className="text-4xl text-[#0B1354] mb-3 font-bold">
              {formatCurrency(dataRevenue?.receiptAmount ?? 0, ' VND')}
            </h1>
            <p className="text-gray-2">Tổng thu</p>
          </div>
          <div
            className="text-blue-600 underline text-base cursor-pointer"
            onClick={() =>
              navigate(routerLinks('ReportDateDetail') + `?type=receipt`, { state: { dateFilter: filterDate } })
            }
          >
            Xem chi tiết <i className="las la-angle-right"></i>
          </div>
        </div>
        <DoctorIncomeChart listRecept={listRecept} chartType="recept" />
      </div>
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-10">
          <div>
            {' '}
            <h5 className="font-bold text-zinc-600 mb-2">Số tiền chi trong ngày</h5>
            <h1 className="text-4xl text-[#0B1354] mb-3 font-bold">
              {formatCurrency(dataRevenue?.paidAmount ?? 0, ' VND')}
            </h1>
            <p className="text-gray-2">Tổng chi</p>
          </div>
          <div
            className="text-blue-600 underline text-base cursor-pointer"
            onClick={() =>
              navigate(routerLinks('ReportDateDetail') + `?type=payment`, { state: { dateFilter: filterDate } })
            }
          >
            Xem chi tiết <i className="las la-angle-right"></i>
          </div>
        </div>
        <DoctorIncomeChart listExpenseRevenue={listExpenseRevenue} chartType="payment" />
      </div>
    </div>
  );
}

export default ReportDate;
