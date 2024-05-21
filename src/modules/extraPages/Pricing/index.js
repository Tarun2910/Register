import React from 'react';
import {Box, Grid} from '@mui/material';
import PackageOne from './PackageOne';
import PackageFour from './PackageFour';
import PackageThree from './PackageThree';
import PackageTwo from './PackageTwo';
import AppGridContainer from '@crema/components/AppGridContainer';
import {pricingData} from '@crema/mockapi/fakedb/extraPages';
import {Fonts} from '@crema/constants/AppEnums';
import CustomizedBreadcrumbs from 'modules/muiComponents/navigation/Breadcrumbs/CustomizedBreadcrumbs';

const PricingListing = () => {
  return (
    <>
      <Box
        component='h2'
        variant='h2'
        sx={{
          fontSize: 15,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 4,
          },
        }}
      >
        <span>
          <CustomizedBreadcrumbs
            label='Upgrade Your Plan'
            link={`/upgrade`}
            showComponentName={window.location.pathname === `/upgrade`}
          />
        </span>
      </Box>
      <AppGridContainer>
        <Grid item xs={12}>
          <PackageOne pricing={pricingData.pricingOne} />
        </Grid>
        {/* <Grid item xs={12}>
        <PackageTwo pricing={pricingData.pricingTwo} />
      </Grid>
      <Grid item xs={12}>
        <PackageThree pricing={pricingData.pricingFour} />
      </Grid>
      <Grid item xs={12}>
        <PackageFour pricing={pricingData.pricingFour} />
      </Grid> */}
      </AppGridContainer>
    </>
  );
};

export default PricingListing;
