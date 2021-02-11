import React from 'react';
import PropTypes from 'prop-types';
import { i18n, withTranslation } from '../../../i18n';

const lang = { es: 'Español', eu: 'Euskera', en: 'English' };

const SimpleListItem = ({ data, handleClick, handleDelete, t }) => (
  <li className="border-t border-gray-200">
    <button
      type="button"
      onClick={handleClick}
      className="block w-full hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
    >
      <div className="flex items-center pr-4 pl-2 py-4 sm:pr-6">
        <div className="min-w-0 flex-1 flex items-center">
          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4 justify-items-start">
            {data.name.includes('{') ? (
              <div
                className={`text-sm leading-5 font-medium truncate ${
                  !JSON.parse(data.name)[i18n.language] && 'text-gray-400'
                }`}
              >
                {JSON.parse(data.name)[i18n.language] ||
                  t('no-name', { lang: lang[i18n.language] })}
              </div>
            ) : (
              <div className="text-sm leading-5 font-medium truncate">{data.name}</div>
            )}
          </div>
        </div>
        <div>
          <button
            type="button"
            className="py-1 px-4 border border-red-200 rounded-md text-sm leading-5 font-medium text-red-700 hover:bg-red-400 hover:text-red-100 focus:outline-none focus:border-red-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            {t('delete')}
          </button>
        </div>
      </div>
    </button>
  </li>
);

SimpleListItem.propTypes = {
  data: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  t: PropTypes.object.isRequired
};

export default withTranslation('common')(SimpleListItem);
