import { onMount, type Component } from 'solid-js';
import { Router, Routes, Route, useNavigate } from '@solidjs/router';
import { useMF } from './contexts/MFContext';
import { AuthApp } from './apps/auth/AuthApp';
import { DashSidebar } from './apps/dash/DashSidebar';
import { ProfilePic } from './components/profile/ProfilePic';
import { NotesSidebar } from './apps/notes/NotesSidebar';
import { NotesApp } from './apps/notes/NotesApp';


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
    <div id="sidebar" class='bg-[#000] text-white basis-60'>
      <div class='p-2 font-bold text-sm text-center select-none'>
        <Routes>
          <Route path="/notes/*" element={<><span class='text-[#40aaff]'>MF</span> NOTES</>} />
          <Route path="/dash/*" element={<><span class='text-[#40aaff]'>MF</span> DASHBOARD</>} />
          <Route path="/*" element={<><span class='text-[#40aaff]'>MEMORY</span> FRAGMENTS</>} />
        </Routes>
      </div>
      <div class='h-[1px] w-full bg-[#ffffff1e]'></div>
      <Routes>
        <Route path='/notes/*' component={NotesSidebar} />
        <Route path='/dash/*' component={DashSidebar} />
      </Routes>
    </div>
    <div id="content" class='bg-[#000] flex-1 border-l border-l-[#ffffff1e] overflow-y-scroll [scrollbar-color:red_orange]'>
    <Routes>
        <Route path='/notes/*' component={NotesApp} />
        <Route path='/dash/*' component={DashSidebar} />
      </Routes>
    </div>
  </>;
};
