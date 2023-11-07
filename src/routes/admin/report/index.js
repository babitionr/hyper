import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import './index.less';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { routerLinks } from 'utils';
import { ServiceHistory } from './tabs/service-history';
const ReportDate = React.lazy(() => import('./tabs/report-date.js'));
const RevenueOverview = React.lazy(() => import('./tabs/revenue-overview'));

const Page = () => {
  const [searchParams] = useSearchParams();
  const tabName = searchParams.get('tab') ?? 'report_date';
  const location = useLocation();

  const [type, setType] = useState(tabName);
  const navigate = useNavigate();
  const handleChangeTab = (key, event) => {
    if (!key) return null;
    setType(key);
    if (location.pathname === '/') {
      return navigate(routerLinks('Home') + `?tab=${key}`);
    } else return navigate(routerLinks('ReportDate') + `?tab=${key}`);
  };

  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="bg-white rounded-[10px] p-4 pb-16">
          <h2 className="font-bold text-lg text-zinc-600">BÁO CÁO NGÀY</h2>
          <div>
            <Tabs defaultActiveKey={1} onTabClick={handleChangeTab} activeKey={String(tabName)}>
              <Tabs.TabPane tab="Báo cáo ngày" key="report_date">
                {type === 'report_date' && <ReportDate type={type} />}
              </Tabs.TabPane>

              <Tabs.TabPane tab="Danh sách bệnh nhân trong ngày" key="service-history">
                {type === 'service-history' && <ServiceHistory type={type} />}
              </Tabs.TabPane>

              <Tabs.TabPane tab="Tổng quan doanh thu" key="revenue_overview">
                {type === 'revenue_overview' ? <RevenueOverview type={type} /> : null}
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
