import { Component, JSXElement, createContext, useContext } from "solid-js";
import { MfAPI } from "../lib/api/mf_api";

const MFContext = createContext<MfAPI>()

export const MFProvider: Component<{children: JSXElement}> = (props) => {
  const mf = new MfAPI()

  return <MFContext.Provider value={mf}>
    {props.children}
  </MFContext.Provider>
}

export function useMF() {
  const mf = useContext(MFContext)
  if (!mf) throw Error('MFProvider not found')
  return mf;
}