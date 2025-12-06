import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; // Added collection, query, where, getDocs
import { User, Venue, Field } from '@pay2play/types'; // Import User, Venue, Field types
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [ownedVenues, setOwnedVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [venueFields, setVenueFields] = useState<Field[]>([]);
  const [venueLoading, setVenueLoading] = useState(false);
  const [venueError, setVenueError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userProfile = userDocSnap.data() as User;
          setUser(userProfile);
          if (userProfile.roles && userProfile.roles.includes('venueAdmin')) {
            setIsAdmin(true);
            // Fetch venues owned by this admin
            setVenueLoading(true);
            try {
              const q = query(collection(db, 'venues'), where('ownerId', '==', firebaseUser.uid));
              const querySnapshot = await getDocs(q);
              const fetchedVenues: Venue[] = [];
              querySnapshot.forEach((d) => fetchedVenues.push(d.data() as Venue));
              setOwnedVenues(fetchedVenues);
              if (fetchedVenues.length > 0) {
                setSelectedVenue(fetchedVenues[0]); // Auto-select first venue
              }
            } catch (err: any) {
              console.error('Error fetching owned venues:', err);
              setVenueError('Failed to load your venues.');
            } finally {
              setVenueLoading(false);
            }
          } else {
            setIsAdmin(false);
            setError('You are not authorized to access this dashboard.');
          }
        } else {
          setError('User profile not found in Firestore.');
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setError(null);
        setOwnedVenues([]);
        setSelectedVenue(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFields = async () => {
      if (selectedVenue && selectedVenue.id) {
        setVenueLoading(true);
        try {
          const fieldsCollectionRef = collection(db, `venues/${selectedVenue.id}/fields`);
          const fieldsQuerySnapshot = await getDocs(fieldsCollectionRef);
          const fetchedFields: Field[] = [];
          fieldsQuerySnapshot.forEach(fieldDoc => {
            fetchedFields.push(fieldDoc.data() as Field);
          });
          setVenueFields(fetchedFields);
        } catch (err: any) {
          console.error('Error fetching venue fields:', err);
          setVenueError('Failed to load venue fields.');
        } finally {
          setVenueLoading(false);
        }
      } else {
        setVenueFields([]);
      }
    };
    fetchFields();
  }, [selectedVenue]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Venue Dashboard</h1>
        {user ? (
          <>
            <p>Welcome, {user.displayName || user.email}!</p>
            {isAdmin ? (
              <div>
                <button onClick={handleLogout}>Logout</button>
                <h2>Your Venues</h2>
                {venueLoading && <p>Loading venues...</p>}
                {venueError && <p className="error">{venueError}</p>}
                {ownedVenues.length === 0 ? (
                  <p>You don't own any venues yet.</p>
                ) : (
                  <div className="venue-list">
                    {ownedVenues.map((venueItem) => (
                      <button
                        key={venueItem.id}
                        className={`venue-button ${selectedVenue?.id === venueItem.id ? 'selected' : ''}`}
                        onClick={() => setSelectedVenue(venueItem)}
                      >
                        {venueItem.name}
                      </button>
                    ))}
                  </div>
                )}

                {selectedVenue && (
                  <div className="selected-venue-details">
                    <h3>{selectedVenue.name}</h3>
                    <p>{selectedVenue.address}, {selectedVenue.city}</p>
                    <p>{selectedVenue.description}</p>
                    <h4>Fields</h4>
                    {venueLoading && <p>Loading fields...</p>}
                    {venueError && <p className="error">{venueError}</p>}
                    {venueFields.length === 0 ? (
                      <p>No fields for this venue.</p>
                    ) : (
                      <div className="field-list">
                        {venueFields.map((field) => (
                          <div key={field.id} className="field-item">
                            <p><strong>{field.name}</strong> ({field.sport})</p>
                            <p>Price: PKR {field.pricePerHourPkr}</p>
                            <p>Capacity: {field.capacity}</p>
                            {/* Add edit/delete buttons for fields here */}
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Add button to add new field */}
                    <button>Add New Field</button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>Unauthorized access.</p>
                <p>{error}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>Login</button>
            {error && <p className="error">{error}</p>}
          </form>
        )}
      </header>
    </div>
  );
}

export default App;
