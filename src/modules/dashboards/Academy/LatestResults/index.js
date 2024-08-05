import React from 'react';
import AppCard from '@crema/components/AppCardOne';
import AppList from '@crema/components/AppList';
import Box from '@mui/material/Box';
import AppLinearProgress from '@crema/components/AppLinearProgress';
import {useIntl} from 'react-intl';

import {Fonts} from '@crema/constants/AppEnums';
import PropTypes from 'prop-types';

const getColor = (percentage) => {
  if (percentage < 90) {
    return '#0A8FDC';
  }
  return '#F5585B';
};

const ResultItem = ({result}) => {
  return (
    <Box
      className='item-hover'
      sx={{
        px: 5,
        py: 3,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '50%',
          overflow: 'hidden',
        }}
      >
        <Box
          component='p'
          sx={{
            fontSize: 14,
            fontWeight: Fonts.MEDIUM,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'text.primary',
          }}
        >
          {result.chapter}
        </Box>
        {/* <Box
          component='p'
          sx={{
            ml: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'text.secondary',
          }}
        >
          - {result.topic}
        </Box> */}
      </Box>
      <Box
        sx={{
          pl: 4,
          width: '50%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AppLinearProgress
          style={{flex: 1, height: '0.4rem'}}
          value={result.percentage}
          activeColor={getColor(result.percentage)}
        />
        <Box
          sx={{
            pl: 2,
            color: getColor(result.percentage),
          }}
          component='span'
        >
          {result.percentage}%
        </Box>
      </Box>
    </Box>
  );
};

ResultItem.propTypes = {
  result: PropTypes.object,
};

const LatestResults = ({latestResults, user}) => {
  const {messages} = useIntl();

  const getData = (data) => {
    return data;
  };
  return (
    <AppCard
      // sxStyle={{minHeight: 'calc(100vh - 330px)'}}
      // sx={{height: 'auto'}}
      title={user ? messages['User'] : messages['department']}
      contentStyle={{px: 0}}
    >
      <AppList
        sx={{height: '19.6rem'}}
        animation='transition.slideRightBigIn'
        data={getData(latestResults)}
        renderRow={(data, index) => <ResultItem key={index} result={data} />}
      />
    </AppCard>
  );
};

export default LatestResults;

LatestResults.propTypes = {
  latestResults: PropTypes.array,
  user: PropTypes.any,
};
