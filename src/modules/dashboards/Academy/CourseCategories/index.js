import React from 'react';
import AppCard from '@crema/components/AppCard';
import Box from '@mui/material/Box';
import Slider from 'react-slick';
import {Fonts} from '@crema/constants/AppEnums';
import PropTypes from 'prop-types';
import CourseSlider from './CourseSlider';
import {useNavigate} from 'react-router-dom';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const CourseCategories = ({course, thumbnailUrls}) => {
  const {title, desc, lessons, xp, chapterIds} = course;
  const chapterLength = chapterIds ? chapterIds.length : 0;
  const navigate = useNavigate();

  return (
    <AppCard
      sxStyle={{height: 1}}
      contentStyle={{padding: 0}}
      onClick={() => navigate(`/ecommerce/product_detail/${course.id}`)}
    >
      <CourseSlider>
        <Slider {...settings}>
          <Box>
            <img
              style={{height: '12rem'}}
              src={thumbnailUrls[course.courseThumbnail]}
              alt={thumbnailUrls[course.courseThumbnail]}
            />
          </Box>
        </Slider>
      </CourseSlider>
      <Box
        sx={{
          px: 4,
          pt: 3,
        }}
      >
        <Box
          component='h5'
          sx={{
            mb: 1,
            fontSize: 16,
            fontWeight: Fonts.BOLD,
          }}
        >
          {course.courseName}
        </Box>
        <Box
          component='p'
          sx={{
            mb: 4,
            color: 'text.secondary',
            maxHeight: '3rem', // Set the maximum height for the description
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {course.courseDescription}
        </Box>
        {/* <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              color: '#259BE0',
              backgroundColor: '#E7F4FC',
              padding: {xs: '3px 12px', xl: '3px 18px'},
              borderRadius: 30,
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              fontSize: 12,
              mr: 1,
              '& img': {
                mr: 1.25,
              },
            }}
          >
            <img
              src={'/assets/images/dashboard/academy/lessons.svg'}
              alt='lessons'
            />
            {chapterLength} Chapters
          </Box>
         
        </Box> */}
      </Box>
    </AppCard>
  );
};

export default CourseCategories;

CourseCategories.propTypes = {
  course: PropTypes.object,
  thumbnailUrls: PropTypes.any,
};
