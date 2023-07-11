import { Component } from "solid-js";
import { A } from '@solidjs/router';
import { MFLogo } from "../components/MFLogo";

export const RegisterPage: Component<{}> = (props) => {
  
  return (<>
    <MFLogo />
    <div class="h-4"></div>
    <span class="text-white text-lg font-medium">Create your account</span>
    <div class="h-1"></div>
    <span class="text-[#ffffff8C] text-[15px] leading-5">Welcome to lorem, ipsum dolor sit amet consectetur adipisicing elit.</span>
    <div class="h-8"></div>
    <form>
      <input type="text" placeholder="Choose a username" class="w-full h-9 rounded-xl text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5 py-1" />
      <div class="h-2"></div>
      <div class="h-2"></div>
      <button type="submit" class="block w-full h-9 rounded-xl bg-white hover:bg-[#ebebeb] text-black font-medium text-[15px] leading-5">Next</button>
      <div class="h-2"></div>
      <A href="../login" class="flex justify-center items-center w-full h-9 rounded-xl text-white bg-[#ffffff0A] hover:bg-[#ffffff14] border border-[#ffffff14] font-medium text-[15px] leading-5">Back</A>
      <div class="h-8"></div>
      <span class="text-[#ffffff8C] text-[13px]">
        By clicking Next above, you acknowledge that you are addicted to air.
      </span>
    </form>
  </>);
};