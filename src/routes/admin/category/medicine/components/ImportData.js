import React from 'react';
import { ImportDataService } from 'services/import-data';

function ImportData({ handleChange }) {
  const branchUuid = localStorage.getItem('branchUuid');
  const handleImportData = async (e) => {
    const file = e.target.files[0];
    const res = await ImportDataService.importMedicineOrMaterial(file, 'MEDICINE', branchUuid);
    if (res === 200) {
      handleChange && handleChange();
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
        type="button"
        onClick={() => {
          const element = document.createElement('a');
          element.href = 'https://dental-dev.s3.ap-southeast-1.amazonaws.com/image/template/materialImport.csv';
          element.click();
        }}
      >
        Tải Template
      </button>
      <div className="flex">
        <input type="file" id="files" className="hidden" onChange={(e) => handleImportData(e)} />
        <label htmlFor="files" className="flex">
          <div className="cursor-pointer flex rounded-lg items-center !border-gray-500 border !text-gray-500 !text-base font-medium px-4 py-2">
            <span className="pb-1 pr-2 pl-2">
              <svg
                width="16px"
                height="15px"
                viewBox="0 0 17 17"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                fill="#6b7280"
                stroke="#6b7280"
              >
                <path
                  d="M4.359 5.956l-0.718-0.697 4.859-5.005 4.859 5.005-0.718 0.696-3.641-3.75v10.767h-1v-10.767l-3.641 3.751zM16 9.030v6.47c0 0.276-0.224 0.5-0.5 0.5h-14c-0.276 0-0.5-0.224-0.5-0.5v-6.475h-1v6.475c0 0.827 0.673 1.5 1.5 1.5h14c0.827 0 1.5-0.673 1.5-1.5v-6.47h-1z"
                  fill="#000000"
                />
              </svg>
            </span>
            <span className="pr-2">Nhập file</span>
          </div>
        </label>
      </div>
    </div>
  );
}

export default ImportData;
