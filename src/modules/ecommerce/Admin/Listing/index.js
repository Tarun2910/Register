import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import {useGetDataApi} from '@crema/hooks/APIHooks';
import {Box, Grid, Hidden} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import AppsPagination from '@crema/components/AppsPagination';
import AppSearchBar from '@crema/components/AppSearchBar';
import AppGridContainer from '@crema/components/AppGridContainer';
import {Fonts} from '@crema/constants/AppEnums';
import AppCard from '@crema/components/AppCard';
import Slide from '@mui/material/Slide';
import FilterItem from './FilterItem';
import ListingTable from './ListingTable';
import axios from 'axios';

const ProductListing = () => {
  const {messages} = useIntl();
  const [filterData, setFilterData] = useState({
    title: '',
    inStock: [],
    mrp: {start: 0, end: 30000},
  });

  const [page, setPage] = useState(0);
  const [list, setList] = useState([]);
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [total, setTotal] = useState(0);
  const [{apiData, loading}, {setQueryParams}] = useGetDataApi(
    '/api/ecommerce/list',
    [],
    {},
    false,
  );

  // const {list, total} = apiData;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `/kms/courses?pageNo=${page + 1}&pageSize=10`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
                  Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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

  const onPageChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    setQueryParams({filterData, page});
  }, [filterData, page]);

  const searchProduct = (title) => {
    setFilterData({...filterData, title});
  };

  const searchCourseData = async (searchQuery) => {
    try {
      const response = await axios.get(`/kms/courses/by-everything`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          keyword: searchQuery,
          tags: null,
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
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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

  return (
    <>
      <Box
        component='h2'
        variant='h2'
        sx={{
          fontSize: 16,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 4,
          },
        }}
      >
        {messages['sidebar.ecommerceAdmin.productListing']}
      </Box>
      <AppGridContainer spacing={7}>
        <Slide direction='right' in mountOnEnter unmountOnExit>
          <Grid item xs={12} lg={12}>
            <AppCard
              title={
                <AppsHeader>
                  <Box
                    display='flex'
                    flexDirection='row'
                    alignItems='center'
                    width={1}
                    justifyContent='space-between'
                  >
                    <AppSearchBar
                      iconPosition='right'
                      overlap={false}
                      onChange={(event) => searchCourseData(event.target.value)}
                      placeholder={messages['common.searchHere']}
                    />
                    <Box
                      display='flex'
                      flexDirection='row'
                      alignItems='center'
                      justifyContent='flex-end'
                    >
                      <Hidden smDown>
                        <AppsPagination
                          rowsPerPage={10}
                          count={total}
                          page={page}
                          onPageChange={onPageChange}
                        />
                      </Hidden>
                    </Box>
                  </Box>
                </AppsHeader>
              }
              headerStyle={{p: 0}}
              contentStyle={{p: 0}}
            >
              <AppsContent
                sx={{
                  paddingTop: 2.5,
                  paddingBottom: 2.5,
                }}
              >
                <ListingTable
                  productData={list || []}
                  thumbnailUrls={thumbnailUrls}
                  loading={loading}
                  setTotal={setTotal}
                  setPage={setPage}
                  setList={setList}
                  list={list}
                />
              </AppsContent>
              <Hidden smUp>
                <AppsPagination
                  rowsPerPage={10}
                  count={total}
                  page={page}
                  onPageChange={onPageChange}
                />
              </Hidden>
            </AppCard>
          </Grid>
        </Slide>
        {/* <Slide direction='left' in mountOnEnter unmountOnExit>
          <Grid item xs={12} lg={3}>
            <FilterItem filterData={filterData} setFilterData={setFilterData} />
          </Grid>
        </Slide> */}
      </AppGridContainer>
    </>
  );
};

export default ProductListing;
