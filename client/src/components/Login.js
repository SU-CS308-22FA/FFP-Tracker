import FormAction from "./Form/FormAction";
import FormExtra from "./Form/FormExtra";
import Input from "./Form/Input";
import { useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/auth/authApiSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { message, id, isLoggedIn } = await login({
        email,
        password,
      }).unwrap();
      if (isLoggedIn) {
        // TODO: send the user to their user page
        setEmail("");
        setPassword("");
        alert("Successful Login. You will be directed to your user page!");
        navigate(`/users/${id}`);
      }
    } catch (err) {
      setEmail("");
      setPassword("");
      alert("Error!");
    }
  };

  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);

  if (isLoading) return <p>Loading...</p>;

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        <Input
          key="email-adress"
          handleChange={onEmailChanged}
          value={email}
          labelText="Email Adress"
          labelFor="email-adress"
          id="email-adress"
          name="email"
          type="email"
          required
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
          required
          placeholder="Password"
        />
      </div>
      <FormExtra />
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
}
