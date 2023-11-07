import React from 'react';
import { HookDataTable } from 'hooks';
import { ColumnExportStockMini } from '../../columns/columnExportStockMini';
import { WarehousingBill } from 'services/warehousing-bill';

export const ExportStockMini = ({ record }) => {
  const getDataTableMini = async (params) => {
    const data = await WarehousingBill.getListProduct({ ...params, warehousingBillUuid: record.uuid });
    return { data: data.content, count: data.length };
  };

  const [, DataTableMini] = HookDataTable({
    showSearch: false,
    columns: ColumnExportStockMini(),
    save: false,
    Get: getDataTableMini,
  });
  return <div>{DataTableMini()}</div>;
};
