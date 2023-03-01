import Backdrop from "@/components/backdrop/backfrop";
import EventList from "@/components/events/EventList/eventList";
import Modal from "@/components/Modal/modal";
import { AuthContextType } from "@/context/auth";
import { AuthContext } from "@/context/auth-context";
import axios from "axios";
import { useRouter } from "next/router";
import { Event } from "../../components/types/types";
import React, { useContext, useEffect, useState } from "react";
import classes from "../index.module.css";
import eventsClasses from "./events.module.css";
import Spinner from "@/components/spinner/spinner";

const Events: React.FC = (props) => {
  const [event, setEvent] = useState<boolean>(false);
  const [events, setEvents] = useState<Event[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const titleEl = React.createRef<HTMLInputElement>();
  const priceEl = React.createRef<HTMLInputElement>();
  const dateEl = React.createRef<HTMLInputElement>();
  const descriptionEl = React.createRef<HTMLTextAreaElement>();
  const auth = useContext(AuthContext) as AuthContextType;
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const onCancelHandler = () => {
    setEvent(false);
    setSelectedEvent(null);
  };

  const oncConfirmHandler = () => {
    setEvent(false);
    const title = titleEl.current?.value;
    const price = priceEl.current?.value;
    const date = dateEl.current?.value;
    const description = descriptionEl.current?.value;

    if (
      title?.trim().length === 0 ||
      price?.trim().length === 0 ||
      date?.trim().length === 0 ||
      description?.trim().length === 0
    ) {
      return;
    }
    const event = {
      title,
      price: price !== undefined ? +price : null,
      date,
      description,
    };

    axios
      .post(
        "https://easy-event.onrender.com/graphql",
        {
          query: `
        mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}){
            _id
            title
            description
            date
            price
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
        fetchEvents();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const fetchEvents = () => {
    setIsLoading(true);
    axios
      .post("https://easy-event.onrender.com/graphql", {
        query: `
        query {
            events{
            _id
            title
            description
            date
            price
            creator{
              _id
              email
            }
          }
        }
      `,
      })
      .then((response) => {
        const revents = response.data.data;
        setEvents(revents.events);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
      });
  };

  const showDetailHandler = (eventId: string): void => {
    const selEvent = events.find((e) => e._id === eventId);
    selEvent ? setSelectedEvent(selEvent) : setSelectedEvent(null);
  };

  const bookEventHandler = () => {
    if (!auth.data.token) {
      setSelectedEvent(null);
      return;
    }
    axios
      .post(
        "https://easy-event.onrender.com/graphql",
        {
          query: `
        mutation {
            bookEvent(eventId: "${selectedEvent?._id}"){
            _id
            createdAt
            updatedAt
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
        console.log(response.data);
        setSelectedEvent(null);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <React.Fragment>
      {event || (selectedEvent && <Backdrop />)}
      {event && (
        <Modal
          confirmText="Confirm"
          title="Add Event"
          canCancel
          canConfirm
          onCancel={onCancelHandler}
          onConfirm={oncConfirmHandler}
        >
          <form>
            <div className={classes.form_control}>
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleEl}></input>
            </div>
            <div className={classes.form_control}>
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceEl}></input>
            </div>
            <div className={classes.form_control}>
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateEl}></input>
            </div>
            <div className={classes.form_control}>
              <label htmlFor="description">Description</label>
              <textarea rows={4} id="description" ref={descriptionEl} />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          confirmText={auth.data.token ? "Book" : "Confirm"}
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={onCancelHandler}
          onConfirm={bookEventHandler}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{" "}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      <div className={eventsClasses.events}>
        <p>Share your own Events!</p>
        {auth.data.token ? (
          <button className={classes.btn} onClick={() => setEvent(!event)}>
            Create Event
          </button>
        ) : (
          <button className={classes.btn} onClick={() => router.push("/auth")}>
            Login
          </button>
        )}
      </div>
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          P_events={events}
          authUserId={auth.data.userId}
          onViewDetail={() => showDetailHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Events;
