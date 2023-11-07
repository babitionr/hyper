import React, { useEffect, useState, useRef } from 'react';
import { Input, DatePicker } from 'antd';
import { exportIcons } from 'utils';
import { HookDataTable } from 'hooks';
import { ColumnHistoryPayment } from './columns/columnHistoryPayment';
import moment from 'moment';
import { DebtService } from 'services/debt';
import { useSearchParams } from 'react-router-dom';
const { RangePicker } = DatePicker;

function PaymentHistory({ data }) {
  const timeout = useRef();
  const [filterSearch, setFilterSearch] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState({
    fromDate: '',
    toDate: '',
  });
  const [searchParams] = useSearchParams();
  const idCustomer = searchParams.get('id');
  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {},
    }),
    showSearch: false,
    xScroll: 1600,
    isLoading,
    loadFirst: false,
    setIsLoading,
    Get: async (params) => {
      return await DebtService.get({
        ...params,
        customerUuid: idCustomer ?? data?.uuid,
        fromDate: filterDate.fromDate,
        toDate: filterDate.toDate,
        fullTextSearch: filterSearch,
        isPay: true,
      });
    },
    columns: ColumnHistoryPayment({}),
  });

  useEffect(() => {
    handleChange();
  }, [filterDate, filterSearch]);

  return (
    <div>
      <div>
        <h2 className="font-bold text-lg text-zinc-600 my-5">{'Lịch sử thanh toán'.toUpperCase()}</h2>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative h-[42px] w-[315px] mr-4">
              <Input
                placeholder="Tìm kiếm"
                className=" relative !bg-white border border-gray-300 h-[42px] w-full  rounded-[10px] px-3 focus:!shadow-none focus:!outline-none"
                onChange={(e) => {
                  clearTimeout(timeout.current);
                  timeout.current = setTimeout(() => {
                    setFilterSearch(e.target.value);
                  }, 500);
                }}
              />
              <span className="absolute right-4 top-2.5">{exportIcons('SEARCH')}</span>
            </div>
            <RangePicker
              className="!w-[315px] h-[42px] !bg-white"
              placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
              format={'DD/MM/YYYY'}
              onChange={(dates) => {
                if (!dates) {
                  setFilterDate((prev) => ({
                    ...prev,
                    fromDate: '',
                    toDate: '',
                  }));
                  return null;
                }
                setFilterDate((prev) => ({
                  ...prev,
                  fromDate: moment(dates[0]).format('YYYY-MM-DD 00:00:00'),
                  toDate: moment(dates[1]).format('YYYY-MM-DD 23:59:59'),
                }));
              }}
            />
          </div>
        </div>

        <div>{DataTable()}</div>
        <div className="mt-6">
          <button
            className="w-[125px] h-[44px] rounded-lg border border-zinc-400 text-center"
            onClick={() => window.history.back()}
          >
            Trở về
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentHistory;
