import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class EmailSender:
  def __init__(self, sender: str, password: str):
    self.sender = sender
    self.password = password
    self.server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    
  def send_email(self, to: str, subject: str, msg: MIMEMultipart):
    msg['Subject'] = subject
    msg['From'] = self.sender
    msg['To'] = to
    
    self.server.connect('smtp.gmail.com', 465)
    self.server.login(self.sender, self.password)
    self.server.sendmail(self.sender, to, msg.as_string())
    self.server.quit()
    
  def send_verification(self, email, username, code, link):
    msg = MIMEMultipart('alternative')
    
    subject = 'Memory Fragments - Verify your email'
    plain = MIMEText(f"""
Hi, {username}!

Welcome to Memory Fragments! To confirm your registration, please verify your email.
Your code: {code}
Alternatively, you can use this link: {link}
""", 'plain')

    html = MIMEText(f"""
<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <style>@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
    body {{ font-family: 'Roboto', Helvetica, sans-serif;
      background-color: white; margin: 0;
      padding: 1.2em 0.8em; text-align: justify; }}
    html {{ margin: 0; }} h1 {{ margin-top: 0; font-size: 2em; }}
    #pre-code {{ display: block; font-weight: bold; }}
    #code {{ color: #40aaff; }}
    #link {{ line-break: anywhere; }}
    p {{ font-size: 1.3em; font-weight: 300; }}
    @media only screen and (min-width: 768px) {'''{
    html { background-color: #eee; } body { min-height: calc(100vh - 2.4em); }}'''}
  </style></head><body>
  <h1>Hi, {username}!</h1>
  <p>Welcome to Memory Fragments! To confirm your registration, please verify your email.</p>
  <p id="pre-code">Your code: <span id="code">{code}</span></p>
  <p id="pre-link">Alternatively, you can use this link: <br/>
  <a id="link" href="{link}">{link}</a></p></body></html>
""", 'html')
    
    msg.attach(plain)
    msg.attach(html)
    self.send_email(email, subject, msg)