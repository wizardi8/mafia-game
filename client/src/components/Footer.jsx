import React, { useMemo } from 'react';

const Footer = () => {
    const year = useMemo(() => new Date().getFullYear(), []);

    return (
        <div className="footer">Copyright © {year} wizardi</div>
    );
};

export default Footer;