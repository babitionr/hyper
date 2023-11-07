import React, { useEffect, useMemo, useState } from 'react';
import './index.less';
import { SalaryService } from 'services/salary';
import { formatPrice } from 'utils/func';
import { useLocation } from 'react-router';
import { HookDataTable } from 'hooks';
import { columnTreatmnet } from './column/columnTreatment';
import { columnSupport } from './column/columnSupport';
import { columnAdvise } from './column/columnAdvise';
import moment from 'moment';
import { Spin } from 'components';
// import { Tooltip } from 'antd';
import { ColumnSalary } from './column/columnSalary';

const Page = () => {
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const branchUuid = localStorage.getItem('branchUuid');
  const uuid = urlSearch.get('uuid');
  const month = urlSearch.get('month') ?? new Date();
  const status = urlSearch.get('status') ?? null;
  const [isLoading, setIsLoading] = useState(false);
  const [detail, setDetail] = useState({});

  useEffect(() => {
    if (!status || !month || !uuid) return null;

    const getDetail = async () => {
      setIsLoading(true);
      try {
        const res =
          status === 'IN_PROCESS'
            ? await SalaryService.getDetailSalaryUnconfirmed({
                userUuid: uuid,
                fromDate: moment(month, 'MM/YYYY').startOf('month').format('YYYY-MM-DD 00:00:00'),
                toDate: moment(month, 'MM/YYYY').endOf('month').format('YYYY-MM-DD 23:59:59'),
                branchUuid,
              })
            : await SalaryService.getDetailSalaryConfirmed({ uuid });

        setDetail(res.data);
      } catch (error) {
        console.log('error: ', error);
      } finally {
        setIsLoading(false);
      }
    };
    uuid && getDetail();
  }, [uuid, status, month]);

  const dataTable = useMemo(() => {
    const tongThuNhap =
      Math.round(detail?.salaryWorkingAmount ?? 0) +
      Math.round(detail?.overTimeAmount ?? 0) +
      Math.round(detail?.treatmentAmount ?? 0) +
      Math.round(detail?.adviseAmount ?? 0) +
      Math.round(detail?.definiteAllowanceAmount ?? 0) +
      Math.round(detail?.otherAllowanceAmount ?? 0) +
      Math.round(detail?.bonusAmount ?? 0) +
      Math.round(detail?.holidayAllowanceAmount ?? 0) +
      Math.round(detail?.commissionAmount ?? 0) -
      Math.round(detail?.fineAmount ?? 0);

    const thucLanh = tongThuNhap - Math.round(detail?.taxAmount ?? 0) - Math.round(detail?.socialInsuranceAmount ?? 0);
    const dataTemp = [
      {
        name: 'Tiền ngày công',
        value: Math.round(detail?.salaryWorkingAmount ?? 0),
      },
      {
        name: 'Tiền tăng ca',
        value: Math.round(detail?.overTimeAmount ?? 0),
      },
      {
        name: '% điều trị',
        value: Math.round(detail?.treatmentAmount ?? 0),
      },
      {
        name: '% tư vấn',
        value: Math.round(detail?.adviseAmount ?? 0),
      },
      {
        name: 'Phụ cấp xác định',
        value: Math.round(detail?.definiteAllowanceAmount ?? 0),
      },
      {
        name: 'Phụ cấp khác',
        value: Math.round(detail?.otherAllowanceAmount ?? 0),
      },
      {
        name: 'Thưởng',
        value: Math.round(detail?.bonusAmount ?? 0),
      },
      {
        name: 'Phụ cấp lễ tết',
        value: Math.round(detail?.holidayAllowanceAmount ?? 0),
      },
      {
        name: 'Hoa hồng',
        value: Math.round(detail?.commissionAmount ?? 0),
      },
      {
        name: 'Phạt',
        value: Math.round(detail?.fineAmount ?? 0),
      },
      {
        name: 'Tổng thu nhập',
        value: tongThuNhap,
        isColor: true,
      },
      {
        name: 'Thực lãnh',
        value: thucLanh,
        isColor: true,
      },
      {
        name: 'Tạm ứng',
        value: Math.round(detail?.advanceAmount ?? 0),
        isColor: true,
      },
      {
        name: 'Còn lại',
        value: thucLanh - Math.round(+detail?.advanceAmount ?? 0),
        isColor: true,
      },
    ];

    return dataTemp;
  }, [detail]);

  useEffect(() => {
    handleChange();
    handleChange1();
    handleChange2();
    handleChange3();
  }, [uuid, detail]);

  const [handleChange, DataTable] = HookDataTable({
    save: false,
    columns: ColumnSalary(),
    loadFirst: true,
    isLoading,
    setIsLoading,
    showSearch: false,
    showPagination: false,
    Get: async (params) => {
      return {
        data: dataTable ?? [],
      };
    },
  });
  const [handleChange1, DataTable1] = HookDataTable({
    save: false,
    columns: columnTreatmnet(),
    loadFirst: true,
    isLoading,
    setIsLoading,
    showSearch: false,
    showPagination: false,
    Get: async (params) => {
      return {
        data: detail?.treatmentList ?? [],
      };
    },
  });
  const [handleChange2, DataTable2] = HookDataTable({
    save: false,
    columns: columnAdvise(),
    loadFirst: true,
    showSearch: false,
    showPagination: false,
    isLoading,
    setIsLoading,
    Get: async (params) => {
      return {
        data: detail?.adviseList ?? [],
        count: 0,
      };
    },
  });
  const [handleChange3, DataTable3] = HookDataTable({
    save: false,
    columns: columnSupport(),
    loadFirst: true,
    showSearch: false,
    showPagination: false,
    isLoading,
    setIsLoading,
    Get: async (params) => {
      return {
        data: detail?.allowanceList ?? [],
        count: 0,
      };
    },
  });
  if (isLoading) return <Spin className="h-[200px] w-[200px] flex justify-center items-center" />;
  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-lg p-4">
        <div className="flex justify-between border-b border-blue-50 pb-4 ">
          <div className="font-semibold text-lg text-black ">
            {`Thông tin lương tháng ${month ?? moment().format('MM/YYYY')}`.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full py-4">
          <div className="flex items-center gap-2">
            <p className="text-gray-500">Tên nhân viên: </p>
            <p className="text-gray-400">{detail?.userName ?? ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-500">Chức vụ: </p>
            <p className="text-gray-400">{detail?.userRole ?? ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-500">Mức lương cơ bản: </p>
            <p className="text-gray-400">{formatPrice(detail?.baseSalary) ?? ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-500">Ngày công: </p>
            <p className="text-gray-400">{detail?.workingDayQuantity ?? ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-500">Thuế: </p>
            <p className="text-gray-400">{formatPrice(detail?.taxAmount)}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-gray-500">BHXH: </p>
            <p className="text-gray-400">{formatPrice(detail?.socialInsuranceAmount)}</p>
          </div>
        </div>

        {/* <div className="mb-4">
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40">Tiền ngày công:</span>
            <span>{formatPrice(detail?.salaryWorkingAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40">Tiền tăng ca:</span>
            <span>{formatPrice(detail?.overTimeAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40">% điều trị:</span>
            <span>{formatPrice(detail?.treatmentAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40">% tư vấn:</span>
            <span>{formatPrice(detail?.adviseAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40">Phụ cấp xác định:</span>
            <span>{formatPrice(detail?.definiteAllowanceAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40">Phụ cấp khác:</span>
            <span>{formatPrice(detail?.otherAllowanceAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40">Thưởng:</span>
            <span>{formatPrice(detail?.bonusAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40">Phụ cấp lễ tết:</span>
            <span>{formatPrice(detail?.holidayAllowanceAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40">Hoa hồng:</span>
            <span>{formatPrice(detail?.commissionAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40 text-yellow-600">Phạt</span>
            <span className="text-yellow-600">{formatPrice(detail?.fineAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40 text-rose-600">Tổng thu nhập</span>
            <span className="text-rose-600">{formatPrice(detail?.grossIncomeAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40"><Tooltip title="Thực lãnh = Tổng thu nhập trừ thuế và BHXH">
              <span>Thực lãnh (i):</span>
            </Tooltip></span>
            <span>{formatPrice(detail?.netIncomeAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40">Tạm ứng:</span>
            <span>{formatPrice(detail?.advanceAmount)}</span>
          </p>
          <p className="flex items-center gap-2 mb-2">
            <span className="w-40">Còn lại:</span>
            <span>{formatPrice((+detail?.netIncomeAmount ?? 0) - (+detail?.advanceAmount ?? 0))}</span>
          </p>
        </div> */}
        <div className="mb-4">{DataTable()}</div>

        <div className="mb-4 ">
          <h1 className="text-base font-semibold">Bảng chi tiết phần trăm điều trị</h1>
          {DataTable1()}
        </div>

        <div className="mb-4">
          <h1 className="text-base font-semibold">Bảng chi tiết phần trăm tư vấn</h1>
          {DataTable2()}
        </div>
        <div className="mb-4">
          <h1 className="text-base font-semibold">Bảng chi tiết các khoản phụ cấp xác định</h1>
          {DataTable3()}
        </div>

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
};

export default Page;
