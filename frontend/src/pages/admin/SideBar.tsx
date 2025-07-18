import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Collapse, List } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, PersonOutline, ExitToApp, AccountCircleOutlined, 
  AnnouncementOutlined, Report, Assignment, Add, 
  ManageAccounts, LocalLibrary, ClassOutlined, 
  SupervisorAccountOutlined, AttachMoney, Search, 
  AccountBalanceWallet, Receipt, AccountTree, School, 
  Group, Event, Assessment, CreditCard, Description, 
  Grade, Category, Class, Schedule, AssignmentInd, 
  TrendingUp, GroupWork, Subject, ViewColumn, MenuBook, 
  AssignmentReturn, PersonAdd, Commute, Room, AltRoute, 
  DirectionsBus, Map, MonetizationOn, Inventory2, 
  PlaylistAdd, AddBox, Store, LocalShipping, Menu,
  Call, MailOutline, Business, Discount, Notifications, 
  Accessible, Delete, HomeWork, Block, Forward,
} from '@mui/icons-material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const SideBar = () => {
  const location = useLocation();
  const [open, setOpen] = React.useState({
    classes: false,
    Fees: false,
    income: false,
    expenses: false,
    examination: false,
    teachers: false,
    students: false,
    librarian: false,
    academics: false,
    transport: false,
    inventory: false
  });
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleToggle = (menu) => {
    setOpen((prev) => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    {
      name: 'Home',
      path: '/',
      icon: <Home />
    },
    {
      name: 'Front Office',
      icon: <ClassOutlined />,
      key: 'classes',
      subItems: [
        { name: 'Admission Enquiry', path: '/Admin/frontoffice/admissionenquiry', icon: <PersonAdd /> },
        { name: 'Visitor List', path: '/Admin/frontoffice/visitorlist', icon: <Group /> },
        { name: 'Phone Call Log', path: '/Admin/frontoffice/phone', icon: <Call /> },
        { name: 'Postal Dispatch', path: '/Admin/frontoffice/postaldispatch', icon: <LocalShipping /> },
        { name: 'Postal Receive', path: '/Admin/frontoffice/postalreceive', icon: <MailOutline /> },
        { name: 'Complaint Page', path: '/Admin/frontoffice/complaintpage', icon: <Report /> },
        { name: 'Front Office', path: '/Admin/frontoffice/frontoffice', icon: <Business /> }
      ]
    },
    {
      name: 'Fees Collection',
      icon: <Assignment />,
      key: 'Fees',
      subItems: [
        { name: 'Collect Fees', path: '/Admin/feerelated/collectfeepage', icon: <MonetizationOn /> },
        { name: 'Offline Payment', path: '/Admin/feerelated/offlinepayments', icon: <CreditCard /> },
        { name: 'Search Fee', path: '/Admin/feerelated/searchfeespayment', icon: <Search /> },
        { name: 'Search Dues Fees', path: '/Admin/feerelated/searchduesfees', icon: <Search /> },
        { name: 'Fees Master', path: '/Admin/feerelated/feesmaster', icon: <AccountBalanceWallet /> },
        { name: 'Quick Fees Master', path: '/Admin/feerelated/quickfeesmaster', icon: <AccountBalanceWallet /> },
        { name: 'Add Fees Group', path: '/Admin/feerelated/addfeesgroup', icon: <Add /> },
        { name: 'Fees Type Manager', path: '/Admin/feerelated/feestypemanager', icon: <Category /> },
        { name: 'Fees Discount Manager', path: '/Admin/feerelated/feesdiscountmanager', icon: <Discount /> },
        { name: 'Fees Carry Forward', path: '/Admin/feerelated/feesCarryForward', icon: <Forward /> },
        { name: 'Fees Reminder', path: '/Admin/feerelated/fessreminder', icon: <Notifications /> }
      ]
    },
    {
      name: 'Teachers',
      icon: <SupervisorAccountOutlined />,
      key: 'teachers',
      subItems: [
        { name: 'Add Teacher', path: '/Admin/teacherall/teacherform', icon: <PersonAdd /> },
        { name: 'Manage Teachers', path: '/Admin/teacherall/manageteacher', icon: <ManageAccounts /> },
        { name: 'Teachers', path: '/Admin/teacherall/UpdateTeacherCredentials', icon: <ManageAccounts /> },
        { name: 'Teachers', path: '/Admin/teacherall/AssignTeacherSubjectClass', icon: <ManageAccounts /> }
      ]
    },
    {
      name: 'Students',
      icon: <PersonOutline />,
      key: 'students',
      subItems: [
        { name: 'Admission', path: '/Admin/studentall/studentadmissionform', icon: <PersonAdd /> },
        { name: 'Disabled Students', path: '/Admin/studentall/disablestudents', icon: <Accessible /> },
        { name: 'Multiple Class Student', path: '/Admin/studentall/studentsearch', icon: <Search /> },
        { name: 'Bulk Delete', path: '/Admin/studentall/bulkdeletestudents', icon: <Delete /> },
        { name: 'Student Categories', path: '/Admin/studentall/categorymanager', icon: <Category /> },
        { name: 'Student House', path: '/Admin/studentall/housestudent', icon: <HomeWork /> },
        { name: 'Disable Reason', path: '/Admin/studentall/disablereason', icon: <Block /> }
      ]
    },
    {
      name: 'Librarian',
      icon: <LocalLibrary />,
      key: 'librarian',
      subItems: [
        { name: 'Add Librarian', path: '/Admin/AddLibrarian', icon: <Add /> },
        { name: 'Manage Librarian', path: '/Admin/ManageLibrarians', icon: <ManageAccounts /> },
        { name: 'Book List', path: '/Admin/library/BookList', icon: <MenuBook /> },
        { name: 'Issue/Return', path: '/Admin/library/IssueReturn', icon: <AssignmentReturn /> },
        { name: 'Add Student', path: '/Admin/AddStudent', icon: <PersonAdd /> }
      ]
    },
    {
      name: 'Income',
      icon: <AttachMoney />,
      key: 'income',
      subItems: [
        { name: 'Add Income', path: '/Admin/income/addincome', icon: <Add /> },
        { name: 'Search Income', path: '/Admin/income/searchincomepage', icon: <Search /> },
        { name: 'Income Head', path: '/Admin/income/incomeheadpage', icon: <AccountBalanceWallet /> }
      ]
    },
    {
      name: 'Expenses',
      icon: <Receipt />,
      key: 'expenses',
      subItems: [
        { name: 'Add Expenses', path: '/Admin/expenses/addexpenses', icon: <Add /> },
        { name: 'Search Expenses', path: '/Admin/expenses/searchexpensespage', icon: <Search /> },
        { name: 'Expenses Head', path: '/Admin/expenses/expenseheadpage', icon: <AccountTree /> }
      ]
    },
    {
      name: 'Examination',
      icon: <MenuBook />,
      key: 'examination',
      subItems: [
        { name: 'Exam Group', path: '/Admin/examination/groupexam', icon: <Group /> },
        { name: 'Exam Schedule', path: '/Admin/examination/examschedule', icon: <Event /> },
        { name: 'Exam Result', path: '/Admin/examination/examresult', icon: <Assessment /> },
        { name: 'Design Admit Card', path: '/Admin/examination/admitcardpage', icon: <CreditCard /> },
        { name: 'Design Marksheet', path: '/Admin/examination/marksheetdesigner', icon: <Description /> },
        { name: 'Mark Grade', path: '/Admin/examination/markgrade', icon: <Grade /> },
        { name: 'Mark Division', path: '/Admin/examination/markdivision', icon: <Category /> }
      ]
    },
    {
      name: 'Academics',
      icon: <School />,
      key: 'academics',
      subItems: [
        { name: 'Class Timetable', path: '/Admin/academics/classtimetable', icon: <Class /> },
        { name: 'Teacher Timetable', path: '/Admin/academics/teachertimetable', icon: <Schedule /> },
        { name: 'Assign Class Teacher', path: '/Admin/academics/assignclassteacher', icon: <AssignmentInd /> },
        { name: 'Promote Students', path: '/Admin/academics/promotestudents', icon: <TrendingUp /> },
        { name: 'Subject Group', path: '/Admin/academics/subjectgroup', icon: <GroupWork /> },
        { name: 'Subjects', path: '/Admin/academics/subjects', icon: <Subject /> },
        { name: 'Class', path: '/Admin/academics/Classes', icon: <Class /> },
        { name: 'Sections', path: '/Admin/academics/sections', icon: <ViewColumn /> }
      ]
    },
    {
      name: 'Transport',
      icon: <Commute />,
      key: 'transport',
      subItems: [
        { name: 'Fees Master', path: '/Admin/transport/TransportFeesMaster', icon: <AccountBalanceWallet /> },
        { name: 'Pickup Point', path: '/Admin/transport/PickupPointList', icon: <Room /> },
        { name: 'Routes', path: '/Admin/Transport/RoutesAdd', icon: <AltRoute /> },
        { name: 'Vehicle', path: '/Admin/Transport/VehicleList', icon: <DirectionsBus /> },
        { name: 'Assign Vehicle', path: '/Admin/Transport/AssignVehicle', icon: <AssignmentInd /> },
        { name: 'Route Pickup Point', path: '/Admin/Transport/RoutePickupPoint', icon: <Map /> },
        { name: 'Student Transport Fees', path: '/Admin/Transport/TransportFees', icon: <MonetizationOn /> }
      ]
    },
    {
      name: 'Inventory',
      icon: <Inventory2 />,
      key: 'inventory',
      subItems: [
        { name: 'Issue Item', path: '/Admin/Inventory/IssueItem', icon: <AssignmentReturn /> },
        { name: 'Add Item Stocks', path: '/Admin/Inventory/AddItemStocks', icon: <PlaylistAdd /> },
        { name: 'Add Item', path: '/Admin/Inventory/ItemList', icon: <AddBox /> },
        { name: 'Item Category', path: '/Admin/Inventory/ItemCategory', icon: <Category /> },
        { name: 'Item Store', path: '/Admin/Inventory/ItemStore', icon: <Store /> },
        { name: 'Item Supplier', path: '/Admin/Inventory/ItemSupplier', icon: <LocalShipping /> }
      ]
    },
    {
      name: 'Notices',
      path: '/Admin/notices',
      icon: <AnnouncementOutlined />
    },
    {
      name: 'Complaints',
      path: '/Admin/complains',
      icon: <Report />
    }
  ];

  const userItems = [
    {
      name: 'Profile',
      path: '/Admin/profile',
      icon: <AccountCircleOutlined />
    },
    {
      name: 'Logout',
      path: '/logout',
      icon: <ExitToApp />
    }
  ];

  return (
    <div className={`h-screen overflow-y-auto transition-all duration-500 fixed bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900 text-white backdrop-blur-xl bg-opacity-90 shadow-2xl z-50
      ${isSidebarOpen ? 'w-80 max-w-[20rem] md:w-64 lg:w-80' : 'w-16 md:w-20'}`}>
      <div className="p-3 flex items-center justify-between md:p-4">
        {/* <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-purple-700 transition-all duration-300">
          <Menu className="text-white hover:text-[#E8C897] filter hover:drop-shadow-[0_0_12px_rgba(232,200,151,0.8)]" />
        </button> */}
      </div>
      <List className="p-2 md:p-3">
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <ListItemButton
              component={item.path ? Link : 'button'}
              to={item.path}
              onClick={() => item.key && handleToggle(item.key)}
              sx={{
                borderRadius: '12px',
                my: 0.5,
                py: 0.75,
                backgroundColor: location.pathname === item.path || (item.key && location.pathname.startsWith(`/Admin/${item.key.toLowerCase()}`)) ? '#E8C897' : 'inherit',
                '&:hover': { backgroundColor: '#E8C897' },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <ListItemIcon className="min-w-[2rem]">
                {React.cloneElement(item.icon, {
                  color: location.pathname === item.path || (item.key && location.pathname.startsWith(`/Admin/${item.key.toLowerCase()}`)) ? 'primary' : 'inherit',
                  className: `text-lg md:text-xl transition-all duration-300 ${location.pathname === item.path || (item.key && location.pathname.startsWith(`/Admin/${item.key.toLowerCase()}`)) ? 'filter drop-shadow-[0_0_12px_rgba(21,101,192,0.9)]' : 'hover:filter hover:drop-shadow-[0_0_8px_rgba(21,101,192,0.7)]'}`
                })}
              </ListItemIcon>
              {isSidebarOpen && (
                <ListItemText 
                  primary={item.name} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }, 
                      fontWeight: 500 
                    } 
                  }} 
                />
              )}
              {item.subItems && isSidebarOpen && (
                open[item.key] ? 
                <ExpandLess sx={{ color: open[item.key] ? '#1565C0' : 'inherit', fontSize: { xs: '1rem', md: '1.25rem' } }} /> : 
                <ExpandMore sx={{ color: 'inherit', fontSize: { xs: '1rem', md: '1.25rem' } }} />
              )}
            </ListItemButton>
            {item.subItems && (
              <Collapse in={open[item.key] && isSidebarOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem, subIndex) => (
                    <ListItemButton
                      key={subIndex}
                      component={Link}
                      to={subItem.path}
                      sx={{
                        pl: { xs: 4, md: 6 },
                        borderRadius: '12px',
                        my: 0.25,
                        py: 0.5,
                        backgroundColor: location.pathname === subItem.path ? '#E8C897' : 'inherit',
                        '&:hover': { backgroundColor: '#E8C897' },
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      <ListItemIcon className="min-w-[2rem]">
                        {React.cloneElement(subItem.icon, {
                          color: location.pathname === subItem.path ? 'primary' : 'inherit',
                          className: `text-base md:text-lg transition-all duration-300 ${location.pathname === subItem.path ? 'filter drop-shadow-[0_0_12px_rgba(21,101,192,0.9)]' : 'hover:filter hover:drop-shadow-[0_0_8px_rgba(21,101,192,0.7)]'}`
                        })}
                      </ListItemIcon>
                      {isSidebarOpen && (
                        <ListItemText 
                          primary={subItem.name} 
                          sx={{ 
                            '& .MuiListItemText-primary': { 
                              fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }, 
                              fontWeight: 400 
                            } 
                          }} 
                        />
                      )}
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
        
        {isSidebarOpen && <Divider sx={{ my: { xs: 1, md: 2 }, backgroundColor: '#E8C897', opacity: 0.6 }} />}
        
        {isSidebarOpen && (
          <ListSubheader sx={{ 
            color: '#E8C897', 
            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' }, 
            fontWeight: 600, 
            backgroundColor: 'transparent', 
            textTransform: 'uppercase',
            py: 1 
          }}>
            User
          </ListSubheader>
        )}
        
        {userItems.map((item, index) => (
          <ListItemButton
            key={index}
            component={Link}
            to={item.path}
            sx={{
              borderRadius: '12px',
              my: 0.5,
              py: 0.75,
              backgroundColor: location.pathname === item.path ? '#E8C897' : 'inherit',
              '&:hover': { backgroundColor: '#E8C897' },
              transition: 'all 0.3s ease-in-out'
            }}
          >
            {/* <ListItemButton component={Link} to="/Admin/teachers">
                    <ListItemIcon>
                        <ListItemIcon color={location.pathname.startsWith("/Admin/teachers") ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Teachers" />
                </ListItemButton> */}
            <ListItemIcon className="min-w-[2rem]">
              {React.cloneElement(item.icon, {
                color: location.pathname === item.path ? 'primary' : 'inherit',
                className: `text-lg md:text-xl transition-all duration-300 ${location.pathname === item.path ? 'filter drop-shadow-[0_0_12px_rgba(21,101,192,0.9)]' : 'hover:filter hover:drop-shadow-[0_0_8px_rgba(21,101,192,0.7)]'}`
              })}
            </ListItemIcon>
            {isSidebarOpen && (
              <ListItemText 
                primary={item.name} 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }, 
                    fontWeight: 500 
                  } 
                }} 
              />
            )}
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};

export default SideBar;