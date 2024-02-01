import React from 'react';
import Box from '@mui/material/Box';
import {Fonts} from '@crema/constants/AppEnums';
import AppCircularProgress from '@crema/components/AppCircularProgress';
import {alpha, useTheme} from '@mui/material';
import PropTypes from 'prop-types';
import CourseCategories from '../CourseCategories';
import {useNavigate} from 'react-router-dom';

const LearningItem = ({course, thumbnailUrls}) => {
  console.log(course, 'course');
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGoToPlayList = () => {
    navigate(`/ecommerce/playList/${course.id}`);
  };

  return (
    <Box
      className='item-hover'
      onClick={handleGoToPlayList}
      key={course.id}
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 2,
        px: 5,
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mr: 2,
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
            borderRadius: 1,
            padding: 1.5,
          }}
        >
          <img alt='' src={thumbnailUrls[course.courseThumbnail]} />
        </Box>
        <Box
          sx={{
            flex: 1,
            ml: 4,
          }}
        >
          <Box
            sx={{
              mb: 0.5,
              display: 'inline-block',
              fontWeight: Fonts.MEDIUM,
              fontSize: 14,
            }}
            component='h3'
          >
            {course.courseName}
          </Box>
          <Box
            component='p'
            sx={{
              fontSize: 14,
              color: 'text.secondary',
              mb: 1,
              maxHeight: '3rem',
              width: '20rem', // Set the maximum height for the description
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {course.courseDescription}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          ml: 'auto',
        }}
      >
        <AppCircularProgress
          minWidth={42}
          maxWidth={45}
          activeColor='#0A8FDC'
          value={course.progressPercent}
          valueStyle={{
            fontSize: 12,
            color: theme.palette.text.primary,
            fontWeight: Fonts.MEDIUM,
          }}
          thickness={3}
        />
      </Box>
    </Box>
  );
};

export default LearningItem;

LearningItem.propTypes = {
  course: PropTypes.object,
  thumbnailUrls: PropTypes.object,
};
