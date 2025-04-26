import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import BASE_URL from '../BASE_URL';
import { useToast } from '../../context/Toaster-Context/ToasterContext';
import { useNavigate } from 'react-router-dom';

const initialValues = {
    name: '',
    address: '',
    basePricePerSlot: '',
    isFixedHourly: true,
    description: '',
    facilities: [],
    equipment: [],
    startTime: '09:00',
    endTime: '18:00',
    thumbnail: null,
    imagesGallery: []
};

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required')
        .max(50, 'Name must be less than 50 characters'),
    address: Yup.string()
        .required('Address is required')
        .max(100, 'Address must be less than 100 characters'),
    basePricePerSlot: Yup.number()
        .typeError('Price must be a number')
        .min(0, 'Base price must be greater than or equal to 0')
        .required('Base price is required'),
    isFixedHourly: Yup.boolean(), // Added this
    description: Yup.string()
        .required('Description is required')
        .min(50, 'Description must be at least 50 characters'),
    facilities: Yup.array()
        .min(1, 'At least one facility is required')
        .of(Yup.string().required()),
    equipment: Yup.array()
        .min(1, 'At least one equipment item is required')
        .of(Yup.string().required()),
    startTime: Yup.string()
        .required('Start time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    endTime: Yup.string()
        .required('End time is required')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    thumbnail: Yup.mixed()
        .required('Thumbnail is required')
        .test('fileSize', 'File too large', value => !value || value.size <= 5000000)
        .test('fileType', 'Unsupported file type', value =>
            !value || ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
        ),
    imagesGallery: Yup.array()
        .min(1, 'At least one gallery image is required')
        .max(5, 'Maximum 5 images allowed')
        .test('fileSize', 'One or more files are too large', values =>
            !values || values.every(file => file.size <= 5000000)
        )
        .test('fileType', 'Unsupported file type', values =>
            !values || values.every(file =>
                ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
            )
        )
});

const AddStudio = () => {
    const queryClient = useQueryClient();

    const { mutate: addStudio, isLoading } = useMutation({
        mutationFn: async (values) => {
            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (value === null || value === undefined) return;

                if (key === 'imagesGallery' && Array.isArray(value)) {
                    value.forEach(file => formData.append('imagesGallery', file));
                    return;
                }

                if (key === 'thumbnail' && value) {
                    formData.append('thumbnail', value);
                    return;
                }

                if (Array.isArray(value)) {
                    value.forEach(item => formData.append(`${key}[]`, item));
                    return;
                }

                formData.append(key, value);
            });

            // For debugging formData content
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }

            const { data } = await axios.post(`${BASE_URL}/studio`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["studios"]);
        },
        onError: (error) => {
            console.error("Error adding studio:", error);
            // No need to throw error here
        }
    });

    const { addToast } = useToast()
        const navigate = useNavigate();
    
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            addStudio(values, {
                onSuccess: (response) => {
                    addToast(response.message || 'Studio added successfully', 'success')
                    setTimeout(() => {
                        navigate('/admin-dashboard/studio-management')
                    }, 1500)
                },
                onError: (error) => {
                   addToast(error.response?.data?.message || 'Something went wrong', 'error')
                   console.error("Error adding studio:", error);
                }
            });
        }
    });

    return { formik, isLoading };
};

export default AddStudio;
