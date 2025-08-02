import { supabase, Client, Task, Report } from './supabaseClient';

// ========== CLIENTS OPERATIONS ==========

export const fetchClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  
  return data || [];
};

export const createClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating client:', error);
    return null;
  }
  
  return data;
};

export const updateClient = async (id: number, updates: Partial<Client>): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating client:', error);
    return null;
  }
  
  return data;
};

export const deleteClient = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting client:', error);
    return false;
  }
  
  return true;
};

// ========== TASKS OPERATIONS ==========

export const fetchTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  
  return data || [];
};

export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating task:', error);
    return null;
  }
  
  return data;
};

export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task | null> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating task:', error);
    return null;
  }
  
  return data;
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting task:', error);
    return false;
  }
  
  return true;
};

// ========== REPORTS OPERATIONS ==========

export const fetchReports = async (): Promise<Report[]> => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('generated_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
  
  return data || [];
};

export const createReport = async (report: Omit<Report, 'id' | 'generated_at'>): Promise<Report | null> => {
  const { data, error } = await supabase
    .from('reports')
    .insert([report])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating report:', error);
    return null;
  }
  
  return data;
};

// ========== REAL-TIME SUBSCRIPTIONS ==========

export const subscribeToClients = (callback: (payload: any) => void) => {
  return supabase
    .channel('clients-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'clients' }, 
      callback
    )
    .subscribe();
};

export const subscribeToTasks = (callback: (payload: any) => void) => {
  return supabase
    .channel('tasks-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'tasks' }, 
      callback
    )
    .subscribe();
};