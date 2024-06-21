import React from 'react';
import Grid from '@mui/material/Grid';
import AppGridContainer from '@crema/components/AppGridContainerOne';
import AppAnimate from '@crema/components/AppAnimate';
import {useGetDataApi} from '@crema/hooks/APIHooks';
import TotalBalance from './TotalBalance';
import Coins from './Coins';
import BuySell from './BuySell';
import TradingChart from './TradingChart';
import OrdersActivities from './OrdersActivities';
import TopStories from './TopStories';
import GainerLooser from './GainerLooser';
import ATCStatics from './ATCStatics';
import CardDetails from './CardDetails';
import QuickTransfer from './QuickTransfer';
import AppLoader from '@crema/components/AppLoader';

const Crypto = () => {
  const [{apiData: cryptoData, loading}] = useGetDataApi('/dashboard/crypto');

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <AppGridContainer>
            <Grid item xs={12} md={8} lg={6}>
              <CardDetails cardDetails={cryptoData.cardDetails} />
            </Grid>
            <Grid item xs={12} md={8} lg={6}>
              <TradingChart />
            </Grid>

            <Grid item xs={12} md={8} lg={6}>
              <OrdersActivities
                ordersActivities={cryptoData.ordersActivities}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <GainerLooser data={cryptoData.gainerLooser} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ATCStatics data={cryptoData.atcStatics} />
            </Grid>
          </AppGridContainer>
        </AppAnimate>
      )}
    </>
  );
};

export default Crypto;
