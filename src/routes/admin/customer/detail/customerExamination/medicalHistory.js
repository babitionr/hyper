import { Checkbox } from 'antd';
import React from 'react';
import './index.less';
export const MedicalHistory = ({ pathological, setPathological }) => {
  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="w-full flex justify-between gap-4">
          <Checkbox.Group className="w-full" value={pathological}>
            <div className="w-full custom1">
              <Checkbox
                className="w-1/4"
                value={'HEARTDISEASE'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'HEARTDISEASE']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'HEARTDISEASE'));
                  }
                }}
              >
                Bệnh tim
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'HIGHBLOODPRESSURE'}
                onClick={(e) => {
                  console.log(e);
                  if (e.target.checked) {
                    setPathological([...pathological, 'HIGHBLOODPRESSURE']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'HIGHBLOODPRESSURE'));
                  }
                }}
              >
                Huyết áp cao
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'LOWBLOODPRESSURE'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'LOWBLOODPRESSURE']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'LOWBLOODPRESSURE'));
                  }
                }}
              >
                Huyết áp thấp
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'BLOODCLOTTINGDISORDER'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'BLOODCLOTTINGDISORDER']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'BLOODCLOTTINGDISORDER'));
                  }
                }}
              >
                Rối loạn đông máu
              </Checkbox>
            </div>
          </Checkbox.Group>
        </div>
        <div className="w-full flex justify-between gap-4">
          <Checkbox.Group className="w-full" value={pathological}>
            <div className="w-full custom1">
              <Checkbox
                className="w-1/4"
                value={'DIABETES'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'DIABETES']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'DIABETES'));
                  }
                }}
              >
                Tiểu đường
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'LIVERFAILURE'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'LIVERFAILURE']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'LIVERFAILURE'));
                  }
                }}
              >
                Suy gan
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'KIDNEYFAILURE'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'KIDNEYFAILURE']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'KIDNEYFAILURE'));
                  }
                }}
              >
                Suy thận
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'STOMACHACHE'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'STOMACHACHE']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'STOMACHACHE'));
                  }
                }}
              >
                Đau dạ dày
              </Checkbox>
            </div>
          </Checkbox.Group>
        </div>
        <div className="w-full flex justify-between gap-4">
          <Checkbox.Group className="w-full" value={pathological}>
            <div className="w-full custom1">
              <Checkbox
                className="w-1/4"
                value={'SINUSITIS'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'SINUSITIS']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'SINUSITIS'));
                  }
                }}
              >
                Viêm xoang
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'ASTHMA'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'ASTHMA']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'ASTHMA'));
                  }
                }}
              >
                Hen/Xuyễn
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'CATASTROPHE<2'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'CATASTROPHE<2']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'CATASTROPHE<2'));
                  }
                }}
              >
                Tai biến {'<'}2 năm
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'RADIOTHERAPY<8'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'RADIOTHERAPY<8']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'RADIOTHERAPY<8'));
                  }
                }}
              >
                Xạ trị {'<'}8 năm
              </Checkbox>
            </div>
          </Checkbox.Group>
        </div>
        <div className="w-full flex justify-between gap-4">
          <Checkbox.Group className="w-full" value={pathological}>
            <div className="w-full custom1">
              <Checkbox
                className="w-1/4"
                value={'EPILEPTIC'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'EPILEPTIC']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'EPILEPTIC'));
                  }
                }}
              >
                Động kinh
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'PARALYSIS'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'PARALYSIS']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'PARALYSIS'));
                  }
                }}
              >
                Liệt run
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'MEMORYDECLINE'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'MEMORYDECLINE']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'MEMORYDECLINE'));
                  }
                }}
              >
                Suy giảm trí nhớ
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'MENTALILLNESS'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'MENTALILLNESS']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'MENTALILLNESS'));
                  }
                }}
              >
                Tâm thần
              </Checkbox>
            </div>
          </Checkbox.Group>
        </div>
        <div className="w-full flex justify-between gap-4">
          <Checkbox.Group className="w-full" value={pathological}>
            <div className="w-full custom1">
              <Checkbox
                className="w-1/4"
                value={'USEWHEELCHAIR/CRUTCHES'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'USEWHEELCHAIR/CRUTCHES']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'USEWHEELCHAIR/CRUTCHES'));
                  }
                }}
              >
                Dùng xe lăn/nạng
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'WEARPACEMAKER'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'WEARPACEMAKER']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'WEARPACEMAKER'));
                  }
                }}
              >
                Mang máy trợ tim
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'WEARHEARINGAIDS'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'WEARHEARINGAIDS']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'WEARHEARINGAIDS'));
                  }
                }}
              >
                Mang máy trợ thính
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'WEARVENTILATOR'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'WEARVENTILATOR']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'WEARVENTILATOR'));
                  }
                }}
              >
                Mang máy trợ thở
              </Checkbox>
            </div>
          </Checkbox.Group>
        </div>
        <div className="w-full flex justify-between gap-4">
          <Checkbox.Group className="w-full" value={pathological}>
            <div className="w-full custom1">
              <Checkbox
                className="w-1/4"
                value={'HARDHEARING'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'HARDHEARING']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'HARDHEARING'));
                  }
                }}
              >
                Lãng tai
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'MUTE'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'MUTE']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'MUTE'));
                  }
                }}
              >
                Câm
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'DEAF'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'DEAF']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'DEAF'));
                  }
                }}
              >
                Khiếm thính
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'BLIND'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'BLIND']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'BLIND'));
                  }
                }}
              >
                Khiếm thị
              </Checkbox>
            </div>
          </Checkbox.Group>
        </div>
        <div className="w-full flex justify-between gap-4">
          <Checkbox.Group className="w-full" value={pathological}>
            <div className="w-full flex custom1">
              <div className="w-1/4 ml-2">
                &#9679;
                <span className="pl-2 font-bold underline">Cấy ghép:</span>
              </div>
              <Checkbox
                className="w-1/4"
                value={'ORTHODONTIC'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'ORTHODONTIC']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'ORTHODONTIC'));
                  }
                }}
              >
                Chỉnh nha
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'JOINTBITE'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'JOINTBITE']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'JOINTBITE'));
                  }
                }}
              >
                Cắn khớp
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'MAXILLOFACIALPATHOLOGY'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'MAXILLOFACIALPATHOLOGY']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'MAXILLOFACIALPATHOLOGY'));
                  }
                }}
              >
                Bệnh lý hàm mặt
              </Checkbox>
            </div>
          </Checkbox.Group>
        </div>
        <div className="w-full flex justify-between gap-4">
          <Checkbox.Group className="w-full" value={pathological}>
            <div className="w-full flex custom1">
              <div className="w-1/4 ml-2">
                &#9679;
                <span className="pl-2 font-bold underline">Phụ nữ:</span>
              </div>
              <Checkbox
                className="w-1/4"
                value={'PREGNANT'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'PREGNANT']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'PREGNANT'));
                  }
                }}
              >
                Mang thai
              </Checkbox>
              <Checkbox
                className="w-1/4"
                value={'BREASTFEEDING'}
                onClick={(e) => {
                  if (e.target.checked) {
                    setPathological([...pathological, 'BREASTFEEDING']);
                  } else {
                    setPathological(pathological.filter((e) => e !== 'BREASTFEEDING'));
                  }
                }}
              >
                Cho con bú
              </Checkbox>
            </div>
            <div className="w-1/4 ml-2"></div>
          </Checkbox.Group>
        </div>
      </div>
    </div>
  );
};
