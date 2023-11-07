import { Tabs } from 'antd';
import React, { useState } from 'react';
import ListDebt from './listDebt';
import PaymentHistory from './paymentHistory';

function Dept({ data }) {
  const [type, setType] = useState(1);
  const handleChangeTab = (key, event) => {
    if (!key) return null;
    setType(+key);
  };
  const items = [
    { label: 'Danh sách công nợ', key: '1', children: +type === 1 && <ListDebt data={data} /> },
    { label: 'Lịch sử thanh toán', key: '2', children: +type === 2 && <PaymentHistory data={data} /> },
  ];
  return (
    <Tabs defaultActiveKey="1" onTabClick={handleChangeTab}>
      {/* <Tabs.TabPane tab="Danh sách công nợ" key="1">
        {+type === 1 && <ListDebt data={data} />}
      </Tabs.TabPane>
      <Tabs.TabPane tab="Lịch sử thanh toán" key="2">
        {+type === 2 && <PaymentHistory data={data} />}
      </Tabs.TabPane> */}
      <Tabs activeKey={type} onChange={setType} items={items}></Tabs>
    </Tabs>
  );
}

export default Dept;
