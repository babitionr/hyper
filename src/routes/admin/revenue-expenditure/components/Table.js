import { Form, Input, InputNumber, Table } from 'antd';
// import { Message } from 'components';
import React, { useRef, useEffect, useState, useContext, useMemo } from 'react';
import { formatCurrency } from 'utils';
import { v4 as uuidv4 } from 'uuid';
import '../index.less';
import { blockInvalidChar, isNullOrUndefinedOrEmpty } from 'utils/func';
import { useSearchParams } from 'react-router-dom';

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
      dataIndex === 'note' ? (
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
            onChange={(e) => handleSave({ ...record, content: e.target.value })}
            onBlur={save}
            placeholder="Nhập nội dung"
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
                dataIndex === 'note'
                  ? children[1]
                  : children[1] < 0 || children[1] === undefined
                  ? undefined
                  : children[1] === null || children[1] === undefined
                  ? undefined
                  : formatCurrency(children[1], ' ')
              }
              placeholder={dataIndex === 'note' ? 'Nhập nội dung' : 'Nhập số tiền'}
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
                dataIndex === 'note'
                  ? children[1]
                  : children[1] < 0 || children[1] === undefined
                  ? undefined
                  : children[1] === null || children[1] === undefined
                  ? undefined
                  : formatCurrency(children[1], ' ')
              }
              placeholder={dataIndex === 'note' ? 'Nhập nội dung' : 'Nhập số tiền'}
              className="h-9 !w-full !rounded-lg !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 arrReadonly  checkHidden"
            />
          </div>
        )}
        {pageType === 'detail' && (
          <div className="ml-4">{dataIndex === 'note' ? children : formatCurrency(children[1] || 0, '')}</div>
        )}
      </>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const TableData = ({ dataSource, setDataSource, pageType }) => {
  console.log('pageType: ', pageType);
  console.log('dataSource: ', dataSource);

  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const dataTable = useMemo(() => {
    return dataSource;
  }, [dataSource]);

  const totalPrice = dataSource.reduce((arr, cur) => {
    if (isNullOrUndefinedOrEmpty(cur.amount)) {
      return arr;
    }
    return arr + cur.amount;
  }, 0);

  const handleDelete = (key) => {
    const newData = dataSource?.filter((item) => item.key !== key);
    setDataSource(newData);
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
      title: 'Nội dung',
      dataIndex: 'note',
      width: '50%',
      editable: true,
      align: 'start',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      editable: true,
      width: '30%',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      width: '15%',
      fixed: 'right',
      align: 'center',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <>
            {pageType !== 'detail' && (
              <button
                className="text-2xl mr-2 text-red-500 remove"
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

  const handleAdd = () => {
    // if (minQuantity) return Message.error({ text: 'Vui lòng nhập số lượng tối thiểu lớn hơn 0' });
    // if (dataSource.length > 0 && dataSource[0].price === undefined && dataSource[0].minQuantity === undefined)
    //   return Message.error({ text: 'Vui lòng nhập thông tin bảng giá' });
    // if (isAdd && dataSource?.filter((i) => i?.minQuantity !== undefined || i?.minQuantity !== null).length)
    //   return Message.error({ text: 'Số lượng tối thiểu phải lớn hơn số lượng vừa tạo' });
    const newData = {
      key: uuidv4(),
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
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="flex justify-between mb-[18px]">
        <h2 className="text-base font-semibold">{`Danh sách ${Number(type) === 1 ? 'tiền thu' : 'tiền chi'}`}</h2>
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

      <div className="flex justify-end mt-5">
        <div className="flex items-center">
          <span className="mr-9 font-semibold">Tổng tiền:</span>
          <span className="font-semibold"> {formatCurrency(totalPrice, ' VND')}</span>
        </div>
      </div>
    </div>
  );
};

export default TableData;

// import { Col, Row, InputNumber, Form, Input } from 'antd';
// import React, { useMemo } from 'react';
// import { formatCurrency } from 'utils';
// import { blockInvalidChar, isNullOrUndefinedOrEmpty } from 'utils/func';
// import { v4 as uuidv4 } from 'uuid';

// const TableData = ({ dataSource, setDataSource, pageType }) => {
//   console.log('dataSource: ', dataSource);

//   const dataTable = useMemo(() => {
//     return dataSource
//   }, [dataSource])

//   const totalPrice = dataSource.reduce((arr, cur) => {
//     if (isNullOrUndefinedOrEmpty(cur.amount)) {
//       return arr;
//     }
//     return arr + cur.amount;
//   }, 0);
//   const handleAdd = () => {
//     const newData = {
//       key: uuidv4(),
//     };
//     setDataSource([...dataSource, newData]);
//     return true;
//   };
//   const handleDelete = (id) => {
//     const tempArr = dataSource.filter((item) => item.key !== id);
//     setDataSource([...tempArr]);
//     return true;
//   };
//   const toggleAmount = (data, type) => {
//     const { id, value } = data;
//     const tempOrder =
//       dataSource &&
//       dataSource.map((item) => {
//         if (item.key === id) {
//           if (type === 1) {
//             return { ...item, content: value };
//           }
//           if (type === 2) {
//             return { ...item, amount: value };
//           }
//         }
//         return item;
//       });
//     return setDataSource([...tempOrder]);
//   };

//   const _renderContent = () => {
//     return (
//       <>
//         <Row gutter={16} className="mb-3 tableListProduct">
//           <Col className="gutter-row " span={2}>
//             <div className="text-sm font-normal text-gray-700">STT</div>
//           </Col>
//           <Col className="gutter-row " span={12}>
//             <div className="text-sm font-normal text-gray-700">Content</div>
//           </Col>
//           <Col className="gutter-row " span={8}>
//             <div className="text-sm font-normal text-gray-700">Số tiền</div>
//           </Col>
//           <Col className="gutter-row text-center" span={2}>
//             Thao tác
//           </Col>
//         </Row>
//         <hr />
//         <div>
//           {dataTable &&
//             dataTable?.map((item, index) => {
//               return (
//                 <div key={index}>
//                   <Row gutter={16} className="py-3 flex items-center">
//                     <Col className="gutter-row" span={2}>
//                       <div className="text-center w-full">{index + 1}</div>
//                     </Col>
//                     <Col className="gutter-row" span={12}>
//                       <Form.Item
//                         style={{
//                           margin: 0,
//                         }}
//                         name={`content${item.indexOf}`}
//                       >
//                         <Input
//                           type="text"
//                           readOnly={pageType === 'detail'}
//                           onChange={(e) => {
//                             toggleAmount({ id: item?.key, value: e.target.value }, 1);
//                           }}
//                           onPressEnter={(e) => {
//                             toggleAmount({ id: item?.key, value: e.target.value }, 1);
//                           }}
//                           placeholder="Nhập nội dung"
//                           className=" h-9 !w-full !rounded-lg !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
//                         />
//                       </Form.Item>
//                     </Col>
//                     <Col className="gutter-row " span={8}>
//                       <Form.Item
//                         name={`amount${item.indexOf}`}
//                         style={{
//                           margin: 0,
//                         }}
//                       >
//                         <InputNumber
//                           // type="number"
//                           readOnly={pageType === 'detail'}
//                           // ref={inputRef}
//                           formatter={(value) => {
//                             if (!value) {
//                               return;
//                             }
//                             return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
//                           }}
//                           parser={(value) => {
//                             if (!value) {
//                               return;
//                             }
//                             return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
//                           }}
//                           onKeyDown={blockInvalidChar}
//                           onChange={(e) => {
//                             toggleAmount({ id: item?.key, value: e }, 2);
//                           }}
//                           onPressEnter={(e) => {
//                             toggleAmount({ id: item?.key, value: e }, 2);
//                           }}
//                           placeholder="Nhập số tiền"
//                           className="percentInput h-9 !w-full !rounded-lg !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
//                         />
//                       </Form.Item>
//                     </Col>
//                     <Col className="gutter-row " span={2}>
//                       <button
//                         type="button"
//                         className="remove-btn"
//                         onClick={() => {
//                           handleDelete(item?.key);
//                         }}
//                       >
//                         <i className="las la-trash-alt text-red-600 text-2xl"></i>
//                       </button>
//                     </Col>
//                   </Row>
//                   <hr />
//                 </div>
//               );
//             })}
//         </div>
//       </>
//     );
//   };

//   return (
//     <div className="border border-gray-300 rounded-lg p-4">
//       <div className="flex justify-between mb-[18px]">
//         <h2 className="text-base font-semibold">Danh sách tiền thu</h2>{' '}
//         {pageType !== 'detail' && (
//           <button
//             type="button"
//             className="w-[120px] h-9 leading-[36px] bg-rose-500 text-white text-sm rounded-[8px]"
//             onClick={handleAdd}
//           >
//             {' '}
//             <span className="text-base">+</span> Thêm
//           </button>
//         )}
//       </div>
//       <div>{_renderContent()}</div>
//       <div className="flex justify-end mt-5">
//         <div className="flex items-center">
//           <span className="mr-9 font-semibold">Tổng tiền:</span>
//           <span className="font-semibold"> {formatCurrency(totalPrice, ' VNĐ')}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TableData;
