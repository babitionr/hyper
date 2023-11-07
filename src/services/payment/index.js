import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const PaymentService = {
  nameLink: 'Payment',
  getListPaymentByTreatmentSlipHistory: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(PaymentService.nameLink, 'api')}/`, {
        params,
      });

      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return [];
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(PaymentService.nameLink, 'api')}`, values);
      // if (data.message) Message.success({ text: 'Tạo chi nhánh thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListServiceToPayment: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(PaymentService.nameLink, 'api')}/get-service-to-payment`, {
        params,
      });

      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return [];
    }
  },
};
