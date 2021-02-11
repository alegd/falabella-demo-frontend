import React from 'react';
import PropTypes from 'prop-types';
import { i18n, withTranslation } from '../../../i18n';

const lang = { es: 'Español', eu: 'Euskera', en: 'English' };

const SubSectorListItem = ({ data, handleClick, handleDelete, t }) => (
  <tr onClick={handleClick}>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="text-sm leading-5 font-medium truncate text-gray-900">
          {data.name.includes('{') ? (
            <div className={` ${!JSON.parse(data.name)[i18n.language] && 'text-gray-400'}`}>
              {JSON.parse(data.name)[i18n.language] || t('no-name', { lang: lang[i18n.language] })}
            </div>
          ) : (
            data.name
          )}
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-600">
        {data.sectorName && data.sectorName.includes('{') ? (
          <div className={`${!JSON.parse(data.sectorName)[i18n.language] && 'text-gray-400'}`}>
            {JSON.parse(data.sectorName)[i18n.language] ||
              t('no-name', { lang: lang[i18n.language] })}
          </div>
        ) : (
          data.sectorName
        )}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
    </td>
  </tr>
);

SubSectorListItem.propTypes = {
  data: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  t: PropTypes.object.isRequired
};

export default withTranslation('common')(SubSectorListItem);
