import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const CalendarService = {
  nameLink: 'Calendar',
  get: async (params, branchUuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(CalendarService.nameLink, 'api')}/${branchUuid}/calendar/list`, {
        params,
      });
      return {
        data: data?.data?.content || [],
        count: data?.data?.totalElements ?? 14,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListDoctor: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('UserPosition', 'api')}/all`, {
        params,
      });
      return {
        data: data?.data || [],
        // count: data?.pagination?.total
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getAllService: async (branchUuid) => {
    try {
      const { data } = await axios.get(`${routerLinks('Master', 'api')}/${branchUuid}/service/all`);
      return {
        data: data?.data || [],
        // count: data?.pagination?.total
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getUserByPosition: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('UserManagement', 'api')}/position/all`, {
        params,
      });
      return {
        data: data?.data || [],
        // count: data?.pagination?.total
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListCustomer: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Customer', 'api')}`, {
        params,
      });
      return {
        data: data?.data?.content || [],
        // count: data?.pagination?.total
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getById: async (params, branchUuid) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(CalendarService.nameLink, 'api')}/${branchUuid}/calendar/detail`,
        {
          params,
        },
      );
      return {
        ...data?.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values, branchUuid) => {
    try {
      const { data } = await axios.post(
        `${routerLinks(CalendarService.nameLink, 'api')}/${branchUuid}/calendar/create`,
        values,
      );
      if (data.message)
        Message.success({ text: 'Thêm mới lịch hẹn thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values, branchUuid) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(CalendarService.nameLink, 'api')}/${branchUuid}/calendar/update`,
        values,
      );
      if (data.message)
        Message.success({ text: 'Chỉnh sửa lịch hẹn thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  delete: async (id, branchUuid) => {
    try {
      const { data } = await axios.delete(
        `${routerLinks(CalendarService.nameLink, 'api')}/${branchUuid}/calendar/${id}`,
      );
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  deleteCalendar: async (id, branchUuid) => {
    try {
      const { data } = await axios.delete(
        `${routerLinks(CalendarService.nameLink, 'api')}/${branchUuid}/calendar/delete/${id}`,
      );
      console.log(data);
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message || e?.message) Message.error({ text: e?.response?.data?.message ?? e?.message });
      return false;
    }
  },
};
