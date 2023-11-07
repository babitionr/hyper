import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, Modal, Select, DatePicker, Checkbox, InputNumber, Button } from 'antd';
import { SaleOrderService } from 'services/SaleOrder';
import moment from 'moment';
import { SaleOrderHistoryService } from 'services/saleOrderHistory';
import MultipleUploadFiles from 'components/multipleUploadFiles';
import { HookDataTable } from 'hooks';
import { PaymentService } from 'services/payment';
import { ColumnAddNewPayment } from './columnAddNewPayment';
import './index.less';
import classNames from 'classnames';

export const AddNewSaleOrderHistory = ({
  handleChangeService,
  handleChangePaymentHistory,
  showModalAddNewSaleOrderHistory,
  setShowModalAddNewSaleOrderHistory,
  saleOrderId,
  handleChangeSaleOrderHistory,
  initForm,
  dataSaleOrderHistory,
  setDataSaleOrderHistory,
}) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [listService, setListService] = useState([]);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const handleToggleAddNew = async () => {
    console.log(dataSaleOrderHistory);

    if (showModalAddNewSaleOrderHistory) {
      const datatreatmentslip = await SaleOrderService.GetDetailSaleOrderCopy(saleOrderId);
      console.log(datatreatmentslip);
      const listServ = [];
      datatreatmentslip?.saleOrderServiceItemDtoList?.forEach((ele, idx) => {
        listServ.push({
          value: idx + 1,
          label: ele.productServiceDto?.name,
          totalAmount: ele.totalPaymentAmount,
          balanceAmount: ele.balanceAmount,
          uuid: ele.productServiceDto?.uuid,
          key: idx + 1,
        });
      });
      setListService(listServ);
      if (dataSaleOrderHistory?.isView) {
        const res = await SaleOrderHistoryService.getSaleOrderHistoryDetail(dataSaleOrderHistory?.data?.uuid);
        console.log(res);
        setFileList((prev) =>
          res?.imageList?.map((ele) => {
            console.log(ele?.imgUrl);
            const regex = /[^-]*-(.*)/;
            const titleName = regex.exec(ele?.imgUrl)[1];
            console.log(titleName);
            return { id: ele?.imgUrl, name: titleName, uploadedAt: moment().format('YYYY-MM-DD HH:mm:ss') };
          }),
        );

        const serviceList = listServ
          .map((ele) => {
            if (res?.serviceList?.find((e) => ele.uuid === (e?.uuid ?? e))) {
              return ele.value;
            }
            return null;
          })
          .filter(Boolean);
        console.log(serviceList);
        const values = {
          totalAmount: res?.totalAmount ?? 0,
          serviceList,
          code: datatreatmentslip?.code,
          balanceAmount: res?.balanceAmount ?? 0,
          dateExamination: moment(res?.dateExamination),
          content: res?.content,
          note: res?.note,
        };
        form.setFieldsValue(values);
      } else {
        const values = {
          totalAmount: datatreatmentslip?.totalPaymentAmount ?? 0,
          serviceList: listServ,
          code: datatreatmentslip.code,
          balanceAmount: datatreatmentslip.balanceAmount ?? 0,
          dateExamination: moment(),
        };
        form.setFieldsValue(values);
      }
    }
  };
  const handleSelectService = async (e) => {
    if (dataSaleOrderHistory?.isView) {
      return;
    }
    let totalPrice = 0;
    let totalBalanceAmount = 0;
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

  const handleCancel = () => {
    setShowModalAddNewSaleOrderHistory(false);
    form.resetFields();
    setFileList([]);
    setListService([]);
    setIsLoadingSubmit(false);
    setDataSaleOrderHistory({ data: {}, isView: false });
  };
  const handleSubmit = async () => {
    setIsLoadingSubmit(true);
    const data = form.getFieldValue();
    console.log(data);
    if (showPaymentForm) {
      const paymentFormValue = {
        branchUuid: localStorage.getItem('branchUuid'),
        saleOrderUuid: saleOrderId,
        paymentDate: moment(data.paymentDate).format('YYYY-MM-DD hh:mm:ss'),
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
          saleOrderUuid: saleOrderId,
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
          balanceAmount: Number(balancePayment),
          totalAmount: totalPayment,
        };
        console.log(values);
        const res = await SaleOrderHistoryService.saveSaleOrderHistory(values);
        if (res) {
          handleCancel();
          initForm(saleOrderId);
          handleChangeSaleOrderHistory();
          handleChangePaymentHistory();
          handleChangeService();
        }
      }
    }
    if (!showPaymentForm) {
      console.log(fileList);
      const values = {
        ...data,
        saleOrderUuid: saleOrderId,
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
      console.log(data?.serviceList);
      const res = await SaleOrderHistoryService.saveSaleOrderHistory(values);
      if (res) {
        handleCancel();
        handleChangeSaleOrderHistory();
      }
    }
    setIsLoadingSubmit(false);
  };
  // const { Dragger } = Upload;

  const [fileList, setFileList] = useState([]);

  // const handleUpload = async (file) => {
  //   console.log(file);
  //   const data = await OrganizationService.uploadContract(file);
  //   console.log(data);
  //   const fileData = await OrganizationService.getViewUrl(data);
  //   console.log(fileData);
  //   const regex = /[^-]*-(.*)/;
  //   const titleName = regex.exec(data)[1];
  //   setFileList((prev) => [{ id: data, name: titleName }, ...prev]);
  //   console.log(fileList);
  //   return false; // prevent file from being uploaded automatically
  // };

  // const uploadProps = {
  //   name: 'file',
  //   multiple: true,
  //   showUploadList: false,
  //   fileList,
  //   beforeUpload: handleUpload,
  // };
  // const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewImage, setPreviewImage] = useState('');
  // const [previewTitle, setPreviewTitle] = useState('');
  // const handlePreview = async (file) => {
  //   const data = await OrganizationService.getViewUrl(file.id);

  //   console.log(data);
  //   setPreviewImage(data);
  //   setPreviewOpen(true);
  //   setPreviewTitle(file.name);
  // };

  useEffect(() => {
    handleToggleAddNew();
  }, [showModalAddNewSaleOrderHistory]);

  // paymentForm
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

    handleTablePaymentChange();
  };
  useEffect(() => {
    handleTablePaymentChange();
    console.log(inputServicePayment);
  }, [inputServicePayment]);

  useEffect(() => {
    getListServiceToPayment();
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
            <div className="text-base font-bold">{dataSaleOrderHistory?.isView ? 'Sửa' : 'Thêm'} lịch sử điều trị</div>
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
        <Form
          form={form}
          className="px-4"
          colon={false}
          // onFinish={() => handleSubmit()
        >
          <div>
            {/* <div style={{ display: 'flex' }} className="gap-2 w-full h-full opacity-0">
              <Dragger
                showUploadList={false}
                {...uploadProps}
                className="  bg-white flex justify-center text-center border border-dashed border-gray-500  !rounded-2xl h-52 w-full  items-center"
              >
                <div className="h-full w-full ">
                  <i className="las la-file-upload la-4x "></i>
                  <div>Kéo thả hoặc nhấn vào đây để tải file lên</div>
                </div>
              </Dragger>
              {fileList.length > 0 && (
                <div className="bg-gray-200 border border-dashed border-gray-500  !rounded-2xl h-52 w-full aspect-square object-cover  items-center p-2 overflow-hidden">
                  File List:
                  {fileList.map((file, index) => (
                    <div key={index + file.id} className="flex w-full">
                      <div style={{ marginLeft: 2 }} className="bg-white flex gap-0.5 items-center w-full ">
                        <svg
                          width="25px"
                          height="25px"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#000000"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />

                          <g id="SVGRepo_iconCarrier">
                            {' '}
                            <title />{' '}
                            <g id="Complete">
                              {' '}
                              <g id="F-File">
                                {' '}
                                <g id="Text">
                                  {' '}
                                  <g>
                                    {' '}
                                    <path
                                      d="M18,22H6a2,2,0,0,1-2-2V4A2,2,0,0,1,6,2h7.1a2,2,0,0,1,1.5.6l4.9,5.2A2,2,0,0,1,20,9.2V20A2,2,0,0,1,18,22Z"
                                      fill="none"
                                      id="File"
                                      stroke="#000000"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                    />{' '}
                                    <line
                                      fill="none"
                                      stroke="#000000"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      x1="7.9"
                                      x2="16.1"
                                      y1="17.5"
                                      y2="17.5"
                                    />{' '}
                                    <line
                                      fill="none"
                                      stroke="#000000"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      x1="7.9"
                                      x2="16.1"
                                      y1="13.5"
                                      y2="13.5"
                                    />{' '}
                                    <line
                                      fill="none"
                                      stroke="#000000"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      x1="8"
                                      x2="13"
                                      y1="9.5"
                                      y2="9.5"
                                    />{' '}
                                  </g>{' '}
                                </g>{' '}
                              </g>{' '}
                            </g>{' '}
                          </g>
                        </svg>
                        <div style={{}}>{file.name}</div>
                      </div>
                      {['jpg','png','jpeg','webp','svg','gif'].includes(file.name.split('.').pop().toLowerCase()) && (
                         <button
                         onClick={() => {
                           handlePreview(file);
                         }}
                       >
                         <i className="las la-eye  text-yellow-400 h-full w-full hover:text-yellow-300 cursor-pointer text-3xl"></i>
                       </button>)}

                      <button
                        className="items-center text-center justify-center flex"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFileList(fileList.filter((item) => item.id !== file.id));
                        }}
                      >
                        <i className="las la-trash-alt text-red-500 h-full w-full hover:text-red-400 cursor-pointer text-3xl"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div> */}
            <MultipleUploadFiles setFileList={setFileList} fileList={fileList} />
            <div className="w-full flex justify-between gap-4">
              <Form.Item className="w-full" label="Phiếu điều trị" name="code">
                <Input
                  disabled
                  placeholder="Nhập phiếu điều trị"
                  className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                />
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
                    placeholder="Chọn ngày khám"
                    className="!w-full border rounded-lg !bg-white  border-gray-200"
                    format="DD/MM/YYYY"
                    disabledDate={(date) => new Date(date).getTime() > new Date().getTime()}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="w-full flex justify-between gap-4">
              <div className="w-full flex gap-2">
                <Form.Item className="w-6/12" label="Thành tiền" name="totalAmount">
                  <InputNumber
                    // disabled
                    formatter={(value) => {
                      if (!value) {
                        return 0;
                      }
                      const stringValue = value.toString();
                      const formattedValue = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                      return formattedValue;
                    }}
                    parser={(value) => {
                      const parsedValue = value.replace(/\./g, '');
                      return isNaN(parsedValue) ? 0 : parsedValue;
                    }}
                    addonAfter="VND"
                    stringMode
                    placeholder="Nhập thành tiền"
                    className="h-10 text-sm font-normal block w-full rounded-lg antdInputNumberSuffix !text-black"
                  />
                </Form.Item>
                <Form.Item className="w-6/12" label="Còn lại" name="balanceAmount">
                  <InputNumber
                    // disabled
                    formatter={(value) => {
                      if (!value) {
                        return 0;
                      }
                      const stringValue = value.toString();
                      const formattedValue = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                      return formattedValue;
                    }}
                    parser={(value) => {
                      const parsedValue = value.replace(/\./g, '');
                      return isNaN(parsedValue) ? 0 : parsedValue;
                    }}
                    addonAfter="VND"
                    stringMode
                    placeholder="Nhập còn lại"
                    className="h-10 text-sm font-normal block w-full rounded-lg antdInputNumberSuffix !text-black"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="w-full ">
              <Form.Item className="w-full" name="content" label="Nội dung điều trị">
                <TextArea
                  rows={4}
                  className=" w-full text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-[7px] px-4 "
                  placeholder=""
                  maxLength={500}
                />
              </Form.Item>
            </div>
            <div className="w-full ">
              <Form.Item className="w-full" name="note" label="Ghi chú">
                <TextArea
                  // disabled={dataSaleOrderHistory?.isView}
                  rows={4}
                  className={classNames(
                    ' w-full text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-[7px] px-4',
                    // { ' cursor-not-allowed': dataSaleOrderHistory?.isView })
                  )}
                  placeholder=""
                  maxLength={500}
                />
              </Form.Item>
            </div>
            <div className="w-full ">
              {/* Payment Form */}
              <Checkbox
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
                        initialValue={`${form?.getFieldValue('code') ?? ''} - Khách hàng thanh toán`}
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
                          {(paidPayment + Number(form.getFieldValue().totalPaymentAmount)).toLocaleString(
                            'de-DE',
                          )} VND{' '}
                        </div>
                      </div>
                      <div className="flex justify-between w-full">
                        <div className=" text-base font-medium text-[#6B7280]"> Tổng số còn lại:</div>
                        <div className="text-base font-semibold text-[#4B5563]">
                          {' '}
                          {(balancePayment - Number(form.getFieldValue().totalPaymentAmount)).toLocaleString(
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
        {/* <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          className="!w-10/12 h-full"
          onCancel={() => {
            setPreviewOpen(false);
          }}
        >
          <img alt="example" style={{ width: '100%', height: '100%' }} src={previewImage} />
        </Modal> */}
      </Modal>
    </div>
  );
};
