/* eslint-disable react-hooks/exhaustive-deps */
import { useReducer, useEffect, useMemo, useState, useRef } from "react";
import { Editor } from "primereact/editor";
import Input from "../../../../components/shared/Input/Input";
import { motion } from "framer-motion";
import AddNewStudio from "../../../../apis/studios/Add.Studio.Api";
import { produce } from "immer";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    GetStudioByID,
    UpdateStudio,
} from "../../../../apis/studios/studios.api";
import { useToast } from "../../../../context/Toaster-Context/ToasterContext";

const initialState = {
    facilities: [],
    equipment: [],
    images: [],
    thumbnail: null,
    currentFacility: "",
    currentEquipment: "",
    error: "",
    description: "",
    success: false,
};

function reducer(state, action) {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_ERROR":
                draft.error = action.payload;
                break;
            case "SET_SUCCESS":
                draft.success = action.payload;
                break;
            case "SET_CURRENT_FACILITY":
                draft.currentFacility = action.payload;
                break;
            case "SET_CURRENT_EQUIPMENT":
                draft.currentEquipment = action.payload;
                break;
            case "ADD_FACILITY":
                draft.facilities.push(draft.currentFacility);
                draft.currentFacility = "";
                break;
            case "REMOVE_FACILITY":
                draft.facilities.splice(action.payload, 1);
                break;
            case "ADD_EQUIPMENT":
                draft.equipment.push(draft.currentEquipment);
                draft.currentEquipment = "";
                break;
            case "REMOVE_EQUIPMENT":
                draft.equipment.splice(action.payload, 1);
                break;
            case "SET_THUMBNAIL":
                draft.thumbnail = action.payload;
                break;
            case "REMOVE_THUMBNAIL":
                draft.thumbnail = null;
                break;
            case "SET_IMAGES":
                draft.images = action.payload;
                break;
            case "REMOVE_IMAGE":
                draft.images.splice(action.payload, 1);
                break;
            case "SET_DESCRIPTION":
                draft.description = action.payload;
                break;
            case "SET_ALL":
                draft.facilities = action.payload.facilities || [];
                draft.equipment = action.payload.equipment || [];
                draft.thumbnail = action.payload.thumbnail || null;
                draft.images = action.payload.images || [];
                draft.description = action.payload.description || "";
                break;
            default:
                break;
        }
    });
}

