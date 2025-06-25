// import React from "react";
// import { FaHeart } from "react-icons/fa6";
// import { GrMapLocation } from "react-icons/gr";
// import moment from "moment";

// const TravelStoryCard = ({
//   imgUrl,
//   title,
//   date,
//   story,
//   visitedLocation,
//   isFavourite,
//   onFavouriteClick,
//   onClick,
// }) => {
//   return (
//     <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer">
//       <img
//         src={imgUrl}
//         alt={title}
//         className="w-full h-56 object-cover rounded-lg"
//         onClick={onClick}
//       />

//       <button
//         className="w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4"
//         onClick={onFavouriteClick}
//       >
//         <FaHeart
//           className={${isFavourite ? "text-red-500" : "text-white"}}
//         />
//       </button>

//       <div className="p-4" onClick={onClick}>
//         <div className="flex items-center gap-3">
//           <div className="flex-1">
//             <h6 className="text-sm font-medium">{title}</h6>
//             <span className="text-xs text-slate-500">
//               {date ? moment(date).format("Do MMM YYYY") : "-"}
//             </span>
//           </div>
//           <FaHeart
//             size={18}
//             className={`cursor-pointer ${
//               isFavourite ? "text-red-500" : "text-gray-400"
//             }`}
//             onClick={(e) => {
//               e.stopPropagation(); // Prevent click from bubbling
//               onFavouriteClick();
//             }}
//           />
//         </div>
//         <p className="text-xs text-slate-600 mt-2">
//         {story && story.length > 0 ? story.slice(0, 60) + (story.length > 60 ? '...' : '') : ''}

//         </p>

//         <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
//           <GrMapLocation className="text-sm" />
//           {visitedLocation &&
//             visitedLocation.map((item, index) => (
//               <span key={index}>
//                 {item}
//                 {index < visitedLocation.length - 1 ? ", " : ""}
//               </span>
//             ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TravelStoryCard;

import React from "react";
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";
import DefaultImage from '../../assets/images/bg-img.jpg'; // Import a default image

const TravelStoryCard = ({
  title,
  imageUrl,
  story,
  visitedDate,
  visitedLocation,
  isFavourite,
  onClick,
  onFavouriteClick,
  
}) => {
  
  const displayImage = imageUrl || DefaultImage;
  
  // Ensure story is a string before slicing it
  const storyText = story ? String(story) : ""; // Default to empty string if story is undefined or null
 // console.log(date);

   

  return (
    <div className="border rounded-lg  overflow-hidden bg-white hover:shadow-lg hover:shadow-gray-300 transition-transform transform hover:-translate-y-1 relative cursor-pointer"
>
      <img
        src={displayImage} // Make sure this is correctly used
        alt={title}
        className="w-full h-56 object-cover" // Removed rounded-lg to let parent div handle it
        onClick={onClick}
      />

      <button
        className="w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4"
        onClick={onFavouriteClick}
      >
        <FaHeart className={`${isFavourite ? "text-red-500" : "text-white"}`} />
      </button>

      <div className="p-4" onClick={onClick}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h6 className="text-sm font-medium">{title}</h6>
            <span className="text-xs text-slate-500">
            {visitedDate ? new Date(visitedDate).toISOString().split("T")[0] : "-"}

            </span>
          </div>
          {/* <FaHeart
            size={18}
            className={`cursor-pointer ${
              isFavourite ? "text-red-500" : "text-gray-400"
            }`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from bubbling
              onFavouriteClick();
            }}
          /> */}
        </div>
        <p className="text-xs text-slate-600 mt-2">
          {storyText.length > 0
            ? storyText.slice(0, 60) + (storyText.length > 60 ? "..." : "")
            : "No story available"}
        </p>

        <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1">
          <GrMapLocation className="text-sm" />
          {visitedLocation && visitedLocation.length > 0 ? (
            visitedLocation.map((item, index) => (
              <span key={index}>
                {item}
                {index < visitedLocation.length - 1 ? ", " : ""}
              </span>
            ))
          ) : (
            <span>No locations available</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;
