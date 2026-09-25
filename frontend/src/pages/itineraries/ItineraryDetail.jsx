import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Button } from "../../components/ui/button";

import api from "../../api/axios";
import { toast } from "sonner";

const ItineraryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itinerary, setItinerary] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await api.get(
          `/itineraries/${id}`
        );

        setItinerary(response.data);
      } catch (error) {
        console.log(error);
        toast.error(
          "Failed to fetch itinerary"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="p-8">
        Itinerary not found
      </div>
    );
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {itinerary.title}
          </CardTitle>

          <CardDescription>
            {new Date(
              itinerary.date
            ).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Activities */}
          <div className="space-y-4">
            {itinerary.activities?.map(
              (activity, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4"
                >
                  <p className="font-semibold">
                    {activity.time}
                  </p>

                  <p className="text-lg">
                    {activity.activity}
                  </p>

                  {activity.description && (
                    <p className="text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                  )}
                </div>
              )
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() =>
                navigate(
                  `/itineraries/${itinerary._id}/edit`
                )
              }
            >
              Edit
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                navigate("/itineraries")
              }
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItineraryDetail;