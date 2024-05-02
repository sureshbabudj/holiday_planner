import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

import React from "react";

export const AboutHolidayPlanner = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Plan Your Dream Vacation Hassle-Free!
          </h1>
          <p className="text-lg mb-8">
            Our Holiday Planner app allows you to create personalized vacation
            plans tailored to your preferences.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white shadow-md p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">
                Personalized Itineraries
              </h3>
              <p>
                Create customized vacation plans based on your desired
                destinations, travel dates, and preferences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white shadow-md p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Flexible Planning</h3>
              <p>
                Choose from a wide range of holiday options, including short
                getaways, week-long vacations, and extended trips.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white shadow-md p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">
                Real-Time Recommendations
              </h3>
              <p>
                Get real-time recommendations for nearby places of interest,
                tourist attractions, and sightseeing spots.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white shadow-md p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Detailed Itineraries</h3>
              <p>
                View detailed itineraries for each day of your vacation,
                including travel times, sightseeing schedules, and recommended
                activities.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white shadow-md p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Easy Booking</h3>
              <p>
                Book accommodations, transportation, and activities directly
                from the app for a seamless planning experience.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white shadow-md p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Save and Share</h3>
              <p>
                Save your favorite vacation plans and share them with friends
                and family for easy collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-blue-700 text-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex items-center mb-8 lg:mb-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-700 text-xl font-bold px-4 inline-block">
                  1
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
                <p>
                  Sign up and create your profile to start planning your dream
                  vacation.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center mb-8 lg:mb-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-700 text-xl font-bold px-4 inline-block">
                  2
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Plan Your Trip</h3>
                <p>
                  Enter your desired destination, travel dates, and preferences
                  to generate personalized vacation plans.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-700 text-xl font-bold px-4 inline-block">
                  3
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Explore Recommendations
                </h3>
                <p>
                  Discover nearby attractions, tourist spots, and sightseeing
                  options based on your interests.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-center mb-8 lg:mb-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-700 text-xl font-bold px-4 inline-block">
                  4
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Customize Your Itinerary
                </h3>
                <p>
                  Tailor your vacation itinerary to include your favorite
                  destinations, activities, and experiences.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-center mb-8 lg:mb-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-700 text-xl font-bold px-4 inline-block">
                  5
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Book Your Trip</h3>
                <p>
                  Book accommodations, transportation, and activities directly
                  from the app for a hassle-free experience.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-700 text-xl font-bold px-4 inline-block">
                  6
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Enjoy Your Vacation</h3>
                <p>
                  Follow your personalized itinerary and enjoy a stress-free
                  vacation experience from start to finish.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <AboutHolidayPlanner />
      <Footer />
    </main>
  );
}
