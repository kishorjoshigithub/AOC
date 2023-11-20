import React from 'react';
import { useSelector } from 'react-redux';

const DashboardHome = () => {
  const userData = useSelector((state) => state.user.userData);

  return (
    <div>
     <h1>Home Dahboard</h1>
    </div>
  );
};

export default DashboardHome;
