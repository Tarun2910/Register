import React, {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import PropTypes from 'prop-types';
import TableHeading from './TableHeading';
import TableItem from './TableItem';
import AppTableContainer from '@crema/components/AppTableContainer';
import AppLoader from '@crema/components/AppLoader';
import './j.css';

const ProductTable = ({
  productData,
  loading,
  onItemsStateUpdate,
  onButtonDisable,
  setTableData,
  setList,
  setItemsState,
  itemsState,
  license,
  handletiername,
  selectedUsers,
  setSelectedUsers,
  setToggleStatus,
  setLoading,
  saveicondisable,
  onSort,
  sortOrder,
}) => {
  return (
    <AppTableContainer className='tableContainer'>
      <Table>
        <TableHead className='stickyHeader'>
          <TableHeading
            license={license}
            handletiername={handletiername}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            setToggleStatus={setToggleStatus}
            productData={productData}
            setLoading={setLoading}
            onSort={onSort}
            sortOrder={sortOrder}
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
              setSelectedUsers={setSelectedUsers}
              selectedUsers={selectedUsers}
              setToggleStatus={setToggleStatus}
              saveicondisable={saveicondisable}
            />
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
  onItemsStateUpdate: PropTypes.any,
  onButtonDisable: PropTypes.any,
  setTableData: PropTypes.any,
  setList: PropTypes.any,
  setItemsState: PropTypes.any,
  itemsState: PropTypes.any,
  license: PropTypes.any,
  handletiername: PropTypes.any,
  setSelectedUsers: PropTypes.any,
  selectedUsers: PropTypes.any,
  setToggleStatus: PropTypes.any,
  setLoading: PropTypes.any,
  saveicondisable: PropTypes.any,
  onSort: PropTypes.any,
  sortOrder: PropTypes.any,
};
