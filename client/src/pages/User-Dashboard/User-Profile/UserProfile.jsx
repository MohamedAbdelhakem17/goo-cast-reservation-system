import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../../../apis/axiosInstance';
import { useToast } from '../../../context/Toaster-Context/ToasterContext';
import { useAuth } from '../../../context/Auth-Context/AuthContext';

const UserProfile = () => {
    const { user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        role: 'Administrator',
        avatar: '',
        phone: '',
        location: '',
        bio: '',
        social: {
            instagram: '',
            twitter: '',
            facebook: '',
            youtube: ''
        },
        preferences: {
            emailNotifications: true,
            smsNotifications: false,
            marketingEmails: true
        }
    }, dispatch } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const { addToast } = useToast();

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required').max(50, 'Name must be less than 50 characters'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        currentPassword: Yup.string().min(6, 'Password must be at least 6 characters'),
        newPassword: Yup.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
        phone: Yup.string(),
        location: Yup.string(),
        bio: Yup.string().max(500, 'Bio must be less than 500 characters'),
        'social.instagram': Yup.string().url('Must be a valid URL'),
        'social.twitter': Yup.string().url('Must be a valid URL'),
        'social.facebook': Yup.string().url('Must be a valid URL'),
        'social.youtube': Yup.string().url('Must be a valid URL')
    });

    const formik = useFormik({
        initialValues: {
            name: user.name || '',
            email: user.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            phone: user.phone || '',
            location: user.location || '',
            bio: user.bio || '',
            social: {
                instagram: user.social?.instagram || '',
                twitter: user.social?.twitter || '',
                facebook: user.social?.facebook || '',
                youtube: user.social?.youtube || ''
            },
            preferences: {
                emailNotifications: user.preferences?.emailNotifications ?? true,
                smsNotifications: user.preferences?.smsNotifications ?? false,
                marketingEmails: user.preferences?.marketingEmails ?? true
            }
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const response = await axiosInstance.put('/auth/update-profile', values);
                dispatch({ type: 'UPDATE_USER', payload: response.data.user });
                addToast('Profile updated successfully', 'success');
                setIsEditing(false);
            } catch (error) {
                addToast(error.response?.data?.message || 'Error updating profile', 'error');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="relative h-48 bg-gradient-to-r from-blue-600 to-blue-400">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="absolute top-4 right-4 px-4 py-2 text-sm font-medium text-white bg-white/20 rounded-lg backdrop-blur-sm hover:bg-white/30 transition"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                    <div className="relative px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end -mt-12 sm:-mt-16">
                            <div className="relative inline-block">
                                <img
                                    src={user.avatar || `https://i.pravatar.cc/160?img=3`}
                                    alt="User Avatar"
                                    className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover"
                                />
                                {isEditing && (
                                    <button className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <div className="mt-6 sm:mt-0 sm:ml-6 flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                        <p className="text-gray-500">{user.email}</p>
                                        <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className="mt-4 sm:mt-0 flex space-x-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">24</div>
                                            <div className="text-sm text-gray-500">Bookings</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900">12</div>
                                            <div className="text-sm text-gray-500">Reviews</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-4 mb-8">
                    {['profile', 'preferences', 'security'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === tab
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <form onSubmit={formik.handleSubmit} className="space-y-6">
                                {activeTab === 'profile' && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    disabled={!isEditing}
                                                    {...formik.getFieldProps('name')}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                />
                                                {formik.touched.name && formik.errors.name && (
                                                    <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    disabled={!isEditing}
                                                    {...formik.getFieldProps('email')}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                />
                                                {formik.touched.email && formik.errors.email && (
                                                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                                                )}
                                            </div>

                                            {/* New fields */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    disabled={!isEditing}
                                                    {...formik.getFieldProps('phone')}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    disabled={!isEditing}
                                                    {...formik.getFieldProps('location')}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                            <textarea
                                                name="bio"
                                                rows="4"
                                                disabled={!isEditing}
                                                {...formik.getFieldProps('bio')}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                                                    <input
                                                        type="url"
                                                        name="social.instagram"
                                                        disabled={!isEditing}
                                                        {...formik.getFieldProps('social.instagram')}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                                                    <input
                                                        type="url"
                                                        name="social.twitter"
                                                        disabled={!isEditing}
                                                        {...formik.getFieldProps('social.twitter')}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'preferences' && (
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                                                    <p className="text-sm text-gray-500">Receive booking updates via email</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={!isEditing}
                                                    onClick={() => formik.setFieldValue('preferences.emailNotifications', !formik.values.preferences.emailNotifications)}
                                                    className={`${formik.values.preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                                                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                                >
                                                    <span className={`${formik.values.preferences.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                                                        } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`} />
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                                                    <p className="text-sm text-gray-500">Receive booking updates via SMS</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={!isEditing}
                                                    onClick={() => formik.setFieldValue('preferences.smsNotifications', !formik.values.preferences.smsNotifications)}
                                                    className={`${formik.values.preferences.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
                                                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                                >
                                                    <span className={`${formik.values.preferences.smsNotifications ? 'translate-x-5' : 'translate-x-0'
                                                        } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-6">
                                        <div className="border-t border-gray-200 pt-6">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                                    <input
                                                        type="password"
                                                        name="currentPassword"
                                                        {...formik.getFieldProps('currentPassword')}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                    />
                                                    {formik.touched.currentPassword && formik.errors.currentPassword && (
                                                        <div className="text-red-500 text-sm mt-1">{formik.errors.currentPassword}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        {...formik.getFieldProps('newPassword')}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                    />
                                                    {formik.touched.newPassword && formik.errors.newPassword && (
                                                        <div className="text-red-500 text-sm mt-1">{formik.errors.newPassword}</div>
                                                    )}
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        {...formik.getFieldProps('confirmPassword')}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                                    />
                                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                                        <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isEditing && (
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                                        >
                                            {loading ? 'Saving Changes...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Side Information */}
                    <div className="space-y-8">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                            <div className="space-y-4">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Booked Studio A</p>
                                            <p className="text-sm text-gray-500">2 hours ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Membership Status */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Membership Status</h2>
                            <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-4 text-white">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm">Premium Member</span>
                                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>
                                </div>
                                <div className="text-2xl font-bold mb-1">⭐ Gold Tier</div>
                                <div className="text-sm opacity-80">Valid until Dec 2025</div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-500">Total Hours</div>
                                    <div className="text-2xl font-bold text-gray-900">48h</div>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="text-sm text-gray-500">Favorites</div>
                                    <div className="text-2xl font-bold text-gray-900">6</div>
                                </div>
                            </div>
                        </div>

                        {/* New Connected Accounts Panel */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Connected Accounts</h2>
                            <div className="space-y-4">
                                {['Google', 'Facebook', 'Apple'].map((provider) => (
                                    <div key={provider} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <i className={`fab fa-${provider.toLowerCase()} text-gray-600`}></i>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{provider}</span>
                                        </div>
                                        <button
                                            className="text-sm text-blue-600 hover:text-blue-700"
                                            onClick={() => {/* Handle connect/disconnect */ }}
                                        >
                                            Connect
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
