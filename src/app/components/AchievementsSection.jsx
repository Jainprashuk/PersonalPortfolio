"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useState } from "react";
import "./projectdescription.css";
import Link from "next/link";

const AnimatedNumbers = dynamic(
  () => {
    return import("react-animated-numbers");
  },
  { ssr: false }
);

const achievementsList = [
  {
    // prefix: "~",
    metric: "Patents Published",
    value: "1",
    postfix: "",
  },
  {
    metric: "Projects",
    value: "10",
    postfix: "+",
  },

  {
    metric: "Certificates",
    value: "10",
    postfix: "+",
  },
  {
    metric: "CGPA",
    value: "7.82",
    postfix: "",
  },
];

const AchievementsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
      <div className="sm:border-[#33353F] sm:border rounded-md py-8 px-16 flex flex-col sm:flex-row items-center justify-between">
        {achievementsList.map((achievement, index) => {
          return (
            <div
              key={index}
              className="flex flex-col text-center items-center justify-center mx-4 my-4 sm:my-0"
            >
              <h2 className="text-white dark:text-gray-900 text-center text-4xl font-bold flex flex-row">
                {achievement.prefix}
                <AnimatedNumbers
                  includeComma
                  animateToNumber={achievement.value}
                  locale="en-US"
                  className="text-white text-center text-4xl font-bold dark:text-gray-900"
                  configs={(_, index) => {
                    return {
                      mass: 1,
                      friction: 100,
                      tensions: 140 * (index + 1),
                    };
                  }}
                />
                {achievement.postfix}
              </h2>
              <p className="text-[#ADB7BE] text-base dark:text-gray-900">
                {achievement.metric}
              </p>
              {index == 0 && (
                <button
                  onClick={openModal}
                  className="text-sm text-gray-50 dark:text-gray-500"
                >
                  View Details
                </button>
              )}
              {index == 1 && (
                <Link href="#projects">
                  <button className="text-sm text-gray-50 dark:text-gray-500">
                    View Projects
                  </button>
                </Link>
              )}
              {index == 2 && (
                <Link href="#certificates">
                  <button className="text-sm text-gray-50 dark:text-gray-500">
                    View Certificates
                  </button>
                </Link>
              )}
              {index == 3 && (
                // <Link >
                <button className="text-sm text-gray-50 dark:text-gray-500">
                  View Transcript
                </button>
                // </Link>
              )}
              {isModalOpen && (
                <div
                  className="fixed inset-0 z-50  flex items-center justify-center bg-gray-900 bg-opacity-50"
                  onClick={closeModal}
                >
                  <div
                    className="dark:bg-white bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full p-6 relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none text-2xl font-semibold"
                      onClick={closeModal}
                    >
                      &times;
                    </button>

                    <h1 className="dark:text-gray-900 text-gray-200 text-center text-3xl font-extrabold mb-6">
                      FOOD RECOMMENDER WITH HEALTH ANALYSIS SYSTEM
                    </h1>

                    <div className="relative overflow-x-auto rounded-lg shadow-md">
                      <table className="min-w-full bg-gray-100 text-sm text-left text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        <thead className="text-xs font-semibold text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th className="px-4 py-3">Field Of Invention</th>
                            <th className="px-4 py-3">Application Number</th>
                            <th className="px-4 py-3">Publication Date</th>
                            <th className="px-4 py-3">Publication Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white dark:bg-gray-900">
                            <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">
                              Bio-Medical Engineering
                            </td>
                            <td className="px-4 py-4">202311088637</td>
                            <td className="px-4 py-4">23/02/24</td>
                            <td className="px-4 py-4">INA</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="dark:text-gray-700 text-gray-100 text-center mt-6 leading-relaxed px-4">
                      Our invention relates to a ground-breaking Personalized AI
                      Food Recommender with Health Analysis that can address the
                      growing need for tailored dietary guidance.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsSection;
