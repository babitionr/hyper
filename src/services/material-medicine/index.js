import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const MaterialMedicineService = {
  nameLink: 'MaterialMedicine',
  getList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(MaterialMedicineService.nameLink, 'api')}/`, { params });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  post: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(MaterialMedicineService.nameLink, 'api')}/`, params);
      // if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  getDetail: async (uuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(MaterialMedicineService.nameLink, 'api')}/${uuid}`);
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  getAll: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(MaterialMedicineService.nameLink, 'api')}/get-all-by-type`, {
        params,
      });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  getAllGroup: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(MaterialMedicineService.nameLink, 'api')}/all-group-category`, {
        params,
      });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  delete: async (uuid) => {
    try {
      await axios.delete(`${routerLinks(MaterialMedicineService.nameLink, 'api')}/${uuid}`);
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Xóa dữ liệu thất bại.' });
      return false;
    }
  },
  activeMaterialMedicine: async (uuid) => {
    try {
      await axios.put(`${routerLinks(MaterialMedicineService.nameLink, 'api')}/activate-or-deactivate/${uuid}`);
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
