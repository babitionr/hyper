import { Form, Input, DatePicker, Modal } from 'antd';
import React from 'react'; // , { useState, useEffect }
// import moment from 'moment/moment';
import TextArea from 'antd/lib/input/TextArea';

export const AddNewMarketingCampaign = ({
  handleChange,
  showMarketingCampaignModal,
  setShowMarketingCampaignModal,
}) => {
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;

  const handleCancel = () => {
    form.resetFields();
    setShowMarketingCampaignModal(false);
  };

  return (
    <div>
      {showMarketingCampaignModal && (
        <Modal
          // bodyStyle={{ height: 625 }}
          destroyOnClose={true}
          title={
            <div className="flex justify-between">
              <div className="text-base font-bold">{'Tạo chiến dịch'.toUpperCase()}</div>
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
          open={showMarketingCampaignModal}
          footer={null}
          className="!w-6/12 min-w-min pb-0"
          closable={false}
          style={{ top: 5 }}
        >
          <Form
            onFinish={() => {
              // handleOk();
              handleCancel();
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
                      label="Tên chiến dịch"
                      name="name"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Vui lòng tên chiến dịch!',
                      //   },
                      //   {
                      //     pattern:
                      //       /^(?=.*[a-vwxyzỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ])[a-vwxyzỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ ]{1,}$/i,
                      //     message: 'Vui lòng chỉ nhập chữ',
                      //   },
                      // ]}
                    >
                      <Input
                        placeholder="Nhập tên chiến dịch"
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                  </div>
                  <div className="w-full flex justify-between gap-4">
                    <Form.Item className="w-6/12" name="time" label="Thời gian">
                      <RangePicker
                        placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
                        className="items-stretch border rounded-lg !bg-white border-gray-200"
                        format="DD/MM/YYYY"
                        onChange={(dates, dateStrings) => {
                          if (dates) {
                            console.log(dateStrings[0], '-', dateStrings[1]);
                          }
                        }}
                      />
                    </Form.Item>
                    <Form.Item className="w-6/12 " name="target" label="Đối tượng">
                      <Input
                        placeholder="Nhập đối tượng"
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                  </div>
                  <div className="w-full flex justify-between gap-4">
                    <Form.Item className="w-6/12" name="cost" label="Chi phí">
                      <Input
                        placeholder="Nhập chi phí"
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                    <Form.Item className="w-6/12 " name="tyLeChot" label="Tỷ lệ chốt( Dự kiến )">
                      <Input
                        placeholder="Nhập tỷ lệ chốt"
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                  </div>
                  <div className="w-full flex justify-between gap-4">
                    <Form.Item className="w-6/12" name="tyLeKhachDen" label="Tỷ lệ khách đến( Dự kiến )">
                      <Input
                        placeholder="Nhập tỷ lệ khách đến"
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                    <Form.Item className="w-6/12 " name="doanhThu" label="Doanh thu( Dự kiến )">
                      <Input
                        placeholder="Nhập doanh thu"
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                  </div>
                  <div className="w-full flex justify-between gap-4">
                    <Form.Item className="w-full" label="Mục tiêu" name="goal">
                      <TextArea
                        rows={4}
                        className=" w-full text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-2 px-4 "
                        placeholder=""
                      />
                      {/* <Input
                    placeholder="Nhập nội dung"
                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                    defaultValue={"SO03521 - Khách hàng thanh toán"}
                  /> */}
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
  );
};
