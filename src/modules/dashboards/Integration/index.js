import AppComponentCard from '@crema/components/AppComponentCard';
import AppGridContainer from '@crema/components/AppGridContainer';
import {Box, Grid, Typography} from '@mui/material';
import AlertDialog from '../../muiComponents/feedback/Dialog/AlertDialog';
import Form from './Forms/form';
import AlertDialogSource from '!raw-loader!../../muiComponents/feedback/Dialog/AlertDialog';
import React from 'react';
import {Fonts} from '@crema/constants/AppEnums';

const index = () => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  console.log(checked, 'checked');
  return (
    <>
      <Box
        component='h2'
        variant='h2'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 15,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 4,
          },
        }}
      >
        <span>
          {/* <CustomizedBreadcrumbs label='Home' showComponentName={false} /> */}
          <Typography sx={{fontWeight: Fonts.SEMI_BOLD}}>
            Integration
          </Typography>
        </span>
      </Box>
      <AppGridContainer>
        <Grid item xs={12} md={6}>
          <AppComponentCard
            title='SMS GATEWAY'
            component={() => (
              <Form
                setChecked={setChecked}
                checked={checked}
                handleChange={handleChange}
              />
            )}
            source={''}
            noScrollbar
            description=''
            setChecked={setChecked}
            checked={checked}
            handleChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppComponentCard
            title='EMAIL GATEWAY'
            component={() => (
              <Form
                setChecked={setChecked}
                checked={checked}
                handleChange={handleChange}
              />
            )}
            source={''}
            noScrollbar
            description=''
            setChecked={setChecked}
            checked={checked}
            handleChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppComponentCard
            title='WHATSAPP GATEWAY'
            component={() => (
              <Form
                setChecked={setChecked}
                checked={checked}
                handleChange={handleChange}
              />
            )}
            source={''}
            noScrollbar
            description=''
            setChecked={setChecked}
            checked={checked}
            handleChange={handleChange}
          />
        </Grid>
      </AppGridContainer>
    </>
  );
};

export default index;
