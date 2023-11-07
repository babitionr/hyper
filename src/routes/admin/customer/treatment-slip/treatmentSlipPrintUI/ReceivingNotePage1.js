import React from 'react';
import moment from 'moment';

export const ReceivingNotePage1 = ({ dataSource, data, pathological, orgLogo }) => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'rgba(0, 0, 0, 0.85)', height: '100%' }}
    >
      {/* <div style={{
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
          }}
          onClick={() => {}}
        >
          {'PHIẾU ĐIỀU TRỊ'}
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
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '34%' }}>
            <div style={{ fontFamily: 'timesNewsRoman' }}>Tên khách hàng:</div>{' '}
            <div style={{ fontFamily: 'timesNewsRoman' }}>{data?.customerInfo?.fullName}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '0.95rem', width: '34%' }}>
            <div style={{ fontFamily: 'timesNewsRoman' }}>Ngày sinh:</div>{' '}
            <div style={{ fontFamily: 'timesNewsRoman' }}>
              {moment(data?.customerInfo?.dateOfBirth).format('DD/MM/YYYY')}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '32%' }}>
            <div style={{ fontFamily: 'timesNewsRoman' }}>Giới tính: </div>{' '}
            <div style={{ fontFamily: 'timesNewsRoman' }}>{data?.customerInfo?.gender === 'FEMALE' ? 'Nữ' : 'Nam'}</div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '0.95rem', width: '34%' }}>
            <div style={{ fontFamily: 'timesNewsRoman' }}>Quốc tịch:</div>{' '}
            <div style={{ fontFamily: 'timesNewsRoman' }}>{'Việt Nam'}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '66%' }}>
            <div style={{ fontFamily: 'timesNewsRoman' }}>Nghề nghiệp: </div>{' '}
            <div style={{ fontFamily: 'timesNewsRoman' }}>{data?.customerInfo?.jobTitle}</div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1.3rem' }}>
            <div style={{ fontFamily: 'timesNewsRoman', whiteSpace: 'nowrap' }}>Địa chỉ liên lạc:</div>
            <div style={{ fontFamily: 'timesNewsRoman', wordBreak: 'break-word' }}>
              {[
                data?.customerInfo?.address?.street,
                data?.customerInfo?.address?.mtWard?.name,
                data?.customerInfo?.address?.mtDistrict?.name,
                data?.customerInfo?.address?.mtProvince?.name,
              ]
                .filter((e) => !!e)
                .join(', ')}
            </div>
          </div>
        </div>
        {/* <div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '1.3rem' }}>
                  <div style={{ fontFamily: 'timesNewsRoman', whiteSpace: 'nowrap' }}>Thông tin liên lạc:</div>
                  <div style={{ fontFamily: 'timesNewsRoman', wordBreak: 'break-word' }}>{dataSource?.note}</div>
                </div>
              </div> */}
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '0.95rem', width: '34%' }}>
            <div style={{ fontFamily: 'timesNewsRoman' }}>Email:</div>{' '}
            <div style={{ fontFamily: 'timesNewsRoman' }}>{data?.customerInfo?.email}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '66%' }}>
            <div style={{ fontFamily: 'timesNewsRoman' }}>Số điện thoại: </div>{' '}
            <div style={{ fontFamily: 'timesNewsRoman' }}>{data?.customerInfo?.phoneNumber}</div>
          </div>
        </div>
        {/* <div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '1.3rem' }}>
                  <div style={{ fontFamily: 'timesNewsRoman', whiteSpace: 'nowrap' }}>Ghi chú:</div>
                  <div style={{ fontFamily: 'timesNewsRoman', wordBreak: 'break-word' }}>{dataSource?.note}</div>
                </div>
              </div> */}
      </div>
      <div style={{ display: 'flex', justifyContent: 'start', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '25%' }}>
            <div className="font-bold" style={{ fontFamily: 'timesNewsRoman', fontWeight: '700' }}>
              Cấy ghép:
            </div>{' '}
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('ORTHODONTIC')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Chỉnh nha'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('JOINTBITE')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Cắn khớp'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('MAXILLOFACIALPATHOLOGY')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Bệnh lý hàm mặt'}</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'start', flexDirection: 'column', gap: '0.5rem' }}>
        <div
          className="font-bold"
          style={{ fontFamily: 'timesNewsRoman', display: 'flex', justifyContent: 'start', fontWeight: '700' }}
        >
          Tiểu sử bệnh lý
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('HEARTDISEASE')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Bệnh tim'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('HIGHBLOODPRESSURE')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Huyết áp cao'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('LOWBLOODPRESSURE')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Huyết áp thấp'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('BLOODCLOTTINGDISORDER')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Rối loạn đông máu'}</div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('DIABETES')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Tiểu đường'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('LIVERFAILURE')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Suy gan'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('KIDNEYFAILURE')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Suy thận'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('STOMACHACHE')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Đau dạ dày'}</div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('SINUSITIS')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Viêm xoang'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('ASTHMA')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Hen/Xuyễn'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('CATASTROPHE<2')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Tai biến <2 năm'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('RADIOTHERAPY<8')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Xa trị <8 năm'}</div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('EPILEPTIC')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Động kinh'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('PARALYSIS')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Liệt run'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('MEMORYDECLINE')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Suy giảm trí nhớ'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('MENTALILLNESS')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Tâm thần'}</div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('USEWHEELCHAIR/CRUTCHES')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Dùng xe lăn/nạng'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('WEARPACEMAKER')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Mang máy trợ tim'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('WEARHEARINGAIDS')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Mang máy trợ thính'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('WEARVENTILATOR')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Mang máy trợ thở'}</div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('HARDHEARING')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Lãng tai'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('MUTE')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Câm'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('DEAF')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Khiếm thính'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('BLIND')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Khiếm thị'}</div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '25%' }}>
            <div className="font-bold" style={{ fontFamily: 'timesNewsRoman', fontWeight: '700' }}>
              Phụ nữ:
            </div>{' '}
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('PREGNANT')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Mang thai'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}>
            <div style={{ height: '26px', width: '20px' }}>
              <input
                style={{ height: '19px', width: '19px', marginTop: '-0.6px' }}
                type="checkbox"
                defaultChecked={pathological?.includes('BREASTFEEDING')}
              />
            </div>
            <div style={{ fontFamily: 'timesNewsRoman', textAlign: 'end' }}>{'Cho con bú'}</div>
          </div>
          <div style={{ display: 'flex', width: '25%', gap: '0.5rem' }}></div>
        </div>
        {/* <div style={{ display: 'flex' }}>
                <div style={{  display: 'flex', width: '100%',gap: '0.5rem', }}>
                  <div style={{ height: '26px', width: '20px' }}><input style={{ height: '19px', width: '19px', marginTop:'-0.6px' }} type="checkbox" checked="checked"/></div>
                  <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%'  }}>
                    {'Bệnh truyền nhiễm'}...........................................................................................................................................................................................................................................................................
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{  display: 'flex', width: '100%',gap: '0.5rem', }}>
                  <div style={{ height: '26px', width: '20px' }}><input style={{ height: '19px', width: '19px', marginTop:'-0.6px' }} type="checkbox" checked="checked"/></div>
                  <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%'  }}>
                    {'Ung thư'}...........................................................................................................................................................................................................................................................................
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{  display: 'flex', width: '100%',gap: '0.5rem', }}>
                  <div style={{ height: '26px', width: '20px' }}><input style={{ height: '19px', width: '19px', marginTop:'-0.6px' }} type="checkbox" checked="checked"/></div>
                  <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%'  }}>
                    {'Dị ứng thuốc'}...........................................................................................................................................................................................................................................................................
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{  display: 'flex', width: '100%',gap: '0.5rem', }}>
                  <div style={{ height: '26px', width: '20px' }}><input style={{ height: '19px', width: '19px', marginTop:'-0.6px' }} type="checkbox" checked="checked"/></div>
                  <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%'  }}>
                    {'Bệnh lý khác'}...........................................................................................................................................................................................................................................................................
                  </div>
                </div>
              </div> */}

        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '25%' }}>
            <div className="font-bold" style={{ fontFamily: 'timesNewsRoman', fontWeight: '700' }}>
              Ghi chú:
            </div>{' '}
          </div>
        </div>
        {data?.customerExamination?.examinationNote ? (
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', width: '100%', gap: '0.5rem' }}>
              <div style={{ fontFamily: 'timesNewsRoman', width: '100%', whiteSpace: 'pre-wrap' }}>
                {data?.customerExamination?.examinationNote}
              </div>
            </div>
          </div>
        ) : (
          <div>
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
        )}

        {/* <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', width: '25%' }}>
                  <div className="font-bold" style={{ fontFamily: 'timesNewsRoman', fontWeight: '700',  }}>Biết đến nha khoa từ</div>{' '}
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{  display: 'flex', width: '100%',gap: '0.5rem', }}>
                  <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%'  }}>
                  {'Bạn giới thiệu'}...........................................................................................................................................................................................................................................................................
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{  display: 'flex', width: '100%',gap: '0.5rem', }}>
                  <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%'  }}>
                  {'Phòng khám chuyển'}...........................................................................................................................................................................................................................................................................
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{  display: 'flex', width: '100%',gap: '0.5rem', }}>
                  <div style={{ fontFamily: 'timesNewsRoman', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%'  }}>
                  {'Tư vấn viên'}: {data?.customerExamination?.consultant?.fullName ?? '...........................................................................................................................................................................................................................................................................'}
                  </div>
                </div>
              </div> */}
      </div>

      <div style={{ display: 'flex', justifyContent: 'end', fontFamily: 'timesNewsRoman' }}>
        {`............., Ngày ${moment().format('DD')} tháng ${moment().format('MM')} năm ${moment().format('YYYY')}`}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', marginRight: '35px' }}>
          <div
            className="font-bold"
            style={{ fontFamily: 'timesNewsRoman', display: 'flex', justifyContent: 'center', fontWeight: '700' }}
          >
            Bác sĩ khám
          </div>
          <div style={{ fontFamily: 'timesNewsRoman', display: 'flex', justifyContent: 'center' }}>
            (Ký và ghi rõ họ tên)
          </div>
        </div>
      </div>
    </div>
  );
};
