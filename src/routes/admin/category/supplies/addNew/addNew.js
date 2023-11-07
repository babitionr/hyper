import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import { TableStage } from './tableStage';
import { useSearchParams } from 'react-router-dom';
import { Message } from 'components';
import { MaterialMedicineService } from 'services/material-medicine';
import { InventoryCriteriaService } from 'services/inventory-criteria';

export const AddNew = ({ returnButton, servicesList, setShowModal, setSelectedServices }) => {
  const [searchParams] = useSearchParams();
  const uuidGroup = searchParams.get('uuidGroup');
  const uuid = searchParams.get('uuid');
  const [productConversionUnitDtoList, setProductConversionUnitDtoList] = useState([]);
  const [form] = Form.useForm();
  console.log(servicesList);
  const [inventoryCriteriaDtoList, setInventoryCriteriaDtoList] = useState([]);
  const initData = async () => {
    const initInventoryCriteriaList = await InventoryCriteriaService.getAll({
      branchUuid: localStorage.getItem('branchUuid'),
    });
    setInventoryCriteriaDtoList(initInventoryCriteriaList.data);
    if (uuidGroup) {
      form.setFieldsValue({ serviceCategoryUuid: uuidGroup });
    }
    if (!uuid) return;
    const data = await MaterialMedicineService.getDetail(uuid);
    console.log(data);
    form.setFieldsValue({
      ...data,
      productInventoryCriteriaDtoList: data?.productInventoryCriteriaDtoList?.map((e) => e.uuid) ?? [],
    });
  };
  const onSaveData = async () => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue();
      const uuidGroupService = formValues.categoryUuid;
      const res = {
        ...formValues,
        productType: 'MATERIAL',
        // groupServiceName: servicesList.filter((e) => e.uuid ===form.getFieldsValue().groupServiceName)[0].name,
        productConversionUnitDtoList,
        productInventoryCriteriaDtoList: formValues?.productInventoryCriteriaDtoList?.map((e) => ({ uuid: e })),
      };
      const data = await MaterialMedicineService.post({ ...res, uuid });
      if (data.message) {
        if (!uuid) {
          await Message.success({
            text: 'Tạo thông tin vật tư thành công',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
        }
        if (uuid) {
          await Message.success({
            text: 'Chỉnh sửa thông tin vật tư thành công',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
        }
      }
      setSelectedServices(uuidGroupService || uuidGroup);
      returnButton(uuidGroupService || uuidGroup);
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const { Option } = Select;

  useEffect(() => {
    initData();
  }, []);

  return (
    <Form form={form} className="px-4" colon={false}>
      <div>
        <div className="text-lg font-bold text-gray-600 pt-2">Thông tin</div>
        <div>
          <div className="w-full flex justify-between gap-4">
            <Form.Item className="w-4/12" label="Mã vật tư" name="code">
              <Input
                placeholder="Nhập vật tư"
                disabled
                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
              />
            </Form.Item>
            <Form.Item
              className="w-4/12"
              label="Tên vật tư"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Nhập tên vật tư',
                },
              ]}
            >
              <Input
                placeholder="Nhập tên vật tư"
                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
              />
            </Form.Item>
            <div className="w-4/12 flex gap-2">
              <Form.Item
                className="w-full"
                name="categoryUuid"
                label="Nhóm vật tư"
                rules={[
                  {
                    required: true,
                    message: 'Nhập nhóm vật tư',
                  },
                ]}
              >
                <Select
                  className=" !rounded-lg"
                  placeholder="Chọn nhóm vật tư"
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
                  <i className="las la-plus" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-between gap-4">
            <Form.Item
              className="w-4/12"
              name="type"
              label="Loại vật tư"
              rules={[
                {
                  required: true,
                  message: 'Chọn loại vật tư',
                },
              ]}
            >
              <Select
                className=" !rounded-lg"
                placeholder="Chọn loại vật tư"
                onChange={(e) => {
                  console.log(form.getFieldsValue());
                  // form.setFieldsValue({ ...form.getFieldsValue(), type: e });
                }}
              >
                <Option key={2} value="INVENTORY_MANAGEMENT">
                  Có quản lý tồn kho
                </Option>
                <Option key={1} value="NON_INVENTORY_MANAGEMENT">
                  Không quản lý tồn kho
                </Option>
              </Select>
            </Form.Item>
            <Form.Item className="w-4/12" label="Xuất xứ" name="origin">
              <Input
                placeholder="Nhập xuất xứ"
                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
              />
            </Form.Item>
            <Form.Item className="w-4/12" label="Thời hạn sử dụng (tháng)" name="expiryDay">
              <Input
                type="number"
                defaultValue={1}
                min={0}
                placeholder="Nhập thời hạn sử dụng"
                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
              />
            </Form.Item>
          </div>
          <div className="w-full flex justify-between gap-4">
            <Form.Item className="w-4/12" label="Tiêu chí kiểm kho" name="productInventoryCriteriaDtoList">
              <Select className=" !rounded-lg" placeholder="Chọn nhóm tiêu chí kiểm kho" allowClear mode="multiple">
                {inventoryCriteriaDtoList.map((ele) => (
                  <Option key={ele.uuid} value={ele.uuid}>
                    {ele.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item className="w-4/12" label="Mức tồn tối thiểu" name="minimumLossAmount">
              <Input
                placeholder="Nhập mức tồn tối thiểu"
                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
              />
            </Form.Item>
            <Form.Item
              className="w-4/12"
              label="Đơn vị tồn kho"
              name="inventoryUnit"
              rules={[
                {
                  required: true,
                  message: 'Nhập đơn vị tồn kho',
                },
              ]}
            >
              <Input
                placeholder="Nhập đơn vị tồn kho"
                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
              />
            </Form.Item>
          </div>
          <div className="w-full flex justify-between gap-4">
            <Form.Item className="w-4/12" label="Giá mua" name="buyPriceAmount">
              <Input
                type="number"
                defaultValue={0}
                min={0}
                placeholder="Nhập giá mua"
                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
              />
            </Form.Item>
            <Form.Item className="w-4/12" label="Giá bán" name="sellPriceAmount">
              <Input
                type="number"
                defaultValue={0}
                min={0}
                placeholder="Nhập giá bán"
                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
              />
            </Form.Item>
            <Form.Item className="w-4/12" label="Giá vốn" name="costPriceAmount">
              <Input
                type="number"
                defaultValue={0}
                min={0}
                placeholder="Nhập giá vốn"
                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
              />
            </Form.Item>
          </div>
        </div>
      </div>
      <div>
        {/* <div className="text-lg font-bold text-gray-600 pt-2 border-t border-gray-300">Công đoạn</div> */}
        {/* <div>{DataTableStage()}</div> */}
        <TableStage
          productConversionUnitDtoList={productConversionUnitDtoList}
          setProductConversionUnitDtoList={setProductConversionUnitDtoList}
        />
      </div>
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
            type="submit"
            onClick={async () => await onSaveData()}
          >
            {uuid ? 'Lưu vật tư' : 'Thêm vật tư'}
          </button>
        </div>
      </div>
    </Form>
  );
};
