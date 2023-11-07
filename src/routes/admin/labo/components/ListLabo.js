import React, { useEffect } from 'react';
import { HookDataTable } from 'hooks';
import { ColumnListLabo } from '../columns/columnListLabo';
import { LaboService } from 'services/labo';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import { routerLinks } from 'utils';
// import { SaleOrderService } from 'services/SaleOrder';

export const ListLabo = ({ record }) => {
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!record) return null;
    navigate(
      {
        pathname: routerLinks('CustomerDetail'),
        search: createSearchParams({
          id: record?.customerUuid,
          tab: 'Labo',
          type: 'addNew',
        }).toString(),
      },
      { state: record },
    );
  };

  const handleDelete = async (id) => {
    await LaboService.delete(id);
    await handleChange();
  };

  const handleEdit = async (data) => {
    if (!record) return null;
    navigate(
      {
        pathname: routerLinks('CustomerDetail'),
        search: createSearchParams({
          id: record?.customerUuid,
          tab: 'Labo',
          type: 'edit',
          laboId: data?.uuid,
        }).toString(),
      },
      { state: record },
    );
  };

  useEffect(() => {
    handleChange();
  }, [record]);

  const [handleChange, TableExpanded] = HookDataTable({
    leftHeader: (
      <div className="flex gap-3 flex-col sm:flex-row">
        <h2 className="text-base font-bold mt-[10px]">Danh sách phiếu Labo</h2>
      </div>
    ),
    rightHeader: (
      <div className="flex gap-3 flex-col sm:flex-row justify-between items-center">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-rose-500 text-white rounded-lg border border-rose-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
          onClick={() => handleCreate()}
        >
          <i className="las la-plus mr-1" />
          Tạo phiếu Labo
        </button>
      </div>
    ),
    Get: async (params) => {
      return await LaboService.getAllBySaleOrder({ ...params, saleOrderNumber: record?.code });
    },
    showSearch: false,
    save: false,
    columns: ColumnListLabo({ handleDelete, handleEdit }),
    xScroll: 1200,
    showPagination: false,
  });
  return <>{TableExpanded()}</>;
};
