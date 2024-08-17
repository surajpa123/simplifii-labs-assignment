import React, { useState } from "react";
import { logo, sidePanel } from "../assets";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otpLogin, setOtpLogin] = useState(false);

  const [forgotPassword, setForgotPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
    setOtpLogin(false);
    setFormData({ email: "", password: "", otp: "" });
  };

  const handleBackToLogin = () => {
    setForgotPassword(false);
    setOtpLogin(false);
    setFormData({ email: "", password: "", otp: "" });
  };

  const validateForm = () => {
    let validationErrors = {};
    if (!formData.email) {
      validationErrors.email = "This field is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "Please enter a valid Email ID";
    }
    if (!otpLogin && !formData.password) {
      validationErrors.password = "This field is required";
    }
    return validationErrors;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!otpLogin) {
      if (
        userInfo &&
        userInfo.email === formData.email &&
        userInfo.password === formData.password
      ) {
        toast.success("Login successful!", { position: "bottom-left" });
        navigate("/dashboard");
      } else {
        toast.error("Invalid email or password", { position: "bottom-left" });
      }
    } else {
      if (userInfo && userInfo.email === formData.email) {
        toast.success("OTP sent to your email!", { position: "bottom-left" });
        setOtpSent(true);
      } else {
        toast.warning("User not found", {
          position: "bottom-left",
          theme: "colored",
          style: {
            backgroundColor: "rgb(236,147,36)",
          },
        });
      }
    }
  };

  const handleOtpVerification = () => {
    const correctOtp = "123456";
    if (formData.otp === correctOtp) {
      toast.success("OTP verified! Redirecting...", {
        position: "bottom-left",
      });
      navigate("/dashboard");
    } else {
      toast.error("Incorrect OTP. Please try again.", {
        position: "bottom-left",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleOtpLogin = () => {
    setOtpLogin(true);
    setOtpSent(false);
    setFormData({ ...formData, password: "", otp: "" });
  };

  const handlePasswordLogin = () => {
    setOtpLogin(false);
    setOtpSent(false);
    setFormData({ ...formData, otp: "" });
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

            {/* Forgot Password Mode */}

            {forgotPassword ? (
              <>
                <div className="flex items-center justify-start w-full mb-4">
                  <button onClick={handleBackToLogin}>
                    <FiArrowLeft size={24} />
                  </button>
                  <h2 className="text-xl font-semibold ml-2">
                    Forgot Password
                  </h2>
                </div>
                <p className="mb-4 text-center">
                  Enter your registered email address. We will email you a link
                  to reset your password.
                </p>
                <form
                  className="w-full max-w-2xl space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success("Reset link sent to your email!", {
                      position: "bottom-left",
                    });
                  }}
                >
                  <div className="relative">
                    <div className="absolute top-0.5 my-2.5 pl-2">
                      <MdOutlineEmail size={17} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="px-8 py-2 border border-gray-300 focus:outline-none w-full rounded-3xl p-4"
                      placeholder="Email/Username"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[rgb(236,147,36)] text-white py-2 rounded-3xl hover:bg-[rgb(236,147,36)] transition duration-300"
                  >
                    Reset
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-6">
                  Login to Dashboard
                </h2>

                <form
                  className="w-full max-w-2xl space-y-6"
                  onSubmit={handleLogin}
                >
                  <div className="relative">
                    <div className="absolute top-0.5 my-2.5 pl-2">
                      <MdOutlineEmail size={17} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="px-8 py-2 border border-gray-300 focus:outline-none w-full rounded-3xl p-4"
                      placeholder="Email/Username"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {!otpLogin && (
                    <div className="relative">
                      <div className="absolute top-0.5 my-2.5 pl-2">
                        <MdLockOutline size={17} />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        className="px-8 py-2 border border-gray-300 focus:outline-none w-full rounded-3xl p-4"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute top-0.5 end-0 p-3.5 rounded-e-md"
                      >
                        <svg
                          className="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            className={
                              !showPassword
                                ? "hs-password-active:hidden"
                                : "hs-password-active:block"
                            }
                            d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                          />
                          <circle
                            className={
                              !showPassword
                                ? "hs-password-active:hidden"
                                : "hs-password-active:block"
                            }
                            cx="12"
                            cy="12"
                            r="3"
                          />
                          <path
                            className={
                              !showPassword
                                ? "hidden hs-password-active:block"
                                : "hs-password-active:hidden"
                            }
                            d="M9.88 9.88a3 3 0 1 0 4.24 4.24"
                          />
                          <path
                            className={
                              !showPassword
                                ? "hidden hs-password-active:block"
                                : "hs-password-active:hidden"
                            }
                            d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                          />
                          <path
                            className={
                              !showPassword
                                ? "hidden hs-password-active:block"
                                : "hs-password-active:hidden"
                            }
                            d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                          />
                          <line
                            className={
                              !showPassword
                                ? "hidden hs-password-active:block"
                                : "hs-password-active:hidden"
                            }
                            x1="2"
                            x2="22"
                            y1="2"
                            y2="22"
                          />
                        </svg>
                      </button>
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password}
                        </p>
                      )}
                      <div className="flex justify-between mt-4 ml-auto">
                        <a
                          onClick={handleForgotPassword}
                          className="text-[rgb(236,147,36)] hover:text-[rgb(236,147,36)] transition duration-300 ml-auto cursor-pointer"
                        >
                          Forgot Password?
                        </a>
                      </div>
                    </div>
                  )}

                  {otpSent && otpLogin && (
                    <div className="relative">
                      <div className="absolute top-0.5 my-2.5 pl-2">
                        <MdPassword size={17} />
                      </div>

                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        value={formData.otp}
                        onChange={handleChange}
                        className="px-8 py-2 border border-gray-300 focus:outline-none w-full rounded-3xl p-4"
                        placeholder="Enter OTP"
                      />
                      {errors.otp && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.otp}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex justify-center items-center mt-6">
                    {!otpLogin ? (
                      <div className="w-full">
                        <button
                          type="submit"
                          className="w-full bg-[rgb(236,147,36)] text-white py-2 rounded-3xl transition duration-300"
                        >
                          Sign in
                        </button>
                        <p className="text-center pt-2">OR</p>
                      </div>
                    ) : otpSent ? (
                      <div className="w-full">
                        <button
                          type="button"
                          onClick={handleOtpVerification}
                          className="w-full bg-[rgb(236,147,36)] text-white py-2 rounded-3xl transition duration-300"
                        >
                          Verify OTP
                        </button>
                        <p className="text-center pt-2">OR</p>
                      </div>
                    ) : (
                      <div className="w-full">
                        <button
                          type="submit"
                          className="w-full bg-[rgb(236,147,36)] text-white py-2 rounded-3xl  transition duration-300"
                        >
                          Send OTP
                        </button>
                        <p className="text-center pt-2">OR</p>
                      </div>
                    )}
                  </div>
                </form>

                <div className="flex justify-between mt-4 w-full">
                  {!otpLogin ? (
                    <div className="w-full">
                      <button
                        onClick={handleOtpLogin}
                        className="w-full bg-[#F5F4F4] text-black py-2 rounded-3xl transition duration-300 shadow-md inset-4"
                      >
                        Login with OTP
                      </button>

                      <div className="text-center mt-4">
                        <p className="text-gray-600">
                          Do you have an account?{" "}

                          <Link to={"/register"}>

                          <p
                            
                            className="text-blue-500 hover:underline"
                          >
                            Register as an expert
                          </p>

</Link>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={handlePasswordLogin}
                        className="w-full bg-[#F5F4F4] text-black py-2 rounded-3xl transition duration-300 shadow-md inset-4"
                      >
                        Login with Password
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
