import { Accessor, Component, Setter, Show, createEffect, createSignal, onMount } from "solid-js";
import { A, Route, Routes, useNavigate } from '@solidjs/router';
import { MFLogo } from "../components/MFLogo";
import { Spinner } from "../../../components/Spinner";
import { useMF } from "../../../contexts/MFContext";
import { MFRegisterResponse } from "../../../lib/api/users/auth";
import { bip39encode, sha256hash } from "../../../lib/crypto/hashing";
import { baseURL } from "../../../config";

export const RegisterPage: Component<{}> = (props) => {
  const mf = useMF()
  const [loading, setLoading] = createSignal(false)

  const [username, setUsername] = createSignal('');
  const [displayName, setDisplayName] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  function register() {
    return mf.auth.register(
      username(), email(), displayName(), password()
    )
  }
  
  return (<>
    <MFLogo />
    <div class="h-4"></div>
    <Routes>
      <Route path='/' element={<UsernamePhase
        username={username} setUsername={setUsername}
        loading={loading} setLoading={setLoading}
      />} />
      <Route path='/name' element={<DisplayNamePhase
        displayName={displayName} setDisplayName={setDisplayName}
        loading={loading} setLoading={setLoading}
      />} />
      <Route path='/email' element={<EmailPhase
        email={email} setEmail={setEmail}
        loading={loading} setLoading={setLoading}
      />} />
      <Route path='/password' element={<PasswordPhase
        password={password} setPassword={setPassword}
        loading={loading} setLoading={setLoading}
        register={register}
      />} />
      <Route path='/phrase' element={<PhrasePhase
        password={password} username={username} email={email}
        loading={loading} setLoading={setLoading}
      />} />
      {/* Then onboarding */}
    </Routes>
  </>);
};

const UsernamePhase: Component<{
  username: Accessor<string>, setUsername: Setter<string>,
  loading: Accessor<boolean>, setLoading: Setter<boolean>,
}> = (props) => {
  const mf = useMF()
  const navigate = useNavigate()
  const [error, setError] = createSignal('')

  async function handleSubmit(e: MouseEvent) {
    let usernameInput = document.querySelector('#username') as HTMLInputElement

    e.preventDefault()
    if (!props.username()) {
      usernameInput.focus()
      return;
    }

    props.setLoading(true)
    let res = await mf.auth.isAvailable(
      props.username(), ''
    )
    setError(res.error ? {
      'body': 'Invalid username',
      'unknown': 'Unknown error',
    }[res.error!] : '')
    if (!res.success) return;
    if (res.data!.available) {
      navigate('name')
      return;
    }
    setError('Username taken')
    usernameInput.focus()
    props.setLoading(false)
  }

  return (<>
    <span class="text-white text-lg font-medium">Create your account</span>
    <div class="h-1"></div>
    <span class="text-[#ffffff8C] text-[15px] leading-5">Welcome to lorem, ipsum dolor sit amet consectetur adipisicing elit.</span>
    <div class="h-8"></div>
    <Show when={!props.loading()} fallback={<Spinner class="h-12" />}>
    <form>
      <input id="username" value={props.username()} onInput={e => props.setUsername(e.target.value)} type="text" placeholder="Choose a username" class="w-full h-9 rounded-xl text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5 py-1" classList={{'bg-[#40aaff40] focus:bg-[#40aaff40]': error() != ''}} />
      <Show when={error()}>
        <div class="h-1"></div>
        <span class="block text-[13px] text-blue-400 text-center">{error()}</span>
        <div class="h-1"></div>
      </Show>
      <div class="h-2"></div>
      <button onClick={handleSubmit} type="submit" class="block w-full h-9 rounded-xl bg-white hover:bg-[#ebebeb] text-black font-medium text-[15px] leading-5">Next</button>
      <div class="h-2"></div>
      <A href="../login" class="flex justify-center items-center w-full h-9 rounded-xl text-white bg-[#ffffff0A] hover:bg-[#ffffff14] border border-[#ffffff14] font-medium text-[15px] leading-5">Back</A>
      <div class="h-8"></div>
      <span class="text-[#ffffff8C] text-[13px]">
        By clicking Next above, you acknowledge that you are addicted to air.
      </span>
    </form>
    </Show>
  </>);
}

