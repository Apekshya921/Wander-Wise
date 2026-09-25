import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

import api from "../../api/axios";
import { toast } from "sonner";

const EditItinerary = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const tripIdFromQuery = searchParams.get("tripId");

  const [trip, setTrip] = useState(null);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const [activities, setActivities] = useState([
    {
      time: "",
      activity: "",
      description: "",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const isEditMode = Boolean(id);

  // Convert date to YYYY-MM-DD
  const formatInputDate = (value) => {
    if (!value) return "";

    const parsedDate = new Date(value);

    if (isNaN(parsedDate.getTime())) {
      return "";
    }

    const year = parsedDate.getFullYear();
    const month = String(
      parsedDate.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      parsedDate.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Fetch trip for new itinerary
  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripIdFromQuery) return;

      try {
        setLoadingData(true);

        const response = await api.get(
          `/trips/${tripIdFromQuery}`
        );

        setTrip(response.data);

        // Set default date to trip start date
        if (response.data.startDate) {
          setDate(
            formatInputDate(
              response.data.startDate
            )
          );
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch trip");
      } finally {
        setLoadingData(false);
      }
    };

    fetchTrip();
  }, [tripIdFromQuery]);

  // Fetch itinerary for edit mode
  useEffect(() => {
    const fetchItinerary = async () => {
      if (!isEditMode) return;

      try {
        setLoadingData(true);

        const response = await api.get(
          `/itineraries/${id}`
        );

        const itinerary = response.data;

        setTitle(itinerary.title || "");

        setDate(
          formatInputDate(itinerary.date)
        );

        setActivities(
          itinerary.activities?.length > 0
            ? itinerary.activities
            : [
                {
                  time: "",
                  activity: "",
                  description: "",
                },
              ]
        );

        if (itinerary.trip) {
          setTrip(itinerary.trip);
        }
      } catch (error) {
        console.log(error);
        toast.error(
          "Failed to fetch itinerary"
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchItinerary();
  }, [id, isEditMode]);

  // Add activity
  const addActivity = () => {
    setActivities([
      ...activities,
      {
        time: "",
        activity: "",
        description: "",
      },
    ]);
  };

  // Remove activity
  const removeActivity = (index) => {
    if (activities.length === 1) {
      return;
    }

    setActivities(
      activities.filter(
        (_, activityIndex) =>
          activityIndex !== index
      )
    );
  };

  // Update activity
  const updateActivity = (
    index,
    field,
    value
  ) => {
    const updatedActivities = [...activities];

    updatedActivities[index] = {
      ...updatedActivities[index],
      [field]: value,
    };

    setActivities(updatedActivities);
  };

  // Submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter itinerary title");
      return;
    }

    if (!date) {
      toast.error("Please select a date");
      return;
    }

    const tripId =
      trip?._id || tripIdFromQuery;

    if (!tripId) {
      toast.error("Trip not found");
      return;
    }

    try {
      setLoading(true);

      const data = {
        trip: tripId,
        title: title.trim(),
        date: date,
        activities: activities.filter(
          (activity) =>
            activity.time.trim() ||
            activity.activity.trim() ||
            activity.description.trim()
        ),
      };

      if (isEditMode) {
        await api.patch(
          `/itineraries/${id}`,
          data
        );

        toast.success(
          "Itinerary updated successfully"
        );

        navigate(`/itineraries/${id}`);
      } else {
        const response = await api.post(
          "/itineraries",
          data
        );

        toast.success(
          "Itinerary created successfully"
        );

        navigate(
          `/itineraries/${response.data._id}`
        );
      }
    } catch (error) {
      console.log(error);

      toast.error(
        isEditMode
          ? "Failed to update itinerary"
          : "Failed to create itinerary"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>
            {isEditMode
              ? "Edit Itinerary"
              : "Add Itinerary"}
          </CardTitle>

          {trip && (
            <p className="text-sm text-muted-foreground">
              Trip: {trip.title}
            </p>
          )}
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Itinerary Title
              </label>

              <Input
                type="text"
                placeholder="e.g. Kathmandu Day 1"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Date
              </label>

              <Input
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
              />
            </div>

            {/* Activities */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Activities
                </h2>

                <Button
                  type="button"
                  variant="outline"
                  onClick={addActivity}
                >
                  + Add Activity
                </Button>
              </div>

              {activities.map(
                (activity, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 space-y-4">
                      {/* Time */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Time
                        </label>

                        <Input
                          type="time"
                          value={
                            activity.time
                          }
                          onChange={(event) =>
                            updateActivity(
                              index,
                              "time",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      {/* Activity */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Activity
                        </label>

                        <Input
                          type="text"
                          placeholder="e.g. Visit Pashupatinath Temple"
                          value={
                            activity.activity
                          }
                          onChange={(event) =>
                            updateActivity(
                              index,
                              "activity",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Description
                        </label>

                        <Textarea
                          placeholder="Add some details..."
                          value={
                            activity.description
                          }
                          onChange={(event) =>
                            updateActivity(
                              index,
                              "description",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      {/* Remove */}
                      {activities.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() =>
                            removeActivity(index)
                          }
                        >
                          Remove Activity
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate("/itineraries")
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Itinerary"
                  : "Create Itinerary"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditItinerary;