import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "../features/users/usersApiSlice";
import EditUserP from "../pages/EditUser";
import EditUserForm from "./Form/EditUserForm";

const EditUser = () => {
  const { id } = useParams();
  const { user } = useGetUsersQuery("users", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });
  //console.log(user);
  const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>;
  return content;
};
export default EditUser;
