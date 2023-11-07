import React, { useEffect } from 'react';
import { ColumnPaymentHistory } from '../columns/columnPaymentHistory';
import { PaymentService } from 'services/payment';
import { HookDataTable } from 'hooks';

export const PaymentHistoryList = ({ dataSource }) => {
  const GetPaymentHistoryList = async (param) => {
    const params = { ...param };
    const resPayment = await PaymentService.getListPaymentByTreatmentSlipHistory({
      ...params,
      saleOrderUuid: dataSource?.soUuid,
    });
    return {
      data: resPayment?.data?.content,
      count: resPayment?.data?.totalElements,
    };
  };

  const [handleChangePaymentHistory, DataPaymentHistory] = HookDataTable({
    Get: GetPaymentHistoryList,
    showSearch: false,
    yScroll: true,
    columns: ColumnPaymentHistory(),
    save: false,
    loadFirst: false,
  });

  useEffect(() => {
    console.log(dataSource);
    if (dataSource?.billType === 'RECEIPT' && dataSource?.soUuid) {
      handleChangePaymentHistory();
    }
  }, [dataSource]);

  return (
    <>
      {dataSource?.billType === 'RECEIPT' && dataSource?.soUuid && (
        <div className="mt-4">
          <div className="flex justify-between">
            <div className="text-lg font-bold">Lịch sử thanh toán</div>
            <div></div>
          </div>
          {DataPaymentHistory()}
        </div>
      )}
    </>
  );
};
