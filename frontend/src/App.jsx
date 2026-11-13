import { useEffect, useMemo, useState } from 'react'
import { ArrowDownUp, Braces, Check, ChevronDown, Code2, Copy, FileCode2, LogOut, Plus, Search, Sparkles, Tag, Trash2, X } from 'lucide-react'
import { api } from './api.js'

const blankSnippet = { title: '', language: 'javascript', codeContent: '', description: '', tags: '' }

function App() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('snippet-session')) } catch { return null }
  })
  const [snippets, setSnippets] = useState([])
  const [filter, setFilter] = useState('')
  const [activeTag, setActiveTag] = useState('All snippets')
  const [dialog, setDialog] = useState(null)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  function signOut() {
    localStorage.removeItem('snippet-session')
    setSession(null)
    setSnippets([])
  }

  async function refresh() {
    if (!session?.token) return
    setLoading(true)
    try { setSnippets(await api.listSnippets(session.token)) }
    catch (error) {
      setNotice(error.message)
      if (error.message.includes('session expired')) signOut()
    } finally { setLoading(false) }
  }

  useEffect(() => { refresh() }, [session?.token])
  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(''), 4000)
    return () => clearTimeout(timer)
  }, [notice])

  const tags = useMemo(() => [...new Set(snippets.flatMap((snippet) => snippet.tags || []))].sort(), [snippets])
  const visible = useMemo(() => snippets.filter((snippet) => {
    const query = filter.toLowerCase()
    const matchesText = !query || [snippet.title, snippet.description, snippet.codeContent, snippet.language, ...(snippet.tags || [])]
      .some((value) => value?.toLowerCase().includes(query))
    return matchesText && (activeTag === 'All snippets' || (snippet.tags || []).includes(activeTag))
  }), [snippets, filter, activeTag])

  if (!session?.token) {
    return <AuthScreen onAuthenticated={(next) => {
      localStorage.setItem('snippet-session', JSON.stringify(next))
      setSession(next)
    }} />
  }

  async function saveSnippet(values) {
    const payload = { ...values, tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean) }
    try {
      if (dialog.snippet) await api.updateSnippet(session.token, dialog.snippet.id, payload)
      else await api.createSnippet(session.token, payload)
      setDialog(null)
      setNotice(dialog.snippet ? 'Snippet updated.' : 'Snippet saved.')
      await refresh()
    } catch (error) { setNotice(error.message) }
  }

  async function removeSnippet(snippet) {
    if (!window.confirm(`Delete â€œ${snippet.title}â€? This cannot be undone.`)) return
    try {
      await api.deleteSnippet(session.token, snippet.id)
      setSnippets((items) => items.filter((item) => item.id !== snippet.id))
      setNotice('Snippet deleted.')
    } catch (error) { setNotice(error.message) }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="Snippet Garden home"><span className="brand-mark"><Braces size={22} /></span><span>snippet<span className="brand-light">garden</span></span></a>
        <div className="side-label">LIBRARY</div>
        <button className={`nav-item ${activeTag === 'All snippets' ? 'selected' : ''}`} onClick={() => setActiveTag('All snippets')}><FileCode2 size={17} />All snippets<span className="nav-count">{snippets.length}</span></button>
        <div className="side-heading"><span className="side-label">YOUR TAGS</span><Tag size={15} /></div>
        <div className="tag-list">
          {tags.length ? tags.map((tag) => <button key={tag} className={`tag-nav ${activeTag === tag ? 'selected' : ''}`} onClick={() => setActiveTag(tag)}><span className="tag-dot" />{tag}</button>) : <p className="empty-tags">Tags you add will show up here.</p>}
        </div>
        <div className="sidebar-bottom"><div className="user-card"><div className="avatar">{session.username?.slice(0, 1).toUpperCase()}</div><div className="user-copy"><strong>{session.username}</strong><span>Personal library</span></div><button className="icon-button logout" aria-label="Sign out" title="Sign out" onClick={signOut}><LogOut size={16} /></button></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="breadcrumb">Library <span>/</span> <strong>{activeTag}</strong></div><div className="top-actions"><span className="saved-note"><span />All changes saved</span><button className="button button-primary" onClick={() => setDialog({ snippet: null })}><Plus size={17} /> New snippet</button></div></header>
        <section className="content-wrap">
          <div className="welcome-row"><div><div className="eyebrow"><Sparkles size={14} /> YOUR PERSONAL CODE LIBRARY</div><h1>A little space for <em>good ideas.</em></h1><p className="subtitle">Keep the useful bits. Find them when you need them.</p></div><div className="code-art" aria-hidden="true"><span className="art-spark">âœ³</span><span className="art-brace">{'{ }'}</span><span className="art-line line-one" /><span className="art-line line-two" /><span className="art-line line-three" /></div></div>
          <div className="stats-row"><div className="stat-card"><div className="stat-icon mint"><Code2 size={17} /></div><div><strong>{snippets.length}</strong><span>saved snippets</span></div></div><div className="stat-card"><div className="stat-icon peach"><Tag size={17} /></div><div><strong>{tags.length}</strong><span>tags to explore</span></div></div><div className="stat-card inspiration"><span className="stat-quote">â€œ</span><span>A good snippet saves future-you a little time.</span></div></div>
          <div className="section-heading"><div><h2>Your snippets <span>{visible.length}</span></h2><p>A collection of things worth keeping.</p></div><div className="list-controls"><label className="search-box"><Search size={17} /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search your snippets..." /><kbd>âŒ˜ K</kbd></label><button className="filter-button" title="Sort by recently updated"><ArrowDownUp size={16} /><span>Recent</span><ChevronDown size={14} /></button></div></div>
          {loading ? <div className="loading-state">Gathering your snippetsâ€¦</div> : visible.length ? <div className="snippet-grid">{visible.map((snippet) => <SnippetCard key={snippet.id} snippet={snippet} onEdit={() => setDialog({ snippet })} onDelete={() => removeSnippet(snippet)} onNotice={setNotice} />)}</div> : <div className="empty-state"><div className="empty-illustration"><Braces size={35} /></div><h3>{filter || activeTag !== 'All snippets' ? 'Nothing found here yet' : 'Your library is ready for its first snippet'}</h3><p>{filter || activeTag !== 'All snippets' ? 'Try a different search or tag.' : 'Save a handy function, a clever query, or any code you want to find again.'}</p>{!filter && activeTag === 'All snippets' && <button className="button button-primary" onClick={() => setDialog({ snippet: null })}><Plus size={17} /> Add your first snippet</button>}</div>}
          <footer className="page-footer"><span><span className="footer-flower">âœ¿</span> Made for the code you want to keep.</span><span>{snippets.length} {snippets.length === 1 ? 'snippet' : 'snippets'} in your garden</span></footer>
        </section>
      </main>
      {notice && <div className="toast" role="status">{notice}<button aria-label="Dismiss" onClick={() => setNotice('')}><X size={15} /></button></div>}
      {dialog && <SnippetDialog snippet={dialog.snippet} onClose={() => setDialog(null)} onSave={saveSnippet} />}
    </div>
  )
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('signin')
  const [values, setValues] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'signup') {
        await api.signup(values)
        const response = await api.signin({ username: values.username, password: values.password })
        onAuthenticated(response)
      } else onAuthenticated(await api.signin({ username: values.username, password: values.password }))
    } catch (issue) { setError(issue.message) } finally { setBusy(false) }
  }
  return (
    <div className="auth-page">
      <div className="auth-decoration deco-a" />
      <div className="auth-decoration deco-b" />
      <div className="auth-panel">
        <a className="brand auth-brand" href="#home"><span className="brand-mark"><Braces size={22} /></span><span>snippet<span className="brand-light">garden</span></span></a>
        <div className="auth-copy"><div className="eyebrow"><Sparkles size={14} /> YOUR CODE, IN GOOD COMPANY</div><h1>Keep the pieces<br />you will use <em>again.</em></h1><p>A calm little home for the code that makes your work easier.</p></div>
        <div className="auth-box">
          <div className="auth-tabs"><button type="button" className={mode === 'signin' ? 'active' : ''} onClick={() => { setMode('signin'); setError('') }}>Sign in</button><button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError('') }}>Create account</button></div>
          <form onSubmit={submit}>
            <label>Username<input autoComplete="username" minLength="3" maxLength="50" required value={values.username} onChange={(event) => setValues({ ...values, username: event.target.value })} placeholder="e.g. samcodes" /></label>
            {mode === 'signup' && <label>Email address<input type="email" autoComplete="email" maxLength="100" required value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} placeholder="you@example.com" /></label>}
            <label>Password<input type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={mode === 'signup' ? 6 : undefined} maxLength="100" required value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'} /></label>
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="button button-primary auth-submit" disabled={busy}>{busy ? 'One moment...' : mode === 'signup' ? 'Create my account' : 'Sign in to your library'}<span>→</span></button>
          </form>
          <p className="auth-footnote">Your snippets stay connected to your account.</p>
        </div>
        <div className="auth-bottom"><span>© 2026 Snippet Garden</span><span>Small things, kept well <span className="footer-flower">✿</span></span></div>
      </div>
      <div className="auth-preview">
        <div className="preview-orbit orbit-one" /><div className="preview-orbit orbit-two" />
        <div className="preview-card">
          <div className="preview-head"><span className="preview-dot" /><span className="preview-dot" /><span className="preview-dot" /><span className="preview-file"><FileCode2 size={13} /> array-helpers.js</span></div>
          <div className="preview-body"><div className="line-numbers">01<br />02<br />03<br />04<br />05<br />06</div><pre><span className="code-purple">const</span> <span className="code-blue">unique</span> = (items) =&gt; {'{'}<br />{'  '}<span className="code-purple">return</span> [...<span className="code-blue">new Set</span>(items)]<br />{' }'}<br /><br /><span className="code-comment">// simple, handy, ready when you are</span><br /><span className="code-blue">unique</span>(['keep', 'it', 'tidy'])</pre></div>
          <div className="preview-tags"><span>javascript</span><span>arrays</span><span>saved with care</span></div>
        </div>
        <div className="preview-caption"><span className="caption-icon"><Check size={16} /></span><span><strong>A library that feels like yours</strong><small>Organized, searchable, always close by.</small></span></div>
      </div>
    </div>
  )
}

