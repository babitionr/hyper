import React, { useEffect, useState } from 'react';
import { HookDataTable } from 'hooks';
import { ColumnMarketing } from './columns/columnMarketing';
import { AddNewMarketingCampaign } from './addNewMarketingCampaign';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
const Page = () => {
  const getData = () => {
    const data = [];
    const data1 = [
      'Chiến dịch số 1',
      'Chiến dịch số 2',
      'Chiến dịch số 3',
      'Chiến dịch số 4',
      'Chiến dịch số 5',
      'Chiến dịch số 6',
      'Chiến dịch số 7',
      'Chiến dịch số 8',
      'Chiến dịch số 9',
    ];
    data1.forEach((ele) =>
      data.push({
        name: ele,
        goal: 'Lorem ipsum dolor sit amet',
        time: '18/4/2023 - 1/5/2023',
        target: 'Khách hàng mới',
        cost: '100.000.000',
        tyLeChot: '50%',
        tyLeKhachDen: '60%',
        doanhThuDuKien: '200.000.000',
      }),
    );
    return { data, count: data.length };
  };

  const navigate = useNavigate();

  const [showMarketingCampaignModal, setShowMarketingCampaignModal] = useState(false);
  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => {
      return {
        onDoubleClick: (event) => {
          return navigate(
            routerLinks('MarketingDetail') + `?id=${data?.name.charAt(data?.name.search(/\d/))}&tab=Content`,
          );
        },
      };
    },
    columns: ColumnMarketing(),
    Get: getData,
    loadFirst: false,
    xScroll: 1000,
    showPagination: false,
    rightHeader: (
      <div className="flex gap-3">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
          onClick={() => setShowMarketingCampaignModal(true)}
        >
          <i className="las la-plus mr-1" />
          Tạo chiến dịch quảng cáo
        </button>
      </div>
    ),
  });
  useEffect(() => {
    handleChange();
  }, []);

  return (
    <div className="bg-white rounded-lg py-3 customer-detail">
      <div className="flex justify-between border-b border-blue-50 pb-4 ">
        <div className="ml-3 font-semibold text-lg text-black ">{'Marketing'.toUpperCase()}</div>
      </div>
      <div className="px-3 py-1">{DataTable()}</div>
      <AddNewMarketingCampaign
        showMarketingCampaignModal={showMarketingCampaignModal}
        setShowMarketingCampaignModal={setShowMarketingCampaignModal}
      />
    </div>
  );
};

export default Page;
