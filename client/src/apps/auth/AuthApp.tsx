import { Component } from "solid-js";
import { Routes, Route, useNavigate } from '@solidjs/router';
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RecoveryPage } from "./pages/RecoveryPage";
import { VerifyPage } from "./pages/VerifyPage";
import { useMF } from "../../contexts/MFContext";

export const AuthApp: Component<{}> = (props) => {
  const mf = useMF()
  const navigate = useNavigate()
  if (mf.apiKey()) navigate('/dash/')
  
  return ( 
    <div class="flex flex-col justify-center m-auto w-[25rem] h-full">
      <Routes>
        <Route path='/login' component={LoginPage} />
        <Route path='/register/*' component={RegisterPage} />
        <Route path='/recovery' component={RecoveryPage} />
        <Route path='/verify' component={VerifyPage} />
      </Routes>
    </div>
  );
};