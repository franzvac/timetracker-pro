// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database operations
export const supabaseOperations = {
  // CLIENTS
  async getClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createClient(client) {
    const { data, error } = await supabase
      .from('clients')
      .insert([client])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateClient(id, updates) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteClient(id) {
    // Prima elimina tutti i task associati
    await supabase.from('tasks').delete().eq('client_id', id)
    
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // TASKS
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        clients (
          name,
          color
        )
      `)
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createTask(task) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateTask(id, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // REPORTS
  async saveReport(report) {
    const { data, error } = await supabase
      .from('reports')
      .insert([report])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getReports() {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        clients (
          name
        )
      `)
      .order('generated_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // ANALYTICS
  async getMonthlyHours(clientId, month, year) {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0]
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('tasks')
      .select('hours')
      .eq('client_id', clientId)
      .gte('date', startDate)
      .lte('date', endDate)
    
    if (error) throw error
    return data.reduce((sum, task) => sum + task.hours, 0)
  }
}