import { Tabs } from 'antd';
import React, { Fragment, useEffect } from 'react';
import './index.less';
import { MaterialRequirements } from './tabs/material-requirements/index.js';
import { ImportStock } from './tabs/import-stock/index.js';
import { ExportStock } from './tabs/export-stock/index.js';
import { InventoryControl } from './tabs/inventory-control';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ImportExportHistory } from './tabs/import-export-history';

const ExportImportExist = React.lazy(() => import('./tabs/Export-Import-Exist/index.js'));

const Page = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabName = searchParams.get('tab') ?? 'ExportImportExist';
  // const [type, setType] = useState(1);
  // const handleChangeTab = (key, event) => {
  //   if (!key) return null;
  //   setType(key);
  // };

  const callbackTabClicked = (key, event) => {
    switch (Number(key)) {
      case 2:
        navigate({
          search: createSearchParams({
            tab: 'ImportStock',
          }).toString(),
        });
        break;
      case 1:
        navigate({
          search: createSearchParams({
            tab: 'ExportImportExist',
          }).toString(),
        });
        break;
      case 3:
        navigate({
          search: createSearchParams({
            tab: 'ExportStock',
          }).toString(),
        });
        break;
      case 4:
        navigate({
          search: createSearchParams({
            tab: 'MaterialRequirements',
          }).toString(),
        });
        break;
      case 5:
        navigate({
          search: createSearchParams({
            tab: 'InventoryControl',
          }).toString(),
        });
        break;
      case 6:
        navigate({
          search: createSearchParams({
            tab: 'ExportImportHistory',
          }).toString(),
        });
        break;
    }
  };
  const convertKeyTab = (tabName) => {
    switch (tabName) {
      case 'ImportStock':
        return '2';
      case 'ExportImportExist':
        return '1';
      case 'ExportStock':
        return '3';
      case 'MaterialRequirements':
        return '4';
      case 'InventoryControl':
        return '5';
      case 'ExportImportHistory':
        return '6';
    }
  };

  useEffect(() => {}, [tabName]);

  const items = [
    {
      label: 'Xuất - nhập - tồn',
      key: '1',
      children: tabName === 'ExportImportExist' && <ExportImportExist />,
    },
    {
      label: 'Nhập kho',
      key: '2',
      children: tabName === 'ImportStock' && <ImportStock />,
    },
    {
      label: 'Xuất kho',
      key: '3',
      children: tabName === 'ExportStock' && <ExportStock />,
    },
    {
      label: 'Yêu cầu vật tư',
      key: '4',
      children: tabName === 'MaterialRequirements' && <MaterialRequirements />,
    },
    {
      label: 'Kiểm kho',
      key: '5',
      children: tabName === 'InventoryControl' && <InventoryControl />,
    },
    {
      label: 'Lịch sử xuất - nhập',
      key: '6',
      children: tabName === 'ExportImportHistory' && <ImportExportHistory />,
    },
  ];
  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="bg-white rounded-[10px] p-4 laboParameter">
          <h2 className="font-bold text-lg">{'Quản lý kho'.toUpperCase()}</h2>
          <div>
            <Tabs
              defaultActiveKey={convertKeyTab}
              onTabClick={callbackTabClicked}
              activeKey={convertKeyTab(tabName)}
              items={items}
            >
              {/* <Tabs.TabPane tab="Xuất - nhập - tồn" key="1">
                {tabName === 'ExportImportExist' && <ExportImportExist />}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Nhập kho" key="2">
                {tabName === 'ImportStock' && <ImportStock />}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Xuất kho" key="3">
                {tabName === 'ExportStock' && <ExportStock />}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Yêu cầu vật tư" key="4">
                {tabName === 'MaterialRequirements' && <MaterialRequirements />}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Kiểm kho" key="5">
                {tabName === 'InventoryControl' && <InventoryControl />}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Lịch sử xuất - nhập" key="6">
                {tabName === 'ExportImportHistory' && <ImportExportHistory />}
              </Tabs.TabPane> */}
            </Tabs>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
