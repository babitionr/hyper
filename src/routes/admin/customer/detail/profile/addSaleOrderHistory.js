import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Modal, Select, DatePicker, InputNumber, Button, Checkbox } from 'antd';
import { SaleOrderService } from 'services/SaleOrder';
import moment from 'moment';
import { SaleOrderHistoryService } from 'services/saleOrderHistory';
import { PaymentService } from 'services/payment';
import { HookDataTable } from 'hooks';
import { ColumnAddNewPayment } from '../../treatment-slip/columnAddNewPayment';
import MultipleUploadFiles from 'components/multipleUploadFiles';
// import { MasterDataService } from 'services/master-data-service';
import classNames from 'classnames';

export const AddSaleOrderHistory = ({
  showModalAddNewSaleOrderHistory,
  setShowModalAddNewSaleOrderHistory,
  idCustomer,
  handleChange,
  dataSaleOrderHistory,
  setDataSaleOrderHistory,
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [listService, setListService] = useState([]);
  const [treatmentSlipList, setTreatmentSlipList] = useState([]);
  const [fileList, setFileList] = useState([]);

  const handleToggleAddNew = async () => {
    if (showModalAddNewSaleOrderHistory) {
      const listTreatmentSlip = await SaleOrderService.getAllSaleOrderByCustomer({ customerUuid: idCustomer });
      const listTreat = [];
      listTreatmentSlip?.forEach((ele) => {
        listTreat.push({ value: ele?.uuid, label: ele?.code });
      });
      setTreatmentSlipList(listTreat);
      if (dataSaleOrderHistory?.isView) {
        const res = await SaleOrderHistoryService.getSaleOrderHistoryDetail(dataSaleOrderHistory?.data?.uuid);
        console.log(res);
        setFileList((prev) =>
          res?.imageList?.map((ele) => {
            console.log(ele?.imgUrl);
            const regex = /[^-]*-(.*)/;
            const titleName = regex.exec(ele?.imgUrl)[1];
            return { id: ele?.imgUrl, name: titleName, uploadedAt: moment().format('YYYY-MM-DD HH:mm:ss') };
          }),
        );

        const data = await SaleOrderService.GetDetailSaleOrderCopy(res?.saleOrderUuid);
        const listServ = [];
        data.saleOrderServiceItemDtoList.forEach((ele, idx) => {
          listServ.push({
            value: idx + 1,
            label: ele?.productServiceDto?.name,
            totalAmount: ele.totalPaymentAmount,
            balanceAmount: ele.balanceAmount,
            uuid: ele?.productServiceDto?.uuid,
            key: idx + 1,
          });
        });
        setListService(listServ);

        const serviceList = listServ
          .map((ele) => {
            if (res?.serviceList?.find((e) => ele.uuid === (e?.uuid ?? e))) {
              return ele.value;
            }
            return null;
          })
          .filter(Boolean);
        const values = {
          totalAmount: res?.totalAmount ?? 0,
          serviceList,
          code: res?.saleOrderUuid,
          balanceAmount: res?.balanceAmount ?? 0,
          dateExamination: moment(res?.dateExamination),
          content: res?.content,
          note: res?.note,
        };
        form.setFieldsValue(values);
      } else {
        // const getListService = await MasterDataService.getAllService();
        // const listServ = [];
        // getListService?.forEach((ele) => {
        //   listServ.push({ value: ele?.uuid, label: ele?.name });
        // });
        // setListService(listServ);
        const values = form.getFieldValue();
        form.setFieldsValue({ ...values, dateExamination: moment() });
      }
    }
  };
  const handleSelectService = async (e) => {
    if (dataSaleOrderHistory?.isView) {
      return;
    }
    let totalPrice = 0;
    let totalBalanceAmount = 0;
    // e?.forEach(async (ele) => {
    //   const res = await MasterDataService.getDetailService(ele);
    //   const { price } = res;
    //   totalPrice = price + totalPrice;
    //   form.setFieldsValue({ ...form.getFieldsValue(), balanceAmount: totalPrice, totalAmount: totalPrice });
    // });
    console.log(listService);
    e.forEach((res) => {
      const price = listService.filter((ele) => ele.value === res)[0].totalAmount;
      const balanceAmount = listService.filter((ele) => ele.value === res)[0].balanceAmount;
      totalPrice = price + totalPrice;
      totalBalanceAmount = balanceAmount + totalBalanceAmount;
      form.setFieldsValue({ ...form.getFieldsValue(), balanceAmount: totalBalanceAmount, totalAmount: totalPrice });
    });
    if (e?.length === 0) {
      form.setFieldsValue({ ...form.getFieldsValue(), balanceAmount: 0, totalAmount: 0 });
    }
  };
  const handleSelectTreatmentSlip = async (e) => {
    const data = await SaleOrderService.GetDetailSaleOrderCopy(e);
    const serviceListSelect = [];
    let allBalanceAmount = 0;
    let allTotalPaymentAmount = 0;
    const listServ = [];
    data.saleOrderServiceItemDtoList.forEach((ele, idx) => {
      serviceListSelect.push(idx + 1);
      listServ.push({
        value: idx + 1,
        label: ele?.productServiceDto?.name,
        totalAmount: ele.totalPaymentAmount,
        balanceAmount: ele.balanceAmount,
        uuid: ele?.productServiceDto?.uuid,
        key: idx + 1,
      });
      console.log(listServ);
      allBalanceAmount = ele.balanceAmount + allBalanceAmount;
      allTotalPaymentAmount = ele.totalPaymentAmount + allTotalPaymentAmount;
      // const getListService = [...new Set(listServ)];
      // console.log(getListService);
    });
    setListService(listServ);
    const temp = {
      ...form.getFieldsValue(),
      serviceList: serviceListSelect,
      balanceAmount: allBalanceAmount,
      totalAmount: allTotalPaymentAmount,
    };
    form.resetFields();
    form.setFieldsValue({
      ...temp,
    });
    setShowPaymentForm(false);
    getListServiceToPayment({ saleOrderId: e });
  };

  const handleCancel = () => {
    setShowModalAddNewSaleOrderHistory(false);
    form.resetFields();
    setListService([]);
    setIsLoadingSubmit(false);
    setShowPaymentForm(false);
    setDataSaleOrderHistory({ data: {}, isView: false });
    setFileList([]);
  };
  const handleSubmit = async () => {
    setIsLoadingSubmit(true);
    const data = form.getFieldValue();
    if (showPaymentForm) {
      const paymentFormValue = {
        branchUuid: localStorage.getItem('branchUuid'),
        saleOrderUuid: data?.code,
        paymentDate: moment(data.paymentDate).format('YYYY-MM-DD HH:mm:ss'),
        paymentForm: data?.paymentForm,
        note: data?.notePayment,
        totalPaymentAmount: data?.totalPaymentAmount,
        serviceItemDtoList: inputServicePayment.map((ele) => ({
          uuid: ele.uuid,
          paymentAmount: ele.inputPayment,
        })),
      };
      const post = await PaymentService.post(paymentFormValue);
      if (post) {
        const values = {
          ...data,
          saleOrderUuid: data?.code,
          dateExamination: moment(data?.dateExamination).format('YYYY-MM-DD HH:mm:ss'),
          serviceList: listService
            ?.map((ele) => {
              if (data?.serviceList?.find((e) => ele.value === (e?.value ?? e))) {
                return { uuid: ele.uuid };
              }
              return null;
            })
            .filter(Boolean),
          imageList: fileList?.map((ele) => ({ imgUrl: ele.id })),
          balanceAmount: balancePayment,
          totalAmount: totalPayment,
        };
        console.log(values);
        const res = await SaleOrderHistoryService.saveSaleOrderHistory(values);
        if (res) {
          handleCancel();
          handleChange();
        }
      }
    }

    if (!showPaymentForm) {
      const values = {
        ...data,
        saleOrderUuid: data?.code,
        dateExamination: moment(data?.dateExamination).format('YYYY-MM-DD hh:mm:ss'),
        serviceList: listService
          ?.map((ele) => {
            if (data?.serviceList?.find((e) => ele.value === (e?.value ?? e))) {
              return { uuid: ele.uuid };
            }
            return null;
          })
          .filter(Boolean),
        imageList: fileList?.map((ele) => ({ imgUrl: ele.id })),
        uuid: dataSaleOrderHistory?.data?.uuid ?? null,
      };
      console.log(values);
      await SaleOrderHistoryService.saveSaleOrderHistory(values);
      handleCancel();
      handleChange();
    }
  };

  useEffect(() => {
    handleToggleAddNew();
  }, [showModalAddNewSaleOrderHistory]);

  // Payment Form
  const [showPaymentForm, setShowPaymentForm] = useState(false);
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
            </div>
          );
        },
      },
    };
  });

  const onChangeAmountTotalPayment = (e) => {
    let inputValue = e;
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

  const getDataTablePayment = () => {
    console.log(inputServicePayment);
    return { data: inputServicePayment };
  };
  const [handleTablePaymentChange, tableServiceToPayment] = HookDataTable({
    showSearch: false,
    columns,
    Get: getDataTablePayment,
    showPagination: false,
    loadFirst: false,
  });
  const getListServiceToPayment = async (param) => {
    const data = await PaymentService.getListServiceToPayment({ saleOrderUuid: param?.saleOrderId });
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

    handleTablePaymentChange();
  };
  useEffect(() => {
    handleTablePaymentChange();
    console.log(inputServicePayment);
  }, [inputServicePayment]);

  useEffect(() => {
    if (!showPaymentForm) {
      setInputServicePayment((prev) => prev?.map((e) => ({ ...e, inputPayment: 0 })));
      form.resetFields(['paymentDate', 'paymentForm', 'totalPaymentAmount', 'notePayment']);
    }
  }, [showPaymentForm]);

  return (
    <div>
      <Modal
        open={showModalAddNewSaleOrderHistory}
        destroyOnClose={true}
        title={
          <div className="flex justify-between">
            <div className="text-base font-bold">Thêm lịch sử</div>
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
        className="!w-9/12 min-w-min top-0 pb-0 z-10"
        closable={false}
      >
        <Form form={form} className="px-4" colon={false}>
          <div>
            <MultipleUploadFiles setFileList={setFileList} fileList={fileList} />
            <div className="w-full flex justify-between gap-4">
              <Form.Item
                className="w-full"
                label="Phiếu điều trị"
                name="code"
                rules={[
                  {
                    required: true,
                    message: 'Chọn phiếu điều trị',
                  },
                ]}
              >
                <Select
                  disabled={dataSaleOrderHistory?.isView}
                  onChange={(e) => {
                    handleSelectTreatmentSlip(e);
                  }}
                  options={treatmentSlipList ?? []}
                  className=" !rounded-lg"
                  placeholder="Chọn dịch vụ"
                ></Select>
              </Form.Item>
            </div>
            <div className="w-full flex justify-between gap-4">
              <div className="w-full flex gap-2">
                <Form.Item
                  className="w-6/12"
                  name="serviceList"
                  label="Dịch vụ"
                  rules={[
                    {
                      required: true,
                      message: 'Chọn dịch vụ',
                    },
                  ]}
                >
                  <Select
                    disabled={!listService?.length}
                    mode="multiple"
                    options={listService ?? []}
                    className=" !rounded-lg"
                    placeholder="Chọn dịch vụ"
                    allowClear
                    onClear={() => {
                      form.setFieldsValue({ ...form.getFieldsValue(), balanceAmount: 0, totalAmount: 0 });
                    }}
                    onChange={(e) => {
                      handleSelectService(e);
                    }}
                  ></Select>
                </Form.Item>
                <Form.Item className="w-6/12" name="dateExamination" label="Ngày khám">
                  <DatePicker
                    disabledDate={(date) => new Date(date).getTime() > new Date().getTime()}
                    placeholder="Chọn ngày khám"
                    className="!w-full border rounded-lg !bg-white  border-gray-200"
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="w-full flex justify-between gap-4">
              <div className="w-full flex gap-2">
                <Form.Item className="w-6/12" label="Thành tiền" name="totalAmount">
                  <InputNumber
                    disabled
                    formatter={(value) => `${Number(value).toLocaleString('de-DE')} VND`}
                    placeholder="Nhập thành tiền"
                    // className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                    className="h-10 text-sm font-normal block !w-full !rounded-lg border text-black py-1 px-1 border-gray-200 focus:!shadow-none focus:!border-gray-200"
                  />
                </Form.Item>
                <Form.Item className="w-6/12" label="Còn lại" name="balanceAmount">
                  <InputNumber
                    disabled
                    formatter={(value) => `${Number(value).toLocaleString('de-DE')} VND`}
                    placeholder="Nhập còn lại"
                    className="h-10 text-sm font-normal block !w-full !rounded-lg border text-black py-1 px-1 border-gray-200 focus:!shadow-none focus:!border-gray-200"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="w-full ">
              <Form.Item className="w-full" name="content" label="Nội dung điều trị">
                <TextArea
                  maxLength={500}
                  rows={4}
                  className={classNames(
                    ' w-full text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-[7px] px-4',
                  )}
                  placeholder=""
                />
              </Form.Item>
            </div>
            <div className="w-full ">
              <Form.Item className="w-full" name="note" label="Ghi chú">
                <TextArea
                  disabled={dataSaleOrderHistory?.isView}
                  maxLength={500}
                  rows={4}
                  className={classNames(
                    ' w-full text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-[7px] px-4',
                    { ' cursor-not-allowed': dataSaleOrderHistory?.isView },
                  )}
                  placeholder=""
                />
              </Form.Item>
            </div>
            <div className="w-full ">
              {/* Payment Form */}
              <Checkbox
                checked={showPaymentForm}
                disabled={dataSaleOrderHistory?.isView || !inputServicePayment?.length}
                onChange={(event) => {
                  if (event.target.checked) {
                    setShowPaymentForm(true);
                  }
                  if (!event.target.checked) {
                    setShowPaymentForm(false);
                  }
                }}
              >
                Thanh toán
              </Checkbox>
              {showPaymentForm && (
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
                          // disabled
                          placeholder="Chọn ngày thanh toán"
                          className="!w-full border rounded-lg  border-gray-200 !bg-white"
                          format="DD/MM/YYYY"
                          disabledDate={(date) => new Date(date).getTime() > new Date().getTime()}
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
                          placeholder="Chọn hình thức thanh toán"
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
                            onChangeAmountTotalPayment(value);
                            handleTablePaymentChange();
                            e.preventDefault();
                          }}
                          onBlur={(e) => {
                            const value = e.target.value.toString().replace(/\./g, '');
                            onChangeAmountTotalPayment(value);
                            handleTablePaymentChange();
                            e.preventDefault();
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        className="w-6/12"
                        label="Nội dung"
                        name="notePayment"
                        rules={[
                          {
                            required: true,
                            message: 'Nhập nội dung thanh toán',
                          },
                        ]}
                        initialValue={`${
                          treatmentSlipList.find((e) => e?.value === form?.getFieldValue('code'))?.label ?? ''
                        } - Khách hàng thanh toán`}
                      >
                        <TextArea
                          rows={1}
                          className=" w-full h-10 text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-2 px-4 "
                          placeholder=""
                        />
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
                          {(paidPayment + Number(form.getFieldValue()?.totalPaymentAmount ?? 0)).toLocaleString(
                            'de-DE',
                          )}{' '}
                          VND{' '}
                        </div>
                      </div>
                      <div className="flex justify-between w-full">
                        <div className=" text-base font-medium text-[#6B7280]"> Tổng số còn lại:</div>
                        <div className="text-base font-semibold text-[#4B5563]">
                          {' '}
                          {(balancePayment - Number(form.getFieldValue()?.totalPaymentAmount ?? 0)).toLocaleString(
                            'de-DE',
                          )}{' '}
                          VND{' '}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                  <Button
                    className=" !border-rose-500 border !text-white !bg-rose-500 focus:!bg-rose-600 hover:!bg-rose-600 !px-11 flex items-center justify-center !pt-4 !pb-6 !text-base font-medium "
                    loading={isLoadingSubmit}
                    disabled={isLoadingSubmit}
                    onClick={async () => {
                      try {
                        await form.validateFields();
                        await handleSubmit();
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    <span className="pt-2">Lưu</span>
                  </Button>
                </div>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
