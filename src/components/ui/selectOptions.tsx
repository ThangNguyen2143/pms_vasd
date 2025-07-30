"use client";
import Cookies from "js-cookie";
import Select, { MultiValue, SingleValue } from "react-select";
import { OptionType } from "~/lib/types";

interface SelectInputProps {
  options: OptionType[];
  singleValue?: string;
  setValue: (value: string | string[]) => void;
  placeholder?: string;
  classNames?: string;
  isMulti?: boolean;
}

function SelectInput({
  options,
  //   singleValue,
  setValue,
  placeholder,
  classNames = "",
  isMulti = false,
}: SelectInputProps) {
  const isDark = Cookies.get("theme") == "night";
  const handleChangeSingle = (selected: SingleValue<OptionType>) => {
    if (selected) {
      setValue(selected.value);
    } else setValue("");
  };
  const handleChangeMulti = (selected: MultiValue<OptionType>) => {
    if (selected) {
      setValue(selected.map((v) => v.value));
    } else {
      setValue([]);
    }
  };
  return (
    <Select
      className={`w-full ${classNames}`}
      styles={{
        control: (styles) => ({
          ...styles,
          backgroundColor: isDark ? "#0f172a" : "white",
          color: isDark ? "#f1f5f9" : "#111827", // slate-100 | slate-900
          borderColor: isDark ? "#334155" : "#d1d5db", // slate-700 | gray-300
          boxShadow: "none",
          ":hover": {
            borderColor: isDark ? "#94a3b8" : "#6b7280", // slate-400 | gray-500
          },
        }),
        singleValue: (styles) => ({
          ...styles,
          color: isDark ? "#f1f5f9" : "#111827",
        }),
        placeholder: (styles) => ({
          ...styles,
          color: isDark ? "#9ca3af" : "#6b7280", // gray-400 | gray-500
        }),
        option: (styles, { isFocused, isSelected }) => {
          let backgroundColor = isDark ? "#1e293b" : "#ffffff";
          let color = isDark ? "#f1f5f9" : "#111827";

          if (isSelected) {
            backgroundColor = isDark ? "#2563eb" : "#3b82f6"; // blue-600 | blue-500
            color = "#ffffff";
          } else if (isFocused) {
            backgroundColor = isDark ? "#334155" : "#e5e7eb"; // slate-700 | gray-200
          }

          return {
            ...styles,
            backgroundColor,
            color,
            cursor: "pointer",
          };
        },
        menuList: (styles) => ({
          ...styles,
          maxHeight: "200px", // 👈 Chiều cao tối đa của menu
          overflowY: "auto", // 👈 Hiển thị scroll khi vượt giới hạn
        }),
      }}
      placeholder={placeholder}
      // value={options.find((opt) => opt.value === singleValue) || null}
      onChange={(selected) =>
        isMulti
          ? handleChangeMulti(selected as MultiValue<OptionType>)
          : handleChangeSingle(selected as SingleValue<OptionType>)
      }
      options={options}
      isClearable
      isMulti={isMulti}
    />
  );
}

export default SelectInput;
