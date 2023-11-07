import { Tabs } from 'antd';
import React, { useState } from 'react';
import './index.less';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { routerLinks } from 'utils';
const Revenue = React.lazy(() => import('../tabs/revenue'));
const RealMoney = React.lazy(() => import('../tabs/real-money'));
const BusinessResults = React.lazy(() => import('../tabs/business-results'));
function Page() {
  const [searchParams] = useSearchParams();
  const tabName = searchParams.get('tab') ?? 'revenue';

  const [type, setType] = useState(tabName);
  const navigate = useNavigate();
  const handleChangeTab = (key, event) => {
    if (!key) return null;
    setType(key);
    return navigate(routerLinks('ReportBranch') + `?tab=${key}`);
  };
  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-[10px] p-4 pb-16">
        <h2 className="font-bold text-lg text-zinc-600">BÁO CÁO CHI NHÁNH</h2>
        <div>
          <Tabs defaultActiveKey={1} onTabClick={handleChangeTab} activeKey={String(tabName)}>
            <Tabs.TabPane tab="Doanh thu" key="revenue">
              {type === 'revenue' && <Revenue type={type} />}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Thực thu" key="real_money">
              {type === 'real_money' ? <RealMoney type={type} /> : null}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Kết quả kinh doanh" key="business_results">
              {type === 'business_results' ? <BusinessResults type={type} /> : null}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Page;
