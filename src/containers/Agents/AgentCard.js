import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { parseI18nName } from 'utils';
import { withTranslation } from '../../../i18n';

const AgentCard = ({ data, t }) => (
  <div className="w-full flex flex-wrap items-center justify-between p-6 space-x-6">
    <Link
      href={{
        pathname: `/agents/${data.id}`,
        query: { id: data.id }
      }}
      as={`/agents/${data.id}`}
    >
      <a className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
        <div className="flex items-center text-sm leading-5 font-medium  truncate">
          {data.tradeName}
        </div>
        <div className="sm:flex sm:flex-col sm:justify-between">
          <div className="my-2 mr-2 flex-shrink-0 flex flex-wrap space-y-2">
            {data.scopes &&
              data.scopes.map((scope) => (
                <span className="px-4 py-1 text-sm leading-5 font-medium rounded-full bg-primary-light text-primary">
                  {parseI18nName(scope.name, t)}
                </span>
              ))}
            {data.sectors &&
              data.sectors.map((sector) => (
                <div className=" px-4 py-1 text-sm leading-5 font-medium rounded-full bg-primary-light text-primary">
                  {`${parseI18nName(sector.scopeName, t)} / ${parseI18nName(sector.name, t)}`}
                </div>
              ))}
            {data.subSectors &&
              data.subSectors.map((subSector, idx) => (
                <div
                  className={`${
                    idx !== data.subSectors.size - 1 ? 'mr-2 mb-2' : ''
                  } px-4 py-1 text-sm leading-5 font-medium rounded-full bg-primary-light text-primary`}
                >
                  {`${parseI18nName(subSector.scopeName, t)} / ${parseI18nName(
                    subSector.sectorName,
                    t
                  )} / ${parseI18nName(subSector.name, t)}`}
                </div>
              ))}
            {data.activities &&
              data.activities.map((activity, idx) => (
                <div
                  className={`${
                    idx !== data.activities.size - 1 ? 'mr-2 mb-2' : ''
                  } px-4 py-1 text-sm leading-5 font-medium rounded-full bg-primary-light text-primary`}
                >
                  {`${parseI18nName(activity.scopeName, t)} / ${parseI18nName(
                    activity.sectorName,
                    t
                  )} / ${parseI18nName(activity.subSectorName, t)} / ${parseI18nName(
                    activity.name,
                    t
                  )}`}
                </div>
              ))}
          </div>
          <div className="mt-2 flex items-center text-sm leading-5 text-gray-500 sm:mt-0">
            <span>{data.email ? data.email : ''}</span>
          </div>
        </div>
      </a>
    </Link>
  </div>
);

AgentCard.propTypes = {
  data: PropTypes.object.isRequired,
  t: PropTypes.object.isRequired
};

export default withTranslation('common')(AgentCard);
