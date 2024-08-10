"use client";
import React, { useState } from "react";
import { toast } from 'react-hot-toast';

const EmailSection = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpverified, setotpverified] = useState(false);
  const [messagesent , setsendmessage] = useState(false)

  

  const handleSendOtp = async () => {
    setLoading(true); // Show loader when starting to send OTP
    try {
      const response = await fetch("https://portfolio-backend-two-zeta.vercel.app/sendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      const result = await response.json();
      if (response.ok) {
        // alert("OTP sent");
        toast.success('otp sent');
        setStatusMessage("OTP sent successfully.");
        setOtpSent(true);
      } else {
        setStatusMessage(result.error || "An error occurred.");
      }
    } catch (error) {
      setStatusMessage("An error occurred.");
    } finally {
      setLoading(false); // Hide loader after OTP sending process
    }
  };
  

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("https://portfolio-backend-two-zeta.vercel.app/verifyotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });
  
      const result = await response.json();
      console.log(result);
      
      if (response.ok && result.verified) {
        console.log("ok and verified");
        setotpverified(true)
        setStatusMessage("OTP verified successfully.");
        return true;
      } else {
        console.log("wrong");
        // alert("wrong otp")
        toast.error("Enter Correct Otp")
        setStatusMessage("OTP verification failed.");
        return false;
      }
    } catch (error) {
      console.log("error");
      
      setStatusMessage("An error occurred.");
      return false;
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    
      if (otpverified) {
        try {
          const response = await fetch("https://portfolio-backend-two-zeta.vercel.app/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, subject, message }),
          });

          const result = await response.json();
          console.log(result);
          
          if (response.ok) {
            toast.success("Message sent")
            console.log("done");
            setStatusMessage("Your response has been submitted.");
            setsendmessage(true);
            setLoading(false);
          } else {
            console.log("none");
            
            setStatusMessage(result.error || "An error occurred.");
          }
        } catch (error) {
          setStatusMessage("An error occurred.");
        }
      }else{
        // alert("please verify otp first")
        toast.error("Please Verify Otp First")
      }
   
  };

  return (
    <section
      id="contact"
      className="grid md:grid-cols-2 my-12 md:my-12 py-24 gap-4 relative"
    >
      <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900 to-transparent rounded-full h-80 w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-1/2"></div>
      <div className="z-10">
        <h5 className="text-xl font-bold text-white my-2">Let&apos;s Connect</h5>
        <div id="showmessage" className="hidden showmessage">
          {statusMessage}
        </div>
        <p className="text-[#ADB7BE] mb-4 max-w-md">
          I&apos;m currently looking for new opportunities, my inbox is always
          open. Whether you have a question or just want to say hi, I&apos;ll
          try my best to get back to you!
        </p>
        <p className="text-[#ADB7BE] mb-4 max-w-md">
          Feel free to give suggestions about my portfolio website.
        </p>
      </div>
      <div>
        {
          messagesent ? (<p className="text-center my-2 text-green-500">Thank You For Submitting your Response</p>) : (
            <form className="flex flex-col form" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="text-white block mb-2 text-sm font-medium">
              Your email
            </label>
            <input
              name="email"
              type="email"
              id="email"
              required
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="jacob@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {
              otpverified  ? (<p className="text-green-500 my-4 text-center">Otp Verified</p>) : (
                <div className="flex mt-2 justify-center items-center align-middle">
              <input
                name="otp"
                type="number"
                id="otp"
                required
                className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
                placeholder="Enter Your OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
  type="button"
  onClick={handleSendOtp}
  className="bg-primary-500 mx-2 px-5 py-2 hover:bg-primary-600 text-white font-medium rounded-lg"
  disabled={loading} // Disable the button when loading
>
  Send OTP
  {loading && (
    <div role="status" className="inline-block ml-2">
      <svg
        aria-hidden="true"
        className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  )}
</button>

              <button type="button" onClick={handleVerifyOtp} className="bg-primary-500 mx-2 px-5 py-2 hover:bg-primary-600 text-white font-medium rounded-lg">
                Verify OTP
              </button>
            </div>
          
              )
            }
            </div>
          <div className="mb-6">
            <label htmlFor="subject" className="text-white block text-sm mb-2 font-medium">
              Subject
            </label>
            <input
              name="subject"
              type="text"
              id="subject"
              required
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="Just saying hi"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="text-white block text-sm mb-2 font-medium">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              className="bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5"
              placeholder="Let's talk about..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-primary-500 flex justify-center items-center gap-5 hover:bg-primary-600 text-white font-medium py-2.5 px-5 rounded-lg w-full"
          >
            <div>Send Message</div>
            {loading && (
              <div role="status" className="hidden loading-icon" id="loading-icon">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            )}
          </button>
        </form>
          )
        }
      </div>
    </section>
  );
};

export default EmailSection;
