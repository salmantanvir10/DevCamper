var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


exports.mailSender = async(emailAddress, token) =>{

    try {
        var transporter = nodemailer.createTransport(
            smtpTransport({
              service: "gmail",
              port: 587,
              auth: {
                user: "devcamper123@gmail.com",
                pass: "devcamper1234567",
              },
            })
          );
         
         var mailOptions = {
           from: 'devcamper123@gmail.com',
           to:  emailAddress,
           subject: 'Password Reset Link',
           text: "Here is your link to reset password = " + token
         };
         
         transporter.sendMail(mailOptions, function(error, info){
           if (error) {
             console.log(error);
           } else {
             console.log('Email sent: ' + info.response);
             
           }
         }); 
        
    } catch (error) {
      console.log(error+ " error in sending mail");
    }

}