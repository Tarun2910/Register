import React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import OrderActions from './Actions';
import {styled} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';
import {ellipsisLines} from '@crema/helpers/StringHelper';

const StyledTableCell = styled(TableCell)(() => ({
  fontSize: 14,
  padding: 8,
  '&:first-of-type': {
    paddingLeft: 20,
  },
  '&:last-of-type': {
    paddingRight: 20,
  },
}));
const TableItem = ({data, thumbnailUrls, setTotal, setPage, setList, list}) => {
  const navigate = useNavigate();
  const getPaymentStatusColor = () => {
    switch (data.inStock) {
      case true: {
        return '#43C888';
      }
      case false: {
        return '#F84E4E';
      }
    }
  };

  const formatDate = (dateString) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  return (
    <TableRow key={data.name} className='item-hover'>
      <StyledTableCell align='left' sx={{width: 400}}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'primary.main',
          }}
          onClick={() => navigate(`/ecommerce/product_detail/${data?.id}`)}
        >
          <img
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain',
              marginRight: 10,
            }}
            src={thumbnailUrls[data.courseThumbnail]}
            alt='image'
          />
          {ellipsisLines(data.courseName)}
        </Box>
      </StyledTableCell>
      <StyledTableCell align='left'>
        {formatDate(data.activeStartDate)}
      </StyledTableCell>
      <StyledTableCell align='left'>
        {formatDate(data.activeEndDate)}
      </StyledTableCell>
      <StyledTableCell align='left'>
        <Box
          sx={{
            color: getPaymentStatusColor(),
            backgroundColor: getPaymentStatusColor() + '44',
            padding: '3px 5px',
            borderRadius: 1,
            fontSize: 14,
            display: 'inline-block',
          }}
        >
          {data.courseCoordinator}
        </Box>
      </StyledTableCell>
      {/* <StyledTableCell align='left'>${data.mrp}</StyledTableCell> */}
      <TableCell align='right'>
        <OrderActions
          id={data.id}
          setTotal={setTotal}
          setPage={setPage}
          setList={setList}
          list={list}
        />
      </TableCell>
    </TableRow>
  );
};

export default TableItem;

TableItem.propTypes = {
  data: PropTypes.object.isRequired,
  thumbnailUrls: PropTypes.object,
  setTotal: PropTypes.any,
  setPage: PropTypes.any,
  setList: PropTypes.any,
  list: PropTypes.any,
};
