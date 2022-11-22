import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "../features/users/usersApiSlice";
import EditUserForm from "./Form/EditUserForm";

const EditUser = () => {
  const { id } = useParams();
  const { user } = useGetUsersQuery("users", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });
  const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>;
  return content;
};
export default EditUser;
