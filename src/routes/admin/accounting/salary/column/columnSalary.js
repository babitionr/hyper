import classNames from 'classnames';
import React from 'react';
import { formatPrice } from 'utils/func';

export const ColumnSalary = () => {
  return [
    {
      title: 'Tên mục',
      name: 'name',
      tableItem: {
        render: (value, record, index) => {
          return (
            <div
              className={classNames('', {
                'text-red-600': record?.name === 'Phạt',
                'font-semibold': record?.isColor,
              })}
            >
              {value}
            </div>
          );
        },
      },
    },
    {
      title: 'Sô tiền (VND)',
      name: 'value',
      tableItem: {
        render: (value, record, index) => {
          return (
            <div
              className={classNames('', {
                'text-red-600': record?.name === 'Phạt',
                'font-semibold': record?.isColor,
              })}
            >
              {formatPrice(value)}
            </div>
          );
        },
      },
    },
  ];
};
