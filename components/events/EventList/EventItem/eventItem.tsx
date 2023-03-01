import eventsClasses from "./eventItem.module.css";
import classes from "../../../../pages/index.module.css";
import { useEffect } from "react";

type RecievedProps = {
  eventId: String;
  title: String;
  userId: String;
  creatorId: String;
  price: number;
  date: string;
  onDetail: () => void;
};

const EventItem: React.FC<RecievedProps> = (props) => {
  return (
    <li className={eventsClasses.events__listItem}>
      <div>
        <h1>{props.title}</h1>
        <h2>
          ${props.price} - {new Date(props.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {props.userId === props.creatorId ? (
          <p>You're the owner of this event</p>
        ) : (
          <button
            className={classes.btn}
            onClick={props.onDetail.bind(this, props.eventId)}
          >
            View Detail
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
