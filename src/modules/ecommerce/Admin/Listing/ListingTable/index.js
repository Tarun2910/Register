import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import PropTypes from 'prop-types';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import AppTableContainer from '@crema/components/AppTableContainer';
import AppLoader from '@crema/components/AppLoader';

const ProductTable = ({
  productData,
  loading,
  thumbnailUrls,
  setTotal,
  setPage,
  setList,
  list,
}) => {
  return (
    <AppTableContainer>
      <Table stickyHeader className='table'>
        <TableHead>
          <TableHeading />
        </TableHead>
        <TableBody>
          {loading ? (
            <AppLoader />
          ) : (
            productData.map((data) => (
              <TableItem
                data={data}
                key={data.id}
                thumbnailUrls={thumbnailUrls}
                setTotal={setTotal}
                setPage={setPage}
                setList={setList}
                list={list}
              />
            ))
          )}
        </TableBody>
      </Table>
    </AppTableContainer>
  );
};

export default ProductTable;

ProductTable.defaultProps = {
  productData: [],
};

ProductTable.propTypes = {
  productData: PropTypes.array,
  loading: PropTypes.bool,
  thumbnailUrls: PropTypes.object,
  setTotal: PropTypes.any,
  setPage: PropTypes.any,
  setList: PropTypes.any,
  list: PropTypes.any,
};
