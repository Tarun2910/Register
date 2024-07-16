import React, {useEffect, useState} from 'react';
import {useGetDataApi} from '@crema/hooks/APIHooks';
import AppLoader from '@crema/components/AppLoader';
import AppAnimate from '@crema/components/AppAnimate';
import {useParams} from 'react-router-dom';
import {isEmptyObject} from '@crema/helpers/ApiHelper';
import AddEditProduct from '../AddEditProduct';
import axios from 'axios';

const ProductEditPage = () => {
  const {id} = useParams();
  const [{apiData: currentProduct, loading}, {setQueryParams}] = useGetDataApi(
    '/api/ecommerce/get',
    {},
    {},
    false,
  );
  const [page, setPage] = useState(0);
  const [list, setList] = useState([]);
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/kms/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const courseLength = response.headers['totalcourses'];
        setTotal(courseLength);
        setList(response?.data);

        const thumbnails = response?.data
          ?.map((course) => course.courseThumbnail)
          .filter(Boolean);

        const urlPromises = thumbnails?.map(async (thumbnail) => {
          try {
            const responsethumbnail = await axios.get(
              `/kms/courses/file/${thumbnail}?fileType=thumbnail`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
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
  }, [page]);

  useEffect(() => {
    setQueryParams({id: id});
  }, [id]);

  return loading || isEmptyObject(list) ? (
    <AppLoader />
  ) : (
    <AppAnimate animation='transition.slideUpIn' delay={200}>
      <AddEditProduct selectedProd={list} />
    </AppAnimate>
  );
};
export default ProductEditPage;
