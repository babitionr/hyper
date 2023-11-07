const Util = (name, type) => {
  const organizationUuid = localStorage.getItem('keyOrganizationUuid') || '6ae98b31-fafe-45ac-98fa-cac81fa2aab6';
  const branchUuid = localStorage.getItem('branchUuid');
  const array = {
    Login: '/auth/login',
    ForgotPass: '/auth/forgot-password',
    ResetPass: '/auth/reset-password',
    SendOTP: '/auth/send-otp',
    'Trang chủ': '/',
    Home: '/',
    User: '/user',
    Policy: '/policy',
    Category: '/category',
    'Danh mục': '/category',
    CategoryCreate: '/category/create',
    CategoryEdit: '/category/edit',
    CategoryDetail: '/category/detail',
    'Lịch hẹn': '/appointment-schedule',
    AppointmentSchedule: '/appointment-schedule',
    Organization: '/organization',
    'Quản lý tổ chức': '/organization',
    'Quản lý khách hàng': '/customer',
    Customer: '/customer',
    CustomerDetail: '/customer/detail',
    UserManagement: '/userManagement',
    'Quản lý người dùng': '/userManagement',
    CustomerInformation: '/category/customerInformation',
    'Quản lý thông tin khách': '/category/customerInformation',
    ToothDiagnosis: '/category/toothDiagnosis',
    'Chuẩn đoán': '/category/toothDiagnosis',
    Marketing: '/marketing',
    MarketingDetail: '/marketing/detail',
    Services: '/category/services',
    'Dịch vụ': '/category/services',
    'Danh sách chi nhánh': '/category/branchs',
    Branchs: '/category/branchs',
    LaboParameter: '/category/labo-parameter',
    'Thông số Labo': '/category/labo-parameter',
    'Nhà cung cấp': '/category/supplier',
    Supplier: '/category/supplier',
    Medicine: '/category/medicine',
    Thuốc: '/category/medicine',
    Costs: '/category/costs',
    'Loại chi phí': '/category/costs',
    Supplies: '/category/supplies',
    'Vật tư': '/category/supplies',
    InventoryCriteria: '/category/inventory-criteria',
    'Tiêu chí kiểm kho': '/category/inventory-criteria',
    OrderIncome: '/category/other-incomes',
    'Khoản thu nhập cố định': '/category/other-incomes',
    Promotion: '/category/promotion',
    'Mã khuyến mãi': '/category/promotion',
    Labo: '/labo',
    InventoryManagement: '/inventory-management',
    'Quản lý kho': '/inventory-management',
    RevenueExpenditure: '/revenue-expenditure',
    'Thu chi': '/revenue-expenditure',
    RevenueExpenditureCreate: '/revenue-expenditure/create',
    RevenueExpenditureEdit: '/revenue-expenditure/edit',
    ImportInventoryManagementAddNew: '/inventory-management/importStock/addNew',
    InventoryControlCreate: '/inventory-control/create',
    ExportInventoryManagementAddNew: '/inventory-management/exportStock/addNew',
    Settings: '/setting',
    'Thiết lập': '/setting',
    'Phân quyền': '/setting/permission',
    Permission: '/setting/permission',
    Notification: '/setting/notification',
    'Thông báo': '/setting/notification',
    Profile: '/profile',
    'Thông tin cá nhân': '/profile',
    Report: '/report',
    'Báo cáo': '/report',
    ReportDate: '/report/report-date',
    'Báo cáo ngày': '/report/report-date',
    ExpectedRevenue: '/report/expected-revenue',
    'Dự kiến doanh thu': '/report/expected-revenue',
    ReportBranch: '/report/report-branch',
    'Báo cáo chi nhánh': '/report/report-branch',
    ReportOverview: '/report/report-overview',
    'Báo cáo tổng quan': '/report/report-overview',
    'Báo cáo lịch hẹn': '/report/report-appointment',
    ReportAppointment: '/report/report-appointment',
    ReportDateDetail: '/report/detail',
    CameraStatistics: '/camera-statistics',
    'Thống kê camera': '/camera-statistics',
    'Chấm công': '/accounting/attendance',
    AccountingAttendance: '/accounting/attendance',
    'Bảng lương': '/accounting/salary',
    AccountingSalary: '/accounting/salary',
    'Chi tiết bảng lương': '/accounting/salary/detail',
    SalaryDetail: '/accounting/salary/detail',
    'Làm thêm giờ': '/accounting/overtime',
    CustomerCare: '/customer-care',
    'Chăm sóc khách hàng': '/customer-care',

    OrganizationDemo: '/organizationDemo',
  }; // 💬 generate link to here

  const apis = {
    Dashboard: '/dashboard',
    Publish: '/publish',
    User: '/auth',
    Customer: `/${organizationUuid}/customer`,
    UserManagement: `/${organizationUuid}/user`,
    UserPosition: `/${organizationUuid}/user/position`,
    Master: `/${organizationUuid}/master`,
    Calendar: `/${organizationUuid}`,
    // Calendar: `/${organizationUuid}/${branchUuid}/calendar`,
    ServicesCategory: '/product-service',
    MasterDataService: '/product-service',
    MasterDataTeeth: '/teeth',
    CustomerTeethStory: '/teeth-story',
    Util: '/file',
    Branch: `/${organizationUuid}/branch`,
    Supplier: `/${organizationUuid}/supplier`,
    Promotion: `/promotion`,
    Role: `/${organizationUuid}/role`,
    SaleOrder: `/${branchUuid}/sale-order`,
    LaboParameter: `/${organizationUuid}/labo-parameter`,
    Labo: `/${organizationUuid}/labo`,
    ToothDiagnosis: `/tooth-diagnosis`,
    SaleOrderHistory: `/sale-order-history`,
    InventoryCriteria: `/inventory-criteria`,
    MaterialMedicine: `/material-medicine`,
    WarehousingBill: `/warehousing-bill`,
    InventoryBill: `/inventory-bill`,
    ReceiptPayment: `/receipt-payment`,
    ReceiptPaymentGroup: `/receipt-payment-group`,
    Notification: `/${organizationUuid}/notification`,
    CustomerExamination: `/customer-examination`,
    Costs: '/receipt-payment-group',
    Debt: '/receivable',
    Payment: '/payment',
    Report: '/report',
    Organization: `/organization`,
    Camera: `/${organizationUuid}/camera`,
    CustomerGroup: `/customer-group`,
    CustomerResource: `/customer-resource`,
    TimeKeeping: '/time-keeping',
    RevenueSetting: '/revenue-setting',
    Salary: '/salary',
    CustomerCare: '/customer-care',
  }; // 💬 generate api to here

  switch (type) {
    case 'api':
      return apis[name];
    default:
      return array[name];
  }
};
export default Util;