import FormAction from "./Form/FormAction";
import FormExtra from "./Form/FormExtra";
import Input from "./Form/Input";
import { useState } from "react";
import { loginFields } from "../constants/formFields";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/auth/authApiSlice";

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState);

  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authenticateUser();
  };

  //Handle Login API Integration here
  const authenticateUser = async (e) => {
    const varList = [];
    fields.map((field) => {
      varList.push(loginState[field.id]);
    });
    var [email, password] = varList;
    try {
      const { id, isLoggedIn } = await login({ email, password }).unwrap();
      if (isLoggedIn) {
        // TODO: send the user to their user page
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
      </div>

      <FormExtra />
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
}
