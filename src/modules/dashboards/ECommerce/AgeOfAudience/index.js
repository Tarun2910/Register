import React from 'react';
import AudienceChart from './AudienceChart';
import {Box} from '@mui/material';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';
import AudienceCell from './AudienceCell';
import AppCard from '@crema/components/AppCardOne';
import AppList from '@crema/components/AppList';

const AgeOfAudience = ({audienceData}) => {
  const {messages} = useIntl();

  return (
    <AppCard
      // sxStyle={{height: 1}}
      // sx={{height: 'auto'}}

      title={messages['Organisation']}
      contentStyle={{
        paddingLeft: 0,
        paddingRight: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          padding: '8px 12px',
          height: audienceData.length !== 0 ? '14.3rem' : '18.9rem',
        }}
      >
        <AudienceChart audienceData={audienceData} />
      </Box>

      <AppList
        data={audienceData}
        renderRow={(audience) => (
          <AudienceCell key={'audience-' + audience.id} audience={audience} />
        )}
      />
    </AppCard>
  );
};

export default AgeOfAudience;

AgeOfAudience.propTypes = {
  audienceData: PropTypes.array,
};
