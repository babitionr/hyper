import React, { useState, useEffect } from 'react';
import { HookDataTable } from 'hooks';
import { ColumnCustomerResource } from './columns/columnCustomerResource';
import { Form, Input, Modal } from 'antd';
import { CustomerResourceService } from 'services/customer-resource';

export const CustomerResource = () => {
  const getData = async (params) => {
    const data = await CustomerResourceService.getList({ ...params, branchUuid: localStorage.getItem('branchUuid') });
    return { data: data.content, count: data.totalElements };
  };

  const [dataEdit, setDataEdit] = useState();
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
    setDataEdit();
  };

  const handleSubmit = async () => {
    const res = form.getFieldValue();
    const value = {
      ...res,
      uuid: dataEdit?.uuid ?? null,
      branchUuid: localStorage.getItem('branchUuid'),
    };
    const data = await CustomerResourceService.create(value);
    if (data) {
      handleCancel();
      handleChange();
    }
  };
  const handleOpenModal = async (data) => {
    if (!data) {
      return;
    }
    setShowModal(true);
    const res = await CustomerResourceService.getDetail(data?.uuid);
    setDataEdit(res);
    form.setFieldsValue(res);
  };
  const handleDelete = async (uuid) => {
    const data = await CustomerResourceService.delete(uuid);
    if (data) {
      handleChange();
    }
  };

  const [handleChange, DataTable] = HookDataTable({
    columns: ColumnCustomerResource({ handleOpenModal, handleDelete }),
    Get: getData,
    loadFirst: false,
    rightHeader: (
      <div className="flex gap-3">
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
  return (
    <div>
      <div>{DataTable()}</div>
      <div>
        <div>
          {showModal && (
            <Modal
              // bodyStyle={{ height: 175 }}
              destroyOnClose={true}
              title={
                <div className="flex justify-between">
                  <div className="text-base font-bold">Thêm nguồn khách hàng</div>
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
              className="!w-5/12 min-w-min pb-0"
              closable={false}
            >
              <Form form={form} colon={false} className=" min-w-min">
                <div>
                  <div className="px-4">
                    <div>
                      <div className="w-full flex justify-between gap-4 pb-1">
                        <Form.Item
                          className="w-full"
                          label="Nguồn khách hàng"
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: 'Nhập nguồn khách hàng',
                            },
                          ]}
                        >
                          <Input
                            placeholder="Nhập nguồn khách hàng"
                            className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>
                  <Form.Item>
                    <div className="flex items-center justify-center  border-solid gap-6 border-slate-200 ">
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
                        onClick={async (e) => {
                          try {
                            await form.validateFields();
                            handleSubmit();
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                      >
                        Lưu
                      </button>
                    </div>
                  </Form.Item>
                </div>
              </Form>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};
