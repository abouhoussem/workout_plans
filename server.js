const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// إعداد اتصال SMTP عبر Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // بريدك الإلكتروني
        pass: 'your-email-password'   // كلمة المرور الخاصة بالبريد
    }
});

// دالة لإرسال بريد التفعيل
function sendConfirmationEmail(userEmail) {
    const mailOptions = {
        from: 'your-email@gmail.com', // بريدك الإلكتروني
        to: userEmail,
        subject: 'تأكيد التسجيل في تطبيق مخطط إنقاص الوزن',
        text: 'مرحباً! تم تسجيلك بنجاح في تطبيق مخطط إنقاص الوزن. من فضلك قم بتفعيل حسابك عبر الرابط التالي:\n\n' +
              'http://localhost:3000/confirm?email=' + userEmail // رابط تفعيل الحساب
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error: ' + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// نقطة API لتسجيل المستخدم
app.post('/submit_signup', (req, res) => {
    const userEmail = req.body.email;

    // إرسال رسالة التفعيل
    sendConfirmationEmail(userEmail);

    // الرد على المستخدم
    res.send('تم تسجيلك بنجاح! تحقق من بريدك الإلكتروني لتفعيل حسابك.');
});

// نقطة API لتأكيد البريد الإلكتروني
app.get('/confirm', (req, res) => {
    const userEmail = req.query.email;

    // يمكن هنا تنفيذ عملية تفعيل الحساب (تحديث قاعدة البيانات على سبيل المثال)
    res.send(`تم تفعيل الحساب بنجاح لـ ${userEmail}`);
});

// تشغيل الخادم
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
