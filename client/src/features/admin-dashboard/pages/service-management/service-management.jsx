import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Packages from '@/features/admin-dashboard/_components/Admin-Dashboard/Service-Management/Packages/Packages';
import Addons from '@/features/admin-dashboard/_components/Admin-Dashboard/Service-Management/Add-ons/Addons';
import ServiceTaps from '../../_components/Admin-Dashboard/Service-Management/Tabs/Tabs';

const ServiceManagement = () => {
    const [activeTab, setActiveTab] = useState('packages');

    return (
        <div className="w-full">

            {/* Tabs */}
            <ServiceTaps activeTab={activeTab} setActiveTab={setActiveTab} />

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-6"
            >
                <div className="bg-gray-50/50 rounded-lg p-4 min-h-[400px]">
                    {activeTab === 'packages'
                        ? <Packages />
                        : <Addons />
                    }
                </div>
            </motion.div>
        </div>
    );
};

export default ServiceManagement;