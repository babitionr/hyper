import React, { useEffect, useRef, useState } from 'react';
import coin1 from 'assets/images/icons/coin.png';
import coin2 from 'assets/images/icons/coin2.png';
import coin3 from 'assets/images/icons/coin3.png';
import { Input, DatePicker } from 'antd';
import { exportIcons, formatCurrency } from 'utils';
import { HookDataTable } from 'hooks';
import { ColumnDebt } from './columns/columnDept';
import CreateDebt from './create';
import { DebtService } from 'services/debt';
import moment from 'moment';
import { Message } from 'components';
import { useSearchParams } from 'react-router-dom';
import { useLocation } from 'react-router';

const { RangePicker } = DatePicker;

function ListDebt({ data }) {
  const timeout = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filterDate, setFilterDate] = useState({
    fromDate: '',
    toDate: '',
  });

  const [totalDept, setTotalDept] = useState();
  const [searchParams] = useSearchParams();
  const idCustomer = searchParams.get('id');

  const getDebt = async () => {
    const res = await DebtService.getAmountDebtTotal({ customerUuid: idCustomer ?? data?.uuid });
    setTotalDept(res);
  };
  const location = useLocation();
  useEffect(() => {
    idCustomer !== null && getDebt();
  }, [location.pathname, idCustomer]);

  const [filterSearch, setFilterSearch] = useState();
  const [handleChange, DataTable] = HookDataTable({
    showSearch: false,
    xScroll: 1600,
    isLoading,
    loadFirst: false,
    setIsLoading,
    Get: async (params) => {
      return await DebtService.get({
        ...params,
        customerUuid: idCustomer,
        fromDate: filterDate.fromDate,
        toDate: filterDate.toDate,
        fullTextSearch: filterSearch,
        isPay: false,
      });
    },
    columns: ColumnDebt({}),
  });
  const [, modalData] = CreateDebt({ handleChange, showModal, setShowModal, data, getDebt });

  useEffect(() => {
    handleChange();
  }, [filterDate, filterSearch]);

  return (
    <div>
      {modalData()}
      <div className="dept">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 ">
          <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-3">
            <img src={coin1} alt="" />
            <div className="text-right">
              <p>Tổng công nợ</p>
              <h3 className="text-base font-bold text-green-600">{formatCurrency(totalDept?.debitTotal, ' VND')}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-3">
            <img src={coin2} alt="" />
            <div className="text-right">
              <p>Tổng thanh toán</p>
              <h3 className="text-base font-bold text-blue-600">{formatCurrency(totalDept?.creditTotal, ' VND')}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-3">
            <img src={coin3} alt="" />
            <div className="text-right">
              <p>Tổng còn nợ</p>
              <h3 className="text-base font-bold text-rose-600">{formatCurrency(totalDept?.balanceTotal, ' VND')}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách phiếu điều trị */}

      <div>
        <h2 className="font-bold text-lg text-zinc-600 my-5">{'Danh sách công nợ'.toUpperCase()}</h2>

        <div className="flex justify-between flex-col md:flex-row items-center md:items-start gap-4">
          <div className="flex items-center flex-col lg:flex-row gap-4">
            <div className="relative h-[40px] w-full sm:!w-[280px] ">
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
              clearIcon={
                <div className="mr-[5px]">
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="close-circle"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
                  </svg>
                </div>
              }
              className="w-full sm:!w-[280px] h-[40px] !bg-white"
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
          <div className="flex items-center flex-col lg:flex-row gap-4">
            {/* <button className="h-[40px] w-[131px] border rounded-[8px] border-rose-500 text-rose-500 flex justify-center items-center ">
              {exportIcons('DOWNLOAD')}
              <span className="ml-[10px]"> Xuất file</span>
            </button> */}
            <button
              onClick={() => {
                if (totalDept.balanceTotal > 0) {
                  setShowModal(true);
                } else {
                  return Message.confirm({
                    text: 'Khách hàng hiện không có nợ.',
                    showConfirmButton: false,
                    title: 'Thông báo',
                  });
                }
              }}
              className="h-[40px] w-[131px] border rounded-[8px] bg-rose-500 text-white flex justify-center items-center "
            >
              Thu nợ
            </button>
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

export default ListDebt;
