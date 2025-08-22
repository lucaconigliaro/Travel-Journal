import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { usePosts } from '../hooks/usePosts';

export default function AddPost() {
  const { user, loading: authLoading } = useAuth();
  const { addPost } = usePosts();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [mood, setMood] = useState('');
  const [positiveReflection, setPositiveReflection] = useState('');
  const [negativeReflection, setNegativeReflection] = useState('');
  const [physicalEffort, setPhysicalEffort] = useState(1);
  const [economicEffort, setEconomicEffort] = useState(1);
  const [spent, setSpent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [titleError, setTitleError] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const titleRef = useRef();
  const mediaRef = useRef();
  const locationRef = useRef();
  const latitudeRef = useRef();
  const longitudeRef = useRef();
  const tagInputRef = useRef();

  const moodOptions = useMemo(() => [
    "Felice", "Triste", "Arrabbiato", "Rilassato", "Entusiasta", "Curioso", "Stanco"
  ], []);

  const handleFilesChange = useCallback((e) => {
    setFiles(Array.from(e.target.files));
    setMediaError(false);
    setError('');
  }, []);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocalizzazione non supportata dal browser");
      return;
    }

    setError('Ottenendo la posizione...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        setError('');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError("Impossibile ottenere la posizione, inserisci manualmente");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  const toggleTag = useCallback((tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }, []);

  const addCustomTag = useCallback(() => {
    const newTag = tagInput.trim();
    if (!newTag) return;

    if (newTag.includes(' ')) {
      setError("Il tag non può contenere spazi");
      return;
    }

    if (tags.includes(newTag)) {
      setError("Tag già presente");
      return;
    }

    setTags(prev => [...prev, newTag]);
    setTagInput('');
    setError('');
  }, [tagInput, tags]);

  const handleTagInputKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  }, [addCustomTag]);

  const validateAndShowModal = useCallback(() => {
    setError('');
    setTitleError(false);
    setMediaError(false);
    setLocationError(false);

    // Validazione campi obbligatori
    if (!title.trim()) {
      setTitleError(true);
      titleRef.current?.focus();
      return;
    }
    if (!files.length) {
      setMediaError(true);
      mediaRef.current?.focus();
      return;
    }
    if (!locationName.trim()) {
      setLocationError(true);
      locationRef.current?.focus();
      return;
    }

    // Se tutto è valido, mostra la modal
    setShowConfirmModal(true);
  }, [title, files.length, locationName]);

  // Gestione Enter globale per invio post
  const handleGlobalKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
      const activeElement = document.activeElement;
      const isInInput = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT'
      );

      if (!isInInput && !loading) {
        e.preventDefault();
        validateAndShowModal();
      }
    }
  }, [loading, validateAndShowModal]);

  // Aggiungi listener per Enter globale
  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const uploadFiles = async (files) => {
    if (!user) throw new Error("Devi essere loggato prima di aggiungere un post");
    const mediaUrls = [];
    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `public/${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file, { cacheControl: '3600', upsert: false });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
        mediaUrls.push({
          type: file.type.startsWith('video') ? 'video' : 'image',
          url: publicUrl,
          filename: file.name
        });
      } catch (err) {
        console.error(`Errore upload file ${file.name}:`, err);
        throw new Error(`Errore durante l'upload di ${file.name}: ${err.message}`);
      }
    }
    return mediaUrls;
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    validateAndShowModal();
  }, [validateAndShowModal]);

  const confirmSubmit = useCallback(async () => {
    setShowConfirmModal(false);
    setError('');
    setTitleError(false);
    setMediaError(false);
    setLocationError(false);

    setLoading(true);
    try {
      const mediaUrls = await uploadFiles(files);

      const postData = {
        title: capitalizeFirst(title.trim()),
        description: capitalizeFirst(description.trim()),
        media: mediaUrls,
        location_name: capitalizeFirst(locationName.trim()),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        mood: capitalizeFirst(mood) || null,
        positive_reflection: capitalizeFirst(positiveReflection.trim()) || null,
        negative_reflection: capitalizeFirst(negativeReflection.trim()) || null,
        physical_effort: physicalEffort,
        economic_effort: economicEffort,
        spent: spent ? parseFloat(spent) : null,
        tags: tags.length > 0 ? tags : null,
      };

      const result = await addPost(postData);
      if (result.success) navigate('/');
      else throw new Error(result.error || "Errore durante la creazione del post");

    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message || "Errore durante l'invio del post");
    } finally {
      setLoading(false);
    }
  }, [files, title, description, locationName, latitude, longitude, mood, positiveReflection, negativeReflection, physicalEffort, economicEffort, spent, tags, addPost, navigate, user]);

  const inputClass = (hasError = false) => `form-control bg-dark text-white border-secondary ${hasError ? 'border-danger' : ''}`;
  const selectClass = "form-select bg-dark text-white border-secondary";

  if (authLoading) return (
    <div className="container my-5 text-center">
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (!user) return (
    <div className="container my-5 text-center">
      <h1 className="display-5 text-white">Devi essere loggato per aggiungere un post</h1>
      <button className="btn btn-light mt-3" onClick={() => navigate('/login')}>Vai al Login</button>
    </div>
  );

  return (
    <div className="bg-dark min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card text-white bg-dark border-secondary">
              <div className="card-header">
                <h3 className="mb-0">Aggiungi un nuovo post</h3>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  {/* Titolo */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Titolo del post *</label>
                    <input type="text" ref={titleRef} className={inputClass(titleError)} value={title} onChange={e => setTitle(e.target.value)} disabled={loading} placeholder="Scrivi il titolo qui..." />
                  </div>

                  {/* Descrizione */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Descrizione</label>
                    <textarea className={inputClass()} rows="4" value={description} onChange={e => setDescription(e.target.value)} disabled={loading} />
                  </div>

                  {/* Media */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Media *</label>
                    <input type="file" ref={mediaRef} multiple className={inputClass(mediaError)} onChange={handleFilesChange} accept="image/*,video/*" disabled={loading} />
                  </div>

                  {/* Luogo */}
                  {/* Luogo */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Luogo *</label>
                    <input
                      type="text"
                      ref={locationRef}
                      className={inputClass(locationError)}
                      value={locationName}
                      onChange={e => setLocationName(e.target.value)}
                      disabled={loading}
                    />
                    <small className="text-warning d-block mt-1">
                      ⚠️ Per apparire sulla mappa, devi inserire anche latitudine e longitudine.
                    </small>
                  </div>

                  {/* Latitudine / Longitudine con bottone */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Latitudine</label>
                      <div className="d-flex gap-2">
                        <input type="number" ref={latitudeRef} className={inputClass()} value={latitude} onChange={e => setLatitude(e.target.value)} disabled={loading} placeholder="Lat" step="any" />
                        <button type="button" className="btn btn-outline-light" onClick={handleUseCurrentLocation} disabled={loading}>📍</button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Longitudine</label>
                      <input type="number" ref={longitudeRef} className={inputClass()} value={longitude} onChange={e => setLongitude(e.target.value)} disabled={loading} placeholder="Lng" step="any" />
                    </div>
                  </div>

                  {/* Mood */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Mood</label>
                    <div className="d-flex flex-wrap gap-2">
                      {moodOptions.map(m => (
                        <button key={m} type="button" onClick={() => setMood(m)} className={`btn btn-sm ${mood === m ? 'btn-light text-dark' : 'btn-outline-light'}`} disabled={loading}>{m}</button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Tags</label>
                    <div className="d-flex gap-2 mb-2 flex-wrap">
                      {tags.map(t => (
                        <span key={t} className="badge bg-secondary d-flex align-items-center gap-1">
                          {t}
                          <button type="button" className="btn-close btn-close-white btn-sm" aria-label="Remove" onClick={() => toggleTag(t)}></button>
                        </span>
                      ))}
                    </div>
                    <div className="d-flex gap-2">
                      <input
                        ref={tagInputRef}
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        placeholder="Aggiungi tag senza spazi (premi Enter)"
                        disabled={loading}
                      />
                      <button type="button" className="btn btn-outline-light" onClick={addCustomTag} disabled={loading}>Aggiungi</button>
                    </div>
                  </div>

                  {/* Riflessioni */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Riflessione positiva</label>
                    <textarea className={inputClass()} rows="2" value={positiveReflection} onChange={e => setPositiveReflection(e.target.value)} disabled={loading} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Riflessione negativa</label>
                    <textarea className={inputClass()} rows="2" value={negativeReflection} onChange={e => setNegativeReflection(e.target.value)} disabled={loading} />
                  </div>

                  {/* Sforzi */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Sforzo fisico</label>
                      <select className={selectClass} value={physicalEffort} onChange={e => setPhysicalEffort(parseInt(e.target.value))} disabled={loading}>
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Sforzo economico</label>
                      <select className={selectClass} value={economicEffort} onChange={e => setEconomicEffort(parseInt(e.target.value))} disabled={loading}>
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Spese */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Spesa (€)</label>
                    <input type="number" className={inputClass()} value={spent} onChange={e => setSpent(e.target.value)} disabled={loading} placeholder="0.00" min="0" step="0.01" />
                  </div>

                  {/* Submit */}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-light btn-lg" disabled={loading}>
                      {loading ? 'Caricamento...' : 'Pubblica Post'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Modal di conferma personalizzata */}
        {showConfirmModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content bg-dark text-white border-secondary">
                <div className="modal-header border-secondary">
                  <h5 className="modal-title">Conferma pubblicazione</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowConfirmModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Sei sicuro di voler pubblicare questo post?</p>
                  <div className="small text-muted">
                    <strong>Titolo:</strong> {title || 'Non specificato'}<br />
                    <strong>Media:</strong> {files.length} file<br />
                    <strong>Luogo:</strong> {locationName || 'Non specificato'}
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmModal(false)} disabled={loading}>
                    Annulla
                  </button>
                  <button type="button" className="btn btn-light" onClick={confirmSubmit} disabled={loading}>
                    {loading ? 'Pubblicando...' : 'Pubblica'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}