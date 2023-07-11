import { BiRegularSquareRounded } from "solid-icons/bi";
import { Component } from "solid-js";

export const MFLogo: Component<{}> = (props) => {
  
  return (
    <div id="icon" class="bg-blue-400 w-10 h-10 rounded-xl flex justify-center items-center border border-[#ffffff66]">
      <BiRegularSquareRounded size={24} fill="currentColor" class="text-[#ffffffaa]"/>
    </div>
  );
};
