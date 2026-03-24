import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

// ─── Helper: convert DB row to app format ────────────────────────────────────
const dbToProject = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  status: row.status || 'backlog',
  priority: row.priority || 'medium',
  dateMode: row.date_mode || 'single',
  startDate: row.start_date || '',
  endDate: row.end_date || '',
  tags: row.tags || [],
  notes: row.notes || '',
  customFields: row.custom_fields || {},
  assignee: row.assignee || null,
  clientId: row.client_id || null,
  created: row.created_at,
  updatedBy: row.updated_by || null,
})

const projectToDb = (p, userId) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  status: p.status,
  priority: p.priority,
  date_mode: p.dateMode || 'single',
  start_date: p.startDate || null,
  end_date: p.endDate || null,
  tags: p.tags,
  notes: p.notes,
  custom_fields: p.customFields || {},
  assignee: p.assignee || null,
  client_id: p.clientId || null,
  updated_at: new Date().toISOString(),
  updated_by: userId || null,
})

// ─── Projects Hook ───────────────────────────────────────────────────────────
export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setProjects(data.map(dbToProject))
      setLoading(false)
    }
    fetch()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setProjects(prev => {
            if (prev.find(p => p.id === payload.new.id)) return prev
            return [dbToProject(payload.new), ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          setProjects(prev => prev.map(p => p.id === payload.new.id ? dbToProject(payload.new) : p))
        } else if (payload.eventType === 'DELETE') {
          setProjects(prev => prev.filter(p => p.id !== payload.old.id))
        }
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const saveProject = useCallback(async (project, userId) => {
    const dbRow = projectToDb(project, userId)
    const { error } = await supabase.from('projects').upsert(dbRow)
    if (error) console.error('Save error:', error)
    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === project.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = project
        return next
      }
      return [project, ...prev]
    })
  }, [])

  const deleteProject = useCallback(async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) console.error('Delete error:', error)
    setProjects(prev => prev.filter(p => p.id !== id))
  }, [])

  return { projects, loading, saveProject, deleteProject }
}

