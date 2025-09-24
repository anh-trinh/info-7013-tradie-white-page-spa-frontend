
# Tradie White Page SPA Frontend

## Install & Run

1. Install dependencies:
	 ```bash
	 npm install
	 ```

2. Start development server (for WSL or network access):
	```bash
	npm run dev
	```
		Access at: http://localhost:5173/ (or http://<your-ip>:5173/ for network access)

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
	stores/                 # Pinia stores (global state)
		auth.store.js         # Auth/user state management
		counter.js            # Example/demo store
	views/                  # Page-level components (routed)
		AboutView.vue         # About page
		HomeView.vue          # Home page
		ResidentDashboard.vue # Resident dashboard layout
		TradieDashboard.vue   # Tradie dashboard layout
		resident/             # Resident dashboard tabs/pages
			MyProfile.vue       # Resident profile tab
			MyQuoteRequests.vue # Resident quote requests tab
			MyJobs.vue          # Resident jobs tab
		tradie/               # Tradie dashboard tabs/pages
			MyProfile.vue       # Tradie profile tab
			MyQuoteRequests.vue # Tradie quote requests tab
			MyJobs.vue          # Tradie jobs/work schedule tab
```
```
