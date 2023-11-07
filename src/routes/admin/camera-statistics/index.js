import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import './index.less';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { routerLinks } from 'utils';
const Customer = React.lazy(() => import('./tabs/customer.js'));
const Staff = React.lazy(() => import('./tabs/staff.js'));

const Page = () => {
  const [searchParams] = useSearchParams();
  const tabName = searchParams.get('tab') ?? 'customer';

  const [type, setType] = useState(tabName);
  const navigate = useNavigate();
  const handleChangeTab = (key, event) => {
    if (!key) return null;
    setType(key);
    return navigate(routerLinks('CameraStatistics') + `?tab=${key}`);
  };

  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="bg-white rounded-[10px] p-4 pb-16">
          <h1 className="text-zinc-600 font-bold text-lg mb-4">{'Thống kê camera'.toUpperCase()}</h1>
          <div>
            <Tabs defaultActiveKey={1} onTabClick={handleChangeTab} activeKey={String(tabName)}>
              <Tabs.TabPane tab="Khách hàng" key="customer">
                {type === 'customer' ? <Customer type={type} /> : null}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Nhân viên" key="staff">
                {type === 'staff' ? <Staff type={type} /> : null}
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
