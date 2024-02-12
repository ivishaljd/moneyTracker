import React, { useContext, useEffect, useState } from "react";
import { Link, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom/dist";
import "../../assets/navbar.css";
import { MyContext } from "../context/Context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shadcn/components/ui/avatar";
import { useMediaQuery } from 'react-responsive'


const Navbar = () => {
  const { logedin, signup, setsignup, setlogedin, verify, firstName, lastName } =
    useContext(MyContext);

  const nav = useNavigate();
  const isMobile = useMediaQuery({ query: '(max-width: 775px)' })
  const avtar = firstName[0] + lastName[0];
  return (

    <div>
      <nav>
        {isMobile && logedin && (
          <div className="fixed bottom-0 z-10 bg-primary flex justify-between w-[100%] border-t-2 border-[#9fa3a1]">
            <DropdownMenu>
              <DropdownMenuTrigger className="text-white p-6 font-semibold" onClick={() => { nav('/'); }}>Dashboard</DropdownMenuTrigger>
              <DropdownMenuTrigger className="text-white p-6 font-semibold" onClick={() => nav('/wallets')}>Wallets</DropdownMenuTrigger>
              <DropdownMenuTrigger className="text-white p-6 font-semibold">Transactions</DropdownMenuTrigger>
            </DropdownMenu>
          </div>
        )}
        <div className={`flex justify-between items-center  ${isMobile? 'pt-3 px-5':'px-12 h-20 border-b-2 border-[#9fa3a1]'} `}>
          <div>
            <Link to={"/"}>
              <h3 className="text-white navbarul text-3xl">Money Tracker</h3>
            </Link>
          </div>
          <div>
            {logedin && !isMobile && (<DropdownMenu>
              <DropdownMenuTrigger className="text-white px-6 font-semibold text-lg" onClick={() => { nav('/'); }}>Dashboard</DropdownMenuTrigger>
              <DropdownMenuTrigger className="text-white px-6 font-semibold text-lg" onClick={() => nav('/wallets')}>Wallets</DropdownMenuTrigger>
              <DropdownMenuTrigger className="text-white px-6 font-semibold text-lg">Transactions</DropdownMenuTrigger>
            </DropdownMenu>)}
          </div>
          <div>
            {logedin && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                    <AvatarFallback>{avtar.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark border text-white me-5">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => nav('/usersettings')}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 22 22"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="mr-2 h-4 w-4"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    Profile
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.removeItem("token");
                      verify();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 22 22"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="mr-2 h-4 w-4"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" x2="9" y1="12" y2="12"></line>
                    </svg>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
