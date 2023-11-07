import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
// import moment from 'moment';

export const CustomerCareService = {
  nameLink: 'CustomerCare',
  getPotentialList: async (params, branchUuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerCareService.nameLink, 'api')}/${branchUuid}/potential`, {
        params,
      });
      return data?.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
  getRemindCalendarList: async (params, branchUuid) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(CustomerCareService.nameLink, 'api')}/${branchUuid}/remind-calendar`,
        { params },
      );
      return data?.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
  getLateCalendarList: async (params, branchUuid) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(CustomerCareService.nameLink, 'api')}/${branchUuid}/late-calendar`,
        { params },
      );
      return data?.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
  getAfterTreatmentList: async (params, branchUuid) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(CustomerCareService.nameLink, 'api')}/${branchUuid}/after-treatment`,
        { params },
      );
      return data?.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
  getBirthdayList: async (params, branchUuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerCareService.nameLink, 'api')}/${branchUuid}/birth-day`, {
        params,
      });
      return data?.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
  create: async (params, branchUuid) => {
    try {
      const { data } = await axios.post(
        `${routerLinks(CustomerCareService.nameLink, 'api')}/${branchUuid}/create`,
        params,
      );
      if (data.message)
        Message.success({ text: 'Tạo chăm sóc khách hàng thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  update: async (params, branchUuid) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(CustomerCareService.nameLink, 'api')}/${branchUuid}/update`,
        params,
      );
      if (data.message)
        Message.success({
          text: 'Lưu thông tin chăm sóc khách hàng thành công',
          title: 'Thành Công',
          cancelButtonText: 'Đóng',
        });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getDetail: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerCareService.nameLink, 'api')}/`, { params });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Sửa thông tin khách hàng thất bại.' });
      return {};
    }
  },
};
