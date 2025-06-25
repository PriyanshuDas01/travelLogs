import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { MdAdd } from 'react-icons/md';

import Navbar from '../../component/Navbar';
import TravelStoryCard from '../../component/cards/TravelStoryCard';
import AddEditTravelStory from './AddEditTravelStory';
import EmptyCard from '../../component/cards/EmptyCard';
import ViewTravelStory from './ViewTravelStory';

import axiosInstance from '../../utils/axiosinstance';
import { toast } from 'react-toastify';


const Home = () => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [allStories, setAllStories] = useState([]);
    
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null,
    });

    const [openViewStoryModal, setOpenViewStoryModal] = useState({ isShown: false, data: null });

    const [isSearching, setIsSearching] = useState(false);

    // Get User Info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    // Get All Travel Stories
    const getAllTravelStories = async () => {
        try {
            const response = await axiosInstance.get("/get-all-travel-stories");
            if (response.data && response.data.stories) {
                setAllStories(response.data.stories);
            }
        } catch (error) {
            console.error("An unexpected error occurred while fetching stories:", error);
            toast.error("Could not fetch stories. Please try again.");
        }
    };

    // Delete Travel Story
    const deleteTravelStory = async (storyData) => {
        const storyId = storyData._id;
        try {
            const response = await axiosInstance.delete(`/delete-story/${storyId}`);
            if (response.data && !response.data.error) {
                toast.success("Story Deleted Successfully");
                getAllTravelStories();
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        }
    };

    // Handle Edit
    const handleEdit = (storyData) => {
        // For now, we only have 'add' functionality as per our refactor.
        // This can be expanded later.
        setOpenAddEditModal({ isShown: true, type: "add", data: null });
        toast.info("Edit functionality coming soon!");
    };
    
    // Search Stories
    const onSearchStory = async (query) => {
        if (!query) {
            setIsSearching(false);
            getAllTravelStories();
            return;
        }

        setIsSearching(true);
        try {
            const response = await axiosInstance.get("/search", {
                params: { query },
            });
            if (response.data && response.data.stories) {
                setAllStories(response.data.stories);
            }
        } catch (error) {
            toast.error("An error occurred during search.");
        }
    };

    const handleClearSearch = () => {
        setIsSearching(false);
        getAllTravelStories();
    };

    // Update Favourite
    const updateIsFavourite = async (storyData) => {
        const storyId = storyData._id;
        try {
            const response = await axiosInstance.put(`/update-is-favourite/${storyId}`, {
                isFavourite: !storyData.isFavourite,
            });
            if (response.data && response.data.story) {
                toast.success("Favourite status updated!");
                getAllTravelStories();
            }
        } catch (error) {
            toast.error("Failed to update favourite status.");
        }
    };
    
    useEffect(() => {
        getUserInfo();
        getAllTravelStories();
    }, []);

    return (
        <>
            <Navbar userInfo={userInfo} onSearchStory={onSearchStory} onClearSearch={handleClearSearch} />

            <div className="container mx-auto py-10">
                {allStories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {allStories.map((story) => (
                            <TravelStoryCard
                                key={story._id}
                                title={story.title}
                                imageUrl={story.imageUrl}
                                createdOn={story.createdOn}
                                story={story.story}
                                visitedDate={story.visitedDate}
                                visitedLocation={story.visitedLocation}
                                isFavourite={story.isFavourite}
                                onEdit={() => handleEdit(story)}
                                onDelete={() => deleteTravelStory(story)}
                                onClick={() => setOpenViewStoryModal({ isShown: true, data: story })}
                                onFavouriteClick={() => updateIsFavourite(story)}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyCard 
                        message={isSearching ? "No stories found matching your search." : "You haven't added any stories yet. Click the button below to start!"} 
                    />
                )}
            </div>

            <button
                className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10 shadow-lg"
                onClick={() => {
                    setOpenAddEditModal({ isShown: true, type: "add", data: null });
                }}
            >
                <MdAdd className="text-[32px] text-white" />
            </button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                    },
                }}
                contentLabel="Add/Edit Story Modal"
                className="w-[90%] md:w-[60%] max-h-[85vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-y-auto"
                appElement={document.getElementById("root")}
            >
                <AddEditTravelStory
                    type={openAddEditModal.type}
                    storyInfo={openAddEditModal.data}
                    onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
                    getAllTravelStories={getAllTravelStories}
                />
            </Modal>

            <Modal
                isOpen={openViewStoryModal.isShown}
                onRequestClose={() => setOpenViewStoryModal({ isShown: false, data: null })}
                 style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                    },
                }}
                contentLabel="View Story Modal"
                className="w-[90%] md:w-[60%] max-h-[85vh] bg-white rounded-md mx-auto mt-14 p-5 overflow-y-auto"
                appElement={document.getElementById("root")}
            >
                <ViewTravelStory
                    storyInfo={openViewStoryModal.data}
                    onClose={() => setOpenViewStoryModal({ isShown: false, data: null })}
                    onEditClick={() => {
                        setOpenViewStoryModal({ isShown: false, data: null });
                        handleEdit(openViewStoryModal.data);
                    }}
                    onDeleteClick={() => {
                        deleteTravelStory(openViewStoryModal.data);
                        setOpenViewStoryModal({ isShown: false, data: null });
                    }}
                />
            </Modal>
        </>
    );
}

export default Home;
