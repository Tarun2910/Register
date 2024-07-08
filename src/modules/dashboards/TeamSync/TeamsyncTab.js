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

const TeamSyncTab = () => {
  const [{apiData: cryptoData, loading}] = useGetDataApi('/dashboard/crypto');
  const [storageData, setStorageData] = useState([]);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/dms_service_LM/api/dms_admin_service/storageStats`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
        username: sessionStorage.getItem('username'),
        pageSize: '10',
        pageNumber: page,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response, 'response');
        setStorageData(response?.data);
        const transformedData = transformApiResponse(response?.data);

        setList(transformedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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

  const transformApiResponse = (data) => {
    if (!data) {
      return [];
    }

    const userStats =
      data.userPerms?.map((user) => ({
        id: user.id,
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
        userOrDept: 'User',
        active: user.active,
      })) || [];

    const deptStats =
      data.deptPerms?.map((dept) => ({
        id: dept.id,
        userId: dept.userId,
        deptName: dept.deptName,
        accessLevel: dept.accessLevel,
        accessCode: dept.accessCode,
        displayStorage: dept.displayStorage,
        allowedStorageInBytes: dept.allowedStorageInBytes,
        currentStorageInBytes: dept.currentStorageInBytes,
        allowedStorageInBytesDisplay: dept.allowedStorageInBytesDisplay,
        usedPercent: dept.usedPercent,
        deptUsername: dept.deptUsername,
        deptDisplayUsername: dept.deptDisplayUsername,
        roleName: dept.roleName,
        displayRoleName: dept.displayRoleName,
        tenantId: dept.tenantId,
        licenseTier: dept.licenseTier,
        isDMS_CreateType: dept.isDMS_CreateType,
        userOrDept: 'Department',
        active: dept.active,
      })) || [];

    return [...userStats, ...deptStats];
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
