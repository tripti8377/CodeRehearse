import axios from "axios";
import toast from 'react-hot-toast';
import { FaRegCalendarAlt } from 'react-icons/fa';

const UpcomingContests = ({contests}) =>{
    const handleAddToCalendar = async (contest) => {
        const userRaw = localStorage.getItem("user");
        if (!userRaw) return alert("Login required");
    
        const user = JSON.parse(userRaw);
        if (!user?.email) return alert("Login required");
    
        try {
          await axios.post("http://localhost:5001/api/calendar/invite", {
            email: user.email,
            contest,
          });
          toast.success("Calendar invite sent!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to send invite 😓");
        }
      };
    
    return(
        <div className="flex flex-col bg-[#161B22] text-white p-4 rounded-xl lg h-full overflow-hidden">
  <h2 className="text-xl font-bold mb-4 text-[#58A6FF]">Upcoming Contests</h2>

  <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 space-y-4">
    {contests.map((contest) => (
      <div
        key={contest.id}
        className="relative p-3 border border-gray-700 rounded-lg hover:shadow transition duration-200"
      >
        {/* Calendar Icon */}
        <button
          onClick={() => handleAddToCalendar(contest)}
          className="absolute top-2 right-2 text-gray-400 hover:text-green-400"
          title="Add to Calendar"
        >
          <FaRegCalendarAlt className="text-lg" />
        </button>

        <p className="text-lg font-semibold">{contest.event}</p>
        <p className="text-sm text-gray-400">{contest.resource.name}</p>
        <p className="text-sm text-gray-400">
          Start: {new Date(contest.start).toLocaleString()}
        </p>
        <p className="text-sm text-gray-400">
          End: {new Date(contest.end).toLocaleString()}
        </p>
        <a
          href={contest.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#58A6FF] text-sm underline mt-2 inline-block"
        >
          Go to Contest
        </a>
      </div>
    ))}
  </div>
</div>

    );
}

export default UpcomingContests;