# AI Usage Documentation

This document describes the use of artificial intelligence tools during the development of the Employee Management System, in accordance with the machine test guidelines.

## AI Tool Used
Gemini 3.5 Flash

## Prompt Used
```text
Create a reusable React Custom Hook named useApi() that supports:
- GET Requests
- POST Requests
- PUT Requests
- DELETE Requests
- Loading State Management
- Error Handling

The hook should be generic, taking a baseUrl, and manage state for `data`, `loading`, and `error`. It should return these states along with functions for executing HTTP requests, including injecting an authorization token if it exists in localStorage.
```

## Generated Output Summary
The AI tool generated a custom React hook `useApi` defined in `src/hooks/useApi.js`. 
- It uses React's `useState` to manage three states: `data` (response payload), `loading` (boolean request activity flag), and `error` (holds error message strings).
- It uses a memoized `request` function using `useCallback` which uses standard `fetch` API.
- It automatically detects a token in `localStorage` under the key `token` and injects it as a bearer header: `Authorization: Bearer <token>`.
- It returns request shortcuts: `get`, `post`, `put`, and `del` alongside the state variables.

## Modifications Made
1. **Response Error Parsing**: Modified the response check to parse the JSON error body (`responseData.message`) returned by the Express backend global error handler rather than throwing a generic `response.statusText` error.
2. **Shortcuts Body Handling**: Ensured that the `post` and `put` shortcuts stringify the JSON payload automatically before sending.
3. **Url Parameter Naming**: Changed `url` to `endpoint` in the inner request parameters to differentiate local routing paths from API remote endpoints.
4. **Explicit Exports**: Exceeded the standard default export to also support named exports (`export const useApi = ...`) for clean import syntaxes.

## Reason for Modifications
1. **Enhanced Error User Experience**: The default generated code threw basic network error messages. Fetching the specific JSON error response (`responseData.message`) lets the frontend display precise database validation errors (e.g. "Email is already registered" or "Salary must be a positive number") straight to the user.
2. **Simplified Page Logic**: Stringifying the request body inside the hook shortcuts (`post` and `put`) keeps the page controllers clean and avoids repeating `JSON.stringify(body)` in every form submission.
3. **Consistency**: Naming variables `endpoint` matches common REST client patterns and makes it clear that the path is relative to the `baseUrl`.
