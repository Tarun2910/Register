import React, {useState} from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import PropTypes from 'prop-types';
import {FiSearch} from 'react-icons/fi';
import {AiOutlineLink} from 'react-icons/ai';
import CardContent from '@mui/material/CardContent';
import CardWrapper from './CardMediaWrapper';
import {Fonts} from '@crema/constants/AppEnums';
import {GoKey} from 'react-icons/go';
import {MdKeyboardDoubleArrowUp} from 'react-icons/md';
import CloseIcon from '@mui/icons-material/Close';
import Draggable from 'react-draggable';
import Activation from './Activation';

const PortfolioCard = ({portfolio, onViewPortfolioDetail}) => {
  const [openActivation, setOpenActivation] = useState(false);
  const handleActivateKey = () => {
    setOpenActivation(true);
  };

  const handleclose = () => {
    setOpenActivation(false);
  };

  function PaperComponent(props) {
    return (
      <Draggable
        handle='#draggable-dialog-title'
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <Paper {...props} />
      </Draggable>
    );
  }
  return (
    // <CardWrapper onClick={() => onViewPortfolioDetail(portfolio)}>
    <>
      <CardWrapper>
        <Box className='card-media-wrapper'>
          <CardMedia component='img' image={portfolio.srcImg} alt='Portfolio' />
          <Box className='card-media-content'>
            {portfolio.key ? (
              <Tooltip title='Upgrade License'>
                <Box className='icon'>
                  <MdKeyboardDoubleArrowUp />
                </Box>
              </Tooltip>
            ) : (
              <>
                <Tooltip title='Activate Key' onClick={handleActivateKey}>
                  <Box className='icon'>
                    <GoKey />
                  </Box>
                </Tooltip>
                <Tooltip title='Genrate Key' onClick={handleActivateKey}>
                  <Box className='icon'>
                    <GoKey />
                  </Box>
                </Tooltip>
              </>
            )}
            {/* <Box className='icon'>
            <AiOutlineLink />
          </Box> */}
          </Box>
        </Box>
        <CardContent
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography
            component='h5'
            sx={{
              fontSize: 14,
              fontWeight: Fonts.MEDIUM,
            }}
          >
            {portfolio.title}
          </Typography>
          <Typography
            sx={{
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            {portfolio.subTitle}
          </Typography>
        </CardContent>
      </CardWrapper>
      <Dialog
        open={openActivation}
        keepMounted
        aria-labelledby='draggable-dialog-title'
        PaperComponent={PaperComponent}
        maxWidth='md'
        fullWidth={true}
      >
        <DialogTitle
          style={{cursor: 'move', fontSize: '15px'}}
          id='draggable-dialog-title'
          className='dialofAction'
        >
          <Tooltip title='CLOSE'>
            <IconButton
              onClick={handleclose}
              aria-label='close'
              style={{
                position: 'absolute',
                right: '8px',
                top: '8px',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
          Add Activation Key
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            <Activation />
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleclose}>Cancel</Button>
          <Button variant='contained' color='primary' onClick={handleclose}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PortfolioCard;

PortfolioCard.propTypes = {
  portfolio: PropTypes.object,
  onViewPortfolioDetail: PropTypes.func,
};
