import React from 'react';
import { routerLinks } from 'utils';

export const pages = [
  {
    layout: React.lazy(() => import('../layouts/auth')),
    isPublic: true,
    child: [
      {
        path: routerLinks('Login'),
        component: React.lazy(() => import('./auth/login')),
        title: 'Login',
      },
      {
        path: routerLinks('ForgotPass'),
        component: React.lazy(() => import('./auth/forget-password')),
        title: 'Forgot Password',
      },
      {
        path: routerLinks('ResetPass'),
        component: React.lazy(() => import('./auth/reset-password')),
        title: 'Reset Password',
      },
      {
        path: routerLinks('SendOTP'),
        component: React.lazy(() => import('./auth/send-otp')),
        title: 'Send Otp',
      },
    ],
  },
  {
    layout: React.lazy(() => import('../layouts/policy')),
    isPublic: true,
    child: [
      {
        path: routerLinks('Policy'),
        component: React.lazy(() => import('./policy')),
        title: 'Policy',
      },
    ],
  },
  {
    layout: React.lazy(() => import('../layouts/public')),
    isPublic: true,
    child: [
      {
        path: routerLinks('OrganizationDemo'),
        component: React.lazy(() => import('./public/organization-demo/')),
        title: 'OrganizationDemo',
      },
    ],
  },
  {
    layout: React.lazy(() => import('../layouts/admin')),
    isPublic: false,
    child: [
      // {
      //   path: '/',
      //   component: routerLinks("Dashboard"),
      //   title: "Home",
      // },
      {
        path: routerLinks('Home'),
        // component: React.lazy(() => import('./admin/dashboard')),
        component: React.lazy(() => import('./admin/report/index.js')),
        title: 'Báo cáo ngày',
      },
      {
        path: routerLinks('Organization'),
        component: React.lazy(() => import('./admin/organization-management/')),
        title: 'Organization',
      },
      {
        path: routerLinks('Customer'),
        component: React.lazy(() => import('./admin/customer')),
        title: 'Customer',
      },
      {
        path: routerLinks('CustomerDetail'),
        component: React.lazy(() => import('./admin/customer/detail/customerDetail.js')),
        title: 'CustomerDetail',
      },
      {
        path: routerLinks('UserManagement'),
        component: React.lazy(() => import('./admin/userManagement')),
        title: 'User Management',
      },
      {
        path: routerLinks('CustomerInformation'),
        component: React.lazy(() => import('./admin/category/customerInformation')),
        title: 'Customer Information',
      },
      {
        path: routerLinks('ToothDiagnosis'),
        component: React.lazy(() => import('./admin/category/toothDiagnosis')),
        title: 'Tooth Diagnosis',
      },
      {
        path: routerLinks('Marketing'),
        component: React.lazy(() => import('./admin/marketing')),
        title: 'Marketing',
      },
      {
        path: routerLinks('MarketingDetail'),
        component: React.lazy(() => import('./admin/marketing/marketing-detail/marketingDetail.js')),
        title: 'MarketingDetail',
      },
      {
        path: routerLinks('Services'),
        component: React.lazy(() => import('./admin/category/services')),
        title: 'Services',
      },
      {
        path: routerLinks('User'),
        component: React.lazy(() => import('./admin/user')),
        title: 'User',
      },
      {
        path: routerLinks('AppointmentSchedule'),
        component: React.lazy(() => import('./admin/appointment-schedule')),
        title: 'AppointmentSchedule',
      },
      {
        path: routerLinks('Branchs'),
        component: React.lazy(() => import('./admin/category/branchs/index.js')),
        title: 'Branchs',
      },
      {
        path: routerLinks('LaboParameter'),
        component: React.lazy(() => import('./admin/category/laboParameter/index.js')),
        title: 'LaboParameter',
      },
      {
        path: routerLinks('Supplier'),
        component: React.lazy(() => import('./admin/category/supplier/index.js')),
        title: 'Supplier',
      },
      {
        path: routerLinks('Medicine'),
        component: React.lazy(() => import('./admin/category/medicine/index.js')),
        title: 'Medicine',
      },
      {
        path: routerLinks('Supplies'),
        component: React.lazy(() => import('./admin/category/supplies/index.js')),
        title: 'Supplies',
      },
      {
        path: routerLinks('InventoryCriteria'),
        component: React.lazy(() => import('./admin/category/inventoryCriteria/index.js')),
        title: 'InventoryCriteria',
      },
      {
        path: routerLinks('Costs'),
        component: React.lazy(() => import('./admin/category/costs/index.js')),
        title: 'Costs',
      },
      {
        path: routerLinks('OrderIncome'),
        component: React.lazy(() => import('./admin/category/other-incomes/index.js')),
        title: 'Khoản thu nhập cố định',
      },
      {
        path: routerLinks('Promotion'),
        component: React.lazy(() => import('./admin/category/promotion/index.js')),
        title: 'Promotion',
      },
      {
        path: routerLinks('Labo'),
        component: React.lazy(() => import('./admin/labo/index.js')),
        title: 'Labo',
      },
      {
        path: routerLinks('InventoryManagement'),
        component: React.lazy(() => import('./admin/inventory-management/index')),
        title: 'InventoryManagement',
      },
      {
        path: routerLinks('RevenueExpenditure'),
        component: React.lazy(() => import('./admin/revenue-expenditure/index.js')),
        title: 'Quản lý thu chi',
      },
      {
        path: routerLinks('RevenueExpenditureCreate'),
        component: React.lazy(() => import('./admin/revenue-expenditure/detail.js')),
        title: 'Quản lý thu chi',
      },
      {
        path: routerLinks('RevenueExpenditureEdit'),
        component: React.lazy(() => import('./admin/revenue-expenditure/detail.js')),
        title: 'Quản lý thu chi',
      },
      {
        path: routerLinks('ImportInventoryManagementAddNew'),
        component: React.lazy(() => import('./admin/inventory-management/tabs/import-stock/addNew')),
        title: 'ImportInventoryManagementAddNew',
      },
      {
        path: routerLinks('ExportInventoryManagementAddNew'),
        component: React.lazy(() => import('./admin/inventory-management/tabs/export-stock/addNew')),
        title: 'ExportInventoryManagementAddNew',
      },
      {
        path: routerLinks('InventoryControlCreate'),
        component: React.lazy(() => import('./admin/inventory-management/tabs/inventory-control/detail.js')),
        title: 'InventoryControlCreate',
      },
      {
        path: routerLinks('Permission'),
        component: React.lazy(() => import('./admin/setting/index.js')),
        title: 'Phân quyền',
      },
      {
        path: routerLinks('Notification'),
        component: React.lazy(() => import('./admin/setting/notication/index.js')),
        title: 'Quản lý thông báo',
      },
      {
        path: routerLinks('ReportDate'),
        component: React.lazy(() => import('./admin/report/index.js')),
        title: 'Báo cáo ngày',
      },
      {
        path: routerLinks('ReportDateDetail'),
        component: React.lazy(() => import('./admin/report/detail')),
        title: 'Báo cáo chi tiết',
      },
      {
        path: routerLinks('ExpectedRevenue'),
        component: React.lazy(() => import('./admin/report/expected-revenue/index.js')),
        title: 'Dự kiến doanh thu',
      },
      {
        path: routerLinks('ReportBranch'),
        component: React.lazy(() => import('./admin/report/report-branch/index.js')),
        title: 'Báo cáo chi nhánh',
      },
      {
        path: routerLinks('ReportOverview'),
        component: React.lazy(() => import('./admin/report/report-overview/index.js')),
        title: 'Báo cáo tổng quan',
      },
      {
        path: routerLinks('ReportAppointment'),
        component: React.lazy(() => import('./admin/report/report-appointment/index.js')),
        title: 'Báo cáo lịch hẹn',
      },
      {
        path: routerLinks('CustomerCare'),
        component: React.lazy(() => import('./admin/customer-care/index.js')),
        title: 'Chăm sóc khách hàng',
      },
      {
        path: routerLinks('Profile'),
        component: React.lazy(() => import('./admin/profile')),
        title: 'Profile',
      },
      {
        path: routerLinks('CameraStatistics'),
        component: React.lazy(() => import('./admin/camera-statistics')),
        title: 'Thống kê camera',
      },
      {
        path: routerLinks('Chấm công'),
        component: React.lazy(() => import('./admin/accounting/attendance')),
        title: 'Chấm công',
      },
      {
        path: routerLinks('Bảng lương'),
        component: React.lazy(() => import('./admin/accounting/salary')),
        title: 'Bảng lương',
      },
      {
        path: routerLinks('SalaryDetail'),
        component: React.lazy(() => import('./admin/accounting/salary/detailPage')),
        title: 'Chi tiết bảng lương',
      },
      {
        path: routerLinks('Làm thêm giờ'),
        component: React.lazy(() => import('./admin/accounting/overtime')),
        title: 'Làm thêm giờ',
      },
    ], // 💬 generate link to here
  },
];

export const arrayPaths = [];
pages.map((layout) => {
  const paths = [];
  layout.child.map((page) => {
    paths.push(page.path);
    return page;
  });
  arrayPaths.push(paths);
  return layout;
});
