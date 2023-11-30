import { useSelector } from "react-redux";

const AdminComponent = (props) => {
  const user = useSelector((state) => state.authToken.admin);

  return user && props.children;
};

export default AdminComponent;
