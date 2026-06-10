# spazio 432 — sito web

Calendario eventi, prenotazioni, finanze e verifica biglietti per **spazio 432** (via Ceva 47, Torino).

---

## Struttura dei file

```
spazio432/
├── index.html      → calendario pubblico  (spazio432.org)
├── login.html      → portale admin        (spazio432.org/login.html)
├── admin.html      → calendario admin     (spazio432.org/admin.html)
├── finanze.html    → gestione finanze     (spazio432.org/finanze.html)
└── biglietto.html  → biglietto prenotaz.  (aperto automaticamente)
```

---

## Come aggiornare un file (nuovo deployment)

Ogni modifica su GitHub viene pubblicata automaticamente da Cloudflare Pages in 1-2 minuti.

### Da browser (il modo più semplice)

1. Vai su **github.com/TUO-USERNAME/spazio432**
2. Clicca sul file che vuoi aggiornare (es. `login.html`)
3. Clicca l'icona matita ✏️ in alto a destra
4. Fai le modifiche
5. In basso scrivi un messaggio (es. `aggiorno password`) → **Commit changes**

Cloudflare rideploya automaticamente entro 1-2 minuti.

### Caricare un file nuovo o sostituirne uno

1. Vai sulla pagina del repository
2. Clicca **Add file → Upload files**
3. Trascina il file aggiornato (stesso nome di quello esistente)
4. Scrivi un messaggio → **Commit changes**

---

## Come cambiare la password di accesso

Apri `login.html` su GitHub, trova questa riga e cambiala:

```js
const PASSWORD = 'spazio432';
```

Sostituisci `spazio432` con la tua password e salva (commit).

---

## Come aggiungere un admin

Al momento l'accesso è protetto da una sola password condivisa.  
Per cambiare la password basta modificare la riga sopra e fare commit.

---

## Database (Supabase)

Tutti i dati sono salvati su **Supabase** — nessuna configurazione necessaria, funziona già.

| Tabella | Contenuto |
|---------|-----------|
| `events` | eventi del calendario |
| `bookings` | prenotazioni degli utenti |

Per vedere i dati: [supabase.com](https://supabase.com) → il tuo progetto → Table Editor.

### Schema tabella bookings

```sql
create table bookings (
  id         bigserial primary key,
  event_id   bigint not null references events(id) on delete cascade,
  name       text not null,
  email      text not null,
  seats      integer not null default 1,
  note       text,
  created_at timestamptz default now()
);
```

---

## Verifica biglietti all'ingresso

1. Apri `spazio432.org/login.html` dal telefono
2. Inserisci la password
3. Clicca **scanner qr**
4. Punta la fotocamera sul QR del biglietto
5. Verde ✓ = prenotazione valida / Rosso ✗ = non trovata

> La fotocamera funziona solo su **https://** — non su file locali.

---

## Flusso prenotazione utente

```
calendario pubblico (index.html)
  → click su evento
  → pannello dettaglio → bottone "Prenotami"
  → form (nome, email, posti, nota)
  → conferma → biglietto con QR (biglietto.html)
  → bottone "salva PDF"
```

---

## Deploy manuale (se serve)

Se per qualsiasi motivo Cloudflare non si aggiorna automaticamente:

1. Vai su **cloudflare.com → Workers & Pages → spazio432**
2. Clicca **Deployments → Retry deployment**

Oppure forza un nuovo deploy facendo una modifica qualsiasi su GitHub (anche un singolo spazio in un file) e committando.

---

## Contatti tecnici

Sito costruito con HTML/CSS/JS puro + Supabase come database.  
Nessun framework, nessuna dipendenza da installare.
