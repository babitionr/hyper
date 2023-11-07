import { Breadcrumb, Tabs } from 'antd';
import React, { Fragment, useEffect } from 'react';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import MarketingContent from './content/marketingContent';
import MarketingDesign from './design/marketingDesign';
import MarketingSeo from './seo/marketingSeo';
import MarketingChatpage from './chatpage/marketingChatpage';
import MarketingTelesales from './telesales/marketingTelesales';
// import { CustomerService } from 'services/customer';
// import { TeethStatus } from './teethStatus/teethStatus';

// const Profile = React.lazy(() => import('./profile'));
// const Dept = React.lazy(() => import('./debt'));
// const Labo = React.lazy(() => import('./labo'));
// const Calendar = React.lazy(() => import('./calendar'));

const Page = () => {
  const [searchParams] = useSearchParams();
  const tabName = searchParams.get('tab');
  const navigate = useNavigate();
  const idMarketingDetail = searchParams.get('id');

  const callbackTabClicked = (key, event) => {
    switch (Number(key)) {
      case 1:
        navigate({
          search: createSearchParams({
            id: idMarketingDetail,
            tab: 'Content',
          }).toString(),
        });
        break;
      case 2:
        navigate({
          search: createSearchParams({
            id: idMarketingDetail,
            tab: 'Design',
          }).toString(),
        });
        break;
      case 3:
        navigate({
          search: createSearchParams({
            id: idMarketingDetail,
            tab: 'SEO',
          }).toString(),
        });
        break;
      case 4:
        navigate({
          search: createSearchParams({
            id: idMarketingDetail,
            tab: 'Chatpage',
          }).toString(),
        });
        break;
      case 5:
        navigate({
          search: createSearchParams({
            id: idMarketingDetail,
            tab: 'Telesales',
          }).toString(),
        });
        break;
    }
  };
  const convertKeyTab = (tabName) => {
    switch (tabName) {
      case 'Content':
        return '1';
      case 'Design':
        return '2';
      case 'SEO':
        return '3';
      case 'Chatpage':
        return '4';
      case 'Telesales':
        return '5';
    }
  };
  // const { t } = useTranslation();
  // const mount = useRef(false);
  // changePermission permission

  useEffect(() => {
    // console.log(tabName);
  }, [tabName]);

  // const { pathname } = useLocation();

  // useEffect(() => {
  //   const getDetailProfile = async () => {

  //   };
  //   getDetailProfile();
  // }, [ pathname]);
  // const initFunction = useCallback(async () => {
  //   if (!mount.current) {
  //     mount.current = true;
  //   }
  // }, [mount]);

  // useEffect(() => {
  //   initFunction();
  // }, [initFunction, pathname]);

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
                <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/marketing')}>
                  Marketing
                </span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{`Chiến dịch số ${idMarketingDetail}`}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div>
            <Tabs
              defaultActiveKey={convertKeyTab}
              onTabClick={callbackTabClicked}
              activeKey={convertKeyTab(tabName) || 1}
            >
              <Tabs.TabPane tab="Content" key="1">
                {tabName === 'Content' ? <MarketingContent /> : <></>}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Design" key="2">
                {tabName === 'Design' ? <MarketingDesign></MarketingDesign> : <></>}
              </Tabs.TabPane>
              <Tabs.TabPane tab="SEO" key="3">
                {tabName === 'SEO' ? <MarketingSeo></MarketingSeo> : <></>}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Chatpage" key="4">
                {tabName === 'Chatpage' ? <MarketingChatpage></MarketingChatpage> : <></>}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Telesales" key="5">
                {tabName === 'Telesales' ? <MarketingTelesales></MarketingTelesales> : <></>}
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Page;
