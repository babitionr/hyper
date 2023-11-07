import { Form, Input, Select, Modal, DatePicker, TimePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import { CalendarService } from 'services/appointment-schedule';
import moment from 'moment';
import { useAuth } from 'global';
import { AuthSerivce } from 'services/Auth';
// import { useLocation } from 'react-router';
// import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;

const CreateCalendar = ({ handleChange, setShowModal, showModal, uuidRequest, dataCustomer }) => {
  const { branchUuid } = useAuth();
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const [disable, setDisable] = useState(false);
  const [dataEdit, setDataEdit] = useState();
  // const { pathname } = useLocation()

  // const onReset = () => {
  //   form.resetFields();
  // };
  const [listData, setListData] = useState({
    listDoctor: [],
    listServices: [],
    listCustomer: [],
    listExpected: [
      { key: '30 phút', value: 30 },
      { key: '1 giờ', value: 60 },
      { key: '1.5 giờ', value: 90 },
      { key: '2 giờ', value: 120 },
      { key: '2.5 giờ', value: 150 },
      { key: '3 giờ', value: 180 },
      { key: '3.5 giờ', value: 210 },
      { key: '4 giờ', value: 240 },
      { key: '4.5 giờ', value: 270 },
      { key: '5 giờ', value: 300 },
    ],
    listUserBySales: [],
  });

  useEffect(() => {
    form.setFieldsValue({ customer: dataCustomer?.fullName, contactNumber: dataCustomer?.phoneNumber });
  }, [showModal]);

  useEffect(() => {
    if (!branchUuid) return;
    const initFetch = async () => {
      try {
        const res = await CalendarService.getUserByPosition({ position: 'DOCTOR', branchUuid });
        const res1 = await CalendarService.getAllService(branchUuid);
        const res2 = await CalendarService.getListCustomer({ page: 1, perPage: 100, branchUuid });
        const res_userbysale = await AuthSerivce.getUserByPosition({ position: 'TELESALES', branchUuid });
        setListData((prev) => ({
          ...prev,
          listDoctor: res.data,
          listServices: res1.data,
          listCustomer: res2.data,
          listUserBySales: res_userbysale?.data,
        }));
      } catch (error) {
        return error;
      }
    };
    initFetch();
  }, [branchUuid]);

  const handleOk = async () => {
    if (dataEdit?.uuid) {
      const value = {
        id: dataEdit.id,
        uuid: dataEdit.uuid,
        contactNumber: dataCustomer?.phoneNumber,
        customer: {
          uuid: dataCustomer?.uuid,
        },
        doctor: {
          id: formValues.doctor,
        },
        mtService: {
          id: formValues.service,
        },
        eventTime: moment(formValues.eventDay).format('YYYY-MM-DD ') + moment(formValues.eventHour).format('HH:mm:ss'),
        eventDay: null,
        eventHour: null,
        estTime: formValues.expected,
        status: formValues.status,
        content: formValues.content,
        customerType: formValues.customerType,
        reason: formValues.reason,
      };
      delete value.expected;
      delete value.service;

      const res = await CalendarService.put(value, branchUuid);
      if (res) {
        // handleChange();
        form.resetFields();
        setShowModal(false);
        setDataEdit({});
      }
    } else {
      try {
        const values = {
          ...formValues,
          contactNumber: dataCustomer?.phoneNumber,
          customer: {
            uuid: dataCustomer?.uuid,
          },
          doctor: {
            id: formValues.doctor,
          },
          mtService: {
            id: formValues.service,
          },
          customerType: formValues.customerType,
          eventTime:
            moment(formValues.eventDay).format('YYYY-MM-DD ') + moment(formValues.eventHour).format('HH:mm:ss'),
          eventDay: null,
          eventHour: null,
          estTime: formValues.expected,
          status: formValues.status,
          content: formValues.content,
        };
        delete values.expected;
        delete values.service;
        const res = await CalendarService.post(values, branchUuid);
        if (res) {
          // handleChange();
          setDisable(true);
          setShowModal(false);
          form.resetFields();
          setDataEdit({});
        }
      } catch (error) {
        return error;
      } finally {
        setDisable(false);
      }
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
    setDataEdit({});
  };

  const handleEdit = async (isOpen, data) => {
    setShowModal(isOpen);

    if (!data) {
      return false;
    }
    const detailData = await CalendarService.getById({ uuid: data?.uuid }, branchUuid);

    const valueDetail = {
      ...detailData,
      customer: detailData?.customer?.fullName,
      doctor: detailData?.doctor?.id,
      service: detailData?.mtService?.id,
      eventDay: moment(detailData.eventTime),
      eventHour: moment(detailData.eventTime),
      expected: detailData.estTime,
    };
    setDataEdit(valueDetail);
    form.setFieldsValue(valueDetail);
  };
  return [
    handleEdit,
    () => (
      <>
        {' '}
        {showModal && (
          <Modal
            destroyOnClose={true}
            title={
              <div className="flex justify-between">
                <div className="text-lg font-bold">{!dataEdit?.uuid ? 'Đặt lịch hẹn' : 'Cập nhật lịch hẹn'}</div>
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
            className="!w-8/12 xl:!w-7-12 min-w-min pb-0"
            closable={false}
            // style={{ top: 5 }}
          >
            <Form
              onFinish={() => {
                handleOk();
              }}
              form={form}
              onValuesChange={(_, values) => setFormValues((prevState) => ({ ...prevState, ...values }))}
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
                      <div className="flex flex-wrap gap-2 w-full">
                        <div className="w-full flex justify-between gap-4">
                          <Form.Item
                            className="w-6/12"
                            label="Khách hàng"
                            name="customer"
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: 'Vui lòng chon khách hàng!',
                            //   },
                            // ]}
                          >
                            <Input
                              className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                              placeholder=""
                              disabled={true}
                            />
                          </Form.Item>
                          <Form.Item
                            className="w-6/12"
                            name="contactNumber"
                            label="Số điện thoại"
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: 'Vui lòng nhập số điện thoại',
                            //   },
                            // ]}
                          >
                            <Input
                              className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                              placeholder="Số điện thoại"
                              disabled={true}
                            />
                          </Form.Item>
                        </div>
                        <div className="w-full flex justify-between gap-4">
                          <Form.Item
                            className="w-1/3"
                            name="doctor"
                            label="Bác sĩ"
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn bác sĩ!',
                              },
                            ]}
                          >
                            <Select className="w-full !rounded-lg  text-sm font-normal" placeholder="Chọn bác sĩ">
                              {listData?.listDoctor?.map((i, idx) => (
                                <Option key={idx} className="w-full" value={i.id}>
                                  {i.lastName + ' ' + i.firstName}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            className="w-1/3"
                            name="service"
                            label="Dịch vụ"
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn dịch vụ!',
                              },
                            ]}
                          >
                            <Select className="w-full !rounded-lg  text-sm font-normal" placeholder="Chọn dịch vụ">
                              {listData?.listServices?.map((i, idx) => (
                                <Option key={idx} className="w-full" value={i.id}>
                                  {i.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item className="w-1/3" name="saleEmployeeUuid" label="Sale">
                            <Select
                              className="!w-full !rounded-lg  text-sm font-normal"
                              placeholder="Chọn nhân viên sales"
                              allowClear
                              showSearch
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                              options={listData.listUserBySales.map((i) => ({
                                value: i?.uuid,
                                label: i?.firstName ?? '' + ' ' + i?.lastName ?? '',
                              }))}
                            ></Select>
                          </Form.Item>
                        </div>
                        <div className="w-full flex justify-between gap-4">
                          <Form.Item
                            className="w-4/12"
                            label="Ngày hẹn"
                            name="eventDay"
                            initialValue={moment()}
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn ngày hẹn!',
                              },
                            ]}
                          >
                            <DatePicker
                              placeholder="DD/MM/YYYY"
                              className="!w-full border rounded-lg !bg-white  border-gray-200"
                              format="DD/MM/YYYY"
                            />
                          </Form.Item>
                          <Form.Item
                            className="w-4/12"
                            label="Giờ hẹn"
                            name="eventHour"
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn giờ hẹn!',
                              },
                            ]}
                          >
                            <TimePicker
                              placeholder="hh:mm"
                              className="!w-full border rounded-lg !bg-white  border-gray-200"
                              format="HH:mm"
                              disabledTime={() => {
                                return {
                                  disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 21, 22, 23],
                                };
                              }}
                            />
                          </Form.Item>
                          <Form.Item
                            className="w-4/12"
                            name="expected"
                            label="Dự kiến"
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn thời gian dự kiến!',
                              },
                            ]}
                          >
                            <Select className="w-full !rounded-lg  text-sm font-normal" placeholder="Chọn thời gian">
                              {listData.listExpected.map((i, idx) => {
                                return (
                                  <Option key={idx} value={i.value}>
                                    {i.key}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                        </div>

                        <div className="w-full flex justify-between gap-4">
                          <Form.Item
                            className="w-6/12"
                            name="status"
                            label="Trạng thái"
                            initialValue={'COMING'}
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn trạng thái!',
                              },
                            ]}
                          >
                            <Select className="w-full !rounded-lg  text-sm font-normal" placeholder="Chọn trạng thái">
                              <Option className="w-full" value="COMING">
                                Đang đến
                              </Option>
                              <Option className="w-full" value="CAME">
                                Đã đến
                              </Option>
                              <Option className="w-full" value="CANCEL">
                                Hủy hẹn
                              </Option>
                              <Option className="w-full" value="DELAY">
                                Trễ hẹn
                              </Option>
                              <Option className="w-full" value="NOT_COME">
                                Không đến
                              </Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            className="w-6/12"
                            name="customerType"
                            label="Loại khách"
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn loại khách!',
                              },
                            ]}
                          >
                            <Select className="w-full !rounded-lg  text-sm font-normal" placeholder="Chọn loại khách">
                              <Option className="w-full" value="RE_EXAMINATION">
                                Tái khám
                              </Option>
                              <Option className="w-full" value="NEW">
                                Khách mới
                              </Option>
                            </Select>
                          </Form.Item>
                        </div>
                        {!!dataEdit?.uuid && (
                          <div className="w-full flex justify-between gap-4">
                            <Form.Item
                              className="w-full"
                              label="Lý do"
                              name="reason"
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: 'Vui lòng chon khách hàng!',
                              //   },
                              // ]}
                            >
                              <Input
                                className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                placeholder="Nhập lý do"
                              />
                            </Form.Item>
                          </div>
                        )}

                        <div className="w-full flex justify-between gap-4">
                          <Form.Item className="w-full" name="content" label="Nội dung">
                            <TextArea
                              rows={4}
                              placeholder="Ghi chú"
                              className="w-full text-sm font-normal block  rounded-lg border border-gray-200 !bg-white py-[7px] px-4"
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
                        disabled={disable}
                        // onClick={() => {
                        //   handleOk();
                        // }}
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
      </>
    ),
  ];
};

export default CreateCalendar;
