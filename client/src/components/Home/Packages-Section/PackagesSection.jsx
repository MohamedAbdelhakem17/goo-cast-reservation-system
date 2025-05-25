import React from 'react';
import { GetAllPackages } from '../../../apis/services/services.api';

export default function PackagesSection() {
  const { data: packages, isLoading } = GetAllPackages();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-rose-500 border-opacity-50"></div>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-12 relative text-center">
        <span className="text-main text-sm font-medium tracking-widest uppercase mb-2">
          Packages
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-main mb-3 tracking-tight">
          Our Packages
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-rose-300 to-rose-500 rounded-full mb-4"></div>
        <p className="text-gray-600 max-w-lg text-sm md:text-base">
          Choose from a variety of packages tailored to fit your creative needs and budget.
        </p>
      </div>

      {packages?.data?.length === 0 ? (
        <p className="text-center text-gray-500">No packages available at the moment.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {packages?.data?.map((packageItem) => (
            <div
              key={packageItem._id}
              className="flex-shrink-0 w-full sm:w-[48%] md:w-[30%] xl:w-[22%] bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl py-6 px-2 flex flex-col items-center justify-around border border-gray-100 hover:border-rose-400 text-center min-h-[420px]"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-rose-400 to-rose-200 shadow-lg mb-4 border-4 border-white -mt-8">
                <i className="fas fa-camera text-white text-2xl drop-shadow"></i>
              </div>
              <h3 className="text-xl font-bold text-main mb-1">{packageItem.name}</h3>
              <p className="text-gray-500 text-sm mb-2 min-h-[48px]">{packageItem.description}</p>
              <div className="flex flex-wrap gap-2 mb-2 justify-center">
                {packageItem.target_audience.map((user, idx) => (
                  <span
                    key={idx}
                    className="bg-rose-100 text-rose-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-rose-200"
                  >
                    {user}
                  </span>
                ))}
              </div>
              {/* <p className="text-main font-extrabold text-xl mb-3">
        {packageItem.price} <span className="text-sm font-medium">EGP</span>
      </p>
      <button
        className="w-full bg-gradient-to-r from-rose-400 to-rose-500 text-white font-semibold py-2 rounded-lg shadow-md hover:from-rose-500 hover:to-rose-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-300 mt-2"
      >
        Book Now
      </button> */}
            </div>
          ))}
        </div>

      )}
    </section>
  );
}
