import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import AppGridContainer from '@crema/components/AppGridContainer';
import {Grid} from '@mui/material';
import {useGetDataApi} from '@crema/hooks/APIHooks';
import GeneralStats from './GeneralStats';
import CourseCategories from './CourseCategories';
import MyProfile from './MyProfile';
import MyCourses from './MyCourses';
import Notifications from './Notifications';
import CourseDetail from './CourseDetail';
import MyLearning from './MyLearning';
import LatestResults from './LatestResults';
import MyClass from './MyClass';
import StudentRankings from './StudentRankings';
import PromoCard from './PromoCard';
import AverageGrades from './AverageGrades';
import RelatedCourses from './RelatedCourses';
import VideoPromo from './VideoPromo';
import AppLoader from '@crema/components/AppLoader';
import axios from 'axios';
import CustomizedBreadcrumbs from 'modules/muiComponents/navigation/Breadcrumbs/CustomizedBreadcrumbs';

const Academy = () => {
  const [{apiData: academyData, loading}] = useGetDataApi('/dashboard/academy');
  const [courseData, setCourseData] = useState([]);
  const [Allcourses, setAllCourses] = useState([]);
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [randomthumbnailUrls, setRandomThumbnailUrls] = useState([]);
  const [randomCourses, setRandomCourses] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/kms/courses`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          },
        });
        setAllCourses(response?.data);
        const subscribedCourses = response.data.filter(
          (course) => course.subscribed,
        );
        setCourseData(subscribedCourses);

        const thumbnails = response?.data
          ?.map((course) => course.courseThumbnail)
          .filter(Boolean);

        const urlPromises = thumbnails?.map(async (thumbnail) => {
          try {
            const responsethumbnail = await axios.get(
              `/kms/courses/file/${thumbnail}?fileType=thumbnail`,
              {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem(
                    'jwt_token',
                  )}`,
                },
                responseType: 'arraybuffer',
              },
            );

            const blob = new Blob([responsethumbnail.data], {
              type: 'image/jpeg',
            });
            const dataUrl = URL.createObjectURL(blob);

            return {[thumbnail]: dataUrl};
          } catch (err) {
            console.log(err);
          }
        });

        const urls = await Promise.all(urlPromises);

        const mergedUrls = Object.assign({}, ...urls.filter(Boolean));
        console.log(mergedUrls, 'mergedUrls');

        // Set the obtained URLs
        setThumbnailUrls(mergedUrls);
      } catch (err) {
        console.log(err);
      } finally {
        console.log('');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/kms/courses/random`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          },
        });
        setRandomCourses(response?.data);

        const thumbnails = response?.data
          ?.map((course) => course.courseThumbnail)
          .filter(Boolean);

        const urlPromises = thumbnails?.map(async (thumbnail) => {
          try {
            const responsethumbnail = await axios.get(
              `/kms/courses/file/${thumbnail}?fileType=thumbnail`,
              {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem(
                    'jwt_token',
                  )}`,
                },
                responseType: 'arraybuffer',
              },
            );

            const blob = new Blob([responsethumbnail.data], {
              type: 'image/jpeg',
            });
            const dataUrl = URL.createObjectURL(blob);

            return {[thumbnail]: dataUrl};
          } catch (err) {
            console.log(err);
          }
        });

        const urls = await Promise.all(urlPromises);

        const mergedUrls = Object.assign({}, ...urls.filter(Boolean));
        console.log(mergedUrls, 'mergedUrls');

        // Set the obtained URLs
        setRandomThumbnailUrls(mergedUrls);
      } catch (err) {
        console.log(err);
      } finally {
        console.log('');
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/kms/courses/stats`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          },
        });

        const statsArray = Object.keys(response?.data).map((key, index) => {
          return {
            id: index + 1,
            name: key,
            count: String(response?.data[key]),
          };
        });
        setStats(statsArray);
      } catch (err) {
        console.log(err);
      } finally {
        console.log('');
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <Box>
          <div style={{marginBottom: '1rem'}}>
            {window.location.pathname === '/signin/dashboards/academy' ? (
              <CustomizedBreadcrumbs showComponentName={false} />
            ) : (
              <CustomizedBreadcrumbs showComponentName={true} />
            )}
          </div>
          <Box
            sx={{
              pb: {xs: 5, md: 8},
            }}
          >
            <AppGridContainer>
              {stats?.map((item, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <GeneralStats stats={item} />
                </Grid>
              ))}

              {randomCourses?.map((item, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <CourseCategories
                    course={item}
                    thumbnailUrls={randomthumbnailUrls}
                  />
                </Grid>
              ))}
            </AppGridContainer>
          </Box>

          <Box
            sx={{
              pb: {xs: 5, md: 8},
            }}
          >
            <AppGridContainer>
              <Grid
                item
                xs={12}
                sm={12}
                lg={6}
                sx={{
                  order: {lg: 2},
                }}
              >
                <MyLearning
                  learningData={courseData}
                  thumbnailUrls={thumbnailUrls}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                lg={6}
                sx={{
                  order: {lg: 1},
                }}
              >
                <MyCourses courses={Allcourses} thumbnailUrls={thumbnailUrls} />
              </Grid>
            </AppGridContainer>
          </Box>

          {/* <AppGridContainer>
            {academyData.courseDetails.map((item, index) => (
              <Grid item xs={12} sm={12} md={4} key={index}>
                <CourseDetail course={item} />
              </Grid>
            ))}

            <Grid item xs={12} sm={12} md={5} xl={6}>
              <VideoPromo videoPromo={academyData.videoPromo} />
            </Grid>

            <Grid item xs={12} sm={12} md={7} xl={6}>
              <AppGridContainer>
                <Grid item xs={12} sm={12} md={12}>
                  <MyLearning learningData={academyData.learningData} />
                </Grid>

                <Grid item xs={12} sm={6} xl={6}>
                  <LatestResults latestResults={academyData.latestResults} />
                </Grid>

                <Grid item xs={12} sm={6} xl={6}>
                  <MyClass classData={academyData.classData} />
                </Grid>
              </AppGridContainer>
            </Grid>

            <Grid item xs={12} sm={12} md={9}>
              <StudentRankings studentRankings={academyData.studentRankings} />
            </Grid>

            <Grid item xs={12} sm={12} md={3}>
              <PromoCard />
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <AverageGrades grades={academyData.grades} />
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <RelatedCourses relatedCourses={academyData.relatedCourses} />
            </Grid>
          </AppGridContainer> */}
        </Box>
      )}
    </>
  );
};

export default Academy;
