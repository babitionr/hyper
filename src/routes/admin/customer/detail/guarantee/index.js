import { HookDataTable } from 'hooks';
import React, { useState } from 'react';

import { useSearchParams } from 'react-router-dom';
import { ColumnGuarantee } from './columns/columnGuarantee';
import './index.less';
import { LaboService } from 'services/labo';

function Guarantee({ data }) {
  const [isLoading, setIsLoading] = useState(false);
  // const { branchUuid } = useAuth()

  const [searchParams] = useSearchParams();
  const idCustomer = searchParams.get('id');

  const [, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {},
    }),
    showSearch: true,
    save: false,
    fullTextSearch: 'search',
    isLoading,
    setIsLoading,
    Get: async (params) => {
      return await LaboService.getListWarrantyByCustomer({ ...params, customerUuid: idCustomer });
    },
    columns: ColumnGuarantee({}),
  });

  return (
    <div>
      <h2 className="font-bold text-lg text-zinc-600 my-5">{'Bảo hành'.toUpperCase()}</h2>

      <div className="flex justify-between items-center">
        {/* <div className='flex items-center'>
          <div className="relative h-[42px] w-[315px] mr-4">
            <Input
              placeholder="Tìm kiếm"
              className=" relative !bg-white border border-gray-300 h-[42px] w-full  rounded-[10px] px-3 focus:!shadow-none focus:!outline-none"
            />
            <span className="absolute right-4 top-2.5">
              {exportIcons('SEARCH')}
            </span>
          </div>

        </div> */}
        {/* <div className="flex items-center">
          <button
            onClick={() => setShowModal(true)}
            className="h-[40px] w-[131px] ml-4 border rounded-[8px] bg-rose-500 text-white flex justify-center items-center "
          >
            {' '}
            <i className="las la-plus bold"></i>
            <span className="ml-[10px]"> Thêm mới </span>
          </button>
        </div> */}
      </div>
      <div>{DataTable()}</div>
    </div>
  );
}

export default Guarantee;
