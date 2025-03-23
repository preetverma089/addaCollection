const verifyEmailTemplate = (name, url) => {
  return;
  `
   <p>Dear ${name}</p>
    <p>Thankyou for registering in addaCollection</p>
    <a  href=${url} style="color:red; background:white; margin-top:10px">Verify Email</a>
    `;
};

export default verifyEmailTemplate;
