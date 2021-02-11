/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { i18n, withTranslation } from '../../../i18n';

const AutocompleteSelector = ({
  classes,
  handleSelection,
  options,
  placeholder,
  value,
  input: Input,
  label,
  id,
  name,
  t,
  ...rest
}) => {
  const filter = createFilterOptions();

  return (
    <Autocomplete
      {...rest}
      options={options}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        if (option.inputValue) {
          return option.inputValue;
        }
        return option.name.includes('{')
          ? JSON.parse(option.name)[i18n.language] || '-'
          : option.name || '';
      }}
      onChange={(event, newValue) => handleSelection(event, newValue)}
      filterOptions={(filteredOptions, params) => {
        const filtered = filter(filteredOptions, params);

        if (params.inputValue !== '') {
          filtered.push({
            inputValue: params.inputValue,
            name: `Agregar "${params.inputValue}"`
          });
        }

        return filtered;
      }}
      size="small"
      value={value}
      renderOption={(option) =>
        option.name.includes('{') ? JSON.parse(option.name)[i18n.language] || '-' : option.name
      }
      renderInput={(params) =>
        Input ? (
          <div ref={params.InputProps.ref}>
            <Input {...params.inputProps} placeholder={placeholder || 'Seleccione...'} />
          </div>
        ) : (
          <>
            <label
              className="block text-sm font-medium leading-5 w-1/3 text-gray-700"
              htmlForm={id}
            >
              {label}
            </label>
            <TextField
              {...params}
              placeholder={`${t('select')}...`}
              variant="outlined"
              InputProps={{
                ...params.InputProps
              }}
            />
          </>
        )
      }
    />
  );
};

AutocompleteSelector.defaultProps = {
  handleSelection: () => {},
  placeholder: '',
  value: {},
  input: null
};

AutocompleteSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSelection: PropTypes.func,
  input: PropTypes.func,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  t: PropTypes.object.isRequired,
  value: PropTypes.object
};

export default withTranslation('common')(AutocompleteSelector);
