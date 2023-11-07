import { useAuth } from 'global';
import { HookDataTable } from 'hooks';
import React, { useState, useEffect } from 'react';
import { CalendarService } from 'services/appointment-schedule';
// import { exportIcons } from 'utils';
import { ColumnCalendar } from './columns/columnCalendar';
import CreateCalendar from './modal';
import { useSearchParams } from 'react-router-dom';

function Calendar({ data }) {
  const [showModal, setShowModal] = useState(false);
  const uuidRequest = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { branchUuid } = useAuth();

  const [searchParams] = useSearchParams();
  const idCustomer = searchParams.get('id');
  const [handleEdit, AddCalenderModal] = CreateCalendar({ setShowModal, showModal, uuidRequest, dataCustomer: data });
  useEffect(() => {
    if (showModal === false) {
      handleC();
    }
  }, [showModal]);
  const [handleC, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {},
    }),
    showSearch: true,
    save: false,
    fullTextSearch: 'search',
    xScroll: 1600,
    yScroll: true,
    isLoading,
    setIsLoading,
    Get: async (params) => {
      return await CalendarService.get({ ...params, customerUuid: idCustomer }, branchUuid);
    },
    columns: ColumnCalendar({ handleEdit }),
    rightHeader: (
      <div className="flex gap-3">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
          onClick={() => setShowModal(true)}
        >
          <i className="las la-plus mr-1" />
          Thêm mới
        </button>
      </div>
    ),
  });

  return (
    <div>
      <h2 className="font-bold text-lg text-zinc-600 my-5">{'Lịch hẹn'.toUpperCase()}</h2>

      <div className="flex justify-between items-center">
        {/* <div className='flex items-center'>
          <div className="relative h-[42px] w-[315px] mr-4">
            <Input
              placeholder="Tìm kiếm"
              className=" relative !bg-white border border-gray-300 h-[42px] w-full  rounded-[10px] px-3 focus:!shadow-none focus:!outline-none"
            />
            <span className="absolute right-4 top-2.5">
              {exportIcons('SEARCH')}
            </span>
          </div>

        </div> */}
        {/* <div className="flex items-center">
          <button
            onClick={() => setShowModal(true)}
            className="h-[40px] w-[131px] ml-4 border rounded-[8px] bg-rose-500 text-white flex justify-center items-center "
          >
            {' '}
            <i className="las la-plus bold"></i>
            <span className="ml-[10px]"> Thêm mới </span>
          </button>
        </div> */}
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
      {AddCalenderModal()}
    </div>
  );
}

export default Calendar;
