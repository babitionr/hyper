import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { AutoComplete, Form, InputNumber, Modal } from 'antd';
import { PromotionService } from 'services/promotion';
import classNames from 'classnames';
import moment from 'moment';

const AddPromotion = forwardRef(
  ({ curPromotionDto, setCurPromotionDto, getListPromotionApplied, formAddService }, ref) => {
    const [form] = Form.useForm();
    const [addPromotionModal, setAddPromotionModal] = useState(false);
    const [listPromotion, setListPromotion] = useState([]);
    const [promotionType, setPromotionType] = useState();

    useImperativeHandle(ref, () => ({
      openModal() {
        setAddPromotionModal(true);
        if (curPromotionDto) {
          if (curPromotionDto?.promotionUuid) {
            form.setFieldsValue({ useAutoComplete: curPromotionDto?.code });
          } else {
            form.setFieldsValue({ useInput: curPromotionDto?.amount });
            setPromotionType((prev) => curPromotionDto?.promotionType);
          }
          console.log(curPromotionDto);
        }
      },
    }));

    const handleCancel = () => {
      setAddPromotionModal(false);
      setPromotionType();
      form.resetFields();
    };

    const init = async (e) => {
      const data = await PromotionService.getListForService({
        ...e,
        branchUuid: localStorage.getItem('branchUuid'),
        date: moment(formAddService('createdDate')).format('YYYY-MM-DD 23:59:59'),
      });
      const promoList = data.map((e) => {
        let value = e?.balanceQuantity;
        if (getListPromotionApplied?.length) {
          getListPromotionApplied.forEach((ele) => {
            if (ele?.promotionUuid === e?.uuid) {
              value = Number(value) - Number(ele?.count);
            }
          });
        }

        return { ...e, balanceQuantity: value };
      });
      setListPromotion((prev) => [
        ...promoList
          .filter((e) => e?.balanceQuantity > 0)
          .filter((e) =>
            e?.promotionType === 'PERCENT'
              ? e?.totalAmount <= 100
              : e?.totalAmount <= Number(formAddService('unitPrice')) * Number(formAddService('quantity')),
          ),
      ]);
    };

    useEffect(() => {
      if (addPromotionModal) {
        init();
      }
    }, [addPromotionModal]);

    return (
      <div>
        <Modal
          open={addPromotionModal}
          destroyOnClose={true}
          title={
            <div className="flex justify-between">
              <div className="text-base font-bold">Thêm ưu đãi</div>
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
          footer={null}
          className="!w-9/12 xl:!w-6/12 min-w-min pb-0 z-10"
          closable={false}
        >
          <Form form={form} className="px-4" colon={false}>
            <div>
              <div className="w-full flex justify-between gap-4">
                <div className="w-full flex gap-2">
                  <Form.Item
                    className="w-full"
                    label="Mã khuyến mãi"
                    name="useAutoComplete"
                    rules={[
                      {
                        validator(_, value) {
                          if (listPromotion?.find((e) => e?.code === form.getFieldValue('useAutoComplete'))?.code) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Chọn mã khuyến mãi'));
                        },
                      },
                    ]}
                  >
                    <AutoComplete
                      allowClear
                      filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                      placeholder="Chọn mã khuyến mãi"
                      onChange={(e) => {
                        // form.setFieldsValue({ useAutoComplete: e })
                      }}
                      options={listPromotion.map((e) => {
                        return {
                          label: `${e?.code} - Ưu đãi: ${
                            e?.promotionType === 'PERCENT'
                              ? e?.totalAmount + '%'
                              : e?.totalAmount?.toLocaleString('de-DE') + ' VND'
                          } - Còn lại: ${e?.balanceQuantity}`,
                          value: e?.code,
                        };
                      })}
                    />
                  </Form.Item>
                  <button
                    onClick={async () => {
                      try {
                        await form.validateFields(['useAutoComplete']);
                        setCurPromotionDto((prev) => {
                          const value = listPromotion?.find((e) => e?.code === form.getFieldValue('useAutoComplete'));
                          let amount = value?.totalAmount;
                          if (value?.promotionType === 'PERCENT' && value?.totalAmount >= 100) {
                            amount = 100;
                          }
                          if (
                            value?.promotionType === 'CASH' &&
                            value?.totalAmount >=
                              Number(formAddService('unitPrice')) * Number(formAddService('quantity'))
                          ) {
                            amount = Number(formAddService('unitPrice')) * Number(formAddService('quantity'));
                          }
                          const data = {
                            promotionUuid: value?.uuid,
                            code: value?.code,
                            amount,
                            promotionType: value?.promotionType,
                          };
                          console.log(data);
                          return data;
                        });
                        handleCancel();
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    className="h-10 w-3/12 mt-8 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-6 py-2"
                    type="button"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
              <div className="w-full flex justify-between gap-4">
                <div className="w-full flex gap-2">
                  <Form.Item
                    className="w-6/12"
                    label="Giảm giá"
                    name="useInput"
                    rules={[
                      {
                        validator(_, value) {
                          if (Number(form.getFieldValue('useInput')) > 0) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Nhập giá trị lớn hơn 0'));
                        },
                      },
                      {
                        validator(_, value) {
                          if (['PERCENT', 'CASH'].includes(promotionType)) {
                            if (promotionType === 'CASH') {
                              if (
                                Number(form.getFieldValue('useInput')) <=
                                Number(formAddService('unitPrice')) * Number(formAddService('quantity'))
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  `Tối đa là ${(
                                    Number(formAddService('unitPrice')) * Number(formAddService('quantity'))
                                  ).toLocaleString('de-DE')} VND`,
                                ),
                              );
                            }
                            if (promotionType === 'PERCENT') {
                              if (Number(form.getFieldValue('useInput')) <= 100) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error(`Tối đa là 100`));
                            }
                          }
                          return Promise.reject(new Error('Chọn % hoặc VND'));
                        },
                      },
                    ]}
                  >
                    {promotionType === 'PERCENT' ? (
                      <InputNumber
                        min={0}
                        max={100}
                        className="h-10 w-full text-sm font-normal block rounded-lg border border-gray-200 py-1 focus:outline-none"
                      />
                    ) : (
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
                        stringMode
                        placeholder=""
                        className="h-10 w-full text-sm font-normal block rounded-lg border border-gray-200 py-1 focus:outline-none"
                      />
                    )}
                  </Form.Item>
                  <button
                    onClick={() => {
                      if (form.getFieldValue('useInput') > 100) {
                        form.setFieldsValue({ useInput: 100 });
                      }
                      setPromotionType((prev) => 'PERCENT');
                    }}
                    className={classNames(
                      'mt-8 h-10 w-1/12  bg-white text-rose-500 rounded-lg border border-rose-500  items-center !text-base !font-medium',
                      { '!bg-rose-500 text-white': promotionType === 'PERCENT' },
                    )}
                    type="button"
                  >
                    %
                  </button>
                  <button
                    onClick={() => {
                      setPromotionType((prev) => 'CASH');
                    }}
                    className={classNames(
                      'mt-8 h-10 w-2/12  bg-white text-gray-500 rounded-lg border border-gray-500  items-center !text-base !font-medium',
                      { '!bg-gray-200 border-gray-900': promotionType === 'CASH' },
                    )}
                    type="button"
                  >
                    VND
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await form.validateFields(['useInput']);
                        setCurPromotionDto((prev) => ({
                          promotionUuid: null,
                          code: null,
                          amount: form.getFieldValue('useInput'),
                          promotionType,
                        }));
                        handleCancel();
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    className="mt-8 h-10 w-3/12 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-6 py-2"
                    type="button"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    );
  },
);

AddPromotion.displayName = 'AddPromotion';
export default AddPromotion;
