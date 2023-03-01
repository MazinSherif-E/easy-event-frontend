import React from "react";
import modalClasses from "./modal.module.css";
import classes from "../../pages/index.module.css";
import { PropsWithChildren } from "react";

// type ReactNode =

type recievedProps = {
  title: String;
  canCancel: boolean;
  canConfirm: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string
};

const Modal: React.FC<PropsWithChildren<recievedProps>> = (props) => {
  return (
    <div className={modalClasses.modal}>
      <header className={modalClasses.modal__header}>
        <h1>{props.title}</h1>
      </header>
      <section className={modalClasses.modal__content}>
        {props.children}
      </section>
      <section className={modalClasses.modal__actions}>
        {props.canCancel && (
          <button className={classes.btn} onClick={props.onCancel}>
            Cancel
          </button>
        )}
        {props.canCancel && (
          <button className={classes.btn} onClick={props.onConfirm}>
            {props.confirmText}
          </button>
        )}
      </section>
    </div>
  );
};
export default Modal;
