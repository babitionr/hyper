import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Checkbox, InputNumber } from 'antd';
import { HookDataTable } from 'hooks';
import { ColumnStage } from '../columns/columnStage';
import { ColumnMaterialNorms } from '../columns/columnMaterialNorms';
// import { TableStage } from './tableStage';
// import { TableMaterialNorms } from './tableMaterialNorms';
import { MasterDataService } from 'services/master-data-service';
import { useSearchParams } from 'react-router-dom';
import { Message } from 'components';

export const AddNew = ({ returnButton, servicesList, setShowModal, setSelectedServices }) => {
  const [searchParams] = useSearchParams();
  const uuidGroup = searchParams.get('uuidGroup');
  const uuid = searchParams.get('uuid');
  const [form] = Form.useForm();
  console.log(servicesList);
  const initData = async () => {
    if (uuidGroup) {
      form.setFieldsValue({ serviceCategoryUuid: uuidGroup });
    }
    if (!uuid) return;
    const data = await MasterDataService.getDetailService(uuid);
    if (data?.labo) {
      setToggleLabo(true);
    }
    form.setFieldsValue({ ...data });
  };
  const getData = () => {
    const data = [];
    const data1 = ['Công đoạn 1', 'Công đoạn 2', 'Công đoạn 3'];
    data1.forEach((ele, index) =>
      data.push({
        stt: index + 1,
        tenCongDoan: ele,
        soLuongToiDa: ele,
      }),
    );
    return { data, count: data.length };
  };
  const onSaveData = async () => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue();
      const data = await MasterDataService.postService({
        ...formValues,
        price: Number(formValues?.price),
        cost: Number(formValues?.cost),
        labo: toggleLabo,
        laboPrice: Number(formValues.laboPrice),
        uuid,
      });
      console.log(data);
      if (data.message) {
        if (!uuid) {
          await Message.success({
            text: 'Tạo thông tin dịch vụ thành công',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
        }
        if (uuid) {
          await Message.success({
            text: 'Chỉnh sửa thông tin dịch vụ thành công',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
        }
      }
      const uuidGroupService = formValues.serviceCategoryUuid;
      setSelectedServices(uuidGroupService);
      returnButton(uuidGroup);
      return data;
    } catch (error) {}
  };
  const { Option } = Select;
  const [toggleLabo, setToggleLabo] = useState(false);
  // DataTableStage
  const [handeChangeStage] = HookDataTable({
    Get: getData,
    loadFirst: false,
    columns: ColumnStage(),
    rightHeader: (
      <div className="flex gap-3">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <i className="las la-plus mr-1" />
          Thêm công đoạn
        </button>
      </div>
    ),
  });
  // DataTableMaterialNorms
  const [handeChangeMaterialNorms] = HookDataTable({
    Get: getData,
    columns: ColumnMaterialNorms(),
    loadFirst: false,
    rightHeader: (
      <div className="flex gap-12 justify-between">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-white text-red-500 rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <i className="las la-plus mr-1" />
          Thêm mới vật tư
        </button>
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <i className="las la-plus mr-1" />
          Thêm vật tư
        </button>
      </div>
    ),
  });

  useEffect(() => {
    initData();
    handeChangeMaterialNorms();
    handeChangeStage();
  }, []);

  return (
    <Form form={form} className="px-4" colon={false}>
      <div>
        <div className="text-lg font-bold text-gray-600 pt-2">Thông tin</div>
        <div>
          <div className="w-full flex justify-between gap-4">
            <Form.Item
              className="w-4/12"
              rules={[
                {
                  required: true,
                  message: 'Nhập mã dịch vụ',
                },
              ]}
              label="Mã dịch vụ"
              name="serviceCode"
            >
              <Input
                placeholder="Nhập mã dịch vụ"
                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
              />
            </Form.Item>
            <Form.Item
              className="w-4/12"
              label="Tên dịch vụ"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Nhập tên dịch vụ',
                },
              ]}
            >
              <Input
                placeholder="Nhập tên dịch vụ"
                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
              />
            </Form.Item>
            <div className="w-4/12 flex gap-2">
              <Form.Item
                className="w-full"
                name="serviceCategoryUuid"
                label="Nhóm dịch vụ"
                rules={[
                  {
                    required: true,
                    message: 'Nhập nhóm dịch vụ',
                  },
                ]}
              >
                <Select
                  className=" !rounded-lg"
                  placeholder="Chọn dịch vụ"
                  allowClear
                  onChange={(e) => {
                    form.setFieldsValue({ ...form.getFieldsValue(), serviceCategoryUuid: e });
                  }}
                >
                  {servicesList.map((ele) => (
                    <Option key={ele.uuid} value={ele.uuid}>
                      {ele.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <div className="pt-8">
                <button
                  className=" active:ring-2 h-10 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
                  type="button"
                  onClick={() => setShowModal(true)}
                >
                  <i className="las la-plus " />
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-between gap-4">
            <Form.Item
              className="w-4/12"
              label="Đơn vị tính"
              name="uomName"
              rules={[
                {
                  required: true,
                  message: 'Nhập đơn vị tính',
                },
              ]}
            >
              <Input
                placeholder="Nhập đơn vị tính"
                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
              />
            </Form.Item>
            <Form.Item className="w-4/12" label="Giá bán" name="price">
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
                onKeyDown={(e) =>
                  ![
                    '0',
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    'Backspace',
                    'Delete',
                    '.',
                    'ArrowRight',
                    'ArrowLeft',
                    'Tab',
                  ].includes(e.key) && e.preventDefault()
                }
                addonAfter="VND"
                stringMode
                placeholder="Nhập giá bán"
                className="antdInputNumberSuffix h-10 text-sm font-normal block !w-full rounded-l-lg text-black "
              />
            </Form.Item>
            <Form.Item className="w-4/12" label="Giá vốn" name="cost">
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
                onKeyDown={(e) =>
                  ![
                    '0',
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    'Backspace',
                    'Delete',
                    '.',
                    'ArrowRight',
                    'ArrowLeft',
                    'Tab',
                  ].includes(e.key) && e.preventDefault()
                }
                placeholder="Nhập giá vốn"
                className="antdInputNumberSuffix h-10 text-sm font-normal block !w-full rounded-l-lg text-black "
              />
            </Form.Item>
          </div>
          <Checkbox onClick={() => setToggleLabo(!toggleLabo)} checked={toggleLabo} className="pb-3">
            Có thể đặt Labo
          </Checkbox>
          {toggleLabo && (
            <div className="w-full flex justify-between gap-4">
              <Form.Item className="w-4/12" label="Hãng" name="firmName">
                <Input
                  placeholder="Nhập hãng"
                  className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                />
              </Form.Item>
              <Form.Item className="w-4/12" label="Giá đặt Labo" name="laboPrice">
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
                  onKeyDown={(e) =>
                    ![
                      '0',
                      '1',
                      '2',
                      '3',
                      '4',
                      '5',
                      '6',
                      '7',
                      '8',
                      '9',
                      'Backspace',
                      'Delete',
                      '.',
                      'ArrowRight',
                      'ArrowLeft',
                      'Tab',
                    ].includes(e.key) && e.preventDefault()
                  }
                  addonAfter="VND"
                  stringMode
                  placeholder="Nhập giá đặt Labo"
                  className="antdInputNumberSuffix h-10 text-sm font-normal block !w-full rounded-l-lg text-black "
                />
              </Form.Item>
              <Form.Item className="w-4/12 opacity-0" label="Giá vốn" name="giaVon">
                <Input
                  placeholder="Nhập giá vốn"
                  className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                />
              </Form.Item>
            </div>
          )}
        </div>
      </div>
      <div>
        {/* <div className="text-lg font-bold text-gray-600 pt-2 border-t border-gray-300">Công đoạn</div> */}
        {/* <div>{DataTableStage()}</div> */}
        {/* <TableStage /> */}
      </div>
      {/* <div>
        <div className="text-lg font-bold text-gray-600 pt-2 border-t border-gray-300">Định mức vật tư</div>
        <div>{DataTableMaterialNorms()}</div>
        <TableMaterialNorms />
      </div> */}
      <div>
        <div className="flex justify-between pt-6">
          <button
            className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-11 py-2 text-base font-medium  "
            type="button"
            onClick={() => returnButton(uuidGroup)}
          >
            Trở về
          </button>
          <button
            className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-6 py-2"
            type="button"
            onClick={async () => (await onSaveData()) && returnButton}
          >
            {uuid ? 'Lưu dịch vụ' : 'Thêm dịch vụ'}
          </button>
        </div>
      </div>
    </Form>
  );
};
