import { Component, Show, createSignal, onMount } from "solid-js";
import { A } from '@solidjs/router';
import { MFLogo } from "../components/MFLogo";
import { useMF } from "../../../contexts/MFContext";
import { Spinner } from "../../../components/Spinner";
import { useNavigate } from '@solidjs/router';

export const LoginPage: Component<{}> = (props) => {
  const mf = useMF()
  const navigate = useNavigate();

  let local = JSON.parse(localStorage.getItem('temp_login') ?? '{}')

  const [username, setUsername] = createSignal(local['username'] ?? '')
  const [password, setPassword] = createSignal(local['password'] ?? '')
  const [error, setError] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  onMount(() => {
    if (!local) return;
    localStorage.removeItem('temp_login')
    handleSubmit(new MouseEvent('click'))
  })

  async function handleSubmit(e: MouseEvent) {
    let usernameInput = document.querySelector('#username') as HTMLInputElement
    let passwordInput = document.querySelector('#password') as HTMLInputElement

    e.preventDefault()
    if (!username()) {
      usernameInput.focus()
      return;
    }
    if (!password()) {
      passwordInput.focus()
      return;
    }
    
    setLoading(true)
    let isEmail = username().includes('@')
    let res = await mf.auth.login(
      isEmail ? '' : username(),
      isEmail ? username() : '', 
      password()
    )
    setError(res.error ? {
      'body': 'Invalid username or password',
      'credentials': 'Invalid username or password',
      'verify': 'Verify your email before logging in',
      'unknown': 'Unknown error',
    }[res.error!] : '')

    if (res.error === 'verify') navigate(`../verify?${isEmail ? 'email' : 'username'}=${username()}`)
    if (res.success) navigate('/')
    
    setLoading(false)

  }
  
  return (<>
    <MFLogo />
    <div class="h-4"></div>
    <span class="text-white text-lg font-medium">Login to Memory Fragments</span>
    <div class="h-1"></div>
    <span class="text-[#ffffff8C] text-[15px] leading-5">Welcome to lorem, ipsum dolor sit amet consectetur adipisicing elit.</span>
    <div class="h-8"></div>
    <Show when={!loading()} fallback={<Spinner class="h-12" />}>
      <form>
        <input id="username" value={username()} onInput={e => setUsername(e.target.value)} type="text" placeholder="Username or email" class="w-full h-9 rounded-xl text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5 py-1" classList={{'bg-[#40aaff40] focus:bg-[#40aaff40]': error() != ''}} />
        <div class="h-2"></div>
        <input id="password" value={password()} onInput={e => setPassword(e.target.value)} type="password" placeholder="Password" class="w-full h-9 rounded-[0.8rem] text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5" classList={{'bg-[#40aaff40] focus:bg-[#40aaff40]': error() != ''}} />
        <Show when={error()}>
          <div class="h-1"></div>
          <span class="block text-[13px] text-blue-400 text-center">{error()}</span>
          <div class="h-1"></div>
        </Show>
        <div class="h-3"></div>
        <button type="submit" onClick={handleSubmit} class="block w-full h-9 rounded-xl bg-white hover:bg-[#ebebeb] text-black font-medium text-[15px] leading-5">Log in</button>
        <div class="h-2"></div>
        <A href="../recovery" class="text-blue-400 text-[15px] leading-5">Forgot password?</A>
        <div class="h-1"></div>
        <span class="text-[#ffffff8C] text-[15px] leading-5">
          Don't have an account? 
          <A href="../register" class="text-blue-400 text-[15px] leading-5">Sign up</A>
        </span>
      </form>
    </Show>
  </>);
};