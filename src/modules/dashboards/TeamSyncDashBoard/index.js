import React from 'react';
import CardDetails from './CardDetails';
import {useGetDataApi} from '@crema/hooks/APIHooks';
import Crypto from '../Crypto';

const index = () => {
  const [{apiData: cryptoData, loading}] = useGetDataApi('/dashboard/crypto');

  return <Crypto />;
  //   (
  //     <div>
  //       {/* <CardDetails cardDetails={cryptoData?.cardDetails} /> */}
  //       <Crypto />;
  //     </div>
  //   );
};

export default index;
