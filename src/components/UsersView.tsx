import UserCard from "./UserCard";
import Pagination from "./Pagination";
import { UseUsersReturnType } from "../types";

const UsersView = ({
  state: {
    currentUsers,
    loading,
    error,
    searchTerm,
    sortOrder,
    currentPage,
    totalPages,
  },
  actions: { setSearchTerm, setCurrentPage, fetchUsers, toggleSortOrder },
}: UseUsersReturnType) => {
  return (
    <div className="users-container">
      <div className="header-container">
        <h1>Lista de Usuários</h1>
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
      </div>

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
            {currentUsers.length} usuário(s) encontrado(s)
          </span>
        )}
      </div>

      {error && <div className="error">{`Erro: ${error}`}</div>}

      <div className="users-list">
        {currentUsers.length > 0
          ? currentUsers.map((user) => <UserCard key={user.id} user={user} />)
          : !loading && (
              <div className="no-results">Nenhum usuário encontrado</div>
            )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          loading={loading}
        />
      )}
    </div>
  );
};

export default UsersView;
