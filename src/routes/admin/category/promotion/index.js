import React, { useState, useEffect } from 'react';
import { HookDataTable } from 'hooks';
import { columnPromotion } from './columns/columnPromotion';
import { DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
// import classNames from 'classnames';
import './index.less';
import { PromotionService } from 'services/promotion';
import moment from 'moment';
import { Message } from 'components';
const Page = ({ canEdit = true, showText = true }) => {
  const { Option } = Select;

  const { TextArea } = Input;
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [suffixTotalAmount, setSuffixTotalAmount] = useState('PERCENT');
  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
  };
  const deletePromotion = async (uuid) => {
    const res = await PromotionService.delete(uuid);
    if (res) {
      await handleChange();
    }
    return res;
  };
  const activePromotion = async (data) => {
    if (data) {
      const res = await PromotionService.activePromotion(data?.uuid);
      if (res) {
        await handleChange();

        if (data?.isActivated)
          await Message.success({
            text: 'Khóa mã khuyến mãi thành công',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
        if (!data?.isActivated)
          await Message.success({
            text: 'Mở khóa mã khuyến mãi thành công',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
      }
      return res;
    }
  };

  const [handleChange, DataTable] = HookDataTable({
    columns: columnPromotion({ setShowModal, deletePromotion, activePromotion }),
    fullTextSearch: 'search',
    xScroll: 1500,
    Get: async (params) => {
      return await PromotionService.get({ ...params, branchUuid: localStorage.getItem('branchUuid') });
    },
    loadFirst: false,
    rightHeader: (
      <div className="flex gap-3 flex-col sm:flex-row">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
          onClick={() => setShowModal(true)}
        >
          <i className="las la-plus mr-1" />
          Thêm mới
        </button>
      </div>
    ),
  });

  useEffect(() => {
    handleChange();
  }, []);
  const handleSubmit = async () => {
    const Formdata = form.getFieldValue();
    const values = {
      ...Formdata,
      fromDate: moment(Formdata?.fromDate).format('YYYY-MM-DD 00:00:01'),
      toDate: moment(Formdata?.toDate).format('YYYY-MM-DD 23:59:59'),
      branchUuid: localStorage.getItem('branchUuid'),
      totalAmount: Number(Formdata?.totalAmount),
    };
    console.log(values);
    const res = await PromotionService.post(values);
    if (res) {
      handleCancel();
      handleChange();
    }
  };
  return (
    <div className="min-h-screen supplier">
      <div className="bg-white p-4">
        <h2 className="font-semibold text-lg mb-5">{'Mã khuyến mãi'.toUpperCase()}</h2>
        <div>{DataTable()}</div>
        <div>
          <div>
            {showModal && (
              <Modal
                // bodyStyle={{ height: 175 }}
                destroyOnClose={true}
                title={
                  <div className="flex justify-between">
                    <div className="text-base font-bold">Thêm mã khuyến mãi</div>
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
                width={900}
              >
                <Form form={form} colon={false} className="min-w-min" onFinish={handleSubmit}>
                  <div className="">
                    <div className="  bg-white ">
                      <div className="p-2">
                        <div className="flex gap-4">
                          <div className="flex flex-wrap gap-2 w-full">
                            <div className="w-full flex justify-between gap-4">
                              <Form.Item
                                className="w-6/12"
                                label="Mã KM"
                                name="code"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng nhập mã KM!',
                                  },
                                ]}
                              >
                                <Input
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder="Nhập mã KM"
                                />
                              </Form.Item>
                              <Form.Item
                                className="w-6/12"
                                name="totalAmount"
                                label="Giá trị"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng nhập giá trị',
                                  },
                                  {
                                    validator(_, value) {
                                      console.log(value);
                                      if (Number(value) > 0) {
                                        return Promise.resolve();
                                      } else return Promise.reject(new Error('Nhập giá trị lớn hơn 0'));
                                    },
                                  },
                                ]}
                              >
                                {suffixTotalAmount === 'PERCENT' ? (
                                  <InputNumber
                                    min={0}
                                    max={100}
                                    className="antdInputNumberSuffix h-10 text-sm font-normal block !w-full rounded-l-lg text-black"
                                    addonAfter={'%'}
                                  />
                                ) : (
                                  <InputNumber
                                    min={0}
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
                                    placeholder=""
                                    className="antdInputNumberSuffix h-10 text-sm font-normal block !w-full rounded-l-lg text-black "
                                  />
                                )}
                              </Form.Item>
                            </div>
                            <div className="w-full">
                              <Form.Item
                                className="w-full"
                                name="description"
                                label="Mô tả"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Nhập mô tả',
                                  },
                                ]}
                              >
                                <TextArea
                                  rows={1}
                                  className=" w-full text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder=""
                                />
                              </Form.Item>
                            </div>
                            <div className="w-full flex justify-between gap-4">
                              <Form.Item
                                className="w-6/12"
                                name="quantity"
                                label="Số lượng"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng!',
                                  },
                                  {
                                    validator(_, value) {
                                      if (Number(value) > 0) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(new Error('Nhập số lượng lớn hơn 0'));
                                    },
                                  },
                                ]}
                              >
                                <Input
                                  type="number"
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder="Nhập số lượng"
                                  onChange={(e) => {
                                    form.setFieldsValue({ quantity: Number(e.target.value) });
                                  }}
                                />
                              </Form.Item>
                              <Form.Item
                                className="w-6/12"
                                name="promotionType"
                                label="Hình thức"
                                initialValue={'PERCENT'}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng chọn hình thức',
                                  },
                                ]}
                              >
                                <Select
                                  className="w-full !rounded-lg  text-sm font-normal"
                                  placeholder="Chọn hình thức"
                                  onChange={(value) => {
                                    if (value === 'PERCENT' && form.getFieldValue('totalAmount') > 100) {
                                      form.setFieldsValue({ totalAmount: 100 });
                                    }
                                    setSuffixTotalAmount((prev) => value);
                                  }}
                                >
                                  <Option className="w-full" value="PERCENT">
                                    %
                                  </Option>
                                  <Option className="w-full" value="CASH">
                                    Tiền mặt
                                  </Option>
                                </Select>
                              </Form.Item>
                            </div>
                            <div className="w-full flex justify-between gap-4">
                              <Form.Item
                                className="w-6/12"
                                name="fromDate"
                                label="Ngày tạo"
                                initialValue={moment()}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Chọn ngày tạo ',
                                  },
                                ]}
                              >
                                <DatePicker
                                  placeholder="Chọn ngày tạo"
                                  className="!w-full border rounded-lg !bg-white  border-gray-200"
                                  format="DD/MM/YYYY"
                                  disabledDate={(current) => {
                                    const value = moment(form.getFieldsValue().toDate ?? false);
                                    const isValid = moment(form.getFieldsValue().toDate ?? false).isValid();
                                    return !isValid ? false : current && current.valueOf() > value;
                                  }}
                                />
                              </Form.Item>
                              <Form.Item
                                className="w-6/12"
                                name="toDate"
                                label="Ngày kết thúc"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Chọn ngày kết thúc ',
                                  },
                                ]}
                              >
                                <DatePicker
                                  placeholder="Chọn ngày kết thúc"
                                  className="!w-full border rounded-lg !bg-white  border-gray-200"
                                  format="DD/MM/YYYY"
                                  disabledDate={(current) => {
                                    const value = moment(form.getFieldsValue().fromDate ?? false);
                                    const isValid = moment(form.getFieldsValue().fromDate ?? false).isValid();
                                    return !isValid ? false : current && current.valueOf() < value;
                                  }}
                                />
                              </Form.Item>
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
                            Lưu
                          </button>
                        </div>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
