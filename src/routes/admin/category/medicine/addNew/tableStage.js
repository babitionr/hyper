import React, { useContext, useEffect, useRef, useState } from 'react';
import RemoveIcon from 'assets/svg/remove.js';
import { Form, Input, Popconfirm, Table, Tooltip, Checkbox, Select, InputNumber } from 'antd';
import { MaterialMedicineService } from 'services/material-medicine';
import { useSearchParams } from 'react-router-dom';

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
export const TableStage = ({ productConversionUnitDtoList, setProductConversionUnitDtoList }) => {
  const [searchParams] = useSearchParams();
  // const [value, setValue] = useState('');
  const [data, setData] = useState([
    // {
    //   key: '1',
    //   tenCongDoan: 'Công đoạn 1',
    // },
    // {
    //   key: '2',
    //   tenCongDoan: 'Công đoạn 2',
    // },
  ]);

  const [count, setCount] = useState();
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
      title: 'Đơn vị quy đổi',
      dataIndex: 'name',
      editable: true,
      width: '23%',
      render: (text, record, index) => <div className="">{text} &nbsp;</div>,
    },
    {
      title: 'Loại quy đổi',
      dataIndex: 'conversionType',
      editable: false,
      width: '23%',
      render: (text, record, index) => (
        <div className="">
          <Select
            className=" !rounded-lg w-full"
            placeholder="Chọn loại quy đổi"
            defaultValue={text}
            onChange={(e) => {
              data[index].conversionType = e;
            }}
          >
            <Select.Option key={2} value="ORIGINAL_GREATER">
              Lớn hơn đơn vị gốc
            </Select.Option>
            <Select.Option key={1} value="ORIGINAL_LESS">
              Nhỏ hơn đơn vị gốc
            </Select.Option>
          </Select>
        </div>
      ),
    },
    {
      title: 'Số lượng quy đổi',
      dataIndex: 'quantity',
      editable: false,
      width: '23%',
      render: (text, record, index) => (
        <div className="">
          <InputNumber
            onChange={(e) => {
              data[index].quantity = e;
            }}
            defaultValue={record.quantity}
          />
        </div>
      ),
    },
    {
      title: () => <div className="flex justify-center"> Đơn vị mua mặc định</div>,
      dataIndex: 'default',
      editable: false,
      width: '16%',
      render: (text, record, index) => (
        <div className="flex justify-center">
          {' '}
          <Checkbox
            onChange={(e) => {
              data[index].default = e.target.checked;
            }}
            defaultChecked={record.default}
          />
        </div>
      ),
    },
    {
      title: 'Thao tác',
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
      name: ``,
      conversionType: 'ORIGINAL_GREATER',
      quantity: 1,
      default: false,
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
  // Thanh tìm kiếm
  // const FilterByNameInput = (
  //   <div>
  //     <div className="relative">
  //       <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
  //         <svg
  //           aria-hidden="true"
  //           className="w-5 h-5 text-gray-500 dark:text-gray-400"
  //           fill="none"
  //           stroke="currentColor"
  //           viewBox="0 0 24 24"
  //           xmlns="http://www.w3.org/2000/svg"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             strokeWidth="2"
  //             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
  //           ></path>
  //         </svg>
  //       </div>
  //       <input
  //         value={value}
  //         onChange={(e) => {
  //           const currValue = e.target.value.toLowerCase();
  //           setValue(currValue);
  //           const filteredData = data.filter((entry) => entry.tenCongDoan.toLowerCase().includes(currValue));
  //           setDataSource(filteredData);
  //         }}
  //         type="search"
  //         id="default-search"
  //         className=" w-full h-11 p-4 pl-10 focus:outline-none text-sm font-normal text-gray-900 border border-gray-300 rounded-lg "
  //         placeholder="Tìm kiếm dịch vụ"
  //         required
  //       ></input>
  //     </div>
  //   </div>
  // );
  useEffect(() => {
    setProductConversionUnitDtoList(data);
  }, [data]);
  useEffect(() => {
    const initProductConversionUnitDtoList = async () => {
      const uuid = searchParams.get('uuid');
      if (!uuid) {
        setCount(0);
        return;
      }
      const data = await MaterialMedicineService.getDetail(uuid);
      setData(data.productConversionUnitDtoList.map((e, index) => ({ ...e, key: index + 1 })));
      console.log(typeof data.productConversionUnitDtoList.length);
      setCount(
        typeof data.productConversionUnitDtoList.length === 'number' ? data.productConversionUnitDtoList.length : 0,
      );
    };
    initProductConversionUnitDtoList();
  }, []);

  return (
    <div>
      <div className="flex justify-between py-4">
        {/* {FilterByNameInput} */}
        <div></div>
        <button
          onClick={handleAdd}
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <i className="las la-plus mr-1" />
          Thêm đơn vị
        </button>
      </div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={productConversionUnitDtoList}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};
