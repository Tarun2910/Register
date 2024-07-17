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
}) => {
  return (
    <AppTableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableHeading license={license} handletiername={handletiername} />
        </TableHead>
        <TableBody>
          {loading ? (
            <AppLoader />
          ) : (
            // productData.map((data) => (
            <TableItem
              productData={productData}
              // key={data.id}
              onItemsStateUpdate={onItemsStateUpdate}
              onButtonDisable={onButtonDisable}
              setTableData={setTableData}
              setList={setList}
              setItemsState={setItemsState}
              itemsState={itemsState}
              setSelectedUsers={setSelectedUsers}
              selectedUsers={selectedUsers}
            />
            // ))
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
};
