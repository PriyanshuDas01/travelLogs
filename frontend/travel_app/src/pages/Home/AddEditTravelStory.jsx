import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import moment from "moment";

import TagInput from "../../component/input/TagInput";
import DateSelector from "../../component/input/DateSelector";
import ImageSelector from "../../component/input/ImageSelector";

import axiosInstance from "../../utils/axiosinstance";
import uploadImage from "../../utils/uploadImage";

const AddEditTravelStory = ({ onClose, getAllTravelStories }) => {
    const [title, setTitle] = useState("");
    const [story, setStory] = useState("");
    const [visitedLocation, setVisitedLocation] = useState([]);
    const [visitedDate, setVisitedDate] = useState(moment());
    const [storyImageFile, setStoryImageFile] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAddStory = async () => {
        // Simple frontend validation
        if (!title) {
            setError("Please enter a title.");
            return;
        }
        if (!story) {
            setError("Please write your story.");
            return;
        }
        setError("");
        setIsLoading(true);

        try {
            let imageUrl = "";

            // 1. Upload the image if one is selected
            if (storyImageFile) {
                console.log("Uploading image...");
                const imgUploadResponse = await uploadImage(storyImageFile);
                imageUrl = imgUploadResponse.imageUrl;
                console.log("Image uploaded successfully:", imageUrl);
            }

            // 2. Send the story data to the backend
            const storyData = {
                title,
                story,
                imageUrl,
                visitedLocation,
                visitedDate: moment(visitedDate).valueOf(),
            };
            
            console.log("Sending story data to backend:", storyData);
            const response = await axiosInstance.post("/add-travel-story", storyData);

            if (response.data && !response.data.error) {
                toast.success("Story added successfully!");
                getAllTravelStories(); // Refresh the list of stories
                onClose(); // Close the modal
            }
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An unexpected error occurred.";
            console.error("Error adding story:", errorMessage);
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h5 className="text-xl font-medium text-slate-700">Add Story</h5>
                <div className="flex items-center gap-3">
                    <button 
                        className="btn-primary flex items-center gap-2" 
                        onClick={handleAddStory}
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : (
                            <>
                                <MdAdd className="text-lg" /> ADD STORY
                            </>
                        )}
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded" onClick={onClose}>
                        <MdClose className="text-xl text-slate-400" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
                <label className="input-label">TITLE</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="A wonderful day in the mountains..."
                />

                <label className="input-label">STORY</label>
                <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    rows="4"
                    className="text-lg outline-none bg-slate-50 p-2 rounded"
                    placeholder="Write about your amazing experience..."
                />

                <label className="input-label">IMAGE</label>
                <ImageSelector
                    image={storyImageFile}
                    setImage={setStoryImageFile}
                />

                <label className="input-label">VISITED DATE</label>
                <DateSelector
                    selectedDate={visitedDate}
                    setSelectedDate={setVisitedDate}
                />

                <label className="input-label">LOCATIONS / TAGS</label>
                <TagInput
                    tags={visitedLocation}
                    setTags={setVisitedLocation}
                    placeholder="Add locations or tags..."
                />

                {error && <p className="text-red-500 text-sm pt-4">{error}</p>}
            </div>
        </div>
    );
};

export default AddEditTravelStory;

