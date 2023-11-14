import { Form, Input, Select, Modal, DatePicker, TimePicker, Button, ConfigProvider } from 'antd';
import React, { useState, useEffect } from 'react';
import { CalendarService } from 'services/appointment-schedule';
import moment from 'moment';
import { useAuth } from 'global';
import AddCustomer from '../customer/AddCustomer';
import classNames from 'classnames';
import { Message } from 'components';
import { AuthSerivce } from 'services/Auth';
import { useLocation } from 'react-router';

const { Option } = Select;
const { TextArea } = Input;

const CreateCalendar = ({ setShowModal, showModal }) => {
  const { branchUuid, user } = useAuth();
  const permission = user?.featureDtos?.find((i) => i?.code === 'MANAGE_CALENDAR') ?? {};
  const [form] = Form.useForm();
  // const [formValues, setFormValues] = useState({});
  const [dataEdit, setDataEdit] = useState();
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const [listData, setListData] = useState({
    listDoctor: [],
    listServices: [],
    listCustomer: [],
    listUserBySales: [],
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
  });
  const location = useLocation();

  useEffect(() => {
    if (!branchUuid) return;
    const initFetch = async () => {
      try {
        const res_doctor = await CalendarService.getListDoctor({ position: 'DOCTOR', branchUuid });
        const res_service = await CalendarService.getAllService(branchUuid);
        const res_customer = await CalendarService.getListCustomer({ page: 1, perPage: 1000, branchUuid });
        const res_userbysale = await AuthSerivce.getUserByPosition({ position: 'TELESALES', branchUuid });
        setListData((prev) => ({
          ...prev,
          listDoctor: res_doctor?.data ?? [],
          listServices: res_service.data,
          listCustomer: res_customer.data,
          listUserBySales: res_userbysale.data,
        }));
      } catch (error) {
        return error;
      }
    };
    initFetch();
  }, [location.pathname, branchUuid]);

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
    setDataEdit();
    setIsLoadingSubmit(false);
  };
  const handleSubmit = async () => {
    setIsLoadingSubmit(true);
    const formData = form.getFieldsValue();
    if (dataEdit?.id) {
      const value = {
        id: dataEdit.id,
        uuid: dataEdit.uuid,
        contactNumber: formData.contactNumber,
        customer: {
          uuid: formData.customer,
        },
        doctor: {
          id: formData.doctor,
        },
        mtService: {
          id: formData.service,
        },
        eventTime: moment(formData.eventDay).format('YYYY-MM-DD ') + moment(formData.eventHour).format('HH:mm:ss'),
        estTime: formData.expected,
        eventDay: null,
        eventHour: null,
        status: formData.status,
        content: formData.content,
        customerType: formData.customerType,
        saleEmployeeUuid: formData.saleEmployeeUuid,
      };
      delete value.expected;
      delete value.service;

      await CalendarService.put(value, branchUuid);
      handleCancel();
    } else {
      try {
        const values = {
          ...formData,
          contactNumber: formData.contactNumber,
          customer: {
            uuid: formData.customer,
          },
          doctor: {
            id: formData.doctor,
          },
          mtService: {
            id: formData.service,
          },
          customerType: formData.customerType,
          eventTime: moment(formData.eventDay).format('YYYY-MM-DD ') + moment(formData.eventHour).format('HH:mm:ss'),
          estTime: formData.expected,
          // status: null,
          eventDay: null,
          eventHour: null,
          content: formData.content,
        };
        delete values.expected;
        delete values.service;
        const res = await CalendarService.post(values, branchUuid);
        if (res) {
          handleCancel();
        }
      } catch (error) {
        return error;
      }
    }
    setIsLoadingSubmit(false);
  };

  const handleDeleteCalendar = async () => {
    const res = await CalendarService.deleteCalendar(dataEdit?.uuid, branchUuid);
    if (res) {
      Message.success({ text: 'Xóa lịch hẹn thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      handleCancel();
      setOpenModalDelete(false);
    }
  };

  const handleOpenModal = async (isOpen, data) => {
    setShowModal(isOpen);

    if (!data) {
      return false;
    }
    const detailData = await CalendarService.getById({ uuid: data?.uuid }, branchUuid);

    const valueDetail = {
      ...detailData,
      customer: detailData?.customer?.uuid,
      doctor: detailData?.doctor?.id,
      service: detailData?.mtService?.id,
      eventDay: moment(detailData.eventTime),
      eventHour: moment(detailData.eventTime),
      expected: detailData.estTime,
    };
    setDataEdit({ ...valueDetail, uuid: data?.uuid });
    form.setFieldsValue(valueDetail);
  };

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const handleChangeAddUser = async () => {
    try {
      // get list customer after submit
      const res_customer = await CalendarService.getListCustomer({ page: 1, perPage: 1000, branchUuid });
      setListData((prev) => ({ ...prev, listCustomer: res_customer.data }));
    } catch (error) {
      console.log(error);
    }
  };

  const [handleOpenAddUserModal, AddCustomerModal] = AddCustomer({
    handleChange: handleChangeAddUser,
    setShowModal: setShowAddUserModal,
    showModal: showAddUserModal,
  });

  return [
    handleOpenModal,
    () => (
      <>
        {' '}
        {showModal && (
          <ConfigProvider
            theme={{
              components: {
                Modal: {
                  wireframe: true, // here
                },
              },
            }}
          >
            <Modal
              destroyOnClose={true}
              title={
                <div className="flex justify-between">
                  <div className="text-lg font-bold">{!dataEdit?.uuid ? 'Đặt lịch hẹn' : 'Chỉnh sửa lịch hẹn'}</div>
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
              className="!w-8/12 xl:!w-7/12 min-w-min pb-0"
              closable={false}
              // style={{ top: 5 }}
            >
              <Form
                form={form}
                onFinishFailed={({ errorFields }) =>
                  errorFields.length && form.scrollToField(errorFields[0].name, { behavior: 'smooth' })
                }
                // onValuesChange={(_, values) => setFormValues((prevState) => ({ ...prevState, ...values }))}
                colon={false}
                className=" min-w-min"
              >
                <div className="">
                  <div className="  bg-white ">
                    <div className="p-2">
                      <div className="flex gap-4">
                        <div className="flex flex-wrap gap-2 w-full">
                          <div className="w-full flex justify-between gap-4">
                            <div className="w-6/12">
                              <div className="w-full custom1">
                                <Form.Item
                                  className={classNames('w-full !m-0', {
                                    'w-[calc(100%-48px)]': !dataEdit?.id,
                                  })}
                                  label="Khách hàng"
                                  name="customer"
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Vui lòng chọn khách hàng!',
                                    },
                                  ]}
                                ></Form.Item>
                                <div className="flex custom1">
                                  <Select
                                    allowClear
                                    showSearch
                                    filterOption={(search, item) => {
                                      const itemValue = item.children.trim().toLowerCase();
                                      const searchValue = search.trim().toLowerCase();
                                      // xóa dấu và thay ký tự đĐ
                                      const itemValueNormalize = itemValue
                                        .normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .replace(/[đĐ]/g, 'd');
                                      const searchValueNormalize = searchValue
                                        .normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .replace(/[đĐ]/g, 'd');
                                      return itemValueNormalize.indexOf(searchValueNormalize) >= 0;
                                    }}
                                    className="!w-full !rounded-lg  text-sm font-normal custom1"
                                    placeholder="Chọn khách hàng"
                                    onChange={(value) => {
                                      const customer = listData.listCustomer.find((i) => i.uuid === value);
                                      form.setFieldsValue({
                                        contactNumber: customer?.phoneNumber,
                                      });
                                    }}
                                  >
                                    {listData?.listCustomer?.map((i, idx) => (
                                      <Option key={idx} className="w-full custom1" value={i.uuid}>
                                        {`${i.fullName} (${i.phoneNumber ?? 'Chưa có số điện thoại'})`}
                                      </Option>
                                    ))}
                                  </Select>
                                  {!dataEdit?.id && (
                                    <Form.Item className="!ml-2">
                                      <Button
                                        onClick={() => {
                                          handleOpenAddUserModal(true);
                                        }}
                                        className="!border-rose-500 border !text-white bg-rose-500 focus:!bg-rose-600
                                 hover:!bg-rose-600 flex h-10 !w-10 items-center !rounded-lg justify-center custom1"
                                      >
                                        <i className="las la-plus bold"></i>
                                      </Button>
                                    </Form.Item>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="w-6/12">
                              <Form.Item
                                className="w-full !m-0 custom1 bg-white"
                                name="contactNumber"
                                label="Số điện thoại"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại',
                                  },
                                ]}
                              ></Form.Item>
                              <Input
                                className="h-10 w-full text-sm font-normal block rounded-lg border border-gray-200  py-[7px] px-4 custom1 custom2"
                                placeholder="Số điện thoại"
                              />
                            </div>
                          </div>
                          <div className="w-full flex justify-between gap-4 !mb-5">
                            <div className="w-full custom1">
                              <Form.Item
                                className="w-1/3 !m-0"
                                name="doctor"
                                label="Bác sĩ"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng chọn bác sĩ!',
                                  },
                                ]}
                              ></Form.Item>
                              <Select className="w-full !rounded-lg  text-sm font-normal" placeholder="Chọn bác sĩ">
                                {listData?.listDoctor?.map((i, idx) => (
                                  <Option key={idx} className="w-full custom1" value={i.id}>
                                    {i.lastName + ' ' + i.firstName}
                                  </Option>
                                ))}
                              </Select>
                            </div>
                            <div className="w-full custom1">
                              <Form.Item
                                className="w-1/3 !m-0"
                                name="service"
                                label="Nhóm dịch vụ"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng chọn dịch vụ!',
                                  },
                                ]}
                              ></Form.Item>
                              <Select className="w-full !rounded-lg  text-sm font-normal" placeholder="Chọn dịch vụ">
                                {listData?.listServices?.map((i, idx) => (
                                  <Option key={idx} className="w-full custom1" value={i.id}>
                                    {i.name}
                                  </Option>
                                ))}
                              </Select>
                            </div>
                            <div className="w-full custom1">
                              <Form.Item className="w-1/3 !m-0" name="saleEmployeeUuid" label="Sale"></Form.Item>
                              <Select
                                className="!w-full !rounded-lg  text-sm font-normal custom1"
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
                            </div>
                          </div>
                          <div className="w-full flex justify-between gap-4 !mb-5">
                            <div className="w-full custom1">
                              <Form.Item
                                className="w-1/3 !m-0"
                                label="Ngày hẹn"
                                name="eventDay"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng chọn ngày hẹn!',
                                  },
                                ]}
                                initialValue={moment()}
                              ></Form.Item>

                              <DatePicker
                                placeholder="DD/MM/YYYY"
                                className="!w-full border rounded-lg !bg-white  border-gray-200"
                                format="DD/MM/YYYY"
                              />
                            </div>
                            <div className="w-full custom1">
                              <Form.Item
                                className="w-1/3 !m-0"
                                label="Giờ hẹn"
                                name="eventHour"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng chọn giờ hẹn!',
                                  },
                                ]}
                                initialValue={moment()}
                              ></Form.Item>

                              <TimePicker
                                placeholder="HH:mm"
                                className="!w-full border rounded-lg !bg-white  border-gray-200"
                                format="HH:mm"
                                disabledTime={() => {
                                  return {
                                    disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 21, 22, 23],
                                  };
                                }}
                              />
                            </div>
                            <div className="w-full custom1">
                              <Form.Item
                                className="w-1/3 !m-0"
                                name="expected"
                                label="Dự kiến"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng chọn thời gian dự kiến!',
                                  },
                                ]}
                              ></Form.Item>
                              <Select
                                className="w-full !rounded-lg custom1 text-sm font-normal"
                                placeholder="Chọn thời gian"
                              >
                                {listData.listExpected.map((i, idx) => {
                                  return (
                                    <Option key={idx} value={i.value}>
                                      {i.key}
                                    </Option>
                                  );
                                })}
                              </Select>
                            </div>
                          </div>

                          <div className="w-full flex justify-between gap-4 !mb-5">
                            <div className="w-full custom1">
                              <Form.Item
                                className="w-6/12 !m-0"
                                name="status"
                                label="Trạng thái"
                                initialValue={'COMING'}
                              ></Form.Item>
                              <Select
                                className="w-full !rounded-lg  text-sm font-normal custom1"
                                placeholder="Chọn trạng thái"
                              >
                                <Option className="w-full custom1" value="COMING">
                                  Đang đến
                                </Option>
                                <Option className="w-full custom1" value="CAME">
                                  Đã đến
                                </Option>
                                <Option className="w-full custom1" value="CANCEL">
                                  Hủy hẹn
                                </Option>
                                <Option className="w-full custom1" value="DELAY">
                                  Trễ hẹn
                                </Option>
                                <Option className="w-full custom1" value="NOT_COME">
                                  Không đến
                                </Option>
                              </Select>
                            </div>
                            <div className="w-full custom1">
                              <Form.Item
                                className="w-6/12 !m-0"
                                name="customerType"
                                label="Loại khách"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng chọn loại khách!',
                                  },
                                ]}
                              ></Form.Item>
                              <Select
                                className="w-full !rounded-lg  text-sm font-normal custom1"
                                placeholder="Chọn loại khách"
                              >
                                <Option className="w-full custom1" value="RE_EXAMINATION">
                                  Tái khám
                                </Option>
                                <Option className="w-full custom1" value="NEW">
                                  Khách mới
                                </Option>
                              </Select>
                            </div>
                          </div>
                          <div className="w-full justify-between gap-4 !mb-3">
                            <div className="w-full custom1"></div>
                            <Form.Item className="w-full custom1 !m-0" name="content" label="Nội dung"></Form.Item>

                            <TextArea
                              rows={4}
                              placeholder="Ghi chú"
                              className="w-full text-sm font-normal block  rounded-lg border border-gray-200 !bg-white py-[7px] px-4 custom1"
                            />
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
                        <Button
                          className=" !border-rose-500 border !text-white !bg-rose-500 focus:!bg-rose-600 hover:!bg-rose-600 !px-16 flex items-center justify-center !pt-4 !pb-6 !text-base font-medium !mr-0 "
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
                        {dataEdit?.uuid && permission?.delete && (
                          <Button
                            className=" !border-rose-500 border !text-white !bg-rose-500 focus:!bg-rose-600 hover:!bg-rose-600 !px-16 flex items-center justify-center !pt-4 !pb-6 !text-base font-medium !mr-0 "
                            onClick={async (e) => {
                              e.preventDefault();
                              try {
                                setOpenModalDelete(true);
                              } catch (error) {
                                console.log(error);
                              }
                            }}
                          >
                            <span className="pt-2">Xóa</span>
                          </Button>
                        )}
                      </div>
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </Modal>
          </ConfigProvider>
        )}
        {AddCustomerModal()}
        <Modal
          destroyOnClose={true}
          title={false}
          open={openModalDelete}
          footer={null}
          className="!w-4/12 xl:!w-4/12 min-w-min pb-0"
          closable={false}
          style={{ top: '30%' }}
        >
          <div className="">
            <div className="  bg-white ">
              <div className="p-2">
                <div className="flex gap-4">
                  <div className="flex flex-wrap gap-2 w-full">
                    <div className="w-full flex justify-center gap-4">
                      <svg
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M60 10C32.5 10 10 32.5 10 60C10 87.5 32.5 110 60 110C87.5 110 110 87.5 110 60C110 32.5 87.5 10 60 10ZM78.5 71.5C80.5 73.5 80.5 76.5 78.5 78.5C76.5 80.5 73.5 80.5 71.5 78.5L60 67L48.5 78.5C46.5 80.5 43.5 80.5 41.5 78.5C39.5 76.5 39.5 73.5 41.5 71.5L53 60L41.5 48.5C39.5 46.5 39.5 43.5 41.5 41.5C43.5 39.5 46.5 39.5 48.5 41.5L60 53L71.5 41.5C73.5 39.5 76.5 39.5 78.5 41.5C80.5 43.5 80.5 46.5 78.5 48.5L67 60L78.5 71.5Z"
                          fill="#EE4055"
                        />
                      </svg>
                    </div>
                    <div className="w-full flex justify-center gap-4">
                      <div className=" text-rose-500 font-bold text-3xl">Xóa lịch hẹn</div>
                    </div>
                    <div className="w-full flex justify-center gap-4">
                      <div>Bạn có chắc muốn xóa lịch hẹn này?</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-center  border-solid gap-6 border-slate-200 rounded-b">
                  <button
                    className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-16 py-2 text-base font-medium  "
                    type="button"
                    onClick={() => {
                      setOpenModalDelete(false);
                    }}
                  >
                    Đóng
                  </button>

                  <button
                    className="text-white bg-rose-500 active:ring-2 ring-offset-1 ring-offset-rose-300 ring-rose-300 rounded-lg px-16 py-2 text-base font-medium  hover:bg-rose-600 hover:border-transparent outline-none focus:outline-none "
                    type="submit"
                    onClick={async () => {
                      await handleDeleteCalendar();
                    }}
                  >
                    <p className=" whitespace-nowrap">Xác nhận</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </>
    ),
  ];
};

export default CreateCalendar;
