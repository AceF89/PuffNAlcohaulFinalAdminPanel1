import React from "react";
import { Navigate, Route, RouteProps } from "react-router-dom";

// components
import PrivateRoute from "./PrivateRoute";
import { NewLogin } from "../pages/auth/NewLogin";
import Dashboard from "pages/dashboard/Property";
import Categories from "pages/categories/Categories";
import CategoriesDetails from "pages/categories/CategoriesDetails";
import Products from "pages/products/Products";
import ProductsDetails from "pages/products/ProductsDetails";
import Store from "pages/store/Store";
import StoreDetails from "pages/store/StoreDetails";
import Order from "pages/order/Order";
import OrderDetails from "pages/order/OrderDetails";
import Driver from "pages/driver/Driver";
import DriverDetails from "pages/driver/DriverDetails";
import StoreUser from "pages/storeuser/StoreUser";
import StoreUserDetails from "pages/storeuser/StoreUserDetails";
import StoreAdd from "pages/store/StoreAdd";
import ProductEdit from "pages/products/ProductEdit";
import StoreOrder from "pages/storeorder/StoreOrder";
import StoreOrderDetails from "pages/storeorder/StoreOrderDetails";
import UpcomingOrder from "pages/upcomingorders/UpcomingOrder";
import UpcomingOrdersDetails from "pages/upcomingorders/UpcomingOrdersDetails";


// lazy load all the views

// auth
const Login = React.lazy(() => import("../pages/auth/Login"));
const Logout = React.lazy(() => import("../pages/auth/Logout"));
const Confirm = React.lazy(() => import("../pages/auth/Confirm"));
const ForgetPassword = React.lazy(() => import("../pages/auth/ForgetPassword"));
const Register = React.lazy(() => import("../pages/auth/Register"));
const LockScreen = React.lazy(() => import("../pages/auth/LockScreen"));

// landing
const Landing = React.lazy(() => import("../pages/landing"));


const AnalyticsDashboard = React.lazy(
  () => import("../pages/dashboard/Analytics")
);

//users
const User = React.lazy(() => import("../pages/user/User"));
const UserDetails = React.lazy(() => import("../pages/user/UserDetails"));


// apps
const CalendarApp = React.lazy(() => import("../pages/apps/Calendar"));
const Projects = React.lazy(() => import("../pages/apps/Projects"));
const ProjectDetail = React.lazy(() => import("../pages/apps/Projects/Detail"));
// - chat
const ChatApp = React.lazy(() => import("../pages/apps/Chat"));
// - email
const Inbox = React.lazy(() => import("../pages/apps/Email/Inbox"));
const EmailDetail = React.lazy(() => import("../pages/apps/Email/Detail"));
const EmailCompose = React.lazy(() => import("../pages/apps/Email/Compose"));
// - tasks
const TaskList = React.lazy(() => import("../pages/apps/Tasks/List"));
const Kanban = React.lazy(() => import("../pages/apps/Tasks/Board"));
// - file
const FileManager = React.lazy(() => import("../pages/apps/FileManager"));

// extra pages
const Error404 = React.lazy(() => import("../pages/error/Error404"));
const Error500 = React.lazy(() => import("../pages/error/Error500"));
// -other
const Starter = React.lazy(() => import("../pages/other/Starter"));
const Profile = React.lazy(() => import("../pages/other/Profile"));
const Activity = React.lazy(() => import("../pages/other/Activity"));
const Invoice = React.lazy(() => import("../pages/other/Invoice"));
const Maintenance = React.lazy(() => import("../pages/other/Maintenance"));
const Pricing = React.lazy(() => import("../pages/other/Pricing"));

// uikit
const UIElements = React.lazy(() => import("../pages/uikit"));

// widgets
const Widgets = React.lazy(() => import("../pages/widgets"));

