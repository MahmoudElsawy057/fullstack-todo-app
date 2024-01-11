import toast, { Toaster } from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { LOGIN_FORM } from "../data";
import InputErrorMessage from "../components/InputErrorMsg";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationLoginSchema } from "../validation";
import axiosInstance from "../config/axios.config";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ resolver: yupResolver(validationLoginSchema) });

  // Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("auth/local", data);
      console.log(res);
      if (res.status === 200) {
        toast.success("logged in successfully ", {
          position: "bottom-center",
          duration: 4000,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        });
      }
      location.replace("/");
      localStorage.setItem("loggedinUser", JSON.stringify(res.data));
      console.log(res.data);
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Renders

  const renderLoginForm = LOGIN_FORM.map(
    ({ name, type, placeholder, validation }, idx) => (
      <div key={idx}>
        <Input
          type={type}
          placeholder={placeholder}
          {...register(name, validation)}
        />
        {errors[name] && <InputErrorMessage msg={errors[name]?.message} />}
      </div>
    )
  );

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginForm}

        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>
      </form>
      <Toaster />
    </div>
  );
};

export default LoginPage;
