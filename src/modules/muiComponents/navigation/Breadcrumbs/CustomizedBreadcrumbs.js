import * as React from 'react';
import {emphasize, styled} from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';

const StyledBreadcrumb = styled(Chip)(({theme}) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const CustomizedBreadcrumbs = ({label, link, showComponentName}) => {
  const roles = sessionStorage.getItem('roles');
  const userRoles = roles ? JSON.parse(roles) : [];

  const navigate = useNavigate();

  let targetURL = null;

  const handleNavigation = () => {
    targetURL = '/dashboards';
  };

  function handleClick(event) {
    event.preventDefault();
    handleNavigation();
    navigate(targetURL);
  }

  // const handlelink = (value) => {
  //   navigate(value);
  // };
  return (
    <div role='presentation'>
      <Breadcrumbs aria-label='breadcrumb'>
        <StyledBreadcrumb
          label='Home'
          icon={<HomeIcon fontSize='small' />}
          onClick={handleClick}
        />
        {showComponentName && (
          <StyledBreadcrumb
            component='span'
            label={label}
            // onClick={() => handlelink(link)}
          />
        )}
      </Breadcrumbs>
    </div>
  );
};

CustomizedBreadcrumbs.propTypes = {
  showComponentName: PropTypes.bool,
  label: PropTypes.string,
  link: PropTypes.any,
};

export default CustomizedBreadcrumbs;
