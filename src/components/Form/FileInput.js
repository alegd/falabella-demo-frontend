import React from 'react';
import PropTypes from 'prop-types';
import { RiUploadCloud2Line } from 'react-icons/ri';
import { MdClose as CloseIcon } from 'react-icons/md';

const FileInput = ({ fileName, label, name, onUpload, onDelete }) => (
  <>
    <div className="block text-sm font-medium leading-5 text-gray-700">{label}</div>
    <div className="mt-1 mb-3 flex rounded-md">
      <div className="relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-l-md text-gray-700 bg-gray-50 transition ease-in-out duration-150 w-full">
        {fileName}
      </div>
      {!fileName ? (
        <label
          htmlFor={name}
          className="w-72 flex flex-grow relative items-center px-4 py-2 bg-white rounded-r-md tracking-wide border border-l-0 cursor-pointer hover:bg-blue-200 text-gray-800"
        >
          <RiUploadCloud2Line className="mr-2 h-6 w-6 text-gray-700" />
          <input
            id={name}
            name={name}
            type="file"
            onChange={onUpload}
            accept="application/*"
            className="hidden"
          />
          {`Seleccionar ${label}`}
        </label>
      ) : (
        <button
          type="button"
          className="w-72 flex flex-grow relative items-center px-4 py-2 bg-red-400 rounded-r-md tracking-wide border border-l-0 cursor-pointer hover:bg-red-500 text-white"
          onClick={onDelete}
        >
          <CloseIcon className="mr-2 h-6 w-6 text-white" />
          {`{t('delete')} ${label}`}
        </button>
      )}
    </div>
  </>
);

FileInput.defaultProps = {
  fileName: '',
  label: ''
};

FileInput.propTypes = {
  fileName: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired
};

export default FileInput;
