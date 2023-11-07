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
  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="bg-white rounded-[10px] p-4 laboParameter">
          <h2 className="font-bold text-lg">{'Thông số Labo'.toUpperCase()}</h2>
          <div>
            <Tabs defaultActiveKey={'MATERIAL'} onTabClick={handleChangeTab}>
              <Tabs.TabPane tab="Vật liệu Labo" key="MATERIAL">
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
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
