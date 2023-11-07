import React from 'react';

export const ReceivingNotePage2 = ({ billType, dataSource }) => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'rgba(0, 0, 0, 0.85)', height: '100%' }}
    >
      {/* <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
  height: '100%',
  width: '100%',
              overflow: 'hidden',
              zIndex: -1,
              resize: 'auto',
              flexDirection: 'column',
justifyContent: 'center',
alignItems: 'center',



            }}>
              <div style={{
              objectFit: 'cover',
              maxWidth: '100%',
              // resizeMode: 'contain',
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
justifyContent: 'center',
alignItems: 'center',
textAlign: 'center',
            }}>
              <div style={{}}></div>
              <div></div>
 <img src="https://dental-dev.s3.ap-southeast-1.amazonaws.com/image/1692909219304-Screenshot_2023-08-19_201125.png" alt=""
            style={{
              width: '100%',
              height: 'max-content',
              opacity: 0.5,
              // resizeMode: 'contain',
            }}
            />
              <div style={{}}></div>
              </div>
      </div> */}
      <div className="">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontWeight: '700',
            fontFamily: 'timesNewsRoman',
            fontSize: '20px',
            textTransform: 'uppercase',
          }}
          onClick={() => {}}
        >
          Tình trạng và nhu cầu điều trị
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'start', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '25%' }}>
            <div className="font-bold" style={{ fontFamily: 'timesNewsRoman', fontWeight: '700' }}>
              Nhu cầu điều trị
            </div>{' '}
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '100%', gap: '0.5rem' }}>
            <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
              ...........................................................................................................................................................................................................................................................................
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '100%', gap: '0.5rem' }}>
            <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
              ...........................................................................................................................................................................................................................................................................
            </div>
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '25%' }}>
            <div className="font-bold" style={{ fontFamily: 'timesNewsRoman', fontWeight: '700' }}>
              Tình trạng
            </div>{' '}
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '100%', gap: '0.5rem' }}>
            <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
              ...........................................................................................................................................................................................................................................................................
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '100%', gap: '0.5rem' }}>
            <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
              ...........................................................................................................................................................................................................................................................................
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '100%', gap: '0.5rem' }}>
            <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
              ...........................................................................................................................................................................................................................................................................
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '100%', gap: '0.5rem' }}>
            <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
              ...........................................................................................................................................................................................................................................................................
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '100%', gap: '0.5rem' }}>
            <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
              ...........................................................................................................................................................................................................................................................................
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '100%', gap: '0.5rem' }}>
            <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
              ...........................................................................................................................................................................................................................................................................
            </div>
          </div>
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
            textTransform: 'uppercase',
          }}
          onClick={() => {}}
        >
          Kế hoạch điều trị
        </div>
      </div>

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
                  width: '16%',
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
                  width: '16%',
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
                  width: '44%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Kế hoạch điều trị
              </th>
              <th
                scope="col"
                style={{
                  width: '24%',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  fontFamily: 'timesNewsRoman',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Bác sĩ tư vấn
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
                      width: '16%',
                      height: '2.5rem',
                      textAlign: 'center',
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td
                    className=""
                    style={{
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      width: '16%',
                      height: '2.5rem',
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    16, 12, 22, 26, 36, 32, 42, 46
                  </td>
                  <td
                    className=""
                    style={{
                      width: '44%',
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      height: '2.5rem',
                      paddingLeft: '1.5rem',
                      paddingRight: '1.5rem',
                      paddingTop: '1.5rem',
                      paddingBottom: '1.5rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    Chữ ký xác nhận kế hoạch điều
                    trị11111111s1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                  </td>
                  <td
                    className=""
                    style={{
                      width: '24%',
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      height: '2.5rem',
                      paddingLeft: '1.5rem',
                      paddingRight: '1.5rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    Nguyeenx snvan sabdof mfndsfk
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div
            className="font-bold"
            style={{ fontFamily: 'timesNewsRoman', display: 'flex', justifyContent: 'start', fontWeight: '700' }}
          >
            Chữ ký xác nhận kế hoạch điều trị
          </div>
          <div style={{ fontFamily: 'timesNewsRoman', display: 'flex', justifyContent: 'start' }}>Bệnh nhân</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', marginRight: '35px' }}></div>
      </div>
    </div>
  );
};
