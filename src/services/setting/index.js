import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
import { toast } from 'react-toastify';

export const SettingService = {
  nameLink: 'Role',
  get: async () => {
    try {
      const { data } = await axios.get(`${routerLinks(SettingService.nameLink, 'api')}/all`);

      return {
        data: data?.data || [],
        count: data?.pagination?.total ?? 14,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return [];
    }
  },
  getById: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SettingService.nameLink, 'api')}/detail`, {
        params,
      });
      return {
        ...data?.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(SettingService.nameLink, 'api')}/create`, values);
      if (data.message)
        Message.success({ text: 'Tạo vai trò thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values, id) => {
    try {
      const { data } = await axios.put(`${routerLinks(SettingService.nameLink, 'api')}/update`, values);
      if (data.message)
        toast.success('Cập nhật chức năng thành công.', {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
        });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message)
        toast.error(e.response.data.message, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
        });
      return false;
    }
  },
  delete: async (values) => {
    try {
      const { data } = await axios.delete(`${routerLinks(SettingService.nameLink, 'api')}/delete`, { data: values });
      if (data.message)
        Message.success({ text: 'Xóa vai trò thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  getListProvices: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Master', 'api')}/province/all`, {
        params,
      });

      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListDistricts: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Master', 'api')}/district/all`, {
        params,
      });
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListWards: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Master', 'api')}/ward/all`, {
        params,
      });
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getFeaturesAll: async () => {
    try {
      const { data } = await axios.get(`${routerLinks('Master', 'api')}/feature/all`);
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
