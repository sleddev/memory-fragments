import { onMount, type Component } from 'solid-js';
import { useMF } from './components/MFContext';


export const App: Component = () => {
  const mf = useMF()

  onMount(async () => {
    // console.log((await mf.users.me()))
  })

  return (<>
    <div id='app'>woof</div>
  </>);
};
