import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { parseI18nName } from 'utils';
import { withTranslation } from '../../../i18n';

const AgentListItem = ({ data, onUpdate, onDelete, t }) => (
  <Link href="/agents/[id]" as={`/agents/${data.get('id')}`}>
    <tr className="cursor-pointer hover:bg-gray-100">
      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
        {data.get('tradeName')}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-600">
        {data.get('municipalityName') ? data.get('municipalityName') : ''}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-600">
        {data.get('email') ? data.get('email') : ''}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium">
        {data.get('scopes') &&
          data
            .get('scopes')
            .map((scope) => (
              <div className="mb-1 mr-1 px-4 py-1 text-sm leading-5 font-medium rounded-full bg-primary-light text-primary">
                {parseI18nName(scope.get('name'), t)}
              </div>
            ))}
        {data.get('sectors') &&
          data
            .get('sectors')
            .map((sector) => (
              <div className="mb-1 mr-1 px-4 py-1 text-sm leading-5 font-medium rounded-full bg-primary-light text-primary">
                {`${parseI18nName(sector.get('scopeName'), t)} / ${parseI18nName(
                  sector.get('name'),
                  t
                )}`}
              </div>
            ))}
        {data.get('subSectors') &&
          data
            .get('subSectors')
            .map((subSector) => (
              <div className="mb-1 mr-1 px-4 py-1 text-sm leading-5 font-medium rounded-full bg-primary-light text-primary">
                {`${parseI18nName(subSector.get('scopeName'), t)} / ${parseI18nName(
                  subSector.get('sectorName'),
                  t
                )} / ${parseI18nName(subSector.get('name'), t)}`}
              </div>
            ))}
        {data.get('activities') &&
          data
            .get('activities')
            .map((activity) => (
              <div className="mb-1 mr-1 px-4 py-1 text-sm leading-5 font-medium rounded-full bg-primary-light text-primary">
                {`${parseI18nName(activity.get('scopeName'), t)} / ${parseI18nName(
                  activity.get('sectorName'),
                  t
                )} / ${parseI18nName(activity.get('subSectorName'), t)} / ${parseI18nName(
                  activity.get('name'),
                  t
                )}`}
              </div>
            ))}
      </td>

      <td className="w-56 px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
        <button
          type="button"
          className="mr-2 py-1 px-4 border border-grey-200 rounded-md text-sm leading-5 font-medium text-grey-600 hover:bg-blue-100 focus:outline-none focus:border-gray-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            onUpdate(data.get('id'));
          }}
        >
          {t('update')}
        </button>
        <button
          type="button"
          className="py-1 px-4 border border-red-200 rounded-md text-sm leading-5 font-medium text-red-700 hover:bg-red-400 hover:text-red-100 focus:outline-none focus:border-red-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(data.get('id'));
          }}
        >
          {t('delete')}
        </button>
      </td>
    </tr>
  </Link>
);

AgentListItem.propTypes = {
  data: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation('common')(AgentListItem);