function SnippetCard({ snippet, onEdit, onDelete, onNotice }) {
  const [copied, setCopied] = useState(false)
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(snippet.codeContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { onNotice('Clipboard access is unavailable in this browser.') }
  }
  return <article className="snippet-card"><div className="snippet-card-top"><div className="language-pill"><span className="language-dot" />{snippet.language || 'code'}</div><div className="card-actions"><button className="icon-button" title="Copy code" aria-label="Copy code" onClick={copyCode}>{copied ? <Check size={16} /> : <Copy size={16} />}</button><button className="icon-button" title="Delete snippet" aria-label="Delete snippet" onClick={onDelete}><Trash2 size={16} /></button></div></div><button className="snippet-title" onClick={onEdit}>{snippet.title}</button><p className="snippet-description">{snippet.description || 'A useful piece of code, saved for later.'}</p><pre className="snippet-code"><code>{snippet.codeContent}</code></pre><div className="snippet-card-bottom"><div className="snippet-tags">{(snippet.tags || []).slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}{(snippet.tags || []).length > 3 && <span>+{snippet.tags.length - 3}</span>}</div><button className="edit-link" onClick={onEdit}>Open snippet <span>â†—</span></button></div></article>
}

function SnippetDialog({ snippet, onClose, onSave }) {
  const [values, setValues] = useState(snippet ? { ...snippet, tags: (snippet.tags || []).join(', ') } : blankSnippet)
  const [busy, setBusy] = useState(false)
  async function submit(event) { event.preventDefault(); setBusy(true); await onSave(values); setBusy(false) }
  function change(key, value) { setValues((current) => ({ ...current, [key]: value })) }
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="snippet-modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="modal-heading"><div><span className="eyebrow">{snippet ? 'A LITTLE TUNE-UP' : 'SAVE SOMETHING USEFUL'}</span><h2 id="dialog-title">{snippet ? 'Edit snippet' : 'New snippet'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div><form onSubmit={submit}><label>Title<input required maxLength="150" value={values.title} onChange={(e) => change('title', e.target.value)} placeholder="What does this snippet do?" autoFocus /></label><div className="form-row"><label>Language<input maxLength="50" value={values.language || ''} onChange={(e) => change('language', e.target.value)} placeholder="javascript" /></label><label>Tags <span className="label-hint">comma separated</span><input maxLength="500" value={values.tags || ''} onChange={(e) => change('tags', e.target.value)} placeholder="arrays, helpers" /></label></div><label>Description <span className="label-hint">optional</span><input maxLength="2000" value={values.description || ''} onChange={(e) => change('description', e.target.value)} placeholder="A short note for future-you" /></label><label>Code<textarea required value={values.codeContent} onChange={(e) => change('codeContent', e.target.value)} placeholder="Paste your code here..." rows="10" /></label><div className="modal-footer"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button className="button button-primary" disabled={busy}><Check size={16} />{busy ? 'Savingâ€¦' : snippet ? 'Save changes' : 'Save snippet'}</button></div></form></section></div>
}

export default App
