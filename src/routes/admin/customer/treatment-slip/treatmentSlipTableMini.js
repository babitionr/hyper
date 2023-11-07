import React from 'react';
import { HookDataTable } from 'hooks';
import { ColumnTreatmentSlipTableMini } from './columnTreatmentSlipTableMini';
import { SaleOrderService } from 'services/SaleOrder';

export const TreatmentSlipTableMini = ({ record }) => {
  const GetListSaleOrderService = async (param) => {
    const data = await SaleOrderService.GetListSaleOrderService({ ...param, saleOrderUuid: record.uuid });
    return {
      data: data?.content,
      count: data?.content?.length,
    };
  };
  const [, TableMini] = HookDataTable({
    Get: GetListSaleOrderService,
    showSearch: false,
    save: false,
    columns: ColumnTreatmentSlipTableMini(),
  });
  return <div>{TableMini()}</div>;
};
