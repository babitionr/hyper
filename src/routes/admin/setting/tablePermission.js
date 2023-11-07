import { Checkbox, Table } from 'antd';
import React from 'react';

const TableFunction = ({ dataTable, roleDetail }) => {
  const dataTemp = [
    {
      id: 22,
      code: 'MANAGE_CUSTOMER',
      name: 'Quản lý khách hàng',
      description: 'Quản lý khách hàng',
      group: 'CUSTOMER',
      groupName: 'Quản lý khách hàng',
      add: false,
      edit: false,
      delete: false,
      export: false,
    },
    {
      id: 23,
      code: 'MANAGE_STAFF',
      name: 'Quản lý nhân viên',
      description: 'Quản lý nhân viên',
      group: 'STAFF',
      groupName: 'Quản lý nhân viên',
      add: true,
      edit: true,
      delete: true,
      export: true,
    },
    {
      id: 234,
      code: 'MANAGE_STAF',
      name: 'Lúa',
      description: 'Lúa',
      group: 'LUA',
      groupName: 'Quản lý nhân viên',
      add: true,
      edit: true,
      delete: true,
      export: true,
    },
    {
      id: 234,
      code: 'MANAGE_S',
      name: 'Lúa mì',
      description: 'Lúa mì',
      group: 'LUAMI',
      groupName: 'Quản lý nhân viên',
      add: true,
      edit: true,
      delete: true,
      export: true,
    },
    {
      id: 24,
      code: 'MANAGE_CALENDAR',
      name: 'Quản lý lịch hẹn',
      description: 'Quản lý lịch hẹn',
      group: 'CALENDAR',
      groupName: 'Quản lý lịch hẹn',
      add: true,
      edit: true,
      delete: true,
      export: true,
    },
    {
      id: 25,
      code: 'MANAGE_LABO',
      name: 'Quản lý LABO',
      description: 'Quản lý LABO',
      group: 'LABO',
      groupName: 'Quản lý LABO',
      add: true,
      edit: true,
      delete: true,
      export: true,
    },
    {
      id: 26,
      code: 'MANAGE_WAREHOUSE',
      name: 'Quản lý kho',
      description: 'Quản lý kho',
      group: 'WAREHOUSE',
      groupName: 'Quản lý kho',
      add: true,
      edit: true,
      delete: true,
      export: true,
    },
    {
      id: 26,
      code: 'MANAGE_WAREHOUSE ưdad',
      name: 'Kiem kho',
      description: 'kiem kho',
      group: 'WAREHOUSEưda',
      groupName: 'Quản lý kho',
      add: true,
      edit: true,
      delete: true,
      export: true,
    },
    {
      id: 27,
      code: 'MANAGE_CATEGORY',
      name: 'Quản lý danh mục',
      description: 'Quản lý danh mục',
      group: 'CATEGORY',
      groupName: 'Quản lý danh mục',
      add: true,
      edit: true,
      delete: true,
      export: true,
    },
    {
      id: 28,
      code: 'MANAGE_FINANCE',
      name: 'Quản lý thu chi',
      description: 'Quản lý thu chi',
      group: 'FINANCE',
      groupName: 'Quản lý thu chi',
      add: true,
      edit: true,
      delete: true,
      export: true,
    },
    {
      id: 29,
      code: 'MANAGE_SETTING',
      name: 'Thiết lập ',
      description: 'Thiết lập',
      group: 'SETTING',
      groupName: 'Thiết lập',
      add: true,
      edit: true,
      delete: true,
      export: true,
    },
  ];
  const groupedData = {};
  dataTemp.forEach((item) => {
    if (!groupedData[item.groupName]) {
      groupedData[item.groupName] = {
        groupName: item.groupName,
        children: [],
      };
    }
    groupedData[item.groupName].children.push(item);
  });

  const groupedArray = Object.values(groupedData).map((i, idx) => ({
    ...i,
    children: [...i.children].length > 1 ? i.children : null,
    key: idx,
  }));
  console.log('groupedArray: ', groupedArray);

  // const expandedRowRender = (record) => {
  //   console.log('record: ', record);
  // const columns = [
  //   {
  //     title: '',
  //     dataIndex: 'name',
  //     key: 'name',
  //     render: (value, record, index) => {
  //       return <Checkbox>{record.name}</Checkbox>;
  //     },
  //   },
  //   {
  //     title: '',
  //     dataIndex: 'add',
  //     key: 'add',
  //     render: (value, record, index) => {
  //       return <Checkbox></Checkbox>;
  //     },
  //   },
  //   {
  //     title: '',
  //     key: 'edit',
  //     dataIndex: 'edit',
  //     render: (value, record, index) => {
  //       return <Checkbox></Checkbox>;
  //     },
  //   },
  //   {
  //     title: '',
  //     dataIndex: 'delete',
  //     key: 'delete',
  //     render: (value, record, index) => {
  //       return <Checkbox></Checkbox>;
  //     },
  //   },
  // ];

  // return <Table columns={columns} dataSource={record.chi} pagination={false} title={false} />;
  // };
  const columns = [
    {
      title: 'Chức năng',
      dataIndex: 'func',
      key: 'func',
      width: '50%',
      render: (value, record, index) => {
        return <Checkbox>{record.groupName}</Checkbox>;
      },
    },
    {
      title: 'Thêm',
      dataIndex: 'add',
      key: 'add',
      render: (value, record, index) => {
        return <Checkbox></Checkbox>;
      },
    },
    {
      title: 'Sửa',
      dataIndex: 'edit',
      key: 'edit',
      render: (value, record, index) => {
        return <Checkbox></Checkbox>;
      },
    },
    {
      title: 'Xóa',
      dataIndex: 'delete',
      key: 'delete',
      render: (value, record, index) => {
        return <Checkbox></Checkbox>;
      },
    },
    {
      title: 'Export',
      dataIndex: 'export',
      key: 'export',
      render: (value, record, index) => {
        return <Checkbox></Checkbox>;
      },
    },
  ];
  return (
    <>
      <Table
        columns={columns}
        // expandable={{
        //   expandedRowRender,
        //   // defaultExpandedRowKeys: ['0'],
        // }}
        dataSource={groupedArray}
        pagination={false}
      />
    </>
  );
};
export default TableFunction;
