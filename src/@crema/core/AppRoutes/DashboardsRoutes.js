import React from 'react';
import {RoutePermittedRole} from '@crema/constants/AppEnums';

const HealthCare = React.lazy(() =>
  import('../../../modules/dashboards/HealthCare'),
);
const ECommerce = React.lazy(() =>
  import('../../../modules/dashboards/ECommerce'),
);
const CRM = React.lazy(() => import('../../../modules/dashboards/CRM'));
const Crypto = React.lazy(() => import('../../../modules/dashboards/Crypto'));
const DashBoard = React.lazy(() =>
  import('../../../modules/dashboards/AdduserDashboard'),
);
const Department = React.lazy(() =>
  import('../../../modules/dashboards/Department'),
);
const OmniLearn = React.lazy(() =>
  import('../../../modules/dashboards/OmniLearn'),
);
const TeamSync = React.lazy(() =>
  import('../../../modules/dashboards/TeamSync'),
);
const TeamSyncDashBoard = React.lazy(() =>
  import('../../../modules/dashboards/TeamSyncDashBoard'),
);
const Crm = React.lazy(() => import('../../../modules/dashboards/Crm1'));
const Integration = React.lazy(() =>
  import('../../../modules/dashboards/Integration'),
);
const Role = React.lazy(() => import('../../../modules/dashboards/Role'));
const Organizationhierarchy = React.lazy(() =>
  import('../../../modules/dashboards/Organizationhierarchy'),
);
const Roles = React.lazy(() => import('../../../modules/dashboards/Roles'));
const AddUser = React.lazy(() =>
  import('../../../modules/dashboards/AdduserDashboard/AddUser'),
);
const AddDepartment = React.lazy(() =>
  import('../../../modules/dashboards/Department/AddDepartment'),
);
const EditDepartment = React.lazy(() =>
  import('../../../modules/dashboards/Department/AddDepartment'),
);
const Analytics = React.lazy(() =>
  import('../../../modules/dashboards/Analytics'),
);
const Academy = React.lazy(() => import('../../../modules/dashboards/Academy'));
const Metrics = React.lazy(() => import('../../../modules/dashboards/Metrics'));
const Widgets = React.lazy(() => import('../../../modules/dashboards/Widgets'));

export const dashBoardConfigs = [
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/user',
    element: <DashBoard />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/omniLearn',
    element: <OmniLearn />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/teamSync',
    element: <TeamSync />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/teamsyncDashboard',
    element: <TeamSyncDashBoard />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/crm',
    element: <Crm />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/integration',
    element: <Integration />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/department',
    element: <Department />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/roles',
    element: <Role />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/add-department',
    element: <AddDepartment />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/edit-department/:id',
    element: <EditDepartment />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/hierarchy/:id',
    element: <Organizationhierarchy />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: 'role/:id',
    element: <Roles />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/addUser',
    element: <AddUser />,
  },
  {
    permittedRole: [RoutePermittedRole.User, RoutePermittedRole.Admin],
    path: '/dashboards/crypto',
    element: <Crypto />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/signin/dashboards/academy',
    element: <Academy />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/analytics',
    element: <Analytics />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/e-commerce',
    element: <ECommerce />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/crm',
    element: <CRM />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/health-care',
    element: <HealthCare />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/metrics',
    element: <Metrics />,
  },
  {
    permittedRole: RoutePermittedRole.User,
    path: '/dashboards/widgets',
    element: <Widgets />,
  },
];
