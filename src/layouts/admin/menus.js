import { SUPPER_ADMIN, keyRole, ORG_ADMIN } from 'variable';

const menuList = [
  {
    iconSvg: '/home.svg',
    name: 'Trang chủ',
    isDefaul: false,
    isAdmin: false,
    code: 'MANAGE_REPORT',
    routerName: 'Home',
  },
  {
    icon: 'las la-building',
    name: 'Quản lý tổ chức',
    isDefaul: false,
    isAdmin: true,
    routerName: 'Organization',
  },
  {
    icon: 'lab la-buffer',
    name: 'Quản lý khách hàng',
    code: 'MANAGE_CUSTOMER',
    group: 'CUSTOMER',
    routerName: 'Customer',
  },
  {
    icon: 'las la-calendar',
    name: 'Lịch hẹn',
    isDefaul: false,
    code: 'MANAGE_CALENDAR',
    routerName: 'AppointmentSchedule',
  },
  {
    icon: 'las la-donate',
    name: 'Thu chi',
    isDefaul: false,
    code: 'MANAGE_FINANCE',
    routerName: 'RevenueExpenditure',
  },
  {
    icon: 'las la-calculator',
    name: 'Kế toán',
    isOrgAdmin: true,
    code: 'MANAGE_ACCOUNTING',
    child: [
      {
        name: 'Chấm công',
        routerName: 'AccountingAttendance',
      },
      {
        name: 'Bảng lương',
        routerName: 'AccountingSalary',
      },
    ],
  },
  {
    icon: 'las la-tooth',
    name: 'Labo',
    isDefaul: false,
    code: 'MANAGE_LABO',
    routerName: 'Labo',
  },
  {
    icon: 'las la-users',
    name: 'Chăm sóc khách hàng',
    isDefaul: false,
    code: 'MANAGE_LABO',
    routerName: 'CustomerCare',
  },
  {
    icon: 'las la-warehouse',
    name: 'Quản lý kho',
    isDefaul: false,
    code: 'MANAGE_WAREHOUSE',
    routerName: 'InventoryManagement',
  },
  {
    icon: 'las la-user-tie',
    name: 'Quản lý người dùng',
    code: 'MANAGE_STAFF',
    isDefaul: false,
    routerName: 'UserManagement',
  },
  {
    icon: 'lar la-chart-bar',
    name: 'Báo cáo',
    isDefaul: false,
    isAdmin: false,
    code: 'MANAGE_REPORT',
    child: [
      {
        name: 'Báo cáo tổng quan',
        routerName: 'ReportOverview',
      },
      {
        name: 'Báo cáo ngày',
        routerName: 'ReportDate',
      },
      {
        name: 'Dự kiến doanh thu',
        routerName: 'ExpectedRevenue',
      },
      {
        name: 'Báo cáo chi nhánh',
        routerName: 'ReportBranch',
      },
      {
        name: 'Báo cáo lịch hẹn',
        routerName: 'ReportAppointment',
      },
    ],
  },
  {
    icon: 'las la-camera-retro',
    name: 'Thống kê camera',
    isDefaul: false,
    code: 'MANAGE_CAMERA',
    routerName: 'CameraStatistics',
  },
  {
    icon: 'las la-coins',
    name: 'Marketing',
    isOrgAdmin: true,
    routerName: 'Marketing',
  },
  {
    icon: 'las la-server',
    name: 'Danh mục',
    isDefaul: false,
    code: 'MANAGE_CATEGORY',
    child: [
      {
        name: 'Danh sách chi nhánh',
        routerName: 'Branchs',
      },
      {
        name: 'Dịch vụ',
        routerName: 'Services',
      },
      {
        name: 'Chuẩn đoán',
        routerName: 'ToothDiagnosis',
      },
      {
        name: 'Nhà cung cấp',
        routerName: 'Supplier',
      },
      {
        name: 'Vật tư',
        routerName: 'Supplies',
      },
      {
        name: 'Thuốc',
        routerName: 'Medicine',
      },
      {
        name: 'Tiêu chí kiểm kho',
        routerName: 'InventoryCriteria',
      },
      {
        name: 'Thông số Labo',
        routerName: 'LaboParameter',
      },
      {
        name: 'Quản lý thông tin khách',
        routerName: 'CustomerInformation',
      },
      {
        name: 'Loại chi phí',
        routerName: 'Costs',
      },
      {
        name: 'Khoản thu nhập cố định',
        routerName: 'OrderIncome',
      },
      {
        name: 'Mã khuyến mãi',
        routerName: 'Promotion',
      },
    ],
  },
  {
    icon: 'las la-cog',
    name: 'Thiết lập',
    isDefaul: false,
    code: 'MANAGE_SETTING',
    child: [
      {
        name: 'Phân quyền',
      },
      {
        name: 'Thông báo',
      },
    ],
  },
];

// filter when backend return permisson
export const permissionMenu = (roleCode = []) => {
  let menu = menuList;

  // Return this menu if user not select any branch
  if (!localStorage.getItem('branchUuid')) {
    menu = [
      {
        icon: 'las la-server',
        name: 'Danh mục',
        isDefaul: false,
        code: 'MANAGE_CATEGORY',
        child: [
          {
            name: 'Danh sách chi nhánh',
          },
        ],
      },
    ];
  }

  return menu.filter((ele) => {
    if (ele.isAdmin) {
      const roles = JSON.parse(localStorage.getItem(keyRole)) ?? [];
      return roles.includes(SUPPER_ADMIN);
    } else if (ele.isOrgAdmin) {
      const roles = JSON.parse(localStorage.getItem(keyRole)) ?? [];
      return roles.includes(ORG_ADMIN);
    }

    return (
      ele.isDefaul ||
      (roleCode?.find(
        (role) =>
          ele.code === role?.code && (!!role.add || !!role.edit || !!role.delete || !!role.export || !!role.viewAll),
      ) ??
        false) ||
      (roleCode?.find((role) => {
        return (
          ele.group === role?.group && (!!role.add || !!role.edit || !!role.delete || !!role.export || !!role.viewAll)
        );
      }) ??
        false)
    );
  });
};

const Layout = (roleCode = []) => {
  const layout = permissionMenu(roleCode);
  return layout;
};

export default Layout;
