export interface User {
  id: number;
  name: string;
  email: string;
}

export type SortOrder = 'asc' | 'desc';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export interface UserCardProps {
  user: User;
}

export interface UseUsersReturnType {
  state: {
    currentUsers: User[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    sortOrder: SortOrder;
    currentPage: number;
    totalPages: number;
  };
  actions: {
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    setCurrentPage: (page: number) => void;
    fetchUsers: () => Promise<void>;
    toggleSortOrder: () => void;
  };
}