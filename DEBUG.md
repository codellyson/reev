# Debugging Session Recording

## Step-by-Step Debugging Guide

### 1. Check if Tracker is Loading
Open your test HTML page and check the browser console. You should see:
- "Reev tracker: initTracker called"
- "Reev tracker: Creating tracker with { projectId: 'abc123', apiUrl: '...' }"
- "Reev tracker initializing..."
- "Reev tracker recording started"
- "Reev tracker initialized successfully"

**If you don't see these messages:**
- Check if the tracker.js file is loading (Network tab)
- Verify the script tag is correct
- Check for JavaScript errors

### 2. Check if Events are Being Recorded
After interacting with the page, you should see:
- "Reev tracker: First event recorded" (when you first interact)
- "Sending batch to: ... Events: X" (every 10 seconds)

**If you don't see events:**
- Make sure you're interacting with the page (click, scroll, type)
- Check if rrweb is recording (should see events in console)

### 3. Check if API is Being Called
In the browser console, you should see:
- "Sending batch to: http://localhost:3001/api/events Events: X"
- "Response status: 204" (success) or an error status

**If you see errors:**
- Check the Network tab for the failed request
- Verify the API URL is correct
- Check CORS errors

### 4. Check Server Logs
In your Next.js server console, you should see:
- "Received events: { sessionId: '...', projectId: 'abc123', eventCount: X }"
- "Processing events: ..."
- "Transaction started, checking for existing session: ..."
- "Events processed successfully for session: ..."

**If you see errors:**
- Check database connection
- Verify database tables exist
- Check for SQL errors

### 5. Common Issues

#### Issue: Tracker not loading
**Solution:** 
- Make sure Next.js dev server is running
- Check that `/tracker.js` is accessible at `http://localhost:3001/tracker.js`
- Verify the script tag URL matches your server port

#### Issue: Events not being recorded
**Solution:**
- Make sure you're actually interacting with the page
- Check browser console for rrweb errors
- Verify the tracker initialized successfully

#### Issue: API not receiving requests
**Solution:**
- Check the `data-api-url` attribute matches your server
- Verify CORS headers are set (already added)
- Check Network tab for failed requests

#### Issue: Database errors
**Solution:**
- Run migration: `pnpm run migrate`
- Check `.env` file has correct database credentials
- Verify database is running and accessible

### 6. Quick Test
1. Open your `index.html` file in a browser
2. Open DevTools (F12) → Console tab
3. Look for "Reev tracker" messages
4. Click around the page
5. Wait 10 seconds
6. Check for "Sending batch" message
7. Check server console for "Received events" message

### 7. Manual API Test
Test the API directly:
```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"test-123","projectId":"abc123","events":[{"type":2,"data":{},"timestamp":0}]}'
```

Expected response: HTTP 204 (No Content) or error message with details.

