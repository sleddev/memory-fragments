import { onMount, type Component } from 'solid-js';
import { Router, Routes, Route, useNavigate } from '@solidjs/router';
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
  const navigate = useNavigate()
  if (!useMF().apiKey()) navigate('/auth/login')

  return <>
    <div id="sidebar">
      <span class='p-1 text-white'>woof</span>
    </div>
  </>;
};
