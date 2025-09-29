
# Tradie White Page SPA Frontend

## Install & Run

1. Install dependencies:
	 ```bash
	 npm install
	 ```

2. Start development server (dynamic port; defaults to 5173, auto-increments if busy):
 	```bash
	npm run dev
	```
	The script will find a free port starting at 5173 (override base with DEV_BASE_PORT). It prints the chosen port.
 	Access at: http://localhost:<chosen-port>/ (or http://<your-ip>:<chosen-port>/ for LAN)

3. Build for production:
	 ```bash
	 npm run build
	 ```


## Folder Structure & Purpose

```
src/
	App.vue                # Root Vue component
	main.js                 # App entry point, initializes router & store
	assets/                 # Static files (CSS, images, etc.)
		base.css              # Base styles
		logo.svg              # App logo
		main.css              # Main Tailwind/CSS
	components/             # Reusable UI components
		HelloWorld.vue        # Example/demo component
		TheWelcome.vue        # Example/demo component
		WelcomeItem.vue       # Example/demo component
		TheHeader.vue         # Main header component with auth & navigation
		shared/               # Shared/reusable components
			StarRating.vue      # Star rating display component
		icons/                # SVG icon components
			IconCommunity.vue
			IconDocumentation.vue
			IconEcosystem.vue
			IconSupport.vue
			IconTooling.vue
	router/                 # Vue Router config
		index.js              # Route definitions & guards
	services/               # API service modules
		api.js                # Axios config for backend requests
		account.service.js    # User profile & account management APIs
		booking.service.js    # Quotes, bookings & jobs APIs
		tradie.service.js     # Service categories & tradie APIs
		review.service.js     # Review management APIs
	stores/                 # Pinia stores (global state)
		auth.store.js         # Auth/user state management
		counter.js            # Example/demo store
	views/                  # Page-level components (routed)
		AboutView.vue         # About page
		HomeView.vue          # Home page
		ResidentDashboard.vue # Resident dashboard layout
		AdminDashboard.vue    # Admin dashboard layout
		admin/                # Admin dashboard tabs/pages
			AccountManagement.vue # User account management
			JobManagement.vue     # Job/booking oversight
			ServiceCategories.vue # Service category management
			ReviewManagement.vue  # Review moderation
		resident/             # Resident dashboard tabs/pages
			MyProfile.vue       # Resident profile tab
			MyQuoteRequests.vue # Resident quote requests tab
			MyJobs.vue          # Resident jobs tab
		tradie/               # Tradie dashboard tabs/pages
			MyProfile.vue       # Tradie profile tab
			MyQuoteRequests.vue # Tradie quote requests tab
			MyJobs.vue          # Tradie jobs/work schedule tab
```

## Environment variables

Copy `.env.example` to `.env` (or create mode-specific `.env.development` / `.env.production`).

- VITE_API_BASE_URL: Backend API base URL (default http://localhost:8888)
- VITE_API_WITH_CREDENTIALS: Whether to send cookies with requests (default false)
- VITE_WEBSOCKET_URL: WebSocket URL for real-time updates (default http://localhost:8888)
- VITE_WEBSOCKET_PATH: WebSocket path (default /socket.io/). Change to /ws/ if your server uses a custom path.
- VITE_WEBSOCKET_ENABLED: Enable/disable WebSockets (default true). Set to false to disable client socket connection.

## Networking & real-time

- Axios is configured in `src/services/api.js` to read the base URL from env and attach Authorization headers automatically.
- Public GET endpoints require no token and are whitelisted in the interceptor: `/api/services`, `/api/quotes`, and `/api/tradies/:id`.
- 401 responses clear session and redirect to `/login`.
- Socket.IO client (`src/services/socket.service.js`) connects to `VITE_WEBSOCKET_URL` with `VITE_WEBSOCKET_PATH` (default `/socket.io/`) and registers the current user id upon connect, then listens for `quote_update` events to update the quotes store in real time. The client sends the JWT in the handshake auth payload. If `VITE_WEBSOCKET_ENABLED=false` or connection fails, the app continues to function without realtime updates.
```
