import React, { useState } from 'react';
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
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [mood, setMood] = useState('');
  const [positiveReflection, setPositiveReflection] = useState('');
  const [negativeReflection, setNegativeReflection] = useState('');
  const [physicalEffort, setPhysicalEffort] = useState(1);
  const [economicEffort, setEconomicEffort] = useState(1);
  const [spent, setSpent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFilesChange = (e) => setFiles(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) {
      alert("Seleziona almeno un file");
      return;
    }

    setLoading(true);

    try {
      const mediaUrls = [];

      for (let file of files) {
        const filePath = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl }, error: urlError } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);
        if (urlError) throw urlError;

        mediaUrls.push({
          type: file.type.startsWith('video') ? 'video' : 'image',
          url: publicUrl,
        });
      }

      await addPost({
        title,
        description,
        media: mediaUrls,
        location_name: locationName,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        mood,
        positive_reflection: positiveReflection,
        negative_reflection: negativeReflection,
        physical_effort: parseInt(physicalEffort),
        economic_effort: parseInt(economicEffort),
        spent: spent ? parseFloat(spent) : null,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
      });

      navigate('/');
    } catch (err) {
      console.error('Errore handleSubmit:', err);
      alert('Errore durante l’aggiunta del post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Aggiungi un nuovo post</h2>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
        <input type="text" placeholder="Titolo" value={title} onChange={e => setTitle(e.target.value)} required className="form-control" />
        <textarea placeholder="Descrizione" value={description} onChange={e => setDescription(e.target.value)} className="form-control" />
        <input type="file" multiple onChange={handleFilesChange} className="form-control" />
        <input type="text" placeholder="Luogo" value={locationName} onChange={e => setLocationName(e.target.value)} className="form-control" />
        <input type="number" placeholder="Latitudine" value={latitude} onChange={e => setLatitude(e.target.value)} className="form-control" />
        <input type="number" placeholder="Longitudine" value={longitude} onChange={e => setLongitude(e.target.value)} className="form-control" />
        <input type="text" placeholder="Stato d’animo" value={mood} onChange={e => setMood(e.target.value)} className="form-control" />
        <input type="text" placeholder="Riflessione positiva" value={positiveReflection} onChange={e => setPositiveReflection(e.target.value)} className="form-control" />
        <input type="text" placeholder="Riflessione negativa" value={negativeReflection} onChange={e => setNegativeReflection(e.target.value)} className="form-control" />
        <input type="number" placeholder="Impegno fisico (1-5)" value={physicalEffort} onChange={e => setPhysicalEffort(e.target.value)} min="1" max="5" className="form-control" />
        <input type="number" placeholder="Effort economico (1-5)" value={economicEffort} onChange={e => setEconomicEffort(e.target.value)} min="1" max="5" className="form-control" />
        <input type="number" placeholder="Spesa (€)" value={spent} onChange={e => setSpent(e.target.value)} className="form-control" />
        <input type="text" placeholder="Tags (separati da ,)" value={tags} onChange={e => setTags(e.target.value)} className="form-control" />
        <button type="submit" className="btn btn-success mt-2" disabled={loading}>
          {loading ? 'Caricamento...' : 'Aggiungi Post'}
        </button>
      </form>
    </div>
  );
}