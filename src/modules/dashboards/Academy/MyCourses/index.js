import React, {useState} from 'react';
import AppCard from '@crema/components/AppCard';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import AppList from '@crema/components/AppList';
import CourseCell from './CourseCell';
import {useIntl} from 'react-intl';
import PropTypes from 'prop-types';

const MyCourses = ({courses, thumbnailUrls}) => {
  const [selectedCategory, setSelectedCategory] = useState([]);

  const handleChangeCategory = (category) => {
    setSelectedCategory(category);
  };

  const {messages} = useIntl();

  return (
    <AppCard
      sxStyle={{height: 1}}
      title={messages['academy.myCourses']}
      contentStyle={{px: 0}}
      sx={{maxHeight: '400px', overflow: 'auto'}}
    >
      <Box
        sx={{
          mb: 2,
          px: 5,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {courses?.map((item, index) => (
          <Box
            sx={{
              mr: 3,
              mb: 1,
            }}
            key={index}
          >
            {/* <Chip
              onClick={() => handleChangeCategory(item.slug)}
              sx={{
                cursor: 'pointer',
                backgroundColor: (theme) =>
                  item.slug === selectedCategory
                    ? theme.palette.primary.main
                    : theme.palette.background.default,
                color: (theme) =>
                  item.slug === selectedCategory
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                '&:hover, &:focus': {
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.primary.contrastText,
                },
              }}
              key={index}
              label={item.title}
            /> */}
          </Box>
        ))}
      </Box>
      <AppList
        animation='transition.slideRightBigIn'
        data={courses}
        renderRow={(data, index) => (
          <CourseCell key={index} course={data} thumbnailUrls={thumbnailUrls} />
        )}
      />
    </AppCard>
  );
};

export default MyCourses;

MyCourses.propTypes = {
  courses: PropTypes.any,
  thumbnailUrls: PropTypes.any,
};
