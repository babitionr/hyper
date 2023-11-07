import { Tabs } from 'antd';
import React from 'react';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { RemindCalendar } from './remind-calendar/remindCalendar';
import { LateCalendar } from './late-calendar/lateCalendar';
import { AfterTreatment } from './after-treatment/afterTreatment';
import { Potential } from './potential/potential';
import { Birthday } from './birthday/birthday';
const Page = ({ type }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabName = searchParams.get('tab') ?? 'remindCalendar';

  const handleChangeTab = (key, event) => {
    if (!key) return null;
    return navigate(routerLinks('CustomerCare') + `?tab=${key}`);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white p-4 rounded-lg pb-6">
        <h2 className="font-bold text-lg text-zinc-600">{'Chăm sóc khách hàng'.toUpperCase()}</h2>
        <Tabs onChange={handleChangeTab} activeKey={String(tabName)}>
          <Tabs.TabPane tab="Nhắc lịch hẹn" key="remindCalendar">
            <RemindCalendar />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Sau điều trị" key="afterTreatment">
            <AfterTreatment />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Sinh nhật" key="birthday">
            <Birthday />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Trễ hẹn" key="lateCalendar">
            <LateCalendar />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng tiềm năng" key="potential">
            <Potential />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
