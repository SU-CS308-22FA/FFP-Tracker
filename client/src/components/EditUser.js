import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "../features/users/usersApiSlice";
import { useNavigate } from "react-router-dom";
import FormAction from "./Form/FormAction";
import Input from "./Form/Input";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

export default function Signup() {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState("");
  // const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  // const [role, setRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      // setRole("");
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onRepasswordChanged = (e) => setRepassword(e.target.value);

  const canSave = [validUsername, validPassword].every(Boolean) && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, email, password, role: "Team admin" });
    } else {
      // TODO: Check the reasons and render accordingly
    }
  };

  // Add the input for roles and
  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        <Input
          key="username"
          handleChange={onUsernameChanged}
          value={username}
          labelText="Username"
          labelFor="username"
          id="username"
          name="username"
          type="text"
          isRequired="true"
          placeholder="Username"
        />
        <Input
          key="email-adress"
          handleChange={onEmailChanged}
          value={email}
          labelText="Email Adress"
          labelFor="email-adress"
          id="email-adress"
          name="email"
          type="email"
          isRequired="true"
          placeholder="Email address"
        />

        <FormAction handleSubmit={handleSubmit} text="Save" />
        <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 mt-10">
          {"Delete"}
        </button>
      </div>
    </form>
  );
}
