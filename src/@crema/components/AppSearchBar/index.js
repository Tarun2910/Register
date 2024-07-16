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
import {useDispatch, useSelector} from 'react-redux';
import {getStorageData} from 'redux/features/teamSyncSlice';
import _debounce from 'lodash/debounce';
import {getUsersData} from 'redux/features/usersDashboardSlice';
import {getRolesData} from 'redux/features/rolesDataSlice';
import {getDepartmentsData} from 'redux/features/departmentsSlice';

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
  const {storageData} = useSelector((state) => state.teamSync);
  const {rolesData} = useSelector((state) => state.roles);
  const {userData} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1];
  const [searchText, setSearchText] = useState(null);

  const applicationName = sessionStorage.getItem('appName');

  const getStorageTableData = useCallback(
    _debounce((searchText) => {
      dispatch(getStorageData({searchText, pageNumber: 0, pageSize: 10}));
    }, 1000),
    [],
  );

  const getUsersTableData = useCallback(
    _debounce((searchText) => {
      dispatch(
        getUsersData({
          searchText,
          pageNumber: 0,
          applicationName,
        }),
      );
    }, 1000),
    [],
  );

  const getRolesTableData = useCallback(
    _debounce((searchText) => {
      dispatch(
        getRolesData({
          pageSize: 10,
          pageNumber: 0,
          searchText,
        }),
      );
    }, 1000),
    [],
  );

  const getDepartmentsTableData = useCallback(
    _debounce((searchText) => {
      dispatch(getDepartmentsData({pageNumber: 0, pageSize: 10, searchText}));
    }, 1000),
    [],
  );

  useEffect(() => {
    if (currentPath === 'teamSync' && searchText) {
      getStorageTableData(searchText);
    } else if (currentPath === 'user' && searchText) {
      getUsersTableData(searchText);
    } else if (currentPath === 'roles' && searchText) {
      getRolesTableData(searchText);
    } else if (currentPath === 'department' && searchText) {
      getDepartmentsTableData(searchText);
    }
  }, [searchText]);

  useEffect(() => {
    setSearchText('');
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
