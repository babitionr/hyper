import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const RevenueSettingService = {
  nameLink: 'RevenueSetting',
  get: async (OrganizationUuid) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(RevenueSettingService.nameLink, 'api')}/get-all-revenue-item/${OrganizationUuid}`,
        {},
      );
      return {
        data: data?.data || [],
        count: data?.data?.totalElements,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getByOrganizationUuid: async (organizationUuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(RevenueSettingService.nameLink, 'api')}/${organizationUuid}`);
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
      const { data } = await axios.post(`${routerLinks(RevenueSettingService.nameLink, 'api')}`, values);
      if (data.message)
        // Message.success({ text: 'Tạoloại chi phí thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
