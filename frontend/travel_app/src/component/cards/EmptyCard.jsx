import React from 'react';

const EmptyCard = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <p className="max-w-md text-lg font-medium text-slate-600 text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;