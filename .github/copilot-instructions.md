# Whisky Database - AI Coding Guidelines

## Project Overview
React app for managing a personal whisky collection with Appwrite backend. German UI with Material-UI theming. Currently in development - treat as experimental/unstable code.

## Architecture Patterns

### Appwrite Integration
- **Centralized service**: All Appwrite operations in `src/appwrite.js`
- **Auth context pattern**: `AuthContext.js` provides `useAuth()` hook throughout app
- **Environment config**: Appwrite credentials via `.env` variables (endpoint, project ID, database ID, bucket ID)
- **Database collections**: `whiskies`, `distilleries`, `regions`, `series`, `bottlers`

### Component Structure
```
components/
├── overview/          # List and filtering components
├── detail/           # Detailed whisky view
└── inputs/           # Reusable form inputs with autocomplete
```

### Key Conventions

#### State Management
- Local state with `useState` - no Redux/Context for data
- Props drilling for component communication
- Appwrite queries directly in components (no data layer abstraction)

#### Foreign Key Pattern (CRITICAL)
- **IDs vs Names**: All foreign keys (region, distillery, bottler, series) store both opaque ID and display name
- **Display**: Always use `region_name`, `distillery_name`, `bottler_name`, `series_name` for UI
- **Storage**: Use opaque IDs (`region`, `distillery`, `bottler`, `series`) for relationships

#### Theming & Styling
- **Color scheme**: Deep brown (`#2C1B18`) primary, warm gold (`#A67B5B`) secondary
- **Material-UI overrides**: Custom styling for `MuiOutlinedInput` and `MuiAutocomplete`
- **German labels**: All UI text in German (e.g., "Whisky Hinzufügen", "Übersicht")

#### Form Patterns
- **Autocomplete inputs**: Pattern in `components/inputs/` for regions, distilleries, series, bottlers
- **Dynamic entity creation**: If autocomplete input doesn't exist, create new Appwrite document with auto-generated ID
- **Image handling**: Appwrite Storage integration with preview URLs

## Development Workflow

### Commands
```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
```

### Appwrite Setup Required
1. Create Appwrite project with Database, Storage, Authentication
2. Set up collections: whiskies, distilleries, regions, series, bottlers
3. Copy config to `.env` file (see environment variables below)
4. Authentication: Email/password sessions

### Environment Variables
```
REACT_APP_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
REACT_APP_APPWRITE_PROJECT_ID="your-project-id"
REACT_APP_APPWRITE_DATABASE_ID="main"
REACT_APP_APPWRITE_STORAGE_BUCKET_ID="whiskies"
```

### Key Files to Understand
- `src/App.js`: Route structure, MUI theme, auth-protected navigation
- `src/AuthContext.js`: Authentication state management with Appwrite Account service
- `src/appwrite.js`: All Appwrite service functions and configuration
- `src/components/AddWhisky.js`: Complex form with image upload and dynamic entity creation, handles both ID and name storage

## Data Flow Patterns

### Adding New Whiskies
1. Form submission in `AddWhisky.js`
2. Auto-create missing entities (distillery, region, etc.) in Appwrite with auto-generated IDs
3. Upload image to Storage, get URL
4. Save whisky document with both IDs and names for foreign keys

### Filtering/Overview
1. `WhiskyFilter` component queries Appwrite using Query.equal()
2. Results passed up to `WhiskyList` via `updateWhiskyList` callback
3. Rendered as grid of `WhiskyItem` cards showing name fields

### Display Components
- **WhiskyItem.js**: Shows `distillery_name`, `region_name`, `bottler_name` instead of IDs
- **WhiskyDetail.js**: All entity displays use name fields for human-readable content

## Technical Debt/Warnings
- **No error boundaries** - Appwrite errors may crash app
- **No loading states** - Most async operations lack user feedback  
- **Direct Appwrite queries** - No caching or offline support
- **Image size limits** - No validation on upload size
- **German hardcoded** - No i18n system for future localization

## Common Tasks
- **Adding new entity types**: Follow pattern in `components/inputs/` (see `DistilleryInput.js`)
- **Appwrite queries**: Add new functions to `src/appwrite.js`
- **Foreign key handling**: Always save both ID and name when dealing with relationships
- **Styling**: Extend theme overrides in `App.js` for consistency
- **Routes**: Add to router in `App.js` with auth protection pattern