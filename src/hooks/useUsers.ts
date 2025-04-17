import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, SortOrder } from '../types';
import { UseUsersReturnType } from '../types';

const useUsers = (): UseUsersReturnType => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const usersPerPage = 5;

  const sortUsers = (users: User[], order: SortOrder): User[] => {
    return [...users].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return order === 'asc' 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  };

  const fetchUsers = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
      const sortedUsers = sortUsers(response.data, sortOrder);

      setAllUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setAllUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSortOrder = (): void => {
    const newOrder: SortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    setFilteredUsers(prev => sortUsers(prev, newOrder));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = allUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(sortUsers(filtered, sortOrder));
    setCurrentPage(1);
  }, [searchTerm, allUsers, sortOrder]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return {
    state: {
      currentUsers,
      loading,
      error,
      searchTerm,
      sortOrder,
      currentPage,
      totalPages: Math.ceil(filteredUsers.length / usersPerPage)
    },
    actions: {
      setSearchTerm,
      setCurrentPage,
      fetchUsers,
      toggleSortOrder
    }
  };
};

export default useUsers;