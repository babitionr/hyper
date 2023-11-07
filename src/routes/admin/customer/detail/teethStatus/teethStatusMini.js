import React from 'react';
import { HookDataTable } from 'hooks';
import { ColumnTeethStatusMini } from '../columns/columnTeethStatusMini';
import { SaleOrderService } from 'services/SaleOrder';

export const TeethStatusMini = ({ record, idCustomer }) => {
  const GetListSaleOrder = async (param) => {
    const data = await SaleOrderService.getList({ ...param, customerUuid: idCustomer, teethStoryUuid: record.uuid });
    return {
      data: data?.content,
      count: data?.content?.length,
    };
  };

  const [, DataTableMini] = HookDataTable({
    Get: GetListSaleOrder,
    showSearch: false,
    columns: ColumnTeethStatusMini(),
    save: false,
  });
  return <div>{DataTableMini()}</div>;
};
