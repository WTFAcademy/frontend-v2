import React from 'react';

const Divider = ({
    children,
}: { children: React.ReactNode }) => {
    return (
        <div className='flex items-center w-full'>
            <div className="flex-grow border-t border-gray-300"></div>
            <p className='px-3 text-sm font-normal leading-5 text-gray-500'>{children}</p>
            <div className="flex-grow border-t border-gray-300"></div>
        </div >
    );
};

export default Divider;