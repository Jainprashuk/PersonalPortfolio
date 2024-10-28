'use client'
import React, { useState , useEffect } from "react";
import { redirect } from 'next/navigation'
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Navbar from "./main/Navbar";

const UserHome = () => {

  const [formdata, setdata] = useState([]);

  useEffect(() => {
    axios.get('https://portfolio-backend-two-zeta.vercel.app/getdata')
      .then((response) => {
        setdata(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


  

  const router = useRouter()

  const [usename , setusername] = useState("");
  const [password , setpassword] = useState("");
  const [verified , setverified] = useState(false)

  const handleonchangename = (e)=>{
    setusername(e.target.value)
    
  }

  const handleonchangepass = (e)=>{
    setpassword(e.target.value)
  }

  const handleonsubmit = (event)=>{
    event.preventDefault()
    if (usename == "29jainprashuk@gmail.com" && password == "1234") {
      toast.success('LoggedIn Success')
      // router.push('/Admin/response/main')
      setverified(!verified)
    }else{
      toast.error('Access denied! ')
    }
    
  }
  return (

    <>
  {
    verified ? (
      <div><>

    
    
      <Navbar/>
      <div className=" max-w-screen h-screen p-5  ">
        <div className="max-w-screen">
          {formdata.map((ele) => (
            <section key={ele._id}>
              <div class="flex items-start mb-10">
              <div class="flex-shrink-0">
                <div class="inline-block relative">
                  <div class="relative w-16 h-16 rounded-full overflow-hidden">
                    <img
                      class="absolute top-0 left-0 w-full h-full bg-cover object-fit object-cover"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF5-3YjBcXTqKUlOAeUUtuOLKgQSma2wGG1g&s"
                      alt="Profile picture"
                    />
                    <div class="absolute top-0 left-0 w-full h-full rounded-full shadow-inner"></div>
                  </div>
                  <svg
                    class="fill-current text-white bg-green-600 rounded-full p-1 absolute bottom-0 right-0 w-6 h-6 -mx-1 -my-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M19 11a7.5 7.5 0 0 1-3.5 5.94L10 20l-5.5-3.06A7.5 7.5 0 0 1 1 11V3c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zm-9 1.08l2.92 2.04-1.03-3.41 2.84-2.15-3.56-.08L10 5.12 8.83 8.48l-3.56.08L8.1 10.7l-1.03 3.4L10 12.09z" />
                  </svg>
                </div>
              </div>
              <div class="ml-6">
                <p class="flex items-baseline">
                  <span class="text-gray-900 font-bold ">{ele.email}</span>
                </p>
  
                <div class="mt-1">
                  <span class="font-bold text-gray-900">{ele.subject}</span>
                  <p class="mt-1 text-gray-900">
                    {
                      ele.message
                    }
  
                    {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur laudantium, nostrum nisi ipsam recusandae ducimus repudiandae sint minima aliquam suscipit corrupti doloribus eveniet consectetur error non. Eius fuga architecto aspernatur optio cum! */}
                  </p>
                </div>
              </div>
  
              
            </div>
  
  
            </section>
            
            
          ))}
        </div>
        {/* <hr class="h-px my-8 bg-gray-900 border-0 dark:bg-gray-700" /> */}
      </div>
      
      </></div>
    ) : (
      <div><section class="dark:bg-gray-50 bg-gray-900">
      
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="my-5">
      <h1 className="text-center text-5xl dark:text-gray-900 text-gray-400">Admin Panel</h1>
      <p className="text-center dark:text-gray-900 text-gray-400">(Only For Admins)</p>
      </div>
        <div class="w-full  dark:bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight dark:text-gray-900 text-gray-400 md:text-2xl ">
              Sign in to your account
            </h1>
            <form class="space-y-4 md:space-y-6">
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium dark:text-gray-900 text-gray-400"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="dark:bg-gray-100 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                  value={usename}
                  onChange={(Event)=>handleonchangename(Event)}
                />
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium dark:text-gray-900 text-gray-400"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="dark:bg-gray-50 border dark:placeholder-gray-700 dark:text-gray-900 border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:border-gray-600   dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                  value={password}
                  onChange={(Event)=>handleonchangepass(Event)}
                />
              </div>
             
              <button
                // type="submit"
                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 "
                onClick={(Event)=>handleonsubmit(Event)}
              >
                Sign in
              </button>
              
            </form>
          </div>
        </div>
      </div>
    </section></div>
    )
  }
</>


    
  );
};

export default UserHome;
