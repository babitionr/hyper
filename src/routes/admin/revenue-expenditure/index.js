import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import './index.less';
import { useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import { useSearchParams } from 'react-router-dom';
const TabData = React.lazy(() => import('./tabs/Revenue-Expennditure.js'));

const Page = () => {
  const [searchParams] = useSearchParams();
  const tabName = searchParams.get('type') ?? '1';
  const [type, setType] = useState(tabName);
  const navigate = useNavigate();
  const handleChangeTab = (key, event) => {
    if (!key) return null;
    setType(key);
    return navigate(routerLinks('RevenueExpenditure') + `?type=${key}`);
  };

  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="bg-white rounded-[10px] p-4 revenueExpenditure">
          <h2 className="font-bold text-lg text-zinc-600">{'Quản lý thu chi'.toUpperCase()}</h2>
          <div>
            <Tabs defaultActiveKey={1} onTabClick={handleChangeTab} activeKey={String(tabName)}>
              <Tabs.TabPane tab="Thu" key="1">
                {+type === 1 && <TabData type={type} />}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Chi" key="2">
                {+type === 2 ? <TabData type={type} /> : null}
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
