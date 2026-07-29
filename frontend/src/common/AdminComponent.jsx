import useAuthStore from "../store/useAuthStore";

const AdminComponent = (props) => {
  const user = useAuthStore((state) => state.admin);

  return user && props.children;
};

export default AdminComponent;
