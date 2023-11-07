import React, { useState, useEffect } from 'react';
import { DatePicker, Form, Input, Select } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import './index.less';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment';
import { formatDate } from 'utils/func';
import { RevenueExpenditureService } from 'services/revenue-expenditure';
import { routerLinks } from 'utils';
import { Message } from 'components';
import { AuthSerivce } from 'services/Auth';
import { SupplierService } from 'services/supplier';
import { PrintAndExportPdf } from './components/printAndExportPdf';
import { PaymentHistoryList } from './components/paymentHistoryList';
import classNames from 'classnames';
import { UploadPaymentBill } from './uploadPaymentBill';
import { toast } from 'react-toastify';
const TableRevenue = React.lazy(() => import('./components/Table'));

function Page() {
  const [form] = Form.useForm();
  const branchUuid = localStorage.getItem('branchUuid');
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const uuid = searchParams.get('uuid') ?? '';
  const [groupCode, setGroupCode] = useState('');
  const pageType =
    location.pathname.split('/').filter(Boolean)[location.pathname.split('/').filter(Boolean).length - 1] ?? '';
  const [data, setData] = useState({});
  const [showPaymentBill, setShowPaymentBill] = useState(false);
  const [paymentBillImageUrl, setPaymentBillImageUrl] = useState('');
  const [groupExpense, setGroupExpense] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [listSupplier, setListSupplier] = useState([]);
  const [dataSource, setDataSource] = useState([
    {
      key: 1,
      note: undefined,
      amount: undefined,
    },
  ]);
  useEffect(() => {
    const getAllGroupExpense = async () => {
      const res = await RevenueExpenditureService.getAllGroupExpense({ branchUuid, type: 'PAYMENT' });
      setGroupExpense(res.data);
    };
    getAllGroupExpense();
  }, [branchUuid]);
  useEffect(() => {
    const getListUser = async () => {
      try {
        const res = await AuthSerivce.getAllUser({ branchUuid });
        setListUser(res.data);
      } catch (error) {
        console.log('error: ', error);
      }
    };
    getListUser();
  }, [location.pathname, branchUuid]);
  useEffect(() => {
    const getListSupplier = async () => {
      try {
        const res = await SupplierService.getAll();
        setListSupplier(res.data);
      } catch (error) {
        console.log('error: ', error);
      }
    };
    getListSupplier();
  }, [location.pathname]);

  useEffect(() => {
    const getDetail = async () => {
      if (uuid) {
        const res = await RevenueExpenditureService.getById(uuid);
        setData({ ...res, billDate: moment(res?.billDate), groupExpense: res?.groupDto?.uuid });
        setDataSource(res?.itemDtoList?.map((i, idx) => ({ ...i, key: idx })) ?? []);
        setGroupCode(res?.groupDto?.code);
        setPaymentBillImageUrl(res?.paidImageUrl ?? '');
        form.setFieldsValue({
          ...res,
          billDate: moment(res?.billDate),
          groupExpense: res?.groupDto?.uuid,
          userUuid: res?.user?.uuid,
          supplierUuid: res?.supplier?.uuid,
        });
      }
    };
    getDetail();
  }, [uuid, location.pathname]);

  const handleSubmit = async () => {
    if (dataSource.filter((i) => i.note === undefined || i.note === null).length) {
      return toast.error(`Vui lòng nhập nội dung trong bảng danh sách tiền ${Number(type) === 1 ? 'thu' : 'chi'}!`);
    }
    if (dataSource.filter((i) => i.amount === undefined || i.amount === null).length) {
      return toast.error(`Vui lòng nhập số tiền trong bảng danh sách tiền ${Number(type) === 1 ? 'thu' : 'chi'}!`);
    }
    try {
      const values = await form.validateFields();
      const param = {
        branchUuid,
        billDate: formatDate(values?.billDate, 'YYYY-MM-DD HH:mm:ss'),
        billType: +type === 1 ? 'RECEIPT' : 'PAYMENT',
        note: values.note,
        form: values.form,
        groupDto:
          +type === 1
            ? null
            : {
                uuid: values.groupExpense,
                code: groupCode,
              },
        user: {
          uuid: values.userUuid ?? null,
        },
        supplier: {
          uuid: values.supplierUuid ?? null,
        },
        customerUuid: null,
        itemDtoList: [...dataSource].map((i) => ({ note: i.note, amount: i.amount })),
        paidImageUrl: paymentBillImageUrl === '' ? null : paymentBillImageUrl,
      };
      let res;
      switch (pageType) {
        case 'create':
          res = await RevenueExpenditureService.post({ ...param, uuid: null });
          if (res) {
            Message.success({
              text: `Tạo phiếu ${+type === 1 ? 'thu' : 'chi'} thành công.`,
              title: 'Thành Công',
              cancelButtonText: 'Đóng',
            });
            return navigate(routerLinks('RevenueExpenditure') + `?type=${type}`);
          }
          break;
        case 'edit':
          res = await RevenueExpenditureService.post({ ...param, uuid });
          if (res) {
            Message.success({
              text: `Chỉnh sửa phiếu ${+type === 1 ? 'thu' : 'chi'} thành công.`,
              title: 'Thành Công',
              cancelButtonText: 'Đóng',
            });
            return navigate(routerLinks('RevenueExpenditure') + `?type=${type}`);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white p-4 rounded-lg">
        <div>
          <>
            <div>
              <div className="flex justify-between flex-col lg:flex-row">
                <div className="text-lg font-bold mb-4 w-full sm:w-1/3">
                  {pageType === 'create' ? 'Thêm hóa đơn' : 'Chỉnh sửa hóa đơn'}
                </div>
                {pageType !== 'create' && (
                  <div className="flex justify-start">
                    <PrintAndExportPdf billType={type} dataSource={data} />
                  </div>
                )}
              </div>
              <div className="text-md font-bold mb-4">Thông tin chung</div>
              <Form colon={false} form={form} onFinish={handleSubmit} initialValues={data}>
                <div>
                  <div>
                    <div className="w-full flex flex-col sm:flex-row gap-4 items-center">
                      {/* <div className="w-4/12"></div> */}
                      {/* <Form.Item className="w-full sm:w-4/12" label="Người tạo" name="createdBy">
                        <Input
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                          placeholder="Nhập người tạo"
                        />
                      </Form.Item> */}
                      <Form.Item
                        className="w-full sm:w-4/12"
                        label="Ngày xuất"
                        name="billDate"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn ngày xuất!',
                          },
                        ]}
                        initialValue={moment()}
                      >
                        <DatePicker
                          placeholder="DD/MM/YYYY"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none !bg-white"
                          format="DD/MM/YYYY"
                          disabledDate={(current) => {
                            const value = moment();
                            return current && current.isAfter(value, 'day');
                          }}
                        />
                      </Form.Item>
                      {+type === 2 && (
                        <Form.Item
                          className="w-4/12"
                          name="groupExpense"
                          label="Nhóm chi phí"
                          rules={[
                            {
                              required: true,
                              message: 'Vui lòng chọn nhóm chi phí!',
                            },
                          ]}
                        >
                          <Select
                            className="w-full !rounded-lg  text-sm font-normal"
                            placeholder="Chọn nhóm chi phí"
                            options={groupExpense.map((i) => ({ label: i.name, value: i.uuid, code: i.code }))}
                            onChange={(value, options) => {
                              setGroupCode(options?.code);
                            }}
                          ></Select>
                        </Form.Item>
                      )}
                      <Form.Item
                        className="w-full sm:w-4/12"
                        label="Hình thức"
                        name="form"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn hình thức!',
                          },
                        ]}
                      >
                        <Select
                          className="w-full !rounded-lg"
                          placeholder="Chọn hình thức"
                          allowClear
                          options={[
                            { value: 'CASH', label: 'Tiền mặt' },
                            { value: 'BANK', label: 'Ngân hàng' },
                            { value: 'POS', label: 'POS' },
                            { value: 'INS', label: 'Trả góp' },
                          ]}
                        ></Select>
                      </Form.Item>
                      {+type === 1 && pageType === 'edit' && (
                        <Form.Item className="w-4/12" name="customerName" label="Tên khách hàng">
                          <Input
                            disabled={true}
                            className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                          />
                        </Form.Item>
                      )}
                    </div>
                    {(groupCode === 'SALARY' || groupCode === 'ADVANCE-SALARY') && (
                      <div className="w-full flex  flex-col sm:flex-row justify-between gap-4">
                        <Form.Item
                          className="w-full sm:w-4/12"
                          label="Nhân viên"
                          name="userUuid"
                          rules={[
                            {
                              required: true,
                              message: 'Vui lòng chọn nhân viên!',
                            },
                          ]}
                        >
                          <Select
                            className="w-full !rounded-lg"
                            placeholder="Chọn nhân viên"
                            allowClear
                            options={listUser.map((item) => ({
                              label: item.firstName + item.lastName,
                              value: item.uuid,
                            }))}
                          ></Select>
                        </Form.Item>
                        <div className="w-full sm:w-4/12"></div>
                        <div className="w-full sm:w-4/12"></div>
                      </div>
                    )}
                    {groupCode === 'LABO' && (
                      <div className="w-full flex  flex-col sm:flex-row justify-between gap-4">
                        <Form.Item
                          className="w-full sm:w-4/12"
                          label="Nhà cung cấp"
                          name="supplierUuid"
                          rules={[
                            {
                              required: true,
                              message: 'Vui lòng chọn nhà cung cấp!',
                            },
                          ]}
                        >
                          <Select
                            className="w-full !rounded-lg"
                            placeholder="Chọn nhà cung cấp"
                            allowClear
                            options={listSupplier.map((item) => ({ label: item.name, value: item.uuid }))}
                          ></Select>
                        </Form.Item>
                      </div>
                    )}

                    {+type === 1 ? (
                      <div className="w-full flex  flex-col sm:flex-row justify-between gap-4">
                        <Form.Item
                          className="w-full"
                          label="Nội dung"
                          name="note"
                          rules={[
                            {
                              required: true,
                              message: 'Vui lòng nhập nội dung!',
                            },
                          ]}
                        >
                          <Input
                            className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                            placeholder="Nhập nội dung"
                          />
                        </Form.Item>
                      </div>
                    ) : (
                      <div className="w-full flex  flex-col sm:flex-row justify-between gap-4">
                        <Form.Item
                          className="w-full"
                          label="Khoản chi"
                          name="note"
                          rules={[
                            {
                              required: true,
                              message: 'Vui lòng nhập khoản chi!',
                            },
                          ]}
                        >
                          <Input
                            className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                            placeholder="Nhập Khoản chi"
                          />
                        </Form.Item>
                      </div>
                    )}

                    <div className="mt-2">
                      <div className="table_add_invoice">
                        <TableRevenue
                          dataSource={dataSource}
                          setDataSource={setDataSource}
                          pageType={pageType}
                        ></TableRevenue>
                      </div>
                      <div className="flex flex-col gap-4 mt-4">
                        <div
                          className=" cursor-pointer border-b flex gap-2"
                          onClick={() => {
                            setShowPaymentBill((prev) => !prev);
                          }}
                        >
                          <div>
                            <i
                              className={classNames('', {
                                'las la-angle-down': !showPaymentBill,
                                'las la-angle-up': showPaymentBill,
                              })}
                            ></i>
                          </div>
                          <div className="text-lg font-bold">Hóa đơn thanh toán</div>
                        </div>
                        {showPaymentBill && (
                          <UploadPaymentBill
                            paymentBillImageUrl={paymentBillImageUrl}
                            setPaymentBillImageUrl={setPaymentBillImageUrl}
                          />
                        )}
                      </div>
                      <PaymentHistoryList dataSource={data} />
                    </div>
                  </div>
                  <div className="flex items-center justify-center sm:justify-between mb-7 flex-col sm:flex-row mt-7">
                    <button
                      type="button"
                      className="w-full sm:w-[125px] h-[44px] rounded-lg border border-zinc-400 text-center mb-2 sm:mb-0"
                      onClick={() => navigate(-1)}
                    >
                      Trở về
                    </button>

                    <div className="flex flex-col sm:flex-row items-center justify-end">
                      <button
                        type="submit"
                        // onClick={() => setStatusLabo('ORDER')}
                        className="mb-2 sm:mb-0 w-full sm:w-[113px] h-[44px] rounded-lg  border border-rose-500 text-center text-white  bg-rose-500"
                      >
                        Lưu hóa đơn
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </>
        </div>
      </div>
    </div>
  );
}

export default Page;
