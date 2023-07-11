import { onMount, type Component } from 'solid-js';
import { Router, Routes, Route } from '@solidjs/router';
import { useMF } from './contexts/MFContext';
import { AuthApp } from './apps/auth/AuthApp';


export const App: Component = () => {
  const mf = useMF()

  onMount(async () => {
    // console.log((await mf.users.me()))
  })

  return (<>
    <Router>
       <Routes>
          <Route path='/auth/*' component={AuthApp} />
          <Route path='*' component={Frame} />
       </Routes>
    </Router>
  </>);
};

const Frame: Component<{}> = (props) => {
  
  return <>
    <div id="sidebar">
      woof
    </div>
  </>;
};
