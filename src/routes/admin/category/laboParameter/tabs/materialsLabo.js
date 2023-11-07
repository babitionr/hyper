import { Form, Input, Modal } from 'antd';
import { HookDataTable } from 'hooks';
import React, { useEffect, useState } from 'react';
import { LaboParameterService } from 'services/labo-parameter';
import { isNullOrUndefinedOrEmpty } from 'utils/func';
import { columnLaboParameter } from '../columns/columnLaboParameter';
import '../index.less';

const MaterialsLabo = ({ type }) => {
  const [form] = Form.useForm();
  const [showModal, setShowModal] = useState(false);
  const [idRequest, setIdRequest] = useState('');
  const [data, setData] = useState({});

  useEffect(() => {
    setData({});
  }, [type]);
  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
  };
  const deleteBranch = async (id) => {
    await LaboParameterService.delete(id);
    await handleChange();
    return true;
  };
  const handleCreate = () => {
    setData({});
    setIdRequest(null);
    form.resetFields();
    setShowModal(true);
  };

  const [handleChange, DataTable] = HookDataTable({
    columns: columnLaboParameter({ setIdRequest, setShowModal, deleteBranch, type }),
    fullTextSearch: 'search',
    Get: async (params) => {
      return await LaboParameterService.get({ ...params, type });
    },
    save: false,
    rightHeader: (
      <div className="flex gap-3 flex-col sm:flex-row">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300 w-[145px]  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
          onClick={() => handleCreate()}
        >
          <i className="las la-plus mr-1" />
          Thêm mới
        </button>
      </div>
    ),
  });
  useEffect(() => {
    const getDetail = async () => {
      if (!isNullOrUndefinedOrEmpty(idRequest) && !!showModal === true) {
        const res = await LaboParameterService.getById({ id: idRequest });
        setData(res);
        form.setFieldsValue(res);
      }
    };
    getDetail();
  }, [idRequest, showModal]);

  const handleSubmit = async (value) => {
    if (data.id) {
      const values = {
        id: data?.id,
        name: value.name,
        type,
      };
      const res = await LaboParameterService.put(values);
      if (res) {
        form.resetFields();
        setShowModal(false);
        handleChange();
      }
    } else {
      const values = {
        name: value.name,
        type,
      };
      const res = await LaboParameterService.post(values);
      if (res) {
        form.resetFields();
        setShowModal(false);
        handleChange();
      }
    }
  };

  const titleModal = (type) => {
    return `${
      type === 'MATERIAL'
        ? 'vật liệu Labo'
        : type === 'ENCLOSE'
        ? 'gửi kèm Labo'
        : type === 'BITE'
        ? 'khớp cắn Labo'
        : type === 'LINE'
        ? 'đường hoàn tất Labo'
        : 'kiểu nhịp Labo'
    }`;
  };
  return (
    <div className="laboParameter" id="laboParameter">
      <div className="">
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
                      {!data?.id ? `Thêm ${titleModal(type)}` : `Chỉnh sửa ${titleModal(type)}`}
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
                                label={`${
                                  type === 'MATERIAL'
                                    ? 'Tên vật liệu Labo'
                                    : type === 'ENCLOSE'
                                    ? 'Tên gửi kèm Labo'
                                    : type === 'BITE'
                                    ? 'Tên khớp cắn Labo'
                                    : type === 'LINE'
                                    ? 'Tên đường hoàn tất Labo'
                                    : 'Tên kiểu nhịp Labo'
                                }`}
                                name="name"
                                rules={[
                                  {
                                    required: true,
                                    message: `${
                                      type === 'MATERIAL'
                                        ? 'Vui lòng nhập tên vật liệu Labo!'
                                        : type === 'ENCLOSE'
                                        ? 'Vui lòng nhập tên gửi kèm Labo!'
                                        : type === 'BITE'
                                        ? 'Vui lòng nhập tên khớp cắn Labo!'
                                        : type === 'LINE'
                                        ? 'Vui lòng nhập tên đường hoàn tất Labo!'
                                        : 'Vui lòng nhập tên kiểu nhịp Labo!'
                                    }`,
                                  },
                                ]}
                              >
                                <Input
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder={`${
                                    type === 'MATERIAL'
                                      ? 'Nhập tên vật liệu Labo'
                                      : type === 'ENCLOSE'
                                      ? 'Nhập tên gửi kèm Labo'
                                      : type === 'BITE'
                                      ? 'Nhập tên khớp cắn Labo'
                                      : type === 'LINE'
                                      ? 'Nhập tên đường hoàn tất Labo'
                                      : 'Nhập tên kiểu nhịp Labo'
                                  }`}
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

export default MaterialsLabo;
