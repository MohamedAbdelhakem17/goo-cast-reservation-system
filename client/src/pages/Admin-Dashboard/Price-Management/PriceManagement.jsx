import React, { useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { produce } from "immer";

import PriceRule from "../../../components/Admin-Dashboard/Price-Management/Price-Rule/PriceRule";
import SelectStudio from "../../../components/Admin-Dashboard/Price-Management/Select-Studio/SelectStudio";
import SelectInput from "../../../components/shared/Select-Input/SelectInput";
import Tabs from "../../../components/shared/Tabs/Tabs";
import ChangeBasePrice from "../../../components/Admin-Dashboard/Price-Management/Change-Base-Price/ChangeBasePrice";
import PriceExceptions from "../../../components/Admin-Dashboard/Price-Management/Price-Exceptions/PriceExceptions";
import { GetAllPackages } from "../../../apis/services/services.api";
import { NewPriceRuleForm, PriceRuleList } from "../../../components/Admin-Dashboard/Price-Management/Price-Mange/PriceComponents";
import PackagePrice from "../../../components/Admin-Dashboard/Price-Management/Package-Price/PackagePrice";

const fadeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
};

const initialState = {
    selectedOption: "",
    mangeType: "",
    activeTab: 1,
};

function reducer(state, action) {
    return produce(state, (draft) => {
        switch (action.type) {
            case "SET_OPTION_STUDIO":
                draft.selectedOption = action.payload;
                break;
            case "SET_MANAGE_TYPE":
                draft.mangeType = action.payload;
                draft.selectedOption = "";
                draft.activeTab = 1;
                break;
            case "SET_ACTIVE_TAB":
                draft.activeTab = action.payload;
                break;
            default:
                break;
        }
    });
}

const PriceManagement = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { data: packageData } = GetAllPackages();

    const { selectedOption, mangeType, activeTab } = state;

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
                        onChange={(e) => dispatch({ type: "SET_MANAGE_TYPE", payload: e.target.value })}
                        options={[
                            { value: "studio", label: "Studio" },
                            { value: "service", label: "Service" },
                        ]}
                        placeholder=" What would you like to manage ?."
                        iconClass="fas fa-chevron-down"
                    />
                </div>

                <AnimatePresence mode="wait">
                    {/* Studio Management */}
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
                            <SelectStudio
                                selectedStudio={selectedOption}
                                setSelectedStudio={(val) => dispatch({ type: "SET_OPTION_STUDIO", payload: val })}
                            />

                            {/* Studio Price Rules */}
                            {selectedOption && (
                                <>
                                    {/* Tab For Type of Price */}
                                    <Tabs
                                        tabs={[
                                            { id: 1, label: "Basic Pricing" },
                                            { id: 2, label: "Price Rules" },
                                            { id: 3, label: "Price Exceptions" },
                                        ]}
                                        activeTabId={activeTab}
                                        onTabChange={(id) => dispatch({ type: "SET_ACTIVE_TAB", payload: id })}
                                    />

                                    {activeTab === 1 && (
                                        <ChangeBasePrice
                                            selectedStudio={selectedOption}
                                            closeTab={() => dispatch({ type: "SET_ACTIVE_TAB", payload: null })}
                                        />
                                    )}
                                    {activeTab === 2 && <PriceRule selectedStudio={selectedOption} />}
                                    {activeTab === 3 && <PriceExceptions selectedStudio={selectedOption} />}
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* Service Management */}
                    {mangeType === "service" && (
                        <motion.div
                            key="service"
                            variants={fadeVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                        >
                            {/* Tabs */}
                            <Tabs
                                tabs={[
                                    { id: 1, label: "Packages" },
                                    { id: 2, label: "Addons" },
                                ]}
                                activeTabId={activeTab}
                                onTabChange={(id) => dispatch({ type: "SET_ACTIVE_TAB", payload: id })}
                            />

                            {/* Select Package */}
                            {
                                activeTab === 1 && <>
                                    <SelectInput
                                        value={selectedOption}
                                        onChange={(e) => dispatch({ type: "SET_OPTION_STUDIO", payload: e.target.value })}
                                        options={packageData?.data?.map((item) => ({
                                            value: item._id,
                                            label: item.name,
                                        }))}
                                        placeholder=" Select Package to manage ?."
                                        iconClass="fas fa-chevron-down"
                                    />
                                    {packageData?.data?.find((item) => item._id === selectedOption) && <PackagePrice selectedPackage={packageData?.data?.find((item) => item._id === selectedOption)} />}
                                </>
                            }

                            {/* Select Addon */}
                            {
                                activeTab === 2 && <>
                                    <h1>Addons</h1>
                                </>
                            }

                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default PriceManagement;
