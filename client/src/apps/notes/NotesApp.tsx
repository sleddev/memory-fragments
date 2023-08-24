import { FaSolidMagnifyingGlass, FaSolidPlus } from "solid-icons/fa";
import { Component } from "solid-js";

export const NotesApp: Component<{}> = (props) => {
  type Color = {r: number, g: number ,b: number, a?: number}
  let startColor: Color = {
    r: 140,
    g: 206,
    b: 122
  }
  let endColor: Color = {
    r: 114,
    g: 203,
    b: 147
  }
  function generateColors(start: Color, end: Color, n: number): Color[] {
    if (n <= 0) return [];
    if (n == 1) return [start];
    if (n == 2) return [start, end];
    let diff: Color = {
      r: end.r - start.r,
      g: end.g - start.g,
      b: end.b - start.b
    }
    let step: Color = {
      r: diff.r / (n - 1),
      g: diff.g / (n - 1),
      b: diff.b / (n - 1)
    }
    return new Array(n).fill(0).map((_, i) => {
      if (i == 0) return start;
      if (i == n - 1) return end;
      return {
        r: Math.round(start.r + step.r * i),
        g: Math.round(start.g + step.g * i),
        b: Math.round(start.b + step.b * i)
      }
    });
  } 
  console.log(generateColors(startColor, endColor, 15).map(v => `rgb(${v.r},_${v.g},_${v.b})`))

  return <div class="p-4 text-white">
    <div>
      <div class="flex items-center justify-center text-sm w-9 h-7 px-2 rounded-md gap-2 text-[#ffffff8A] hover:text-white bg-[#ffffff0a] border border-[#ffffff0a]"><FaSolidMagnifyingGlass fill="currentColor" /></div>
    </div>
    <div class="h-4"></div>
    <div class="flex flex-wrap gap-4">
      <div class="flex justify-start flex-col text-justify text-sm bg-[#00aa5577] w-60 h-48 rounded-md border border-[#ffffff14]"><span class="px-2 pt-2 mb-0 font-bold">Walk with the dog</span><span class="p-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis quod eum distinctio hic odio, iusto nesciunt ducimus cupiditate sed perferendis</span>
      <div class='h-[1px] w-full bg-[#ffffff14] mt-auto'></div>
      <div class="p-2 flex gap-2 overflow-x-hidden flex-shrink-0 relative after:absolute after:right-0 after:top-0 after:w-4 after:h-full after:bg-gradient-to-l after:from-[#115F39] after:to-transparent">
          <div class="flex-grow-0 w-min bg-[#ffffff24] p-[2px] rounded-md font-bold">#dog</div>
          <div class="flex-grow-0 w-min bg-[#ffffff24] p-[2px] rounded-md font-bold">#outside</div>
          <div class="flex-grow-0 w-min bg-[#ffffff24] p-[2px] rounded-md font-bold">#exercise</div>
        </div>
      </div>
      <div class="flex justify-start flex-col text-justify text-sm bg-[#00aa5577] w-60 h-48 rounded-md border border-[#ffffff14]"><span class="px-2 pt-2 mb-0 font-bold">Groceries with Matt</span><span class="p-2 relative overflow-hidden after:absolute after:bottom-0 after:right-0 after:bg-gradient-to-t after:from-[#115F39] after:to-transparent after:w-full after:h-[3ch]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis quod eum distinctio hic odio. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum dolore, architecto numquam enim hic voluptas eum voluptate libero iure tempora natus consequatur a distinctio itaque, explicabo quisquam fuga molestiae ipsam?</span>
      <div class='h-[1px] w-full bg-[#ffffff14] mt-auto'></div>
      <div class="p-2 flex gap-2 overflow-x-hidden flex-shrink-0 relative after:absolute after:right-0 after:top-0 after:w-4 after:h-full after:bg-gradient-to-l after:from-[#115F39] after:to-transparent">
          <div class="flex-grow-0 w-min bg-[#ffffff24] p-[2px] rounded-md font-bold">#shopping</div>
          <div class="flex-grow-0 w-min bg-[#ffffff24] p-[2px] rounded-md font-bold">#Matt</div>
        </div>
      </div>
      <div class="flex justify-start flex-col text-justify text-sm bg-[#00aa5577] w-60 h-48 rounded-md border border-[#ffffff14]"><span class="px-2 pt-2 mb-0 font-bold">It snowed!</span><span class="p-2 relative overflow-hidden after:absolute after:bottom-0 after:right-0 after:bg-gradient-to-t after:from-[#115F39] after:to-transparent after:w-full after:h-[3ch]">Snowing ipsum dolor sit amet consectetur adipisicing elit. Nobis quod eum distinctio hic odio, deleniti totam molestias earum explicabo corporis nisi voluptatem fugiat quae consequuntur impedit dolore dignissimos laboriosam necessitatibus id ratione perspiciatis, qui perferendis.</span>
      <div class='h-[1px] w-full bg-[#ffffff14] mt-auto'></div>
        <div class="p-2 flex gap-2 overflow-x-hidden flex-shrink-0 relative after:absolute after:right-0 after:top-0 after:w-4 after:h-full after:bg-gradient-to-l after:from-[#115F39] after:to-transparent">
          <div class="flex-grow-0 w-min bg-[#ffffff24] p-[2px] rounded-md font-bold">#snow</div>
          <div class="flex-grow-0 w-min bg-[#ffffff24] p-[2px] rounded-md font-bold">#winter</div>
          <div class="flex-grow-0 w-min bg-[#ffffff24] p-[2px] rounded-md font-bold">#december</div>
          <div class="flex-grow-0 w-min bg-[#ffffff24] p-[2px] rounded-md font-bold">#christmas</div>
          <div class="flex-grow-0 w-min bg-[#ffffff24] p-[2px] rounded-md font-bold">#santa</div>
        </div>
      </div>
    </div>
    <div class="h-4"></div>

    <div class="w-[30rem] mx-auto rounded-md overflow-hidden relative after:[box-shadow:inset_0_0_2rem_#00000033] after:rounded-md after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0">
      <div class="h-36 bg-[#8CCE7A] flex items-center px-8 text-sm text-[#00000090] relative after:absolute after:bottom-0 after:left-1 after:right-1 after:border-b-2 after:border-dashed after:border-[#00000033]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis quos est repellendus eius qui neque, officiis ab. Rerum pariatur totam voluptatum provident eius quo, velit quasi cupiditate optio nam ducimus.</div>
      <div class="h-36 bg-[rgb(134,_205,_128)] flex items-center px-8 text-sm text-[#00000090] relative after:absolute after:bottom-0 after:left-1 after:right-1 after:border-b-2 after:border-dashed after:border-[#00000033]">What's on your mind?</div>
      <div class="h-36 bg-[rgb(127,_205,_135)] flex items-center px-8 text-sm text-[#00000090] relative after:absolute after:bottom-0 after:left-1 after:right-1 after:border-b-2 after:border-dashed after:border-[#00000033]">What's on your mind?</div>
      <div class="h-36 bg-[rgb(121,_204,_141)] flex items-center px-8 text-sm text-[#00000090] relative after:absolute after:bottom-0 after:left-1 after:right-1 after:border-b-2 after:border-dashed after:border-[#00000033]">What's on your mind?</div>
      <div class="h-36 bg-[#72CB93] flex items-center px-8 text-sm text-[#00000090]">What's on your mind?</div>
    </div>

    <div class="absolute right-8 bottom-8 rounded-full p-3 bg-[#ffffff10] border border-[#ffffff10]"><FaSolidPlus fill="currentColor" /></div>

  </div>;
};