import React from 'react';

const Loading = ({ description }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[15]">
            <div className="bg-white p-4 rounded-lg w-full max-w-md">
                <div className="flex flex-col items-center">
                    {description && (
                        <p className="text-lg font-semibold mb-4 text-center">{description}</p>
                    )}
                    <div className="w-16 h-16 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
};

export default Loading;
