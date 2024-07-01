import React from 'react';
import {FaRegCalendarAlt, FaRegHospital} from 'react-icons/fa';
import {FiMap, FiUsers} from 'react-icons/fi';
// import {HiOutlineAcademicCap, HiOutlineChartSquareBar} from 'react-icons/hi';
import {HiOutlineAcademicCap} from 'react-icons/hi2';
import {MdOutlineLocalFireDepartment} from 'react-icons/md';
import {RiProductHuntLine} from 'react-icons/ri';
import {BsPersonLinesFill} from 'react-icons/bs';
import {IoFolderOpenOutline} from 'react-icons/io5';
import {MdOutlineSpaceDashboard} from 'react-icons/md';
import {MdOutlineIntegrationInstructions} from 'react-icons/md';
import {
  RiCustomerService2Line,
  RiDashboardLine,
  RiFileUploadLine,
  RiShieldUserLine,
  RiTodoLine,
} from 'react-icons/ri';
import {BiCarousel, BiCartAlt, BiErrorAlt, BiTask} from 'react-icons/bi';
import {
  BsBriefcase,
  BsCart4,
  BsChatDots,
  BsCurrencyBitcoin,
  BsQuestionDiamond,
} from 'react-icons/bs';
import {DiHtml5Multimedia} from 'react-icons/di';
import {
  MdOutlineAnalytics,
  MdOutlineContactPhone,
  MdOutlineContactSupport,
  MdOutlineDns,
  MdOutlineManageAccounts,
} from 'react-icons/md';
import {CgFeed} from 'react-icons/cg';
import {ImFeed, ImLab} from 'react-icons/im';
import {GrDatabase, GrNavigate, GrUserAdmin} from 'react-icons/gr';
import {VscTable, VscTools} from 'react-icons/vsc';
import {
  AiOutlineEdit,
  AiOutlineLayout,
  AiOutlineUnorderedList,
} from 'react-icons/ai';
import {RoutePermittedRole} from '@crema/constants/AppEnums';
import {TbFileInvoice} from 'react-icons/tb';
import {SiCivicrm} from 'react-icons/si';

const routesConfig = [
  // {
  //   id: 'app',
  //   title: 'Application',
  //   messageId: 'sidebar.application',
  //   type: 'group',
  //   children: [

  // {
  //   id: 'academy',
  //   title: 'Academy',
  //   messageId: 'sidebar.app.dashboard',
  //   type: 'item',
  //   icon: <MdOutlineSpaceDashboard />,
  //   url: '/teamsyncDashboard',
  // },

  {
    id: 'academy',
    title: 'Academy',
    messageId: 'sidebar.app.department',
    type: 'item',
    icon: <MdOutlineLocalFireDepartment />,
    url: '/department',
  },
  {
    id: 'academy',
    title: 'Academy',
    messageId: 'sidebar.app.roles',
    type: 'item',
    icon: <BsPersonLinesFill />,
    url: '/roles',
  },
  {
    id: 'academy',
    title: 'Academy',
    messageId: 'sidebar.app.dashboard.academy',
    type: 'item',
    icon: <MdOutlineSpaceDashboard />,
    url: '/user',
  },

  // {
  //   id: 'academy',
  //   title: 'Academy',
  //   messageId: 'sidebar.app.omnilearn',
  //   type: 'item',
  //   icon: <HiOutlineAcademicCap />,
  //   url: '/omniLearn',
  // },
  {
    id: 'academy',
    title: 'Academy',
    messageId: 'sidebar.app.teamsync',
    type: 'item',
    icon: <IoFolderOpenOutline />,
    url: '/teamSync',
  },
  // {
  //   id: 'academy',
  //   title: 'Academy',
  //   messageId: 'sidebar.app.product',
  //   type: 'item',
  //   icon: <RiProductHuntLine />,
  //   url: '/Products',
  // },
  // {
  //   id: 'academy',
  //   title: 'Academy',
  //   messageId: 'sidebar.app.crm',
  //   type: 'item',
  //   icon: <SiCivicrm />,
  //   url: '/crm',
  // },
  // {
  //   id: 'academy',
  //   title: 'Academy',
  //   messageId: 'sidebar.app.integration',
  //   type: 'item',
  //   icon: <MdOutlineIntegrationInstructions />,
  //   url: '/integration',
  // },
  // {
  //   id: 'academy',
  //   title: 'Academy',
  //   messageId: 'sidebar.app.organ.heriarchy',
  //   type: 'item',
  //   icon: <HiOutlineAcademicCap />,
  //   url: '/hierarchy',
  // },
  // ],
  // },
];

export default routesConfig;
