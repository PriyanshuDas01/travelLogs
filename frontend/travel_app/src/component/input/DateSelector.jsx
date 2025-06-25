
// import moment from "moment";
// import { useState } from "react";
// import { MdOutlineDateRange, MdClose } from "react-icons/md";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";

// const DateSelector = ({ date, setDate }) => {
//   const [openDatePicker, setOpenDatePicker] = useState(false);

//   return (
//     <div className="relative">
//       <button
//         className="inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-2 py-1"
//         onClick={() => {
//           setOpenDatePicker(true);
//         }}
//       >
//         <MdOutlineDateRange className="text-lg" />
//         {date
//           ? moment(date).format("Do MMM YYYY")
//           : moment().format("Do MMM YYYY")}
//       </button>
//       {openDatePicker && (
//         <div className="absolute bg-white shadow-md rounded p-2 z-50">
//           <button
//             className="absolute top-2 right-2"
//             onClick={() => {
//               setOpenDatePicker(false);
//             }}
//           >
//             <MdClose className="text-xl text-sky-600" />
//           </button>
//           <DayPicker
//             captionLayout="dropdown-buttons"
//             mode="single"
//             selected={date}
//             onSelect={setDate}
//             pagedNavigation
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DateSelector;

import moment from "moment";
import { useState } from "react";
import { MdOutlineDateRange, MdClose } from "react-icons/md";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const DateSelector = ({ date, setDate }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  return (
    <div className="relative">
      <button
        className="inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-2 py-1"
        onClick={() => {
          setOpenDatePicker(true);
        }}
      >
        <MdOutlineDateRange className="text-lg" />
        {date
          ? moment(date).format("Do MMM YYYY")
          : moment().format("Do MMM YYYY")}
      </button>
      {openDatePicker && (
        <div className="absolute bg-white shadow-md rounded p-2 z-50">
          <button
            className="absolute top-2 right-2"
            onClick={() => {
              setOpenDatePicker(false);
            }}
          >
            <MdClose className="text-xl text-sky-600" />
          </button>
          <DayPicker
            captionLayout="dropdown-buttons"
            mode="single"
            selected={date}
            onSelect={setDate}
            pagedNavigation
          />
        </div>
      )}
    </div>
  );
};

export default DateSelector;
