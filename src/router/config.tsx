
import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Biography from "../pages/biography/page";
import TributeWall from "../pages/tribute-wall/page";
import AcademicLegacy from "../pages/academic-legacy/page";
import Mentorship from '../pages/mentorship/page';
import Gallery from '../pages/gallery/page';
import Contact from '../pages/contact/page';
import AdminDashboard from "../pages/admin/page";

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/admin',
    element: <AdminDashboard />
  },
  {
    path: '/biography',
    element: <Biography />
  },
  {
    path: '/academic-legacy',
    element: <AcademicLegacy />
  },
  {
    path: '/mentorship',
    element: <Mentorship />
  },
  {
    path: '/gallery',
    element: <Gallery />
  },
  {
    path: '/tribute-wall',
    element: <TributeWall />
  },
  {
    path: '/contact',
    element: <Contact />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
