"use client";

import React from "react";

interface DialogProp {
  nameBtn: string;
  typeBtn: string;
  title: string;
  id?: string;
  sizeBtn?: string;
  sizeBox?: string;
  children: React.ReactNode;
}

function Dialog(prop: DialogProp) {
  const classBtnAtr =
    "btn btn-" +
    prop.typeBtn.trim() +
    (prop.sizeBtn ? " btn-" + prop.sizeBtn?.trim() : "");
  let sizeBox: string = "";
  if (prop.sizeBox) {
    switch (prop.sizeBox) {
      case "sm":
        sizeBox = "w-3/12";
        break;
      case "lg":
        sizeBox = "w-1/2 max-w-2xl";
        break;
      case "xl":
        sizeBox = "w-11/12 max-w-5xl";
        break;
      default:
        sizeBox = "";
    }
  }
  return (
    <div className="flex">
      {/* The button to open modal */}
      <label
        htmlFor={prop.id != null ? prop.id : prop.title}
        className={classBtnAtr}
      >
        {prop.nameBtn}
      </label>

      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id={prop.id != null ? prop.id : prop.title}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className={"modal-box " + sizeBox}>
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
