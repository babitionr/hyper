import React from 'react';
import { HookDataTable } from 'hooks';
import { ColumnImportStockMini } from '../../columns/columnImportStockMini';
import { WarehousingBill } from 'services/warehousing-bill';

export const ImportStockMini = ({ record }) => {
  const getDataTableMini = async (params) => {
    const data = await WarehousingBill.getListProduct({ ...params, warehousingBillUuid: record.uuid });
    return { data: data.content, count: data.length };
  };

  const [, DataTableMini] = HookDataTable({
    showSearch: false,
    columns: ColumnImportStockMini(),
    save: false,
    Get: getDataTableMini,
  });
  return <div>{DataTableMini()}</div>;
};
