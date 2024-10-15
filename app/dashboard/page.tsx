"use client";
import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Share2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { signOut, useSession } from "next-auth/react"; // Import NextAuth functions

interface Video {
  id: string;
  title: string;
  votes: number;
}

const REFRESH_INTERVAL = 10 * 1000;
const YOUTUBE_API_KEY = 'AIzaSyBg1z38VdK6ETY89EXhZ-bmzdxqt1dC15Q'; // Replace with your YouTube Data API key

export default function Component() {
  const { data: session } = useSession(); // Get the user session
  const [youtubeLink, setYoutubeLink] = useState("");
  const [previewId, setPreviewId] = useState("");
  const [queue, setQueue] = useState<Video[]>([
    { id: "EiiOYwqk3A0", title: "Aditya Rikhari - FAASLE", votes: 0 },
    { id: "dnDqQOYMd10", title: "Make You Mine (Official Music Video)", votes: 0 },
    { id: "6ZwwapPikyQ", title: "Samay Samjhayega - Mohit lalwani |Surya Raj Kamal", votes: 0 },
  ]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Video | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [userVotes, setUserVotes] = useState<{ [key: string]: boolean }>({}); // Track user votes

  useEffect(() => {
    // Set a default video to play when the component mounts
    if (queue.length > 0 && !currentlyPlaying) {
      playNext();
    }

    console.log("Current Queue:", queue);
    console.log("Currently Playing:", currentlyPlaying);
  }, [queue, currentlyPlaying]);

  // Function to fetch new stream data
  const refreshStream = async () => {
    const data = await fetch(`/api/streams/my`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const json = await data.json();
    setQueue((prevQueue) => json.streams || prevQueue);
  };

  useEffect(() => {
    refreshStream(); // Initial call
    const interval = setInterval(refreshStream, REFRESH_INTERVAL);
    return () => clearInterval(interval); // Clear interval on unmount
  }, []);

  useEffect(() => {
    setCanShare(!!navigator.share || !!navigator.clipboard);
  }, []);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeLink(e.target.value);
    const videoId = extractVideoId(e.target.value);
    if (videoId) {
      setPreviewId(videoId);
    }
  };

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const fetchVideoTitle = async (videoId: string) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          part: 'snippet',
          id: videoId,
          key: YOUTUBE_API_KEY,
        },
      });
      return response.data.items[0]?.snippet.title || "Untitled Video";
    } catch (error) {
      console.error("Error fetching video title:", error);
      return "Error fetching title";
    }
  };

  const handleSubmit = async () => {
    const videoId = extractVideoId(youtubeLink);
    if (videoId) {
      const title = await fetchVideoTitle(videoId);
      const newVideo: Video = {
        id: videoId,
        title: title, // Fetch the actual title
        votes: 0,
      };

      setQueue((prevQueue) => {
        const updatedQueue = [...prevQueue, newVideo];
        if (!currentlyPlaying) {
          playNext();
        }
        return updatedQueue;
      });

      setYoutubeLink("");
      setPreviewId("");
      toast.success("Song added to the queue!");
    } else {
      toast.error("Invalid YouTube link");
    }
  };

  const handleVote = (id: string, increment: number) => {
    if (!userVotes[id]) {
      setQueue(
        queue
          .map((video) =>
            video.id === id ? { ...video, votes: video.votes + increment } : video
          )
          .sort((a, b) => b.votes - a.votes)
      );
      setUserVotes((prev) => ({ ...prev, [id]: true }));
      toast.info(`Vote ${increment > 0 ? "up" : "down"} recorded`);

      fetch("/api/streams/upvote", {
        method: "POST",
        body: JSON.stringify({
          streamId: id,
        }),
      });
    } else {
      toast.error("You can only vote once per song.");
    }
  };

  const playNext = () => {
    if (queue.length > 0) {
      console.log("Playing next video:", queue[0]);
      setCurrentlyPlaying(queue[0]);
      setQueue(queue.slice(1));
      toast.success("Now playing: " + queue[0].title);
    } else {
      toast.warning("No more songs in the queue");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Join my stream and vote for songs!",
      text: "Check out my live stream and help choose the next song!",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share");
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); // Redirect to home page after signout
  };

  return (
    <div className="mx-auto p-4 space-y-6 bg-gradient-to-br from-blue-50 to-gray-100 min-h-screen">
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-4xl p-2 m-2 font-bold text-blue-800 animate-fade-in">
      Muzic🎵 Voting
    </h1>
    <div className="flex items-center space-x-4">
      {session && (
        <>
          <span className="text-lg font-semibold">{session.user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-md"
          >
            Logout
          </button>
        </>
      )}
      {canShare && (
        <button
          onClick={handleShare}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          <Share2 className="mr-2 h-4 w-4" /> Share
        </button>
      )}
    </div>
  </div>

  <div className="grid md:grid-cols-2 gap-6">
    <div className="space-y-6">
      <div className="space-y-2 bg-white p-6 rounded-lg shadow-md animate-slide-in">
        <input
          type="text"
          placeholder="Enter YouTube link"
          value={youtubeLink}
          onChange={handleLinkChange}
          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-sm"
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
        >
          Submit
        </button>
        {previewId && (
          <div className="aspect-video mt-4 animate-fade-in">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${previewId}`}
              allowFullScreen
              className="rounded-md shadow-md"
            ></iframe>
          </div>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Video Queue</h2>
        <div className="space-y-4">
          {queue.map((video) => (
            <div key={video.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 transition duration-300">
              <div className="flex items-center space-x-4">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/default.jpg`}
                  alt={video.title}
                  className="h-16 w-24 rounded-md shadow-sm"
                />
                <div>
                  <h3 className="text-lg font-semibold">{video.title}</h3>
                  <p className="text-gray-600">Votes: {video.votes}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVote(video.id, 1)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleVote(video.id, -1)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between">
      {currentlyPlaying && (
        <div>
          <h2 className="text-xl font-bold text-blue-800 mb-4">Now Playing</h2>
          <iframe
            width="100%"
            height="300"
            src={`https://www.youtube.com/embed/${currentlyPlaying.id}`}
            allowFullScreen
            className="rounded-md mb-4 shadow-md"
          ></iframe>
          <h3 className="text-lg font-semibold">{currentlyPlaying.title}</h3>
        </div>
      )}
      <button
        onClick={playNext}
        className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
      >
        Next Video
      </button>
    </div>
  </div>
  <ToastContainer position="bottom-right" />
</div>

  );
}
