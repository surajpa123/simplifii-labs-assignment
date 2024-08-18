import React, { useState, useEffect } from "react";
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
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpLimit, setOtpLimit] = useState(0);
  const navigate = useNavigate();

  const maxOtpAttempts = 3;
  const maxOtpResends = 3;

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const existingUser = JSON.parse(localStorage?.getItem("userInfo"));
    if (existingUser) {
      if (
        existingUser.email === formData.email ||
        existingUser.mobileNumber === formData.mobileNumber
      ) {
        toast.warning(
          "User is already registered with this email or mobile number.",
          {
            position: "bottom-left",
            theme: "colored",
            style: {
              backgroundColor: "rgb(236,147,36)",
            },
          }
        );
        return;
      }
    }

    if (otpLimit >= maxOtpResends) {
      toast.error("OTP resend limit exceeded.", { position: "bottom-left" });
      return;
    }
    toast.success("OTP sent to your email!", { position: "bottom-left" });

    setOtpSent(true);
    setTimer(60);

    setOtpLimit((prev) => prev + 1);
  };

  const handleOtpVerification = () => {
    const correctOtp = "123456";

    if (formData.otp === correctOtp) {
      const userData = {
        title: formData.title,
        name: formData.name,
        isd: formData.isd,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
      };

      localStorage.setItem("userInfo", JSON.stringify(userData));

      toast.success("OTP verified! Redirecting...", {
        position: "bottom-left",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      setOtpAttempts((prev) => prev + 1);

      if (otpAttempts + 1 >= maxOtpAttempts) {
        toast.error("Max OTP attempts exceeded. Please request a new OTP.", {
          position: "bottom-left",
        });
        setOtpSent(false);
        setOtpAttempts(0);
        setFormData({ ...formData, otp: "" });
      } else {
        toast.error("Incorrect OTP. Please try again.", {
          position: "bottom-left",
        });
      }
    }
  };


  console.log(formData,'formData')
  
    


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
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link to={"/login"}>  
                  <p className="text-blue-500 hover:underline">
                    Sign In
                  </p>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
