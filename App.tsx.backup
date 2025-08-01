import React, { useState, useEffect } from 'react';
import { Clock, Users, FileText, BarChart3, Download, AlertCircle, PlusCircle, Calendar, Edit, Trash2, X } from 'lucide-react';

// Logo Component
const TimeTrackerLogo = ({ className = "h-8 w-8" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/> 
          </feMerge>
        </filter>
      </defs>
      
      <circle cx="50" cy="50" r="48" fill="url(#glowGradient)" opacity="0.4" />
      <circle cx="50" cy="50" r="42" fill="url(#clockGradient)" stroke="#ffffff" strokeWidth="2" filter="url(#glow)" />
      <circle cx="50" cy="50" r="36" fill="rgba(0,0,0,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      
      <g stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
        <line x1="50" y1="18" x2="50" y2="24" strokeWidth="3" />
        <line x1="82" y1="50" x2="76" y2="50" strokeWidth="3" />
        <line x1="50" y1="82" x2="50" y2="76" strokeWidth="3" />
        <line x1="18" y1="50" x2="24" y2="50" strokeWidth="3" />
        <line x1="71.2" y1="28.8" x2="67.9" y2="32.1" />
        <line x1="71.2" y1="71.2" x2="67.9" y2="67.9" />
        <line x1="28.8" y1="71.2" x2="32.1" y2="67.9" />
        <line x1="28.8" y1="28.8" x2="32.1" y2="32.1" />
      </g>
      
      <g stroke="#ffffff" strokeLinecap="round">
        <line x1="50" y1="50" x2="42" y2="35" strokeWidth="4" opacity="0.9" />
        <line x1="50" y1="50" x2="65" y2="32" strokeWidth="3" opacity="0.9" />
        <line x1="50" y1="50" x2="32" y2="65" stroke="#fbbf24" strokeWidth="2" />
      </g>
      
      <circle cx="50" cy="50" r="4" fill="#ffffff" stroke="#f97316" strokeWidth="2" />
      <path d="M 50 14 A 36 36 0 0 1 86 50" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.7" strokeDasharray="5,3" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </svg>
  );
};

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

  // Clients Component - Mobile Responsive
  const Clients = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestione Clienti</h2>
        <button
          onClick={() => setShowClientForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">Aggiungi Cliente</span>
          <span className="sm:hidden">Aggiungi</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="mobile-table-hidden bg-gray-800 rounded-lg overflow-hidden">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Contratto</th>
              <th>Ore/Settimana</th>
              <th>Progress Mensile</th>
              <th className="actions-column">Azioni</th>
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
                    <div className="table-progress">
                      <div className="table-progress-bar">
                        <div 
                          className="table-progress-fill"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: client.color
                          }}
                        ></div>
                      </div>
                      <span className="table-progress-text">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="actions-column">
                    <div className="flex gap-2 justify-center">
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
                        className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-400 hover:bg-opacity-10 rounded-lg transition-all"
                        title="Modifica cliente"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400 hover:bg-opacity-10 rounded-lg transition-all"
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

      {/* Mobile Cards */}
      <div className="mobile-cards-container">
        {clients.map(client => {
          const monthlyHours = getMonthlyHours(client.id);
          const target = getMonthlyTarget(client.hours_per_week);
          const percentage = Math.min((monthlyHours / target) * 100, 100);
          
          // Determina il badge status
          let badgeClass = "completed";
          let badgeText = "OK";
          if (percentage > 90) {
            badgeClass = "warning";
            badgeText = "Limite";
          } else if (percentage > 70) {
            badgeClass = "in-progress";
            badgeText = "In corso";
          }
          
          return (
            <div key={client.id} className="mobile-client-card">
              {/* Badge Status */}
              <div className={`mobile-card-badge ${badgeClass}`}>
                {badgeText}
              </div>

              {/* Header */}
              <div className="mobile-card-header">
                <div className="mobile-card-client">
                  <div 
                    className="mobile-card-client-dot" 
                    style={{ backgroundColor: client.color }}
                  ></div>
                  <span className="mobile-card-client-name">{client.name}</span>
                </div>
                <span className="mobile-card-contract">
                  €{client.contract.toLocaleString('it-IT')}/mese
                </span>
              </div>

              {/* Progress Info */}
              <div className="mobile-card-info">
                <div className="mobile-card-hours">
                  {client.hours_per_week}h/sett
                </div>
                <div className="mobile-card-progress">
                  <div className="mobile-card-progress-bar">
                    <div 
                      className="mobile-card-progress-fill"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: client.color
                      }}
                    ></div>
                  </div>
                  <div className="mobile-card-progress-text">
                    {monthlyHours.toFixed(1)}/{target}h questo mese
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mobile-card-actions">
                <button
                  onClick={() => generateReport(client.id)}
                  className="mobile-card-action report"
                >
                  <Download size={16} />
                  <span className="text-sm font-medium">Report</span>
                </button>
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
                  className="mobile-card-action edit"
                  title="Modifica"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteClient(client.id)}
                  className="mobile-card-action delete"
                  title="Elimina"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
        
        {clients.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nessun cliente registrato</p>
            <p className="text-sm">Inizia aggiungendo il tuo primo cliente</p>
          </div>
        )}
      </div>
    </div>
  );

  // Tasks Component - Mobile Responsive
  const Tasks = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestione Attività</h2>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={20} />
          <span className="hidden sm:inline">Aggiungi Attività</span>
          <span className="sm:hidden">Aggiungi</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="mobile-table-hidden bg-gray-800 rounded-lg overflow-hidden">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Attività</th>
              <th>Ore</th>
              <th className="actions-column">Azioni</th>
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
                  <td className="actions-column">
                    <div className="flex gap-2 justify-center">
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
                        className="text-blue-400 hover:text-blue-300 p-2 hover:bg-blue-400 hover:bg-opacity-10 rounded-lg transition-all"
                        title="Modifica attività"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-400 hover:bg-opacity-10 rounded-lg transition-all"
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

      {/* Mobile Cards */}
      <div className="mobile-cards-container">
        {tasks.map(task => {
          const client = clients.find(c => c.id === task.client_id);
          return (
            <div key={task.id} className="mobile-task-card">
              {/* Header */}
              <div className="mobile-card-header">
                <div className="mobile-card-client">
                  <div 
                    className="mobile-card-client-dot" 
                    style={{ backgroundColor: client?.color }}
                  ></div>
                  <span className="mobile-card-client-name">{client?.name}</span>
                </div>
                <span className="mobile-card-date">
                  {new Date(task.date).toLocaleDateString('it-IT')}
                </span>
              </div>

              {/* Body */}
              <div className="mobile-card-body">
                <h3 className="mobile-card-title">{task.title}</h3>
                {task.description && (
                  <p className="mobile-card-description text-truncate-mobile">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Info */}
              <div className="mobile-card-info">
                <div className="mobile-card-hours">
                  {task.hours}h
                </div>
              </div>

              {/* Actions */}
              <div className="mobile-card-actions">
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
                  className="mobile-card-action edit"
                  title="Modifica"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="mobile-card-action delete"
                  title="Elimina"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
        
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Nessuna attività registrata</p>
            <p className="text-sm">Inizia aggiungendo la tua prima attività</p>
          </div>
        )}
      </div>
    </div>
  );