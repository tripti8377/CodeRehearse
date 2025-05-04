import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const base64Payload = token.split('.')[1];
      const decodedPayload = atob(base64Payload);
      const payload = JSON.parse(decodedPayload);
      setEmail(payload.email);

      // Fetch subscription status from backend
      axios
        .post('http://localhost:5001/api/subscribe/status', { email: payload.email })
        .then((res) => {
          setSubscribed(res.data.isSubscribed);
        })
        .catch((err) => {
          console.error("Status check error:", err.response?.data?.message || err.message);
        });
    }
  }, []);

  const handleToggleSubscribe = async () => {
    if (!email) {
      alert("No email found. Please log in.");
      return;
    }

    const token = localStorage.getItem("token");
    const route = subscribed
      ? 'http://localhost:5001/api/subscribe/unsubscribe'
      : 'http://localhost:5001/api/subscribe';

    try {
      const res = await axios.post(
        route,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success || res.data.message) {
        setSubscribed(!subscribed);
        alert(subscribed ? "Unsubscribed successfully!" : "Subscribed successfully!");
      }
    } catch (err) {
      console.error("Subscription toggle error:", err.response?.data?.message || err.message);
      alert("Action failed.");
    }
  };

  return (
    <footer className="w-full bg-[#1A1A22] text-white py-6 px-4 mt-12 fixed bottom-0 left-0 right-0">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-lg font-medium text-[#C9D1D9]">Want to receive daily updates?</p>
        </div>
        <div>
          <button
            onClick={handleToggleSubscribe}
            className={`${
              subscribed ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded transition`}
          >
            {subscribed ? 'Unsubscribe' : 'Subscribe'}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
