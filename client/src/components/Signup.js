import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "../features/users/usersApiSlice";
import { useNavigate } from "react-router-dom";
import FormAction from "./Form/FormAction";
import Input from "./Form/Input";

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,20}$/;

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
      alert("User Succesfully Created. You will be redirected to login page.");
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
      const result = await addNewUser({
        username,
        email,
        password,
        role: "Team admin",
      });
    } else {
      if (!validPassword && !validUsername) {
        setUsername("");
        setEmail("");
        setPassword("");
        setRepassword("");
        alert("You have entered non-valid fields. Try again!");
      }
      if (!validUsername) {
        setUsername("");
        alert("This username is not valid!");
      }
      if (!validPassword) {
        setPassword("");
        setRepassword("");
        alert("password is not valid!");
      }
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
        <Input
          key="password"
          handleChange={onPasswordChanged}
          value={password}
          labelText="Password"
          labelFor="password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          isRequired="true"
          placeholder="Password"
        />
        <Input
          key="confirm-password"
          handleChange={onRepasswordChanged}
          value={repassword}
          labelText="Confirm Password"
          labelFor="canfirm-password"
          id="confirm-password"
          name="confirm-password"
          type="password"
          autoComplete="confirm-password"
          isRequired="true"
          placeholder="Confirm Password"
        />

        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
  );
}
