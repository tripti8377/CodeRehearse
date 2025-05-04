const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ics = require('ics');

router.post('/invite', async (req, res) => {
  const { email, contest } = req.body;
  console.log("Received contest start:", contest.start);
  const startDate = new Date(contest.start);
  const endDate = new Date(contest.end);
  const durationInMs = endDate - startDate;
  const duration = {
    hours: Math.floor(durationInMs / (1000 * 60 * 60)),
    minutes: Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60)),
}; 
console.log("Calculated duration:", duration);

const event = {
    title: contest.event,
    description: `Join this contest: ${contest.href}`,
    start: [
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes()
    ],
    duration,
    location: contest.host || "Online",
    url: contest.href,
};


  ics.createEvent(event, async (err, value) => {
    if (err) {
        console.error("ICS Error:", err);
        return res.status(500).send("Failed to create calendar invite");
    }

    // Mail it
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    let mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Invitation: ${contest.event}`,
      text: `Add ${contest.event} to your calendar.`,
      attachments: [
        {
          filename: 'invite.ics',
          content: value,
          contentType: 'text/calendar',
        }
      ]
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: "Invite sent" });
    } catch (err) {
        console.error("Email Send Error:", err);
      res.status(500).send("Email sending failed");
    }
  });
});

function parseDateTime(isoString) {
  const date = new Date(isoString);
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  ];
}

module.exports = router;
