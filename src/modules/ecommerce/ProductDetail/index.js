import React, {useEffect, useState} from 'react';
import AppCard from '@crema/components/AppCard';
import AppGridContainer from '@crema/components/AppGridContainer';

import AppAnimate from '@crema/components/AppAnimate';
import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom';
import AppInfoView from '@crema/components/AppInfoView';
import {useGetDataApi} from '@crema/hooks/APIHooks';
import Header from './Header';
import ProductView from './ProductView/index';
import SimilarProduct from './SimilarProduct';
import AppLoader from '@crema/components/AppLoader';
import {isEmptyObject} from '@crema/helpers/ApiHelper';
import ProductImageSlide from './ProductImageSlide';
import axios from 'axios';
import {useInfoViewActionsContext} from '@crema/context/AppContextProvider/InfoViewContextProvider';
import {toast} from 'react-toastify';
import CustomizedBreadcrumbs from 'modules/muiComponents/navigation/Breadcrumbs/CustomizedBreadcrumbs';

// ProductImageSlide.propTypes = {product: PropTypes.any};
const ProductDetail = () => {
  const infoViewActionsContext = useInfoViewActionsContext();
  const [singlecourseDetails, setCourseDetails] = useState({});
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [subscribeTrigger, setSubscribeTrigger] = useState(false);
  const [videoUrl, setVideoUrl] = useState([]);
  const {id} = useParams();
  const [{apiData: currentProduct, loading}, {setQueryParams}] = useGetDataApi(
    '/api/ecommerce/get',
    {},
    {},
    false,
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/kms/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          },
        });

        console.log(response);
        setCourseDetails(response?.data);

        const course = response.data; // Assuming response contains a single course object

        const thumbnail = course?.courseThumbnail;

        const urlPromise = thumbnail
          ? axios.get(`/kms/courses/file/${thumbnail}?fileType=thumbnail`, {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
              },
              responseType: 'arraybuffer',
            })
          : null;

        if (urlPromise) {
          const responsethumbnail = await urlPromise;

          const blob = new Blob([responsethumbnail.data], {
            type: 'image/jpeg',
          });
          const dataUrl = URL.createObjectURL(blob);

          const mergedUrls = {
            [thumbnail]: dataUrl,
          };

          setThumbnailUrls(mergedUrls);
        }

        const previewVideoFilename = course?.previewVideoFilename;
        const videourlPromise = previewVideoFilename
          ? axios.get(
              `/kms/courses/file/${previewVideoFilename}?fileType=kms`,
              {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem(
                    'jwt_token',
                  )}`,
                },
                responseType: 'arraybuffer',
              },
            )
          : null;

        if (videourlPromise) {
          const responsevideoUrl = await videourlPromise;

          const blob = new Blob([responsevideoUrl.data], {
            type: 'video/mp4',
          });
          const dataUrl = URL.createObjectURL(blob);

          const mergedVideoUrls = {
            [previewVideoFilename]: dataUrl,
          };

          setVideoUrl(mergedVideoUrls);
        }
        // const res = await axios.get(
        //   `/kms/courses/file/${course.previewVideoFilename}?fileType=kms`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
        //     },
        //     responseType: 'arraybuffer',
        //   },
        // );

        // const blob = new Blob([res.data], {type: 'video/mp4'});
        // const dataUrl = URL.createObjectURL(blob);
        // setVideoUrl(dataUrl);
      } catch (err) {
        console.log(err);
      } finally {
        console.log('');
      }
    }

    fetchData();
  }, [subscribeTrigger]);

  console.log(thumbnailUrls, 'mergedUrls');

  useEffect(() => {
    setQueryParams({id: id});
  }, [id]);

  const handleSubscribeCourse = () => {
    try {
      const formdata = new FormData();
      formdata.append('courseId', singlecourseDetails.id);
      axios.post(`/kms/users/subscribe`, formdata, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
        },
      });
      toast.success(
        ` ${singlecourseDetails.courseName} subscribed successfully!`,
      );
      setSubscribeTrigger((prevState) => !prevState);
    } catch (error) {
      toast.error(` ${singlecourseDetails.courseName} Not subscribed `);
    }
  };

  const handleUnSubscribeCourse = async () => {
    try {
      const formdata = new FormData();
      formdata.append('courseId', singlecourseDetails.id);
      await axios.post(`/kms/users/unsubscribe`, formdata, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
        },
      });
      toast.success(
        ` ${singlecourseDetails.courseName} Unsubscribed successfully!`,
      );
      setSubscribeTrigger((prevState) => !prevState);
    } catch (error) {
      toast.error(` ${singlecourseDetails.courseName} Not Unsubscribed `);
    }
  };

  return (
    <>
      <div style={{marginBottom: '1rem'}}>
        {window.location.pathname === `ecommerce/product_detail/${id}` ? (
          <CustomizedBreadcrumbs showComponentName={false} />
        ) : (
          <CustomizedBreadcrumbs showComponentName={true} />
        )}
      </div>
      {loading || isEmptyObject(singlecourseDetails) ? (
        <AppLoader />
      ) : (
        <AppAnimate animation='transition.slideUpIn' delay={200}>
          <AppCard>
            <Header product={singlecourseDetails} />
            <AppGridContainer>
              <ProductImageSlide
                product={singlecourseDetails}
                handleSubscribeCourse={handleSubscribeCourse}
                handleUnSubscribeCourse={handleUnSubscribeCourse}
                thumbnailUrls={thumbnailUrls}
                videoUrl={videoUrl}
              />
              <ProductView
                product={singlecourseDetails}
                thumbnailUrls={thumbnailUrls}
              />
            </AppGridContainer>
            {/* <SimilarProduct
              product={singlecourseDetails}
              thumbnailUrls={thumbnailUrls}
            /> */}
          </AppCard>
        </AppAnimate>
      )}
      <AppInfoView />
    </>
  );
};

export default ProductDetail;

// ProductDetail.propTypes = {
//   match: PropTypes.object,
// };
