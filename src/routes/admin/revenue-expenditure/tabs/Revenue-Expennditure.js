import { HookDataTable } from 'hooks';
import React, { useEffect, useState } from 'react';

import { columnRevenue } from '../columns/columnRevenue';
import '../index.less';
import { columnExpenditure } from '../columns/columnExpenditure';
import { useNavigate } from 'react-router';
import { exportIcons, formatCurrency, routerLinks } from 'utils';
import { DatePicker, Select } from 'antd';
import { RevenueExpenditureService } from 'services/revenue-expenditure';
import moment from 'moment';
import { CalendarService } from 'services/appointment-schedule';
import * as XLSX from 'xlsx';
import classNames from 'classnames';

const { RangePicker } = DatePicker;

const MaterialsLabo = ({ type }) => {
  const [listDoctor, setListDoctor] = useState([]);
  const branchUuid = localStorage.getItem('branchUuid');
  const navigate = useNavigate();
  const [filterDate, setFilterDate] = useState({
    fromDate: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
    toDate: moment(new Date()).format('YYYY-MM-DD 23:59:59'),
  });
  const [filterDoctor, setFilterDoctor] = useState('');
  const [dataExcel, setDataExcel] = useState([]);
  const [totalAmount, setTotalAmount] = useState();

  useEffect(() => {
    const initFetch = async () => {
      try {
        const res = await CalendarService.getListDoctor({ position: 'DOCTOR', branchUuid });
        setListDoctor(res.data);
      } catch (error) {
        return error;
      }
    };
    initFetch();
  }, []);
  useEffect(() => {
    handleChange();
  }, [filterDoctor, filterDate]);

  const handleCreate = () => {
    return navigate(routerLinks('RevenueExpenditureCreate') + `?type=${type}`);
  };
  const handleEdit = (type, uuid) => {
    return navigate(routerLinks('RevenueExpenditureEdit') + `?type=${type}&uuid=${uuid}`);
  };
  const handleDelete = async (uuid) => {
    if (!uuid) return null;
    const res = await RevenueExpenditureService.delete({ uuid }, +type === 1 ? 'thu' : 'chi');
    res && handleChange();
  };

  const handleExport = async (data, type) => {
    const dataExcel =
      +Number(type) === 1
        ? data?.map((i) => ({
            billNumber: i.billNumber,
            note: i.note,
            totalAmount: i?.totalAmount || i?.totalAmount === 0 ? formatCurrency(i?.totalAmount, ' ') : null,
            form:
              i?.form === 'CASH' ? 'Tiền mặt' : i?.form === 'POS' ? 'POS' : i?.form === 'INS' ? 'Trả góp' : 'Ngân hàng',
            createdBy: i?.createdBy,
            billDate: i?.billDate ? moment(i.billDate).format('DD/MM/YYYY HH:mm') : null,
          })) ?? []
        : data?.map((i) => ({
            billNumber: i.billNumber,
            note: i.note,
            groupName: i?.groupName,
            totalAmount: i?.totalAmount || i?.totalAmount === 0 ? formatCurrency(i?.totalAmount, ' ') : null,
            form:
              i?.form === 'CASH' ? 'Tiền mặt' : i?.form === 'POS' ? 'POS' : i?.form === 'INS' ? 'Trả góp' : 'Ngân hàng',
            createdBy: i?.createdBy,
            billDate: i?.billDate ? moment(i.billDate).format('DD/MM/YYYY HH:mm') : null,
          })) ?? [];
    const Heading =
      +Number(type) === 1
        ? [['Mã hóa đơn', 'Nội dung', 'Số tiền đã thu', 'Hình thức', 'Người tạo', 'Ngày tạo']]
        : [['Mã hóa đơn', 'Khoản chi', 'Nhóm chi phí', 'Số tiền đã chi', 'Hình thức', 'Người tạo', 'Ngày tạo']];
    const wb = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(wb, Heading);

    // const ws = utils.json_to_sheet(data);
    const ws = XLSX.utils.sheet_add_json(wb, dataExcel, { origin: 'A2', skipHeader: true, skipcolumn: 1 });
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, +type === 1 ? 'Thu.xlsx' : +type === 2 ? 'Chi.xlsx' : 'Khác.xlsx');
  };

  const [handleChange, DataTable] = HookDataTable({
    loadFirst: false,
    columns:
      +type === 1
        ? columnRevenue({ handleDelete, type, handleEdit })
        : +type === 2
        ? columnExpenditure({ handleDelete, type, handleEdit })
        : null,
    Get: async (params) => {
      const res = await RevenueExpenditureService.getAllExcel({
        ...params,
        page: 0,
        perPage: 0,
        billType: +type === 1 ? 'RECEIPT' : 'PAYMENT',
        branchUuid,
        doctorUuid: filterDoctor,
        fromDate: filterDate.fromDate,
        toDate: filterDate.toDate,
      });
      setDataExcel(res.data);
      setTotalAmount(res.totalAmount);
      return await RevenueExpenditureService.get({
        ...params,
        billType: +type === 1 ? 'RECEIPT' : 'PAYMENT',
        branchUuid,
        doctorUuid: filterDoctor,
        fromDate: filterDate.fromDate,
        toDate: filterDate.toDate,
      });
    },
    save: false,
    rightHeader: (
      <>
        <div className="flex gap-3 flex-col 2xl:flex-row justify-end ">
          <div className="flex gap-3 justify-end">
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
              allowClear
              className={classNames('w-full rounded-lg lg:w-full sm:w-[270px] h-[40px] !bg-white', {
                'lg:!w-[270px]': Number(type) === 1,
              })}
              placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
              // className="items-stretch border rounded-lg !bg-white border-gray-200 !w-80"
              format="DD/MM/YYYY"
              onChange={(dates, dateStrings) => {
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
              defaultValue={[moment(), moment()]}
            />
            {+type === 1 && (
              <Select
                allowClear
                showSearch
                className="!w-[200px] rounded-lg"
                placeholder="Chọn bác sĩ"
                optionFilterProp="children"
                onChange={(v) => setFilterDoctor(v)}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                options={listDoctor.map((i) => ({ label: i.firstName ?? '' + i.lastname ?? '', value: i.id }))}
              />
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              className="active:ring-2 ring-offset-1 h-[40px] text-center ring-offset-red-300 ring-red-300 flex gap-2 justify-center bg-white rounded-lg border border-rose-500 text-rose-500 items-center !text-base !font-medium w-[170px] disabled:opacity-50"
              type="button"
              disabled={dataExcel.length === 0}
              onClick={() => handleExport(dataExcel, type)}
            >
              {exportIcons('EXPORT-FILE')}
              Xuất file
            </button>
            {+type === 1 ? (
              <button
                className="active:ring-2 ring-offset-1 h-[40px] ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500 items-center !text-base !font-medium w-[170px]"
                type="button"
                onClick={() => handleCreate()}
              >
                <i className="las la-plus mr-1" />
                Thêm phiếu thu
              </button>
            ) : +type === 2 ? (
              <button
                className="active:ring-2 ring-offset-1 h-[40px] ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500 items-center !text-base !font-medium px-4"
                type="button"
                onClick={() => handleCreate()}
              >
                <i className="las la-plus mr-1" />
                Thêm phiếu chi
              </button>
            ) : null}
          </div>
        </div>
      </>
    ),
    subHeader: () => (
      <>
        <div className="w-full flex flex-col items-end">
          <div className="min-w-[300px] my-5">
            <div className="flex items-center justify-between w-full flex-col sm:flex-row">
              <p className="text-[#6B7280] font-medium">{+type === 1 ? 'Tổng tiền đã thu:' : 'Tổng tiền đã chi:'}</p>
              <p className="text-[#4B5563] font-semibold">{formatCurrency(totalAmount ?? 0, ' VND')}</p>
            </div>
          </div>
        </div>
      </>
    ),
  });

  return (
    <div className="laboParameter" id="laboParameter">
      <div className="">
        <div>{DataTable()}</div>
      </div>
    </div>
  );
};

export default MaterialsLabo;
