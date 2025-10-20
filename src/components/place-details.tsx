import getGooglePlaceDetails from "@/actions/places";
import { PlaceDetails, PlaceDetailsError, TripResponse } from "@/types";
import { useEffect, useState } from "react";

type PlaceDetailsCardProps = {
  place: TripResponse["daily_itinerary_plan"][0]["activities"][0]["place_details"];
};

export function PlaceDetailsCard({ place }: PlaceDetailsCardProps) {
  const [placeData, setPlaceData] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run if a place ID exists
    if (!place?.place_id) return;

    async function fetchData(): Promise<
      PlaceDetails | PlaceDetailsError | void
    > {
      try {
        if (!place || !place.place_id) return;
        setLoading(true);
        const response = await getGooglePlaceDetails(place.place_id);
        if (!response || ("error" in response && response.error)) {
          console.error(
            "Place Details Error:",
            "error" in response ? response.error?.message : "No response"
          );
          return;
        }
        if (response && !("error" in response)) {
          setPlaceData((prev: PlaceDetails | null) => {
            const oldData = prev || {};
            return { ...oldData, ...response };
          });
        }
      } catch (error) {
        console.error("Unexpected error fetching place details:", error);
      } finally {
        setLoading(false);
      }
    }

    // Simulate API delay and data retrieval (replace with actual fetch in production)
    // const timer = setTimeout(() => {
    //   // In a real app, this is where you'd retrieve the photo reference, rating, etc.

    //   setPlaceData((prev) => {
    //     const oldData = prev || {};
    //     return {
    //       ...oldData,
    //       // Mock image URL using place name for unique placeholder
    //       imageUrl: `https://placehold.co/400x200/4F46E5/FFFFFF?text=${encodeURIComponent(place.name || "Place+Image")}`,
    //       // Use realistic mock data if the model didn't provide a rating
    //       user_rating:
    //         oldData.user_rating || (Math.floor(Math.random() * 20) + 30) / 10, // 3.0 to 5.0
    //       review_count:
    //         oldData.review_count || Math.floor(Math.random() * 500) + 100,
    //     };
    //   });
    //   setLoading(false);
    // }, 500);
    //  return () => clearTimeout(timer);

    fetchData();
  }, [place]);

  if (!placeData) return null;

  return (
    <div className="mt-2 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {loading ? (
        <div className="h-20 flex items-center justify-center text-sm text-gray-500 bg-gray-100">
          Loading Place Details...
        </div>
      ) : (
        <>
          {placeData.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={placeData.imageUrl}
              alt={`Image of ${place?.name || "Place"}`}
              className="w-full h-32 object-cover"
            />
          )}
          <div className="p-3">
            <p className="text-sm font-semibold text-gray-800">{place?.name}</p>
            {place?.address && (
              <p className="text-xs text-gray-500 truncate">{place.address}</p>
            )}
            {placeData.rating && (
              <div className="flex items-center text-xs mt-1">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-bold text-gray-700">
                  {placeData.rating.toFixed(1)}
                </span>
                <span className="text-gray-500 ml-1">
                  ({placeData.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
