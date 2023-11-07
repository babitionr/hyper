import { Form, Input, Select, Modal } from 'antd';
import MultipleUploadFiles from 'components/multipleUploadFiles';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { BranchsService } from 'services/branchs';
import { OrganizationService } from 'services/organization';
import { LogoOrganization } from './logoOrganization';
import { toast } from 'react-toastify';

export const AddOrganization = ({ handleChange, showModal, setShowModal }) => {
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [dataEdit, setDataEdit] = useState();
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [address, setAddress] = useState({
    province: [],
    provinceCode: '',
    district: [],
    districtCode: '',
    ward: [],
  });
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

  // const initData = async () => {};
  // useEffect(() => {
  //   initData();
  // }, []);

  const handleActiveOrDeactiveOrganization = async (data) => {
    if (!data) {
      return false;
    }
    const res = await OrganizationService.activeOrDeactiveOrganization(data);
    if (res) {
      await handleChange();
      return true;
    } else return false;
  };

  const handleOk = async () => {
    if (dataEdit?.id) {
      const res = form.getFieldValue();
      const value = {
        ...res,
        uuid: dataEdit.uuid,
        orgContracts: fileList.map((item) => ({
          guid: item.id,
          fileName: item.name,
          uploadedAt: moment(item?.uploadedAt ?? '').format('YYYY-MM-DD HH:mm:ss'),
        })),
        logoUrl: imageUrl === '' ? null : imageUrl,
        address: {
          street: res.street,
          mtProvince: {
            id: res.provinceId,
          },
          mtDistrict: {
            id: res.districtId,
          },
          mtWard: {
            id: res.wardId,
          },
        },
      };
      await OrganizationService.updateOrganization(value);
      handleChange();
      handleCancel();
    } else {
      const data = form.getFieldValue();
      const value = {
        ...data,
        address: {
          street: data.street,
          mtProvince: {
            id: data.provinceId,
          },
          mtDistrict: {
            id: data.districtId,
          },
          mtWard: {
            id: data.wardId,
          },
        },
        logoUrl: imageUrl === '' ? null : imageUrl,
        orgContracts: fileList.map((item) => ({
          guid: item.id,
          fileName: item.name,
          uploadedAt: moment(item?.uploadedAt ?? '').format('YYYY-MM-DD HH:mm:ss'),
        })),
      };
      const res = await OrganizationService.createOrganization(value);
      if (!res) {
        return false;
      }
      if (res) {
        handleChange();
        handleCancel();
      }
    }
  };
  const handleCancel = () => {
    setDataEdit();
    setFileList([]);
    form.resetFields();
    setAddress((prev) => ({
      ...prev,
      provinceCode: '',
      district: [],
      districtCode: '',
      ward: [],
    }));
    setShowModal(false);
  };
  const handleOpenModal = async (isOpen, data) => {
    setShowModal(isOpen);
    if (!data) {
      return;
    }
    const dataOrganization = await OrganizationService.getDetailOrganization(data.uuid);
    const valueUser = {
      ...dataOrganization,
      provinceId: dataOrganization?.address?.mtProvince?.id,
      districtId: dataOrganization?.address?.mtDistrict?.id,
      wardId: dataOrganization?.address?.mtWard?.id,
      street: dataOrganization?.address?.street,
    };
    setDataEdit(valueUser);
    setImageUrl(dataOrganization?.logoUrl ?? '');
    setFileList(
      dataOrganization?.orgContracts?.map((item) => ({
        id: item.guid,
        name: item.fileName,
        uploadedAt: item?.uploadedAt ?? moment('').format('YYYY-MM-DD HH:mm:ss'),
      })),
    );
    setAddress((prev) => ({
      ...prev,
      provinceCode: dataOrganization?.address?.mtProvince?.code,
      districtCode: dataOrganization?.address?.mtDistrict?.code,
    }));
    form.setFieldsValue(valueUser);
  };

  const handleApprove = async (data) => {
    if (!data?.uuid) {
      return false;
    }
    if (data?.status === 'APPROVED') {
      toast.error('Tổ chức đã được phê duyệt', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
      return false;
    }
    const res = await OrganizationService.approveOrganization(data);
    if (res) {
      await handleChange();
      return true;
    } else return false;
  };
  return [
    handleActiveOrDeactiveOrganization,
    handleOpenModal,
    handleApprove,
    () => (
      <div>
        {showModal && (
          <Modal
            // bodyStyle={{ height: 625 }}
            destroyOnClose={true}
            title={
              dataEdit?.id ? (
                <div className="flex justify-between">
                  <div className="text-base font-bold">{'Chỉnh sửa tổ chức'.toUpperCase()}</div>
                  <button
                    className=""
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    <span className="icon-x-close pr-2"></span>
                  </button>
                </div>
              ) : (
                <div className="flex justify-between">
                  <div className="text-base font-bold">{'Thêm tổ chức'.toUpperCase()}</div>
                  <button
                    className=""
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    <span className="icon-x-close pr-2"></span>
                  </button>
                </div>
              )
            }
            open={showModal}
            footer={null}
            className="!w-8/12 min-w-min pb-0"
            closable={false}
            style={{ top: 5 }}
          >
            <Form
              onFinish={() => {
                handleOk();
              }}
              form={form}
              colon={false}
              className=" min-w-min"
            >
              <div>
                <div className="px-4">
                  <div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item
                        className="w-full"
                        label="Tên tổ chức"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập tên tổ chức!',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập tên tên tổ chức"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item className="w-6/12 " name="taxCode" label="Mã số thuế" rules={[]}>
                        <Input
                          placeholder="Nhập mã số thuế"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>
                      <Form.Item
                        className="w-6/12 "
                        name="shortName"
                        label="Tên viết tắt"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập tên tổ chức!',
                          },
                          {
                            pattern: /^[A-Za-z0-9]+$/i,
                            message: 'Chỉ chấp nhận kí tự không dấu và số!',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập tên viết tắt"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item
                        className="w-6/12"
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập số điện thoại!',
                          },
                          {
                            min: 10,
                            max: 10,
                            message: 'Vui lòng nhập 10 chữ số!',
                          },
                          {
                            pattern: /^[0-9]+$/i,
                            message: 'Vui lòng chỉ nhập số !',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập số điện thoại"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>
                      <Form.Item
                        className="w-6/12"
                        name="email"
                        label="Email"
                        rules={[
                          {
                            type: 'email',
                            message: 'Vui lòng nhập đúng định dạng email!',
                          },
                          {
                            required: true,
                            message: 'Vui lòng nhập email!',
                          },
                        ]}
                      >
                        <Input
                          type="email"
                          placeholder="Nhập Email"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between gap-4">
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
                            message: 'Vui lòng chọn Tỉnh/TP!',
                          },
                        ]}
                      >
                        <Select
                          className="!w-full !rounded-lg  text-sm font-normal"
                          placeholder="Chọn Tỉnh/TP"
                          allowClear
                          onChange={(value) => {
                            const p = address?.province?.find((ele) => ele.id === value);
                            setAddress((prev) => ({ ...prev, provinceCode: p?.code }));
                            form.setFieldsValue({ districtId: undefined, wardId: undefined });
                          }}
                          options={address.province.map((i) => ({ value: i.id, label: i.name }))}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                        ></Select>
                      </Form.Item>
                      <Form.Item
                        className="w-1/4"
                        name="districtId"
                        label="Quận/ Huyện"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn Quận/ Huyện!',
                          },
                        ]}
                      >
                        <Select
                          className="!w-full !rounded-lg  text-sm font-normal"
                          placeholder="Chọn Quận/ Huyện"
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          onChange={(value) => {
                            const d = address?.district.find((ele) => ele.id === value);
                            setAddress((prev) => ({ ...prev, districtCode: d?.code }));
                            form.setFieldsValue({ wardId: undefined });
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={address.district.map((i) => ({ value: i.id, label: i.name }))}
                        ></Select>
                      </Form.Item>
                      <Form.Item
                        className="w-1/4"
                        name="wardId"
                        label="Phường/Xã"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn Phường/Xã!',
                          },
                        ]}
                      >
                        <Select
                          className="!w-full !rounded-lg  text-sm font-normal"
                          placeholder="Chọn Phường/Xã"
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={address.ward.map((i) => ({ value: i.id, label: i.name }))}
                        ></Select>
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between">
                      <Form.Item className="w-full" label="Logo tổ chức">
                        <LogoOrganization imageUrl={imageUrl} setImageUrl={setImageUrl} />
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between">
                      <Form.Item className="w-full" label="File đính kèm">
                        <MultipleUploadFiles setFileList={setFileList} fileList={fileList} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <Form.Item className="mt-4">
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
    ),
  ];
};
