import { User } from "../types";

const UserCard = ({ user }: { user: User }) => {
  return (
    <div className="user-card">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserCard;
