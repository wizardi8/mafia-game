import React from 'react';

import CenterPageWrapper from './CenterPageWrapper';

const LoadingCenterSpinner = () => {
    return (
        <CenterPageWrapper>
            <span className="loader"></span>
        </CenterPageWrapper>
    );
};

export default LoadingCenterSpinner;
