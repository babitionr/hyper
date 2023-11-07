import { Checkbox, Form, Modal, Select } from 'antd';
import { HookDataTable } from 'hooks';
import React, { useState } from 'react';
// import { useNavigate } from 'react-router';
import './index.less';
import { Message } from 'components';
import { columnNotification } from './columns/columnNotification';
import { NotificationService } from 'services/notification';
import { useFetch } from 'utils/func';
import { AuthSerivce } from 'services/Auth';

// const { Option } = Select;
const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState({});

  const { data: listUser } = useFetch({ apiFunction: AuthSerivce.getAllUser, params: {}, values: { showModal } });
  const listFrequency = [
    { time: '5 phút', value: 5 },
    { time: '10 phút', value: 10 },
    { time: '20 phút', value: 20 },
    { time: '30 phút', value: 30 },
    { time: '45 phút', value: 45 },
    { time: '60 phút', value: 60 },
    { time: '2 giờ', value: 120 },
    { time: '4 giờ', value: 240 },
  ];

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
    setData();
  };
  const handleDelete = async (id) => {
    await NotificationService.delete({ id });
    await handleChange();
    return true;
  };

  const handleOpenModal = async (record) => {
    if (!record) {
      return;
    }
    const res = await NotificationService.getById({ id: record?.id });
    setData(res.data);
    form.setFieldsValue({ ...res.data, userId: res.data?.users?.id });
  };

  const [handleChange, DataTable] = HookDataTable({
    columns: columnNotification({ handleOpenModal, setShowModal, handleDelete }),
    fullTextSearch: 'search',
    Get: async (params) => {
      return await NotificationService.getList({ ...params });
    },
    rightHeader: (
      <div className="flex gap-3 flex-col sm:flex-row">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300 w-[145px] bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
          onClick={() => setShowModal(true)}
        >
          <i className="las la-plus mr-1" />
          Thêm mới
        </button>
      </div>
    ),
  });

  const handleSubmit = async (value) => {
    const values = {
      users: {
        id: value.userId,
      },
      cameraEvent: value.cameraEvent,
      frequency: value.frequency,
    };
    if (data?.id) {
      const res = await NotificationService.post({ ...values });
      if (res) {
        Message.success({ text: 'Chỉnh sửa thông báo thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        handleCancel();
        handleChange();
      }
    } else {
      const res = await NotificationService.post({ ...values });
      if (res) {
        Message.success({ text: 'Tạo thông báo thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        handleCancel();
        handleChange();
      }
    }
  };
  return (
    <div className="min-h-screen branchs">
      <div className="bg-white p-4">
        <h2 className="font-semibold text-lg mb-5">{'Quản lý thông báo'.toUpperCase()}</h2>
        <div>{DataTable()}</div>
        <div>
          <div>
            {showModal && (
              <Modal
                centered={true}
                destroyOnClose={true}
                title={
                  <div className="flex justify-between">
                    <div className="text-base font-bold">{!data?.id ? 'Thêm thông báo' : 'Chỉnh sửa thông báo'}</div>
                    <button
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
                width={636}
              >
                <Form
                  form={form}
                  // onValuesChange={(_, values) => setFormValues((prevState) => ({ ...prevState, ...values }))}
                  colon={false}
                  className="min-w-min"
                  onFinish={handleSubmit}
                >
                  <div className="">
                    <div className="  bg-white ">
                      <div className="p-2">
                        <div className="flex gap-4">
                          <div className="flex flex-wrap gap-2 w-full">
                            <div className="w-full flex justify-between gap-4">
                              <Form.Item
                                className="w-6/12"
                                label="Tên người dùng"
                                name="userId"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng chọn tên người dùng!',
                                  },
                                ]}
                              >
                                <Select
                                  allowClear
                                  showSearch
                                  className="w-full"
                                  placeholder="Nhập tên người dùng"
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                  }
                                  options={[...listUser].map((i) => ({
                                    value: i?.id,
                                    label: i?.firstName ?? '' + ' ' + i?.lastName ?? '',
                                  }))}
                                />
                              </Form.Item>
                              <Form.Item
                                className="w-6/12"
                                label="Tần suất"
                                name="frequency"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng chọn tần suất!',
                                  },
                                ]}
                              >
                                <Select
                                  allowClear
                                  showSearch
                                  className="w-full"
                                  placeholder="Chọn tần suất"
                                  optionFilterProp="children"
                                  filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                  }
                                  options={[...listFrequency].map((i) => ({ value: i.value, label: i.time }))}
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-wrap gap-2 w-full">
                            <div className="w-full flex justify-between gap-4"></div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-wrap gap-2 w-full">
                            <div className="w-full flex justify-between gap-4">
                              <Form.Item
                                className="w-full"
                                label="Thông báo"
                                name="cameraEvent"
                                valuePropName="checked"
                              >
                                <Checkbox>Thông báo nhận diện khách hàng bằng camera.</Checkbox>
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