export default function AddStudio() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { formik, isLoading } = AddNewStudio();
    const [searchParams] = useSearchParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const { data: updatedStudio } = GetStudioByID(searchParams.get("edit"));
    const { mutate: updateStudio } = UpdateStudio();
    const isEdit = Boolean(searchParams.get("edit"));
    const [state, dispatch] = useReducer(reducer, initialState);

    const loadStudioData = async (data) => {
        formik.setValues({
            name: data.name || "",
            address: data.address || "",
            basePricePerSlot: data.basePricePerSlot || 0,
            isFixedHourly: data.isFixedHourly || false,
            description: data.description || "",
            startTime: data.startTime || "00:00",
            endTime: data.endTime || "00:00",
            facilities: data.facilities || [],
            equipment: data.equipment || [],
            thumbnail: data.thumbnail || null,
            imagesGallery: data.imagesGallery || [],
            minSlotsPerDay: data.minSlotsPerDay || [],
            dayOff: data.dayOff
        });

        dispatch({
            type: "SET_ALL",
            payload: {
                facilities: data.facilities || [],
                equipment: data.equipment || [],
                thumbnail: data.thumbnail || null,
                images: data.imagesGallery || [],
                description: data.description || []
            },
        });

        setIsLoaded(true);
    };

    useEffect(() => {
        if (isEdit && updatedStudio?.data && !isLoaded) {
            loadStudioData(updatedStudio.data);
        }
    }, [isEdit, updatedStudio, isLoaded]);

    // Memoize image URLs
    const imageUrls = useMemo(() => {
        const urls = new Map();

        if (state.thumbnail instanceof File) {
            urls.set("thumbnail", URL.createObjectURL(state.thumbnail));
        }

        state.images?.forEach((img, index) => {
            if (img instanceof File) {
                urls.set(`image-${index}`, URL.createObjectURL(img));
            }
        });

        return urls;
    }, [state.thumbnail, state.images]);

    // Cleanup URLs when component unmounts or URLs change
    useEffect(() => {
        return () => {
            imageUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imageUrls]);

    const handleAddFacility = () => {
        if (state.currentFacility.trim()) {
            dispatch({ type: "ADD_FACILITY" });
            formik.setFieldValue("facilities", [
                ...state.facilities,
                state.currentFacility,
            ]);
        }
    };

    const handleRemoveFacility = (index) => {
        dispatch({ type: "REMOVE_FACILITY", payload: index });
        const updated = state.facilities.filter((_, i) => i !== index);
        formik.setFieldValue("facilities", updated);
    };

    const handleAddEquipment = () => {
        if (state.currentEquipment.trim()) {
            dispatch({ type: "ADD_EQUIPMENT" });
            formik.setFieldValue("equipment", [
                ...state.equipment,
                state.currentEquipment,
            ]);
        }
    };

    const handleRemoveEquipment = (index) => {
        dispatch({ type: "REMOVE_EQUIPMENT", payload: index });
        const updated = state.equipment.filter((_, i) => i !== index);
        formik.setFieldValue("equipment", updated);
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            dispatch({ type: "SET_THUMBNAIL", payload: file });
            formik.setFieldValue("thumbnail", file);
        }
    };

    const handleImageUpload = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length === 0) return;

        const existingImages = state.images || [];
        const combinedImages = [...existingImages, ...newFiles].slice(0, 5);

        dispatch({ type: "SET_IMAGES", payload: combinedImages });
        formik.setFieldValue("imagesGallery", combinedImages);
    };

    const handleRemoveThumbnail = () => {
        dispatch({ type: "REMOVE_THUMBNAIL" });
        formik.setFieldValue("thumbnail", null);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = state.images.filter((_, idx) => idx !== index);
        dispatch({ type: "SET_IMAGES", payload: updatedImages });
        formik.setFieldValue("imagesGallery", updatedImages);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            updateStudio(
                { id: updatedStudio.data._id, data: formik.values },
                {
                    onSuccess: (response) => {
                        addToast(
                            response.message || "Studio updated successfully",
                            "success"
                        ),
                            setTimeout(() => {
                                navigate("/admin-dashboard/studio-management");
                            }, 2000);
                    },
                    onError: (error) => {
                        addToast(
                            error.response?.data?.message || "Something went wrong",
                            "error"
                        );
                    },
                }
            );
        } else {
            formik.handleSubmit();
        }
    };

    const descriptionRef = useRef("");

    // دالة استخراج النص من HTML
    const stripHtml = (html) => {
        const temp = document.createElement("div");
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || "";
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container mx-auto p-8"
        >
            <div className="p-8">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4 rounded-md border-main text-center">
                    {isEdit ? "Edit Studio" : "Add New Studio"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Studio Basic Info - Name , Address */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Input
                            label="Studio Name"
                            id="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errors={formik.errors.name}
                            touched={formik.touched.name}
                            placeholder="Enter studio name"
                        />

                        <Input
                            label="Address"
                            id="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errors={formik.errors.address}
                            touched={formik.touched.address}
                            placeholder="Enter studio address"
                        />
                    </div>

                    {/* Price + Fixed Hourly */}
                    <div className="flex gap-6">
                        <Input
                            type="number"
                            label="Base Price Per Slot"
                            id="basePricePerSlot"
                            value={formik.values.basePricePerSlot}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            errors={formik.errors.basePricePerSlot}
                            touched={formik.touched.basePricePerSlot}
                            placeholder="Enter base price"
                            className="w-3/4"
                        />
                        <div className="flex items-center space-x-4 w-1/4">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formik.values.isFixedHourly}
                                    onChange={() =>
                                        formik.setFieldValue(
                                            "isFixedHourly",
                                            !formik.values.isFixedHourly
                                        )
                                    }
                                    className="w-6 h-6 p-3 text-main rounded"
                                />
                                <span className="text-gray-700">Fixed Hourly Rate</span>
                            </label>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 rounded-md p-6">
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            Description
                        </label>
                        <Editor
                            value={state.description}
                            onTextChange={(e) => {
                                const htmlValue = e.htmlValue;
                                const plainText = stripHtml(htmlValue);
                                const lastText = stripHtml(descriptionRef.current);

                                // لو النص فعلاً اتغير
                                if (plainText !== lastText) {
                                    descriptionRef.current = htmlValue;
                                    dispatch({ type: "SET_DESCRIPTION", payload: htmlValue });
                                    formik.setFieldValue("description", htmlValue);
                                }
                            }}
                            style={{ height: "250px" }}
                        />


                        {formik.errors.description && formik.touched.description && (
                            <div className="text-red-500 text-sm mt-1">
                                {formik.errors.description}
                            </div>
                        )}
                    </div>

                    {/* Facilities */}
                    <div className="bg-gray-50 rounded-lg p-4 w-full">
                        <label className="block text-sm font-medium mb-4 text-gray-700">
                            Facilities
                        </label>
                        <div className="flex gap-5 mb-2 w-full items-center">
                            <Input
                                value={state.currentFacility}
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_CURRENT_FACILITY",
                                        payload: e.target.value,
                                    })
                                }
                                placeholder="Enter facility"
                                className="w-full"
                            />
                            <button
                                type="button"
                                onClick={handleAddFacility}
                                className="p-4 bg-main text-white rounded-md hover:bg-main/70 transition"
                            >
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                            {state.facilities.map((facility, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white px-3 py-1 rounded-md border border-gray-300 flex items-center gap-2 group"
                                >
                                    <span className="text-sm">{facility}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFacility(index)}
                                        className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ×
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Equipment */}
                    <div className="bg-gray-50 rounded-lg p-4 w-full">
                        <label className="block text-sm font-medium mb-4 text-gray-700">
                            Equipment
                        </label>
                        <div className="flex gap-5 mb-2 w-full items-center">
                            <Input
                                value={state.currentEquipment}
                                onChange={(e) =>
                                    dispatch({
                                        type: "SET_CURRENT_EQUIPMENT",
                                        payload: e.target.value,
                                    })
                                }
                                placeholder="Enter equipment"
                                className="w-full"
                            />
                            <button
                                type="button"
                                onClick={handleAddEquipment}
                                className="p-4 bg-main text-white rounded-md hover:bg-main/70 transition"
                            >
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                            {state.equipment.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white px-3 py-1 rounded-md border border-gray-300 flex items-center gap-2 group"
                                >
                                    <span className="text-sm">{item}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveEquipment(index)}
                                        className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ×
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Studio Hours + Day OFF */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <label className="block text-sm font-medium mb-4 text-gray-700">
                                Studio Hours
                            </label>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm mb-2 text-gray-600">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        value={formik.values.startTime}
                                        onChange={(e) =>
                                            formik.setFieldValue("startTime", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-2 text-gray-600">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        value={formik.values.endTime}
                                        onChange={(e) =>
                                            formik.setFieldValue("endTime", e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Day Off */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <label className="block text-sm font-medium mb-4 text-gray-700">
                                Days Off
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    "sunday",
                                    "monday",
                                    "tuesday",
                                    "wednesday",
                                    "thursday",
                                    "friday",
                                    "saturday",
                                ].map((day) => (
                                    <label key={day} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={formik.values.dayOff?.includes(day)}
                                            onChange={(e) => {
                                                const updatedDays = formik.values.dayOff || [];
                                                const isChecked = e.target.checked;
                                                const newValue = isChecked
                                                    ? [...updatedDays, day]
                                                    : updatedDays.filter((d) => d !== day);

                                                formik.setFieldValue("dayOff", newValue);
                                            }}
                                            className="w-4 h-4"
                                        />
                                        <span className="capitalize">{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Min Slots Per Day */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <label className="block text-sm font-medium mb-4 text-gray-700">
                            Minimum Slots Per Day
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {Object.keys(formik.values.minSlotsPerDay || {}).map((day) => (
                                <div key={day} className="flex flex-col">
                                    <label className="capitalize mb-1 text-sm text-gray-600">
                                        {day}
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={formik.values.minSlotsPerDay[day]}
                                        onChange={(e) =>
                                            formik.setFieldValue("minSlotsPerDay", {
                                                ...formik.values.minSlotsPerDay,
                                                [day]: parseInt(e.target.value, 10),
                                            })
                                        }
                                        className="border border-gray-300 rounded-md px-3 py-2"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Images and Thumbnail */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <label className="block text-sm font-medium mb-4 text-gray-700">
                            Images
                        </label>
                        <div className="flex flex-wrap gap-6">
                            {/* Thumbnail */}
                            <div className="flex-1 min-w-[200px]">
                                <label className="block mb-2 font-semibold">Thumbnail</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailUpload}
                                    className="border border-gray-300 p-2 rounded-md w-full"
                                />
                                {state.thumbnail && (
                                    <div className="mt-2">
                                        <img
                                            src={
                                                state.thumbnail instanceof File
                                                    ? imageUrls.get("thumbnail")
                                                    : state.thumbnail
                                            }
                                            alt="Thumbnail"
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveThumbnail}
                                            className="text-red-500 mt-1 block"
                                        >
                                            Remove Thumbnail
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Images Gallery */}
                            <div className="flex-1 min-w-[200px]">
                                <label className="block mb-2 font-semibold">
                                    Images Gallery
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="border border-gray-300 p-2 rounded-md w-full"
                                />
                                {state.images.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                        {state.images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="relative rounded overflow-hidden shadow-md group"
                                            >
                                                <img
                                                    src={
                                                        img instanceof File
                                                            ? imageUrls.get(`image-${idx}`)
                                                            : img
                                                    }
                                                    alt={`Gallery
                                    ${idx}`}
                                                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(idx)}
                                                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white
                                    rounded-full p-1 text-xs transition-colors"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        className="bg-main/70 text-white px-8 py-3 rounded-lg hover:bg-main transition disabled:opacity-50"
                        whileHover={{ scale: !isLoading ? 1.02 : 1 }}
                        whileTap={{ scale: !isLoading ? 0.98 : 1 }}
                    >
                        {isEdit ? "Update Studio" : "Add Studio"}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
