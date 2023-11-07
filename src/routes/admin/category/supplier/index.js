import React, { useState, useEffect } from 'react';
import { HookDataTable } from 'hooks';
import { columnSupplier } from './columns/columnSupplier';
import { Form, Input, Modal, Select } from 'antd';
// import classNames from 'classnames';
import './index.less';
import { BranchsService } from 'services/branchs';
import { SupplierService } from 'services/supplier';
import { Message } from 'components';
// const { Option } = Select;
const Page = ({ canEdit = true, showText = true }) => {
  const { TextArea } = Input;
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState({});
  const [address, setAddress] = useState({
    province: [],
    provinceCode: '',
    district: [],
    districtCode: '',
    ward: [],
  });
  const [selected, setSelected] = useState(true);
  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
    setData();
    setAddress((prev) => ({
      ...prev,
      provinceCode: '',
      district: [],
      districtCode: '',
      ward: [],
    }));
  };
  const deleteSupplier = async (uuid) => {
    await SupplierService.delete(uuid);
    await handleChange();
    return true;
  };
  const activeSupplier = async (data) => {
    const res = await SupplierService.activeSupplier(data?.uuid);
    if (res) {
      if (data?.isActive) {
        Message.success({ text: 'Khóa chi nhánh thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      }
      if (!data?.isActive) {
        Message.success({ text: 'Mở khoá chi nhánh thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      }
      await handleChange();
    }
  };

  const handleOpenModal = async (data) => {
    if (!data) {
      return;
    }
    const res = await SupplierService.getById({ uuid: data.uuid });
    const Formdata = {
      ...res,
      provinceId: res?.address?.mtProvince?.id,
      districtId: res?.address?.mtDistrict?.id,
      wardId: res?.address?.mtWard?.id,
      street: res?.address?.street,
    };
    setData(Formdata);
    setAddress((prev) => ({
      ...prev,
      provinceCode: res?.address?.mtProvince?.code,
      districtCode: res?.address?.mtDistrict?.code,
    }));
    form.setFieldsValue(Formdata);
  };

  const [handleChange, DataTable] = HookDataTable({
    columns: columnSupplier({ handleOpenModal, setShowModal, deleteSupplier, activeSupplier }),
    fullTextSearch: 'search',
    Get: async (params) => {
      return await SupplierService.get({ ...params, isActive: selected });
    },
    loadFirst: false,
    rightHeader: (
      <div className="flex gap-3 flex-col sm:flex-row">
        <Select
          showSearch
          className="w-full sm:w-[184px]"
          placeholder="Chọn trạng thái"
          optionFilterProp="children"
          onChange={(value) => setSelected(value)}
          // onSearch={onSearch}
          defaultValue={true}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          options={[
            {
              value: null,
              label: 'Tất cả',
            },
            {
              value: true,
              label: 'Đang hoạt động',
            },
            {
              value: false,
              label: 'Không hoạt động',
            },
          ]}
        />
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
  }, [selected]);

  useEffect(() => {
    const initProvinces = async () => {
      const res = await BranchsService.getListProvices();
      setAddress((prev) => ({ ...prev, province: res.data }));
    };
    initProvinces();
  }, []);
  useEffect(() => {
    const initDistricts = async () => {
      if (address.provinceCode) {
        const res = await BranchsService.getListDistricts({ provinceCode: address.provinceCode });
        setAddress((prev) => ({ ...prev, district: res.data }));
      }
    };
    initDistricts();
  }, [address.provinceCode]);
  useEffect(() => {
    const initWards = async () => {
      if (address.districtCode) {
        const res = await BranchsService.getListWards({ districtCode: address.districtCode });
        setAddress((prev) => ({ ...prev, ward: res.data }));
      }
    };
    initWards();
  }, [address.districtCode]);

  const handleSubmit = async () => {
    if (data?.uuid) {
      const formData = form.getFieldValue();
      const values = {
        ...formData,
        uuid: data?.uuid,
        address: {
          street: formData.street,
          mtProvince: {
            id: formData.provinceId,
          },
          mtDistrict: {
            id: formData.districtId,
          },
          mtWard: {
            id: formData.wardId,
          },
        },
      };

      const res = await SupplierService.update(values);
      if (res) {
        handleCancel();
        handleChange();
      }
    } else {
      const formData = form.getFieldValue();
      const values = {
        ...formData,
        address: {
          street: formData.street,
          mtProvince: {
            id: formData.provinceId,
          },
          mtDistrict: {
            id: formData.districtId,
          },
          mtWard: {
            id: formData.wardId,
          },
        },
      };
      console.log(values);
      const res = await SupplierService.post(values);
      if (res) {
        handleCancel();
        handleChange();
      }
    }
  };
  return (
    <div className="min-h-screen supplier">
      <div className="bg-white p-4">
        <h2 className="font-semibold text-lg mb-5">{'Nhà cung cấp'.toUpperCase()}</h2>
        <div>{DataTable()}</div>
        <div>
          <div>
            {showModal && (
              <Modal
                // bodyStyle={{ height: 175 }}
                destroyOnClose={true}
                title={
                  <div className="flex justify-between">
                    {data?.uuid ? (
                      <div className="text-base font-bold">Chỉnh sửa nhà cung cấp</div>
                    ) : (
                      <div className="text-base font-bold">Thêm nhà cung cấp</div>
                    )}
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
                                label="Tên nhà cung cấp"
                                name="name"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng nhập tên nhà cung cấp!',
                                  },
                                ]}
                              >
                                <Input
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder="Nhập tên nhà cung cấp"
                                />
                              </Form.Item>
                              <Form.Item
                                className="w-6/12"
                                name="faxNumber"
                                label="Số fax"
                                // rules={[
                                //   {
                                //     required: true,
                                //     message: 'Vui lòng nhập mã cơ sở khám bệnh',
                                //   },
                                // ]}
                              >
                                <Input
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder="Nhập số fax"
                                />
                              </Form.Item>
                            </div>
                            <div className="w-full flex justify-between gap-4">
                              <Form.Item
                                className="w-6/12"
                                name="phoneNumber"
                                label="Số điện thoại"
                                // rules={[
                                //   {
                                //     required: true,
                                //     message: 'Vui lòng nhập số điện thoại.'
                                //   },
                                // ]}
                              >
                                <Input
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder="Nhập số điện thoại"
                                />
                              </Form.Item>
                              <Form.Item
                                className="w-6/12"
                                name="email"
                                label="Email"
                                // rules={[
                                //   {
                                //     required: true,
                                //     message: 'Vui lòng nhập số điện thoại.'
                                //   },
                                // ]}
                              >
                                <Input
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder="Nhập email"
                                />
                              </Form.Item>
                            </div>
                            <div className=" pb-2 w-full">
                              <div className=" text-sm font-medium text-gray-500 ">Địa chỉ</div>
                              <div className="flex justify-between gap-4">
                                <Form.Item
                                  className="w-1/4"
                                  label="Số nhà, đường"
                                  name="street"
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Vui lòng nhập số nhà, đường!',
                                    },
                                  ]}
                                >
                                  <Input
                                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                                    placeholder="Nhập số nhà, đường"
                                  />
                                </Form.Item>
                                <Form.Item
                                  className="w-1/4"
                                  name="provinceId"
                                  label="Tỉnh/TP"
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Vui lòng chọn tỉnh hoặc thành phố!',
                                    },
                                  ]}
                                >
                                  <Select
                                    allowClear
                                    showSearch
                                    className="w-full"
                                    placeholder="Chọn Tỉnh/TP"
                                    optionFilterProp="children"
                                    onChange={(value) => {
                                      const p = address?.province?.find((ele) => ele.id === value);
                                      setAddress((prev) => ({ ...prev, provinceCode: p?.code }));
                                      form.setFieldsValue({ districtId: undefined, wardId: undefined });
                                    }}
                                    // onSearch={onSearch}
                                    filterOption={(input, option) =>
                                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={address.province.map((i) => ({ value: i.id, label: i.name }))}
                                  />
                                </Form.Item>
                                <Form.Item
                                  className="w-1/4"
                                  name="districtId"
                                  label="Quận/ Huyện"
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Vui lòng nhập quận huyện!',
                                    },
                                  ]}
                                >
                                  <Select
                                    allowClear
                                    showSearch
                                    className="w-full"
                                    placeholder="Chọn Quận/ Huyện"
                                    optionFilterProp="children"
                                    onChange={(value) => {
                                      const d = address?.district.find((ele) => ele.id === value);
                                      setAddress((prev) => ({ ...prev, districtCode: d?.code }));
                                      form.setFieldsValue({ wardId: undefined });
                                    }}
                                    // onSearch={onSearch}
                                    filterOption={(input, option) =>
                                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={address.district.map((i) => ({ value: i.id, label: i.name }))}
                                  />
                                </Form.Item>
                                <Form.Item
                                  className="w-1/4"
                                  name="wardId"
                                  label="Phường/Xã"
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Vui lòng nhập phường xã!',
                                    },
                                  ]}
                                >
                                  <Select
                                    allowClear
                                    showSearch
                                    className="w-full"
                                    placeholder="Chọn Phường/Xã"
                                    optionFilterProp="children"
                                    // onChange={(v) => setAddress((prev) => ({ ...prev, districtCode: v }))}
                                    // onSearch={onSearch}
                                    filterOption={(input, option) =>
                                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={address.ward.map((i) => ({ value: i.id, label: i.name }))}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                            <div className="w-full">
                              <Form.Item className="w-full" name="note" label="Ghi chú">
                                <TextArea
                                  rows={4}
                                  className=" w-full text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder=""
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
