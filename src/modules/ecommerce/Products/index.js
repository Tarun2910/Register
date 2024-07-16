import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import AppsContainer from '@crema/components/AppsContainer';

import ProductsSidebar from './ProductsSidebar';
import ProductListing from './ProductListing';
import axios from 'axios';

export const VIEW_TYPE = {
  GRID: 'grid',
  LIST: 'list',
};
const Products = () => {
  const {messages} = useIntl();
  const [filterData, setFilterData] = useState({
    title: '',
    brand: [],
    ideaFor: [],
    discount: [],
    color: [],
    rating: [],
  });
  const [viewType, setViewType] = useState(VIEW_TYPE.GRID);
  const [page, setPage] = useState(0);
  const [list, setList] = useState([]);
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `/kms/courses?pageNo=${page + 1}&pageSize=10`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );
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

  return (
    <AppsContainer
      title={messages['sidebar.ecommerce.products']}
      sidebarContent={
        <ProductsSidebar
          filterData={filterData}
          setFilterData={setFilterData}
          setList={setList}
          list={list}
          setTotal={setTotal}
        />
      }
    >
      <ProductListing
        filterData={filterData}
        viewType={viewType}
        setViewType={setViewType}
        setFilterData={setFilterData}
        setList={setList}
        setThumbnailUrls={setThumbnailUrls}
        setTotal={setTotal}
        setPage={setPage}
        page={page}
        total={total}
        list={list}
        thumbnailUrls={thumbnailUrls}
      />
    </AppsContainer>
  );
};

export default Products;