// icons
const Unicons = React.lazy(() => import("../pages/icons/Unicons"));
const FeatherIcons = React.lazy(() => import("../pages/icons/Feather"));
const BootstrapIcon = React.lazy(() => import("../pages/icons/Bootstrap"));

// forms
const BasicForms = React.lazy(() => import("../pages/forms/Basic"));
const FormAdvanced = React.lazy(() => import("../pages/forms/Advanced"));
const FormValidation = React.lazy(() => import("../pages/forms/Validation"));
const FormWizard = React.lazy(() => import("../pages/forms/Wizard"));
const FileUpload = React.lazy(() => import("../pages/forms/FileUpload"));
const Editors = React.lazy(() => import("../pages/forms/Editors"));

// charts
const Charts = React.lazy(() => import("../pages/charts"));

// tables
const BasicTables = React.lazy(() => import("../pages/tables/Basic"));
const AdvancedTables = React.lazy(() => import("../pages/tables/Advanced"));

// maps
const GoogleMaps = React.lazy(() => import("../pages/maps/GoogleMaps"));
const VectorMaps = React.lazy(() => import("../pages/maps/VectorMaps"));

//wowrker






// import Location from "../pages/location/Location";
// import Snag from "../pages/Snag/Snag";

//Snippets
const SnippetV1 = React.lazy(() => import("../pages/snippetsV1/SnippetV1"));
const SnippetDetailV1 = React.lazy(
  () => import("../pages/snippetsV1/SnippetDetailsV1")
);



// const VectorMaps = React.lazy(() => import("../pages/maps/VectorMaps"));

export interface RoutesProps {
  path: RouteProps["path"];
  name?: string;
  element?: RouteProps["element"];
  route?: any;
  exact?: boolean;
  icon?: string;
  header?: string;
  roles?: string[];
  children?: RoutesProps[];
}


//Categories
const categoriesRoutes: RoutesProps = {
  path: "/categories",
  name: "categories",
  route: PrivateRoute,
  icon: "user",
  children: [
    {
      path: "/categories/",
      name: "categories",
      element: <Categories/>,
      route: PrivateRoute,
    },
    {
      path: "/categories/:id",
      name: "categories",
      element: <CategoriesDetails />,
      route: PrivateRoute,
    },
  ],
};

//userstore
const userstoreRoutes: RoutesProps = {
  path: "/myUserStore",
  name: "myUserStore",
  route: PrivateRoute,
  icon: "myUserStore",
  children: [
    {
      path: "/myUserStore/",
      name: "myUserStore",
      element: <StoreUser/>,
      route: PrivateRoute,
    },
    {
      path: "/myUserStore/:id",
      name: "myUserStore",
      element: <StoreUserDetails />,
      route: PrivateRoute,
    },
  ],
};


//store
const storeRoutes: RoutesProps = {
  path: "/store",
  name: "store",
  route: PrivateRoute,
  icon: "store",
  children: [
    {
      path: "/store/",
      name: "store",
      element: <Store/>,
      route: PrivateRoute,
    },
    {
      path: "/store/:id",
      name: "store",
      element: <StoreDetails />,
      route: PrivateRoute,
    },
    {
      path: "/store/edit/:id",
      name: "store",
      element: <StoreAdd />,
      route: PrivateRoute,
    },
  ],
};

//driver
const driverRoutes: RoutesProps = {
  path: "/driver",
  name: "driver",
  route: PrivateRoute,
  icon: "driver",
  children: [
    {
      path: "/driver/",
      name: "driver",
      element: <Driver/>,
      route: PrivateRoute,
    },
    {
      path: "/driver/:id",
      name: "driver",
      element: <DriverDetails />,
      route: PrivateRoute,
    },
  ],
};

//order
const orderRoutes: RoutesProps = {
  path: "/order",
  name: "order",
  route: PrivateRoute,
  icon: "order",
  children: [
    {
      path: "/order/",
      name: "order",
      element: <Order/>,
      route: PrivateRoute,
    },
    {
      path: "/order/:id",
      name: "order",
      element: <OrderDetails />,
      route: PrivateRoute,
    },
  ],
};

