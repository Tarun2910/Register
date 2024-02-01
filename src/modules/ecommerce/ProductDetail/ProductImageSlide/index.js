import React, {useEffect, useRef, useState} from 'react';
import '@brainhubeu/react-carousel/lib/style.css';
import {Button, Checkbox} from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import {styled} from '@mui/material/styles';

const BrainHubSliderRoot = styled(Box)(({theme}) => {
  return {
    position: 'relative',
    display: 'flex',
    '& .BrainhubCarousel__container': {
      marginLeft: 20,
      marginRight: 20,
      maxWidth: 300,
      [theme.breakpoints.up('sm')]: {
        maxWidth: 450,
      },
      '& .BrainhubCarousel': {
        height: '100%',
        maxHeight: 600,
        img: {
          width: '100%',
          height: '100%',
        },
      },
    },
    '& .BrainhubCarousel__dots': {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
      '& .BrainhubCarousel__thumbnail': {
        opacity: 1,
        backgroundColor: 'transparent',
        borderRadius: 10,
        marginBottom: 10,
        border: '1px solid #A0A5B9',
        '&.BrainhubCarousel__thumbnail--selected': {
          border: `solid 2px #7c7c7c`,
        },
      },
      flexDirection: 'column',
      '& img': {
        height: 80,
      },
    },
  };
});

const ProductImageSlide = ({
  product,
  thumbnailUrls,
  handleUnSubscribeCourse,
  handleSubscribeCourse,
  videoUrl,
}) => {
  const roles = sessionStorage.getItem('roles');
  const userRoles = roles ? JSON.parse(roles) : [];
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if the video element exists and is not null
    if (videoRef.current) {
      // Use the play() method to play the video
      videoRef.current.play().catch((error) => {
        // Autoplay was blocked, handle the error here
        console.error('Autoplay was blocked:', error);
      });
    }
  }, []);

  console.log(videoUrl[product.previewVideoFilename]);
  const URL = videoUrl[product.previewVideoFilename];
  return (
    <Grid item sm={12} md={4}>
      <BrainHubSliderRoot style={{display: 'flex', justifyContent: 'center'}}>
        <video
          ref={videoRef}
          key={product.courseThumbnail}
          id={'videoPlayer'}
          controls
          autoPlay
          muted
          type='video/mp4'
          poster={thumbnailUrls[product.courseThumbnail]}
          style={{
            width: '100%',
            height: '13rem',
            borderRadius: '1rem',
            objectFit: 'cover',
            position: 'relative',
          }}
        >
          <source
            src={
              'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
            }
          />
        </video>

        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
          }}
        ></Box>
      </BrainHubSliderRoot>
      {userRoles.includes('user') && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 5,
          }}
        >
          <Button
            variant='contained'
            color='primary'
            onClick={
              product.subscribed
                ? handleUnSubscribeCourse
                : handleSubscribeCourse
            }
            style={{marginRight: 20, width: 140}}
          >
            {product.subscribed ? 'UnSubscribe' : 'Subscribe'}
          </Button>
        </Box>
      )}
    </Grid>
  );
};

export default ProductImageSlide;

ProductImageSlide.propTypes = {
  product: PropTypes.object,
  thumbnailUrls: PropTypes.object,
  handleUnSubscribeCourse: PropTypes.func,
  handleSubscribeCourse: PropTypes.func,
  videoUrl: PropTypes.any,
};
