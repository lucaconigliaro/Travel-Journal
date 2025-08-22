import React, { useState, useCallback, useMemo } from 'react';
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
  const [mood, setMood] = useState('');
  const [positiveReflection, setPositiveReflection] = useState('');
  const [negativeReflection, setNegativeReflection] = useState('');
  const [physicalEffort, setPhysicalEffort] = useState(1);
  const [economicEffort, setEconomicEffort] = useState(1);
  const [spent, setSpent] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const moodOptions = useMemo(() => ["😃 Felice", "😞 Triste", "😡 Arrabbiato", "😌 Rilassato", "🤩 Entusiasta"], []);
  const tagOptions = useMemo(() => ["viaggio", "natura", "relax", "cultura", "sport", "food"], []);
  const effortOptions = useMemo(() => [1, 2, 3, 4, 5], []);

  const handleFilesChange = useCallback((e) => {
    setFiles(Array.from(e.target.files));
    setError('');
  }, []);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocalizzazione non supportata dal browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setLocationName(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`);
        setError('');
      },
      () => setError("Impossibile ottenere la posizione, inserisci il luogo manualmente")
    );
  }, []);

  const toggleTag = useCallback((tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }, []);

  const uploadFiles = async (files) => {
    const mediaUrls = [];

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `public/${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);

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

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) return setError("Il titolo è obbligatorio");
    if (!files.length) return setError("Seleziona almeno un file");
    if (!user) return setError("Devi essere loggato per creare un post");

    setLoading(true);

    try {
      const mediaUrls = await uploadFiles(files);

      const postData = {
        title: title.trim(),
        description: description.trim(),
        media: mediaUrls,
        location_name: locationName.trim() || null,
        mood: mood || null,
        positive_reflection: positiveReflection.trim() || null,
        negative_reflection: negativeReflection.trim() || null,
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
  }, [files, title, description, locationName, mood, positiveReflection, negativeReflection, physicalEffort, economicEffort, spent, tags, addPost, navigate, user]);

  const inputClass = "form-control bg-dark text-white border-secondary";
  const selectClass = "form-select bg-dark text-white border-secondary";

  if (authLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container my-5 text-center">
        <h1 className="display-5 text-white">Devi essere loggato per aggiungere un post</h1>
        <button className="btn btn-light mt-3" onClick={() => navigate('/login')}>
          Vai al Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-dark min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card text-white bg-dark border-secondary">
              <div className="card-header">
                <h3 className="mb-0"><i className="bi bi-plus-circle-fill me-2"></i>Aggiungi un nuovo post</h3>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  {/* Titolo */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Titolo del post *</label>
                    <input type="text" className={inputClass} value={title} onChange={e => setTitle(e.target.value)} required disabled={loading} placeholder="Scrivi il titolo qui..." />
                  </div>

                  {/* Descrizione */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Descrizione</label>
                    <textarea className={inputClass} rows="4" value={description} onChange={e => setDescription(e.target.value)} placeholder="Scrivi la descrizione qui..." disabled={loading} />
                  </div>

                  {/* Upload file */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Media *</label>
                    <input type="file" multiple className={inputClass} onChange={handleFilesChange} accept="image/*,video/*" disabled={loading} />
                    <small className="text-muted">Seleziona immagini o video</small>
                    {files.length > 0 && <div className="mt-2"><small className="text-info">{files.length} file selezionati: {files.map(f => f.name).join(', ')}</small></div>}
                  </div>

                  {/* Location */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Luogo</label>
                    <div className="d-flex gap-2">
                      <input type="text" className={inputClass} value={locationName} onChange={e => setLocationName(e.target.value)} placeholder="Scrivi il luogo qui..." disabled={loading} />
                      <button type="button" className="btn btn-outline-light" onClick={handleUseCurrentLocation} disabled={loading}>📍</button>
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
                    <div className="d-flex flex-wrap gap-2">
                      {tagOptions.map(tag => (
                        <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`btn btn-sm ${tags.includes(tag) ? 'btn-light text-dark' : 'btn-outline-light'}`} disabled={loading}>{tag}</button>
                      ))}
                    </div>
                  </div>

                  {/* Riflessioni */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Riflessione positiva</label>
                      <input type="text" className={inputClass} value={positiveReflection} onChange={e => setPositiveReflection(e.target.value)} disabled={loading} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Riflessione negativa</label>
                      <input type="text" className={inputClass} value={negativeReflection} onChange={e => setNegativeReflection(e.target.value)} disabled={loading} />
                    </div>
                  </div>

                  {/* Effort */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Impegno fisico</label>
                      <select className={selectClass} value={physicalEffort} onChange={e => setPhysicalEffort(parseInt(e.target.value))} disabled={loading}>
                        {effortOptions.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Impegno economico</label>
                      <select className={selectClass} value={economicEffort} onChange={e => setEconomicEffort(parseInt(e.target.value))} disabled={loading}>
                        {effortOptions.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Spesa */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Spesa (€)</label>
                    <input type="number" className={inputClass} value={spent} onChange={e => setSpent(e.target.value)} min="0" step="0.01" placeholder="0.00" disabled={loading} />
                  </div>

                  {/* Bottoni */}
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-light" onClick={() => navigate('/')} disabled={loading}>Annulla</button>
                    <button type="submit" className="btn btn-light text-dark" disabled={loading}>
                      {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Caricamento...</> : 'Aggiungi Post'}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}