//order
const upcomingOrdersRoutes: RoutesProps = {
  path: "/upcoming",
  name: "upcoming",
  route: PrivateRoute,
  icon: "upcoming",
  children: [
    {
      path: "/upcoming/",
      name: "upcoming",
      element: <UpcomingOrder/>,
      route: PrivateRoute,
    },
    {
      path: "/upcoming/:id",
      name: "upcoming",
      element: <UpcomingOrdersDetails />,
      route: PrivateRoute,
    },
  ],
};

//storeorder
const storeorderRoutes: RoutesProps = {
  path: "/storeorder",
  name: "storeorder",
  route: PrivateRoute,
  icon: "storeorder",
  children: [
    {
      path: "/storeorder/",
      name: "storeorder",
      element: <StoreOrder/>,
      route: PrivateRoute,
    },
    {
      path: "/storeorder/:id",
      name: "storeorder",
      element: <StoreOrderDetails />,
      route: PrivateRoute,
    },
  ],
};

// dashboards
const dashboardRoutes: RoutesProps = {
  path: "/",
  name: "Dashboards",
  icon: "airplay",
  header: "Navigation",
  children: [
    {
      path: "/dashboard",
      name: "Dashboard",
      element: <Dashboard />,
      route: PrivateRoute,
    },
    // {
    //   path: "/dashboard/joudma",
    //   name: "Joudma",
    //   element: <JoudmaDashboard />,
    //   route: PrivateRoute,
    // },
    {
      path: "/dashboard/analytics",
      name: "Analytics",
      element: <AnalyticsDashboard />,
      route: PrivateRoute,
    },
    // {
    //   path: "/dashboard/ecom",
    //   name: "Analytics",
    //   element: <EcommerceDashboard />,
    //   route: PrivateRoute,
    // },
  ],
};
//Products
const productsRoutes: RoutesProps = {
  path: "/products",
  name: "products",
  route: PrivateRoute,
  icon: "user",
  children: [
    {
      path: "/products/",
      name: "products",
      element: <Products/>,
      route: PrivateRoute,
    },
    {
      path: "/products/:id",
      name: "products",
      element: <ProductsDetails />,
      route: PrivateRoute,
    },
    {
      path: "/products/edit/:id",
      name: "products",
      element: <ProductEdit />,
      route: PrivateRoute,
    },
  ],
};

//User,
const userRoutes: RoutesProps = {
  path: "/user",
  name: "user",
  route: PrivateRoute,
  icon: "user",
  children: [
    {
      path: "/user/",
      name: "user",
      element: <User />,
      route: PrivateRoute,
    },
    {
      path: "/user/:id",
      name: "user",
      element: <UserDetails />,
      route: PrivateRoute,
    },
  ],
};






//Snippet
const SnippetsRoutes: RoutesProps = {
  path: "/snippet",
  name: "snippet",
  route: PrivateRoute,
  icon: "snippet",
  children: [
    {
      path: "/snippet/",
      name: "snippet",
      element: <SnippetV1 />,
      route: PrivateRoute,
    },
    {
      path: "/snippet/:id",
      name: "snippet",
      element: <SnippetDetailV1 />,
      route: PrivateRoute,
    },
  ],
};



const calendarAppRoutes: RoutesProps = {
  path: "/apps/calendar",
  name: "Calendar",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "calendar",
  element: <CalendarApp />,
  header: "Apps",
};

const chatAppRoutes: RoutesProps = {
  path: "/apps/chat",
  name: "Chat",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "message-square",
  element: <ChatApp />,
};

