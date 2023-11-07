import React, { useState, useEffect } from 'react';
import { Form, Select, Tabs, Popconfirm, InputNumber, Tooltip, Checkbox } from 'antd';
import { HookDataTable } from 'hooks';
import { UserManagementService } from 'services/userManagement';
// import { list } from 'postcss';
import { exportIcons } from 'utils';

export const TableDataAddNewGroupService = ({
  dataAdviseType,
  setDataAdviseType,
  dataTreatmentType,
  setDataTreatmentType,
}) => {
  // const [searchParams] = useSearchParams();
  // const uuidGroup = searchParams.get('uuidGroup');
  // const uuid = searchParams.get('uuid');
  const { TabPane } = Tabs;
  const [listUser, setListUser] = useState([]);

  // Advise Type
  const handleDelete = (key) => {
    const newData = dataAdviseType.filter((item) => item.idx !== key).map((e, idx) => ({ ...e, idx }));
    setDataAdviseType(newData);
  };
  const defaultColumnsAdvise = [
    {
      title: 'STT',
      name: 'stt',
      tableItem: {
        width: 50,
        align: 'right',
        render: (text, record, index) =>
          dataAdviseType.length >= 1 ? (
            <div>
              <span>{index + 1}</span>
            </div>
          ) : null,
      },
    },
    {
      title: 'Người dùng',
      name: 'userId',
      tableItem: {
        width: 250,
      },
    },
    {
      title: 'Chức vụ',
      name: 'userPositionName',
      tableItem: {
        width: 175,
      },
    },
    {
      title: '% Tư vấn',
      name: 'percentValue',
    },
    {
      title: 'Tính Labo',
      name: 'canUseLab',
    },
    {
      title: 'Thao tác',
      name: 'operation',
      tableItem: {
        width: 80,
        align: 'center',
        render: (_, record) =>
          dataAdviseType.length >= 1 ? (
            <Tooltip title={'Xóa'}>
              <Popconfirm
                placement="left"
                title={'Bạn có chắc muốn xóa ?'}
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                okText={'Đồng ý'}
                cancelText={'Huỷ bỏ'}
                onConfirm={() => handleDelete(record.idx)}
              >
                <button className="embed mr-2 pt-[6px]">{exportIcons('DEL')}</button>
              </Popconfirm>
            </Tooltip>
          ) : null,
      },
    },
  ];
  const handleAdd = () => {
    const newData = {
      idx: dataAdviseType.length,
      percentValue: 0,
      canUseLab: false,
    };
    setDataAdviseType([...dataAdviseType, newData]);
  };
  const handleSave = (data, row) => {
    // const newData = [...dataSource];
    // const index = newData.findIndex((item) => row.key === item.key);
    // const item = newData[index];
    // newData.splice(index, 1, {
    //   ...item,
    //   ...row,
    // });
    setDataAdviseType((prev) => {
      const newData = [...prev];
      const index = newData.findIndex((item) => item?.idx === data?.idx);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      return newData;
    });
  };

  const columnsAdvise = defaultColumnsAdvise.map((item) => {
    if (item?.name === 'userId') {
      return {
        ...item,
        tableItem: {
          width: 250,
          align: 'right',
          render: (text, data) => {
            return (
              <Form.Item
                style={{
                  margin: 0,
                }}
                initialValue={!Number(text ?? false) ? false : Number(text)}
                name={`${data?.key}+ ${item.name}}`}
              >
                <Select
                  onChange={(e) => {
                    handleSave(data, { [item.name]: Number(e) });
                  }}
                  className="w-full !rounded-lg  text-sm font-normal"
                  placeholder=""
                  options={listUser.map((e) => ({ label: e?.firstName, value: e?.id }))}
                ></Select>
              </Form.Item>
            );
          },
        },
      };
    }
    if (item?.name === 'userPositionName') {
      return {
        ...item,
        tableItem: {
          width: 175,
          align: 'right',
          render: (text, data) => {
            return (
              <Select
                onChange={(e) => {
                  handleSave(data, { [item.name]: Number(e) });
                }}
                className="w-full !rounded-lg text-sm font-normal"
                disabled
                placeholder=""
                value={listUser.find((e) => e?.id === data?.userId)?.position?.name}
              ></Select>
            );
          },
        },
      };
    }
    if (item?.name === 'percentValue') {
      return {
        ...item,
        tableItem: {
          width: 175,
          align: 'right',
          render: (text, data) => {
            return (
              <Form.Item
                style={{
                  margin: 0,
                }}
                initialValue={Number(text ?? false) ? Number(text) : 0}
                name={`${data?.key}+ ${item?.name}}`}
              >
                <InputNumber
                  className="antdInputNumberSuffix h-10 text-sm font-normal block w-full rounded-l-lg"
                  onBlur={(e) => {
                    console.log(e);
                    if (e.target.value > 100) {
                      handleSave(data, { [item.name]: 100 });
                    } else if (e.target.value < 0) {
                      handleSave(data, { [item.name]: 0 });
                    } else handleSave(data, { [item.name]: Number(e.target.value) ?? 0 });
                  }}
                  onPressEnter={(e) => {
                    if (e.target.value > 100) {
                      handleSave(data, { [item.name]: 100 });
                    } else if (e.target.value < 0) {
                      handleSave(data, { [item.name]: 0 });
                    } else handleSave(data, { [item.name]: Number(e.target.value) ?? 0 });
                  }}
                  min={0}
                  max={100}
                  addonAfter="%"
                />
              </Form.Item>
            );
          },
        },
      };
    }
    if (item?.name === 'canUseLab') {
      return {
        ...item,
        tableItem: {
          width: 85,
          align: 'center',
          render: (text, data) => {
            return (
              <Form.Item
                style={{
                  margin: 0,
                }}
                initialValue={data?.canUseLab ?? false}
                valuePropName="checked"
                name={`${data?.key}+ ${item?.name}}`}
              >
                <Checkbox
                  onChange={(e) => {
                    handleSave(data, { [item.name]: e.target.checked ?? false });
                  }}
                />
              </Form.Item>
            );
          },
        },
      };
    }
    return {
      ...item,
    };
  });
  const getDataTable = () => {
    return { data: dataAdviseType.map((e, idx) => ({ ...e, idx })) };
  };
  const [handleTableAdviseChange, tableAdvise] = HookDataTable({
    showSearch: false,
    columns: columnsAdvise,
    Get: getDataTable,
    showPagination: false,
    loadFirst: false,
  });

  // Treatment Type

  const handleDeleteTreatment = (key) => {
    const newData = dataTreatmentType.filter((item) => item.idx !== key).map((e, idx) => ({ ...e, idx }));
    setDataTreatmentType(newData);
  };
  const defaultColumnsTreatment = [
    {
      title: 'STT',
      name: 'stt',
      tableItem: {
        width: 50,
        align: 'right',
        render: (text, record, index) =>
          dataTreatmentType.length >= 1 ? (
            <div>
              <span>{index + 1}</span>
            </div>
          ) : null,
      },
    },
    {
      title: 'Người dùng',
      name: 'userId',
      tableItem: {
        width: 250,
      },
    },
    {
      title: 'Chức vụ',
      name: 'userPositionName',
      tableItem: {
        width: 175,
      },
    },
    {
      title: '% Điều trị',
      name: 'percentValue',
    },
    {
      title: 'Tính Labo',
      name: 'canUseLab',
    },
    {
      title: 'Thao tác',
      name: 'operation',
      tableItem: {
        width: 80,
        align: 'center',
        render: (_, record) =>
          dataTreatmentType.length >= 1 ? (
            // <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteTreatment(record.idx)}>
            //   <a>Delete</a>
            // </Popconfirm>
            <Tooltip title={'Xóa'}>
              <Popconfirm
                placement="left"
                title={'Bạn có chắc muốn xóa ?'}
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                okText={'Đồng ý'}
                cancelText={'Huỷ bỏ'}
                onConfirm={() => handleDeleteTreatment(record.idx)}
              >
                <button className="embed mr-2 pt-[6px]">{exportIcons('DEL')}</button>
              </Popconfirm>
            </Tooltip>
          ) : null,
      },
    },
  ];
  const handleAddTreatment = () => {
    const newData = {
      idx: dataTreatmentType.length,
      percentValue: 0,
      canUseLab: false,
    };
    setDataTreatmentType([...dataTreatmentType, newData]);
  };
  const handleSaveTreatment = (data, row) => {
    // const newData = [...dataSource];
    // const index = newData.findIndex((item) => row.key === item.key);
    // const item = newData[index];
    // newData.splice(index, 1, {
    //   ...item,
    //   ...row,
    // });
    setDataTreatmentType((prev) => {
      const newData = [...prev];
      const index = newData.findIndex((item) => item?.idx === data?.idx);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      return newData;
    });
  };

  const columnsTreatment = defaultColumnsTreatment.map((item) => {
    if (item?.name === 'userId') {
      return {
        ...item,
        tableItem: {
          width: 250,
          align: 'right',
          render: (text, data) => {
            return (
              <Form.Item
                style={{
                  margin: 0,
                }}
                initialValue={!Number(text ?? false) ? false : Number(text)}
                name={`${data?.key}+ ${item.name}}`}
              >
                <Select
                  onChange={(e) => {
                    handleSaveTreatment(data, { [item.name]: Number(e) });
                  }}
                  className="w-full !rounded-lg  text-sm font-normal"
                  placeholder=""
                  options={listUser.map((e) => ({ label: e?.firstName, value: e?.id }))}
                ></Select>
              </Form.Item>
            );
          },
        },
      };
    }
    if (item?.name === 'userPositionName') {
      return {
        ...item,
        tableItem: {
          width: 175,
          align: 'right',
          render: (text, data) => {
            return (
              <Select
                className="w-full !rounded-lg  text-sm font-normal"
                disabled
                placeholder=""
                value={listUser.find((e) => e?.id === data?.userId)?.position?.name}
              ></Select>
            );
          },
        },
      };
    }
    if (item?.name === 'percentValue') {
      return {
        ...item,
        tableItem: {
          width: 175,
          align: 'right',
          render: (text, data) => {
            return (
              <Form.Item
                style={{
                  margin: 0,
                }}
                initialValue={Number(text ?? false) ? Number(text) : 0}
                name={`${data?.key}+ ${item?.name}}`}
              >
                <InputNumber
                  // step="0.1"
                  className="antdInputNumberSuffix h-10 text-sm font-normal block w-full rounded-l-lg"
                  onBlur={(e) => {
                    if (e.target.value > 100) {
                      handleSaveTreatment(data, { [item.name]: 100 });
                    } else if (e.target.value < 0) {
                      handleSaveTreatment(data, { [item.name]: 0 });
                    } else handleSaveTreatment(data, { [item.name]: Number(e.target.value) ?? 0 });
                  }}
                  onPressEnter={(e) => {
                    handleSaveTreatment(data, { [item.name]: Number(e.target.value) ?? 0 });
                  }}
                  min={0}
                  max={100}
                  addonAfter="%"
                />
              </Form.Item>
            );
          },
        },
      };
    }
    if (item?.name === 'canUseLab') {
      return {
        ...item,
        tableItem: {
          width: 85,
          align: 'center',
          render: (text, data) => {
            return (
              <Form.Item
                style={{
                  margin: 0,
                }}
                initialValue={data?.canUseLab ?? false}
                valuePropName="checked"
                name={`${data?.key}+ ${item?.name}}`}
              >
                <Checkbox
                  onChange={(e) => {
                    handleSaveTreatment(data, { [item.name]: e.target.checked ?? false });
                  }}
                />
              </Form.Item>
            );
          },
        },
      };
    }
    return {
      ...item,
    };
  });
  const getDataTreatmentTable = () => {
    return { data: dataTreatmentType.map((e, idx) => ({ ...e, idx })) };
  };
  const [handleTableTreatmentChange, tableTreatment] = HookDataTable({
    showSearch: false,
    columns: columnsTreatment,
    Get: getDataTreatmentTable,
    showPagination: false,
    loadFirst: false,
  });

  useEffect(() => {
    handleTableAdviseChange();
  }, [dataAdviseType]);

  useEffect(() => {
    handleTableTreatmentChange();
  }, [dataTreatmentType]);

  const init = async () => {
    const resListUsers = await UserManagementService.getListAllUser();
    setListUser(resListUsers?.data ?? []);
  };
  useEffect(() => {
    init();
  }, []);

  const tabPanes = [
    {
      key: '1',
      title: '% Tư vấn',
      icon: '',
      content: (
        <div className="mb-8">
          <div className="flex justify-between pb-2">
            <div></div>
            <button
              className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
              type="button"
              onClick={handleAdd}
            >
              <i className="las la-plus mr-1" />
              Thêm đơn vị
            </button>
          </div>
          {!!dataAdviseType.length && tableAdvise()}
        </div>
      ),
    },
    {
      key: '2',
      title: '% Điều trị',
      icon: 'check-circle',
      content: (
        <div className="mb-8">
          <div className="flex justify-between pb-2">
            <div></div>
            <button
              className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
              type="button"
              onClick={handleAddTreatment}
            >
              <i className="las la-plus mr-1" />
              Thêm đơn vị
            </button>
          </div>
          {!!dataTreatmentType.length && tableTreatment()}
        </div>
      ),
    },
  ];

  return (
    <div className="TriggerRequests_Tabs">
      <Tabs type="card" defaultActiveKey="1">
        {tabPanes.map((pane) => (
          <TabPane
            key={pane.key}
            tab={
              <>
                <span>{pane.title}</span>
              </>
            }
          >
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};
