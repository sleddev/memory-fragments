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
    
    msg.attach(plain)
    self.send_email(email, subject, msg)