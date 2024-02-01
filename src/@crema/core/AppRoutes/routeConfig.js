import React from 'react';
import {FaRegCalendarAlt, FaRegHospital} from 'react-icons/fa';
import {FiMap, FiUsers} from 'react-icons/fi';
import {HiOutlineAcademicCap, HiOutlineChartSquareBar} from 'react-icons/hi';
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

const routesConfig = [
  // {
  //   id: 'app',
  //   title: 'Application',
  //   messageId: 'sidebar.application',
  //   type: 'group',
  //   children: [
  {
    id: 'academy',
    title: 'Academy',
    messageId: 'sidebar.app.dashboard.academy',
    type: 'item',
    // permittedRole: [RoutePermittedRole.User],
    icon: <HiOutlineAcademicCap />,
    url: '/dashboards',
  },
  // ],
  // },
];

export default routesConfig;
