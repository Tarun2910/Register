import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import PropTypes from 'prop-types';
import TableHeading from './header';
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
  setTriggerApi,
  updateRole,
  setRoleName,
  setRoleDisplayName,
  setRowData,
  rolesList,
  setRolesList,
  setOpenRoles,
  setTableRoleName,
  tableRolename,
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
              setTriggerApi={setTriggerApi}
              updateRole={updateRole}
              setRoleName={setRoleName}
              setRoleDisplayName={setRoleDisplayName}
              setRowData={setRowData}
              rolesList={rolesList}
              setRolesList={setRolesList}
              setOpenRoles={setOpenRoles}
              setTableRoleName={setTableRoleName}
              tableRolename={tableRolename}
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
  setTriggerApi: PropTypes.any,
  updateRole: PropTypes.any,
  setRoleName: PropTypes.any,
  setRoleDisplayName: PropTypes.any,
  setRowData: PropTypes.any,
  rolesList: PropTypes.any,
  setRolesList: PropTypes.any,
  setOpenRoles: PropTypes.any,
  setTableRoleName: PropTypes.any,
  tableRolename: PropTypes.any,
};
