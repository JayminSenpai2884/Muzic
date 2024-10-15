"use client";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function LandingPage() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 to-sky-100 font-sans">
      <main>
        <section className="py-20 bg-gradient-to-br from-blue-500 to-blue-300 rounded-b-3xl">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Fan-Powered Music Streams
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
              Let your audience choose the soundtrack to your streams. Engage
              your fans like never before with Muzic🎧.
            </p>
            {session?.user && ( // Only show Dashboard link when the user is logged in
              <Link
                href="/dashboard"
                className="inline-block px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md border border-blue-300 hover:bg-blue-50 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75"
              >
                Dashboard
              </Link>
            )}
          </div>
        </section>

        <section className="py-20 bg-white shadow-lg rounded-lg">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Shareable Links",
                  description:
                    "Streamers can easily share links with their audience for instant access.",
                  iconPath: "M3 12l18-6-6 18-6-6-6 6z",
                },
                {
                  title: "Audience Voting",
                  description:
                    "Engage your audience by allowing them to vote on the next song to play.",
                  iconPath:
                    "M12 2L1 21h22L12 2zm0 3.5l1.69 3.68H18l-2.9 2.28 1.1 3.59L12 11.5l-4.2 3.25 1.1-3.59L6 9.5h4.31L12 5.5z",
                },
                {
                  title: "Real-Time Updates",
                  description:
                    "Enjoy seamless, real-time updates as votes are cast, ensuring transparency.",
                  iconPath: "M19 13H5v-2h14v2z",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="text-center bg-gray-100 rounded-lg p-6 shadow-md transition-transform duration-300 transform hover:scale-105"
                >
                  <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={feature.iconPath}
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-sky-200 to-sky-300">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Engage Your Fans?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join Muzic today and revolutionize your streaming experience. Let
              your audience be part of the show!
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              &copy; 2024 Muzic. @jaymin2884.
            </p>
            
          </div>
        </div>
      </footer>
    </div>
  );
}
