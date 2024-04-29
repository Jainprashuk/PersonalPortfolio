"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useState } from "react";
import "./projectdescription.css";

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
    value: "7.7",
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
              <h2 className="text-white text-center text-4xl font-bold flex flex-row">
                {achievement.prefix}
                <AnimatedNumbers
                  includeComma
                  animateToNumber={achievement.value}
                  locale="en-US"
                  className="text-white text-center text-4xl font-bold"
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
              <p className="text-[#ADB7BE] text-base">{achievement.metric}</p>
              {index == 0 && (
                <button onClick={openModal} className="text-sm text-gray-50">
                  View Details
                </button>
              )}
              {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                  <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="close" onClick={closeModal}>
                      &times;
                    </span>
                    <h1 className="text-gray-900 text-center text-2xl font-bold">
                      {" "}
                      FOOD RECOMMENDER WITH HEALTH ANALYSIS AND SYSTEM{" "}
                    </h1>
                    <br />
                    <br />

                    <div class="relative overflow-x-auto">
                      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" class="px-3 sm:px-6 py-3">
                              Field Of Invention
                            </th>
                            <th scope="col" class="px-3 sm:px-6 py-3">
                              Application Number
                            </th>
                            <th scope="col" class="px-3 sm:px-6 py-3">
                              Publication Date
                            </th>
                            <th scope="col" class="px-3 sm:px-6 py-3">
                              Publication Type
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td class="px-3 sm:px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              Bio-Medical Engineering
                            </td>
                            <td class="px-3 sm:px-6 py-4">202311088637</td>
                            <td class="px-3 sm:px-6 py-4">23/02/24</td>
                            <td class="px-3 sm:px-6 py-4">INA</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <br />
                    <br />

                    <p className="text-gray-900 text-center">
                      Our invention relates to a ground-breaking Personalized AI
                      Food Recommender with Health Analysis that can address the
                      growing need for tailored dietary guidance .
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
