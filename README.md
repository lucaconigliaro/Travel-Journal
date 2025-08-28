# Travel Journal App

Un'applicazione web per documentare i viaggi, raccogliere momenti significativi e visualizzarli in modo interattivo. Realizzata con **React**, **Tailwind CSS**, **Supabase** e librerie UI moderne.

---

## 🚀 Live Demo
Puoi provare la Web App direttamente a questo link: [Travel Journal App Live](hhttps://travel-journal-app-two.vercel.app/)

## 🎯 Obiettivo

L'app permette di creare un diario di viaggio digitale, memorizzando esperienze, foto, stati d'animo e riflessioni personali. Ogni tappa è un **post** con contenuti multimediali, geolocalizzazione e valutazioni personali. Lo scopo è combinare gestione dati e design moderno per un'esperienza utente completa.

---

## ⚙️ Tecnologie Utilizzate

* **React** – gestione dell'interfaccia e dello stato
* **Tailwind CSS** – stili moderni e responsive
* **Supabase** – backend, autenticazione e database
* **Lucide React** – icone
* **React Router** – routing tra pagine
* **Leaflet** – visualizzazione luoghi

---

## 📌 Funzionalità Implementate

### Gestione Utenti

* Registrazione, login e logout tramite Supabase
* Modifica nome utente
* Cambio password con validazioni

### Post di Viaggio

* Creazione e visualizzazione dei post con:

  * Foto e video
  * Luogo e coordinate
  * Stato d’animo
  * Riflessi positivi e negativi
  * Sforzo fisico ed economico
  * Spesa effettiva
  * Tags personalizzati
  * Carousel per media multipli

### Filtri e Ordinamento

* Filtro per stato d’animo
* Filtro per testo e tag
* Filtro per luogo
* Ordinamento per data e spesa

### UI e UX

* Componenti moderni con Tailwind (card, bottoni, modali)
* Feedback visivo per operazioni di successo/errore
* Sidebar con resize della pagina all'apertura

---

## 🌍 Mappa dei Viaggi

Visualizza su mappa le tappe inserite, con popup dei dettagli.

---

## 📂 Struttura del Progetto

```
/src
 ├─ /components
 │   ├─ Filters.jsx
 │   ├─ MapView.jsx
 │   ├─ PostCard.jsx
 │   ├─ PostDetails.jsx
 │   ├─ PostsList.jsx
 │   └─ Sidebar.jsx
 ├─ /pages
 │   ├─ AddPost.jsx
 │   ├─ DetailPost.jsx
 │   ├─ Home.jsx
 │   └─ Login.jsx
 │   └─ Settings.jsx
 ├─ /layout
 │   └─ DefaultLayout.jsx
 ├─ /hooks
 │   └─ usePosts.js
 │   └─ useAuth.js
 ├─ /context
 │   └─ AuthContext.jsx
 │   └─ PostsContext.jsx
 ├─ App.jsx
 └─ index.css
 └─ supabaseClient.js
```

---

## 🚀 Come Avviare il Progetto

1. Clona il repository:

```bash
git clone https://github.com/lucaconigliaro/travel-journal-app.git
```

2. Installa le dipendenze:

```bash
npm install
```

3. Crea un file `.env` con le chiavi Supabase:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

4. Avvia in locale:

```bash
npm run dev
```

5. Apri `http://localhost:5173` nel browser

---


## ✨ Note Personali

## Ho scelto **React** per la sua modularità e gestione dello stato efficiente, **Tailwind CSS** per velocità e design responsivo, **Supabase** per autenticazione e persistenza dati. L’app riflette la mia volontà di creare un diario di viaggio moderno, interattivo e sicuro.
