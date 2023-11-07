import axios from 'axios';

import { routerLinks } from 'utils';
import { Message } from 'components';

export const ImportDataService = {
  nameLink: 'ImportData',
  importService: async (file, branchUuid) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      const { data } = await axios.post(
        `${routerLinks('MasterDataService', 'api')}/service/${branchUuid}/upload`,
        bodyFormData,
      );

      return data?.statusCode;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  importMedicineOrMaterial: async (file, type, branchUuid) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      const { data } = await axios.post(
        `${routerLinks('MasterDataService', 'api')}/product-item/${branchUuid}/upload`,
        bodyFormData,
        { params: { type } },
      );

      return data?.statusCode;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
