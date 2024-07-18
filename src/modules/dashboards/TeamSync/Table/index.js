import React, {useState} from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import PropTypes from 'prop-types';
import TableHeading from './header'; // Assuming TableHeading is in a separate file
import TableItem from './item';
import AppTableContainer from '@crema/components/AppTableContainer';
import AppLoader from '@crema/components/AppLoader';

const ProductTable = ({
  productData,
  loading,
  onItemsStateUpdate,
  onButtonDisable,
  setTableData,
  setList,
  setItemsState,
  itemsState,
  showUsers,
  setShowUsers,
  filterStatus, // Pass filterStatus as a prop
  setFilterStatus, // Pass setFilterStatus as a prop
}) => {
  return (
    <AppTableContainer>
      <Table stickyHeader className='table'>
        <TableHead>
          <TableHeading
            showUsers={showUsers}
            setShowUsers={setShowUsers}
            filterStatus={filterStatus} // Pass filterStatus prop to TableHeading
            setFilterStatus={setFilterStatus} // Pass setFilterStatus prop to TableHeading
          />
        </TableHead>
        <TableBody>
          {loading ? (
            <AppLoader />
          ) : (
            <TableItem
              productData={productData}
              onItemsStateUpdate={onItemsStateUpdate}
              onButtonDisable={onButtonDisable}
              setTableData={setTableData}
              setList={setList}
              setItemsState={setItemsState}
              itemsState={itemsState}
              showUsers={showUsers}
            />
          )}
        </TableBody>
      </Table>
    </AppTableContainer>
  );
};

ProductTable.defaultProps = {
  productData: [],
};

ProductTable.propTypes = {
  productData: PropTypes.array,
  loading: PropTypes.bool,
  onItemsStateUpdate: PropTypes.func,
  onButtonDisable: PropTypes.func,
  setTableData: PropTypes.func,
  setList: PropTypes.func,
  setItemsState: PropTypes.func,
  itemsState: PropTypes.any,
  showUsers: PropTypes.bool,
  setShowUsers: PropTypes.func,
  filterStatus: PropTypes.string.isRequired, // Define filterStatus prop type
  setFilterStatus: PropTypes.func.isRequired, // Define setFilterStatus prop type
};

export default ProductTable;
