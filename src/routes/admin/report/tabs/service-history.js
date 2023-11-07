import { HookDataTable } from 'hooks';
import React, { useEffect, useState } from 'react';
// import { exportIcons } from 'utils';
import { useAuth } from 'global';
import { useSearchParams } from 'react-router-dom';
import { ReportService } from 'services/report';
import { ColumnServiceHistory } from '../columns/columnServiceHistory';
import moment from 'moment';
import { Button, DatePicker } from 'antd';
import * as XLSX from 'xlsx';
import { exportIcons } from 'utils';

export const ServiceHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { branchUuid } = useAuth();
  const [searchParams] = useSearchParams();
  const tabName = searchParams?.get('tab') ?? 'report_date';
  const [data, setData] = useState([]);
  const [filterDate, setFilterDate] = useState({
    fromDate: moment().format('YYYY-MM-DD 00:00:01'),
    toDate: moment().format('YYYY-MM-DD 23:59:59'),
  });

  const handleExport = async () => {
    const dataExcel =
      data?.map((i) => ({
        customerCode: i?.customer?.code,
        customerName: i?.customer?.fullName,
        phoneNumber: i?.customer?.phoneNumber,
        content: i?.content,
        doctorConsultant: i?.doctorConsultant,
        doctorImpl: i?.doctorImpl,
        totalAmount: Number(i?.totalAmount ?? 0).toLocaleString('de-DE') + ' VND',
        paidAmount: Number(i?.paidAmount ?? 0).toLocaleString('de-DE') + ' VND',
        balanceAmount: Number(i?.balanceAmount ?? 0).toLocaleString('de-DE') + ' VND',
        paymentType:
          i?.paymentType === 'CASH'
            ? 'Tiền mặt'
            : i?.paymentType === 'BANK'
            ? 'Chuyển khoản ngân hàng'
            : i?.paymentType === 'POS'
            ? 'POS'
            : i?.paymentType === 'INS'
            ? 'Trả góp'
            : '',
      })) ?? [];
    const Heading = [
      [
        'Mã khách hàng',
        'Tên khách hàng',
        'Số điện thoại',
        'Nội dung điều trị',
        'Bác sĩ tư vấn',
        'Bác sĩ thực hiện',
        'Doanh thu',
        'Thực thu',
        'Còn lại',
        'Hình thức thanh toán',
        'Nhóm khách hàng',
        'Nhóm điều trị',
        'Trợ thủ chính',
        'Trợ thủ vòng ngoài',
        'Ngày hẹn',
        'Giờ hẹn',
      ],
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(wb, Heading);
    const wscols = Heading[0]?.map((i) => ({ wch: 20 }));

    // const ws = utils.json_to_sheet(data);
    const ws = XLSX.utils.sheet_add_json(wb, dataExcel, { origin: 'A2', skipHeader: true, skipcolumn: 1 });
    ws['!cols'] = wscols;
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Danh sách bệnh nhân trong ngày ${moment(filterDate?.fromDate).format('DD-MM-YYYY')}.xlsx`);
  };

  const [handleChange, DataTable] = HookDataTable({
    isLoading,
    setIsLoading,
    save: false,
    showSearch: true,
    columns: ColumnServiceHistory({}),
    showPagination: false,
    loadFirst: false,
    yScroll: 'max-content',
    rightHeader: (
      <div className="flex gap-2">
        <DatePicker
          allowClear={false}
          format={'DD/MM/YYYY'}
          className="w-full sm:w-[200px] mb-4 !bg-white"
          defaultValue={moment()}
          onChange={(value) => {
            if (!value) {
              setFilterDate();
            }
            setFilterDate({
              fromDate: moment(value).format('YYYY-MM-DD 00:00:01'),
              toDate: moment(value).format('YYYY-MM-DD 23:59:59'),
            });
          }}
        />
        <Button
          className=" !border-rose-500 border !text-rose-500 !text-base h-10 rounded-lg font-medium flex justify-center items-center px-4 gap-2"
          onClick={() => {
            handleExport();
          }}
        >
          {exportIcons('EXPORT-FILE')}
          Xuất file
        </Button>
      </div>
    ),
    Get: async (params) => {
      const filter = { ...params };
      delete filter?.page;
      delete filter?.perPage;
      delete filter?.filter;
      const res = await ReportService.getServiceHistory({
        ...filter,
        branchUuid,
        fromDate: filterDate?.fromDate,
        toDate: filterDate?.toDate,
        // fromDate: '2023-10-04 00:00:01',
        // toDate: '2023-10-04 20:00:01',
      });
      setData(res);
      console.log('res: ', res);
      return {
        data: res ?? [],
        count: res?.length ?? 0,
      };
    },
  });

  useEffect(() => {
    if (tabName === 'service-history') {
      handleChange();
    }
  }, [tabName, filterDate]);

  return (
    <div>
      <div className=" ">{DataTable()}</div>
    </div>
  );
};
