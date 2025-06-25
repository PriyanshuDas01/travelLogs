import React from "react";
import { MdClose, MdEdit, MdDeleteOutline,MdUpdate } from "react-icons/md";
import moment from "moment";
import { GrMapLocation } from "react-icons/gr";


const ViewTravelStory = ({ storyInfo, onClose, onEditClick, onDeleteClick }) => {
  return (
    <div className="relative">
    {/* Close button */}
    <div className="flex items-center justify-end">
        <button className="btn-small" onClick={onEditClick}>
          <MdUpdate className="text-lg" /> UPDATE STORY
        </button>

        <button className="btn-delete" onClick={onDeleteClick}>
          <MdDeleteOutline className="text-lg" /> DELETE
        </button>

        <button className=""onClick={onClose}>
        <MdClose className="text-xl text-slate-400" />
        </button>
    </div>

    {/* Story Content */}
    <div>
        <div className="flex-1 flex flex-col gap-2 py-4">
        {/* Title */}
        <h1 className="text-2xl text-slate-950">
            {storyInfo && storyInfo.title}
        </h1>

        {/* Date and Location */}
        <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
            {storyInfo && moment(storyInfo.visitedDate).format("Do MMM YYYY")}
            </span>

            <div className="flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1">
            <GrMapLocation className="text-sm" />
            {storyInfo &&
                storyInfo.visitedLocation.map((item, index) =>
                storyInfo.visitedLocation.length === index + 1
                    ? `${item}`
                    : `${item}, `
                )}
            </div>
        </div>

    </div>
        <img
            src={storyInfo && storyInfo.imageUrl}
            alt="Selected"
            className="w-full h-[300px] object-cover rounded-lg"
        />

        <div className="mt-4">
            <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">
                {storyInfo && storyInfo.story}
            </p>
        </div>

    </div>
    </div>

  );
};

export default ViewTravelStory;
