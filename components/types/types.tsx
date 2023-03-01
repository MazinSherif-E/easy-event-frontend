type creator = {
  _id: String;
  email: String;
};

export type Event = {
  creator: creator;
  date: string;
  description: String;
  price: number;
  title: String;
  _id: String;
};

type BookingEvent = {
  title: String;
  _id: String;
  date: string;
}

export type Booking = {
  _id: String;
  createdAt: string
  event: BookingEvent
}

// export default Event;