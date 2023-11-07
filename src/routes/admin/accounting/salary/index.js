import React, { useEffect, useMemo, useState } from 'react';
import './index.less';
import TableData from './components/TableSalary';
import { SalaryService } from 'services/salary';
import moment from 'moment';
import { Message } from 'components';
import { DatePicker, Steps, Input } from 'antd';
import { useLocation } from 'react-router';
const { Step } = Steps;

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState({}); // eslint-disable-line
  const [dataSource, setDataSource] = useState([
    {
      key: 1,
      name: undefined,
    },
  ]);

  const branchUuid = localStorage.getItem('branchUuid');
  const [filterDate, setFilterDate] = useState({
    date: moment(new Date()).startOf('months').add('days', 1).format('YYYY-MM-DD 00:00:00'),
    fromDate: moment().startOf('months').format('YYYY-MM-DD 00:00:00'),
    toDate: moment().endOf('months').format('YYYY-MM-DD 23:59:59'),
  });

  const [search, setSeach] = useState('');

  const dataSearch = useMemo(() => {
    setLoading(true);
    if (search !== '' || search !== undefined || search !== null) {
      const newData = dataSource?.filter((item) => {
        const name = item?.userName?.toLowerCase();
        return name?.indexOf(search.toLowerCase()) !== -1;
      });
      setLoading(false);
      return newData;
    } else {
      setLoading(false);
      return dataSource;
    }
  }, [search, dataSource]);
  const location = useLocation();

  useEffect(() => {
    const checkExistSalary = async () => {
      setLoading(true);
      try {
        const res = await SalaryService.checkExistSalary({ branchUuid, date: filterDate.date });
        if (!res.data) {
          const res_list = await SalaryService.get({
            fromDate: filterDate.fromDate,
            toDate: filterDate.toDate,
            branchUuid,
          });
          setDataSource(
            res_list.data?.map((item, index) => ({
              ...item,
              uuid: null,
              // otherAllowanceAmount: 0,
              // bonusAmount: 0,
              // holidayAllowanceAmount: 0,
              // commissionAmount: 0,
              // fineAmount: 0,
              // taxAmount: 0,
              // socialInsuranceAmount: 0,
              // netIncomeAmount: 0,
              // advanceAmount: 0,
            })),
          );
        } else {
          const res_detail = await SalaryService.getByUuid(res.data);
          setDetail(res_detail.data);
          console.log('res_detail: ', res_detail);
          if (res_detail?.data?.status === 'IN_PROCESS') {
            const res_list = await SalaryService.get({
              fromDate: filterDate.fromDate,
              toDate: filterDate.toDate,
              branchUuid,
            });

            const data = res_list.data?.map((item, index) => {
              const data_detail = res_detail.data?.employeeSalaryDetailDtoList?.filter(
                (i) => i.userUuid === item.userUuid,
              );
              if (data_detail?.length) {
                return {
                  ...item,
                  uuid: data_detail[0].uuid,
                };
              } else {
                return {
                  ...item,
                  uuid: null,
                };
              }
            });
            setDataSource(data);
          } else {
            setDataSource(res_detail.data?.employeeSalaryDetailDtoList ?? []);
          }
        }
      } catch (error) {
        console.log('error: ', error);
      } finally {
        setLoading(false);
      }
    };
    checkExistSalary();
  }, [location.pathname, filterDate]);

  const onChangeFilterMonth = (date, dateString) => {
    setFilterDate((prev) => ({
      ...prev,
      date: moment(date).startOf('months').add('days', 1).format('YYYY-MM-DD 00:00:00'),
      fromDate: moment(date).startOf('months').format('YYYY-MM-DD 00:00:00'),
      toDate: moment(date).endOf('months').format('YYYY-MM-DD 23:59:59'),
    }));
    setDetail({});
  };

  const handleSave = async () => {
    const param = {
      uuid: detail.uuid ?? null,
      branchUuid,
      fromDate: filterDate.fromDate,
      toDate: filterDate.toDate,
      employeeSalaryDetailDtoList: dataSource.map((i) => {
        const tongThuNhap =
          Math.round(i.salaryWorkingAmount ?? 0) +
          Math.round(i.overTimeAmount ?? 0) +
          Math.round(i.treatmentAmount ?? 0) +
          Math.round(i.adviseAmount ?? 0) +
          Math.round(i.definiteAllowanceAmount ?? 0) +
          Math.round(i.otherAllowanceAmount ?? 0) +
          Math.round(i.bonusAmount ?? 0) +
          Math.round(i.holidayAllowanceAmount ?? 0) +
          Math.round(i.commissionAmount ?? 0) -
          Math.round(i.fineAmount ?? 0);
        const thucLinh = tongThuNhap - Math.round(i.socialInsuranceAmount ?? 0) - Math.round(i.taxAmount ?? 0);
        return {
          uuid: i.uuid ?? null,
          userUuid: i.userUuid,
          baseSalary: i.baseSalary ?? 0,
          workingDayQuantity: i.workingDayQuantity ?? 0,
          salaryWorkingAmount: Math.round(i.salaryWorkingAmount ?? 0),
          overTimeHours: i.overTimeHours ?? 0,
          overTimeAmount: Math.round(i.overTimeAmount ?? 0),
          treatmentAmount: Math.round(i.treatmentAmount ?? 0),
          adviseAmount: Math.round(i.adviseAmount ?? 0),
          definiteAllowanceAmount: Math.round(i.definiteAllowanceAmount ?? 0),
          otherAllowanceAmount: Math.round(i.otherAllowanceAmount ?? 0),
          bonusAmount: Math.round(i.bonusAmount ?? 0),
          holidayAllowanceAmount: Math.round(i.holidayAllowanceAmount ?? 0),
          commissionAmount: Math.round(i.commissionAmount ?? 0),
          fineAmount: Math.round(i.fineAmount ?? 0),
          grossIncomeAmount: tongThuNhap ?? Math.round(i.grossIncomeAmoutTotal ?? 0),
          taxAmount: Math.round(i.taxAmount ?? 0),
          socialInsuranceAmount: Math.round(i.socialInsuranceAmount ?? 0),
          netIncomeAmount: thucLinh ?? Math.round(i.netIncomeAmount ?? 0),
          advanceAmount: Math.round(i.advanceAmount ?? 0),
        };
      }),
    };
    console.log('param: ', param);

    return await SalaryService.post(param)
      .then(async (result) => {
        if (result) {
          const res_check = await SalaryService.checkExistSalary({ branchUuid, date: filterDate.date });
          if (!res_check.data) {
            return null;
          } else {
            const res_detail = await SalaryService.getByUuid(res_check.data);
            setDetail(res_detail.data);
            if (res_detail.data?.status === 'IN_PROCESS') {
              const res_list = await SalaryService.get({
                fromDate: filterDate.fromDate,
                toDate: filterDate.toDate,
                branchUuid,
              });
              const data = res_list.data?.map((item, index) => {
                const data_detail = res_detail.data?.employeeSalaryDetailDtoList?.filter(
                  (i) => i.userUuid === item.userUuid,
                );
                if (data_detail?.length) {
                  return {
                    ...item,
                    uuid: data_detail[0].uuid,
                  };
                } else {
                  return {
                    ...item,
                    uuid: null,
                  };
                }
              });
              setDataSource(data);
            } else {
              setDataSource(res_detail.data?.employeeSalaryDetailDtoList ?? []);
            }
          }
          Message.success({ text: 'Lưu thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        }
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  };

  const handleConfirm = async (uuid) => {
    if (!uuid) return null;
    return Message.confirm({
      title: 'Xác nhận bảng lương',
      cancelButtonText: 'Hủy',
      html:
        'Bạn có chắc chắn xác nhận nhận bảng lương ? <br/>' +
        `<p class='text-red-600'>Lưu ý: Bạn sẽ không thể điều chỉnh sau khi xác nhận.</p>`,
      onConfirm: async () => {
        const param = {
          uuid: detail.uuid ?? null,
          branchUuid,
          fromDate: filterDate.fromDate,
          toDate: filterDate.toDate,
          employeeSalaryDetailDtoList: dataSource.map((i) => {
            const tongThuNhap =
              Math.round(i.salaryWorkingAmount ?? 0) +
              Math.round(i.overTimeAmount ?? 0) +
              Math.round(i.treatmentAmount ?? 0) +
              Math.round(i.adviseAmount ?? 0) +
              Math.round(i.definiteAllowanceAmount ?? 0) +
              Math.round(i.otherAllowanceAmount ?? 0) +
              Math.round(i.bonusAmount ?? 0) +
              Math.round(i.holidayAllowanceAmount ?? 0) +
              Math.round(i.commissionAmount ?? 0) -
              Math.round(i.fineAmount ?? 0);
            const thucLinh = tongThuNhap - Math.round(i.socialInsuranceAmount ?? 0) - Math.round(i.taxAmount ?? 0);
            return {
              uuid: i.uuid ?? null,
              userUuid: i.userUuid,
              baseSalary: i.baseSalary ?? 0,
              workingDayQuantity: i.workingDayQuantity ?? 0,
              salaryWorkingAmount: Math.round(i.salaryWorkingAmount ?? 0),
              overTimeHours: i.overTimeHours ?? 0,
              overTimeAmount: Math.round(i.overTimeAmount ?? 0),
              treatmentAmount: Math.round(i.treatmentAmount ?? 0),
              adviseAmount: Math.round(i.adviseAmount ?? 0),
              definiteAllowanceAmount: Math.round(i.definiteAllowanceAmount ?? 0),
              otherAllowanceAmount: Math.round(i.otherAllowanceAmount ?? 0),
              bonusAmount: Math.round(i.bonusAmount ?? 0),
              holidayAllowanceAmount: Math.round(i.holidayAllowanceAmount ?? 0),
              commissionAmount: Math.round(i.commissionAmount ?? 0),
              fineAmount: Math.round(i.fineAmount ?? 0),
              grossIncomeAmount: tongThuNhap ?? Math.round(i.grossIncomeAmoutTotal ?? 0),
              taxAmount: Math.round(i.taxAmount ?? 0),
              socialInsuranceAmount: Math.round(i.socialInsuranceAmount ?? 0),
              netIncomeAmount: thucLinh ?? Math.round(i.netIncomeAmount ?? 0),
              advanceAmount: Math.round(i.advanceAmount ?? 0),
            };
          }),
        };
        const res_create = await SalaryService.post(param);
        if (res_create) {
          return await SalaryService.confirm(uuid).then(async (res) => {
            const res_detail = await SalaryService.getByUuid(uuid);
            setDetail(res_detail.data);
            if (res_detail.data?.status === 'IN_PROCESS') {
              const res_list = await SalaryService.get({
                fromDate: filterDate.fromDate,
                toDate: filterDate.toDate,
                branchUuid,
              });
              const data = res_list.data?.map((item, index) => {
                const data_detail = res_detail.data?.employeeSalaryDetailDtoList?.filter(
                  (i) => i.userUuid === item.userUuid,
                );
                if (data_detail?.length) {
                  return {
                    ...item,
                    uuid: data_detail[0].uuid,
                  };
                } else {
                  return {
                    ...item,
                    uuid: null,
                  };
                }
              });
              setDataSource(data);
            } else {
              setDataSource(res_detail.data?.employeeSalaryDetailDtoList ?? []);
            }
          });
        }

        return true;
      },
    });
  };
  const handleCancel = async (uuid) => {
    if (!uuid) return null;
    return Message.confirm({
      title: 'Hủy phiếu lương',
      cancelButtonText: 'Hủy',
      html:
        'Bạn có chắc chắn muốn hủy phiếu lương ? <br/>' +
        `<p class='text-red-600'>Lưu ý: Khi bạn đã hủy thì sẽ không thể khôi phục lại dữ liệu.</p>`,
      onConfirm: async () => {
        return await SalaryService.cancel(detail?.uuid).then(async (res) => {
          const res_detail = await SalaryService.getByUuid(uuid);
          setDetail(res_detail.data);
          if (res_detail.data?.status === 'IN_PROCESS') {
            const res_list = await SalaryService.get({
              fromDate: filterDate.fromDate,
              toDate: filterDate.toDate,
              branchUuid,
            });
            const data = res_list.data?.map((item, index) => {
              const data_detail = res_detail.data?.employeeSalaryDetailDtoList?.filter(
                (i) => i.userUuid === item.userUuid,
              );
              if (data_detail?.length) {
                return {
                  ...item,
                  uuid: data_detail[0].uuid,
                };
              } else {
                return {
                  ...item,
                  uuid: null,
                };
              }
            });
            setDataSource(data);
          } else {
            setDataSource(res_detail.data?.employeeSalaryDetailDtoList ?? []);
          }
        });
      },
    });
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-lg p-4">
        <div className="flex justify-between pb-4 ">
          <div className="font-semibold text-lg text-black ">{'BẢNG Lương'.toUpperCase()}</div>
          <Steps
            current={detail?.status === 'IN_PROCESS' ? 1 : 2}
            labelPlacement="vertical"
            className="w-full  lg:w-[250px] "
            size="small"
          >
            <Step title="Chờ xác nhận" />
            <Step title="Xác nhận" />
          </Steps>
        </div>
        {/* <div className="p-2">{DataTable()}</div> */}
        <div className="flex justify-between gap-3">
          <div className="search-container">
            <Input.Search
              // value={search}
              placeholder="Tìm kiếm"
              addonAfter={null}
              allowClear
              onChange={(e) => {
                setTimeout(() => {
                  const value = e.target.value;
                  setSeach(value);
                }, 500);
              }}
            />
          </div>
          <div className="flex justify-center gap-3">
            {detail?.status !== 'CONFIRM' ? (
              <button
                className="bg-blue-600 rounded-lg px-4 py-2 text-center hover:bg-blue-400 text-white"
                onClick={() => handleSave()}
              >
                Lưu
              </button>
            ) : null}

            {detail?.uuid && (
              <>
                {detail?.status === 'IN_PROCESS' ? (
                  <button
                    className="bg-rose-500 px-4 py-2 rounded-lg text-center hover:bg-rose-400 text-white"
                    onClick={() => handleConfirm(detail?.uuid)}
                  >
                    Xác nhận
                  </button>
                ) : (
                  <button
                    className="bg-rose-500 px-4 py-2 rounded-lg text-center hover:bg-rose-400 text-white"
                    onClick={() => handleCancel(detail?.uuid)}
                  >
                    Hủy Phiếu
                  </button>
                )}
              </>
            )}

            <DatePicker
              allowClear={false}
              placeholder="MM/YYYY"
              format={'MM/YYYY'}
              className="!w-32 border rounded-lg !bg-white  border-gray-200"
              dropdownClassName="custom-month-picket-accoutning-attentance"
              onChange={onChangeFilterMonth}
              picker="month"
              defaultValue={moment(new Date(), 'MM/YYYY')}
              disabledDate={(current) => {
                return current && current > moment().endOf('day');
              }}
            />
          </div>
        </div>
        <div className="flex justify-between gap-4 table_data">
          <TableData
            filterDate={filterDate}
            className="table_data"
            dataSource={dataSearch?.map((i, idx) => ({ ...i, key: idx + 1 }))}
            setDataSource={setDataSource}
            pageType={'create'}
            loading={loading}
            status={detail?.status ?? 'IN_PROCESS'}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
