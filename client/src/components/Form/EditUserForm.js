import { useState, useEffect } from "react";
import {
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../../features/users/usersApiSlice";
import { redirect, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan,faSign,faSignOut } from "@fortawesome/free-solid-svg-icons";
import Header from "../Header";
import Input from "../Form/Input";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [role, setRole] = useState(user.role)
  // const [active, setActive] = useState(user.active)

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      alert("Saved Successfully.");
      if (!password.length) {
        window.location.reload();
      } else {
        navigate('/login');
      }
    } else if (isDelSuccess) {
      alert("User Deleted. You will be directed to the sign up page.");
      navigate("/signup");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onRoleChanged = (e) => setRole(e.target.value);

  const onSaveUserClicked = async (e) => {
    console.log('Here1')
    if (password) {
      console.log('Here2')
      await updateUser({ id: user.id, username, role, password });
    } else {
      console.log('Here3')
      await updateUser({ id: user.id, username, role});
    }
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  const onLogOutClicked = () => {
    //console.log("here");
    navigate('/login');
  };

  let canSave;
  if (password) {
    canSave = [validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [validUsername].every(Boolean) && !isLoading;
  }

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPwdClass =
    password && !validPassword ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
        <Header
        heading=" Edit User"
      />
          
        </div>
        <label
          className="font-medium text-purple-600 hover:text-purple-500"
          htmlFor="username"
        >
          Username:
        </label>
        <div></div>
        <input
          className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />
        <div className="m-5"></div>
        <label
          className="font-medium text-purple-600 hover:text-purple-500"
          htmlFor="username"
        >
          Role:
        </label>
        <div></div>
        <input
          className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={role}
          onChange={onRoleChanged}
        />
        <div className="m-5"></div>
        
        

        <label
          className="font-medium text-purple-600 hover:text-purple-500"
          htmlFor="password"
        >
          Password:
        </label>
        <div></div>
        <input
          className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
          id="password"
          name="password"
          type="password"
          autoComplete="off"
          value={password}
          onChange={onPasswordChanged}
        />
        <div className="flex flex-row mt-5">
          <button
            className="icon-button"
            title="Save"
            onClick={onSaveUserClicked}
          >
            <FontAwesomeIcon icon={faSave} />
          </button>
          <h2 className="mr-10 mt-3 font-extrabold">SAVE</h2>
          <button
            className="icon-button"
            title="Delete"
            onClick={onDeleteUserClicked}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
          <h2 className="ml-15 mt-3 font-extrabold">DELETE</h2>


        
          <button
            className="icon-button absolute top-10 right-10 mr-20"
            title="Delete"
            onClick={onLogOutClicked}
          >
            <FontAwesomeIcon icon={faSignOut} />
          </button>
          <h2 className="mt-3 font-extrabold absolute top-10 right-8 mr-2 ">LOG OUT</h2>
          </div>



        
      </form>
    </>
  );

  return content;
};
export default EditUserForm;
