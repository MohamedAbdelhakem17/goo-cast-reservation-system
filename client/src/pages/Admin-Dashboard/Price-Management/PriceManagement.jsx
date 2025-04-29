import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PriceRule from "../../../components/Admin-Dashboard/Price-Management/Price-Rule/PriceRule";
import SelectStudio from "../../../components/Admin-Dashboard/Price-Management/Select-Studio/SelectStudio";
import SelectInput from "../../../components/shared/Select-Input/SelectInput";
import Tabs from "../../../components/shared/Tabs/Tabs";
import ChangeBasePrice from "../../../components/Admin-Dashboard/Price-Management/Change-Base-Price/ChangeBasePrice";
import PriceExceptions from "../../../components/Admin-Dashboard/Price-Management/Price-Exceptions/PriceExceptions";

const PriceManagement = () => {
    const [selectedStudio, setSelectedStudio] = useState("");
    const [mangeType, setManageType] = useState("");
    const [activeTab, setActiveTab] = useState(1);
    const fadeVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 }
    };
    return (
        <div className="container mx-auto py-8 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-8"
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <h2 className="text-3xl font-bold text-gray-800">Price Management</h2>
                    <SelectInput
                        value={mangeType}
                        onChange={(e) => setManageType(e.target.value)}
                        options={[
                            { value: "studio", label: "Studio" },
                            { value: "service", label: "Service" },
                        ]}
                        placeholder=" What would you like to manage ?."
                        iconClass="fas fa-chevron-down"
                    />
                </div>


                <AnimatePresence mode="wait">
                    {mangeType === "studio" && (
                        <motion.div
                            key="studio"
                            variants={fadeVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                        >
                            {/* Studio Selection */}
                            <SelectStudio selectedStudio={selectedStudio} setSelectedStudio={setSelectedStudio} />


                            {/* Studio Price Rules */}
                            {selectedStudio && <>
                                {/* Tab For Type of Price */}
                                <Tabs
                                    tabs={[{ id: 1, label: "Basic Pricing" }, { id: 2, label: "Price Rules" }, { id: 3, label: "Price Exceptions" }]}
                                    activeTabId={activeTab}
                                    onTabChange={(id) => setActiveTab(id)}
                                />

                                {activeTab === 1 && <ChangeBasePrice selectedStudio={selectedStudio} closeTab={() => setActiveTab(null)} />}

                                {activeTab === 2 && <PriceRule selectedStudio={selectedStudio} />}

                                {activeTab=== 3 && <PriceExceptions selectedStudio={selectedStudio}/>}
                            </>
                            }
                        </motion.div>
                    )}

                    {mangeType === "service" && (
                        <motion.div
                            key="service"
                            variants={fadeVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                        >
                            <h2>Service Management</h2>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
    );
};

export default PriceManagement;
