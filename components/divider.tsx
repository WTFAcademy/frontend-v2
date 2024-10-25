import React from 'react';
import Balancer from 'react-wrap-balancer'

const Divider = ({
    children,
}: { children: React.ReactNode }) => {
    return (
        <div className='flex items-center w-full'>
            <div className="flex-grow border-t border-wtf-border-line"></div>
            <Balancer className='px-3 text-center text-sm font-normal leading-5 text-wtf-content-3'>{children}</Balancer>
            <div className="flex-grow border-t border-wtf-border-line"></div>
        </div >
    );
};

export default Divider;