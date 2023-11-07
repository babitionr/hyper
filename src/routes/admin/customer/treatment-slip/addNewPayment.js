import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Modal, Select, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
import { PaymentService } from 'services/payment';
import { HookDataTable } from 'hooks';
import { ColumnAddNewPayment } from './columnAddNewPayment';
import { Message } from 'components';
import classNames from 'classnames';
import './index.less';

export const AddNewPayment = ({
  handleChangeService,
  handleChangePaymentHistory,
  showModalAddNewPayment,
  setShowModalAddNewPayment,
  saleOrderId,
  codeId,
  initForm,
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [totalPayment, setTotalPayment] = useState();
  const [balancePayment, setBalancePayment] = useState();
  const [paidPayment, setPaidPayment] = useState();

  const [inputServicePayment, setInputServicePayment] = useState([]);

  const input2 = useRef(null);

  const handleRowChange = (data, newVal) => {
    let value = 0;
    Number(newVal) > data.balanceAmount
      ? (value = data.balanceAmount)
      : Number(newVal) < 0
      ? (value = 0)
      : (value = Number(newVal));

    const totalInputPayment = inputServicePayment
      .filter((e) => e.uuid !== data.uuid)
      .reduce((acc, cur) => {
        return Number(acc) + Number(cur.inputPayment);
      }, Number(value));
    setInputServicePayment(
      inputServicePayment.map((ele) => (data.uuid === ele.uuid ? { ...ele, inputPayment: Number(value) } : { ...ele })),
    );
    form.setFieldsValue({ totalPaymentAmount: Number(totalInputPayment) });
  };
  const columns = ColumnAddNewPayment().map((item) => {
    if (!item.editable) {
      return item;
    }
    return {
      ...item,
      tableItem: {
        width: 200,
        align: 'right',
        render: (text, data) => {
          form.setFieldsValue({
            [`inputPayment-${data.uuid}`]: Number(text),
          });
          return (
            <div className="w-full">
              <Form form={form} component={false}>
                <Form.Item
                  style={{
                    margin: 0,
                  }}
                  name={`inputPayment-${data.uuid}`}
                >
                  <InputNumber
                    className="antdInputNumberSuffixInTable w-full rounded-l-lg !text-right !mr-4"
                    ref={input2}
                    addonAfter="VND"
                    onKeyDown={(e) =>
                      ![
                        '0',
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                        '8',
                        '9',
                        'Backspace',
                        'Delete',
                        '.',
                        'ArrowRight',
                        'ArrowLeft',
                        'Tab',
                      ].includes(e.key) && e.preventDefault()
                    }
                    formatter={(value) => {
                      if (!value) {
                        return 0;
                      }
                      const stringValue = value.toString();
                      const formattedValue = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                      return formattedValue;
                    }}
                    stringMode
                    parser={(value) => {
                      const parsedValue = value.toString().replace(/\./g, '');
                      return isNaN(parsedValue) ? 0 : parsedValue;
                    }}
                    onPressEnter={(e) => {
                      const value = e.target.value.toString().replace(/\./g, '');
                      handleRowChange(data, value);
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.toString().replace(/\./g, '');
                      handleRowChange(data, value);
                    }}
                  />
                </Form.Item>
              </Form>

              {/* <Input
                type='number'
                className="number-input w-full !text-right"
                min={0}
                max={data?.totalPaymentAmount}
                ref={input2}
                value={Number(text)}
                onChange={(e) =>
                  {
                  handleRowChange(data, e.target.value)
                  }
                }
              ></Input> */}
            </div>
          );
        },
      },
    };
  });

  const onChangeAmountTotalPayment = (e) => {
    let inputValue = Number(e);
    setInputServicePayment(
      inputServicePayment.map((ele) => {
        if (inputValue >= ele.balanceAmount) {
          inputValue = inputValue - ele.balanceAmount;
          return { ...ele, inputPayment: ele.balanceAmount };
        } else if (inputValue > 0 && inputValue < ele.balanceAmount) {
          const value = inputValue;
          inputValue = inputValue - ele.balanceAmount;
          return { ...ele, inputPayment: value };
        } else {
          return { ...ele, inputPayment: 0 };
        }
      }),
    );
    if (e > balancePayment) {
      form.setFieldsValue({ ...form.getFieldsValue(), totalPaymentAmount: balancePayment });
    }
    if (e < 0) {
      form.setFieldsValue({ ...form.getFieldsValue(), totalPaymentAmount: 0 });
    }
    if (e >= 0 && e <= balancePayment) {
      form.setFieldsValue({ ...form.getFieldsValue(), totalPaymentAmount: Number(e) });
    }
  };

  const getDataTable = () => {
    console.log(inputServicePayment);
    return { data: inputServicePayment };
  };
  const [handleTableChange, tableServiceToPayment] = HookDataTable({
    showSearch: false,
    columns,
    Get: getDataTable,
    showPagination: false,
    loadFirst: false,
  });
  const getListServiceToPayment = async (param) => {
    const data = await PaymentService.getListServiceToPayment({ ...param, saleOrderUuid: saleOrderId });
    let allPayment = 0;
    let allbalancePayment = 0;
    let allpaidPayment = 0;
    data?.data?.forEach((ele) => {
      allPayment += ele.totalPaymentAmount;
      allbalancePayment += ele.balanceAmount;
      allpaidPayment += ele.paidAmount;
    });
    setTotalPayment(allPayment);
    setBalancePayment(allbalancePayment);
    setPaidPayment(allpaidPayment);
    const rawData = data?.data.map((ele) => ({
      ...ele,
      inputPayment: 0,
    }));
    setInputServicePayment([...rawData]);

    handleTableChange();
  };
  useEffect(() => {
    handleTableChange();
    console.log(inputServicePayment);
  }, [inputServicePayment]);
  const handleCancel = () => {
    setShowModalAddNewPayment(false);
    form.resetFields();
  };
  const handleSubmit = async () => {
    try {
      const data = form.getFieldValue();
      const values = {
        ...data,
        branchUuid: localStorage.getItem('branchUuid'),
        saleOrderUuid: saleOrderId,
        paymentDate: moment(data.paymentDate).format('YYYY-MM-DD hh:mm:ss'),
        serviceItemDtoList: inputServicePayment.map((ele) => ({
          uuid: ele.uuid,
          paymentAmount: ele.inputPayment,
        })),
      };
      const post = await PaymentService.post(values);
      if (post) {
        Message.success({ text: 'Thanh toán thành công' });
      }
      setShowModalAddNewPayment(false);
      form.resetFields();
      initForm(saleOrderId);
      handleChangeService();
      handleChangePaymentHistory();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListServiceToPayment();
  }, [showModalAddNewPayment]);

  return (
    <div>
      <Modal
        open={showModalAddNewPayment}
        destroyOnClose={true}
        title={
          <div className="flex justify-between">
            <div className="text-base font-bold">Thanh Toán</div>
            <button
              className=""
              onClick={() => {
                handleCancel();
              }}
            >
              <span className="icon-x-close pr-2"></span>
            </button>
          </div>
        }
        footer={null}
        className="!w-7/12 min-w-min pb-0 z-10"
        closable={false}
      >
        <Form form={form} className="px-4" colon={false} onError={(e) => console.log(e)}>
          <div>
            <div className="w-full flex justify-between gap-4">
              <div className="w-full flex gap-2">
                <Form.Item
                  className="w-6/12"
                  name="paymentDate"
                  label="Ngày thanh toán"
                  disabled
                  initialValue={moment()}
                  rules={[
                    {
                      required: true,
                      message: 'Chọn ngày thanh toán',
                    },
                  ]}
                >
                  <DatePicker
                    disabled
                    placeholder="Chọn ngày thanh toán"
                    className="!w-full border rounded-lg  border-gray-200"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
                <Form.Item
                  className="w-6/12"
                  name="paymentForm"
                  label="Hình thức thanh toán"
                  rules={[
                    {
                      required: true,
                      message: 'Chọn hình thức thanh toán',
                    },
                  ]}
                >
                  <Select
                    className=" !rounded-lg"
                    placeholder="Chọn dịch vụ"
                    // allowClear
                    // onClear={() => {
                    //   form.setFieldsValue({ ...form.getFieldsValue(), balanceAmount: 0, totalAmount: 0 });
                    // }}
                    // onChange={(e) => {
                    //   handleSelectService(e);
                    // }}
                    options={[
                      { value: 'CASH', label: 'Tiền mặt' },
                      { value: 'BANK', label: 'Chuyển khoản ngân hàng' },
                      { value: 'POS', label: 'POS' },
                      { value: 'INS', label: 'Trả góp' },
                    ]}
                  ></Select>
                </Form.Item>
              </div>
            </div>
            <div className="w-full flex justify-between gap-4">
              <div className="w-full flex gap-2">
                <Form.Item
                  className="w-6/12"
                  label="Số tiền thanh toán"
                  name="totalPaymentAmount"
                  initialValue={0}
                  rules={[
                    {
                      required: true,
                      message: 'Nhập số tiền thanh toán',
                    },
                    {
                      validator(_, value) {
                        if (value > 0) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Nhập số tiền lớn hơn 0'));
                      },
                    },
                  ]}
                >
                  <InputNumber
                    placeholder=""
                    addonAfter="VND"
                    className="antdInputNumberSuffix h-10 text-sm font-normal block w-full rounded-l-lg"
                    min={0}
                    max={balancePayment}
                    formatter={(value) => {
                      if (!value) {
                        return 0;
                      }

                      const stringValue = value.toString();
                      const formattedValue = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                      return formattedValue;
                    }}
                    parser={(value) => {
                      const parsedValue = value.toString().replace(/\./g, '');
                      return isNaN(parsedValue) ? 0 : parsedValue;
                    }}
                    onPressEnter={(e) => {
                      const value = e.target.value.toString().replace(/\./g, '');
                      // let a = e.target.value;
                      // setInputServicePayment(
                      //   inputServicePayment.map((ele) => {
                      //     if (a >= ele.balanceAmount) {
                      //       a = a - ele.balanceAmount;
                      //       return { ...ele, inputPayment: ele.balanceAmount };
                      //     } else if (a > 0 && a < ele.balanceAmount) {
                      //       const b = a;
                      //       a = a - ele.balanceAmount;
                      //       return { ...ele, inputPayment: b };
                      //     } else {
                      //       return { ...ele, inputPayment: 0 };
                      //     }
                      //   }),
                      // );
                      // if (e.target.value > balancePayment) {
                      //   form.setFieldsValue({ ...form.getFieldsValue(), totalPaymentAmount: balancePayment });
                      // }
                      // if (e.target.value < 0) {
                      //   form.setFieldsValue({ ...form.getFieldsValue(), totalPaymentAmount: 0 });
                      // }
                      onChangeAmountTotalPayment(value);
                      handleTableChange();
                      e.preventDefault();
                    }}
                    onBlur={(e) => {
                      const value = e.target.value.toString().replace(/\./g, '');
                      // let a = e.target.value;
                      // setInputServicePayment(
                      //   inputServicePayment.map((ele) => {
                      //     if (a >= ele.balanceAmount) {
                      //       a = a - ele.balanceAmount;
                      //       return { ...ele, inputPayment: ele.balanceAmount };
                      //     } else if (a > 0 && a < ele.balanceAmount) {
                      //       const b = a;
                      //       a = a - ele.balanceAmount;
                      //       return { ...ele, inputPayment: b };
                      //     } else {
                      //       return { ...ele, inputPayment: 0 };
                      //     }
                      //   }),
                      // );
                      // if (e.target.value > balancePayment) {
                      //   form.setFieldsValue({ ...form.getFieldsValue(), totalPaymentAmount: balancePayment });
                      // }
                      // if (e.target.value < 0) {
                      //   form.setFieldsValue({ ...form.getFieldsValue(), totalPaymentAmount: 0 });
                      // }
                      onChangeAmountTotalPayment(value);
                      handleTableChange();
                      e.preventDefault();
                    }}
                  />
                </Form.Item>
                <Form.Item
                  className="w-6/12"
                  label="Nội dung"
                  name="note"
                  rules={[
                    {
                      required: true,
                      message: 'Nhập nội dung thanh toán',
                    },
                  ]}
                  initialValue={`${codeId} - Khách hàng thanh toán`}
                >
                  <TextArea
                    rows={1}
                    className=" w-full h-10 text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-2 px-4 "
                    placeholder=""
                  />
                  {/* <Input
                    placeholder="Nhập nội dung"
                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                    defaultValue={"SO03521 - Khách hàng thanh toán"}
                  /> */}
                </Form.Item>
              </div>
            </div>
            <div className="w-full flex gap-2 text-sm font-medium text-[#6B7280]">Thanh toán dịch vụ</div>
            {tableServiceToPayment()}
            <div className="w-full justify-between flex pt-4">
              <div></div>
              <div className="w-1/2">
                <div className="flex justify-between w-full">
                  <div className=" text-base font-medium text-[#6B7280]"> Tổng tiền cần thanh toán:</div>
                  <div className="text-base font-semibold text-[#4B5563]">
                    {' '}
                    {totalPayment?.toLocaleString('de-DE')} VND{' '}
                  </div>
                </div>
                <div className="flex justify-between w-full">
                  <div className=" text-base font-medium text-[#6B7280]"> Tổng tiền đã trả:</div>
                  <div className="text-base font-semibold text-[#4B5563]">
                    {' '}
                    {(paidPayment + Number(form.getFieldValue().totalPaymentAmount)).toLocaleString('de-DE')} VND{' '}
                  </div>
                </div>
                <div className="flex justify-between w-full">
                  <div className=" text-base font-medium text-[#6B7280]"> Tổng số còn lại:</div>
                  <div className="text-base font-semibold text-[#4B5563]">
                    {' '}
                    {(balancePayment - Number(form.getFieldValue().totalPaymentAmount)).toLocaleString(
                      'de-DE',
                    )} VND{' '}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Form.Item>
                <div className="flex justify-center gap-4 pt-6">
                  <button
                    className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-11 py-2 text-base font-medium  "
                    type="button"
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await form.validateFields();
                        handleSubmit();
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    className={classNames(
                      ' active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-11 py-2',
                    )}
                    type="submit"
                  >
                    Lưu
                  </button>
                </div>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