// ─── Tag Colors Hook ─────────────────────────────────────────────────────────
export function useTagColors() {
  const [tagColors, setTagColors] = useState({})

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('tag_colors').select('*')
      if (data) {
        const colors = {}
        data.forEach(r => { colors[r.tag] = r.color })
        setTagColors(colors)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('tagcolors-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tag_colors' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setTagColors(prev => {
            const next = { ...prev }
            delete next[payload.old.tag]
            return next
          })
        } else {
          setTagColors(prev => ({ ...prev, [payload.new.tag]: payload.new.color }))
        }
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const updateTagColor = useCallback(async (tag, color) => {
    if (color === null) {
      await supabase.from('tag_colors').delete().eq('tag', tag)
      setTagColors(prev => {
        const next = { ...prev }
        delete next[tag]
        return next
      })
    } else {
      await supabase.from('tag_colors').upsert({ tag, color })
      setTagColors(prev => ({ ...prev, [tag]: color }))
    }
  }, [])

  return { tagColors, updateTagColor }
}

// ─── App Settings Hook ───────────────────────────────────────────────────────
export function useAppSettings() {
  const [visibleFields, setVisibleFields] = useState({
    description: true, status: true, priority: true, dates: true, tags: true, notes: false,
  })
  const [customFieldDefs, setCustomFieldDefs] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('app_settings').select('*').eq('id', 'global').single()
      if (data) {
        if (data.visible_fields) setVisibleFields(data.visible_fields)
        if (data.custom_field_defs) setCustomFieldDefs(data.custom_field_defs)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, (payload) => {
        if (payload.new?.visible_fields) setVisibleFields(payload.new.visible_fields)
        if (payload.new?.custom_field_defs) setCustomFieldDefs(payload.new.custom_field_defs)
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const updateVisibleFields = useCallback(async (fields) => {
    setVisibleFields(fields)
    await supabase.from('app_settings').upsert({ id: 'global', visible_fields: fields, custom_field_defs: customFieldDefs })
  }, [customFieldDefs])

  const updateCustomFieldDefs = useCallback(async (defs) => {
    setCustomFieldDefs(defs)
    await supabase.from('app_settings').upsert({ id: 'global', visible_fields: visibleFields, custom_field_defs: defs })
  }, [visibleFields])

  return { visibleFields, setVisibleFields: updateVisibleFields, customFieldDefs, setCustomFieldDefs: updateCustomFieldDefs }
}

// ─── Docs Hook ───────────────────────────────────────────────────────────────
export function useDocs() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('docs')
        .select('*')
        .order('updated_at', { ascending: false })
      if (!error && data) setDocs(data)
      setLoading(false)
    }
    fetch()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('docs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'docs' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setDocs(prev => {
            if (prev.find(d => d.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          setDocs(prev => prev.map(d => d.id === payload.new.id ? payload.new : d))
        } else if (payload.eventType === 'DELETE') {
          setDocs(prev => prev.filter(d => d.id !== payload.old.id))
        }
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const saveDoc = useCallback(async (doc, userId) => {
    const row = { ...doc, updated_at: new Date().toISOString(), updated_by: userId || null }
    const { error } = await supabase.from('docs').upsert(row)
    if (error) console.error('Save doc error:', error)
    setDocs(prev => {
      const idx = prev.findIndex(d => d.id === doc.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = row
        return next
      }
      return [row, ...prev]
    })
  }, [])

  const deleteDoc = useCallback(async (id) => {
    const { error } = await supabase.from('docs').delete().eq('id', id)
    if (error) console.error('Delete doc error:', error)
    setDocs(prev => prev.filter(d => d.id !== id))
  }, [])

  return { docs, loading: loading, saveDoc, deleteDoc }
}

// ─── Todos Hook ──────────────────────────────────────────────────────────────
export function useTodos(projectId) {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) { setTodos([]); setLoading(false); return }
    setLoading(true)
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })
      if (!error && data) setTodos(data)
      setLoading(false)
    }
    fetchTodos()
  }, [projectId])

  useEffect(() => {
    if (!projectId) return
    const channel = supabase
      .channel(`todos-${projectId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos', filter: `project_id=eq.${projectId}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTodos(prev => {
            if (prev.find(t => t.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
        } else if (payload.eventType === 'UPDATE') {
          setTodos(prev => prev.map(t => t.id === payload.new.id ? payload.new : t))
        } else if (payload.eventType === 'DELETE') {
          setTodos(prev => prev.filter(t => t.id !== payload.old.id))
        }
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [projectId])

  const addTodo = useCallback(async (text, assignee = null) => {
    const maxOrder = todos.length > 0 ? Math.max(...todos.map(t => t.sort_order || 0)) + 1 : 0
    const row = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      project_id: projectId,
      text,
      assignee,
      done: false,
      sort_order: maxOrder,
      created_at: new Date().toISOString(),
    }
    setTodos(prev => [...prev, row])
    const { error } = await supabase.from('todos').upsert(row)
    if (error) console.error('Add todo error:', error)
  }, [projectId, todos])

  const updateTodo = useCallback(async (id, updates) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    const { error } = await supabase.from('todos').update(updates).eq('id', id)
    if (error) console.error('Update todo error:', error)
  }, [])

  const deleteTodo = useCallback(async (id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
    const { error } = await supabase.from('todos').delete().eq('id', id)
    if (error) console.error('Delete todo error:', error)
  }, [])

  const addManyTodos = useCallback(async (items) => {
    const startOrder = todos.length > 0 ? Math.max(...todos.map(t => t.sort_order || 0)) + 1 : 0
    const rows = items.map((item, i) => ({
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      project_id: projectId,
      text: item.text,
      assignee: item.assignee || null,
      done: false,
      sort_order: startOrder + i,
      created_at: new Date().toISOString(),
    }))
    setTodos(prev => [...prev, ...rows])
    const { error } = await supabase.from('todos').upsert(rows)
    if (error) console.error('Add many todos error:', error)
  }, [projectId, todos])

  return { todos, loading, addTodo, updateTodo, deleteTodo, addManyTodos }
}

// ─── Clients Hook ─────────────────────────────────────────────────────────────
export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setClients(data)
      setLoading(false)
    }
    fetch()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('clients-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clients' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setClients(prev => {
            if (prev.find(c => c.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          setClients(prev => prev.map(c => c.id === payload.new.id ? payload.new : c))
        } else if (payload.eventType === 'DELETE') {
          setClients(prev => prev.filter(c => c.id !== payload.old.id))
        }
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const saveClient = useCallback(async (client) => {
    const row = { ...client, updated_at: new Date().toISOString() }
    const { error } = await supabase.from('clients').upsert(row)
    if (error) console.error('Save client error:', error)
    setClients(prev => {
      const idx = prev.findIndex(c => c.id === client.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = row; return next }
      return [row, ...prev]
    })
  }, [])

  const deleteClient = useCallback(async (id) => {
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) console.error('Delete client error:', error)
    setClients(prev => prev.filter(c => c.id !== id))
  }, [])

  return { clients, loading, saveClient, deleteClient }
}

// ─── Notifications Hook ───────────────────────────────────────────────────────
export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!userId) return
    const fetch = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (data) setNotifications(data)
    }
    fetch()
  }, [userId])

  useEffect(() => {
    if (!userId) return
    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotifications(prev => {
            if (prev.find(n => n.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new : n))
        } else if (payload.eventType === 'DELETE') {
          setNotifications(prev => prev.filter(n => n.id !== payload.old.id))
        }
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [userId])

  const markAllRead = async () => {
    if (!userId) return
    const readField = `read_${userId}`
    const unread = notifications.filter(n => !n[readField])
    if (unread.length === 0) return
    setNotifications(prev => prev.map(n => ({ ...n, [readField]: true })))
    for (const n of unread) {
      await supabase.from('notifications').update({ [readField]: true }).eq('id', n.id)
    }
  }

  const unreadCount = notifications.filter(n => !n[`read_${userId}`]).length

  return { notifications, unreadCount, markAllRead }
}
