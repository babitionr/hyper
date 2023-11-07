import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
// import moment from 'moment';

export const CustomerExaminationService = {
  nameLink: 'CustomerExamination',
  create: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(CustomerExaminationService.nameLink, 'api')}/`, params);
      if (data.message)
        Message.success({
          text: 'Lưu thông tin khám tổng quát thành công',
          title: 'Thành Công',
          cancelButtonText: 'Đóng',
        });
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getDetail: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerExaminationService.nameLink, 'api')}/`, { params });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Sửa thông tin khách hàng thất bại.' });
      return {};
    }
  },
};
