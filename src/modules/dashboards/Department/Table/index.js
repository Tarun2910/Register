import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import PropTypes from 'prop-types';
import TableHeading from './header';
import TableItem from './item';
import AppTableContainer from '@crema/components/AppTableContainer';
import AppLoader from '@crema/components/AppLoader';
import {onSpaceOrEnter} from '@mui/x-date-pickers/internals';

const ProductTable = ({
  productData,
  loading,
  onItemsStateUpdate,
  onButtonDisable,
  setTableData,
  setList,
  setItemsState,
  itemsState,
  updateDepartment,
  setSelectedDeptId,
  setdeptName,
  setdeptDisplayName,
  setbranchCity,
  setRowData,
  selectedList,
  setSelectedList,
  sortOrder,
  onSort,
}) => {
  return (
    <AppTableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableHeading sortOrder={sortOrder} onSort={onSort} />
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
              updateDepartment={updateDepartment}
              setSelectedDeptId={setSelectedDeptId}
              setdeptName={setdeptName}
              setdeptDisplayName={setdeptDisplayName}
              setbranchCity={setbranchCity}
              setRowData={setRowData}
              selectedList={selectedList}
              setSelectedList={setSelectedList}
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
  updateDepartment: PropTypes.any,
  setSelectedDeptId: PropTypes.any,
  setdeptName: PropTypes.any,
  setdeptDisplayName: PropTypes.any,
  setbranchCity: PropTypes.any,
  setRowData: PropTypes.any,
  selectedList: PropTypes.any,
  setSelectedList: PropTypes.any,
  sortOrder: PropTypes.any,
  onSort: PropTypes.any,
};

// style={{minHeight: '70vh'}}
