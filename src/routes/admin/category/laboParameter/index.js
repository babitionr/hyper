import { Tabs } from 'antd';
import React, { Fragment, useState } from 'react';
import './index.less';
const MaterialsLabo = React.lazy(() => import('./tabs/materialsLabo.js'));

const Page = () => {
  const [type, setType] = useState('MATERIAL');
  const handleChangeTab = (key, event) => {
    if (!key) return null;
    setType(key);
  };
  const items = [
    { label: 'Vật liệu Labo', key: 'MATERIAL', children: type === 'MATERIAL' && <MaterialsLabo type={type} /> },
    { label: 'Gửi kèm Labo', key: 'ENCLOSE', children: type === 'ENCLOSE' && <MaterialsLabo type={type} /> },
    { label: 'Khớp cắn Labo', key: 'BITE', children: type === 'BITE' && <MaterialsLabo type={type} /> },
    { label: 'Đường hoàn tất', key: 'LINE', children: type === 'LINE' && <MaterialsLabo type={type} /> },
    { label: 'Kiểu nhịp Labo', key: 'SPAN', children: type === 'SPAN' && <MaterialsLabo type={type} /> },
  ];
  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="bg-white rounded-[10px] p-4 laboParameter">
          <h2 className="font-bold text-lg">{'Thông số Labo'.toUpperCase()}</h2>
          <div>
            <Tabs
              defaultActiveKey={'MATERIAL'}
              onTabClick={handleChangeTab}
              activeKey={type}
              onChange={setType}
              items={items}
            >
              {/* <Tabs.TabPane tab="Vật liệu Labo" key="MATERIAL">
                {type === 'MATERIAL' && <MaterialsLabo type={type} />}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Gửi kèm Labo" key="ENCLOSE">
                {type === 'ENCLOSE' && <MaterialsLabo type={type} />}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Khớp cắn Labo" key="BITE">
                {type === 'BITE' && <MaterialsLabo type={type} />}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Đường hoàn tất" key="LINE">
                {type === 'LINE' && <MaterialsLabo type={type} />}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Kiểu nhịp Labo" key="SPAN">
                {type === 'SPAN' && <MaterialsLabo type={type} />}
              </Tabs.TabPane> */}
            </Tabs>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
