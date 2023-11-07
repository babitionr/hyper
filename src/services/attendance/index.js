import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const AttendanceService = {
  nameLink: 'TimeKeeping',
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(AttendanceService.nameLink, 'api')}`, {
        params,
      });
      return {
        data: data?.data || [],
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getAll: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(AttendanceService.nameLink, 'api')}/get-all`, {
        params,
      });
      return {
        data: data?.data || [],
        count: data?.data?.totalElements ?? 17,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(AttendanceService.nameLink, 'api')}/${id}`);
      return {
        ...data?.data,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(AttendanceService.nameLink, 'api')}`, values);
      if (data.message)
        // Message.success({ text: 'Chấm công thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  monthTimekeeping: async (values) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(AttendanceService.nameLink, 'api')}/full-month-time-keeping`,
        values,
      );
      if (data.message)
        Message.success({ text: 'Chấm công tháng thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  delete: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks(AttendanceService.nameLink, 'api')}/delete?uuid=${params}`);
      if (data.message)
        Message.success({ text: 'Xóa loại chi phí thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
