import { Component } from "solid-js";
import { FaSolidMagnifyingGlass, FaRegularNoteSticky, FaSolidPlus } from 'solid-icons/fa'

export const NotesSidebar: Component<{}> = (props) => {
  
  return <div class="">
    <div class="flex flex-col gap-1 p-2">
      <div class="flex items-center text-[15px] h-8 px-2 rounded-md gap-2 bg-[#ffffff10] border border-[#ffffff10]"><FaSolidPlus fill="currentColor" />New note</div>
      <div class="flex items-center text-[15px] h-8 px-2 rounded-md gap-2 hover:bg-[#ffffff10] text-[#ffffff8A] hover:text-white"><FaSolidMagnifyingGlass fill="currentColor" />Search</div>
    </div>
    <div class='h-[1px] w-full bg-[#ffffff1e]'></div>
    <div class="h-2"></div>
    <div class="p-2">
      <div class="ml-2 mb-1 font-['IBM_Plex_Sans'] text-[13px] text-[#ffffff55]">RECENT NOTES</div>
      <div class="h-8 px-2 flex items-center gap-2 text-[15px] rounded-md hover:bg-[#ffffff10] text-[#ffffff8A] hover:text-white"><FaRegularNoteSticky fill="currentColor" />Walk with the dog</div>
      <div class="h-8 px-2 flex items-center gap-2 text-[15px] rounded-md hover:bg-[#ffffff10] text-[#ffffff8A] hover:text-white"><FaRegularNoteSticky fill="currentColor" />Groceries with Matt</div>
      <div class="h-8 px-2 flex items-center gap-2 text-[15px] rounded-md hover:bg-[#ffffff10] text-[#ffffff8A] hover:text-white"><FaRegularNoteSticky fill="currentColor" />It snowed!</div>
    </div>
    <div class='h-[1px] w-full bg-[#ffffff1e]'></div>
  </div>;
};