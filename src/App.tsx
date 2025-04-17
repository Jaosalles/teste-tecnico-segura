import useUsers from "./hooks/useUsers";
import UsersView from "./components/UsersView";

function App() {
  const users = useUsers();

  return (
    <div className="App">
      <UsersView {...users} />
    </div>
  );
}

export default App;
