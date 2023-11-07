import React from 'react';
import { Tabs } from 'antd';
import { CustomerResource } from './customerResource';
import { CustomerGroup } from './customerGroup';

const items = [
  { label: 'Nguồn khách hàng', key: '1', children: <CustomerResource /> },
  { label: 'Nguồn khách hàng', key: '2', children: <CustomerGroup /> },
];

const Page = () => {
  return (
    <div className="bg-white rounded-lg py-3 customer-detail">
      <div className="flex justify-between border-b border-blue-50 pb-4 ">
        <div className="ml-3 font-semibold text-lg text-black ">{'Thông tin khách hàng'.toUpperCase()}</div>
      </div>
      <div className="px-6 p-3">
        <Tabs className="">
          <Tabs items={items}></Tabs>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
