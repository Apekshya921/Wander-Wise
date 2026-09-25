import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const Itinerary = () => {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [itineraries, setItineraries] = useState([]);

  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingItinerary, setLoadingItinerary] = useState(false);

  // Format date safely
  const formatDate = (date) => {
    if (!date) {
      return "No date";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "No date";
    }

    return parsedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format trip date safely
  const formatTripDate = (date) => {
    if (!date) {
      return "No date";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "No date";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Fetch trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await api.get("/trips");

        setTrips(response.data);

        if (response.data.length > 0) {
          setSelectedTrip(response.data[0]);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch trips");
      } finally {
        setLoadingTrips(false);
      }
    };

    fetchTrips();
  }, []);

  // Fetch itinerary for selected trip
  useEffect(() => {
    if (!selectedTrip) return;

    const fetchItineraries = async () => {
      try {
        setLoadingItinerary(true);

        const response = await api.get(
          `/itineraries/trip/${selectedTrip._id}`
        );

        setItineraries(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch itinerary");
      } finally {
        setLoadingItinerary(false);
      }
    };

    fetchItineraries();
  }, [selectedTrip]);

  // Delete itinerary
  const deleteItinerary = async (id) => {
    try {
      await api.delete(`/itineraries/${id}`);

      setItineraries((previous) =>
        previous.filter((item) => item._id !== id)
      );

      toast.success("Itinerary deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete itinerary");
    }
  };

  if (loadingTrips) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Itinerary
        </h1>

        <p className="text-muted-foreground">
          Plan and manage your trip itinerary
        </p>
      </div>

      {/* No Trips */}
      {trips.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold">
              No trips found
            </h2>

            <p className="text-muted-foreground mt-2">
              Create a trip first to add an itinerary.
            </p>

            <Button
              className="mt-4"
              onClick={() => navigate("/trips/add")}
            >
              Create Trip
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Trip Selection */}
          <div className="flex gap-3 flex-wrap">
            {trips.map((trip) => (
              <Button
                key={trip._id}
                variant={
                  selectedTrip?._id === trip._id
                    ? "default"
                    : "outline"
                }
                onClick={() => setSelectedTrip(trip)}
              >
                {trip.title}
              </Button>
            ))}
          </div>

          {/* Selected Trip */}
          {selectedTrip && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedTrip.title}
                </CardTitle>

                <CardDescription>
                  {formatTripDate(selectedTrip.startDate)}
                  {" - "}
                  {formatTripDate(selectedTrip.endDate)}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Add Itinerary */}
                <div className="flex justify-end mb-5">
                  <Button
                    onClick={() =>
                      navigate(
                        `/itineraries/new?tripId=${selectedTrip._id}`
                      )
                    }
                  >
                    Add Itinerary
                  </Button>
                </div>

                {/* Loading */}
                {loadingItinerary ? (
                  <p>
                    Loading itinerary...
                  </p>
                ) : itineraries.length === 0 ? (
                  <div className="text-center py-10">
                    <h2 className="text-xl font-semibold">
                      No itinerary yet
                    </h2>

                    <p className="text-muted-foreground mt-2">
                      Add your first itinerary.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {itineraries.map((item) => (
                      <Card key={item._id}>
                        <CardHeader>
                          <CardTitle>
                            {item.title}
                          </CardTitle>

                          <CardDescription>
                            {formatDate(item.date)}
                          </CardDescription>
                        </CardHeader>

                        <CardContent>
                          {/* Activities */}
                          <div className="space-y-3">
                            {item.activities?.map(
                              (activity, index) => (
                                <div
                                  key={index}
                                  className="border rounded-lg p-3"
                                >
                                  <p className="font-semibold">
                                    {activity.time}
                                  </p>

                                  <p>
                                    {activity.activity}
                                  </p>

                                  {activity.description && (
                                    <p className="text-sm text-muted-foreground">
                                      {activity.description}
                                    </p>
                                  )}
                                </div>
                              )
                            )}
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-2 mt-4">
                            <Button
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/itineraries/${item._id}`
                                )
                              }
                            >
                              View
                            </Button>

                            <Button
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/itineraries/${item._id}/edit`
                                )
                              }
                            >
                              Edit
                            </Button>

                            <Button
                              variant="destructive"
                              onClick={() =>
                                deleteItinerary(item._id)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Itinerary;