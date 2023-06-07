<script lang="ts">
  
  let userfield: HTMLInputElement;
  let emailfield: HTMLInputElement;
  let passfield: HTMLInputElement;
  
</script>

<form>
  <label for="username">Username</label>
  <input bind:this={userfield} id="username" name="username" required aria-required="true" placeholder="john-doe">
  <label for="email">E-mail address</label>
  <input bind:this={emailfield} id="email" type="email" name="email" autocomplete="email" required aria-required="true" placeholder="john@example.com">
  <label for="password">Password</label>
  <input bind:this={passfield} id="password" type="password" autocomplete="off" name="password" required aria-required="true" placeholder="••••••••••••">
  <div class="sep"></div>
  <input type="submit" value="Sign up" id="submit" on:click>
</form>

<style lang="scss">
  $scale-factor: 0.75rem;
  
  $label-fg: #FFFFFF4D;
  $accent: #40aaff;
  
  $input-bg: #FFFFFF12;
  $input-fg: #FFFFFFDE;
  $input-caret: $input-fg;
  $input-shadow: #00000019;
  $input-placeholder: #FFFFFF3B;
  $autofill-fg: #28343d;
  $submit-bg: #1A1A1A;
  $submit-shadow: #40AAFF26;
  
  label, input {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    display: block;
    text-align: center;
    font-family: inherit;
    font-weight: 500;
  }
  
  label {
    color: $label-fg;
    margin: 20px auto 4px;
    font-size: 1.25 * $scale-factor;
    &:nth-of-type(1) {
      margin-top: -1 * $scale-factor;
    }
  }
  
  input {
    background: $input-bg;
    color: $input-fg;
    caret-color: $input-caret;
    border: none;
    outline: none;
    width: 100%;
    height: 4 * $scale-factor;
    padding: 0 1 * $scale-factor;
    border-radius: 2 * $scale-factor;
    font-size: 1.5 * $scale-factor;
    box-shadow: inset 0 0 2 * $scale-factor $input-shadow;
    &::placeholder {
      color: $input-placeholder;
    }
    &:-webkit-autofill {
      -webkit-text-fill-color: $input-fg;
      box-shadow: 0 0 0 2 * $scale-factor $autofill-fg inset, inset 0 0 0 1px #000000, inset 0 0 0 1px #000000;
    }
  }
  
  #submit {
    color: $input-fg;
    background: $submit-bg;
    border: 2px solid $accent;
    padding: 0;
    box-shadow: inset 0 0 2 * $scale-factor $submit-shadow;
    cursor: pointer;
    &:hover {
      background-color: darken($submit-bg, 3%);
      color: darken($input-fg, 5%);
    }
    &:active {
      scale: 0.98;
    }
  }
</style>