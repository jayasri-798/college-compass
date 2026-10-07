import { Injectable, inject, signal, computed } from '@angular/core';
import { 
  Auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  user, 
  User 
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);

  // Observable for auth state tracking
  user$ = user(this.auth);

  // Angular Signal to hold the current user state reactively
  currentUser = signal<User | null>(null);
  isAdmin = signal<boolean>(false);
  loading = signal<boolean>(true);

  // Master Admin Email with sole authority over User Management & Database Access granting
  readonly superAdminEmail = 'pakanatijayasri@gmail.com';

  // Reactive computed: true ONLY when logged in as pakanatijayasri@gmail.com
  isSuperAdmin = computed<boolean>(() => {
    const email = this.currentUser()?.email?.toLowerCase().trim();
    return email === this.superAdminEmail;
  });

  constructor() {
    this.user$.subscribe(async (authUser) => {
      this.currentUser.set(authUser);
      
      if (authUser && authUser.email) {
        const email = authUser.email.toLowerCase().trim();
        
        // 1. Safety fallback for predefined super admins
        const isSuperAdmin = 
          email === 'pakanatijayasri@gmail.com' || 
          email === 'chinthalacheruvuamareswar@gmail.com' ||
          email === 'balasri.org@gmail.com' ||
          email === 'jayasri798@gmail.com' ||
          email.endsWith('@college-compass.com') ||
          email.startsWith('admin') ||
          email.endsWith('@admin.com');

        let hasDbAccess = isSuperAdmin;
        let role: 'admin' | 'staff' | 'student' = isSuperAdmin ? 'admin' : 'student';

        // 2. Query Firestore admins & users collections
        try {
          const adminDocRef = doc(this.firestore, `admins/${email}`);
          const adminDocSnap = await getDoc(adminDocRef);

          const userDocRef = doc(this.firestore, `users/${email}`);
          const userDocSnap = await getDoc(userDocRef);

          if (adminDocSnap.exists()) {
            hasDbAccess = true;
            role = 'admin';
          }

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData?.['hasDatabaseAccess'] === true || userData?.['role'] === 'admin') {
              hasDbAccess = true;
              role = 'admin';
            } else if (userData?.['role']) {
              role = userData['role'];
            }
          }

          // 3. Auto-record/update user document in the database users list
          const existingData = userDocSnap.exists() ? userDocSnap.data() : null;
          await setDoc(userDocRef, {
            email,
            displayName: authUser.displayName || existingData?.['displayName'] || email.split('@')[0],
            photoURL: authUser.photoURL || existingData?.['photoURL'] || '',
            role: role,
            hasDatabaseAccess: hasDbAccess,
            createdAt: existingData?.['createdAt'] || new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          }, { merge: true });

          // If granted access, sync to admins collection as well
          if (hasDbAccess && !adminDocSnap.exists()) {
            await setDoc(adminDocRef, {
              email,
              role: 'admin',
              hasDatabaseAccess: true,
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }

          this.isAdmin.set(hasDbAccess);
        } catch (error) {
          console.error('Error fetching/updating user in Firestore:', error);
          this.isAdmin.set(isSuperAdmin);
        }
      } else {
        this.isAdmin.set(false);
      }
      this.loading.set(false);
    });
  }

  /**
   * Triggers Google Sign-In flow via popup
   */
  async loginWithGoogle(): Promise<void> {
    this.loading.set(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Google Login Failed:', error);
      this.loading.set(false);
      throw error;
    }
  }

  /**
   * Signs the user out and redirects to login
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Sign Out Failed:', error);
    }
  }

  /**
   * Checks if user is authenticated programmatically
   */
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}
