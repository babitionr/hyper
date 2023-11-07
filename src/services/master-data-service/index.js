import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
import { toast } from 'react-toastify';
const branchUuid = localStorage.getItem('branchUuid');

export const MasterDataService = {
  nameLink: 'MasterDataService',
  getAllServiceCategory: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(MasterDataService.nameLink, 'api')}/service-category`, {
        params: { ...params, branchUuid },
      });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message)
        toast.error(e.response.data.message, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
        });
      return [];
    }
  },
  getAllService: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(MasterDataService.nameLink, 'api')}/service/get-all`, {
        params: { ...params, branchUuid },
      });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  getServiceByCategory: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(MasterDataService.nameLink, 'api')}/service`, {
        params: { ...params, branchUuid },
      });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  getDetailService: async (uuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(MasterDataService.nameLink, 'api')}/service/${uuid}`);
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  getDetailGroupService: async (uuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(MasterDataService.nameLink, 'api')}/service-category/${uuid}`);
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  postAllServiceCategory: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(MasterDataService.nameLink, 'api')}/service-category`, {
        ...params,
        branchUuid,
      });
      // if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return false;
    }
  },
  postService: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(MasterDataService.nameLink, 'api')}/service`, params);
      // if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  deleteService: async (uuid) => {
    try {
      await axios.delete(`${routerLinks(MasterDataService.nameLink, 'api')}/service/${uuid}`);
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Xóa dữ liệu thất bại.' });
      return false;
    }
  },
  activeService: async (uuid) => {
    try {
      await axios.put(`${routerLinks(MasterDataService.nameLink, 'api')}/service/activate-or-deactivate/${uuid}`);
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
