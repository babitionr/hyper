import { Form, Input, Select, Modal, DatePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { DebtService } from 'services/debt';
import TableData from './components/tablePayment';
import { useSearchParams } from 'react-router-dom';
import { useLocation } from 'react-router';

const CreateDebt = ({ handleChange, setShowModal, showModal, data: dataCustomer, getDebt }) => {
  const branchUuid = localStorage.getItem('branchUuid');
  const [form] = Form.useForm();
  // const [formValues, setFormValues] = useState({});
  const [searchParams] = useSearchParams();
  const customerUuid = searchParams.get('id');

  const [data, setData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const getReceiptList = async () => {
      try {
        const res = await DebtService.getDeptNotPaid({ customerUuid: customerUuid ?? dataCustomer?.uuid });
        setDataSource(
          res.data?.map((i, idx) => ({
            ...i,
            key: idx,
            returnPrice: (i?.totalPaymentAmount ?? 0) - (i?.paidAmount ?? 0),
          })),
        );
      } catch (error) {
        console.log('error: ', error);
      }
    };
    getReceiptList();
  }, [location.pathname]);
  const handleOk = async () => {
    const value = await form.validateFields();
    const param = {
      createdAt: value?.createdAt ? moment(value.createdAt).format('YYYY-MM-DD HH:ss:mm') : null,
      note: value.note,
      totalAmount: value.totalAmount,
      customerUuid: dataCustomer?.uuid,
      form: value.form,
      branchUuid,
      itemsDto: dataSource
        ?.filter((i) => !!i?.paymentAmount)
        ?.map((i) => ({ uuid: i.uuid, receiptAmount: i?.paymentAmount })),
    };

    if (data?.uuid) {
      const res = await DebtService.post({ ...param, uuid: dataCustomer?.uuid });
      if (res) {
        handleCancel();
        handleChange && handleChange();
        getDebt && getDebt();
      }
    } else {
      const res = await DebtService.post({ ...param, uuid: null });
      if (res) {
        handleCancel();
        handleChange && handleChange();
        getDebt && getDebt();
      }
    }
  };
  const handleCancel = () => {
    setShowModal(false);
    form.resetFields();
    setData();
  };

  const handleOpenModal = async (isOpen, data) => {
    setShowModal(isOpen);

    if (!data) {
      return false;
    }
    const detailData = await DebtService.getById({ uuid: data?.uuid }, branchUuid);

    const valueDetail = {
      ...detailData,
      customer: detailData?.customer?.uuid,
      doctor: detailData?.doctor?.id,
      service: detailData?.mtService?.id,
      eventDay: moment(detailData.eventTime),
      eventHour: moment(detailData.eventTime),
      expected: detailData.estTime,
    };
    setData(valueDetail);
    form.setFieldsValue(valueDetail);
  };
  return [
    handleOpenModal,
    () => (
      <>
        {' '}
        {showModal && (
          <Modal
            destroyOnClose={true}
            title={
              <div className="flex justify-between">
                <div className="text-lg font-bold">Thu nợ</div>
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
            open={showModal}
            footer={null}
            className="min-w-min pb-0"
            closable={false}
            // style={{ top: 5 }}
            width={1300}
          >
            <Form
              onFinishFailed={({ errorFields }) =>
                errorFields.length && form.scrollToField(errorFields[0].name, { behavior: 'smooth' })
              }
              onFinish={() => {
                handleOk();
              }}
              form={form}
              // onValuesChange={(_, values) => setFormValues((prevState) => ({ ...prevState, ...values }))}
              colon={false}
              className=" min-w-min"
            >
              <div className="">
                <div className="  bg-white ">
                  {/* <div className="flex items-start justify-between p-4 border-b-2 border-solid border-blue-50  rounded-t">
                <h3 className="text-lg font-bold">Thông tin khách hàng</h3>
                <button
                  className=""
                  onClick={() => {
                    onReset();
                    handleCancel();
                  }}
                >
                  <span className="text-4xl pr-2">x</span>
                </button>
              </div> */}

                  <div className="p-2">
                    <div className="flex gap-4">
                      <div className="flex flex-wrap w-full">
                        <div className="w-full flex justify-between gap-4">
                          <Form.Item
                            className="w-6/12"
                            label="Ngày thanh toán"
                            name="createdAt"
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn ngày thanh toán!',
                              },
                            ]}
                          >
                            <DatePicker
                              placeholder="DD/MM/YYYY HH:MM:SS"
                              className="!w-full border rounded-lg !bg-white  border-gray-200"
                              format="DD/MM/YYYY HH:mm:ss"
                              disabledDate={(current) => {
                                const value = moment();
                                return current && current.isAfter(value, 'day');
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            className="w-6/12"
                            name="form"
                            label="Phương thức thanh toán"
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn phương thức thanh toán!',
                              },
                            ]}
                          >
                            <Select
                              className="w-full !rounded-lg  text-sm font-normal"
                              placeholder="Chọn phương thức thanh toán"
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                              allowClear
                              options={[
                                { label: 'Ngân hàng', value: 'BANK' },
                                { label: 'Tiền mặt', value: 'CASH' },
                                { label: 'POS', value: 'POS' },
                                { label: 'Trả góp', value: 'INS' },
                              ]}
                            ></Select>
                          </Form.Item>
                        </div>

                        <div className="w-full flex justify-between gap-4">
                          <Form.Item
                            className="w-full"
                            name="note"
                            label="Nội dung"
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng nhập nội dung thanh toán!',
                              },
                            ]}
                          >
                            <Input
                              placeholder="Ghi chú"
                              className="w-full text-sm font-normal block  rounded-lg border border-gray-200 !bg-white py-[7px] px-4"
                            />
                          </Form.Item>
                        </div>

                        <div className="table_add_invoice !w-full">
                          <TableData dataSource={dataSource} setDataSource={setDataSource} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Form.Item>
                    <div className="flex items-center justify-center  border-solid gap-6 border-slate-200 rounded-b">
                      <button
                        className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-16 py-2 text-base font-medium  "
                        type="button"
                        onClick={() => {
                          handleCancel();
                        }}
                      >
                        Hủy
                      </button>
                      <button
                        className="text-white bg-red-500 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300 rounded-lg px-16 py-2 text-base font-medium  hover:bg-red-600 hover:border-transparent outline-none focus:outline-none "
                        type="submit"
                      >
                        Thanh toán
                      </button>
                    </div>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Modal>
        )}
      </>
    ),
  ];
};

export default CreateDebt;
