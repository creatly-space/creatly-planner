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
  updated_at: new Date().toISOString(),
  updated_by: userId || null,
})

// ─── Projects Hook ───────────────────────────────────────────────────────────
export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Initial fetch
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

  // Realtime subscription
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
    // Optimistic update
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
