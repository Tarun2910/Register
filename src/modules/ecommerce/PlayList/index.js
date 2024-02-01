import React, {useEffect, useRef, useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './playList.module.css';
import ImgTrophy from '../../../assets/image/trophy.jpg';
import {
  Grid,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Tooltip,
  Box,
} from '@mui/material';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import SkeletonChildren from '../Shimmer/Shimmer';
import AppCircularProgress from '@crema/components/AppCircularProgress';
import CustomizedBreadcrumbs from 'modules/muiComponents/navigation/Breadcrumbs/CustomizedBreadcrumbs';
import LockIcon from '@mui/icons-material/Lock';

const tabs = ['Overview', 'Q&A', 'Notes', 'Reviews', 'Learning Tools'];

// const calculateOverallProgress = () => {
//   const totalVideos = playlistData.reduce(
//     (total, chapter) => total + chapter.videos.length,
//     0
//   );
//   const watchedVideos = playlistData.reduce((total, chapter) => {
//     return total + chapter.videos.filter((video) => video.watched).length;
//   }, 0);

//   return (watchedVideos / totalVideos) * 100;
// };

// const overallProgress = calculateOverallProgress();

const Playlist = () => {
  const videoRefs = useRef([]);
  const navigate = useNavigate();
  const {id} = useParams();
  const [selectedVideo, setSelectedVideo] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isChapter1Finished, setIsChapter1Finished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState('');
  const [playlistData, setPlaylistData] = useState([]);
  const [videourl, setVideoUrl] = useState(null);
  const [playbackStarted, setPlaybackStarted] = useState(false);
  const [courseDurationCovered, setcourseDurationCovered] = useState('');
  const [totalDuration, setTotalDuration] = useState('');
  const [isunlock, setIsunlock] = useState(false);
  const [currentVideoTimestamp, setCurrentVideoTimestamp] = useState(0);
  const [currentVideoProgress, setCurrentVideoProgress] = useState(0);
  const [currentvideoDuration, setCurrentvideoDuration] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await axios.get(`/kms/courses/videos`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
            courseId: id,
          },
        });
        const Totalduration = response.headers['totalduration'];
        const Durationcovered = response.headers['durationcovered'];
        const coursePercent = (Durationcovered / Totalduration) * 100;

        const roundedPercent = Math.floor(coursePercent);

        console.log(Totalduration, Durationcovered, coursePercent, 'newww');
        setTotalDuration(Totalduration);
        setcourseDurationCovered(roundedPercent);
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
    const storedTime = localStorage.getItem(`video-${selectedVideo?.id}-time`);
    const currentTime = storedTime ? parseFloat(storedTime) : 0;

    if (selectedVideo) {
      playVideo(selectedVideo, currentTime);
    }

    fetchData();
  }, [id, selectedVideo]);

  async function fetchTimestampData(videoId, timestamp) {
    try {
      const timestampResponse = await axios.post('/kms/courses/timestamp', '', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          videoId: videoId,
          timestamp: timestamp,
        },
      });
      const coursevideoWatched = timestampResponse?.data?.courseDurationCovered;
      const courseDurationCovered = (coursevideoWatched / totalDuration) * 100;
      const roundedPercent = Math.floor(courseDurationCovered);
      const currentVideoDuration = timestampResponse?.data?.videoDuration;
      console.log(roundedPercent, 'courseDurationCovered');
      setcourseDurationCovered(roundedPercent);
      setCurrentvideoDuration(currentVideoDuration);
      if ((timestamp / currentVideoDuration) * 100 > 95) {
        setIsunlock(true);
      } else {
        setIsunlock(false);
      }
    } catch (err) {
      console.log('Error fetching timestamp data:', err);
    }
  }

  useEffect(() => {
    // Existing code for fetching playlist data

    const handleBeforeUnload = async () => {
      const videoElement = document.getElementById('videoPlayer');
      if (!videoElement.paused) {
        const currentTimestamp = parseInt(videoElement.currentTime, 10);
        const currentVideoId = selectedVideo?.id;

        if (currentVideoId && currentTimestamp) {
          await fetchTimestampData(currentVideoId, currentTimestamp);
        }
      }
    };

    const handleVideoPause = async () => {
      const videoElement = document.getElementById('videoPlayer');
      const currentTimestamp = parseInt(videoElement.currentTime, 10);
      const currentVideoId = selectedVideo?.id;

      if (currentVideoId && currentTimestamp) {
        await fetchTimestampData(currentVideoId, currentTimestamp);
      }
    };

    const videoPlayer = document.getElementById('videoPlayer');
    if (videoPlayer) {
      videoPlayer.addEventListener('pause', handleVideoPause);
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      if (videoPlayer) {
        videoPlayer.removeEventListener('pause', handleVideoPause);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [id, selectedVideo]);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const updateVideoTime = (videoId, currentTime) => {
    localStorage.setItem(`video-${videoId}-time`, parseInt(currentTime));
  };

  const playVideo = async (video, currentTime) => {
    console.log(currentTime, 'currentTime');
    const videoElement = document.getElementById('videoPlayer');
    videoElement.currentTime = currentTime; // Set the current time

    const onTimeUpdate = () => {
      const currentTime = videoElement.currentTime;
      updateVideoTime(video.id, currentTime);
    };

    const onCanPlay = () => {
      videoElement.removeEventListener('canplay', onCanPlay);
      videoElement
        .play()
        .catch((error) => console.error('Error playing the video:', error));
    };

    videoElement.addEventListener('timeupdate', onTimeUpdate);
    videoElement.addEventListener('canplay', onCanPlay);

    if (videoElement.readyState >= 2) {
      videoElement
        .play()
        .catch((error) => console.error('Error playing the video:', error));
    }
  };
  const handleVideoClick = async (video) => {
    try {
      setIsLoading(true); // Set loading state to true before fetching video URL
      setPlaybackStarted(false); // Reset video playing state on new video click

      const response = await axios.get(
        `/kms/courses/file/${video.filterPath}?fileType=kms`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          },
          responseType: 'arraybuffer',
        },
      );

      const blob = new Blob([response.data], {type: 'video/mp4'});
      const dataUrl = URL.createObjectURL(blob);
      setVideoUrl(dataUrl);

      setSelectedVideo(video);
      const storedTime = video.timeStamp; // Use the timestamp from the API response
      const currentTime = storedTime ? parseFloat(storedTime) : 0;

      console.log(storedTime, 'StoredTime');

      playVideo(video, currentTime);

      const isChapter1Finished = playlistData[0].videosList.every(
        (v) => v.watched,
      );
      setIsChapter1Finished(isChapter1Finished);

      setCurrentVideoTimestamp(currentTime);

      // Calculate and set the progress

      const progress = (currentTime / currentvideoDuration) * 100;
      setCurrentVideoProgress(progress);
    } catch (err) {
      console.log(err);
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false); // Set loading state to false once the video URL is obtained or an error occurs
    }
  };
  let isChapter1Watched = true; // Initialize as true

  useEffect(() => {
    const videoElement = document.getElementById('videoPlayer');
    return () => {
      videoElement.pause();
      videoElement.removeAttribute('src');
      videoElement.load();
    };
  }, [selectedVideo]);

  const handleGotoQuiz = () => {
    const targetURL = `/ecommerce/quiz/${id}`;
    navigate(targetURL);
  };

  return (
    <>
      <div style={{marginBottom: '1rem'}}>
        {window.location.pathname === `/ecommerce/playList/${id}` ? (
          <CustomizedBreadcrumbs showComponentName={false} />
        ) : (
          <CustomizedBreadcrumbs showComponentName={true} />
        )}
      </div>
      <Grid
        container
        spacing={2}
        style={{
          // padding: '1rem',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <Grid item xs={12} md={9} style={{paddingRight: '10px'}}>
          <div style={{marginBottom: '1rem'}}>
            <div style={{position: 'relative'}}>
              {isLoading && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 1,
                  }}
                >
                  {/* Loading indicator */}
                  {/* <p style={{color: 'white', fontSize: '1.5rem'}}>Loading...</p> */}
                  <SkeletonChildren />
                </div>
              )}

              {/* Video element */}
              <video
                key={selectedVideo?.id}
                id={'videoPlayer'}
                controls
                type='video/mp4'
                poster='https://www.livewireindia.com/blog/wp-content/uploads/2019/03/Python-Programming-training-1024x537.jpg'
                style={{
                  background: 'black',
                  width: '100%',
                  borderRadius: '1rem',
                }}
                onLoadedData={() => {
                  setIsLoading(false); // Set loading state to false once the video is loaded
                  document.getElementById('videoPlayer').play(); // Optionally, you can trigger play here as well
                }}
              >
                <source src={videourl} />
              </video>
            </div>
          </div>

          <Tabs
            value={selectedTab}
            onChange={handleChangeTab}
            variant='scrollable'
            scrollButtons='auto'
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>

          {/* Content for each tab */}
          {selectedTab === 0 && (
            <div style={{padding: '1rem'}}>
              <h2>About the Course</h2>
            </div>
          )}
          {selectedTab === 1 && (
            <div style={{padding: '1rem'}}>
              <h3>Q&A Content</h3>
              {/* Add content for the Q&A tab */}
            </div>
          )}
          {selectedTab === 2 && (
            <div style={{padding: '1rem'}}>
              <h3>Notes Content</h3>
              {/* Add content for the Notes tab */}
            </div>
          )}
          {selectedTab === 3 && (
            <div style={{padding: '1rem'}}>
              <h3>Reviews Content</h3>
              {/* Add content for the Reviews tab */}
            </div>
          )}
          {selectedTab === 4 && (
            <div style={{padding: '1rem'}}>
              <h3>Learning Tools Content</h3>
              {/* Add content for the Learning Tools tab */}
            </div>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          md={3}
          style={{
            padding: '1px',
            maxHeight: '100vh',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              padding: '1.1rem',
              border: '1px solid',
              zIndex: 100,
              marginTop: '0.5rem',
              borderRadius: '0.5rem',
            }}
          >
            <h3>Course content</h3>
            <Box
              sx={{
                ml: 'auto',
              }}
            >
              <AppCircularProgress
                minWidth={42}
                maxWidth={45}
                activeColor='#0A8FDC'
                value={courseDurationCovered || 0}
                valueStyle={{
                  fontSize: 12,
                }}
                thickness={3}
              />
            </Box>
          </div>
          <div className={styles.playlist_container}>
            {playlistData?.map((chapterData, index) => {
              const chapterNumber = index + 1;

              let videoToResume = null;
              let hasCompleted = false;

              for (let i = 0; i < playlistData.length; i++) {
                let chapterVideoList = playlistData[i];
                let chapterCompleted = true;

                for (let j = 0; j < chapterVideoList.videosList.length; j++) {
                  let video = chapterVideoList.videosList[j];
                  if (video.hasCompleted) {
                    hasCompleted = true;
                  }
                  if (!video.hasCompleted) {
                    videoToResume = video;
                    chapterCompleted = false;
                    break;
                  }
                }

                if (!chapterCompleted) {
                  break;
                }
              }

              console.log(videoToResume, 'videoToResume');

              const calculateProgress = (video) => {
                // Your logic to calculate progress based on video data
                // For example, assuming video has a property 'progress' representing progress in percentage
                return video.progress || 70;
              };
              return (
                <>
                  <Accordion
                    style={{
                      width: 'auto',
                    }}
                    key={index}
                    defaultExpanded={index === 0}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index + 1}-a-content`}
                      id={`panel${index + 1}-a-header`}
                    >
                      <Typography>
                        <b>{`CHAPTER ${chapterNumber}: ${chapterData.chapterName}`}</b>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography className={styles.List}>
                        <ul className={styles.custom_list}>
                          {chapterData?.videosList?.map((video, videoIndex) => {
                            console.log();
                            const CurrentVideoUnLocked =
                              video === videoToResume ||
                              video.hasCompleted === hasCompleted ||
                              isunlock;

                            return (
                              <li
                                key={video.id}
                                onClick={(e) => {
                                  if (CurrentVideoUnLocked) {
                                    handleVideoClick(video);
                                  }
                                  e.stopPropagation();
                                }}
                                className={`${styles.playlist_video} ${
                                  !CurrentVideoUnLocked
                                    ? `${styles.locked}`
                                    : ''
                                }`}
                              >
                                {CurrentVideoUnLocked ? (
                                  <div className='video-info'>
                                    <span className={styles.number}>
                                      {videoIndex + 1}
                                    </span>
                                    <span className={styles.video_title}>
                                      {video.videoTitle}
                                    </span>
                                    <hr
                                      className={styles.progress_line}
                                      style={{
                                        width: `${calculateProgress(video)}%`,
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className={styles.title_container}>
                                    <span className={styles.number}>
                                      {videoIndex + 1}
                                    </span>
                                    <span className={styles.video_title}>
                                      {video.videoTitle}
                                    </span>

                                    <LockIcon
                                      fontSize='small'
                                      className={styles.lock_icon}
                                    />
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion className='accord'>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>
                        <b>{'CHAPTER  : QUIZ'}</b>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography className={styles.List}>
                        <ul className={styles.custom_list}>
                          <li onClick={handleGotoQuiz}>
                            <div className={styles.video_info}>
                              <span className={styles.number}>{'3'}</span>
                              <span className={styles.video_title}>
                                {'Start your Quiz'}
                              </span>
                            </div>
                          </li>
                        </ul>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </>
              );
            })}
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Playlist;
