// Fonction de défilement fluide vers le contact
function scrollToContact() {
  const contactSection = document.getElementById("contact");
  contactSection.scrollIntoView({ 
    behavior: "smooth",
    block: "start"
  });
}

// Gestion du formulaire de contact
function submitForm(event) {
  event.preventDefault();
  
  // Animation du bouton de soumission
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  submitButton.textContent = "Envoi en cours...";
  submitButton.disabled = true;
  
  // Simulation d'envoi (remplacez par votre logique d'envoi réelle)
  setTimeout(() => {
    // Affichage du message de succès
    document.getElementById("successMsg").style.display = "block";
    
    // Scroll vers le message de succès
    document.getElementById("successMsg").scrollIntoView({ 
      behavior: "smooth",
      block: "center"
    });
    
    // Reset du formulaire
    event.target.reset();
    
    // Restauration du bouton
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    
    // Masquage automatique du message après 10 secondes
    setTimeout(() => {
      const successMsg = document.getElementById("successMsg");
      successMsg.style.opacity = "0";
      setTimeout(() => {
        successMsg.style.display = "none";
        successMsg.style.opacity = "1";
      }, 500);
    }, 10000);
    
  }, 1500); // Simulation d'un délai d'envoi
}

// Gestion des comparaisons avant/après
document.addEventListener('DOMContentLoaded', function() {
  initializeBeforeAfterSliders();
  initializeAnimations();
  initializeFormValidation();
});

function initializeBeforeAfterSliders() {
  const labels = document.querySelectorAll('.label');
  
  labels.forEach(label => {
    label.addEventListener('click', function(e) {
      e.stopPropagation();
      
      const slider = this.closest('.comparison-slider');
      const allLabels = slider.querySelectorAll('.label');
      const view = this.dataset.view;
      
      // Retirer la classe active de tous les labels dans ce slider
      allLabels.forEach(l => l.classList.remove('active'));
      
      // Ajouter la classe active au label cliqué
      this.classList.add('active');
      
      // Gérer l'affichage des images avec animation
      if (view === 'after') {
        slider.classList.add('show-after');
        // Analytics ou tracking (optionnel)
        trackEvent('before_after_view', 'after', slider.dataset.card);
      } else {
        slider.classList.remove('show-after');
        trackEvent('before_after_view', 'before', slider.dataset.card);
      }
    });
  });

}

// Animations au scroll
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observer les éléments à animer
  const elementsToAnimate = document.querySelectorAll(
    '.service-card, .before-after-card, .step, .hero-left, .hero-right'
  );
  
  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });
}

// Validation en temps réel du formulaire
function initializeFormValidation() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearValidationError);
  });
}

function validateField(event) {
  const field = event.target;
  const value = field.value.trim();
  
  // Suppression des erreurs précédentes
  clearValidationError(event);
  
  let isValid = true;
  let errorMessage = '';
  
  // Validation selon le type de champ
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'Ce champ est obligatoire';
  } else if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Adresse email invalide';
    }
  } else if (field.type === 'tel' && value) {
    const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      isValid = false;
      errorMessage = 'Numéro de téléphone invalide';
    }
  }
  
  if (!isValid) {
    showValidationError(field, errorMessage);
  }
  
  return isValid;
}

function showValidationError(field, message) {
  field.style.borderColor = '#ef4444';
  
  // Créer et afficher le message d'erreur
  let errorDiv = field.parentNode.querySelector('.error-message');
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      animation: fadeIn 0.3s ease;
    `;
    field.parentNode.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
}

function clearValidationError(event) {
  const field = event.target;
  field.style.borderColor = '';
  
  const errorDiv = field.parentNode.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.remove();
  }
}

// Fonction de tracking (pour analytics)
function trackEvent(category, action, label) {
  // Intégration avec Google Analytics, Facebook Pixel, etc.
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
  
  // Console pour debug
  console.log(`Track: ${category} - ${action} - ${label}`);
}

// Gestion du menu mobile (si nécessaire)
function initializeMobileMenu() {
  const nav = document.querySelector('nav');
  const navToggle = document.createElement('button');
  navToggle.className = 'nav-toggle';
  navToggle.innerHTML = '☰';
  navToggle.style.cssText = `
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-dark);
  `;
  
  // Ajout du bouton toggle pour mobile
  nav.parentNode.insertBefore(navToggle, nav);
  
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
  });
}

// Smooth scrolling pour tous les liens internes
document.addEventListener('click', function(e) {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// CSS pour les animations
const animationStyles = `
  <style>
    .animate-in {
      animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @media (max-width: 768px) {
      .nav-toggle {
        display: block !important;
      }
      
      nav ul {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 1rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      }
      
      nav.nav-open ul {
        display: flex;
      }
    }
  </style>
`;

// Injection des styles d'animation
document.head.insertAdjacentHTML('beforeend', animationStyles);

// Initialisation du menu mobile
initializeMobileMenu();

const ADMIN_PASSWORD = "tceadmin2025"; // ← change ici si tu veux
let isAdmin = false;
let currentPage = 1;
const itemsPerPage = 3;

function loginAsAdmin() {
  const input = prompt("Mot de passe admin ?");
  if (input === ADMIN_PASSWORD) {
    isAdmin = true;
    alert("✅ Connexion réussie.");
    renderTestimonials();
  } else {
    alert("❌ Mot de passe incorrect.");
  }
}

function getStars(note) {
  return "★".repeat(note) + "☆".repeat(5 - note);
}

function renderTestimonials() {
  fetch("lister_avis.php")
    .then(res => res.json())
    .then(avis => {
      const container = document.getElementById("testimonialList");
      container.innerHTML = "";

      if (avis.length === 0) {
        document.getElementById("paginationInfo").innerText = "Aucun avis pour le moment";
        return;
      }

      const start = (currentPage - 1) * itemsPerPage;
      const paginatedItems = avis.slice(start, start + itemsPerPage);

      paginatedItems.forEach(({ nom, message, note }) => {
        const div = document.createElement("div");
        div.className = "testimonial-card";
        div.innerHTML = `
          <p class="testimonial-text">"${message}"</p>
          <div class="stars">${"★".repeat(note)}${"☆".repeat(5 - note)}</div>
          <span class="testimonial-author">– ${nom}</span>
        `;
        container.appendChild(div);
      });

      const totalPages = Math.ceil(avis.length / itemsPerPage);
      document.getElementById("paginationInfo").innerText = `Page ${currentPage} / ${totalPages}`;
    });
}



function updatePagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  document.getElementById("paginationInfo").innerText = `Page ${currentPage} / ${totalPages}`;
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

function changePage(direction) {
  const testimonials = JSON.parse(localStorage.getItem("testimonials") || "[]");
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  currentPage = Math.max(1, Math.min(currentPage + direction, totalPages));
  renderTestimonials();
}

function addTestimonial(event) {
  event.preventDefault();
  
  alert("Fonction appelée !");

  const nom = document.getElementById("reviewAuthor").value.trim();
  const message = document.getElementById("reviewText").value.trim();
  const note = document.getElementById("reviewStars").value;

  // On envoie les données au fichier PHP
  fetch("ajouter_avis.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `nom=${encodeURIComponent(nom)}&message=${encodeURIComponent(message)}&note=${note}`
  })
  .then(res => res.text())
  .then(data => {
    alert(data); // Pour voir la réponse (ex: "✅ Avis enregistré avec succès !")
    document.getElementById("testimonialForm").reset();
    renderTestimonials(); // Recharge la liste des avis après ajout
  })
  .catch(err => {
    alert("Erreur : " + err);
  });
}


function deleteTestimonial(index) {
  if (!confirm("Confirmer la suppression ?")) return;

  const testimonials = JSON.parse(localStorage.getItem("testimonials") || "[]");
  testimonials.splice(index, 1);
  localStorage.setItem("testimonials", JSON.stringify(testimonials));

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages;
  renderTestimonials();
}

// Tap/click support pour avant/après (mobile)
document.querySelectorAll(".comparison-slider").forEach((slider) => {
  slider.addEventListener("click", () => {
    slider.classList.toggle("show-after");
  });
});

// Init au chargement
window.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("testimonials")) {
    const defaultTestimonials = [
      { text: "Travail soigné et rapide, je recommande à 100% !", stars: 5, author: "Jean Dupont" },
      { text: "Un résultat parfait, au-delà de nos attentes. Merci !", stars: 4, author: "Marie Curie" },
      { text: "Équipe sérieuse, disponible et efficace.", stars: 5, author: "Pierre Martin" }
    ];
    localStorage.setItem("testimonials", JSON.stringify(defaultTestimonials));
  }
  renderTestimonials();
});
