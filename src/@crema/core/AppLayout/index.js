import React, {useEffect} from 'react';
import {useUrlSearchParams} from 'use-url-search-params';
import AppContentView from '@crema/components/AppContentView';
import generateRoutes from '@crema/helpers/RouteGenerator';
import {Layouts} from '@crema/components/AppLayout';
import {useAuthUser} from '@crema/hooks/AuthHooks';
import {
  useLayoutActionsContext,
  useLayoutContext,
} from '@crema/context/AppContextProvider/LayoutContextProvider';
import {useSidebarActionsContext} from '@crema/context/AppContextProvider/SidebarContextProvider';
import {
  anonymousStructure,
  authorizedStructure,
  publicStructure,
} from '../AppRoutes';
import {useRoutes} from 'react-router-dom';
import routesConfig from '../AppRoutes/routeConfig';
import {initialUrl} from '@crema/constants/AppConst';
import {useNavigate} from 'react-router-dom';

const AppLayout = () => {
  const {navStyle} = useLayoutContext();
  const navigate = useNavigate();

  const {user} = useAuthUser();
  const {updateNavStyle} = useLayoutActionsContext();
  const {updateMenuStyle, setSidebarBgImage} = useSidebarActionsContext();
  const AppLayout = Layouts[navStyle];
  const [params] = useUrlSearchParams();

  const jwtToken = sessionStorage.getItem('jwt_token');
  let isAuthenticated = false;

  if (jwtToken) {
    isAuthenticated = true;
    sessionStorage.setItem('isAuthenticated', true);
  } else {
    isAuthenticated = false;
    sessionStorage.setItem('isAuthenticated', false);
  }

  console.log(isAuthenticated, 'isAuthenticated');

  const roles = sessionStorage.getItem('roles');
  const userRoles = roles ? JSON.parse(roles) : [];

  console.log(JSON.stringify(userRoles), 'userROles');

  const initURL = params?.redirect ? params?.redirect : initialUrl;
  // const loginUrl = `/signin?redirect=${window.location.pathname}`;
  let loginUrl;

  if (isAuthenticated) {
    if (userRoles.includes('user')) {
      let targetURl = '/dashboards';
      loginUrl = targetURl;
    } else if (userRoles.includes('admin')) {
      let targetURl = '/dashboards';
      loginUrl = targetURl;
    } else if (userRoles.includes('coordinator')) {
      let targetURl = '/dashboards';
      loginUrl = targetURl;
    } else {
      let targetURl = '/dashboards';
      loginUrl = targetURl;
    }
    console.log(loginUrl, 'loginUrl');
  }

  const generatedRoutes = generateRoutes({
    isAuthenticated: isAuthenticated,
    userRole: user?.role,
    anonymousStructure: anonymousStructure(initURL),
    authorizedStructure: authorizedStructure(loginUrl),
    publicStructure: publicStructure(initURL),
  });

  const routes = useRoutes(generatedRoutes);
  useEffect(() => {
    if (params.layout) updateNavStyle(params.layout);
    if (params.menuStyle) updateMenuStyle(params.menuStyle);
    if (params.sidebarImage) setSidebarBgImage(true);
  }, [
    params.layout,
    params.menuStyle,
    params.sidebarImage,
    updateNavStyle,
    updateMenuStyle,
    setSidebarBgImage,
  ]);

  return (
    <>
      {isAuthenticated ? (
        <AppLayout routes={routes} routesConfig={routesConfig} />
      ) : (
        <AppContentView routes={routes} />
      )}
    </>
  );
};

export default AppLayout;
