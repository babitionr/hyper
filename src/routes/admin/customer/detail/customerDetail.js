import { Breadcrumb, Tabs } from 'antd';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CustomerService } from 'services/customer';
import { TreatmentSlip } from '../treatment-slip/treatmentSlip';
import './index.less';
import { TeethStatus } from './teethStatus/teethStatus';
import Guarantee from './guarantee';
import { keyMenu } from 'variable';

const Profile = React.lazy(() => import('./profile'));
const Dept = React.lazy(() => import('./debt'));
const Labo = React.lazy(() => import('./labo'));
const Calendar = React.lazy(() => import('./calendar'));
const CustomerExamination = React.lazy(() => import('./customerExamination'));

const Page = () => {
  const [searchParams] = useSearchParams();
  const menu = JSON.parse(localStorage.getItem(keyMenu));
  const tabName = searchParams.get('tab');
  const idCustomer = searchParams.get('id');
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const checkPermission = useCallback(
    (key) => {
      if (menu) {
        return !!menu?.filter?.((i) => i?.code === key)?.length;
      }
    },
    [menu],
  );

  const callbackTabClicked = (key, event) => {
    switch (Number(key)) {
      case 2:
        navigate({
          search: createSearchParams({
            id: idCustomer,
            tab: 'TeethStatus',
            type: 'detail',
          }).toString(),
        });
        break;
      case 1:
        navigate({
          search: createSearchParams({
            id: idCustomer,
            tab: 'TeethProfile',
            type: 'detail',
          }).toString(),
        });
        break;
      case 3:
        navigate({
          search: createSearchParams({
            id: idCustomer,
            tab: 'TreatmentSlip',
            type: 'detail',
          }).toString(),
        });
        break;
      case 4:
        navigate({
          search: createSearchParams({
            id: idCustomer,
            tab: 'Debt',
            type: 'detail',
          }).toString(),
        });
        break;
      case 5:
        navigate({
          search: createSearchParams({
            id: idCustomer,
            tab: 'Labo',
            type: 'detail',
          }).toString(),
        });
        break;
      case 6:
        navigate({
          search: createSearchParams({
            id: idCustomer,
            tab: 'Calendar',
            type: 'detail',
          }).toString(),
        });
        break;
      case 7:
        navigate({
          search: createSearchParams({
            id: idCustomer,
            tab: 'Guarantee',
            type: 'detail',
          }).toString(),
        });
        break;
      case 8:
        navigate({
          search: createSearchParams({
            id: idCustomer,
            tab: 'CustomerExamination',
            type: 'detail',
          }).toString(),
        });
        break;
    }
  };
  const convertKeyTab = (tabName) => {
    switch (tabName) {
      case 'TeethStatus':
        return '2';
      case 'TeethProfile':
        return '1';
      case 'TreatmentSlip':
        return '3';
      case 'Debt':
        return '4';
      case 'Labo':
        return '5';
      case 'Calendar':
        return '6';
      case 'Guarantee':
        return '7';
      case 'CustomerExamination':
        return '8';
    }
  };
  // const { t } = useTranslation();
  // const mount = useRef(false);
  // changePermission permission

  useEffect(() => {
    // console.log(tabName);
  }, [tabName]);

  const { pathname } = useLocation();

  useEffect(() => {
    const getDetailProfile = async () => {
      if (idCustomer) {
        try {
          const res = await CustomerService.getByUuid(idCustomer);
          setData(res);
        } catch (error) {
          return error;
        }
      }
    };
    getDetailProfile();
  }, [idCustomer, pathname]);
  // const initFunction = useCallback(async () => {
  //   if (!mount.current) {
  //     mount.current = true;
  //   }
  // }, [mount]);

  // useEffect(() => {
  //   initFunction();
  // }, [initFunction, pathname]);
  const items = [
    {
      label: 'Hồ sơ',
      key: '1',
      children:
        checkPermission('MANAGE_CUSTOMER_INFO') & (tabName === 'TeethProfile') ? (
          <Profile data={data} idCustomer={idCustomer} checkPermission={checkPermission} />
        ) : (
          <></>
        ),
    },
    {
      label: 'Khám tổng quát',
      key: '8',
      children:
        tabName === 'CustomerExamination' ? (
          <CustomerExamination
            user={data}
            cusName={data?.fullName}
            idCustomer={idCustomer}
            checkPermission={checkPermission}
          ></CustomerExamination>
        ) : (
          <></>
        ),
    },
    {
      label: 'Tình trạng răng',
      key: '2',
      children:
        tabName === 'TeethStatus' ? (
          <TeethStatus user={data} cusName={data?.fullName} checkPermission={checkPermission}></TeethStatus>
        ) : (
          <></>
        ),
    },
    {
      label: 'Phiếu điều trị',
      key: '3',
      children:
        checkPermission('MANAGE_CUSTOMER_SO') & (tabName === 'TreatmentSlip') ? (
          <TreatmentSlip
            searchParams={searchParams}
            data={data}
            cusName={data?.fullName}
            idCustomer={idCustomer}
            checkPermission={checkPermission}
          ></TreatmentSlip>
        ) : (
          <></>
        ),
    },
    {
      label: 'Công nợ',
      key: '4',
      children: checkPermission('MANAGE_CUSTOMER_DEBT') & (tabName === 'Debt') ? <Dept data={data} /> : <></>,
    },
    {
      label: 'Labo',
      key: '5',
      children:
        checkPermission('MANAGE_CUSTOMER_LABO') & (tabName === 'Labo') ? (
          <Labo searchParams={searchParams} data={data} cusName={data?.fullName} idCustomer={idCustomer} />
        ) : (
          <></>
        ),
    },
    {
      label: 'Lịch hẹn',
      key: '6',
      children:
        checkPermission('MANAGE_CUSTOMER_CALENDAR') & (tabName === 'Calendar') ? <Calendar data={data} /> : <></>,
    },
    {
      label: 'Bảo hành',
      key: '7',
      children:
        checkPermission('MANAGE_CUSTOMER_WARRANTY') & (tabName === 'Guarantee') ? <Guarantee data={data} /> : <></>,
    },
  ];
  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="bg-white rounded-[10px] p-4 customer-detail">
          <div>
            <Breadcrumb>
              <Breadcrumb.Item href="">
                <i className="las la-home text-blue-500"></i>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/customer')}>
                  Khách hàng
                </span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{`${data?.fullName} (${data?.code})`}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <Tabs
              defaultActiveKey={convertKeyTab}
              onTabClick={callbackTabClicked}
              activeKey={convertKeyTab(tabName) || 1}
            >
              {/* {checkPermission('MANAGE_CUSTOMER_INFO') ? (
                <Tabs.TabPane tab="Hồ sơ" key="1">
                  {tabName === 'TeethProfile' ? (
                    <Profile data={data} idCustomer={idCustomer} checkPermission={checkPermission} />
                  ) : (
                    <></>
                  )}
                </Tabs.TabPane>
              ) : null}

              <Tabs.TabPane tab="Khám tổng quát" key="8">
                {tabName === 'CustomerExamination' ? (
                  <CustomerExamination
                    user={data}
                    cusName={data?.fullName}
                    idCustomer={idCustomer}
                    checkPermission={checkPermission}
                  ></CustomerExamination>
                ) : (
                  <></>
                )}
              </Tabs.TabPane>

              <Tabs.TabPane tab="Tình trạng răng" key="2">
                {tabName === 'TeethStatus' ? (
                  <TeethStatus user={data} cusName={data?.fullName} checkPermission={checkPermission}></TeethStatus>
                ) : (
                  <></>
                )}
              </Tabs.TabPane>
              {checkPermission('MANAGE_CUSTOMER_SO') ? (
                <Tabs.TabPane tab="Phiếu điều trị" key="3">
                  {tabName === 'TreatmentSlip' ? (
                    <TreatmentSlip
                      searchParams={searchParams}
                      data={data}
                      cusName={data?.fullName}
                      idCustomer={idCustomer}
                      checkPermission={checkPermission}
                    ></TreatmentSlip>
                  ) : (
                    <></>
                  )}
                </Tabs.TabPane>
              ) : null}

              {checkPermission('MANAGE_CUSTOMER_DEBT') ? (
                <Tabs.TabPane tab="Công nợ" key="4">
                  {tabName === 'Debt' ? <Dept data={data} /> : <></>}
                </Tabs.TabPane>
              ) : null}

              {checkPermission('MANAGE_CUSTOMER_LABO') ? (
                <Tabs.TabPane tab="Labo" key="5">
                  {tabName === 'Labo' ? (
                    <Labo searchParams={searchParams} data={data} cusName={data?.fullName} idCustomer={idCustomer} />
                  ) : (
                    <></>
                  )}
                </Tabs.TabPane>
              ) : null}
              {checkPermission('MANAGE_CUSTOMER_CALENDAR') ? (
                <Tabs.TabPane tab="Lịch hẹn" key="6">
                  {tabName === 'Calendar' ? <Calendar data={data} /> : <></>}
                </Tabs.TabPane>
              ) : null}
              {checkPermission('MANAGE_CUSTOMER_WARRANTY') ? (
                <Tabs.TabPane tab="Bảo hành" key="7">
                  {tabName === 'Guarantee' ? <Guarantee data={data} /> : <></>}
                </Tabs.TabPane>
              ) : null} */}
              <Tabs activeKey={data} onChange={setData} items={items}></Tabs>
            </Tabs>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
