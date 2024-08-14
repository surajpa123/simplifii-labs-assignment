import React, { useState, useEffect } from "react";

export const InputField = ({
  type = "text",
  label,
  name,
  options = [],
  error,
  errorMessage,
  value = "",
  ...props
}) => {
  const [hasValue, setHasValue] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Track focus state

  useEffect(() => {
    if (value) {
      setHasValue(true);
    }
  }, [value]);

  const handleSelectChange = (e) => {
    setHasValue(e.target.value !== "");
    props.onChange && props.onChange(e); // Keep existing onChange behavior
  };

  const handleFocus = () => {
    setIsFocused(true);
    setHasValue(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);

    setHasValue(e.target.value !== "");
  };

  return (
    <div className="w-full">
      <div className="relative w-full min-w-[120px] h-10">
        {type === "select" ? (
          <select
            id={name}
            className={`peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 border ${
              error ? "border-red-500" : "border-gray-300"
            } focus:border-2 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-[rgb(236,147,36)]`}
            name={name}
            onChange={handleSelectChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            {...props}
          >
            <option value="" disabled hidden>
              {label}
            </option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            className={`peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 border ${
              error ? "border-red-500 focus:border-red-500" : "border-gray-300"
            } focus:border-2 text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-[rgb(236,147,36)]`}
            type={type}
            name={name}
            // placeholder={label}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            {...props}
          />
        )}
        {label && (
          <label
            htmlFor={name}
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-all bg-white px-1 cursor-pointer
          ${hasValue ? "top-[-8px] text-[11px]" : ""}
          ${
            error
              ? "text-red-500"
              : isFocused
              ? "text-[rgb(236,147,36)]"
              : "text-gray-500"
          }`}
          >
            {label}
          </label>
        )}
      </div>
      {error && errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};
