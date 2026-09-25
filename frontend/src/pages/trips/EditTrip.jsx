import React, { useEffect, useState } from 'react'
import TripForm from '../../components/common/TripForm'
import api from '../../api/axios';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

const EditTrip = () => {

  const { id } = useParams();

  const [trip, setTrip] = useState(null);

  useEffect(() => {

    const fetchTrips = async () => {
      try {
        const response = await api.get(`/trips/${id}`);
        setTrip(response.data);
      } catch (error) {
        toast.error("Some error occured while fetching trips");
        console.log(error);
      }
    }

    fetchTrips();
  }, []);

  if (!trip) {
    return <div>loading</div>
  }

  return (
    <div>
      <TripForm 
        tripDetails={{ 
          ...trip, 
          startDate: trip.startDate.split('T')[0], 
          endDate: trip.endDate.split('T')[0] 
        }}
      />
    </div>
  )
}

export default EditTrip 
/*
//EDIT BAGGAGE
```jsx
import React, { useEffect, useState } from 'react'
import BaggageForm from '../../components/common/BaggageForm'
import api from '../../api/axios'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'

const EditBaggage = () => {

  const { id } = useParams()

  const [baggage, setBaggage] = useState(null)

  useEffect(() => {

    const fetchBaggage = async () => {

      try {

        const response = await api.get(`/baggage/${id}`)

        setBaggage(response.data)

      } catch (error) {

        toast.error("Some error occurred while fetching baggage")
        console.log(error)

      }

    }

    fetchBaggage()

  }, [id])

  if (!baggage) {
    return <div>Loading...</div>
  }

  return (
    <div>

      <BaggageForm
        baggageDetails={{
          ...baggage
        }}
      />

    </div>
  )
}

export default EditBaggage
```
// ```jsx //itenary
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import api from '../../api/axios'
import { toast } from 'sonner'
import { formatDate } from '../../lib/utils'

const Itinerary = () => {

  const [trips, setTrips] = useState([])
  const [dependency, setDependency] = useState(0)

  useEffect(() => {

    const fetchTrips = async () => {
      try {
        const response = await api.get("/trips")
        setTrips(response.data)
      } catch (error) {
        toast.error("Some error occurred while fetching trips")
        console.log(error)
      }
    }

    fetchTrips()

  }, [dependency])

  const onDelete = async (tripId) => {
    try {
      const response = await api.delete(`/trips/${tripId}`)

      if (response.status === 200) {
        toast.success("Trip deleted successfully!!")
        setDependency(dependency + 1)
      } else {
        toast.error("Error while deleting trip.")
      }

    } catch (error) {
      toast.error(error.message || "Error while deleting trip")
      console.log(error)
    }
  }

  return (
    <div className="px-20 py-24 bg-purple-100">

      <Card>

        <CardHeader className="border-b">
          <CardTitle>Select a trip to view itinerary</CardTitle>

          <CardDescription>
            Click the view itinerary button to see the itinerary of this trip.
          </CardDescription>
        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-3 gap-6">

            {trips.length === 0 ? (

              <div className="text-3xl font-semibold text-center py-20 col-span-3">
                You do not have any trips to show. Create a new trip first.
              </div>

            ) : (

              trips.map((trip) => (

                <Card key={trip._id}>

                  <CardHeader className="border-b">

                    <CardTitle>
                      {trip.title}
                    </CardTitle>

                    <CardDescription>
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </CardDescription>

                  </CardHeader>

                  <CardContent>

                    <p>
                      Budget: Rs. {trip.budget.total}
                    </p>

                    <p>
                      Spent: Rs. {trip.budget.spent}
                    </p>

                    <p>
                      Destinations: {trip.destinations.join(", ")}
                    </p>

                  </CardContent>

                  <CardFooter>

                    <a
                      className="w-full"
                      href={`/itinerary/${trip._id}`}
                    >
                      <Button className="w-full">
                        View Itinerary
                      </Button>
                    </a>

                  </CardFooter>

                </Card>

              ))

            )}

          </div>

        </CardContent>

        <CardFooter>
          <p className="text-gray-500">
            Total trips: {trips.length}
          </p>
        </CardFooter>

      </Card>

    </div>
  )
}

export default Itinerary
```

//EDIT 
```jsx
import React, { useEffect, useState } from 'react'
import ItineraryForm from '../../components/common/ItineraryForm'
import api from '../../api/axios'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'

const EditItinerary = () => {

  const { id } = useParams()

  const [itinerary, setItinerary] = useState(null)

  useEffect(() => {

    const fetchItinerary = async () => {
      try {

        const response = await api.get(`/itinerary/${id}`)

        setItinerary(response.data)

      } catch (error) {

        toast.error("Some error occurred while fetching itinerary")
        console.log(error)

      }
    }

    fetchItinerary()

  }, [id])

  if (!itinerary) {
    return <div>Loading...</div>
  }

  return (
    <div>

      <ItineraryForm
        itineraryDetails={{
          ...itinerary
        }}
      />

    </div>
  )
}

export default EditItinerary
```
//ITENARY DETAIL
```jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api/axios'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'

const ItineraryDetail = () => {

  const { id } = useParams()

  const [itinerary, setItinerary] = useState(null)

  useEffect(() => {

    const fetchItinerary = async () => {
      try {

        const response = await api.get(`/itinerary/${id}`)

        setItinerary(response.data)

      } catch (error) {

        toast.error("Some error occurred while fetching itinerary")
        console.log(error)

      }
    }

    fetchItinerary()

  }, [id])

  if (!itinerary) {
    return <div className="p-10">Loading...</div>
  }

  return (
    <div className="px-20 py-24 bg-purple-100 min-h-screen">

      <Card>

        <CardHeader className="border-b">

          <CardTitle>
            {itinerary.title}
          </CardTitle>

          <CardDescription>
            Your trip itinerary
          </CardDescription>

        </CardHeader>

        <CardContent className="py-6">

        //  {/* Add your itinerary details here */
/*
          <p>
            Destination: {itinerary.destination}
          </p>

          <p>
            Start Date: {itinerary.startDate}
          </p>

          <p>
            End Date: {itinerary.endDate}
          </p>

        </CardContent>

      </Card>

    </div>
  )
}

export default ItineraryDetail
```
*/