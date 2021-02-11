import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { i18n, withTranslation } from '../../../i18n';

const lang = { es: 'Español', eu: 'Euskera', en: 'English' };

const SimpleCard = ({ data, t }) => (
  <div className="w-full flex items-center justify-between p-6 space-x-6">
    <Link href="#">
      <div className="flex-1 truncate">
        {/* <div className="flex items-center space-x-3"> */}
        <h3 className="text-gray-900 text-sm leading-5 font-medium truncate">
          {data.name.includes('{') ? (
            <div className={`${!JSON.parse(data.name)[i18n.language] && 'text-gray-400'}`}>
              {JSON.parse(data.name)[i18n.language] || t('no-name', { lang: lang[i18n.language] })}
            </div>
          ) : (
            data.name
          )}
        </h3>
      </div>
      {/* <p className="mt-1 text-gray-500 text-sm leading-5 truncate">{data.email}</p> */}
      {/* </div> */}
      {/* <img
        className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=4&amp;w=256&amp;h=256&amp;q=60"
        alt=""
      /> */}
    </Link>
  </div>
);

SimpleCard.propTypes = {
  data: PropTypes.object.isRequired,
  t: PropTypes.object.isRequired
};

export default withTranslation('common')(SimpleCard);
