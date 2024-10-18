import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import classNames from "classnames";
import FeatherIcon from "feather-icons-react";

//helpers
import { findAllParent, findMenuItem } from "../helpers/menu";

// constants
import { MenuItemTypes, UserRole } from "../constants/menu";
import { useUser } from "../hooks";

interface SubMenus {
  item: MenuItemTypes;
  linkClassName?: string;
  subMenuClassNames?: string;
  activeMenuItems?: Array<string>;
  toggleMenu?: (item: any, status: boolean) => void;
  className?: string;
}

const MenuItemWithChildren = ({
  item,
  linkClassName,
  subMenuClassNames,
  activeMenuItems,
  toggleMenu,
}: SubMenus) => {
  const [open, setOpen] = useState<boolean>(
    activeMenuItems!.includes(item.key)
  );




  useEffect(() => {
    setOpen(activeMenuItems!.includes(item.key));
  }, [activeMenuItems, item]);

  const toggleMenuItem = (e: any) => {
    e.preventDefault();
    const status = !open;
    setOpen(status);
    if (toggleMenu) toggleMenu(item, status);
    return false;
  };

  

  return (
    <li className={classNames({ "menuitem-active": open })}>
      <Link
        to="#"
        onClick={toggleMenuItem}
        data-menu-key={item.key}
        aria-expanded={open}
        className={classNames("side-sub-nav-link", linkClassName, {
          "menuitem-active": activeMenuItems!.includes(item.key)
            ? "active"
            : "",
        })}
      >
        {item.icon && <FeatherIcon icon={item.icon} />}
        {!item.badge ? (
          <span className="menu-arrow"></span>
        ) : (
          <span className={`badge bg-${item.badge.variant} float-end`}>
            {item.badge.text}
          </span>
        )}
        <span> {item.label} </span>
      </Link>
      <Collapse in={open}>
        <div>
          <ul className={classNames(subMenuClassNames)}>
            {(item.children || []).map((child, i) => {
              return (
                <React.Fragment key={i}>
                  {child.children ? (
                    <>
                      {/* parent */}
                      <MenuItemWithChildren
                        item={child}
                        linkClassName={
                          activeMenuItems!.includes(child.key) ? "active" : ""
                        }
                        activeMenuItems={activeMenuItems}
                        subMenuClassNames="side-nav-third-level"
                        toggleMenu={toggleMenu}
                      />
                    </>
                  ) : (
                    <>
                      {/* child */}
                      <MenuItem
                        item={child}
                        className={
                          activeMenuItems!.includes(child.key)
                            ? "menuitem-active"
                            : ""
                        }
                        linkClassName={
                          activeMenuItems!.includes(child.key) ? "active" : ""
                        }
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      </Collapse>
    </li>
  );
};

const MenuItem = ({ item, className, linkClassName }: SubMenus) => {
  return (
    <li className={classNames("side-nav-item", className,)}>
      <MenuItemLink item={item} className={linkClassName} />
    </li>
  );
};

const MenuItemLink = ({ item, className }: SubMenus) => {
  let location = useLocation();
  const {pathname} = location;
  const result = pathname.split('/')
  return (
    <Link
      to={item?.url? item.url:"#"}
      target={item.target}
      className={classNames("side-nav-link-ref", className, pathname.includes(item.key)?"active":'')}
      data-menu-key={item.key}
    >
      {/* {item.icon && <FeatherIcon icon={item.icon} />} */}
      {item.icon && <FeatherIcon icon={item.icon} />}
      {item.badge && (
        <span className={`badge bg-${item.badge.variant} float-end`}>
          {item.badge.text}
        </span>
      )}
      <span> {item.label} </span>
    </Link>
  );
};

/**
 * Renders the application menu
 */
interface AppMenuProps {
  menuItems: MenuItemTypes[];
}

const AppMenu = ({ menuItems }: AppMenuProps) => {
  const [currentMenuItems, setCurrentMenuItems] = useState<MenuItemTypes[]>(
		[],
	);
  let location = useLocation();

  const menuRef: any = useRef(null);

  const [activeMenuItems, setActiveMenuItems] = useState<Array<string>>([]);

  /*
   * toggle the menus
   */
  const toggleMenu = (menuItem: MenuItemTypes, show: boolean) => {
    if (show)
      setActiveMenuItems([
        menuItem["key"],
        ...findAllParent(menuItems, menuItem),
      ]);
  };

  /**
   * activate the menuitems
   */
  const activeMenu = useCallback(() => {
    const div = document.getElementById("side-menu");
    let matchingMenuItem = null;

    if (div) {
      let items: any = div.getElementsByClassName("side-nav-link-ref");
      for (let i = 0; i < items.length; ++i) {
        let trimmedURL = location?.pathname?.replaceAll(process.env.PUBLIC_URL, "");
        if (trimmedURL === items[i]?.pathname?.replaceAll(process.env.PUBLIC_URL, "")) {
          matchingMenuItem = items[i];
          break;
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute("data-menu-key");
        const activeMt = findMenuItem(menuItems, mid);
        if (activeMt) {
          setActiveMenuItems([
            activeMt["key"],
            ...findAllParent(menuItems, activeMt),
          ]);
        }
      }
    }
  }, [location, menuItems]);

  const getAllowedMenuItems = (
		menuList: Array<MenuItemTypes>,
		curUserRole: UserRole,
	): MenuItemTypes[] => {
		const tempMenuItem: MenuItemTypes[] = [];
		menuList.map((item: MenuItemTypes) => {
			if (item.allowedUsers.includes(curUserRole) && item.children) {
				const childList = getAllowedMenuItems(
					item.children,
					curUserRole,
				);
				if (childList.length > 0) {
					tempMenuItem.push({ ...item, children: childList });
				}
			} else if (curUserRole && item.allowedUsers.includes(curUserRole)) {
				return tempMenuItem.push(item);
			}
			return null;
		});
		return tempMenuItem;
	};

	const { user }:any = useUser();

	const loadAllowedMenuItems = () => {
		if (user) {
			const list = getAllowedMenuItems(menuItems, user.roleName);
      setCurrentMenuItems(list);
		}
	};

  useEffect(() => {
		loadAllowedMenuItems();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [menuItems, user]);

  useEffect(() => {
    activeMenu();
  }, [activeMenu]);

  return (
    <>
      <ul className="side-menu" ref={menuRef} id="side-menu">
        {(currentMenuItems || []).map((item, idx) => {
          return (
            <React.Fragment key={idx}>
              {item.isTitle ? (
                <li
                  className={classNames("menu-title", {
                    "mt-2": idx !== 0,
                  })}
                >
                  {item.label}
                </li>
              ) : (
                <>
                  {item.children ? (
                    <MenuItemWithChildren
                      item={item}
                      toggleMenu={toggleMenu}
                      subMenuClassNames="nav-second-level"
                      activeMenuItems={activeMenuItems}
                    />
                  ) : (
                    <MenuItem
                      item={item}
                      className={location?.pathname.includes(item.key)?"active":''}
                    />
                  )}
                </>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </>
  );
};

export default AppMenu;