const DisplayNamePhase: Component<{
  displayName: Accessor<string>, setDisplayName: Setter<string>,
  loading: Accessor<boolean>, setLoading: Setter<boolean>,
}> = (props) => {
  const navigate = useNavigate()

  onMount(() => props.setLoading(false))

  async function handleSubmit(e: MouseEvent) {
    let displayNameInput = document.querySelector('#displayname') as HTMLInputElement

    e.preventDefault()
    if (!props.displayName()) {
      displayNameInput.focus()
      return;
    }
    navigate('../email')
  }

  return (<>
    <span class="text-white text-lg font-medium">How should we call you?</span>
    <div class="h-1"></div>
    <span class="text-[#ffffff8C] text-[15px] leading-5">Enter a display name, this can be anything you want.</span>
    <div class="h-8"></div>
    <Show when={!props.loading()} fallback={<Spinner class="h-12" />}>
    <form>
      <input id="displayname" value={props.displayName()} onInput={e => props.setDisplayName(e.target.value)} type="text" placeholder="Choose a display name" class="w-full h-9 rounded-xl text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5 py-1" />
      <div class="h-2"></div>
      <button onClick={handleSubmit} type="submit" class="block w-full h-9 rounded-xl bg-white hover:bg-[#ebebeb] text-black font-medium text-[15px] leading-5">Next</button>
      <div class="h-2"></div>
      <A href="../" class="flex justify-center items-center w-full h-9 rounded-xl text-white bg-[#ffffff0A] hover:bg-[#ffffff14] border border-[#ffffff14] font-medium text-[15px] leading-5">Back</A>
    </form>
    </Show>
  </>);
}

const EmailPhase: Component<{
  email: Accessor<string>, setEmail: Setter<string>,
  loading: Accessor<boolean>, setLoading: Setter<boolean>,
}> = (props) => {
  const mf = useMF()
  const navigate = useNavigate()
  const [error, setError] = createSignal('')

  async function handleSubmit(e: MouseEvent) {
    let emailInput = document.querySelector('#email') as HTMLInputElement

    e.preventDefault()
    if (!props.email()) {
      emailInput.focus()
      return;
    }

    props.setLoading(true)
    let res = await mf.auth.isAvailable(
      '', props.email()
    )
    setError(res.error ? {
      'body': 'Invalid email',
      'unknown': 'Unknown error',
    }[res.error!] : '')
    if (!res.success) return;
    if (res.data!.available) {
      navigate('../password')
      return;
    }
    setError('Email address taken')
    emailInput.focus()
    props.setLoading(false)
  }

  return (<>
    <span class="text-white text-lg font-medium">What is your email?</span>
    <div class="h-1"></div>
    <span class="text-[#ffffff8C] text-[15px] leading-5">Enter the email address that you would like to use.</span>
    <div class="h-8"></div>
    <Show when={!props.loading()} fallback={<Spinner class="h-12" />}>
    <form>
      <input id="email" value={props.email()} onInput={e => props.setEmail(e.target.value)} type="email" placeholder="Choose a username" class="w-full h-9 rounded-xl text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5 py-1" classList={{'bg-[#40aaff40] focus:bg-[#40aaff40]': error() != ''}} />
      <Show when={error()}>
        <div class="h-1"></div>
        <span class="block text-[13px] text-blue-400 text-center">{error()}</span>
        <div class="h-1"></div>
      </Show>
      <div class="h-2"></div>
      <button onClick={handleSubmit} type="submit" class="block w-full h-9 rounded-xl bg-white hover:bg-[#ebebeb] text-black font-medium text-[15px] leading-5">Next</button>
      <div class="h-2"></div>
      <A href="../name" class="flex justify-center items-center w-full h-9 rounded-xl text-white bg-[#ffffff0A] hover:bg-[#ffffff14] border border-[#ffffff14] font-medium text-[15px] leading-5">Back</A>
    </form>
    </Show>
  </>);
}

