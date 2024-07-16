import React, {useEffect, useState} from 'react';
import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import PropTypes from 'prop-types';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import {alpha, Box, Hidden} from '@mui/material';
import {useThemeContext} from '@crema/context/AppContextProvider/ThemeContextProvider';
import AppsFooter from '@crema/components/AppsContainer/AppsFooter';
import AppsPagination from '@crema/components/AppsPagination';
import {useGetDataApi} from '@crema/hooks/APIHooks';
import ProductHeader from '../ProductHeader';
import ProductGrid from './ProductGrid';
import {VIEW_TYPE} from '../index';
import ProductList from './ProductList';
import axios from 'axios';

const ProductListing = ({
  filterData,
  viewType,
  setViewType,
  setFilterData,
  setList,
  setTotal,
  setThumbnailUrls,
  page,
  setPage,
  total,
  list,
  thumbnailUrls,
}) => {
  const {theme} = useThemeContext();
  // const [page, setPage] = useState(0);
  // const [list, setList] = useState([]);
  // const [thumbnailUrls, setThumbnailUrls] = useState([]);
  // const [total, setTotal] = useState(0);

  const [{apiData: ecommerceList, loading}, {setQueryParams}] = useGetDataApi(
    '/api/ecommerce/list',
    [],
    {},
    false,
  );

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await axios.get(
  //         `/kms/courses?pageNo=${page + 1}&pageSize=10`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem('token')}`,
  //           },
  //         },
  //       );
  //       const courseLength = response.headers['totalcourses'];
  //       setTotal(courseLength);
  //       setList(response?.data);

  //       const thumbnails = response?.data
  //         ?.map((course) => course.courseThumbnail)
  //         .filter(Boolean);

  //       const urlPromises = thumbnails?.map(async (thumbnail) => {
  //         try {
  //           const responsethumbnail = await axios.get(
  //             `/kms/courses/file/${thumbnail}?fileType=thumbnail`,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${sessionStorage.getItem(
  //                   'token',
  //                 )}`,
  //               },
  //               responseType: 'arraybuffer',
  //             },
  //           );

  //           const blob = new Blob([responsethumbnail.data], {
  //             type: 'image/jpeg',
  //           });
  //           const dataUrl = URL.createObjectURL(blob);

  //           return {[thumbnail]: dataUrl};
  //         } catch (err) {
  //           console.log(err);
  //         }
  //       });

  //       const urls = await Promise.all(urlPromises);

  //       const mergedUrls = Object.assign({}, ...urls.filter(Boolean));
  //       console.log(mergedUrls, 'mergedUrls');

  //       // Set the obtained URLs
  //       setThumbnailUrls(mergedUrls);
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       console.log('');
  //     }
  //   }
  //   fetchData();
  // }, [page]);

  const searchCourseData = async (searchQuery) => {
    try {
      const response = await axios.get(`/kms/courses/by-everything`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          keyword: searchQuery,
          tags: null,
        },
      });
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
    }
  };

  // const {list, total} = ecommerceList;

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       if (filterData.title) {
  //         // If there's a title filter, make a search-specific API call
  //         const searchResponse = await axios.get(`/kms/courses/by-title`, {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem('token')}`,
  //             title: searchProduct,
  //           },
  //         });
  //         setList(searchResponse?.data);
  //       } else {
  //         // Fetch all courses
  //         const response = await axios.get(`/kms/courses`, {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem('token')}`,
  //           },
  //         });
  //         setList(response?.data);

  //         const thumbnails = response?.data
  //           ?.map((course) => course.courseThumbnail)
  //           .filter(Boolean);

  //         const urlPromises = thumbnails?.map(async (thumbnail) => {
  //           try {
  //             const responsethumbnail = await axios.get(
  //               `/kms/courses/file/${thumbnail}?fileType=thumbnail`,
  //               {
  //                 headers: {
  //                   Authorization: `Bearer ${sessionStorage.getItem(
  //                     'token',
  //                   )}`,
  //                 },
  //                 responseType: 'arraybuffer',
  //               },
  //             );

  //             const blob = new Blob([responsethumbnail.data], {
  //               type: 'image/jpeg',
  //             });
  //             const dataUrl = URL.createObjectURL(blob);

  //             return {[thumbnail]: dataUrl};
  //           } catch (err) {
  //             console.log(err);
  //           }
  //         });

  //         const urls = await Promise.all(urlPromises);

  //         const mergedUrls = Object.assign({}, ...urls.filter(Boolean));
  //         console.log(mergedUrls, 'mergedUrls');

  //         // Set the obtained URLs
  //         setThumbnailUrls(mergedUrls);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       console.log('');
  //     }
  //   }
  //   fetchData();
  // }, []);

  // const {total} = ecommerceList;

  useEffect(() => {
    setQueryParams({page, filterData});
  }, [page, filterData]);

  const onPageChange = (event, value) => {
    setPage(value);
  };

  const searchProduct = (title) => {
    setFilterData({...filterData, title});
  };

  const SearchcoursesData = (title) => {
    setList(title);
  };

  return (
    <>
      <AppsHeader>
        <ProductHeader
          list={list}
          viewType={viewType}
          page={page}
          totalProducts={total}
          onPageChange={onPageChange}
          onSearch={searchCourseData}
          setViewType={setViewType}
        />
      </AppsHeader>

      <AppsContent
        style={{
          backgroundColor: alpha(theme.palette.background.default, 0.6),
        }}
      >
        <Box
          sx={{
            width: '100%',
            flex: 1,
            display: 'flex',
            py: 2,
            px: 4,
            height: 1,
            '& > div': {
              width: '100%',
            },
          }}
        >
          {viewType === VIEW_TYPE.GRID ? (
            <ProductGrid
              ecommerceList={list}
              loading={loading}
              thumbnailUrls={thumbnailUrls}
            />
          ) : (
            <ProductList
              ecommerceList={list}
              loading={loading}
              thumbnailUrls={thumbnailUrls}
            />
          )}
        </Box>
      </AppsContent>
      <Hidden smUp>
        {list?.length > 0 ? (
          <AppsFooter>
            <AppsPagination
              count={total}
              rowsPerPage={10}
              page={page}
              onPageChange={onPageChange}
            />
          </AppsFooter>
        ) : null}
      </Hidden>
    </>
  );
};

export default ProductListing;
ProductListing.propTypes = {
  filterData: PropTypes.object,
  viewType: PropTypes.string,
  setViewType: PropTypes.func,
  setFilterData: PropTypes.func,
  setList: PropTypes.any,
  setTotal: PropTypes.any,
  setThumbnailUrls: PropTypes.any,
  setPage: PropTypes.any,
  total: PropTypes.any,
  list: PropTypes.any,
  thumbnailUrls: PropTypes.any,
  page: PropTypes.any,
};
