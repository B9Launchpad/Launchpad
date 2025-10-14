import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import DropdownIcon from '../../icons/Dropdown';
import { useSpring, animated } from '@react-spring/web';
import SpringConfig from '../../../utils/SpringConfig';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ===== TO DO =====

1. Add focus functionality.
2. Add aria-labelling.

*/

interface Item {
  label: string;
  url: string;
}

export interface SidebarItemProps {
  label: string;
  type?: 'primary' | 'secondary';
  icon: React.ReactNode;
  url?: string;
  items?: Item[];
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon, url, type = 'primary', items }) => {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const pathname = usePathname()
  const isActive = pathname === url

{/* Konfiguration für Animation des zusammneklappbares Elements */}
 
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [items]);

  const style = useSpring({
    height: expanded ? contentHeight : 0,
    opacity: expanded ? 1 : 0,
    overflow: 'hidden',
    config: SpringConfig,
  });

  const isExpandable = items && items.length > 0;

  return (
    <div className='sidebar__item'>
      <div
        className="sidebar__item-wrap"
        onClick={() => isExpandable ? setExpanded(!expanded) : undefined}
      >
        <div className="sidebar__item-link-group">
          <Link
            href={url || '#'}
            className={`sidebar__item-content ${isActive ? 'font-semibold' : ''}`}
          >
            <span className='sidebar__item-icon'>{icon}</span>
            <span className={`sidebar__item-label ${type}`}>{label}</span>
          </Link>
          {isExpandable && (
            <span className={`sidebar__item-expandable_label ${expanded ? 'active' : ''}`}><DropdownIcon/></span>
          )}
        </div>
      </div>


      {/* Animierte elemente mit animated.div (react-spring). NUR WENN SIDEBAR ITEM ZUSAMMENKLAPPBAR IST SIEHBAR */}
      {isExpandable && (
        <animated.div style={style}
          ref={wrapperRef}
          className="sidebar__item-subitems-wrapper"
        >
          <ul ref={contentRef} className="sidebar__item-subitems">
            {items.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.url}
                  className="sidebar__item--subitem-link"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </animated.div>
      )}
    </div>
  );
};

export default SidebarItem;