//TODO: check password strength
const PasswordPhase: Component<{
  password: Accessor<string>, setPassword: Setter<string>,
  loading: Accessor<boolean>, setLoading: Setter<boolean>,
  register: () => Promise<MFRegisterResponse>
}> = (props) => {
  const [repeat, setRepeat] = createSignal('')
  const [error, setError] = createSignal('')
  const navigate = useNavigate()

  onMount(() => props.setLoading(false))

  async function handleSubmit(e: MouseEvent) {
    let passwordInput = document.querySelector('#password') as HTMLInputElement
    let repeatInput = document.querySelector('#repeat') as HTMLInputElement

    e.preventDefault()
    if (!props.password()) {
      passwordInput.focus()
      return;
    }
    if (!repeat()) {
      repeatInput.focus()
      return;
    }
    if (props.password().length < 12) {
      setError('Too short! Must be at least 12 characters long')
      return;
    }
    if (props.password() !== repeat()) {
      setError('The passwords do not match!')
      return;
    }

    props.setLoading(true)
    let res = await props.register()
    setError(res.error ? {
      'body': 'Something went wrong, please try again.',
      'username': 'Username taken',
      'email-taken': 'Email address taken',
      'invalid-email': 'Invalid email address',
      'unknown': 'Unknown error',
    }[res.error!] : '')
    
    if (!res.success) {
      props.setLoading(false)
      return;
    }

    navigate('../phrase')
  }

  return (<>
    <span class="text-white text-lg font-medium">Choose a secure password</span>
    <div class="h-1"></div>
    <span class="text-[#ffffff8C] text-[15px] leading-5">Make sure to use Uppercase and lowercase letters, numbers, and special characters too.</span>
    <div class="h-8"></div>
    <Show when={!props.loading()} fallback={<Spinner class="h-12" />}>
    <form>
      <input id="password" value={props.password()} onInput={e => props.setPassword(e.target.value)} type="password" placeholder="Choose a secure password" class="w-full h-9 rounded-xl text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5 py-1" />
      <div class="h-2"></div>
      <input id="repeat" value={repeat()} onInput={e => setRepeat(e.target.value)} type="password" placeholder="Repeat the password" class="w-full h-9 rounded-xl text-white text-[15px] bg-[#232323] focus:bg-[#2c2c2c] border-none focus:ring-0 placeholder:text-[#606060] leading-5 py-1" />
      <Show when={error()}>
        <div class="h-1"></div>
        <span class="block text-[13px] text-blue-400 text-center">{error()}</span>
        <div class="h-1"></div>
      </Show>
      <div class="h-2"></div>
      <button onClick={handleSubmit} type="submit" class="block w-full h-9 rounded-xl bg-white hover:bg-[#ebebeb] text-black font-medium text-[15px] leading-5">Next</button>
      <div class="h-2"></div>
      <A href="../email" class="flex justify-center items-center w-full h-9 rounded-xl text-white bg-[#ffffff0A] hover:bg-[#ffffff14] border border-[#ffffff14] font-medium text-[15px] leading-5">Back</A>
    </form>
    </Show>
  </>);
}

const PhrasePhase: Component<{
  password: Accessor<string>, username: Accessor<string>,
  email: Accessor<string>,
  loading: Accessor<boolean>, setLoading: Setter<boolean>,
}> = (props) => {
  const [phrase, setPhrase] = createSignal('')
  const [message, setMessage] = createSignal('')
  const navigate = useNavigate()

  onMount(async () => {
    setPhrase(
      (await bip39encode(
        (await sha256hash(props.password()) as Uint8Array)
      )).join(' ')
    )
    props.setLoading(false)
  })

  async function submit() {
    localStorage.setItem('temp_login', JSON.stringify({
      username: props.username(),
      password: props.password()
    }))

    navigate(`../../verify?username=${props.username()}&email=${props.email()}`)
  }

  async function handleDownload(e: MouseEvent) {
    e.preventDefault()
    const file = new File(
      [
        'Memory Fragments recovery phrase\n',
        'Recover your account at: ', baseURL, 'auth/recovery/\n\n',
        'Username: ', props.username(), '\n',
        'Date: ', new Date().toDateString(), '\n\n',
        phrase().split(' ')
          .map((word, i) => i % 6 == 0 ? '\n' + word : word)
          .join(' ')
      ],
      `${props.username()}-recovery-mf.txt`, {
      type: 'text/plain'
    })
    const link = document.createElement('a')
    const url = URL.createObjectURL(file)
    link.href = url
    link.download = file.name
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    submit()
  }

  async function handleCopy(e: MouseEvent) {
    e.preventDefault()
    navigator.clipboard.writeText(phrase())
    setMessage('Copied to clipboard')
  }
  createEffect(() => {
    if (!message()) return;
    setTimeout(() => {
      setMessage('')
    }, 3000)

    submit()
  })

  return (<>
    <span class="text-white text-lg font-medium">Your account recovery phrase</span>
    <div class="h-1"></div>
    <span class="text-[#ffffff8C] text-[15px] leading-5">This phrase is the only way to recover your data if you forget your password.</span>
    <div class="h-2"></div>
    <span class="text-white text-[15px] font-medium leading-5">Make sure to store it in a secure place!</span>
    <div class="h-4"></div>
    <Show when={!props.loading()} fallback={<Spinner class="h-12" />}>
      <code class="border p-2 text-justify text-[#ffffff8C] border-[#ffffff40] rounded-xl bg-[#222] leading-5 text-[15px]">{phrase()}</code>
      <div class="h-4"></div>
      <button onClick={handleDownload} class="block w-full h-9 rounded-xl bg-white hover:bg-[#ebebeb] text-black font-medium text-[15px] leading-5">Download file</button>
      <div class="h-2"></div>
      <button onClick={handleCopy} class=" w-full h-9 rounded-xl text-white bg-[#ffffff0A] hover:bg-[#ffffff14] border border-[#ffffff14] font-medium text-[15px] leading-5">Copy to clipboard</button>
      <div class="h-1"></div>
      <span class="block text-[13px] text-[#ffffff8C] text-center">{message()}</span>
    </Show>
  </>);
}
