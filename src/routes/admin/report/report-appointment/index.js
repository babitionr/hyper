import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { ReportService } from 'services/report';
import moment from 'moment';
import { useAuth } from 'global';
import { ReportAppointmentForDoctor } from '../tabs/report-appointment-for-doctor';
import { ReportAppointmentForSales } from '../tabs/report-appointment-for-sales';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
const Page = ({ type }) => {
  const { branchUuid } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabName = searchParams.get('tab') ?? 'doctor';

  const [filter, setFilter] = useState({
    fromDate: moment().startOf('months').format('YYYY-MM-DD 00:00:00'),
    toDate: moment().endOf('months').format('YYYY-MM-DD 23:59:59'),
  });

  const [appointmentScheduleReportOverview, setAppointmentScheduleReportOverview] = useState({});

  const getAppointmentScheduleReportOverview = async () => {
    try {
      const res = await ReportService.getAppointmentScheduleReportOverview({
        fromDate: filter.fromDate,
        toDate: filter.toDate,
        branchUuid,
      });
      setAppointmentScheduleReportOverview(res ?? {});
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const init = async () => {
    await getAppointmentScheduleReportOverview();
  };
  useEffect(() => {
    init();
  }, [
    filter.fromDate,
    filter.toDate,
    // location.pathname,
  ]);

  const handleChangeTab = (key, event) => {
    if (!key) return null;
    return navigate(routerLinks('ReportAppointment') + `?tab=${key}`);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white p-4 rounded-lg pb-6">
        <h2 className="font-bold text-lg text-zinc-600">BÁO CÁO LỊCH HẸN</h2>
        <Tabs onChange={handleChangeTab} activeKey={String(tabName)}>
          <Tabs.TabPane tab="Thống kê theo bác sĩ" key="doctor">
            <ReportAppointmentForDoctor
              appointmentScheduleReportOverview={appointmentScheduleReportOverview}
              filter={filter}
              setFilter={setFilter}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Thống kê theo nhân viên Sales" key="sales">
            <ReportAppointmentForSales
              appointmentScheduleReportOverview={appointmentScheduleReportOverview}
              filter={filter}
              setFilter={setFilter}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
