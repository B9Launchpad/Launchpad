import React, { useState, useRef, useLayoutEffect } from 'react';
import { NavLink } from 'react-router-dom';
import DropdownIcon from '../../icons/Dropdown';

interface Item {
  label: string;
  url: string;
}

interface SidebarItemProps {
  children: React.ReactNode;
  type?: 'primary' | 'secondary';
  icon: React.ReactNode;
  url?: string;
  items?: Item[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ children, icon, url, type = 'primary', items }) => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (expanded) {
      wrapper.style.height = `${wrapper.scrollHeight}px`;
      wrapper.style.opacity = '1';

      const timeout = setTimeout(() => {
        if (wrapper) wrapper.style.height = 'auto';
      }, 300); // match the CSS transition

      return () => clearTimeout(timeout);
    } else {
      wrapper.style.height = `${wrapper.scrollHeight}px`; // set fixed height first
      //wrapper.offsetHeight; // force reflow
      wrapper.style.height = '0px';
      wrapper.style.opacity = '0';
    }
  }, [expanded]);

  const isExpandable = items && items.length > 0;

  return (
    <div className='sidebar__item'>
      <div
        className="sidebar__item-wrap"
        onClick={() => isExpandable ? setExpanded(!expanded) : undefined}
      >
        <div className="sidebar__item-link-group">
          <NavLink
            to={url || '#'}
            className={({ isActive }) => `sidebar__item-content ${isActive ? 'font-semibold' : ''}`}
          >
            <span className='sidebar__item-icon'>{icon}</span>
            <span className={`sidebar__item-label ${type}`}>{children}</span>
          </NavLink>
          {isExpandable && (
            <span className={`sidebar__item-expandable_label ${expanded ? 'active' : ''}`}><DropdownIcon/></span>
          )}
        </div>
      </div>

      {isExpandable && (
        <div
          ref={wrapperRef}
          className="sidebar__item-subitems-wrapper"
        >
          <ul ref={contentRef} className="sidebar__item-subitems">
            {items.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.url}
                  className={({ isActive }) => isActive ? 'font-semibold' : ''}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SidebarItem;