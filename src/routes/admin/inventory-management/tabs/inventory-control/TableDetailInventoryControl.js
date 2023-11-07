import { Form, Input, InputNumber, Table } from 'antd';
// import { Message } from 'components';
import React, { useRef, useEffect, useState, useContext, useMemo } from 'react';
import { formatCurrency } from 'utils';
// import { v4 as uuidv4 } from 'uuid';
import './index.less';
import { blockInvalidChar, isNullOrUndefinedOrEmpty } from 'utils/func';

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

export const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  pageType,
  status,
  ...restProps
}) => {
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
      <Form.Item
        name={dataIndex}
        style={{
          margin: 0,
        }}
      >
        <InputNumber
          // type="number"
          maxLength={13}
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
            handleSave({ ...record, realStockQuantity: e });
          }}
          onKeyDown={blockInvalidChar}
          onPressEnter={save}
          onBlur={save}
          placeholder=""
          className="!not-sr-only !px-0 h-9 !w-full !rounded-lg !bg-white border !border-gray-200 focus:!shadow-none focus:!border-gray-200 focus:!outline-none"
        />
      </Form.Item>
    ) : (
      <>
        {pageType === 'create' && (
          <>
            {status === 'COMPLETED' ? (
              <div>{isNullOrUndefinedOrEmpty(children) ? null : formatCurrency(children[1], ' ')}</div>
            ) : (
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
                    dataIndex === 'content'
                      ? children[1]
                      : children[1] < 0 || children[1] === undefined
                      ? undefined
                      : children[1] === null || children[1] === undefined
                      ? undefined
                      : formatCurrency(children[1], ' ')
                  }
                  className="h-9 !w-full !rounded-[8px] !bg-white border !border-gray-200 focus:!shadow-none focus:!border-gray-200 !px-3"
                />
              </div>
            )}
          </>
        )}
      </>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const TableDetailInventoryControl = ({ dataSource, setDataSource, pageType, status, type = 1 }) => {
  const dataTable = useMemo(() => {
    return dataSource;
  }, [dataSource]);

  const handleDelete = (key) => {
    const newData = dataSource?.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const defaultColumns =
    +type === 2
      ? [
          {
            title: 'STT',
            dataIndex: 'key',
            width: '5%',
            align: 'center',
            render: (text, record, index) => index + 1,
          },
          {
            title: 'Mã sản phẩm',
            dataIndex: 'code',
            width: '20%',
            // editable: true,
            align: 'start',
          },
          {
            title: 'Sản phẩm',
            dataIndex: 'name',
            // editable: true,
            width: '30%',
          },
          {
            title: 'Đơn vị tính',
            dataIndex: 'inventoryUnit',
            // editable: true,
            width: '20%',
          },
          {
            title: 'Số lượng chệnh lệch',
            dataIndex: 'amountOfDifference',
            // editable: true,
            width: '20%',
            render: (value, record, index) => (
              <span> {!isNullOrUndefinedOrEmpty(value) || value === 0 ? formatCurrency(value, ' ') : null}</span>
            ),
          },
        ]
      : [
          {
            title: 'STT',
            dataIndex: 'key',
            width: '5%',
            align: 'center',
            render: (text, record, index) => index + 1,
          },
          {
            title: 'Mã sản phẩm',
            dataIndex: 'code',
            width: '20%',
            // editable: true,
            align: 'start',
          },
          {
            title: 'Sản phẩm',
            dataIndex: 'name',
            // editable: true,
            width: '30%',
          },
          {
            title: 'Đơn vị tính',
            dataIndex: 'inventoryUnit',
            // editable: true,
            width: '20%',
          },
          {
            title: 'Tồn kho',
            dataIndex: 'stockQuantity',
            // editable: true,
            width: '20%',
            render: (value, record, index) => (
              <span> {!isNullOrUndefinedOrEmpty(value) || value === 0 ? formatCurrency(value, ' ') : null}</span>
            ),
          },
          {
            title: 'Thực tế',
            dataIndex: 'realStockQuantity',
            editable: true,
            width: '20%',
          },
          status === 'COMPLETED'
            ? {}
            : {
                title: 'Thao tác',
                dataIndex: 'action',
                width: '10%',
                fixed: 'right',
                align: 'center',
                render: (_, record) =>
                  dataSource.length >= 1 ? (
                    <>
                      {pageType !== 'detail' && (
                        <button
                          type="button"
                          className="text-2xl mr-2 text-red-500"
                          onClick={() => handleDelete(record.key)}
                          disabled={pageType === 'detail'}
                        >
                          <i className="las la-trash-alt"></i>
                        </button>
                      )}
                    </>
                  ) : null,
              },
        ];

  // const handleAdd = () => {

  //   const newData = {
  //     key: uuidv4(),
  //   };
  //   setDataSource([...dataSource, newData]);
  //   return true;
  // };

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
        status,
      }),
    };
  });

  return (
    <div>
      <Table
        className={`w-full head-table`}
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

export default TableDetailInventoryControl;
