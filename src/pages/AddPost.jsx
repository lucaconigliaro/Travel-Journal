import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../hooks/useAuth";
import { usePosts } from "../hooks/usePosts";

export default function AddPost() {
  const { user, loading: authLoading } = useAuth();
  const { addPost } = usePosts();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mood, setMood] = useState("");
  const [positiveReflection, setPositiveReflection] = useState("");
  const [negativeReflection, setNegativeReflection] = useState("");
  const [physicalEffort, setPhysicalEffort] = useState(1);
  const [economicEffort, setEconomicEffort] = useState(1);
  const [spent, setSpent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const moodOptions = useMemo(
    () => ["Felice", "Triste", "Arrabbiato", "Rilassato", "Entusiasta", "Curioso", "Stanco"],
    []
  );

  const handleFilesChange = useCallback((e) => {
    setFiles(Array.from(e.target.files));
    setMediaError(false);
    setError("");
  }, []);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocalizzazione non supportata dal browser");
      return;
    }
    setError("Ottenendo la posizione...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        setError("");
      },
      (err) => {
        console.error(err);
        setError("Impossibile ottenere la posizione, inserisci manualmente");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const toggleTag = useCallback((tag) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }, []);

  const addCustomTag = useCallback(() => {
    const newTag = tagInput.trim();
    if (!newTag) return;
    if (newTag.includes(" ")) {
      setError("Il tag non può contenere spazi");
      return;
    }
    if (tags.includes(newTag)) {
      setError("Tag già presente");
      return;
    }
    setTags((prev) => [...prev, newTag]);
    setTagInput("");
    setError("");
  }, [tagInput, tags]);

  const handleTagInputKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addCustomTag();
      }
    },
    [addCustomTag]
  );

  const validateAndShowModal = useCallback(() => {
    setError("");
    setTitleError(false);
    setMediaError(false);
    setLocationError(false);

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

    setShowConfirmModal(true);
  }, [title, files.length, locationName]);

  const handleGlobalKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey) {
        const activeElement = document.activeElement;
        const isInInput =
          activeElement &&
          ["INPUT", "TEXTAREA", "SELECT"].includes(activeElement.tagName);
        if (!isInInput && !loading) {
          e.preventDefault();
          validateAndShowModal();
        }
      }
    },
    [loading, validateAndShowModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const uploadFiles = async (files) => {
    if (!user) throw new Error("Devi essere loggato prima di aggiungere un post");
    const mediaUrls = [];
    for (const file of files) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `public/${user.id}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(fileName);
        mediaUrls.push({
          type: file.type.startsWith("video") ? "video" : "image",
          url: publicUrl,
          filename: file.name
        });
      } catch (err) {
        console.error(err);
        throw new Error(`Errore durante l'upload di ${file.name}: ${err.message}`);
      }
    }
    return mediaUrls;
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      validateAndShowModal();
    },
    [validateAndShowModal]
  );

  const confirmSubmit = useCallback(async () => {
    setShowConfirmModal(false);
    setError("");
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
      if (result.success) navigate("/");
      else throw new Error(result.error || "Errore durante la creazione del post");
    } catch (err) {
      console.error(err);
      setError(err.message || "Errore durante l'invio del post");
    } finally {
      setLoading(false);
    }
  }, [
    files,
    title,
    description,
    locationName,
    latitude,
    longitude,
    mood,
    positiveReflection,
    negativeReflection,
    physicalEffort,
    economicEffort,
    spent,
    tags,
    addPost,
    navigate,
    user
  ]);

  const inputClass = (hasError = false) =>
    `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;

  const selectClass =
    "w-full px-4 py-2 border rounded-lg text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  if (authLoading)
    return (
      <div className="flex justify-center mt-20">
        <div className="w-12 h-12 border-4 border-t-indigo-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-3">Devi essere loggato per aggiungere un post</h1>
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          onClick={() => navigate("/login")}
        >
          Vai al Login
        </button>
      </div>
    );

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Aggiungi un nuovo post</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titolo */}
          <div>
            <label className="block mb-1 font-semibold">Titolo *</label>
            <input
              type="text"
              ref={titleRef}
              className={inputClass(titleError)}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              placeholder="Scrivi il titolo qui..."
            />
          </div>

          {/* Descrizione */}
          <div>
            <label className="block mb-1 font-semibold">Descrizione</label>
            <textarea
              className={inputClass()}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Media */}
          <div>
            <label className="block mb-1 font-semibold">Media *</label>
            <input
              type="file"
              ref={mediaRef}
              multiple
              className={inputClass(mediaError)}
              onChange={handleFilesChange}
              accept="image/*,video/*"
              disabled={loading}
            />
          </div>

          {/* Luogo */}
          <div>
            <label className="block mb-1 font-semibold">Luogo *</label>
            <input
              type="text"
              ref={locationRef}
              className={inputClass(locationError)}
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              disabled={loading}
            />
            <small className="text-gray-500 block mt-1">
              ⚠️ Per apparire sulla mappa, devi inserire anche latitudine e longitudine.
            </small>
          </div>

          {/* Latitudine / Longitudine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Latitudine</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  ref={latitudeRef}
                  className={inputClass()}
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="Lat"
                  step="any"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="px-3 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                  onClick={handleUseCurrentLocation}
                  disabled={loading}
                  >
                    📍
                  </button>
                </div>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Longitudine</label>
                <input
                  type="number"
                  ref={longitudeRef}
                  className={inputClass()}
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="Lng"
                  step="any"
                  disabled={loading}
                />
              </div>
            </div>
  
            {/* Mood */}
            <div>
              <label className="block mb-1 font-semibold">Mood</label>
              <div className="flex flex-wrap gap-2">
                {moodOptions.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`px-3 py-1 rounded ${
                      mood === m
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    } transition`}
                    disabled={loading}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
  
            {/* Tags */}
            <div>
              <label className="block mb-1 font-semibold">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-1 bg-gray-200 text-gray-900 px-2 py-1 rounded"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => toggleTag(t)}
                      className="text-red-500 font-bold hover:text-red-700 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  ref={tagInputRef}
                  type="text"
                  className={inputClass()}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Aggiungi tag senza spazi (premi Enter)"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  className="px-4 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                  disabled={loading}
                >
                  Aggiungi
                </button>
              </div>
            </div>
  
            {/* Riflessioni */}
            <div>
              <label className="block mb-1 font-semibold">Riflessione positiva</label>
              <textarea
                className={inputClass()}
                rows={2}
                value={positiveReflection}
                onChange={(e) => setPositiveReflection(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Riflessione negativa</label>
              <textarea
                className={inputClass()}
                rows={2}
                value={negativeReflection}
                onChange={(e) => setNegativeReflection(e.target.value)}
                disabled={loading}
              />
            </div>
  
            {/* Sforzi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Sforzo fisico</label>
                <select
                  className={selectClass}
                  value={physicalEffort}
                  onChange={(e) => setPhysicalEffort(parseInt(e.target.value))}
                  disabled={loading}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Sforzo economico</label>
                <select
                  className={selectClass}
                  value={economicEffort}
                  onChange={(e) => setEconomicEffort(parseInt(e.target.value))}
                  disabled={loading}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
  
            {/* Spesa */}
            <div>
              <label className="block mb-1 font-semibold">Spesa (€)</label>
              <input
                type="number"
                className={inputClass()}
                value={spent}
                onChange={(e) => setSpent(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>
  
            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                disabled={loading}
              >
                {loading ? "Caricamento..." : "Pubblica Post"}
              </button>
            </div>
          </form>
        </div>
  
        {/* Modal di conferma */}
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-gray-900 rounded-lg shadow-lg w-11/12 max-w-md p-6">
              <h3 className="text-xl font-semibold mb-4">Conferma pubblicazione</h3>
              <p className="mb-4">Sei sicuro di voler pubblicare questo post?</p>
              <div className="text-sm text-gray-600 mb-4">
                <strong>Titolo:</strong> {title || "Non specificato"} <br />
                <strong>Media:</strong> {files.length} file <br />
                <strong>Luogo:</strong> {locationName || "Non specificato"}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={loading}
                >
                  Annulla
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  onClick={confirmSubmit}
                  disabled={loading}
                >
                  {loading ? "Pubblicando..." : "Pubblica"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }