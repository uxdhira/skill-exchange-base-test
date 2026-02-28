 
  
import React from 'react';
 
const BaseShell = ({children}:{children:React.ReactNode}) => {
  return (
    < >
    {/* <Header navigationData={navigationData} /> */}
     <div className="absolute inset-0 -z-1 pointer-events-none">
          {/* <SplashCursor
            SIM_RESOLUTION={128}
            DYE_RESOLUTION={1440}
            DENSITY_DISSIPATION={3.5}
            VELOCITY_DISSIPATION={2}
            PRESSURE={0.1}
            CURL={3}
            SPLAT_RADIUS={0.2}
            SPLAT_FORCE={6000}
            COLOR_UPDATE_SPEED={10}
          /> */}
        </div>
    {children}
    {/* <Footer /> */}
    </ >
  );
};

export default BaseShell;