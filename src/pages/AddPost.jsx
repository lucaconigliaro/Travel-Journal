import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostsContext } from '../context/PostsContext.jsx';
import { supabase } from '../supabaseClient';

export default function AddPost() {
  const { addPost } = usePostsContext();
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

  const moodOptions = useMemo(() => ["😃 Felice", "😞 Triste", "😡 Arrabbiato", "😌 Rilassato", "🤩 Entusiasta"], []);
  const tagOptions = useMemo(() => ["viaggio", "natura", "relax", "cultura", "sport", "food"], []);
  const effortOptions = useMemo(() => [1, 2, 3, 4, 5], []);

  const handleFilesChange = useCallback((e) => {
    setFiles(Array.from(e.target.files));
  }, []);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return alert("Geolocalizzazione non supportata dal browser");
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => setLocationName(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`),
      () => alert("Impossibile ottenere la posizione, inserisci il luogo manualmente")
    );
  }, []);

  const toggleTag = useCallback((tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!files.length) return alert("Seleziona almeno un file");

    setLoading(true);
    try {
      const mediaUrls = [];
      for (const file of files) {
        const filePath = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl }, error: urlError } = supabase.storage.from('media').getPublicUrl(filePath);
        if (urlError) throw urlError;

        mediaUrls.push({ type: file.type.startsWith('video') ? 'video' : 'image', url: publicUrl });
      }

      await addPost({
        title,
        description,
        media: mediaUrls,
        location_name: locationName,
        mood,
        positive_reflection: positiveReflection,
        negative_reflection: negativeReflection,
        physical_effort: physicalEffort,
        economic_effort: economicEffort,
        spent: spent ? parseFloat(spent) : null,
        tags,
      });

      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Errore durante l'invio del post");
    } finally {
      setLoading(false);
    }
  }, [files, title, description, locationName, mood, positiveReflection, negativeReflection, physicalEffort, economicEffort, spent, tags, addPost, navigate]);

  const inputClass = "form-control bg-dark text-white border-secondary";
  const selectClass = "form-select bg-dark text-white border-secondary";

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
                <form onSubmit={handleSubmit}>

                  {/* Titolo e descrizione */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Titolo del post</label>
                    <input type="text" className={inputClass} value={title} onChange={e => setTitle(e.target.value)} required placeholder="Scrivi il titolo qui..." />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Descrizione</label>
                    <textarea className={inputClass} rows="4" value={description} onChange={e => setDescription(e.target.value)} placeholder="Scrivi la descrizione qui..." />
                  </div>

                  {/* File upload */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Media</label>
                    <input type="file" multiple className={inputClass} onChange={handleFilesChange} />
                    <small className="text-muted">Seleziona immagini o video</small>
                  </div>

                  {/* Location */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Luogo</label>
                    <div className="d-flex gap-2">
                      <input type="text" placeholder="Scrivi il luogo qui..." className={inputClass} value={locationName} onChange={e => setLocationName(e.target.value)} />
                      <button type="button" className="btn btn-outline-light" onClick={handleUseCurrentLocation}>📍</button>
                    </div>
                  </div>

                  {/* Mood */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Mood</label>
                    <div className="d-flex flex-wrap gap-2">
                      {moodOptions.map(m => (
                        <button key={m} type="button" onClick={() => setMood(m)} className={`btn btn-sm ${mood===m ? 'btn-light text-dark' : 'btn-outline-light'}`}>{m}</button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Tags</label>
                    <div className="d-flex flex-wrap gap-2">
                      {tagOptions.map(tag => (
                        <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`btn btn-sm ${tags.includes(tag) ? 'btn-light text-dark' : 'btn-outline-light'}`}>{tag}</button>
                      ))}
                    </div>
                  </div>

                  {/* Riflessioni */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Riflessione positiva</label>
                      <input type="text" className={inputClass} value={positiveReflection} onChange={e => setPositiveReflection(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Riflessione negativa</label>
                      <input type="text" className={inputClass} value={negativeReflection} onChange={e => setNegativeReflection(e.target.value)} />
                    </div>
                  </div>

                  {/* Impegno fisico ed economico */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Impegno fisico</label>
                      <select className={selectClass} value={physicalEffort} onChange={e => setPhysicalEffort(parseInt(e.target.value))}>
                        {effortOptions.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Impegno economico</label>
                      <select className={selectClass} value={economicEffort} onChange={e => setEconomicEffort(parseInt(e.target.value))}>
                        {effortOptions.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Spesa */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Spesa (€)</label>
                    <input type="number" className={inputClass} value={spent} onChange={e => setSpent(e.target.value)} min="0" step="0.01" placeholder="0.00" />
                  </div>

                  {/* Bottoni */}
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-outline-light" onClick={() => navigate('/')}>Annulla</button>
                    <button type="submit" className="btn btn-light text-dark" disabled={loading}>{loading ? 'Caricamento...' : 'Aggiungi Post'}</button>
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