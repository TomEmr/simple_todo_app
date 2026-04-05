import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box } from '@mui/material';
import TopBar from '../layout/TopBar';
import ActionBar from './ActionBar';
import FilterTabs from './FilterTabs';
import TaskList from './TaskList';
import EmptyState from './EmptyState';
import CreateTaskModal from '../modals/CreateTaskModal';
import { useGetTasksQuery } from '../../api/todoApi';
import { useGetCategoriesQuery } from '../../api/categoryApi';
import type { FilterKey } from '../../types';

interface OutletContextType {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

export default function TasksPage() {
  const { selectedFilter } = useOutletContext<OutletContextType>();
  const [statusFilter, setStatusFilter] = useState<FilterKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Build query params based on sidebar filter
  const queryParams = useMemo(() => {
    const params: { status?: string; categoryId?: number; dueDate?: string } = {};

    if (selectedFilter === 'today') {
      params.dueDate = new Date().toISOString().split('T')[0];
    } else if (selectedFilter !== 'all') {
      const catId = parseInt(selectedFilter, 10);
      if (!isNaN(catId)) {
        params.categoryId = catId;
      }
    }

    if (statusFilter === 'active') {
      params.status = 'active';
    } else if (statusFilter === 'completed') {
      params.status = 'completed';
    }

    return params;
  }, [selectedFilter, statusFilter]);

  const { data: tasks = [], isLoading } = useGetTasksQuery(
    Object.keys(queryParams).length > 0 ? queryParams : undefined
  );
  const { data: categories = [] } = useGetCategoriesQuery();

  // Derive title from selected filter
  const title = useMemo(() => {
    if (selectedFilter === 'all') return 'All Tasks';
    if (selectedFilter === 'today') return 'Today';
    const cat = categories.find((c) => String(c.id) === selectedFilter);
    return cat?.name || 'Tasks';
  }, [selectedFilter, categories]);

  const allCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const hasNoTasks = !isLoading && tasks.length === 0 && !searchQuery;

  return (
    <>
      <TopBar title={title} subtitle={`${allCount} tasks`} />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <ActionBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddTask={() => setCreateModalOpen(true)}
        />

        <FilterTabs
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          allCount={allCount}
          activeCount={activeCount}
          completedCount={completedCount}
        />

        {hasNoTasks ? (
          <EmptyState onAddTask={() => setCreateModalOpen(true)} />
        ) : (
          <TaskList tasks={tasks} searchQuery={searchQuery} />
        )}
      </Box>

      <CreateTaskModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
}
