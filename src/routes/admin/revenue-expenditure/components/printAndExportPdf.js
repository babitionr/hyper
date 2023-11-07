import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import { TimesBold } from 'assets/fonts/base64Convert/times-bold';
import { TimesNormal } from 'assets/fonts/base64Convert/times-normal';
import { PaymentService } from 'services/payment';
import { SaleOrderService } from 'services/SaleOrder';
import { useAuth } from 'global';

export const PrintAndExportPdf = ({ billType, dataSource }) => {
  const { user } = useAuth();

  const printFunc = () => {
    console.log(dataSource);
    const content = document.getElementById('rawPrint');
    const pri = document.getElementById('ifmcontentstoprint').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.title = dataSource?.billNumber.replace(/\//g, '_');
    setTimeout(function () {
      pri.document.close();
      pri.focus();
      pri.print();
    }, 1000);
  };
  const generatePDF = () => {
    console.log(dataSource);

    // eslint-disable-next-line new-cap
    const report = new jsPDF({
      unit: 'pt',
      orientation: 'portrait',
      format: 'a4',
      lineHeight: 1.2,
    });

    report.addFileToVFS('times-bold.ttf', TimesBold);
    report.addFileToVFS('times-normal.ttf', TimesNormal);
    report.addFont('times-normal.ttf', 'timesNewsRoman', 'normal');
    report.addFont('times-bold.ttf', 'timesNewsRoman', 'bold');
    report.setFont('timesNewsRoman');
    report.setFontSize(22);
    console.log(report.getFontList());

    const eleHtml = document.querySelector('#rawPrint');
    // eleHtml.querySelectorAll('pre').forEach((element) => {
    //   element.style.fontFamily = 'VPSTuyenDucHoaBook';
    // });
    report.html(eleHtml, {
      callback: function (doc) {
        doc.setLanguage('vi');
        doc.save(`${dataSource?.billNumber}.pdf`);
      },
      autoPaging: 'text',
      x: 15,
      y: 5,
      width: 545,
      windowWidth: 675,
      margin: [10, 0, 10, 10],
    });
  };

  const [paymentHistoryList, setPaymentHistoryList] = useState([]);
  const [dataAllServiceSaleOrder, setDataAllServiceSaleOrder] = useState([]);

  const getAllServiecBySaleOrder = async () => {
    const resAllServiceSaleOrder = await SaleOrderService.GetDetailSaleOrderCopy(dataSource?.soUuid);
    const allService = resAllServiceSaleOrder.saleOrderServiceItemDtoList
      ?.map((ele) => {
        return {
          ...ele,
          serviceNamne: ele.productServiceDto?.name,
          doctorUserName: ele.doctorUserDto?.firstName,
          saleOrderServiceTeethDtoList: ele.saleOrderServiceTeethDtoList,
          teethNumber: ele?.saleOrderServiceTeethDtoList?.map((teeth) => teeth?.teethNumber).join(', '),
        };
      })
      .filter((ele) => !ele.deleteAction);
    setDataAllServiceSaleOrder(allService ?? []);
  };
  const init = async () => {
    const res = await PaymentService.getListPaymentByTreatmentSlipHistory({
      saleOrderUuid: dataSource?.soUuid,
      page: 1,
      perPage: 999,
    });
    setPaymentHistoryList(res.data?.content);
  };

  useEffect(() => {
    if (dataSource?.soUuid) {
      getAllServiecBySaleOrder();
    }
    if (Number(billType) === 1 && dataSource?.soUuid) {
      init();
    }
  }, [dataSource?.soUuid]);

  return (
    <div className="">
      <iframe id="ifmcontentstoprint" className="hidden"></iframe>
      <div className="flex gap-4">
        <button
          className="flex justify-center active:ring-2 ring-offset-1 ring-offset-rose-300 ring-rose-300  bg-rose-500 text-white rounded-lg border border-rose-500  items-center !text-base !font-medium h-11 px-2 gap-2"
          type="button"
          onClick={() => {
            printFunc();
          }}
        >
          <i className="las la-print text-2xl" />
          In
        </button>
        <button
          className="flex justify-center active:ring-2 ring-offset-1 ring-offset-rose-300 ring-rose-300  bg-rose-500 text-white rounded-lg border border-rose-500  items-center !text-base !font-medium h-11 px-2 gap-2"
          type="button"
          onClick={() => {
            generatePDF();
          }}
        >
          <i className="las la-file-pdf text-2xl" />
          Xuất PDF
        </button>
      </div>
      <div className="hidden">
        <div id="rawPrint">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'rgba(0, 0, 0, 0.85)' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                zIndex: -1,
                resize: 'auto',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  objectFit: 'cover',
                  maxWidth: '100%',
                  // resizeMode: 'contain',
                  display: 'flex',
                  height: '100%',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div style={{}}></div>
                <div></div>
                <img
                  src={user?.orgLogo ?? ''}
                  alt=""
                  style={{
                    // width: '100%',
                    width: 'max-content',
                    height: 'max-content',
                    opacity: !user?.orgLogo || user?.orgLogo === '' ? 0 : 0.2,
                    // resizeMode: 'contain',
                  }}
                />
                <div style={{}}></div>
              </div>
            </div>

            <div className="">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontFamily: 'timesNewsRoman',
                  fontSize: '20px',
                }}
                onClick={() => {}}
              >
                {Number(billType) === 1 ? 'PHIẾU THU' : 'PHIẾU CHI'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>-----o0o-----</div>
              <div style={{ display: 'flex', justifyContent: 'center', fontFamily: 'timesNewsRoman' }}>
                {' '}
                {`Ngày in phiếu : ${moment().format('DD/MM/YYYY')}`}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'start', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="font-bold" style={{ display: 'flex', justifyContent: 'start', fontWeight: '700' }}>
                THÔNG TIN CHUNG
              </div>
              {/* <div>
                <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem' }}>
                  <div style={{ fontFamily: 'timesNewsRoman' }}>Người tạo: </div>{' '}
                  <div style={{ fontFamily: 'timesNewsRoman' }}>{`Nguyễn Bình An`}</div>
                </div>
              </div> */}
              <div style={{ display: 'flex' }}>
                {Number(billType) === 2 && (
                  <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '50%' }}>
                    <div style={{ fontFamily: 'timesNewsRoman' }}>Người tạo:</div>{' '}
                    <div style={{ fontFamily: 'timesNewsRoman' }}>{dataSource?.createdByName}</div>
                  </div>
                )}
                {Number(billType) === 1 && (
                  <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '50%' }}>
                    <div style={{ fontFamily: 'timesNewsRoman' }}>Tên khách hàng:</div>{' '}
                    <div style={{ fontFamily: 'timesNewsRoman' }}>{dataSource?.customerName}</div>
                  </div>
                )}
                {Number(billType) === 1 && (
                  <div style={{ display: 'flex', justifyContent: 'start', gap: '0.80rem', width: '50%' }}>
                    <div style={{ fontFamily: 'timesNewsRoman' }}>Điện thoại: </div>{' '}
                    <div style={{ fontFamily: 'timesNewsRoman' }}>{dataSource?.customerPhoneNumber}</div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', justifyContent: 'start', gap: '0.95rem', width: '50%' }}>
                  <div style={{ fontFamily: 'timesNewsRoman' }}>Ngày xuất:</div>{' '}
                  <div style={{ fontFamily: 'timesNewsRoman' }}>
                    {moment(dataSource?.billDate).format('DD/MM/YYYY')}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '50%' }}>
                  <div style={{ fontFamily: 'timesNewsRoman' }}>Hình thức: </div>{' '}
                  <div style={{ fontFamily: 'timesNewsRoman' }}>
                    {dataSource?.form === 'CASH'
                      ? 'Tiền mặt'
                      : dataSource?.form === 'POS'
                      ? 'POS'
                      : dataSource?.form === 'INS'
                      ? 'Trả góp'
                      : 'Ngân hàng'}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '1.3rem' }}>
                  <div style={{ fontFamily: 'timesNewsRoman', whiteSpace: 'nowrap' }}>Nội dung:</div>
                  <div style={{ fontFamily: 'timesNewsRoman', wordBreak: 'break-word' }}>{dataSource?.note}</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                className="font-bold"
                style={{ display: 'flex', justifyContent: 'start', fontFamily: 'timesNewsRoman', fontWeight: '700' }}
              >{`Danh sách tiền thu`}</div>
              <table
                border={1}
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  WebkitPrintColorAdjust: 'exact',
                }}
              >
                <thead
                  className="border bg-gray-200 border-gray-300"
                  style={{
                    textTransform: 'uppercase',
                    backgroundColor: 'rgb(229, 231, 235, 1 )',
                    borderColor: 'rgb(209, 213, 219, 1 )',
                  }}
                >
                  {/* <table style={{ width: '100%' }}>
                        <thead className=" border bg-gray-200 border-gray-300"  style={{ textTransform: 'uppercase' }}> */}
                  <tr
                    // style={{ WebkitPrintColorAdjust: 'exact', backgroundColor: 'red'}}
                    style={{ height: '2.5rem' }}
                  >
                    <th
                      scope="col"
                      className="border border-gray-300"
                      style={{
                        fontFamily: 'timesNewsRoman',
                        borderWidth: '1px',
                        borderColor: 'rgb(209, 213, 219, 1 )',
                        width: '8%',
                        height: '2.5rem',
                        textAlign: 'center',
                      }}
                    >
                      STT
                    </th>
                    <th
                      scope="col"
                      style={{
                        fontFamily: 'timesNewsRoman',
                        borderWidth: '1px',
                        borderColor: 'rgb(209, 213, 219, 1 )',
                        width: '58%',
                        height: '2.5rem',
                        textAlign: 'center',
                      }}
                    >
                      Nội dung
                    </th>
                    <th
                      scope="col"
                      style={{
                        width: '34%',
                        borderWidth: '1px',
                        borderColor: 'rgb(209, 213, 219, 1 )',
                        fontFamily: 'timesNewsRoman',
                        height: '2.5rem',
                        textAlign: 'center',
                      }}
                    >
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataSource?.itemDtoList?.map((e, idx) => {
                    return (
                      <tr key={idx} className=" ">
                        <td
                          className=""
                          style={{
                            fontFamily: 'timesNewsRoman',
                            borderWidth: '1px',
                            borderColor: 'rgb(209, 213, 219, 1 )',
                            width: '8%',
                            height: '2.5rem',
                            textAlign: 'center',
                          }}
                        >
                          {idx + 1}
                        </td>
                        <td
                          className=""
                          style={{
                            width: '58%',
                            fontFamily: 'timesNewsRoman',
                            borderWidth: '1px',
                            borderColor: 'rgb(209, 213, 219, 1 )',
                            height: '2.5rem',
                            paddingLeft: '1.5rem',
                            paddingRight: '1.5rem',
                          }}
                        >
                          {e?.note}
                        </td>
                        <td
                          className=""
                          style={{
                            width: '34%',
                            fontFamily: 'timesNewsRoman',
                            borderWidth: '1px',
                            borderColor: 'rgb(209, 213, 219, 1 )',
                            height: '2.5rem',
                            paddingLeft: '1.5rem',
                            paddingRight: '1.5rem',
                          }}
                        >
                          {[e?.amount?.toLocaleString('de-DE') ?? 0, 'VND'].join(' ')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <div style={{ display: 'flex', gap: '3rem' }}>
                <div style={{ fontFamily: 'timesNewsRoman', fontWeight: '700' }}>Tổng tiền:</div>
                <div style={{ fontFamily: 'timesNewsRoman', fontWeight: '700' }}>
                  {[dataSource?.totalAmount?.toLocaleString('de-DE') ?? 0, 'VND'].join(' ')}
                </div>
              </div>
            </div>

            {dataSource?.soUuid && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div
                  className="font-bold"
                  style={{ display: 'flex', justifyContent: 'start', fontFamily: 'timesNewsRoman', fontWeight: '700' }}
                >{`Danh sách dịch vụ`}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <table
                    border={1}
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      WebkitPrintColorAdjust: 'exact',
                    }}
                  >
                    <thead
                      className="border bg-gray-200 border-gray-300"
                      style={{
                        textTransform: 'uppercase',
                        backgroundColor: 'rgb(229, 231, 235, 1 )',
                        borderColor: 'rgb(209, 213, 219, 1 )',
                      }}
                    >
                      {/* <table style={{ width: '100%' }}>
                        <thead className=" border bg-gray-200 border-gray-300"  style={{ textTransform: 'uppercase' }}> */}
                      <tr
                        // style={{ WebkitPrintColorAdjust: 'exact', backgroundColor: 'red'}}
                        style={{ height: '2.5rem' }}
                      >
                        <th
                          scope="col"
                          className="border border-gray-300"
                          style={{
                            fontFamily: 'timesNewsRoman',
                            borderWidth: '1px',
                            borderColor: 'rgb(209, 213, 219, 1 )',
                            width: '12%',
                            height: '2.5rem',
                            textAlign: 'center',
                          }}
                        >
                          Ngày
                        </th>
                        <th
                          scope="col"
                          className="border border-gray-300"
                          style={{
                            fontFamily: 'timesNewsRoman',
                            borderWidth: '1px',
                            borderColor: 'rgb(209, 213, 219, 1 )',
                            width: '12%',
                            height: '2.5rem',
                            textAlign: 'center',
                          }}
                        >
                          Số răng
                        </th>
                        <th
                          scope="col"
                          style={{
                            fontFamily: 'timesNewsRoman',
                            borderWidth: '1px',
                            borderColor: 'rgb(209, 213, 219, 1 )',
                            width: '21%',
                            height: '2.5rem',
                            textAlign: 'center',
                          }}
                        >
                          Điều trị đã thực hiện
                        </th>
                        <th
                          scope="col"
                          className="border border-gray-300"
                          style={{
                            fontFamily: 'timesNewsRoman',
                            borderWidth: '1px',
                            borderColor: 'rgb(209, 213, 219, 1 )',
                            width: '12%',
                            height: '2.5rem',
                            textAlign: 'center',
                          }}
                        >
                          Chi phí
                        </th>
                        <th
                          scope="col"
                          className="border border-gray-300"
                          style={{
                            fontFamily: 'timesNewsRoman',
                            borderWidth: '1px',
                            borderColor: 'rgb(209, 213, 219, 1 )',
                            width: '12%',
                            height: '2.5rem',
                            textAlign: 'center',
                          }}
                        >
                          Thanh toán
                        </th>
                        <th
                          scope="col"
                          className="border border-gray-300"
                          style={{
                            fontFamily: 'timesNewsRoman',
                            borderWidth: '1px',
                            borderColor: 'rgb(209, 213, 219, 1 )',
                            width: '12%',
                            height: '2.5rem',
                            textAlign: 'center',
                          }}
                        >
                          Còn lại
                        </th>
                        {/* <th
                      scope="col"
                      className="border border-gray-300"
                      style={{
                        fontFamily: 'timesNewsRoman',
                        borderWidth: '1px',
                        borderColor: 'rgb(209, 213, 219, 1 )',
                        width: '9%',
                        height: '2.5rem',
                        textAlign: 'center',
                      }}
                    >
                      Ngày hẹn
                    </th> */}
                        <th
                          scope="col"
                          style={{
                            width: '16%',
                            borderWidth: '1px',
                            borderColor: 'rgb(209, 213, 219, 1 )',
                            fontFamily: 'timesNewsRoman',
                            height: '2.5rem',
                            textAlign: 'center',
                          }}
                        >
                          Bác sĩ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataAllServiceSaleOrder?.map((e, idx) => {
                        const promotionAmount = e?.promotionAmount
                          ? e?.promotionAmount
                          : e?.promotionDto?.promotionType === 'PERCENT'
                          ? (Number(e?.totalPaymentAmount) * Number(e?.promotionDto?.amount)) / 100
                          : e?.promotionDto?.promotionType === 'CASH'
                          ? Number(e?.promotionDto?.amount)
                          : 0;
                        return (
                          <tr key={idx} className=" ">
                            <td
                              className=""
                              style={{
                                fontFamily: 'timesNewsRoman',
                                borderWidth: '1px',
                                borderColor: 'rgb(209, 213, 219, 1 )',
                                width: '12%',
                                height: '2.5rem',
                                textAlign: 'center',
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                              }}
                            >
                              {moment(e?.createdDate).format('DD-MM-YYYY')}
                            </td>
                            <td
                              className=""
                              style={{
                                fontFamily: 'timesNewsRoman',
                                borderWidth: '1px',
                                borderColor: 'rgb(209, 213, 219, 1 )',
                                width: '12%',
                                height: '2.5rem',
                                paddingLeft: '1rem',
                                paddingRight: '1rem',
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                              }}
                            >
                              {/* 16, 12, 22, 26, 36, 32, 42, 46 */}
                              {e?.teethNumber}
                            </td>
                            <td
                              className=""
                              style={{
                                width: '21%',
                                fontFamily: 'timesNewsRoman',
                                borderWidth: '1px',
                                borderColor: 'rgb(209, 213, 219, 1 )',
                                height: '2.5rem',
                                paddingLeft: '0.5rem',
                                paddingRight: '0.5rem',
                                paddingTop: '0.5rem',
                                paddingBottom: '0.5rem',
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                              }}
                            >
                              {e?.serviceNamne}
                              {/* Chữ ký xác nhận kế hoạch điều trị11111111s1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 */}
                            </td>
                            <td
                              className=""
                              style={{
                                fontFamily: 'timesNewsRoman',
                                borderWidth: '1px',
                                borderColor: 'rgb(209, 213, 219, 1 )',
                                width: '12%',
                                height: '2.5rem',
                                paddingLeft: '0.2rem',
                                paddingRight: '0.1rem',
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                              }}
                            >
                              {Number(e?.totalPaymentAmount - promotionAmount).toLocaleString('de-DE')} VND
                              {/* 700000000 VND */}
                            </td>
                            <td
                              className=""
                              style={{
                                fontFamily: 'timesNewsRoman',
                                borderWidth: '1px',
                                borderColor: 'rgb(209, 213, 219, 1 )',
                                width: '12%',
                                height: '2.5rem',
                                paddingLeft: '0.2rem',
                                paddingRight: '0.1rem',
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                              }}
                            >
                              {/* 700000000 VND */}
                              {e?.paidAmount.toLocaleString('de-DE')} VND
                            </td>
                            <td
                              className=""
                              style={{
                                fontFamily: 'timesNewsRoman',
                                borderWidth: '1px',
                                borderColor: 'rgb(209, 213, 219, 1 )',
                                width: '12%',
                                height: '2.5rem',
                                paddingLeft: '0.2rem',
                                paddingRight: '0.1rem',
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                              }}
                            >
                              {Number(e?.totalPaymentAmount - promotionAmount - e?.paidAmount).toLocaleString('de-DE')}{' '}
                              VND
                              {/* 700000000 VND */}
                            </td>
                            {/* <td
                          className=""
                          style={{
                            fontFamily: 'timesNewsRoman',
                            borderWidth: '1px',
                            borderColor: 'rgb(209, 213, 219, 1 )',
                            width: '10%',
                            height: '2.5rem',
                            paddingLeft: '0.3rem',
                            paddingRight: '0.3rem',
                            whiteSpace: 'pre-line',
                            wordBreak : 'break-word',

                          }}
                        >
                          16/07/2021
                        </td> */}
                            <td
                              className=""
                              style={{
                                width: '16%',
                                fontFamily: 'timesNewsRoman',
                                borderWidth: '1px',
                                borderColor: 'rgb(209, 213, 219, 1 )',
                                height: '2.5rem',
                                paddingLeft: '0.5rem',
                                paddingRight: '0.5rem',
                                paddingTop: '0.5rem',
                                paddingBottom: '0.5rem',
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                              }}
                            >
                              {e?.doctorUserName}
                              {/* Nguyeenx snvan sabdof mfndsfk */}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {Number(billType) === 1 && dataSource?.soUuid && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div
                  className="font-bold"
                  style={{ display: 'flex', justifyContent: 'start', fontFamily: 'timesNewsRoman', fontWeight: '700' }}
                >{`Lịch sử thanh toán`}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {paymentHistoryList?.reverse()?.map((e, idx) => {
                    return (
                      <div key={idx} style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', justifyContent: 'start', gap: '0.45rem', width: '70%' }}>
                          <div style={{ fontFamily: 'timesNewsRoman' }}>
                            Thanh toán đợt {idx + 1}{' '}
                            {e?.paymentDate && `(${moment(e?.paymentDate).format('DD/MM/YYYY HH:mm:ss')})`}:
                          </div>{' '}
                          <div style={{ fontFamily: 'timesNewsRoman' }}>
                            {`${Number(e?.paidAmount ?? 0).toLocaleString('de-DE')} VND`}
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'start', gap: '0.5rem', width: '30%' }}>
                          <div style={{ fontFamily: 'timesNewsRoman' }}>Còn lại: </div>{' '}
                          <div style={{ fontFamily: 'timesNewsRoman' }}>
                            {`${(Number(e?.totalAmount ?? 0) - Number(e?.paidAmount ?? 0)).toLocaleString(
                              'de-DE',
                            )} VND`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'end', fontFamily: 'timesNewsRoman' }}>
              {`............., Ngày ${moment().format('DD')} tháng ${moment().format('MM')} năm ${moment().format(
                'YYYY',
              )}`}
            </div>
            {Number(billType) === 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div
                    className="font-bold"
                    style={{
                      fontFamily: 'timesNewsRoman',
                      display: 'flex',
                      justifyContent: 'center',
                      fontWeight: '700',
                    }}
                  >
                    Khách hàng
                  </div>
                  <div style={{ fontFamily: 'timesNewsRoman', display: 'flex', justifyContent: 'center' }}>
                    (Ký và ghi rõ họ tên)
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div
                    className="font-bold"
                    style={{
                      fontFamily: 'timesNewsRoman',
                      display: 'flex',
                      justifyContent: 'center',
                      fontWeight: '700',
                    }}
                  >
                    Bác sĩ
                  </div>
                  <div style={{ fontFamily: 'timesNewsRoman', display: 'flex', justifyContent: 'center' }}>
                    (Ký và ghi rõ họ tên)
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div
                    className="font-bold"
                    style={{
                      fontFamily: 'timesNewsRoman',
                      display: 'flex',
                      justifyContent: 'center',
                      fontWeight: '700',
                    }}
                  >
                    Người thu
                  </div>
                  <div style={{ fontFamily: 'timesNewsRoman', display: 'flex', justifyContent: 'center' }}>
                    (Ký và ghi rõ họ tên)
                  </div>
                </div>
              </div>
            )}

            {Number(billType) === 2 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div
                    className="font-bold"
                    style={{
                      fontFamily: 'timesNewsRoman',
                      display: 'flex',
                      justifyContent: 'center',
                      fontWeight: '700',
                    }}
                  >
                    Người tạo
                  </div>
                  <div style={{ fontFamily: 'timesNewsRoman', display: 'flex', justifyContent: 'center' }}>
                    (Ký và ghi rõ họ tên)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
