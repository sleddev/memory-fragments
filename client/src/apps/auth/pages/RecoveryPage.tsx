import { Component } from "solid-js";
import { A } from '@solidjs/router';
import { MFLogo } from "../components/MFLogo";

export const RecoveryPage: Component<{}> = (props) => {
  
  return (<>
    <MFLogo />
    <div class="h-4"></div>
    <span class="text-white text-lg font-medium">Recover your account</span>
    <div class="h-1"></div>
    <span class="text-[#ffffff8C] text-[15px] leading-5">Enter your MF email address.</span>
    <div class="h-8"></div>
    <form>
      <input type="text" placeholder="Username or email" class="w-full h-9 rounded-xl text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5 py-1" />
      <div class="h-3"></div>
      <button type="submit" class="block w-full h-9 rounded-xl bg-white hover:bg-[#ebebeb] text-black font-medium text-[15px] leading-5">Send instructions</button>
      <div class="h-2"></div>
      <div class="h-1"></div>
      <span class="text-[#ffffff8C] text-[15px] leading-5">
        Already have an account? 
        <A href="../login" class="text-blue-400 text-[15px] leading-5">Log in</A>
      </span>
    </form>
  </>);
};