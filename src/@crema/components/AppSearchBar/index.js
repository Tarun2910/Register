import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import SearchIcon from '@mui/icons-material/Search';
import {
  SearchIconBox,
  SearchIconWrapper,
  SearchInputBase,
  SearchWrapper,
} from './index.style';
import {useLocation} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {getStorageData} from 'redux/features/teamSyncSlice';
import _debounce from 'lodash/debounce';

const AppSearch = ({
  placeholder,
  iconPosition,
  align,
  overlap,
  onlyIcon,
  disableFocus,
  iconStyle,
  ...rest
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1];
  const [searchText, setSearchText] = useState('');

  const debounceFn = useCallback(
    _debounce(() => dispatch(getStorageData({searchText})), 1000),
    [],
  );

  useEffect(() => {
    if (currentPath === 'teamSync' && searchText) {
      debounceFn();
    }
  }, [searchText]);

  useEffect(() => {
    searchText && setSearchText('');
  }, [currentPath]);

  return (
    <SearchWrapper sx={rest.sx} iconPosition={iconPosition}>
      <SearchIconBox
        align={align}
        className={clsx(
          'searchRoot',
          {'hs-search': overlap},
          {'hs-disableFocus': disableFocus},
          {searchIconBox: onlyIcon},
        )}
      >
        <SearchIconWrapper
          className={clsx({
            right: true,
          })}
          style={iconStyle}
        >
          <SearchIcon />
        </SearchIconWrapper>
        <SearchInputBase
          {...rest}
          value={searchText}
          placeholder={placeholder || 'Search…'}
          inputProps={{'aria-label': 'search'}}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </SearchIconBox>
    </SearchWrapper>
  );
};

export default AppSearch;

AppSearch.propTypes = {
  iconPosition: PropTypes.string,
  align: PropTypes.string,
  placeholder: PropTypes.string,
  overlap: PropTypes.bool,
  borderLight: PropTypes.bool,
  className: PropTypes.string,
  onlyIcon: PropTypes.bool,
  disableFocus: PropTypes.bool,
  iconStyle: PropTypes.object,
};

AppSearch.defaultProps = {
  onlyIcon: false,
  overlap: true,
  iconPosition: 'left',
  align: 'left',
  iconStyle: {
    color: 'grey',
  },
};
