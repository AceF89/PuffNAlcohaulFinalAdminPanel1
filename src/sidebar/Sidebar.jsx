/* eslint-disable react/prop-types */

import { Link } from 'react-router-dom';
import { HiUsers } from "react-icons/hi2";
import { FaRegBuilding } from 'react-icons/fa';
import { TbReportSearch } from "react-icons/tb";

const Sidebar = ({ onItemClick }) => {
  const menuItems = [{
    name:'User Management',
    route:'',
    icon:<HiUsers size={22}/>
  }, 
    {name:'Snag Management',
    route:'snagmanagement',
      icon:<FaRegBuilding color='#0C94EA' size={22}/>
  },
  {name:'Report Management',
  route:'',
    icon:<TbReportSearch color='#0C94EA' size={24}/>
}
]; // Add more menu items as needed

  return (
    <div className="sidebar pt-4">
      {/* <img src={logo} alt="Logo" />
      <hr /> */}
      <ul className="nav flex-column">
        {menuItems.map((item, index) => (
          <li key={index} className="nav-item" style={{ display: 'flex', alignItems: 'center' }}>
            <Link
              to={`/${item.route}`}
              className="nav-link"
              onClick={() => onItemClick(item)}
              style={{ color: '#0C94EA', display: 'flex', alignItems: 'center' }}
            >
              <div>
                <img src={item?.icon} alt="" />
              </div>
              {/* <span className='pr-2'>{item?.icon}</span>
              <span>{item.name}</span> */}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
