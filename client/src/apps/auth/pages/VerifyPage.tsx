import { Component, Show, createSignal } from "solid-js";
import { useSearchParams } from '@solidjs/router'
import { A } from '@solidjs/router';
import { MFLogo } from "../components/MFLogo";
import { useMF } from "../../../contexts/MFContext";
import { Spinner } from "../../../components/Spinner";

export const VerifyPage: Component<{}> = (props) => {
  const mf = useMF()

  const [searchParams, setSearchParams] = useSearchParams()

  const [username, setUsername] = createSignal(searchParams['username'] ?? '')
  const [email, setEmail] = createSignal(searchParams['email'] ?? '')
  const [error, setError] = createSignal('')
  const [sent, setSent] = createSignal((searchParams['sent'] ?? '') === 'true')
  const [loading, setLoading] = createSignal(false)
  const [verified, setVerified] = createSignal(false)
  const [digits, setDigits] = createSignal('')

  async function handleSend(e: MouseEvent) {
    let usernameInput = document.querySelector('#username') as HTMLInputElement
    let emailInput = document.querySelector('#email') as HTMLInputElement

    e.preventDefault()
    if (!username()) {
      usernameInput.focus()
      return;
    }
    if (!email()) {
      emailInput.focus()
      return;
    }
    
    setLoading(true)
    let res = await mf.auth.sendEmail(username(), email())
    setError(res.error ? {
      'body': 'Invalid username or email',
      'credentials': 'Invalid username or email',
      'already-verified': 'Already verified! Please log in instead.',
      'wait': 'Too fast! Please wait one minute before sending another email.',
      'send-failed': 'Uh-oh, failed to send the email. If the issue persists, open an issue on Github.',
      'unknown': 'Unknown error',
    }[res.error!] : '')
    
    if (res.success) {
      setSent(true)
      setSearchParams({'sent': true, 'username': username()})
    }
    setLoading(false)
  }

  async function handleVerify(e: MouseEvent) {
    let usernameInput = document.querySelector('#username') as HTMLInputElement
    let digitsInput = document.querySelector('#digits') as HTMLInputElement

    e.preventDefault()
    if (!username()) {
      usernameInput.focus()
      return;
    }
    if (!digits()) {
      digitsInput.focus()
      return;
    }
    
    setLoading(true)
    let res = await mf.auth.verifyEmail(username(), email(), digits())
    setError(res.error ? {
      'body': 'Invalid username or code, or the code expired.',
      'credentials': 'Invalid username or code, or the code expired.',
      'attempts': 'Too many attempts, please request a new code.',
      'unknown': 'Unknown error',
    }[res.error!] : '')
    setLoading(false)

    if (res.success) setVerified(true)

  }
  
  return (<>
    <MFLogo />
    <div class="h-4"></div>
    <span class="text-white text-lg font-medium">Verify your email</span>
    <div class="h-1"></div>
    <Show when={!sent()}>
      <span class="text-[#ffffff8C] text-[15px] leading-5">Enter your username and email to send the verification code by email.</span>
      <div class="h-8"></div>
      <Show when={!loading()} fallback={<Spinner class="h-12" />}>
        <form>
          <input id="username" value={username()} onInput={e => setUsername(e.target.value)} type="text" placeholder="Username" class="w-full h-9 rounded-xl text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5 py-1" classList={{'bg-[#40aaff40] focus:bg-[#40aaff40]': error() != ''}} />
          <div class="h-2"></div>
          <input id="email" value={email()} onInput={e => setEmail(e.target.value)} type="email" placeholder="Email address" class="w-full h-9 rounded-[0.8rem] text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5" classList={{'bg-[#40aaff40] focus:bg-[#40aaff40]': error() != ''}} />
          <Show when={error()}>
            <div class="h-1"></div>
            <span class="block text-[13px] text-blue-400 text-center">{error()}</span>
            <div class="h-1"></div>
          </Show>
          <div class="h-3"></div>
          <button type="submit" onClick={handleSend} class="block w-full h-9 rounded-xl bg-white hover:bg-[#ebebeb] text-black font-medium text-[15px] leading-5">Send email</button>
          <div class="h-2"></div>
          <span class="text-[#ffffff8C] text-[15px] leading-5">
            Already verified? 
            <A href="../login" class="text-blue-400 text-[15px] leading-5">Log in</A>
          </span>
        </form>
      </Show>
    </Show>

    <Show when={sent()}>
    <span class="text-[#ffffff8C] text-[15px] leading-5">Enter the 6 digit code found in the verification email.</span>
      <div class="h-8"></div>
      <Show when={!loading()} fallback={<Spinner class="h-12" />}>
        <form>
          <input id="username" value={username()} onInput={e => setUsername(e.target.value)} type="text" placeholder="Username" class="w-full h-9 rounded-xl text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5 py-1" classList={{'bg-[#40aaff40] focus:bg-[#40aaff40]': error() != ''}} />
          <div class="h-2"></div>
          <input id="digits" value={digits()} onInput={e => setDigits(e.target.value)} autocomplete="off" type="text" placeholder="6 digit code" class="w-full h-9 rounded-[0.8rem] text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5" classList={{'bg-[#40aaff40] focus:bg-[#40aaff40]': error() != ''}} />
          <Show when={error()}>
            <div class="h-1"></div>
            <span class="block text-[13px] text-blue-400 text-center">{error()}</span>
            <div class="h-1"></div>
          </Show>
          <Show when={verified()}>
            <div class="h-1"></div>
            <span class="block text-[13px] text-green-400 text-center">Successfully verified, you can now log in!</span>
            <div class="h-4"></div>
            <A href="../login" class="flex justify-center items-center w-full h-9 rounded-xl bg-white hover:bg-[#ebebeb] text-black font-medium text-[15px] leading-5">Log in</A>
          </Show>
          <Show when={!verified()}>
            <div class="h-3"></div>
            <button type="submit" onClick={handleVerify} class="block w-full h-9 rounded-xl bg-white hover:bg-[#ebebeb] text-black font-medium text-[15px] leading-5">Verify email</button>
            <div class="h-2"></div>
            <span class="text-[#ffffff8C] text-[15px] leading-5">
              Already verified? 
              <A href="../login" class="text-blue-400 text-[15px] leading-5">Log in</A>
            </span>
          </Show>
        </form>
      </Show>
    </Show>
  </>);
};