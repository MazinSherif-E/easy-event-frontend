import Spinner from "@/components/spinner/spinner";
import { Booking } from "@/components/types/types";
import { AuthContextType } from "@/context/auth";
import { AuthContext } from "@/context/auth-context";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Bclasses from "./bookings.module.css";
import classes from "../index.module.css";

const Bookings: React.FC = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [bookings, setBookings] = useState<Booking[] | undefined>([]);
  const auth = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = () => {
    setIsLoading(true);
    axios
      .post(
        "https://easy-event.onrender.com/graphql",
        {
          query: `
        query {
            bookings{
            _id
            createdAt
            event{
                _id
                title
                date
            }
          }
        }
      `,
        },
        {
          headers: {
            Authorization: "Bearer " + auth.data.token,
          },
        }
      )
      .then((response) => {
        const rbookings = response.data.data.bookings;
        setBookings([...rbookings]);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
      });
  };

  const deleteHandler = (bookingId: String) => {
    setIsLoading(true);
    axios
      .post(
        "https://easy-event.onrender.com/graphql",
        {
          query: `
        mutation {
            cancelBooking(bookingId:"${bookingId}"){
            _id
           title
          }
        }
      `,
        },
        {
          headers: {
            Authorization: "Bearer " + auth.data.token,
          },
        }
      )
      .then((response) => {
        const updateBooking = bookings?.filter((booking) => {
          return booking._id !== bookingId;
        });
        updateBooking ? setBookings([...updateBooking]) : null;
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <React.Fragment>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul className={Bclasses.bookings}>
          {bookings?.map((booking) => (
            <li className={Bclasses.bookings__item}>
              <div className={Bclasses.bookings__itemData}>
                {booking.event.title} -{" "}
                {new Date(booking.createdAt).toLocaleDateString()}
              </div>
              <div className={Bclasses.bookings__itemActions}>
                <button
                  className={classes.btn}
                  onClick={deleteHandler.bind(this, booking._id)}
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </React.Fragment>
  );
};

export default Bookings;