const emailAppRoutes: RoutesProps = {
  path: "/apps/email",
  name: "Email",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "mail",
  children: [
    {
      path: "/apps/email/inbox",
      name: "Inbox",
      element: <Inbox />,
      route: PrivateRoute,
    },
    {
      path: "/apps/email/details",
      name: "Email Details",
      element: <EmailDetail />,
      route: PrivateRoute,
    },
    {
      path: "/apps/email/compose",
      name: "Compose Email",
      element: <EmailCompose />,
      route: PrivateRoute,
    },
  ],
};

const projectAppRoutes: RoutesProps = {
  path: "/apps/projects",
  name: "Projects",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "uil-briefcase",

  children: [
    {
      path: "/apps/projects/list",
      name: "List",
      element: <Projects />,
      route: PrivateRoute,
    },
    {
      path: "/apps/projects/details",
      name: "Detail",
      element: <ProjectDetail />,
      route: PrivateRoute,
    },
  ],
};

const taskAppRoutes: RoutesProps = {
  path: "/apps/tasks",
  name: "Tasks",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "clipboard",
  children: [
    {
      path: "/apps/tasks/list",
      name: "Task List",
      element: <TaskList />,
      route: PrivateRoute,
    },
    {
      path: "/apps/tasks/kanban",
      name: "Kanban",
      element: <Kanban />,
      route: PrivateRoute,
    },
  ],
};

const fileAppRoutes: RoutesProps = {
  path: "/apps/file-manager",
  name: "File Manager",
  route: PrivateRoute,
  roles: ["Admin"],
  icon: "folder-plus",
  element: <FileManager />,
};

const appRoutes = [
  calendarAppRoutes,
  chatAppRoutes,
  emailAppRoutes,
  projectAppRoutes,
  taskAppRoutes,
  fileAppRoutes,
  userRoutes,
  categoriesRoutes,
  productsRoutes,

];

// pages
const extrapagesRoutes: RoutesProps = {
  path: "/pages",
  name: "Pages",
  icon: "package",
  header: "Custom",
  children: [
    {
      path: "/pages/starter",
      name: "Starter",
      element: <Starter />,
      route: PrivateRoute,
    },
    {
      path: "/pages/profile",
      name: "Profile",
      element: <Profile />,
      route: PrivateRoute,
    },
    {
      path: "/pages/activity",
      name: "Activity",
      element: <Activity />,
      route: PrivateRoute,
    },
    {
      path: "/pages/invoice",
      name: "Invoice",
      element: <Invoice />,
      route: PrivateRoute,
    },
    {
      path: "/pages/pricing",
      name: "Pricing",
      element: <Pricing />,
      route: PrivateRoute,
    },
  ],
};

