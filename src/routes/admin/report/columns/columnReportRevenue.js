// import { formatPrice } from "utils/func";
import React from 'react';
import classNames from 'classnames';

export const columnReportRevenue = ({ columnName }) => {
  const convertToColumn = columnName.map((e) => ({
    title: e,
    name: e,
    tableItem: {
      className: 'text-center whitespace-pre-line',
      width: 200,
      align: 'right',
      onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
      render: (text, record) => {
        return (
          <>
            <div>{Number(text ?? 0).toLocaleString('de-DE') + ' VND'} </div>
          </>
        );
      },
    },
  }));

  return [
    {
      title: <div className="pl-6">Chỉ tiêu</div>,
      name: 'name',

      tableItem: {
        width: 300,
        fixed: 'left',
        render: (value, record) => {
          return (
            <span
              className={classNames('', {
                ' font-bold': [
                  'Tổng thực thu, chi tiết:',
                  'Tổng thực chi',
                  'Lợi nhuận thu chi',
                  'Kết quả kinh doanh',
                ].includes(record.name),
              })}
            >
              {['Tổng thực thu, chi tiết:', 'Tổng thực chi', 'Lợi nhuận thu chi'].includes(record.name)
                ? value.toUpperCase()
                : value}
            </span>
          );
        },
      },
    },
    ...convertToColumn,
  ];
};
