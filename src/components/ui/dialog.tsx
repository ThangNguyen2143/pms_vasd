"use client";

import React from "react";

interface DialogProp {
  nameBtn: string;
  typeBtn: string;
  title: string;
  id?: string;
  sizeBtn?: string;
  pathIconStart?: string;
  pathIconEnd?: string;
  children: React.ReactNode;
}

function Dialog(prop: DialogProp) {
  var classBtnAtr =
    "btn btn-" +
    prop.typeBtn.trim() +
    (prop.sizeBtn ? " btn-" + prop.sizeBtn?.trim() : "");
  return (
    <div>
      {/* The button to open modal */}
      <label
        htmlFor={prop.id != null ? prop.id : prop.title}
        className={classBtnAtr}
      >
        {prop.pathIconStart != null && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 8 8"
          >
            <path fill="currentColor" d={prop.pathIconStart}></path>
          </svg>
        )}
        {prop.nameBtn}
        {prop.pathIconEnd != null && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 8 8"
          >
            <path fill="currentColor" d={prop.pathIconEnd}></path>
          </svg>
        )}
      </label>

      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id={prop.id != null ? prop.id : prop.title}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="mb-2 text-lg font-bold">{prop.title}</h3>
          {prop.children}
        </div>
        <label
          className="modal-backdrop"
          htmlFor={prop.id != null ? prop.id : prop.title}
        >
          Close
        </label>
      </div>
    </div>
  );
}

export default Dialog;