// ui
const uiRoutes: RoutesProps = {
  path: "/components",
  name: "Components",
  icon: "package",
  header: "UI Elements",
  children: [
    {
      path: "/components/ui-elements",
      name: "UIElements",
      element: <UIElements />,
      route: PrivateRoute,
    },
    {
      path: "/components/widgets",
      name: "Widgets",
      element: <Widgets />,
      route: PrivateRoute,
    },
    {
      path: "/icons",
      name: "Icons",
      children: [
        {
          path: "/icons/unicons",
          name: "Unicons",
          element: <Unicons />,
          route: PrivateRoute,
        },
        {
          path: "/icons/feather",
          name: "Feather",
          element: <FeatherIcons />,
          route: PrivateRoute,
        },
        {
          path: "/icons/bootstrap",
          name: "Bootstrap Icon",
          element: <BootstrapIcon />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: "/forms",
      name: "Forms",
      children: [
        {
          path: "/forms/basic",
          name: "Basic Elements",
          element: <BasicForms />,
          route: PrivateRoute,
        },
        {
          path: "/forms/advanced",
          name: "Form Advanced",
          element: <FormAdvanced />,
          route: PrivateRoute,
        },
        {
          path: "/forms/validation",
          name: "Form Validation",
          element: <FormValidation />,
          route: PrivateRoute,
        },
        {
          path: "/forms/wizard",
          name: "Form Wizard",
          element: <FormWizard />,
          route: PrivateRoute,
        },
        {
          path: "/forms/upload",
          name: "File Upload",
          element: <FileUpload />,
          route: PrivateRoute,
        },
        {
          path: "/forms/editors",
          name: "Editors",
          element: <Editors />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: "/components/charts",
      name: "Charts",
      element: <Charts />,
      route: PrivateRoute,
    },
    {
      path: "/tables",
      name: "Tables",
      children: [
        {
          path: "/tables/basic",
          name: "Basic",
          element: <BasicTables />,
          route: PrivateRoute,
        },
        {
          path: "/tables/advanced",
          name: "Advanced",
          element: <AdvancedTables />,
          route: PrivateRoute,
        },
      ],
    },
    {
      path: "/maps",
      name: "Maps",
      children: [
        {
          path: "/maps/googlemaps",
          name: "Google Maps",
          element: <GoogleMaps />,
          route: PrivateRoute,
        },
        {
          path: "/maps/vectorMaps",
          name: "Google Maps",
          element: <VectorMaps />,
          route: PrivateRoute,
        },
      ],
    },
  ],
};

// auth
const authRoutes: RoutesProps[] = [
  {
    path: "/auth/login",
    name: "Login",
    element: <NewLogin />,
    route: Route,
  },
  // {
  //   path: "/auth/splash",
  //   name: "Splash Screen",
  //   element: <SplashScreen />,
  //   route: Route,
  // },
  {
    path: "/auth/newlogin",
    name: "Splash Screen",
    element: <NewLogin />,
    route: Route,
  },
  {
    path: "/auth/register",
    name: "Register",
    element: <Register />,
    route: Route,
  },
  {
    path: "/auth/confirm",
    name: "Confirm",
    element: <Confirm />,
    route: Route,
  },
  {
    path: "/auth/forget-password",
    name: "Forget Password",
    element: <ForgetPassword />,
    route: Route,
  },
  {
    path: "/auth/lock-screen",
    name: "Lock Screen",
    element: <LockScreen />,
    route: Route,
  },
  {
    path: "/auth/logout",
    name: "Logout",
    element: <Logout />,
    route: Route,
  },
];

// public routes
const otherPublicRoutes: RoutesProps[] = [
  {
    path: "/landing",
    name: "landing",
    element: <Landing />,
    route: Route,
  },
  {
    path: "/maintenance",
    name: "Maintenance",
    element: <Maintenance />,
    route: Route,
  },
  {
    path: "/error-404",
    name: "Error - 404",
    element: <Error404 />,
    route: Route,
  },
  {
    path: "/error-500",
    name: "Error - 500",
    element: <Error500 />,
    route: Route,
  },
];

// flatten the list of all nested routes
const flattenRoutes = (routes: RoutesProps[]) => {
  let flatRoutes: RoutesProps[] = [];

  routes = routes || [];
  routes.forEach((item: RoutesProps) => {
    flatRoutes.push(item);

    if (typeof item.children !== "undefined") {
      flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
    }
  });
  return flatRoutes;
};

// All routes
const authProtectedRoutes = [
  dashboardRoutes,
  userRoutes,
  storeRoutes,
  SnippetsRoutes,
  orderRoutes,
  driverRoutes,
  userstoreRoutes,
  storeorderRoutes,
  upcomingOrdersRoutes,
  ...appRoutes,
  extrapagesRoutes,
  uiRoutes,
  categoriesRoutes,
  productsRoutes,
];
const publicRoutes = [...authRoutes, ...otherPublicRoutes];

const authProtectedFlattenRoutes = flattenRoutes([...authProtectedRoutes]);
const publicProtectedFlattenRoutes = flattenRoutes([...publicRoutes]);
export {
  publicRoutes,
  authProtectedRoutes,
  authProtectedFlattenRoutes,
  publicProtectedFlattenRoutes,
};
