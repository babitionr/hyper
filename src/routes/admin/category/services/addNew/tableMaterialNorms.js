import React, { useContext, useEffect, useRef, useState } from 'react';
import RemoveIcon from 'assets/svg/remove.js';
import { Form, Input, Popconfirm, Table, Tooltip, Select } from 'antd';
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
export const TableMaterialNorms = () => {
  const [value, setValue] = useState('');
  const [data, setData] = useState([
    {
      key: '1',
      soLuongToiDa: 'Công đoạn 1',
    },
    {
      key: '2',
      soLuongToiDa: 'Công đoạn 2',
    },
  ]);
  const vatTu = [
    { label: 'Vật tư 1', id: 'vatTu1' },
    { label: 'Vật tư 2', id: 'vatTu2' },
  ];
  const [dataSource, setDataSource] = useState(data);

  const [count, setCount] = useState(2);
  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };
  const defaultColumns = [
    {
      title: () => <div className="flex justify-center"> STT</div>,
      dataIndex: 'stt',
      editable: false,
      width: '5%',
      render: (_, record, index) => <div className="flex justify-center">{index + 1}</div>,
    },
    {
      title: 'Tên vật tư',
      dataIndex: 'tenVatTu',
      editable: false,
      width: '35%',
      render: (text, record, index) => {
        if (text === undefined || text === null) {
          // <div className="">
          //   <Select
          //     onChange={(labels, ele) => {
          //       data[index].tenVatTu = ele.label;
          //       console.log(data);
          //     }}
          //     className="w-full !rounded-lg  text-sm font-normal"
          //     placeholder="Chọn giới tính"
          //     options={{label: text}}
          //   ></Select>
          // </div>;
          return (
            <div className="">
              <Select
                onChange={(text, ele) => {
                  data[index].tenVatTu = ele.label;
                }}
                className="w-full !rounded-lg  text-sm font-normal"
                placeholder="Chọn vật tư"
                options={vatTu.map((ele) => ({ value: ele.id, label: ele.label }))}
              ></Select>
            </div>
          );
        } else {
          return (
            <div className="">
              <Select
                onChange={(labels, ele) => {
                  data[index].tenVatTu = ele.label;
                  console.log(data);
                }}
                className="w-full !rounded-lg  text-sm font-normal"
                placeholder="Chọn giới tính"
                options={{ label: text }}
              ></Select>
            </div>
          );
        }
      },
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'donViTinh',
      width: '20%',
      editable: false,
      render: (text, record, index) => <div className="">{text} &nbsp;</div>,
    },
    {
      title: 'Số lượng tối đa',
      dataIndex: 'soLuongToiDa',
      width: '30%',
      editable: true,
      render: (text, record, index) => <div className="">{text} &nbsp;</div>,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width: '10%',
      render: (_, record) =>
        data.length >= 1 ? (
          <>
            <Tooltip title={'Xóa'}>
              <Popconfirm
                placement="left"
                title={'Bạn có chắc muốn xóa ?'}
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                okText={'Đồng ý'}
                cancelText={'Huỷ bỏ'}
                onConfirm={() => handleDelete(record.key)}
              >
                <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                  <RemoveIcon />
                </button>
              </Popconfirm>
            </Tooltip>
          </>
        ) : // <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(data.key)}>
        //   <a>Delete</a>
        // </Popconfirm>
        null,
    },
  ];
  const handleAdd = () => {
    const newData = {
      key: count + 1,
      soLuongToiDa: ``,
    };
    setData([...data, newData]);
    setCount(count + 1);
  };
  const handleSave = (row) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setData(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  const FilterByNameInput = (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          value={value}
          onChange={(e) => {
            const currValue = e.target.value.toLowerCase();
            setValue(currValue);
            console.log(value);
            if (currValue === '' || currValue === null) setDataSource(data);
            else {
              const filteredData = data.filter((entry) => entry.tenVatTu?.toLowerCase().includes(currValue));
              setDataSource(filteredData);
              console.log(data);
            }
          }}
          type="search"
          id="default-search"
          className=" w-full h-11 p-4 pl-10 focus:outline-none text-sm font-normal text-gray-900 border border-gray-300 rounded-lg "
          placeholder="Tìm kiếm vật tư"
          required
        ></input>
      </div>
    </div>
  );
  useEffect(() => {
    setDataSource(data);
  }, [data]);

  return (
    <div>
      <div className="flex justify-between py-4">
        {FilterByNameInput}
        <div className="flex gap-3">
          <button
            className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-white text-red-500 rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
            type="button"
          >
            <i className="las la-plus mr-1" />
            Thêm mới vật tư
          </button>
          <button
            onClick={handleAdd}
            className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
            type="button"
          >
            <i className="las la-plus mr-1" />
            Thêm vật tư
          </button>
        </div>
      </div>
      <div className="border-b">
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  );
};
