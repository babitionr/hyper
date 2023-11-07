import moment from 'moment';
import unorm from 'unorm';
import { formatCurrency } from 'utils';
import { useEffect, useState } from 'react';
import { fortmatType } from './constants';

export const isNullOrUndefinedOrEmpty = (value) => value === undefined || value === null || value === '';

export const blockInvalidChar = (e) =>
  ![
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'Backspace',
    'Delete',
    ',',
    '.',
    'ArrowRight',
    'ArrowLeft',
    'Tab',
  ].includes(e.key) && e.preventDefault();

export const formatDate = (date, formatType = 'DD-MM-YYYY') => {
  if (!date) return null;
  return moment(date).format(formatType);
};

export const formatPrice = (value) => {
  if (!value) return 0;
  return value || value === 0 ? formatCurrency(value, ' ') : null;
};

export const formatPercent = (value) => {
  if (!value) return null;
  return `${value}%`;
};

export const convertTextToCode = (value) => {
  if (!value) return null;
  return unorm
    .nfd(value)
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/ả|ã|á|ạ|ă|ắ|ẳ|ẵ|ặ|â|ấ|ẩ|ẫ|ậ/g, 'a')
    .replace(/ẻ|ẽ|é|ẹ|ê|ế|ể|ễ|ệ/g, 'e')
    .replace(/ỉ|ĩ|í|ị/g, 'i')
    .replace(/ỏ|õ|ó|ọ|ô|ố|ổ|ỗ|ộ|ơ|ớ|ở|ỡ|ợ/g, 'o')
    .replace(/ủ|ũ|ú|ụ|ư|ứ|ử|ữ|ự/g, 'u')
    .replace(/ỷ|ỹ|ý|ỵ/g, 'y')
    .toUpperCase();
};
export const convertTextToCodeAny = (value) => {
  if (!value) return null;
  return unorm
    .nfd(value)
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/ả|ã|á|ạ|ă|ắ|ẳ|ẵ|ặ|â|ấ|ẩ|ẫ|ậ/g, 'a')
    .replace(/ẻ|ẽ|é|ẹ|ê|ế|ể|ễ|ệ/g, 'e')
    .replace(/ỉ|ĩ|í|ị/g, 'i')
    .replace(/ỏ|õ|ó|ọ|ô|ố|ổ|ỗ|ộ|ơ|ớ|ở|ỡ|ợ/g, 'o')
    .replace(/ủ|ũ|ú|ụ|ư|ứ|ử|ữ|ự/g, 'u')
    .replace(/ỷ|ỹ|ý|ỵ/g, 'y');
};

export const useFetch = ({ apiFunction, params = {}, condition = true, values }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { options } = params;
  const { value } = values;
  useEffect(() => {
    let flag = true;
    async function fetchData() {
      setLoading(true);
      if (!params) return;
      try {
        const result = await apiFunction(options);
        flag && setData(result?.data ?? []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    condition && fetchData();
    return () => {
      flag = false;
    };
  }, [value]);

  return { loading, data };
};
export const typeOf = (value) => Object.prototype.toString.call(value).slice(8, -1);

export const convertUtcTimeToLocalTime = (dateM, formatType = fortmatType.formatDateTime) => {
  if (!dateM) return null;
  return moment(dateM).add(7, 'hours').format(formatType);
};

export default function useDebounce(initializeValue = '', delay = 1000) {
  const [debounceValue, setDebounceValue] = useState(initializeValue);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(initializeValue);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [delay, initializeValue]);
  return debounceValue;
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
