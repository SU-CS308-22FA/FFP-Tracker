import { useState, useEffect } from "react";
import { signupFields } from "../constants/formFields";
import { useAddNewUserMutation } from "../features/users/usersApiSlice";
import { useNavigate } from "react-router-dom";
import FormAction from "./Form/FormAction";
import Input from "./Form/Input";

const fields = signupFields;
let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Signup() {
  const [signupState, setSignupState] = useState(fieldsState);
  const navigate = useNavigate();
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const handleChange = (e) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAccount();
  };

  const createAccount = async (e) => {
    const varList = [];
    fields.map((field) => {
      varList.push(signupState[field.id]);
    });
    var [username, email, password, repassword] = varList;
    if (password !== repassword) {
      // handle This part
    } else {
      console.log("Here");
      await addNewUser({ username, email, password, role: "Efecik" });
      if (isSuccess) {
        fields.forEach((field) => (fieldsState[field.id] = ""));
        navigate("/login");
      }
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={signupState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
  );
}
