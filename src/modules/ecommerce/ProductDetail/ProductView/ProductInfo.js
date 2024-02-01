import React, {useEffect, useState} from 'react';
import {Box, List, ListItem} from '@mui/material';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import styles from '../../PlayList/playList.module.css';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  summaryContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
}));

const ProductInfo = ({productInfo, product}) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState('');
  const [playlistData, setPlaylistData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await axios.get(`/kms/courses/videos`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
            courseId: product.id,
          },
        });
        setPlaylistData(response.data);
        setIsSuccess(true);
      } catch (err) {
        console.log(err);
        setIsError(true);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const convertSecondsToMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const totalVideos = playlistData.reduce(
    (total, chapter) => total + chapter.videosList.length,
    0,
  );

  const totalDurationInSeconds = playlistData.reduce((total, chapter) => {
    const chapterDuration = chapter.videosList.reduce(
      (duration, video) => duration + video.videoLength,
      0,
    );
    return total + chapterDuration;
  }, 0);

  const totalDurationFormatted = convertSecondsToMinutes(
    totalDurationInSeconds,
  );

  return (
    <>
      <Box
        sx={{
          color: 'primary.main',
          fontSize: 16,
          mb: 4,
        }}
      >
        Chapter Details
      </Box>
      {/* <Grid container spacing={3}> */}
      {playlistData.map((chapter, index) => (
        <Accordion key={index} defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index + 1}-content`}
            id={`panel${index + 1}-header`}
          >
            <div className={classes.summaryContainer}>
              <Typography>{chapter.chapterName}</Typography>
              <Typography>
                {chapter.videosList.length} videos -{' '}
                {convertSecondsToMinutes(
                  chapter.videosList.reduce(
                    (total, video) => total + video.videoLength,
                    0,
                  ),
                )}
              </Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {chapter.videosList.map((video, videoIndex) => (
                <ListItem key={video.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%', // Ensures the content takes full width
                    }}
                  >
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <span style={{marginRight: '10px', fontSize: 'smaller'}}>
                        <OndemandVideoIcon />
                      </span>
                      <span>{video.videoTitle}</span>
                    </div>
                    <div style={{marginLeft: 'auto', textAlign: 'right'}}>
                      {/* <span
                        style={{marginRight: '10px'}}
                      >{`${chapter.videosList.length} videos`}</span> */}
                      <span>{convertSecondsToMinutes(video.videoLength)}</span>
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
      {/* </Grid> */}
    </>
  );
};

export default ProductInfo;

ProductInfo.propTypes = {
  productInfo: PropTypes.object,
  product: PropTypes.any,
};
