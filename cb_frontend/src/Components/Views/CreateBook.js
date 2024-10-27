import React from 'react';
import { useSelector } from 'react-redux';
import ModifyBook from "../CreateBook/ModifyBook";
import Loading from '../CreateBook/Loading';

const CreateBook = () => {
    const { isLoading } = useSelector(state => state.book);

    const CreationContainer = (children) => <div className={`${isLoading ? 'pointer-events-none opacity-50' : ''} w-[90vw] mt-[10vh] ml-[5vw] mr-[5vw] bg-white`}>{children}</div>
    
    return <>
        {isLoading && <Loading />}
        {CreationContainer(<ModifyBook />)}
    </>
};

export default CreateBook;
