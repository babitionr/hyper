import { DatePicker } from 'antd';
import { HookDataTable } from 'hooks';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { exportIcons } from 'utils';
import { ReportService } from 'services/report';
import { useAuth } from 'global';
import { useSearchParams } from 'react-router-dom';
import { ColumnReportAppointmentForSales } from '../columns/columnReportAppointmentForSales';
import * as XLSX from 'xlsx';

export const ReportAppointmentForSales = ({ appointmentScheduleReportOverview, filter, setFilter }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { branchUuid } = useAuth();
  const [searchParams] = useSearchParams();
  const tabName = searchParams?.get('tab') ?? 'doctor';
  const [dataExcel, setDataExcel] = useState([]);

  const [handleChange, DataTable] = HookDataTable({
    isLoading,
    setIsLoading,
    showSearch: false,
    columns: ColumnReportAppointmentForSales({}),
    showPagination: false,
    loadFirst: false,
    Get: async (params) => {
      const res = await ReportService.getAppointmentScheduleReport({
        branchUuid,
        fromDate: filter.fromDate,
        toDate: filter.toDate,
        isDoctor: false,
      });
      setDataExcel(res ?? []);
      return {
        data: res ?? [],
        count: res?.length ?? 0,
      };
    },
  });

  const handleExport = async (data, type) => {
    const dataExcel =
      data?.map((i) => ({
        userName: i.userName,
        totalSchedule: i?.totalSchedule ?? 0,
        totalCameSchedule: i?.totalCameSchedule ?? 0,
        totalNotComeSchedule: i?.totalNotComeSchedule ?? 0,
        totalCancelSchedule: i?.totalCancelSchedule ?? 0,
      })) ?? [];
    const Heading = [['Nhân viên sales', 'Tổng số lịch hẹn', 'Đã thực hiện', 'Chưa thực hiện', 'Đã hủy']];
    const wb = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(wb, Heading);
    const ws = XLSX.utils.sheet_add_json(wb, dataExcel, { origin: 'A2', skipHeader: true, skipcolumn: 1 });
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Thống kê theo nhân viên Sales.xlsx');
  };

  useEffect(() => {
    if (tabName === 'sales') {
      handleChange();
    }
    console.log('tabName: ', tabName);
  }, [filter.fromDate, filter.toDate, tabName]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 max-sm:grid-cols-1 max-sm:gap-y-4 mb-4">
        <div className="border border-gray-200 rounded-xl p-5 text-left h-full">
          <h3 className="text-sm font-semibold text-zinc-600 mb-2 ">Tổng lịch hẹn</h3>
          <p className="text-lg text-amber-500 font-bold">{appointmentScheduleReportOverview?.totalSchedule ?? 0}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 text-left h-full">
          <h3 className="text-sm font-semibold text-zinc-600 mb-2 ">Tổng số lịch hẹn mới</h3>
          <p className="text-lg text-rose-500 font-bold">{appointmentScheduleReportOverview?.totalNewSchedule ?? 0}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 text-left h-full">
          <h3 className="text-sm font-semibold text-zinc-600 mb-2 ">Lịch hẹn bị hủy</h3>
          <p className="text-lg text-blue-500 font-bold">
            {appointmentScheduleReportOverview?.totalCancelSchedule ?? 0}
          </p>
        </div>
        <div className="border border-gray-200 rounded-xl p-5 text-left h-full">
          <h3 className="text-sm font-semibold text-zinc-600 mb-2 ">Tổng số lịch hẹn tái khám</h3>
          <p className="text-lg text-fuchsia-500 font-bold">
            {appointmentScheduleReportOverview?.totalReExaminationSchedule ?? 0}
          </p>
        </div>
      </div>
      <div className="w-full flex justify-between gap-4 flex-row xl:flex-row mb-4">
        <DatePicker.RangePicker
          allowClear={false}
          className="w-full sm:w-[300px] h-[42px] !bg-white"
          value={[moment(filter.fromDate), moment(filter.toDate)]}
          onChange={(v) => {
            console.log('v: ', v);
            if (v === null || v === undefined) {
              setFilter({
                ...filter,
              });
            } else {
              setFilter({
                ...filter,
                fromDate: `${moment(v[0]).format('YYYY-MM-DD 00:00:00')}`,
                toDate: `${moment(v[1]).format('YYYY-MM-DD 23:59:59')}`,
              });
            }
          }}
          placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
          format={'DD/MM/YYYY'}
        />
        <button
          className="active:ring-2 ring-offset-1 !h-[42px] text-center ring-offset-red-300 ring-red-300 flex gap-2 justify-center bg-white !rounded-lg border border-rose-500 text-rose-500 items-center !text-base !font-medium w-[130px] disabled:opacity-50"
          type="button"
          // disabled={dataExcel.length === 0}
          onClick={() => handleExport(dataExcel)}
        >
          {exportIcons('EXPORT-FILE')}
          Xuất file
        </button>
      </div>

      {/* <div className="border border-gray-200 rounded-lg p-4 mb-4"></div> */}
      <div>{DataTable()}</div>
    </div>
  );
};
