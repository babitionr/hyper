import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
import { toast } from 'react-toastify';

export const ReportService = {
  nameLink: 'Report',
  getListRevenueByGroupService: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ReportService.nameLink, 'api')}/list-revenue-by-group-service`, {
        params,
      });
      return {
        data: data?.data?.items || [],
        count: data?.data?.total,
      };
      // ?.filter(i => i?.amount > 0)
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListRevenueByGroupCustomer: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ReportService.nameLink, 'api')}/list-revenue-by-group-customer`, {
        params,
      });
      return {
        data: data?.data?.items || [],
        count: data?.data?.total,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getDataRevenue: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ReportService.nameLink, 'api')}/date-revenue`, {
        params,
      });
      return {
        data: data?.data,
      };
    } catch (e) {
      if (e.response.data.message)
        toast.error(`${e.response.data.message}`, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
        });
      return false;
    }
  },
  getReceiptList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ReportService.nameLink, 'api')}/list-doctor-revenue`, {
        params,
      });
      const convertData = data?.data;
      return {
        data: convertData || [],
        count: data?.data?.totalElements,
      };
    } catch (e) {
      if (e.response.data.message)
        toast.error(`${e.response.data.message}`, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
        });
      return false;
    }
  },
  getListExpenseRevenue: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ReportService.nameLink, 'api')}/list-expense-revenue`, {
        params,
      });
      const convertData = data?.data;
      return {
        data: convertData || [],
        count: data?.data?.totalElements,
      };
    } catch (e) {
      if (e.response.data.message)
        toast.error(`${e.response.data.message}`, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
        });
      return false;
    }
  },
  getDetailRecept: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ReportService.nameLink, 'api')}/receipt-detail-list`, {
        params,
      });
      return data?.data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getDetailPayment: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ReportService.nameLink, 'api')}/payment-detail-list`, {
        params,
      });
      return data?.data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  expectedRevenueReport: async (params, organizationUuid) => {
    try {
      const { data } = await axios.post(
        `${routerLinks(ReportService.nameLink, 'api')}/${organizationUuid}/expected-revenue-report`,
        params,
      );
      console.log('data: ', data);
      return {
        data: data?.data || [],
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  listRevenueByBranch: async (params, organizationUuid) => {
    try {
      const { data } = await axios.post(
        `${routerLinks(ReportService.nameLink, 'api')}/${organizationUuid}/list-revenue-by-branch`,
        params,
      );
      return {
        data: data?.data ?? [],
        count: data?.data?.length ?? 0,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  overviewReport: async (params, organizationUuid) => {
    try {
      const { data } = await axios.post(
        `${routerLinks(ReportService.nameLink, 'api')}/${organizationUuid}/overview-report`,
        params,
      );
      return {
        data: data?.data ?? [],
        count: data?.data?.length ?? 0,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  resultBusinessReport: async (params, organizationUuid) => {
    try {
      const { data } = await axios.post(
        `${routerLinks(ReportService.nameLink, 'api')}/${organizationUuid}/result-business-report`,
        params,
      );
      return {
        data: data?.data ?? [],
        count: data?.data?.length ?? 0,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getResultBusinessReport: async (params) => {
    try {
      const organizationUuid = localStorage.getItem('keyOrganizationUuid') || '6ae98b31-fafe-45ac-98fa-cac81fa2aab6';
      const { data } = await axios.post(
        `${routerLinks(ReportService.nameLink, 'api')}/${organizationUuid}/result-business-report`,
        params,
      );
      return data?.data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getAppointmentScheduleReportOverview: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ReportService.nameLink, 'api')}/schedule-overview`, { params });
      console.log(data);
      return data?.data ?? {};
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getAppointmentScheduleReport: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ReportService.nameLink, 'api')}/schedule-list`, { params });
      console.log(data);
      return data?.data ?? [];
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getServiceHistory: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ReportService.nameLink, 'api')}/service-history`, { params });
      console.log(data);
      return data?.data ?? [];
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
