import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const PromotionService = {
  nameLink: 'Promotion',
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(PromotionService.nameLink, 'api')}`, {
        params,
      });

      return {
        data: data?.data?.content || [],
        count: data?.data?.totalElements ?? 0,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return [];
    }
  },
  getListForService: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(PromotionService.nameLink, 'api')}/get-for-service`, {
        params,
      });
      return [...(data?.data ?? [])];
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return [];
    }
  },
  getDetail: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(PromotionService.nameLink, 'api')}/detail/`, {
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
      const { data } = await axios.post(`${routerLinks(PromotionService.nameLink, 'api')}`, values);
      if (data.message)
        Message.success({ text: 'Tạo mã khuyến mãi thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  activePromotion: async (uuid) => {
    try {
      const { data } = await axios.put(`${routerLinks(PromotionService.nameLink, 'api')}/active?uuid=${uuid}`);
      if (data.message) return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  delete: async (uuid) => {
    try {
      const { data } = await axios.put(`${routerLinks(PromotionService.nameLink, 'api')}/delete?uuid=${uuid}`);
      if (data.message)
        await Message.success({ text: 'Xóa mã khuyến mãi thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
