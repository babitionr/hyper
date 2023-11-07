import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HookDataTable } from 'hooks';
import './index.less';
import classNames from 'classnames';

import { ColumnServices } from './columns/columnServices';

import { Form, Input, Modal, Select, Table, Checkbox, Tooltip } from 'antd';
import { SettingService } from 'services/setting';
// import Arrow from 'assets/images/icons/arrow-right.svg';
import { convertTextToCode } from 'utils/func';
import { useLocation } from 'react-router';
// import TableFunction from './tablePermission';

const Page = () => {
  const [servicesTitle, setServicesTitle] = useState([]);
  const [roleDetail, setRoleDetail] = useState({});
  const [showModal, setShowModal] = useState(false);
  const searchRef = useRef(null);
  const getAllRole = async () => {
    const res = await SettingService.get();
    setServicesTitle(res.data);
    setSelectedServices(res?.data[0]?.roleName);
    return res.data;
  };

  const getRoleDetailById = async (id) => {
    const res = await SettingService.getById({ id });
    setRoleDetail(res);
    return res;
  };

  const getAllFeatures = async () => {
    const res = await SettingService.getFeaturesAll();

    // setDataTable(res.data)
    const obj = res?.data.reduce((a, c) => {
      a[c.group] = a[c.group] || [];
      a[c.group].push(c);
      return a;
    }, {});

    setDataTable(
      Object.keys(obj)
        .map((key, idx) => {
          if (obj[key]?.length > 1) {
            return {
              ...obj[key][0],
              name: obj[key][0].groupName,
              children: obj[key],
              key: idx,
            };
          }
          return {
            ...obj[key][0],
            name: obj[key][0].groupName,
            key: idx,
          };
        })
        ?.sort((a, b) => {
          if (a.group === 'CUSTOMER') {
            return -1;
          } else if (b.group === 'CUSTOMER') {
            return 1;
          } else {
            return 0;
          }
        }),
    );
  };

  const [search, setSearch] = useState('');

  const { Option } = Select;
  const [form] = Form.useForm();
  const [selectedServices, setSelectedServices] = useState('');
  const [edit, setEdit] = useState(false);

  // const [formValues, setFormValues] = useState({});
  const [dataTable, setDataTable] = useState([]);

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
    setEdit(false);
  };

  const [handleChange] = HookDataTable({
    fullTextSearch: 'search',
    Get: SettingService.get,
    columns: ColumnServices(),
    loadFirst: false,
    className: 'table-service',
    rightHeader: (
      <div className="flex">
        <Select className="!w-48 !rounded-lg" placeholder="Trạng thái" allowClear>
          <Option value="WORKING">Đang sử dụng</Option>
          <Option value="NOT_TREAT">Ngưng sử dụng</Option>
        </Select>
      </div>
    ),
    bottomHeader: (
      <div className="flex gap-3">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <i className="las la-plus mr-1" />
          Thêm mới
        </button>
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-white text-red-500 rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <span className="icon-download  pr-2 pl-1" />
          Export
        </button>
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-white text-red-500 rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <span className="icon-download pr-2 pl-1" />
          Import
        </button>
      </div>
    ),
  });
  const location = useLocation();

  useEffect(() => {
    handleChange();
    getAllRole().then((res) => {
      if (res && res?.[0]?.id) {
        getRoleDetailById(res?.[0]?.id);
        getAllFeatures();
      }
    });
  }, [location.pathname]);

  useEffect(() => {
    if (servicesTitle.length > 0) {
      getAllFeatures();
    } else {
      setDataTable([]);
    }
  }, [servicesTitle.length]);

  const checkAll = (item) => {
    const find = roleDetail?.featureDtos?.find((i) => i.id === item.id);
    if (find) {
      if (find.add && find.edit && find.delete && find.export) {
        return true;
      }
    }
    return false;
  };

  const columns = [
    {
      title: 'Chức năng',
      dataIndex: 'name',
      key: 'name',
      // render: (name, item) =>
      //   !item?.children ? (
      //     <Checkbox checked={checkAll(item)} onChange={(e) => changeAll(e, item)}>
      //       {name}
      //     </Checkbox>
      //   ) : (
      //     <p className="inline">{name}</p>
      //   ),
      width: '50%',
      render: (name, item) => {
        return item?.children?.length > 0 ? (
          name
        ) : (
          <Checkbox checked={checkAll(item)} onChange={(e) => changeAll(e, item)}>
            {name}
          </Checkbox>
        );
      },
    },
    // {
    //   title: 'Xem',
    //   dataIndex: 'view',
    //   key: 'view',
    //   render: (_, item) => null
    // },
    {
      title: 'Thêm',
      dataIndex: 'add',
      key: 'add',
      width: '10%',
      render: (name, item) =>
        item?.children?.length > 0 ? (
          name
        ) : (
          <Checkbox
            checked={roleDetail?.featureDtos?.find((i) => i.id === item.id)?.add || false}
            onChange={(e) => handleChangeChecked(e, 'add', item)}
          />
        ),
    },
    {
      title: 'Sửa',
      dataIndex: 'edit',
      key: 'edit',
      width: '10%',

      render: (name, item) =>
        item?.children?.length > 0 ? (
          name
        ) : (
          <Checkbox
            checked={roleDetail?.featureDtos?.find((i) => i.id === item.id)?.edit || false}
            onChange={(e) => handleChangeChecked(e, 'edit', item)}
          />
        ),
    },
    {
      title: 'Xóa',
      dataIndex: 'delete',
      key: 'delete',
      width: '10%',
      render: (name, item) =>
        item?.children?.length > 0 ? (
          name
        ) : (
          <Checkbox
            checked={roleDetail?.featureDtos?.find((i) => i.id === item.id)?.delete || false}
            onChange={(e) => handleChangeChecked(e, 'delete', item)}
          />
        ),
    },
    {
      title: 'Export',
      dataIndex: 'export',
      key: 'export',
      width: '10%',
      render: (name, item) =>
        item?.children?.length > 0 ? (
          name
        ) : (
          <Checkbox
            checked={roleDetail?.featureDtos?.find((i) => i.id === item.id)?.export || false}
            onChange={(e) => handleChangeChecked(e, 'export', item)}
          />
        ),
    },
    {
      title: 'View All',
      dataIndex: 'viewAll',
      key: 'viewAll',
      width: '10%',
      // render: (_, item) =>
      //   !item?.children ? (
      //     <Checkbox
      //       checked={roleDetail?.featureDtos?.find((i) => i.id === item.id)?.export || false}
      //       onChange={(e) => handleChangeChecked(e, 'export', item)}
      //     />
      //   ) : null,
      render: (name, item) =>
        item?.children?.length > 0 ? (
          name
        ) : (
          <Checkbox
            checked={roleDetail?.featureDtos?.find((i) => i.id === item.id)?.viewAll || false}
            onChange={(e) => handleChangeChecked(e, 'viewAll', item)}
          />
        ),
    },
  ];

  const changeAll = async (e, item) => {
    const check = e.target.checked;
    if (roleDetail?.featureDtos?.findIndex((i) => i.id === item.id) !== -1) {
      const arr = roleDetail.featureDtos.map((i) => {
        if (i.id === item.id) {
          i.add = check;
          i.edit = check;
          i.delete = check;
          i.export = check;
          i.viewAll = check;
        }
        return i;
      });
      await SettingService.put({ ...roleDetail, featureDtos: arr }, roleDetail.id);
    } else {
      const data = {
        ...roleDetail,
        featureDtos: [
          ...roleDetail.featureDtos,
          { ...item, add: check, edit: check, delete: check, export: check, viewAll: check },
        ],
      };
      await SettingService.put(data, roleDetail.id).then((res) => {
        getRoleDetailById(roleDetail.id);
      });
      // eslint-disable-next-line no-undef
      // location.reload();
    }
    await getAllFeatures();
  };

  const handleChangeRole = (ele) => {
    setSelectedServices(ele.roleName);
    getRoleDetailById(ele.id);
  };

  const handleChangeChecked = async (e, str, item) => {
    if (roleDetail?.featureDtos?.findIndex((i) => i.id === item.id) !== -1) {
      const arr = roleDetail.featureDtos.map((i) => {
        if (i.id === item.id) {
          i[str] = e.target.checked;
        }
        return i;
      });
      await SettingService.put({ ...roleDetail, featureDtos: arr }, roleDetail.id).then((res) => {
        if (res && res.statusCode === 200) {
          getAllFeatures();
        }
      });
    } else {
      const param = { ...roleDetail, featureDtos: [...roleDetail.featureDtos, { ...item, [str]: e.target.checked }] };
      await SettingService.put(param, roleDetail.id).then((res) => {
        if (res && res.statusCode === 200) {
          getRoleDetailById(roleDetail.id);
          // getAllFeatures();
        }
      });
    }
  };
  const handleDeleteRole = async (ele) => {
    if (!ele) return;
    const res = await SettingService.delete({ roleCode: ele.roleCode, roleName: ele.roleName });
    if (res && res?.statusCode === 200) {
      handleChange();
      getAllRole().then((res) => {
        if (res && res?.[0]?.id) {
          getRoleDetailById(res?.[0]?.id);
          getAllFeatures();
        }
      });
    }
  };

  const handleEditRole = (ele) => {
    if (!ele) return;
    getRoleDetailById(ele.id).then((res) => {
      form.setFieldsValue(res);
      setShowModal(true);
      setEdit(true);
      getAllRole();
    });
  };

  const handleSubmit = async () => {
    const formData = form.getFieldsValue();
    const param = {
      roleName: formData?.roleName,
      roleCode: formData?.roleName ? convertTextToCode(formData?.roleName) : null,
      note: null,
      featureDtos: roleDetail?.featureDtos ? [...roleDetail.featureDtos] : [],
    };
    let res;
    edit
      ? (res = await SettingService.put({
          ...param,
          roleCode: roleDetail?.roleCode,
        }))
      : (res = await SettingService.post({
          ...param,
          featureDtos: [],
        }));
    if (res) {
      setShowModal(false);
      setEdit(false);
      form.resetFields();
      getAllRole().then((res) => {
        if (res && res?.[0]?.id) {
          getRoleDetailById(res?.[0]?.id);
          getAllFeatures();
        }
      });
    }
  };
  const dataSource = useMemo(() => {
    const result = [];
    const normalizeString = (str) => {
      return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    };

    if (!search) return dataTable;
    const searchInArray = (arr) => {
      for (const item of arr) {
        const normalizedItemName = normalizeString(item.name);
        const normalizedSearchQuery = normalizeString(search);

        if (normalizedItemName.includes(normalizedSearchQuery)) {
          result.push(item);
        }

        if (item?.children && item.children?.length > 0) {
          searchInArray(item.children);
        }
      }
    };

    searchInArray(dataTable);
    // const newData = dataTable?.map((i, idx) => ({ ...i, key: idx }))?.filter((i) => {
    //   if (!search) {

    //     return true;
    //   }

    //   if (normalizeString(i?.name)?.includes(normalizeString(search)) && !i?.children) {
    //     result.push(i)
    //     return true;
    //   } else if (i?.children?.length > 0) {
    //     const childrenReplace = JSON.parse(JSON.stringify(i?.children)).filter(
    //       (c) => normalizeString(c?.name).includes(normalizeString(search))
    //     );
    //     result.push({...i,children: childrenReplace})
    //     if (childrenReplace.length > 0) {
    //       return {
    //         ...i,
    //         children: childrenReplace.map((c, idx) => ({ ...c, key: idx }))
    //       };
    //     }
    //   }

    //   return false;
    // });

    return result;
  }, [dataTable, search]);

  return (
    <div className="min-h-screen setting">
      <div className="bg-white rounded-lg py-3 overflow-scroll services__wrap">
        <div className="flex justify-between border-b border-blue-50 pb-4 ">
          <div className="ml-3 font-semibold text-lg text-gray-900 ">{'Quản lý phân quyền'.toUpperCase()}</div>
        </div>
        <div className="flex p-3 gap-4 max-md:flex-col">
          <div className="w-1/3  max-md:w-full">
            <div className="border flex justify-between items-center h-14 bg-gray-200">
              <div className="text-lg font-bold text-gray-600 p-2">Vai trò</div>
              <div className="pr-2">
                <button
                  className="pr-2 w-24 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
                  type="button"
                  onClick={() => setShowModal(true)}
                >
                  <i className="las la-plus mr-1" />
                  Thêm
                </button>
              </div>
            </div>
            <div className="h-[400px] overflow-y-auto border border-gray-200">
              {servicesTitle.map((ele, index) => (
                <div
                  key={index}
                  className={classNames('border flex justify-between items-center h-[40px]', {
                    'text-red-500 bg-gray-100': selectedServices === ele.roleName,
                  })}
                  onClick={() => handleChangeRole(ele)}
                >
                  <button className="p-2">{ele.roleName}</button>
                  <Tooltip
                    placement="top"
                    trigger="click"
                    className="cursor-pointer flex-none category-tooltip z-10"
                    color="white"
                    title={
                      <div className="flex flex-col">
                        <button
                          className=" w-full py-[6px] px-4 rounded-t-lg hover:bg-gray-200"
                          onClick={() => handleEditRole(ele)}
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              width="11"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.9531 0.984375C10.4297 0.984375 9.90625 1.1875 9.5 1.59375L1.59375 9.5L1.5625 9.65625L1.01562 12.4062L0.859375 13.1406L1.59375 12.9844L4.34375 12.4375L4.5 12.4062L12.4062 4.5C13.2188 3.6875 13.2188 2.40625 12.4062 1.59375C12 1.1875 11.4766 0.984375 10.9531 0.984375ZM10.9531 1.9375C11.2051 1.9375 11.459 2.05273 11.7031 2.29688C12.1895 2.7832 12.1895 3.31055 11.7031 3.79688L11.3438 4.14062L9.85938 2.65625L10.2031 2.29688C10.4473 2.05273 10.7012 1.9375 10.9531 1.9375ZM9.15625 3.35938L10.6406 4.84375L4.59375 10.8906C4.26562 10.25 3.75 9.73438 3.10938 9.40625L9.15625 3.35938ZM2.46875 10.2188C3.06836 10.4609 3.53906 10.9316 3.78125 11.5312L2.14062 11.8594L2.46875 10.2188Z"
                                fill="#6B7280"
                              />
                            </svg>

                            <span style={{ color: '#6B7280' }}>Chỉnh sửa</span>
                          </div>
                        </button>
                        <hr />
                        <button
                          onClick={() => handleDeleteRole(ele)}
                          className="py-[6px] px-4 rounded-b-lg hover:bg-gray-200"
                          // type="primary"
                        >
                          <div className="flex items-center justify-center gap-2 ">
                            <svg
                              width="11"
                              height="12"
                              viewBox="0 0 11 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.5 0C4.23828 0 3.9707 0.091797 3.78125 0.28125C3.5918 0.470703 3.5 0.738281 3.5 1V1.5H0.5V2.5H1V10.5C1 11.3223 1.67773 12 2.5 12H8.5C9.32227 12 10 11.3223 10 10.5V2.5H10.5V1.5H7.5V1C7.5 0.738281 7.4082 0.470703 7.21875 0.28125C7.0293 0.091797 6.76172 0 6.5 0H4.5ZM4.5 1H6.5V1.5H4.5V1ZM2 2.5H9V10.5C9 10.7773 8.77734 11 8.5 11H2.5C2.22266 11 2 10.7773 2 10.5V2.5ZM3 4V9.5H4V4H3ZM5 4V9.5H6V4H5ZM7 4V9.5H8V4H7Z"
                                fill="#6B7280"
                              />
                            </svg>
                            <span style={{ color: '#6B7280' }}>Xóa vai trò</span>
                          </div>
                        </button>
                      </div>
                    }
                  >
                    <svg
                      width="20"
                      height="12"
                      viewBox="0 0 2 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2"
                    >
                      <path
                        d="M1 0C0.447266 0 0 0.447266 0 1C0 1.55273 0.447266 2 1 2C1.55273 2 2 1.55273 2 1C2 0.447266 1.55273 0 1 0ZM1 4C0.447266 4 0 4.44727 0 5C0 5.55273 0.447266 6 1 6C1.55273 6 2 5.55273 2 5C2 4.44727 1.55273 4 1 4ZM1 8C0.447266 8 0 8.44727 0 9C0 9.55273 0.447266 10 1 10C1.55273 10 2 9.55273 2 9C2 8.44727 1.55273 8 1 8Z"
                        fill="#9CA3AF"
                      />
                    </svg>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
          <div className="w-4/6 border max-md:w-full">
            <div className="relative w-[323px] max-w-[80%] mx-3 my-[10px]">
              <Input
                type="text"
                ref={searchRef}
                // id="simple-search"
                className="border border-gray-300 text-gray-900 text-sm  block w-full p-2.5  rounded-lg !bg-white"
                placeholder="Tìm kiếm"
                onPressEnter={(e) => setSearch(e.target.value)}
                onChange={(e) => {
                  setTimeout(() => {
                    setSearch(e.target.value);
                  }, 500);
                }}
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10 cursor-pointer">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400 "
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => setSearch(searchRef.current.input.value)}
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={dataSource}
              expandable={{
                defaultExpandAllRows: true,
              }}
              pagination={false}
            />
            {/* <TableFunction roleDetail={roleDetail} dataTable={dataTable} /> */}
          </div>
        </div>
        {/* ) : (
          <AddNew returnButton={returnButton} />
        )} */}
        <div>
          {showModal && (
            <Modal
              // bodyStyle={{ height: 175 }}
              centered
              destroyOnClose={true}
              title={
                <div className="flex justify-between">
                  <div className="text-base font-bold">{edit ? 'Chỉnh sửa vai trò' : 'Thêm vai trò'}</div>
                  <button
                    className=""
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    <span className="icon-x-close pr-2"></span>
                  </button>
                </div>
              }
              open={showModal}
              footer={null}
              className="min-w-min pb-0"
              closable={false}
              width={636}
            >
              <Form
                form={form}
                onFinishFailed={({ errorFields }) =>
                  errorFields.length && form.scrollToField(errorFields[0].name, { behavior: 'smooth' })
                }
                // onValuesChange={(_, values) => setFormValues((prevState) => ({ ...prevState, ...values }))}
                colon={false}
                className="min-w-min z-[1000]"
                onFinish={handleSubmit}
              >
                <Form.Item
                  label="Tên vai trò"
                  name="roleName"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên vai trò!',
                    },
                  ]}
                >
                  <Input
                    className="h-10 w-full text-sm font-normal block rounded-lg border !bg-white border-gray-200  py-[7px] px-4"
                    placeholder="Nhập tên vai trò"
                  />
                </Form.Item>

                <Form.Item>
                  <div className="flex items-center justify-center  border-solid gap-6 border-slate-200 rounded-b">
                    <button
                      className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-16 py-2 text-base font-medium  "
                      type="button"
                      onClick={() => {
                        handleCancel();
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      className="text-white bg-red-500 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300 rounded-lg px-16 py-2 text-base font-medium  hover:bg-red-600 hover:border-transparent outline-none focus:outline-none "
                      type="submit"
                    >
                      Lưu
                    </button>
                  </div>
                </Form.Item>
              </Form>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
