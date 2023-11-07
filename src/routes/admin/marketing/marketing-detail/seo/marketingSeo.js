import React, { useEffect } from 'react';
import { HookDataTable } from 'hooks';
import { ColumnSeo } from '../../columns/columnSeo';

const MarketingSeo = () => {
  const getData = () => {
    const data = [];
    const data1 = [
      'Chi nhánh 1',
      'Chi nhánh 2',
      'Chi nhánh 3',
      'Chi nhánh 4',
      'Chi nhánh 5',
      'Chi nhánh 6',
      'Chi nhánh 7',
      'Chi nhánh 8',
    ];
    data1.forEach((ele) =>
      data.push({
        name: ele,
        kpi: '100',
        keyword: '150',
        volumn: '150',
        trafic: '150',
        tyLeTop: '80%',
      }),
    );
    return { data, count: data.length };
  };

  const [handleChange, DataTable] = HookDataTable({
    columns: ColumnSeo(),
    Get: getData,
    loadFirst: false,
    xScroll: 1000,
    showPagination: false,
    rightHeader: (
      <div className="flex gap-3">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
          // onClick={() => setShowMarketingCampaignModal(true)}
        >
          <i className="las la-plus mr-1" />
          Tạo báo cáo
        </button>
      </div>
    ),
  });
  useEffect(() => {
    handleChange();
  }, []);

  return (
    <div className="bg-white rounded-lg py-3 customer-detail">
      <div className="-mt-4">{DataTable()}</div>
    </div>
  );
};

export default MarketingSeo;
