import { Component } from "solid-js";
import { ImSpinner2 } from 'solid-icons/im'

export const Spinner: Component<{ class?: string}> = (props) => {
  
  return <div class={props.class + " flex justify-center items-center"}>
    <ImSpinner2 size={32} fill="currentColor" class="text-zinc-500 animate-spin" />
  </div>;
};
