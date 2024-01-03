"use client";
import React, { useState } from "react";
import GithubIcon from "../../../public/github-icon.svg";
import LinkedinIcon from "../../../public/linkedin-icon.svg";
import Link from "next/link";
import Image from "next/image";

const EmailSection = () => {

  function Submit(e) {
    const formEle = document.querySelector("form");
    e.preventDefault();
    console.log("submitted");
    const formDatab = new FormData(formEle);
    fetch(
      "https://script.google.com/macros/s/AKfycbyixDhwEv9Bq4Eu6Q1rEELFHlpgfD83dnqQS1NWxtN8QJCVeG0nfA5ws4vg5HUtdtfr/exec",
      {
        method: "POST",
        body: formDatab
      }
    )
      .then((res) => res.text())
      .then((data) => {
        console.log(data);
      })
      .then(()=>{
        const addmessage = document.getElementById("showmessage");
      if (addmessage) {
        window.alert("Your Response Has Been Submitted "); // Pop-up notification
      } else {
        console.error("Element with ID 'showmessage' not found.");
      }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  return (
    <section
      id="contact"
      className="grid md:grid-cols-2 my-12 md:my-12 py-24 gap-4 relative"
    >
      <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900 to-transparent rounded-full h-80 w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-1/2"></div>
      <div className="z-10">
        <h5 className="text-xl font-bold text-white my-2">
          Let&apos;s Connect
        </h5>
        <div id="showmessage" className="hidden showmessage">Your Response Has Been Submitted</div>
        <p className="text-[#ADB7BE] mb-4 max-w-md">
          {" "}
          I&apos;m currently looking for new opportunities, my inbox is always
          open. Whether you have a question or just want to say hi, I&apos;ll
          try my best to get back to you!
        </p>
        
      </div>
      <div>
        
          
        
          <form className="flex flex-col form" onSubmit={(e) => Submit(e)} >
            
            <div className="mb-6">
              <label
                htmlFor="email"
                className="text-white block mb-2 text-sm font-medium"
              >
                Your email
              </label>
              <input
                name="Email"
                type="email"
                id="email"
                required
                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
                placeholder="jacob@gmail.com"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="subject"
                className="text-white block text-sm mb-2 font-medium"
              >
                Subject
              </label>
              <input
                name="Subject"
                type="text"
                id="subject"
                required
                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
                placeholder="Just saying hi"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="Message"
                className="text-white block text-sm mb-2 font-medium"
              >
                Message
              </label>
              <textarea
                name="Message"
                id="message"
                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
                placeholder="Let's talk about..."
              />
            </div>
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-5 rounded-lg w-full"
            >
              Send Message
            </button>
          </form>
      </div>
    </section>
  );
};

export default EmailSection;


// https://script.google.com/macros/s/AKfycbyixDhwEv9Bq4Eu6Q1rEELFHlpgfD83dnqQS1NWxtN8QJCVeG0nfA5ws4vg5HUtdtfr/exec