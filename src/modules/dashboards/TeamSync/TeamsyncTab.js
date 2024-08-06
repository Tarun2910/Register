import AppLoader from '@crema/components/AppLoader';
import React, {useEffect, useMemo, useState} from 'react';
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
import {getStorageData, resetStorageData} from 'redux/features/teamSyncSlice';
import TopStorageUsed from '../Academy/LatestResults';
import PieChartOrganisation from '../ECommerce/AgeOfAudience';
// import ActiveUserChart from '../ECommerce/TopInquiries';
import ActiveUserChart from '../CRM/TotalVisitor';
import LicenseGrid from '../LicenseGrid';

const TeamSyncTab = () => {
  const {storageData, storageDataIsSuccess} = useSelector(
    (state) => state.teamSync,
  );
  const dispatch = useDispatch();
  const [{apiData: cryptoData, loading}] = useGetDataApi('/dashboard/crypto');
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [departmentStat, setDepartmentStat] = useState([]);
  const [userStat, setUserStat] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getStorageData({pageNumber: page, pageSize: 10}));
  }, [page]);

  useEffect(() => {
    if (storageDataIsSuccess) {
      const transformedData = transformApiResponse(storageData);
      setList(transformedData);
    }
  }, [storageDataIsSuccess]);

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/dms_service_LM/api/dms_admin_service/topConsumers`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        top: '5',
        userName: sessionStorage.getItem('username'),
        isDepartment: 'false',
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);

        const transformedData = response.data.content.map((item) => {
          const percentage = (
            (item.currentStorageInBytes / item.allowedStorageInBytes) *
            100
          ).toFixed(2);
          return {
            id: item.id,
            chapter: item.deptDisplayUsername.replace(/<>/g, '.'), // Assuming 'userId' is the chapter field
            topic: item.deptDisplayUsername || 'No Department', // Fallback if deptName is null
            percentage: isNaN(percentage) ? 0 : percentage, // Set to 0 if percentage is NaN
          };
        });
        setUserStat(transformedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${window.__ENV__.REACT_APP_MIDDLEWARE}/dms_service_LM/api/dms_admin_service/topConsumers`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        top: '5',
        userName: sessionStorage.getItem('username'),
        isDepartment: true,
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        const transformedData = response.data.content.map((item) => {
          const percentage = (
            (item.currentStorageInBytes / item.allowedStorageInBytes) *
            100
          ).toFixed(2);
          return {
            id: item.id,
            chapter: item.deptDisplayUsername.replace(/<>/g, '.'), // Assuming 'userId' is the chapter field
            topic: item.deptDisplayUsername || 'No Department', // Fallback if deptName is null
            percentage: isNaN(percentage) ? 0 : percentage, // Set to 0 if percentage is NaN
          };
        });
        setDepartmentStat(transformedData);
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
          (data.deptsAggregate.totalAllocatedStorage / 1024 / 1024).toFixed(2),
        )} MB`,
        current: `${handleNaN(
          (data.deptsAggregate.currentlyUsedStorage / 1024 / 1024).toFixed(2),
        )} MB`,
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
          (data.usersAggregate.totalAllocatedStorage / 1024 / 1024).toFixed(2),
        )} MB`,
        current: `${handleNaN(
          (data.usersAggregate.currentlyUsedStorage / 1024 / 1024).toFixed(2),
        )} MB`,
      },
      // {
      //   title: 'Organization',
      //   value: handleNaN(
      //     parseFloat(
      //       (
      //         (data.organizationStats.currentlyUsedStorage /
      //           data.organizationStats.totalAllocatedStorage) *
      //         100
      //       ).toFixed(2),
      //     ),
      //   ),
      //   activeColor: '#0BBFDB',
      //   income: `${handleNaN(
      //     (
      //       data.organizationStats.currentlyUsedStorage /
      //       1024 /
      //       1024 /
      //       1024
      //     ).toFixed(2),
      //   )} GB`,
      // },
    ];
  };

  const transformPieChartData = (data) => {
    if (!data || !data.organizationStats) {
      return {pieChartData: [], cellListData: []};
    }

    const totalAllocatedStorageGB = (
      data.organizationStats.totalAllocatedStorage /
      (1024 * 1024 * 1024)
    ).toFixed(2);
    const currentlyUsedStorageGB = (
      data.organizationStats.currentlyUsedStorage /
      (1024 * 1024 * 1024)
    ).toFixed(2);
    const remainingAllocatedStorageGB = (
      totalAllocatedStorageGB - currentlyUsedStorageGB
    ).toFixed(2);

    const pieChartData = [
      {
        id: 1,
        title: 'Available',
        value: parseFloat(remainingAllocatedStorageGB),
        color: '#0A8FDC',
      },
      {
        id: 2,
        title: 'Used',
        value: parseFloat(currentlyUsedStorageGB),
        color: '#54B435',
      },
    ];

    const cellListData = [
      {
        id: 1,
        title: 'Used',
        value: parseFloat(currentlyUsedStorageGB),
        color: '#54B435',
      },
      {
        id: 2,
        title: 'Allocated',
        value: parseFloat(totalAllocatedStorageGB),
        color: '#0A8FDC',
      },
    ];

    return {pieChartData, cellListData};
  };

  const cardDetailsData = useMemo(
    () => formatStorageData(storageData),
    [storageData],
  );

  const {pieChartData, cellListData} = useMemo(
    () => transformPieChartData(storageData),
    [storageData],
  );

  const totalUserCount = storageData?.totalUserCount || 0;
  const totalDeptCount = storageData?.totalDeptCount || 0;
  const activeUserCount = storageData?.activeUserCount || 0;
  const pendingUserCount = storageData?.pendingUserCount || 0;
  const inactiveUserCount = storageData?.inactiveUserCount || 0;
  const licenseExpiry = storageData?.licenseExpiry;
  const totalUsersAllowedInLicenseTier =
    storageData?.totalUsersAllowedInLicenseTier || 0;

  const memoizedCardDetails = useMemo(
    () => formatStorageData(storageData),
    [storageData],
  );
  const memoizedTotalUserCount = useMemo(
    () => totalUserCount,
    [totalUserCount],
  );
  const memoizedActiveUserCount = useMemo(
    () => activeUserCount,
    [activeUserCount],
  );
  const memoizedInactiveUserCount = useMemo(
    () => inactiveUserCount,
    [inactiveUserCount],
  );
  const memoizedPendingUserCount = useMemo(
    () => pendingUserCount,
    [pendingUserCount],
  );
  const memoizedTotalUsersAllowedInLicenseTier = useMemo(
    () => totalUsersAllowedInLicenseTier,
    [totalUsersAllowedInLicenseTier],
  );

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

  const fakeData = [
    {id: 1, chapter: 'Finance', topic: 'Technology', percentage: 25},
    {
      id: 12,
      chapter: 'Information Tech',
      topic: 'IT & Service',
      percentage: 44,
    },
    {id: 9, chapter: 'Human Resource', topic: 'Ecology', percentage: 40},
    {id: 8, chapter: 'Tech support', topic: 'Real Estate', percentage: 15},
    {id: 16, chapter: 'Education', topic: 'Education', percentage: 76},
  ];

  // const totalVisitors = [
  //   {name: 'Excited', value: 15, color: '#4de18c'},
  //   {
  //     name: 'High Willingness',
  //     value: 20,
  //     color: '#43d3ec',
  //   },
  //   {
  //     name: 'Want To Know',
  //     value: 20,
  //     color: '#2b7ada',
  //   },
  //   {
  //     name: 'Interested',
  //     value: 15,
  //     color: '#cce56f',
  //   },
  //   {
  //     name: 'Low Willingness',
  //     value: 20,
  //     color: '#f16262',
  //   },
  //   {
  //     name: 'Not Interested',
  //     value: 10,
  //     color: '#f1a856',
  //   },
  // ];

  const totalVisitors = [
    {
      name: 'Active Users',
      value: activeUserCount,
      percent: ((activeUserCount / totalUserCount) * 100).toFixed(2),
      color: '#4de18c',
    },
    {
      name: 'Inactive Users',
      value: inactiveUserCount,
      percent: ((inactiveUserCount / totalUserCount) * 100).toFixed(2),
      color: '#f16262',
    },
    {
      name: 'Pending Users',
      value: pendingUserCount,
      percent: ((pendingUserCount / totalUserCount) * 100).toFixed(2),
      color: '#f1a856',
    },
  ];
  return (
    <>
      {/* <Box
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
      </Box> */}
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <AppGridContainer>
            <Grid item xs={12} md={12} lg={4}>
              <LicenseGrid
                cardDetails={memoizedCardDetails}
                totalUserCount={memoizedTotalUserCount}
                activeUserCount={memoizedActiveUserCount}
                inactiveUserCount={memoizedInactiveUserCount}
                pendingUserCount={memoizedPendingUserCount}
                totalUsersAllowedInLicenseTier={
                  memoizedTotalUsersAllowedInLicenseTier
                }
                licenseExpiry={licenseExpiry}
              />
              <CardDetails
                cardDetails={memoizedCardDetails}
                totalUserCount={memoizedTotalUserCount}
                activeUserCount={memoizedActiveUserCount}
                inactiveUserCount={memoizedInactiveUserCount}
                pendingUserCount={memoizedPendingUserCount}
                totalUsersAllowedInLicenseTier={
                  memoizedTotalUsersAllowedInLicenseTier
                }
                licenseExpiry={licenseExpiry}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={4} sx={{pl: '16px !important'}}>
              <PieChartOrganisation
                audienceData={pieChartData}
                cellListData={cellListData}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={4} sx={{pl: '16px !important'}}>
              <ActiveUserChart
                totalVisitors={totalVisitors}
                totalUserCount={totalUserCount}
              />
            </Grid>
            <Grid item xs={12} md={12} lg={6} sx={{pt: '16px !important'}}>
              <TopStorageUsed latestResults={userStat} user={true} />
            </Grid>
            <Grid
              item
              xs={12}
              md={12}
              lg={6}
              sx={{pl: '16px !important', pt: '16px !important'}}
            >
              <TopStorageUsed latestResults={departmentStat} user={false} />
            </Grid>
          </AppGridContainer>
        </AppAnimate>
      )}
    </>
  );
};

export default TeamSyncTab;

{
  /* <TeamsyncTable
    storageData={list}
    list={list}
    setList={setList}
    totalUserCount={totalUserCount}
    pendingUserCount={pendingUserCount}
    activeUserCount={activeUserCount}
    inactiveUserCount={inactiveUserCount}
    totalUsersAllowedInLicenseTier={totalUsersAllowedInLicenseTier}
    totalDeptCount={totalDeptCount}
    setPage={setPage}
    page={page}
  /> */
}
