import { Form, Input, InputNumber, Table } from 'antd';
import React, { useRef, useEffect, useState, useContext, useMemo } from 'react';
import { formatCurrency } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import './index.less';
import { blockInvalidChar } from 'utils/func';

const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, pageType, ...restProps }) => {
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
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      dataIndex === 'name' ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
        >
          <Input
            readOnly={pageType === 'detail'}
            ref={inputRef}
            onPressEnter={save}
            onChange={(e) => handleSave({ ...record, name: e.target.value })}
            onBlur={save}
            placeholder="Nhập khoản thu nhập"
            className=" h-9 !w-full !rounded-lg !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
          />
        </Form.Item>
      ) : (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          <InputNumber
            // type="number"
            readOnly={pageType === 'detail'}
            ref={inputRef}
            formatter={(value) => {
              if (!value) {
                return;
              }
              return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }}
            parser={(value) => {
              if (!value) {
                return;
              }
              return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
            }}
            onChange={(e) => {
              handleSave({ ...record, amount: e });
            }}
            onKeyDown={blockInvalidChar}
            onPressEnter={save}
            onBlur={save}
            placeholder="Nhập số tiền"
            className="percentInput h-9 !w-full !rounded-lg !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
          />
        </Form.Item>
      )
    ) : (
      <>
        {pageType === 'create' && (
          <div
            onKeyPress={(e) => {
              if (e.key) {
                toggleEdit();
              }
            }}
            onKeyDown={(e) => {
              if (e.key) {
                toggleEdit();
              }
            }}
            onClick={toggleEdit}
          >
            <Input
              value={
                dataIndex === 'name'
                  ? children[1]
                  : children[1] < 0 || children[1] === undefined
                  ? undefined
                  : children[1] === null || children[1] === undefined
                  ? undefined
                  : formatCurrency(children[1], ' ')
              }
              placeholder={dataIndex === 'name' ? 'Nhập khoản thu nhập' : 'Nhập số tiền'}
              className="h-9 !w-full !rounded-[8px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 arrReadonly checkHidden"
            />
          </div>
        )}
        {pageType === 'edit' && (
          <div
            onKeyPress={(e) => {
              if (e.key) {
                toggleEdit();
              }
            }}
            onKeyDown={(e) => {
              if (e.key) {
                toggleEdit();
              }
            }}
            onClick={toggleEdit}
          >
            <Input
              onKeyDown={blockInvalidChar}
              value={
                dataIndex === 'name'
                  ? children[1]
                  : children[1] < 0 || children[1] === undefined
                  ? undefined
                  : children[1] === null || children[1] === undefined
                  ? undefined
                  : formatCurrency(children[1], ' ')
              }
              placeholder={dataIndex === 'name' ? 'Nhập khoản thu nhập' : 'Nhập số tiền'}
              className="h-9 !w-full !rounded-lg !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 arrReadonly  checkHidden"
            />
          </div>
        )}
        {pageType === 'detail' && (
          <div className="ml-4">{dataIndex === 'name' ? children : formatCurrency(children[1] || 0, '')}</div>
        )}
      </>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const TableData = ({ dataSource, setDataSource, pageType = 'create' }) => {
  const dataTable = useMemo(() => {
    return dataSource.filter((item) => !item.isDelete);
  }, [dataSource]);

  const handleDelete = (key) => {
    const newData = dataSource?.find((item) => item.key === key);
    newData.isDelete = true;
    setDataSource([...dataSource]);
  };

  // const handleSave = (value, key, type) => {
  //   const newData = [...dataSource];
  //   const index = newData.findIndex((item) => key === item.key);
  //   const item = newData[index];
  //   if (type === 1) {
  //     newData.splice(index, 1, { ...item, content: value });
  //   }
  //   if (type === 2) {
  //     newData.splice(index, 1, { ...item, amount: value });
  //   }
  //   setDataSource(newData);
  // };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: 'STT',
      dataIndex: 'key',
      width: '5%',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên khoản thu nhập',
      dataIndex: 'name',
      width: '50%',
      editable: true,
      align: 'start',
    },

    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: '45%',
      fixed: 'right',
      align: 'center',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div className="flex gap-4 items-center justify-center ">
            {/* {pageType !== 'detail' && ( */}
            <button
              type="button"
              className="text-2xl mr-2 text-red-500 remove"
              onClick={() => handleDelete(record.key)}
              disabled={pageType === 'detail'}
            >
              <i className="las la-trash-alt"></i>
            </button>
            {/* )} */}
          </div>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData = {
      key: uuidv4(),
      uuid: null,
      isDelete: false,
    };
    setDataSource([...dataSource, newData]);
    return true;
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
        pageType,
      }),
    };
  });

  return (
    <div className="">
      <div className="flex justify-between mb-[18px]">
        <h2 className="text-base font-semibold"></h2>
        {pageType !== 'detail' && (
          <button
            type="button"
            className="w-[120px] h-9 leading-[36px] bg-rose-500 text-white text-sm rounded-[8px]"
            onClick={handleAdd}
          >
            <span className="text-base">+</span> Thêm
          </button>
        )}
      </div>

      <Table
        className={`w-full product-price-table `}
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={dataTable}
        columns={columns}
        pagination={false}
        scroll={{ x: '100%', y: null }}
        size="small"
      />
    </div>
  );
};

export default TableData;
