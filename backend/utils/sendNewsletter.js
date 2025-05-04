// utils/sendNewsletter.js
const nodemailer = require("nodemailer");
const axios = require("axios");
const User = require("../models/User");
const pLimit = require('p-limit');
//const limit = pLimit(5);

const interestTagMap = {
  "Frontend Developer": ["frontend", "webdev"],
  "JavaScript Developer": ["javascript"],
  "React/Vue/Angular Developer": ["react", "vue", "angular"],
  "UI Developer": ["ui", "design"],
  "Web Designer": ["design"],
  "Backend Developer": ["backend"],
  "Node.js Developer": ["nodejs"],
  "API Developer": ["api"],
  "Database Developer": ["database"],
  "Full-Stack Web Developer": ["fullstack"],
  "MEAN/MERN Stack Developer": ["mern", "mean"],
  "WordPress Developer": ["wordpress"],
  "Web Security Engineer": ["security"],
  "SEO Developer": ["seo"],
  "Machine Learning Engineer": ["machinelearning"],
  "Deep Learning Engineer": ["deeplearning"],
  "NLP Engineer": ["nlp"],
  "AI Engineer": ["ai"],
  "Data Scientist": ["datascience"],
  "Data Analyst": ["data"],
  "MLOps Engineer": ["mlops"],
  "Reinforcement Learning Engineer": ["reinforcementlearning"],
  "AI Ethics Researcher": ["aiethics"],
  "Software Engineer": ["software"],
  "Systems Engineer": ["systems"],
  "DevOps Engineer": ["devops"],
  "Cloud Engineer": ["cloud"],
  "Mobile Developer": ["mobile"],
  "Flutter Developer": ["flutter"],
  "Game Developer": ["gamedev"],
  "Blockchain Developer": ["blockchain"],
  "AR/VR Developer": ["ar", "vr"],
};

const mapInterestToTags = (interests) => {
  const tags = new Set();
  interests.forEach((interest) => {
    (interestTagMap[interest] || []).forEach(tag => tags.add(tag));
  });
  return Array.from(tags);
};

const getSubscribedEmails = async () => {
  const users = await User.find({ isSubscribed: true }, "email name interests");
  return users;
};

const getPersonalizedNewsHTML = async (interests) => {
  try {
    const topStoriesRes = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
    const storyIds = topStoriesRes.data.slice(0, 50); // Get top 50 to filter by tags later
    //console.log(storyIds);
     // Only 5 at a time

     const storyPromises = storyIds.slice(0, 30).map(async (id) => {
      const res = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return res.data;
    });
    

const stories = await Promise.all(storyPromises);

    console.log(stories)

    // Filter articles that match at least one tag in the title
    const tags = mapInterestToTags(interests);
    const keywordRegex = new RegExp(tags.join("|"), "i");

    const filtered = stories.filter(story => 
      story && story.title && keywordRegex.test(story.title)
    ).slice(0, 5); // Pick top 5 matches
    console.log(filtered);
    if (filtered.length === 0) {
      return "<p>No relevant Hacker News articles found today.</p>";
    }

    return filtered.map(article => `
      <div style="
        background-color: #ffffff;
        border-radius: 10px;
        border: 2px solid gray;
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.25);
        color: #ffffff;
      ">
        <h4 style="margin-top: 0; color: #8e44ad;">${article.title}</h4>
        <a href="${article.url || `https://news.ycombinator.com/item?id=${article.id}`}" 
           target="_blank" 
           style="color: #8e44ad; text-decoration: underline;">Read more</a>
        <p style="color: #8e44ad; font-size: 12px; margin-top: 8px;">
          Score: ${article.score} • Comments: ${article.descendants || 0}
        </p>
      </div>
    `).join("");

  } catch (error) {
    console.error("Error fetching Hacker News articles:", error.message);
    return "<p>Could not fetch personalized news articles.</p>";
  }
};



const sendNewsletter = async () => {
  try {
    const users = await getSubscribedEmails();
    if (users.length === 0) {
      console.log("No subscribed users to send the newsletter to.");
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    for (const user of users) {
      const userInterests = Array.isArray(user.interests) ? user.interests : [];
      console.log(userInterests);
  if (userInterests.length === 0) {
    console.log(`No interests for ${user.name}, skipping newsletter.`);
    continue;
  }
      const newsHTML = await getPersonalizedNewsHTML(userInterests);

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #d2f8d2; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50;">Hi ${user.name}! 👋</h2>

            <h3 style="color: #8e44ad;">📰 Handpicked Articles for You</h3>
            ${newsHTML}

            <p style="margin-top: 40px; color: #7f8c8d;">
              Stay updated and keep learning!<br/>
              — CodeRehearse Team
            </p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: `"CodeRehearse" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "📰 Your Daily Personalized Tech Feed",
        html: htmlBody,
      });

      console.log(`✅ Newsletter sent to ${user.email}`);
    }
  } catch (err) {
    console.error("❌ Newsletter error:", err);
  }
};

module.exports = sendNewsletter;
