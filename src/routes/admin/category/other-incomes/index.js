import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import TableData from './components/TableOtherIncome';
import { RevenueSettingService } from 'services/revenue-setting';
import { Message } from 'components';
import { useLocation } from 'react-router';
function Page() {
  const [form] = Form.useForm();
  const OrganizationUuid = localStorage.getItem('keyOrganizationUuid');
  const [dataSource, setDataSource] = useState([
    {
      key: 1,
      name: undefined,
      isDelete: false,
    },
  ]);
  // console.log('dataSource: ', dataSource);

  const [detail, setDetail] = useState();
  const location = useLocation();

  useEffect(() => {
    const getByOrganizationUuid = async () => {
      const res = await RevenueSettingService.getByOrganizationUuid(OrganizationUuid);
      setDetail(res);
      setDataSource(res?.revenueItemDtoList);
      form.setFieldsValue(res);
    };
    getByOrganizationUuid();
  }, [location.pathname]);

  const handleSave = async (values) => {
    // if (dataSource?.filter(i => i.name === null || i.name === undefined || i.name === '').length) {
    //   return Message.error({ text: 'Vui lòng nhập tên khoản thu nhập.' })
    // }
    const param = {
      uuid: detail?.uuid ?? null,
      salaryDays: +values.salaryDays,
      coefficientOverTime: values.coefficientOverTime,
      orgUuid: OrganizationUuid,
      workHour: +values.workHour,
      revenueItemDtoList: dataSource?.filter((i) => !!i.name)?.map(({ key, ...rest }) => rest),
    };
    const res = await RevenueSettingService.post(param);

    if (res) {
      const res = await RevenueSettingService.getByOrganizationUuid(OrganizationUuid);
      setDetail(res);
      setDataSource(res?.revenueItemDtoList);
      form.setFieldsValue(res);
      Message.success({ text: 'Lưu thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
    }
  };
  return (
    <div className="min-h-screen branchs">
      <div className="bg-white p-4 pb-8">
        <h2 className="font-semibold text-lg mb-5">{'Những khoản thu nhập cố định'.toUpperCase()}</h2>
        <Form
          form={form}
          // onValuesChange={(_, values) => setFormValues((prevState) => ({ ...prevState, ...values }))}
          colon={false}
          className="w-full"
          onFinish={handleSave}
        >
          <div>
            <div className="flex gap-4">
              <div className="flex flex-wrap gap-2 w-full">
                <div className="w-full flex justify-between gap-4">
                  <Form.Item
                    className="w-4/12"
                    label="Số ngày làm việc trong tháng"
                    name="salaryDays"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập Số ngày làm việc trong tháng!',
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      max={31}
                      className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                      placeholder="Nhập số ngày làm việc trong tháng"
                    />
                  </Form.Item>
                  <Form.Item
                    className="w-4/12"
                    label="Số giờ làm việc trong ngày"
                    name="workHour"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số giờ làm việc trong ngày!',
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      max={31}
                      className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                      placeholder="Nhập số số giờ làm việc trong ngày"
                    />
                  </Form.Item>
                  <Form.Item
                    className="w-4/12"
                    label="Lương OT( Hệ số OT )"
                    name="coefficientOverTime"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn Lương OT( Hệ số OT )!',
                      },
                    ]}
                  >
                    <Select
                      className="w-full !rounded-lg  text-sm font-normal"
                      placeholder="Chọn Lương OT( Hệ số OT )"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      allowClear
                      options={[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4].map((item) => ({ value: item, label: item }))}
                    ></Select>
                  </Form.Item>
                </div>

                <div className="w-full flex justify-between gap-4 table_data">
                  <TableData
                    className="table_data"
                    dataSource={dataSource?.map((i, idx) => ({ ...i, key: idx + 1 }))}
                    setDataSource={setDataSource}
                    pageType={'create'}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center mt-4">
            <button
              className="text-white bg-red-500 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300 rounded-lg px-16 py-2 text-base font-medium  hover:bg-red-600 hover:border-transparent outline-none focus:outline-none "
              type="submit"
            >
              Lưu
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Page;
