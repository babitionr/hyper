// import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
// import classNames from 'classnames';
// import { routerLinks } from 'utils';
// import { useNavigate } from 'react-router';
import './index.less';
import { OrganizationService } from 'services/organization';
import { Form, Input, Select, Steps } from 'antd';
// import MultipleUploadFiles from 'components/multipleUploadFiles';
import { LogoOrganization } from './logoOrganization';
// import moment from 'moment';
// import { BranchsService } from 'services/branchs';
import { PublicService } from 'services/publicService';
import classNames from 'classnames';

const Page = () => {
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [dataEdit, setDataEdit] = useState();
  // const [fileList, setFileList] = useState([]);
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
      const res = await PublicService.getListProvices();
      setAddress((prev) => ({ ...prev, province: res.data }));
    };
    initProvinces();
  }, []);
  useEffect(() => {
    const initDistricts = async () => {
      if (address.provinceCode) {
        const res = await PublicService.getListDistricts({ provinceCode: address.provinceCode });
        setAddress((prev) => ({ ...prev, district: res.data }));
      }
    };
    initDistricts();
  }, [address.provinceCode]);
  useEffect(() => {
    const initWards = async () => {
      if (address.districtCode) {
        const res = await PublicService.getListWards({ districtCode: address.districtCode });
        setAddress((prev) => ({ ...prev, ward: res.data }));
      }
    };
    initWards();
  }, [address.districtCode]);

  const handleOk = async () => {
    if (dataEdit?.id) {
      const res = form.getFieldValue();
      const value = {
        ...res,
        uuid: dataEdit.uuid,
        // orgContracts: fileList.map((item) => ({
        //   guid: item.id,
        //   fileName: item.name,
        //   uploadedAt: moment(item?.uploadedAt ?? '').format('YYYY-MM-DD HH:mm:ss'),
        // })),
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
        // orgContracts: fileList.map((item) => ({
        //   guid: item.id,
        //   fileName: item.name,
        //   uploadedAt: moment(item?.uploadedAt ?? '').format('YYYY-MM-DD HH:mm:ss'),
        // })),
      };
      const res = await PublicService.createOrganization(value);
      if (!res) {
        return false;
      }
      if (res) {
        handleCancel();
      }
    }
  };
  const handleCancel = () => {
    setDataEdit();
    // setFileList([]);
    form.resetFields();
    setAddress((prev) => ({
      ...prev,
      provinceCode: '',
      district: [],
      districtCode: '',
      ward: [],
    }));
  };
  // const handleOpenModal = async (isOpen, data) => {
  //   setShowModal(isOpen);
  //   if (!data) {
  //     return;
  //   }
  //   const dataOrganization = await OrganizationService.getDetailOrganization(data.uuid);
  //   const valueUser = {
  //     ...dataOrganization,
  //     provinceId: dataOrganization?.address?.mtProvince?.id,
  //     districtId: dataOrganization?.address?.mtDistrict?.id,
  //     wardId: dataOrganization?.address?.mtWard?.id,
  //     street: dataOrganization?.address?.street,
  //   };
  //   setDataEdit(valueUser);
  //   setImageUrl(dataOrganization?.logoUrl ?? '');
  //   setFileList(
  //     dataOrganization?.orgContracts?.map((item) => ({
  //       id: item.guid,
  //       name: item.fileName,
  //       uploadedAt: item?.uploadedAt ?? moment('').format('YYYY-MM-DD HH:mm:ss'),
  //     })),
  //   );
  //   setAddress((prev) => ({
  //     ...prev,
  //     provinceCode: dataOrganization?.address?.mtProvince?.code,
  //     districtCode: dataOrganization?.address?.mtDistrict?.code,
  //   }));
  //   form.setFieldsValue(valueUser);
  // };

  const steps = [
    {
      title: 'First',
      content: (
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
                </div>
                <div className="w-full flex justify-between gap-4">
                  <Form.Item
                    className="w-full"
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
              </div>
            </div>
          </div>
        </Form>
      ),
    },
    {
      title: 'Second',
      content: (
        <Form
          // onFinish={() => {
          //   handleOk();
          // }}
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
                    label="Tên phòng khám"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tên phòng khám!',
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên tên phòng khám"
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
                {/* <div className="w-full flex justify-between">
                  <Form.Item className="w-full" label="File đính kèm">
                    <MultipleUploadFiles setFileList={setFileList} fileList={fileList} />
                  </Form.Item>
                </div> */}
              </div>
            </div>
          </div>
        </Form>
      ),
    },
    {
      title: 'Last',
      content: (
        <div className="bg-white p-6  md:mx-auto">
          <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            ></path>
          </svg>
          <div className="text-center">
            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Thành công</h3>
            <p className=" text-black text-base my-2">
              Tạo tổ chức thành công. Email sẽ được gửi về cho bạn trong ít phút.
            </p>
            {/* <p> Have a great day!  </p> */}
          </div>
        </div>
      ),
    },
  ];

  const [current, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div className="min-h-[75%] ">
      <div>
        <div>
          <div className="flex justify-between mb-3">
            <div className="text-base font-bold">{'Đăng ký dùng thử'.toUpperCase()}</div>
            <div></div>
          </div>
        </div>
        <div className="w-full organizationDemo flex justify-end mb-3">
          <Steps current={current} labelPlacement="vertical" className="w-full " size="small">
            <Steps.Step className=" whitespace-nowrap font-semibold text-sm" title={'Thông tin cá nhân'} />
            <Steps.Step className="whitespace-nowrap font-semibold text-sm" title={'Thông tin phòng khám'} />
            <Steps.Step className=" font-semibold text-sm" title={'Thành công'} />
          </Steps>
        </div>

        <div>{steps[current].content}</div>
        <div className="w-full flex justify-between">
          {!(current === steps.length - 1) && (
            <button
              type="button"
              className={classNames(
                'w-full sm:w-[125px] h-[44px] rounded-lg border border-zinc-400 text-center mb-2 sm:mb-0',
                {
                  'opacity-0': !current,
                },
              )}
              onClick={() => {
                if (current > 0) {
                  prev();
                }
              }}
            >
              Trở về
            </button>
          )}
          {current < steps.length - 1 && (
            <button
              type="button"
              onClick={async () => {
                if (current === 0) {
                  try {
                    await form.validateFields(['phone', 'email']);
                    next();
                  } catch (error) {
                    console.log(error);
                  }
                }
                if (current === 1) {
                  try {
                    await form.validateFields(['name', 'shortName', 'street', 'provinceId', 'districtId', 'wardId']);
                    await handleOk();
                    next();
                  } catch (error) {
                    console.log(error);
                  }
                }
              }}
              className="w-[113px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-white  bg-rose-500 mr-4"
            >
              Tiếp theo
            </button>
          )}
          {current === steps.length - 1 && <div></div>}
          {current === steps.length - 1 && (
            <button
              type="button"
              onClick={() => {
                // next()
                window.location.reload();
              }}
              className="w-[113px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-white  bg-rose-500 mr-4"
            >
              Hoàn thành
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
