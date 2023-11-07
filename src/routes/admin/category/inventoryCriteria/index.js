import { Form, Input, Modal } from 'antd';
import { HookDataTable } from 'hooks';
import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
import { columnInventoryCriteria } from './columns/columnInventoryCriteria';
import './index.less';
import { InventoryCriteriaService } from 'services/inventory-criteria';
import { useAuth } from 'global';

// const { Option } = Select;
const { TextArea } = Input;
const Page = ({ canEdit = true, showText = true }) => {
  const { branchUuid } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  // const navigate = useNavigate();
  const [data, setData] = useState({});

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
    setData();
  };
  const handleDelete = async (uuid) => {
    await InventoryCriteriaService.delete(uuid);
    await handleChange();
    return true;
  };
  const activeBranch = async (uuid) => {
    await InventoryCriteriaService.activeBranch(uuid);
    await handleChange();
    return true;
  };

  const handleOpenModal = async (data) => {
    if (!data) {
      return;
    }
    const res = await InventoryCriteriaService.getById(data?.uuid);
    setData(res);
    form.setFieldsValue(res);
  };

  useEffect(() => {
    handleChange();
  }, [branchUuid]);

  const [handleChange, DataTable] = HookDataTable({
    columns: columnInventoryCriteria({ handleOpenModal, setShowModal, handleDelete, activeBranch }),
    loadFirst: false,
    Get: async (params) => {
      return await InventoryCriteriaService.get({ ...params, branchUuid });
    },
    // loadFirst: false,
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
    if (data?.uuid) {
      const values = {
        uuid: data?.uuid,
        name: value.name,
        note: value.note,
        branchUuid,
      };

      const res = await InventoryCriteriaService.put(values);
      if (res) {
        form.resetFields();
        setShowModal(false);
        handleChange();
        setData();
      }
    } else {
      const values = {
        uuid: null,
        name: value.name,
        note: value.note,
        branchUuid,
      };
      const res = await InventoryCriteriaService.post(values);
      if (res) {
        form.resetFields();
        setShowModal(false);
        handleChange();
        setData();
      }
    }
  };
  return (
    <div className="min-h-screen branchs">
      <div className="bg-white p-4">
        <h2 className="font-semibold text-lg mb-5">{'Tiêu chí kiểm kho'.toUpperCase()}</h2>
        <div>{DataTable()}</div>
        <div>
          <div>
            {showModal && (
              <Modal
                centered={true}
                destroyOnClose={true}
                title={
                  <div className="flex justify-between">
                    <div className="text-base font-bold">
                      {!data?.uuid ? 'Thêm tiêu chí kiểm kho' : 'Chỉnh sửa tiêu chí kiểm kho'}
                    </div>
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
                                className="w-full"
                                label="Tên tiêu chí kiểm kho"
                                name="name"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng nhập tên tiêu chí kiểm kho!',
                                  },
                                ]}
                              >
                                <Input
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder="Tên tiêu chí kiểm kho"
                                />
                              </Form.Item>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-wrap gap-2 w-full">
                            <div className="w-full flex justify-between gap-4">
                              <Form.Item className="w-full" label="Ghi chú" name="note">
                                <TextArea
                                  rows={4}
                                  className="w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 !bg-white "
                                  placeholder="Nhập ghi chú"
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
                            // disabled={disable}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
