import React, { useState, useEffect } from 'react';
import { Clock, Users, FileText, BarChart3, Download, AlertCircle, PlusCircle, Calendar, Edit, Trash2, X } from 'lucide-react';

const mockData = {
  clients: [
    { id: 1, name: 'Cliente A', contract: 650, hours_per_week: 16, color: '#f97316' },
    { id: 2, name: 'Cliente B', contract: 350, hours_per_week: 10, color: '#06b6d4' },
    { id: 3, name: 'Cliente C', contract: 450, hours_per_week: 12, color: '#8b5cf6' }
  ],
  tasks: [
    { id: 1, client_id: 1, title: 'Sviluppo frontend', hours: 4, date: '2025-01-15', description: 'Implementazione dashboard' },
    { id: 2, client_id: 1, title: 'Meeting progetto', hours: 1.5, date: '2025-01-16', description: 'Revisione requisiti' },
    { id: 3, client_id: 2, title: 'Analisi database', hours: 3, date: '2025-01-17', description: 'Ottimizzazione query' },
    { id: 4, client_id: 2, title: 'Documentazione API', hours: 2.5, date: '2025-01-18', description: 'Creazione docs' },
    { id: 5, client_id: 3, title: 'Setup ambiente', hours: 5, date: '2025-01-19', description: 'Config server' }
  ],
  reports: []
};

const TimeTrackingApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState(mockData.clients);
  const [tasks, setTasks] = useState(mockData.tasks);
  const [reports, setReports] = useState<any[]>(mockData.reports);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const [showClientForm, setShowClientForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showReportsHistory, setShowReportsHistory] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [editingTask, setEditingTask] = useState<any>(null);

  // Form states
  const [clientForm, setClientForm] = useState({ name: '', contract: '', hours_per_week: '', color: '#f97316' });
  const [taskForm, setTaskForm] = useState({ client_id: '', title: '', hours: '', date: '', description: '' });

  // Calcola ore mensili per cliente
  const getMonthlyHours = (clientId: number, month = new Date().getMonth(), year = new Date().getFullYear()) => {
    return tasks
      .filter(task => {
        const taskDate = new Date(task.date);
        return task.client_id === clientId && 
               taskDate.getMonth() === month && 
               taskDate.getFullYear() === year;
      })
      .reduce((sum, task) => sum + task.hours, 0);
  };

  // Calcola ore settimanali target mensili
  const getMonthlyTarget = (hoursPerWeek: number) => {
    const now = new Date();
    const weeksInMonth = Math.ceil(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() / 7);
    return hoursPerWeek * weeksInMonth;
  };

  // Controlla notifiche
  useEffect(() => {
    const checkNotifications = () => {
      const newNotifications: any[] = [];
      clients.forEach(client => {
        const monthlyHours = getMonthlyHours(client.id);
        const target = getMonthlyTarget(client.hours_per_week);
        const percentage = (monthlyHours / target) * 100;
        
        if (percentage > 90) {
          newNotifications.push({
            id: Date.now() + client.id,
            type: 'warning',
            message: `${client.name}: Vicino al limite ore mensili (${monthlyHours.toFixed(1)}/${target} ore)`
          });
        }
      });
      setNotifications(newNotifications);
    };
    
    checkNotifications();
  }, [tasks, clients]);

  // Gestione form clienti
  const handleClientSubmit = () => {
    if (!clientForm.name || !clientForm.contract || !clientForm.hours_per_week) return;
    
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? { ...editingClient, ...clientForm, contract: parseFloat(clientForm.contract), hours_per_week: parseFloat(clientForm.hours_per_week) } : c));
      setEditingClient(null);
    } else {
      const newClient = { 
        id: Date.now(), 
        ...clientForm, 
        contract: parseFloat(clientForm.contract),
        hours_per_week: parseFloat(clientForm.hours_per_week)
      };
      setClients([...clients, newClient]);
    }
    
    setClientForm({ name: '', contract: '', hours_per_week: '', color: '#f97316' });
    setShowClientForm(false);
  };

  // Gestione form task
  const handleTaskSubmit = () => {
    if (!taskForm.client_id || !taskForm.title || !taskForm.hours || !taskForm.date) return;
    
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...taskForm, hours: parseFloat(taskForm.hours), client_id: parseInt(taskForm.client_id) } : t));
      setEditingTask(null);
    } else {
      const newTask = { 
        id: Date.now(), 
        ...taskForm, 
        client_id: parseInt(taskForm.client_id),
        hours: parseFloat(taskForm.hours)
      };
      setTasks([...tasks, newTask]);
    }
    
    setTaskForm({ client_id: '', title: '', hours: '', date: '', description: '' });
    setShowTaskForm(false);
  };

  // Elimina cliente
  const deleteClient = (clientId: number) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo cliente? Verranno eliminate anche tutte le sue attività.')) return;
    setClients(clients.filter(c => c.id !== clientId));
    setTasks(tasks.filter(t => t.client_id !== clientId));
  };

  // Elimina task
  const deleteTask = (taskId: number) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa attività?')) return;
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  // Genera report
  const generateReport = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    const clientTasks = tasks.filter(t => t.client_id === clientId);
    const totalHours = clientTasks.reduce((sum, task) => sum + task.hours, 0);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Salva il report nello storico
    const reportData = {
      id: Date.now(),
      client_id: clientId,
      month: currentMonth,
      year: currentYear,
      total_hours: totalHours,
      generated_at: new Date().toISOString(),
      tasks: clientTasks
    };
    
    setReports([...reports, reportData]);
    
    const reportContent = `
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <title>Report Mensile - ${client.name}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: #f8f9fa; }
          .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { border-bottom: 3px solid ${client.color}; padding-bottom: 20px; margin-bottom: 30px; }
          h1 { color: ${client.color}; margin: 0; font-size: 28px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .info-card { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid ${client.color}; }
          table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e9ecef; }
          th { background: #f8f9fa; font-weight: 600; color: #495057; }
          tr:hover { background: #f8f9fa; }
          .summary { background: linear-gradient(135deg, ${client.color}15, ${client.color}08); padding: 25px; border-radius: 10px; margin-top: 30px; }
          .summary h3 { color: ${client.color}; margin: 0 0 15px 0; }
          .footer { text-align: center; margin-top: 40px; color: #6c757d; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Report Mensile Consulenza</h1>
            <p style="color: #6c757d; margin: 10px 0 0 0; font-size: 16px;">${client.name}</p>
          </div>
          
          <div class="info-grid">
            <div class="info-card">
              <strong>Periodo:</strong><br>
              ${new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
            </div>
            <div class="info-card">
              <strong>Contratto:</strong><br>
              €${client.contract.toLocaleString('it-IT')}/mese
            </div>
            <div class="info-card">
              <strong>Ore Target:</strong><br>
              ${getMonthlyTarget(client.hours_per_week)} ore/mese
            </div>
            <div class="info-card">
              <strong>Ore Lavorate:</strong><br>
              ${totalHours} ore
            </div>
          </div>

          <h2 style="color: ${client.color}; margin-top: 40px;">Dettaglio Attività</h2>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Attività</th>
                <th>Descrizione</th>
                <th style="text-align: right;">Ore</th>
              </tr>
            </thead>
            <tbody>
              ${clientTasks.map(task => `
                <tr>
                  <td>${new Date(task.date).toLocaleDateString('it-IT')}</td>
                  <td><strong>${task.title}</strong></td>
                  <td>${task.description || '-'}</td>
                  <td style="text-align: right;"><strong>${task.hours}h</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary">
            <h3>Riepilogo Finale</h3>
            <p><strong>Totale Ore Lavorate:</strong> ${totalHours} ore</p>
            <p><strong>Tariffa Oraria Media:</strong> €${(client.contract / getMonthlyTarget(client.hours_per_week)).toFixed(2)}/ora</p>
            <p><strong>Percentuale Completamento:</strong> ${((totalHours / getMonthlyTarget(client.hours_per_week)) * 100).toFixed(1)}%</p>
          </div>

          <div class="footer">
            <p>Report generato il ${new Date().toLocaleDateString('it-IT')} alle ${new Date().toLocaleTimeString('it-IT')}</p>
            <p>TimeTracker Pro - Sistema di gestione consulenze</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(reportContent);
      newWindow.document.close();
    }
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      {/* Notifiche */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map(notif => (
            <div key={notif.id} className="bg-orange-600 bg-opacity-20 border border-orange-600 border-opacity-30 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0" />
              <span className="text-orange-200">{notif.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Clienti Attivi</p>
              <p className="text-2xl font-bold text-white">{clients.length}</p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ore Questo Mese</p>
              <p className="text-2xl font-bold text-white">
                {tasks.filter(t => new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + t.hours, 0)}h
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Report Generati</p>
              <p className="text-2xl font-bold text-white">{reports.length}</p>
            </div>
            <FileText className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Cards Clienti */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map(client => {
          const monthlyHours = getMonthlyHours(client.id);
          const target = getMonthlyTarget(client.hours_per_week);
          const percentage = Math.min((monthlyHours / target) * 100, 100);
          
          return (
            <div key={client.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 card hover:border-gray-600 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{client.name}</h3>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: client.color }}></div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Contratto</span>
                  <span className="text-white font-medium">€{client.contract.toLocaleString('it-IT')}/mese</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Ore mensili</span>
                  <span className="text-white font-medium">{monthlyHours.toFixed(1)}/{target}h</span>
                </div>
                
                <div className="progress-bar h-3">
                  <div 
                    className="progress-fill h-3"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: client.color
                    }}
                  ></div>
                </div>
                
                <div className="text-xs text-gray-400 text-center">
                  {percentage.toFixed(1)}% completato
                </div>
                
                <button
                  onClick={() => generateReport(client.id)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg text-sm font-medium btn transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Genera Report
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report History Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => setShowReportsHistory(true)}
          className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FileText size={18} />
          Storico Report ({reports.length})
        </button>
      </div>
    </div>
  );

  // Clients Component
  const Clients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestione Clienti</h2>
        <button
          onClick={() => setShowClientForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={20} />
          Aggiungi Cliente
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Contratto</th>
              <th>Ore/Settimana</th>
              <th>Progress Mensile</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => {
              const monthlyHours = getMonthlyHours(client.id);
              const target = getMonthlyTarget(client.hours_per_week);
              const percentage = Math.min((monthlyHours / target) * 100, 100);
              
              return (
                <tr key={client.id}>
                  <td className="text-white flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: client.color }}></div>
                    {client.name}
                  </td>
                  <td className="text-gray-300">€{client.contract.toLocaleString('it-IT')}</td>
                  <td className="text-gray-300">{client.hours_per_week}h</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 progress-bar h-2">
                        <div 
                          className="progress-fill h-2"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: client.color
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 w-12">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingClient(client);
                          setClientForm({ 
                            name: client.name, 
                            contract: client.contract.toString(), 
                            hours_per_week: client.hours_per_week.toString(), 
                            color: client.color 
                          });
                          setShowClientForm(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 p-1"
                        title="Modifica cliente"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Elimina cliente"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Tasks Component
  const Tasks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestione Attività</h2>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={20} />
          Aggiungi Attività
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Attività</th>
              <th>Ore</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => {
              const client = clients.find(c => c.id === task.client_id);
              return (
                <tr key={task.id}>
                  <td className="text-gray-300">{new Date(task.date).toLocaleDateString('it-IT')}</td>
                  <td className="text-white flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: client?.color }}></div>
                    {client?.name}
                  </td>
                  <td>
                    <div className="text-white font-medium">{task.title}</div>
                    <div className="text-gray-400 text-sm mt-1">{task.description}</div>
                  </td>
                  <td className="text-gray-300 font-medium">{task.hours}h</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setTaskForm({
                            client_id: task.client_id.toString(),
                            title: task.title,
                            hours: task.hours.toString(),
                            date: task.date,
                            description: task.description
                          });
                          setShowTaskForm(true);
                        }}
                        className="text-blue-400 hover:text-blue-300 p-1"
                        title="Modifica attività"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Elimina attività"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-500 mr-3" />
              <span className="text-xl font-bold text-white">TimeTracker Pro</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <BarChart3 size={16} className="inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  activeTab === 'clients' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Users size={16} className="inline mr-2" />
                Clienti
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  activeTab === 'tasks' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Calendar size={16} className="inline mr-2" />
                Attività
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'clients' && <Clients />}
        {activeTab === 'tasks' && <Tasks />}
      </main>

      {/* Modal Form Clienti */}
      {showClientForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                {editingClient ? 'Modifica Cliente' : 'Nuovo Cliente'}
              </h3>
              <button
                onClick={() => {
                  setShowClientForm(false);
                  setEditingClient(null);
                  setClientForm({ name: '', contract: '', hours_per_week: '', color: '#f97316' });
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome Cliente</label>
                <input
                  type="text"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  className="form-input"
                  placeholder="Nome del cliente"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Contratto Mensile (€)</label>
                <input
                  type="number"
                  value={clientForm.contract}
                  onChange={(e) => setClientForm({ ...clientForm, contract: e.target.value })}
                  className="form-input"
                  placeholder="650"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ore per Settimana</label>
                <input
                  type="number"
                  step="0.5"
                  value={clientForm.hours_per_week}
                  onChange={(e) => setClientForm({ ...clientForm, hours_per_week: e.target.value })}
                  className="form-input"
                  placeholder="16"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Colore Identificativo</label>
                <input
                  type="color"
                  value={clientForm.color}
                  onChange={(e) => setClientForm({ ...clientForm, color: e.target.value })}
                  className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClientSubmit}
                  className="flex-1 btn-primary"
                >
                </button>
                <button
                  onClick={() => {
                    setShowClientForm(false);
                    setEditingClient(null);
                    setClientForm({ name: '', contract: '', hours_per_week: '', color: '#f97316' });
                  }}
                  className="px-4 py-2 btn-secondary"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Task */}
      {showTaskForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">
                {editingTask ? 'Modifica Attività' : 'Nuova Attività'}
              </h3>
              <button
                onClick={() => {
                  setShowTaskForm(false);
                  setEditingTask(null);
                  setTaskForm({ client_id: '', title: '', hours: '', date: '', description: '' });
                }}
                className="text-gray-400 hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Cliente</label>
                <select
                  value={taskForm.client_id}
                  onChange={(e) => setTaskForm({ ...taskForm, client_id: e.target.value })}
                  className="form-select"
                >
                  <option value="">Seleziona cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Titolo Attività</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="form-input"
                  placeholder="Sviluppo, Meeting, Analisi..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Ore Lavorate</label>
                <input
                  type="number"
                  step="0.25"
                  value={taskForm.hours}
                  onChange={(e) => setTaskForm({ ...taskForm, hours: e.target.value })}
                  className="form-input"
                  placeholder="4.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Data</label>
                <input
                  type="date"
                  value={taskForm.date}
                  onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descrizione (opzionale)</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  rows={3}
                  className="form-textarea"
                  placeholder="Dettagli dell'attività svolta..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleTaskSubmit}
                  className="flex-1 btn-primary"
                >
                  {editingTask ? 'Aggiorna Attività' : 'Crea Attività'}
                </button>
                <button
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                    setTaskForm({ client_id: '', title: '', hours: '', date: '', description: '' });
                  }}
                  className="px-4 py-2 btn-secondary"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Storico Reports */}
      {showReportsHistory && (
        <div className="modal-overlay">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-screen overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Storico Report</h3>
              <button
                onClick={() => setShowReportsHistory(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {reports.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FileText size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Nessun report generato ancora</p>
                  <p className="text-sm mt-2">I report appariranno qui dopo la generazione</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map((report: any) => {
                    const client = clients.find(c => c.id === report.client_id);
                    return (
                      <div key={report.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-600 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: client?.color }}></div>
                          <div>
                            <div className="text-white font-medium">{client?.name}</div>
                            <div className="text-gray-400 text-sm">
                              {new Date(0, report.month).toLocaleDateString('it-IT', { month: 'long' })} {report.year} - {report.total_hours}h
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-400 text-sm">
                          {new Date(report.generated_at).toLocaleDateString('it-IT')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTrackingApp;