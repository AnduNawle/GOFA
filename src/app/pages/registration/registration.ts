import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FirebaseService } from '../../core/services/firebase';
import { AuthService } from '../../core/services/auth';
import { serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="py-24 bg-gray-50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-4 mb-20 animate-in fade-in slide-in-from-top duration-700">
           <h3 class="text-academy-yellow font-display font-bold uppercase tracking-[0.2em] text-sm">Prêt à nous rejoindre ?</h3>
           <h1 class="text-5xl font-display font-black text-academy-blue uppercase italic tracking-tighter">Inscriptions <span class="text-academy-yellow">2026/2027</span></h1>
           <p class="text-gray-500 max-w-2xl mx-auto">Rejoignez l'élite du football sénégalais. Remplissez le formulaire ci-dessous pour postuler à notre programme de formation de haut niveau.</p>
        </div>

        <div class="grid lg:grid-cols-3 gap-12">
          <!-- Form Section -->
          <div class="lg:col-span-2 bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            @if (isSubmitted()) {
              <div class="h-full flex flex-col items-center justify-center text-center space-y-6 py-20 animate-in zoom-in duration-500">
                <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <span class="material-icons text-4xl">check_circle</span>
                </div>
                <h2 class="text-3xl font-display font-black text-academy-blue uppercase italic">Merci pour votre candidature !</h2>
                <p class="text-gray-500 max-w-md">Nous avons bien reçu votre formulaire. Notre équipe technique l'étudiera avec attention et vous contactera prochainement pour les tests de détection.</p>
                <button (click)="resetForm()" class="bg-academy-blue text-white px-8 py-4 rounded-md font-display font-bold uppercase tracking-widest text-sm hover:bg-academy-blue-light transition-all">
                  Soumettre une autre inscription
                </button>
              </div>
            } @else {
              @if (!authService.user()) {
                <div class="mb-8 p-5 bg-amber-50/70 rounded-2xl border border-amber-200/50 flex items-start gap-4">
                  <span class="material-icons text-amber-500 text-2xl">info_outline</span>
                  <div class="space-y-1">
                    <p class="text-xs font-bold text-academy-blue uppercase tracking-wider">Connectez-vous pour suivre votre dossier</p>
                    <p class="text-xs text-gray-500 leading-relaxed">En vous connectant avec votre compte Google avant de remplir ce formulaire, vous pourrez suivre l'avancement de votre inscription en temps réel dans l'onglet <strong class="text-academy-blue">Mon Compte</strong>.</p>
                    <button type="button" (click)="authService.loginWithGoogle()" class="mt-2 text-xs font-bold text-academy-blue hover:text-academy-yellow flex items-center gap-1.5 transition-colors uppercase tracking-widest">
                      <span class="material-icons text-sm">login</span> Se connecter maintenant
                    </button>
                  </div>
                </div>
              }
              <form [formGroup]="regForm" (ngSubmit)="submit()" class="space-y-8">
                <div class="grid md:grid-cols-2 gap-8">
                  <div class="space-y-2">
                    <label for="lastName" class="text-xs font-black uppercase tracking-widest text-academy-blue">Nom de l'enfant</label>
                    <input id="lastName" formControlName="lastName" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-academy-yellow transition-all" placeholder="Nom de famille">
                  </div>
                  <div class="space-y-2">
                    <label for="firstName" class="text-xs font-black uppercase tracking-widest text-academy-blue">Prénom de l'enfant</label>
                    <input id="firstName" formControlName="firstName" type="text" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-academy-yellow transition-all" placeholder="Prénom">
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-8">
                  <div class="space-y-2">
                    <label for="birthDate" class="text-xs font-black uppercase tracking-widest text-academy-blue">Date de naissance</label>
                    <input id="birthDate" formControlName="birthDate" type="date" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-academy-yellow transition-all">
                  </div>
                  <div class="space-y-2">
                    <label for="position" class="text-xs font-black uppercase tracking-widest text-academy-blue">Poste préférentiel</label>
                    <select id="position" formControlName="position" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-academy-yellow transition-all">
                      <option value="">Sélectionnez un poste</option>
                      <option value="Gardien">Gardien de but</option>
                      <option value="Défenseur">Défenseur</option>
                      <option value="Milieu">Milieu de terrain</option>
                      <option value="Attaquant">Attaquant</option>
                    </select>
                  </div>
                </div>

                <div class="space-y-2">
                  <label for="parentPhone" class="text-xs font-black uppercase tracking-widest text-academy-blue">Téléphone du parent / tuteur</label>
                  <input id="parentPhone" formControlName="parentPhone" type="tel" class="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:bg-white focus:ring-2 focus:ring-academy-yellow transition-all" placeholder="Ex: 78 123 45 67">
                </div>

                @if (errorMessage()) {
                  <p class="text-red-500 text-xs font-bold uppercase tracking-widest bg-red-50 p-4 rounded-lg flex items-center gap-2">
                    <span class="material-icons text-sm">error</span>
                    {{ errorMessage() }}
                  </p>
                }

                <div class="pt-4">
                  <button 
                    [disabled]="regForm.invalid || isSubmitting()"
                    class="w-full bg-academy-yellow text-academy-blue py-5 rounded-xl font-display font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-academy-yellow/20 disabled:opacity-50 disabled:grayscale disabled:scale-100 flex items-center justify-center gap-4"
                  >
                    @if (isSubmitting()) {
                      <div class="w-5 h-5 border-2 border-academy-blue border-t-transparent rounded-full animate-spin"></div>
                      Traitement en cours...
                    } @else {
                      Soumettre l'inscription
                    }
                  </button>
                </div>
              </form>
            }
          </div>

          <!-- Why GOFA Column -->
          <div class="space-y-8">
            <div class="bg-academy-blue p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden">
               <div class="absolute top-0 right-0 p-4 opacity-5">
                <span class="material-icons text-7xl">security</span>
              </div>
              <h3 class="text-2xl font-display font-bold uppercase italic mb-8 relative z-10">Pourquoi <span class="text-academy-yellow">GOFA ?</span></h3>
              
              <ul class="space-y-8">
                <li class="flex gap-5">
                  <div class="w-12 h-12 shrink-0 bg-white/10 rounded-xl flex items-center justify-center text-academy-yellow">
                    <span class="material-icons">sports_soccer</span>
                  </div>
                  <div>
                    <h4 class="font-display font-bold text-sm uppercase tracking-widest mb-1 italic">Formation de Grade A</h4>
                    <p class="text-xs text-white/60 leading-relaxed">Entraîneurs diplômés et méthodologie internationale centrée sur le développement individuel.</p>
                  </div>
                </li>
                <li class="flex gap-5">
                  <div class="w-12 h-12 shrink-0 bg-white/10 rounded-xl flex items-center justify-center text-academy-yellow">
                    <span class="material-icons">school</span>
                  </div>
                  <div>
                    <h4 class="font-display font-bold text-sm uppercase tracking-widest mb-1 italic">Équilibre Étude-Sport</h4>
                    <p class="text-xs text-white/60 leading-relaxed">Nous valorisons la réussite scolaire autant que les performances sur le terrain.</p>
                  </div>
                </li>
                 <li class="flex gap-5">
                  <div class="w-12 h-12 shrink-0 bg-white/10 rounded-xl flex items-center justify-center text-academy-yellow">
                    <span class="material-icons">public</span>
                  </div>
                  <div>
                    <h4 class="font-display font-bold text-sm uppercase tracking-widest mb-1 italic">Opportunités Mondiales</h4>
                    <p class="text-xs text-white/60 leading-relaxed">Réseau de scouts et partenariats avec des clubs européens et américains.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="bg-academy-yellow p-8 rounded-3xl text-academy-blue flex flex-col items-center text-center shadow-xl">
              <span class="material-icons text-4xl mb-4">help_outline</span>
              <p class="font-bold uppercase tracking-widest text-xs mb-2 italic">Besoin d'aide ?</p>
              <p class="text-sm font-medium mb-4">Contactez notre bureau des admissions pour plus d'informations.</p>
              <p class="text-xl font-display font-black italic">+221 78 129 27 91</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './registration.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  private fb = inject(FormBuilder);
  private firebase = inject(FirebaseService);
  protected authService = inject(AuthService);

  regForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    birthDate: ['', [Validators.required]],
    position: ['', [Validators.required]],
    parentPhone: ['', [Validators.required, Validators.pattern('^[0-9+ ]{8,20}$')]],
  });

  isSubmitting = signal(false);
  isSubmitted = signal(false);
  errorMessage = signal<string | null>(null);

  async submit() {
    if (this.regForm.valid) {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);
      
      const currentUser = this.authService.user();
      const payload = {
        ...this.regForm.value,
        createdAt: serverTimestamp(),
        status: 'pending',
        ...(currentUser ? { userId: currentUser.uid, parentEmail: currentUser.email || '' } : {})
      };

      try {
        const id = await this.firebase.createDocument('registrations', payload);
        if (id) {
          this.isSubmitted.set(true);
        } else {
          this.errorMessage.set('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
        }
      } catch (err: unknown) {
        console.error('Registration error:', err);
        // Extract real error message if available
        let errorMsg = "Erreur lors de l'inscription.";
        if (err instanceof Error) {
            try {
                const parsed = JSON.parse(err.message);
                if (parsed.error) errorMsg += ' Details: ' + parsed.error;
            } catch {
                errorMsg += ' ' + err.message;
            }
        }
        this.errorMessage.set(errorMsg);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  resetForm() {
    this.regForm.reset({
      firstName: '',
      lastName: '',
      birthDate: '',
      position: '',
      parentPhone: ''
    });
    this.isSubmitted.set(false);
    this.errorMessage.set(null);
  }
}
