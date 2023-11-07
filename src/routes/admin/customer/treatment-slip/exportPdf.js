import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { TimesBold } from 'assets/fonts/base64Convert/times-bold';
import { TimesNormal } from 'assets/fonts/base64Convert/times-normal';
import { PaymentService } from 'services/payment';
import { ReceivingNotePage1 } from './treatmentSlipPrintUI/ReceivingNotePage1';
import { ReceivingNotePage2 } from './treatmentSlipPrintUI/ReceivingNotePage2';
import { ReceivingNotePage3 } from './treatmentSlipPrintUI/ReceivingNotePage3';

export const ExportPdf = ({ billType, dataSource }) => {
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

  const [, setPaymentHistoryList] = useState([]);
  const init = async () => {
    const res = await PaymentService.getListPaymentByTreatmentSlipHistory({ saleOrderUuid: dataSource?.soUuid });
    setPaymentHistoryList(res.data?.content);
  };
  useEffect(() => {
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
            generatePDF();
          }}
        >
          <i className="las la-file-pdf text-2xl" />
          Xuất PDF
        </button>
      </div>
      <div className="hidden">
        <div
          id="rawPrint"
          style={
            {
              //  WebkitPrintColorAdjust: 'exact',
              //   colorAadjust: 'exact' ,
              //   printColorAdjust: 'exact',/* Firefox 97+, Safari 15.4+ */
              // backgroundSize: 'cover', backgroundPosition: 'center',
              // objectFit: 'cover', aspectRatio: 1 / 1,
              // backgroundImage: 'url(' + 'https://dental-dev.s3.ap-southeast-1.amazonaws.com/image/1692909219304-Screenshot_2023-08-19_201125.png' + ')'
            }
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '500px' }}>
            <ReceivingNotePage1 />
            <ReceivingNotePage2 />
            <ReceivingNotePage3 />
          </div>
        </div>
      </div>
    </div>
  );
};
