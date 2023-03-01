import EventItem from "./EventItem/eventItem";
import eventsClasses from "./eventList.module.css";
import { Event } from "../../types/types";
import { useEffect } from "react";

type Events = {
  P_events: Event[];
  authUserId: String;
  onViewDetail: () => void;
};
const EventList: React.FC<Events> = (props) => {
  const events = props.P_events;
  return (
    <ul className={eventsClasses.events__list}>
      {events?.map((ev: Event) => {
        return (
          <EventItem
            eventId={ev._id}
            title={ev.title}
            userId={props.authUserId}
            creatorId={ev.creator?._id}
            price={ev.price}
            date={ev.date}
            onDetail={props.onViewDetail}
          />
        );
      })}
    </ul>
  );
};

export default EventList;
