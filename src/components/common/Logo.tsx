import React from 'react';
import useIsDarkTheme from '../../functions/useIsDarkTheme';

const Logo: React.FC = () => {
  const isDarkTheme = useIsDarkTheme()

  return (
    <div className="logo">
      <img src={`/Logo${isDarkTheme == true ? '-dark' : ''}.png`} alt="Launchpad Logo" />
    </div>
  );
};

export default Logo;