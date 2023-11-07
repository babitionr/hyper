import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale/vi_VN';
import enUS from 'antd/lib/locale/en_US';
import moment from 'moment';
import 'moment/locale/vi';
import { keyMenu, keyRefreshToken, keyToken, keyUser, keyRole } from 'variable';
import { NotificationService } from 'services/notification';
import { fetchFirebaseToken } from 'firebaseInit';

export const AuthContext = React.createContext({
  user: {},
  permission: {},
  menu: [],
  title: '',
  formatDate: 'YYYY-MM-DD',
  setTitlePage: () => {},
  login: () => {},
  logout: () => {},
  changeLanguage: () => {},
  changePermission: () => {},
  set_menu: () => {},
  branchUuid: '',
  setBranchUuid: () => {},
  openNotifiMenu: false,
  changeNotifiMenu: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

const Global = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(keyUser)));
  const [title, setTitle] = useState('');
  const [locale, set_locale] = useState();
  const [permission, set_permission] = useState({});
  const [formatDate, set_formatDate] = useState('YYYY-MM-DD');
  const { t, i18n } = useTranslation();
  const [menu, set_menu] = useState(JSON.parse(localStorage.getItem(keyMenu)));
  const [organizationUuid, set_organizationUuid] = useState(localStorage.getItem('keyOrganizationUuid') ?? '');
  const [branchUuid, setBranchUuid] = useState(localStorage.getItem('branchUuid'));

  const [openNotifiMenu, setOpenNotifiMenu] = useState(false);

  const changeNotifiMenu = (value) => {
    setOpenNotifiMenu(value);
  };

  const login = async (data) => {
    localStorage.setItem(keyUser, JSON.stringify(data));
    setUser(data);
    localStorage.setItem(keyToken, data.token);
    localStorage.setItem(keyRefreshToken, data.refreshToken);
    localStorage.setItem(keyRole, JSON.stringify(data.roles));

    if (data.featureDtos) {
      localStorage.setItem(keyMenu, JSON.stringify(data.featureDtos));
      set_menu(data.featureDtos);
    }
    if (data.organizationUuid) {
      localStorage.setItem('keyOrganizationUuid', data.organizationUuid);
      set_organizationUuid(data.organizationUuid);
    }
    if (data.featureDtos) {
      localStorage.setItem('featureDtos', JSON.stringify(data.featureDtos));
    }
    await fetchFirebaseToken();
    await NotificationService.saveToken({ token: localStorage.getItem('firebaseToken') });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(keyUser);
  };

  const setTitlePage = useCallback(
    (name) => {
      document.title = t(name);
      setTitle(name);
    },
    [t],
  );

  const changeLanguage = useCallback(
    (values) => {
      i18n.changeLanguage(values);
      axios.defaults.headers.common['X-localization'] = values;
      moment.locale(values);
      switch (values) {
        case 'vi':
          set_locale(viVN);
          set_formatDate('DD-MM-YYYY');
          break;
        default:
          set_locale(enUS);
          set_formatDate('DD-MM-YYYY');
      }
    },
    [i18n],
  );

  const changePermission = (value) => {
    console.log(value);
    set_permission(value);
  };

  const clearTempLocalStorage = () => {
    const arr = [];
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).indexOf('temp-') === 0) {
        arr.push(localStorage.key(i));
      }
    }
    for (let i = 0; i < arr.length; i++) {
      localStorage.removeItem(arr[i]);
    }
  };

  useEffect(() => {
    changeLanguage(localStorage.getItem('i18nextLng'));
    clearTempLocalStorage();
    const token = localStorage.getItem(keyToken);
    if (token) {
      axios.defaults.headers.common.Authorization = 'Bearer ' + token;
    }
  }, [user, changeLanguage]);

  useEffect(() => {
    localStorage.setItem('branchUuid', branchUuid);
  }, [branchUuid]);

  return (
    <AuthContext.Provider
      value={{
        user,
        permission,
        title,
        formatDate,
        setTitlePage,
        login,
        logout,
        changeLanguage,
        changePermission,
        menu,
        set_menu,
        organizationUuid,
        branchUuid,
        setBranchUuid,
        openNotifiMenu,
        changeNotifiMenu,
      }}
    >
      <ConfigProvider locale={locale}>{children}</ConfigProvider>
    </AuthContext.Provider>
  );
};
export default Global;
