import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
}

const Users = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const usersPerPage = 5;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const sortedUsers = sortUsers(response.data, sortOrder);

      setAllUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
      setError(null);
    } catch (err) {
      setError(err.message);
      setAllUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para ordenar usuários
  const sortUsers = (users: User[], order: "asc" | "desc") => {
    return [...users].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (order === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  };

  // Alternar entre ordenação ascendente e descendente
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    setFilteredUsers((prevUsers) => sortUsers(prevUsers, newOrder));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtra e ordena usuários quando o termo de busca ou ordenação muda
  useEffect(() => {
    const filtered = allUsers.filter((user: User) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredUsers(sortUsers(filtered, sortOrder));
    setCurrentPage(1);
  }, [searchTerm, allUsers, sortOrder]);

  // Calcular usuários da página atual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Mudar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="users-container">
      <div className="header-container">
        <h1>Lista de Usuários</h1>
      </div>

      {/* Funcionalidades */}
      <div className="actions-container">
        <button
          onClick={toggleSortOrder}
          className="sort-button"
          disabled={loading}
        >
          Ordenar {sortOrder === "asc" ? "Z → A" : "A → Z"}
        </button>
        <button
          onClick={fetchUsers}
          className="reload-button"
          disabled={loading}
        >
          {loading ? "Carregando..." : "Recarregar"}
        </button>
      </div>

      {/* Campo de busca */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <span className="results-count">
            {filteredUsers.length} usuário(s) encontrado(s)
          </span>
        )}
      </div>

      {error && <div className="error">{`Erro: ${error}`}</div>}

      {/* Lista de usuários */}
      <div className="users-list">
        {currentUsers.length > 0
          ? currentUsers.map((user: User) => (
              <div key={user.id} className="user-card">
                <h2>{user.name}</h2>
                <p>Email: {user.email}</p>
              </div>
            ))
          : !loading && (
              <div className="no-results">Nenhum usuário encontrado</div>
            )}
      </div>

      {/* Paginação */}
      {filteredUsers.length > usersPerPage && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
          >
            Anterior
          </button>

          {Array.from(
            { length: Math.ceil(filteredUsers.length / usersPerPage) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
                disabled={loading}
              >
                {i + 1}
              </button>
            )
          )}

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredUsers.length / usersPerPage)
                )
              )
            }
            disabled={
              currentPage === Math.ceil(filteredUsers.length / usersPerPage) ||
              loading
            }
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default Users;
