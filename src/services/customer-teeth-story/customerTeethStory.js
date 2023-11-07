import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const CustomerTeethStoryService = {
  nameLink: 'CustomerTeethStory',
  getListTeethStory: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerTeethStoryService.nameLink, 'api')}/`, { params });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
  getListTeethStoryByCustomer: async (params, customerUuid) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(CustomerTeethStoryService.nameLink, 'api')}/?customerUuid=${customerUuid}`,
        { params },
      );
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  postService: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(CustomerTeethStoryService.nameLink, 'api')}`, params);
      // if (data.message)
      //  Message.success({ text: 'data.message', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.error(e);
      if (e?.response?.data?.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  getListTeethStoryDetail: async (uuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerTeethStoryService.nameLink, 'api')}/${uuid}`);
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  deleteTeethStory: async (params) => {
    try {
      await axios.put(`${routerLinks(CustomerTeethStoryService.nameLink, 'api')}/delete/${params}`);
      // if (data.message) Message.success({ text: data.message, title: 'Xóa Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Xóa thông tin khách hàng thất bại.' });
      return false;
    }
  },
};
