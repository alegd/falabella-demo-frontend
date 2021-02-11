import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from '../../../i18n';

const Pagination = ({ className, page, onPageChanged, size, total, t }) => {
  const generatePages = () => {
    const pagesAmount = Math.ceil(total / size);
    const pages = [];
    for (let i = 1; i <= pagesAmount; i += 1)
      pages.push(
        <button
          type="button"
          className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
          onClick={() => onPageChanged(i - 1)}
        >
          {i}
        </button>
      );

    return pages;
  };

  return (
    <div className={className}>
      {size < total && (
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            type="button"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
            onClick={() => onPageChanged(page - 1)}
            disabled={page !== 0}
          >
            {t('previous')}
          </button>
          <button
            type="button"
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
            onClick={() => onPageChanged(page + 1)}
            disabled={(page + 1) * size >= total}
          >
            {t('next')}
          </button>
        </div>
      )}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm leading-5 text-gray-700">
            {`${t('showing')} `}
            <span className="font-medium">{page * size + 1}</span>
            {` - `}
            <span className="font-medium">
              {(page + 1) * size < total ? (page + 1) * size : total}
            </span>
            {` ${t('of')} `}
            <span className="font-medium">{total}</span>
            {` ${t('results')}`}
          </p>
        </div>

        {size < total && (
          <div>
            <nav className="relative z-0 inline-flex shadow-sm">
              <button
                type="button"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
                aria-label="Previous"
                onClick={() => onPageChanged(page - 1)}
                disabled={page === 0}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {generatePages()}
              <button
                type="button"
                className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
                aria-label="Next"
                onClick={() => onPageChanged(page + 1)}
                disabled={(page + 1) * size >= total}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

Pagination.defaultProps = {
  className: ''
};

Pagination.propTypes = {
  className: PropTypes.string,
  page: PropTypes.number.isRequired,
  onPageChanged: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired
};

export default withTranslation('common')(Pagination);
