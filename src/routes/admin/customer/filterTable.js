import React, { useState } from 'react';
import { DatePicker, Form, Select } from 'antd';

const { Option } = Select;
const dateOnChange = (date, dateString) => {
  console.log(date, dateString);
};

export const FilterTable = (props) => {
  const { filterTableData, setFilterTableData, setToggleFilter, toggleFilter } = props;
  console.log(filterTableData);
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const onReset = () => {
    setFilterTableData({});
    form.resetFields();
    setToggleFilter(!toggleFilter);
  };
  const sentToApi = () => {
    setFilterTableData(formValues);
    setToggleFilter(!toggleFilter);
  };
  return (
    <Form
      colon={false}
      onValuesChange={(_, values) => setFormValues((prevState) => ({ ...prevState, ...values }))}
      form={form}
      className="border rounded-lg"
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex w-full gap-8">
          <Form.Item name="appointmentDate" className="w-1/3" label="Lịch hẹn">
            <DatePicker
              placeholder="DD/MM/YYYY"
              className="!w-full border rounded-lg !bg-white border-gray-200"
              onChange={dateOnChange}
              format="DD/MM/YYYY"
            />
          </Form.Item>
          <Form.Item name="treatmentStatus" className="w-1/3" label="Tình trạng điều trị">
            <Select className="!w-full !rounded-lg" placeholder="Tình trạng điều trị" allowClear>
              <Option value="TREATED">Đã điều trị</Option>
              <Option value="NOT_TREAT">Chưa điều trị</Option>
              <Option value="TREATING">Đang điều trị</Option>
            </Select>
          </Form.Item>
          <Form.Item name="bacSiDieuTri" className="w-1/3" label="Bác sĩ điều trị">
            <Select className="!w-full !rounded-lg " placeholder="Bác sĩ điều trị" allowClear>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Form.Item>
        </div>
        <div className="flex w-full gap-8">
          <Form.Item name="customerResource" className="w-1/3" label="Nguồn khách hàng">
            <Select className="!w-full !rounded-lg " placeholder="Nguồn khách hàng" allowClear>
              <Option value="FACEBOOK">FACEBOOK</Option>
              <Option value="ZALO">ZALO</Option>
              <Option value="WEBSITE">WEBSITE</Option>
            </Select>
          </Form.Item>
          <Form.Item name="treatmentDate" className="w-1/3" label="Ngày khám">
            <DatePicker
              placeholder="DD/MM/YYYY"
              className="!w-full border rounded-lg !bg-white border-gray-200"
              onChange={dateOnChange}
              format="DD/MM/YYYY"
            />
          </Form.Item>
          <div className="w-1/3"></div>
        </div>
      </div>
      <div className="flex justify-end p-4 pb-2 gap-4">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 px-3 pt-2 !pb-2  rounded-lg border border-gray-400  items-center !text-base !font-medium"
          onClick={onReset}
        >
          Xóa bộ lọc
        </button>
        <button
          onClick={sentToApi}
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white px-3  rounded-lg border border-red-500  items-center !text-base !font-medium"
        >
          Tìm Kiếm
        </button>
      </div>
    </Form>
  );
};
