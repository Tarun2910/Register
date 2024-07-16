import AppLoader from '@crema/components/AppLoader';
import React, {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import AppGridContainer from '@crema/components/AppGridContainerOne';
import AppAnimate from '@crema/components/AppAnimate';
import CardDetails from '../Crypto/CardDetails';
import {useGetDataApi} from '@crema/hooks/APIHooks';
import TeamsyncTable from './index';
import axios from 'axios';
import {Fonts} from '@crema/constants/AppEnums';
import {Box, Button, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {getStorageData} from 'redux/features/teamSyncSlice';

const TeamSyncTab = () => {
  const {storageData, storageDataIsSuccess} = useSelector(
    (state) => state.teamSync,
  );
  const dispatch = useDispatch();
  const [{apiData: cryptoData, loading}] = useGetDataApi('/dashboard/crypto');
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (storageDataIsSuccess) {
      dispatch(getStorageData({pageNumber: page, pageSize: 10}));
    }
  }, [page]);

  useEffect(() => {
    if (storageDataIsSuccess) {
      const transformedData = transformApiResponse(storageData);
      setList(transformedData);
    }
  }, [storageDataIsSuccess]);

  const handlegotoupgrade = () => {
    navigate('/upgrade');
  };

  const handleNaN = (value) => {
    return isNaN(value) ? 0 : value;
  };

  const formatStorageData = (data) => {
    if (
      !data ||
      !data.deptsAggregate ||
      !data.organizationStats ||
      !data.usersAggregate
    ) {
      return null;
    }
    return [
      {
        title: 'Departments',
        value: handleNaN(
          parseFloat(
            (
              (data.deptsAggregate.currentlyUsedStorage /
                data.deptsAggregate.totalAllocatedStorage) *
              100
            ).toFixed(2),
          ),
        ),
        activeColor: '#F04F47',
        income: `${handleNaN(
          (data.deptsAggregate.currentlyUsedStorage / 1024 / 1024).toFixed(2),
        )} MB`,
      },
      {
        title: 'Organization',
        value: handleNaN(
          parseFloat(
            (
              (data.organizationStats.currentlyUsedStorage /
                data.organizationStats.totalAllocatedStorage) *
              100
            ).toFixed(2),
          ),
        ),
        activeColor: '#0BBFDB',
        income: `${handleNaN(
          (
            data.organizationStats.currentlyUsedStorage /
            1024 /
            1024 /
            1024
          ).toFixed(2),
        )} GB`,
      },
      {
        title: 'Users',
        value: handleNaN(
          parseFloat(
            (
              (data.usersAggregate.currentlyUsedStorage /
                data.usersAggregate.totalAllocatedStorage) *
              100
            ).toFixed(2),
          ),
        ),
        activeColor: '#3D5AFE',
        income: `${handleNaN(
          (data.usersAggregate.currentlyUsedStorage / 1024 / 1024).toFixed(2),
        )} MB`,
      },
    ];
  };

  const totalUserCount = storageData?.totalUserCount || 0;
  const totalDeptCount = storageData?.totalDeptCount || 0;
  const activeUserCount = storageData?.activeUserCount || 0;
  const pendingUserCount = storageData?.pendingUserCount || 0;
  const inactiveUserCount = storageData?.inactiveUserCount || 0;

  const transformApiResponse = (data) => {
    if (!data) {
      return [];
    }

    const mapUserData = (user, userOrDept, status) => ({
      id: user.id || user.userId,
      userId: user.userId,
      deptName: user.deptName,
      accessLevel: user.accessLevel,
      accessCode: user.accessCode,
      displayStorage: user.displayStorage,
      allowedStorageInBytes: user.allowedStorageInBytes,
      currentStorageInBytes: user.currentStorageInBytes,
      allowedStorageInBytesDisplay: user.allowedStorageInBytesDisplay,
      usedPercent: user.usedPercent,
      deptUsername: user.deptUsername,
      deptDisplayUsername: user.deptDisplayUsername,
      roleName: user.roleName,
      displayRoleName: user.displayRoleName,
      tenantId: user.tenantId,
      licenseTier: user.licenseTier,
      isDMS_CreateType: user.isDMS_CreateType,
      userOrDept: userOrDept,
      active: user.active,
      status: status,
    });

    const userActiveStats =
      data.activeUserPerms?.map((user) =>
        mapUserData(user, 'User', 'active'),
      ) || [];
    const userPendingStats =
      data.pendingUserPerms?.map((user) =>
        mapUserData(user, 'User', 'pending'),
      ) || [];
    const userInactiveStats =
      data.inactiveUserPerms?.map((user) =>
        mapUserData(user, 'User', 'inactive'),
      ) || [];
    const deptStats =
      data.deptPerms?.map((dept) => mapUserData(dept, 'Department', 'dept')) ||
      [];

    return [
      ...userActiveStats,
      ...userInactiveStats,
      ...userPendingStats,
      ...deptStats,
    ];
  };

  return (
    <>
      <Box
        component='h2'
        variant='h2'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 15,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 3,
          },
        }}
      >
        <span>
          <Typography sx={{fontWeight: Fonts.SEMI_BOLD}}>TeamSync</Typography>
        </span>
        <Button
          color='primary'
          variant='outlined'
          size='small'
          onClick={handlegotoupgrade}
        >
          Activate new plan
        </Button>
      </Box>
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <AppGridContainer>
            <Grid item xs={12} md={12} lg={5}>
              <CardDetails
                cardDetails={formatStorageData(storageData)}
                activeUserCount={activeUserCount}
                totalUserCount={totalUserCount}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={7}>
              <TeamsyncTable
                storageData={list}
                list={list}
                setList={setList}
                totalUserCount={totalUserCount}
                pendingUserCount={pendingUserCount}
                activeUserCount={activeUserCount}
                inactiveUserCount={inactiveUserCount}
                totalDeptCount={totalDeptCount}
                setPage={setPage}
                page={page}
              />
            </Grid>
          </AppGridContainer>
        </AppAnimate>
      )}
    </>
  );
};

export default TeamSyncTab;
