import React, { useState, useEffect } from "react";
import axios from "axios";
import { logo, sidePanel } from "../assets";
import { InputField } from "./InputField/InputField";
import countriesData from "../assets/countries.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Register = () => {
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    title: "Mr.",
    name: "",
    isd: "+91",
    mobileNumber: "",
    email: "",
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpLimit, setOtpLimit] = useState(0);
  const navigate = useNavigate();
  const [pageError, setPageError] = useState({});

  const maxOtpAttempts = 5;
  const maxOtpResends = 5;

  useEffect(() => {
    let interval;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  useEffect(() => {
    const modified = countriesData.countries.map((ele) => {
      return {
        value: ele?.code,
        label: `${ele?.name} ${ele.code}`,
      };
    });
    setCountries(modified);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let validationErrors = {};

    if (!formData.title) validationErrors.title = "This field is required";

    if (!formData.name) {
      validationErrors.name = "This field is required";
    } else if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(formData.name.trim())) {
      validationErrors.name =
        "Please start with alphabet & remove extra spaces";
    }

    if (!formData.isd) validationErrors.isd = "This field is required";

    if (!formData.mobileNumber) {
      validationErrors.mobileNumber = "This field is required";
    } else if (formData.mobileNumber.startsWith("0")) {
      validationErrors.mobileNumber = "Mobile number cannot start with 0";
    } else if (/[^0-9]/.test(formData.mobileNumber)) {
      validationErrors.mobileNumber =
        "Mobile number cannot contain special characters";
    }

    if (!formData.email) {
      validationErrors.email = "This field is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "Please enter a valid Email ID";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (otpLimit >= maxOtpResends) {
      toast.error("OTP resend limit exceeded.", { position: "bottom-left" });
      return;
    }

    try {
      const response = await axios.post(
        "https://colo-dev.infollion.com/api/v1/self-registration/register",
        {
          email: formData.email,
          mobile: `${formData.isd} ${formData.mobileNumber}`,
          name: formData.name,
          salutation: formData.title,
        }
      );
      toast.success(response?.data?.message, { position: "bottom-left" });

      setOtpSent(true);
      setTimer(60);
      setOtpLimit((prev) => prev + 1);
    } catch (error) {
      // setPageError()
      if (
        error.response.data?.message ==
        "A user already exists with this mobile number."
      ) {
        setPageError({
          message: `An account already exists with this email ID : `,
        });
      }
      console.log(error.response.data);
      toast.error(error?.response?.data?.message, { position: "bottom-left" });
    }
  };

  const handleOtpVerification = async () => {
    let validationErrors = {};

    if (!formData.otp || formData.otp.length < 6) {
      validationErrors.otp = "Please enter 6 digit OTP";
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        "https://colo-dev.infollion.com/api/v1/self-registration/verify-otp",
        {
          action: "SelfRegister",
          email: formData.email,
          otp: formData.otp,
        }
      );

      // Handle successful OTP verification
      if (response.data.message === "OTP verification successfull!") {
        toast.success(`${response.data.message} Redirecting...`, {
          position: "bottom-left",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      setOtpAttempts((prev) => prev + 1);

      if (otpAttempts + 1 >= maxOtpAttempts) {
        toast.error("Max OTP attempts exceeded. Please request a new OTP.", {
          position: "bottom-left",
        });
        setOtpSent(false);
        setOtpAttempts(0);
        setFormData({ ...formData, otp: "" });
      } else {
        toast.error(error?.response?.data?.error, {
          position: "bottom-left",
        });
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div
        className="hidden md:flex w-[50%] bg-cover bg-center"
        style={{ backgroundImage: `url(${sidePanel})` }}
      ></div>

      <div className="flex flex-1 flex-col justify-center items-center p-6 md:w-[50%]">
        <div className="w-full max-w-lg">
          <div className="flex flex-col justify-start items-center min-h-screen p-4">
            <div className="h-28 w-28">
              <img src={logo} alt="Logo" />
            </div>
            <h2 className="text-2xl font-semibold mb-6">
              Register as an expert
            </h2>

            <form
              className="w-full max-w-2xl space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="flex space-x-4">
                <div className="w-1/3">
                  <InputField
                    type="select"
                    label="Mr/Mrs*"
                    name="title"
                    options={[
                      { value: "Mr.", label: "Mr." },
                      { value: "Mrs.", label: "Mrs." },
                      { value: "Miss.", label: "Miss." },
                      { value: "Dr.", label: "Dr." },
                      { value: "Ms.", label: "Ms." },
                      { value: "Prof.", label: "Prof." },
                    ]}
                    value={formData.title}
                    onChange={handleChange}
                    error={errors.title}
                    errorMessage={errors.title}
                    disabled={otpSent}
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    type="text"
                    label="Name*"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    errorMessage={errors.name}
                    disabled={otpSent}
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-1/3">
                  <InputField
                    type="select"
                    label="ISD*"
                    name="isd"
                    options={countries}
                    value={formData.isd}
                    onChange={handleChange}
                    error={errors.isd}
                    errorMessage={errors.isd}
                    disabled={otpSent}
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    type="number"
                    label="Mobile Number*"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    error={errors.mobileNumber}
                    errorMessage={errors.mobileNumber}
                    disabled={otpSent}
                  />
                </div>
              </div>
              <InputField
                type="text"
                label="Email ID*"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                errorMessage={errors.email}
                disabled={otpSent}
              />

              {otpSent && (
                <>
                  <InputField
                    type="text"
                    label="Enter OTP*"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    error={errors.otp}
                    errorMessage={errors.otp}
                    maxLength={6}
                  />
                  <div className="flex justify-end items-center mt-2">
                    {timer > 0 && (
                      <span>
                        Resend OTP in {timer} {timer > 1 ? "seconds" : "second"}
                      </span>
                    )}

                    {timer === 0 && otpLimit < maxOtpResends && (
                      <button
                        type="button"
                        className="text-blue-500 hover:underline"
                        onClick={handleSubmit}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </>
              )}

              {!otpSent ? (
                <button
                  type="submit"
                  className="w-full bg-[rgb(236,147,36)] text-white py-2 rounded-3xl mt-4 hover:bg-[rgb(236,147,40)]"
                >
                  Get OTP on email
                </button>
              ) : (
                <button
                  type="button"
                  className="w-full bg-[rgb(236,147,36)] text-white py-2 rounded-3xl mt-4 hover:bg-[rgb(236,147,40)]"
                  onClick={handleOtpVerification}
                >
                  Verify OTP
                </button>
              )}

              <div className="text-center mt-4">
                {pageError?.message ? (
                  <div className="border border-[#e2be92] rounded-lg p-4 shadow-md">
                    <p className="font-medium">
                      {pageError?.message}{" "}
                      <span className="font-normal"> {formData?.email} </span>
                    </p>

                    <p className="mt-3">
                      <Link to={"/login"} className="text-blue-600 font-medium">
                        Click here to Sign-In{" "}
                      </Link>{" "}
                      <span className="font-medium">
                        if this account belongs to you.
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link to={"/login"}>
                      <p className="text-blue-500 hover:underline">Sign In</p>
                    </Link>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
