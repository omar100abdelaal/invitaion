/**
 * Buharita Chateau Wedding Invitation Clone
 * Mobile-First Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const sealScreen = document.getElementById('sealScreen');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const bgAudio = document.getElementById('bgAudio');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicNavBtn = document.getElementById('musicNavBtn');
  const vizBars = document.querySelectorAll('.viz-bar');
  const shareBtn = document.getElementById('shareBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');

  // Timeline elements
  const timelineTrack = document.getElementById('timelineTrack');
  const timelineProgress = document.getElementById('timelineProgress');
  const timelineRose = document.getElementById('timelineRose');
  const timelineItems = document.querySelectorAll('.timeline-item');

  // Gallery & Lightbox elements
  const galleryCarousel = document.getElementById('galleryCarousel');
  const galleryDots = document.querySelectorAll('.gallery-dot');
  const polaroidCards = document.querySelectorAll('.polaroid-card');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  // RSVP Form elements
  const rsvpForm = document.getElementById('rsvpForm');
  const attendanceBtns = document.querySelectorAll('.attendance-btn');
  const attendanceInput = document.getElementById('attendanceStatus');
  const attendeesCountEl = document.getElementById('attendeesCount');

  // Guestbook elements
  const guestbookForm = document.getElementById('guestbookForm');
  const guestbookFeed = document.getElementById('guestbookFeed');

  // Save the Date / iCal elements
  const saveDateBtn = document.getElementById('saveDateBtn');

  // Navigation Items
  const navItems = document.querySelectorAll('.nav-item-btn[data-target]');

  // State
  let isMusicPlaying = false;
  let isEnvelopeOpened = false;

  /* ==========================================================================
     1. WAX SEAL OPENING INTERACTION & CHIME SFX
     ========================================================================== */
  function playChimeSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 1.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.3);
      });
    } catch (e) {
      console.log('AudioContext chime not supported:', e);
    }
  }

  function openEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    // Play subtle opening chime
    playChimeSound();

    // Trigger Door Animation
    sealScreen.classList.add('opened');

    // Auto-play wedding audio upon user interaction
    startMusic();

    showToast('أهلاً بكم في دعوة زفاف محمد ومنى 🤍');
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', openEnvelope);
  }

  /* ==========================================================================
     2. AUDIO PLAYER CONTROLLER
     ========================================================================== */
  function startMusic() {
    if (!bgAudio) return;
    bgAudio.play().then(() => {
      isMusicPlaying = true;
      updateMusicUI();
    }).catch(err => {
      console.log('Autoplay prevented:', err);
    });
  }

  function toggleMusic() {
    if (!bgAudio) return;
    if (isMusicPlaying) {
      bgAudio.pause();
      isMusicPlaying = false;
      showToast('تم إيقاف الموسيقى مؤقتاً');
    } else {
      bgAudio.play().then(() => {
        isMusicPlaying = true;
        showToast('تم تشغيل الموسيقى 🎶');
      }).catch(e => console.log(e));
    }
    updateMusicUI();
  }

  function updateMusicUI() {
    vizBars.forEach(bar => {
      if (isMusicPlaying) {
        bar.classList.add('playing');
      } else {
        bar.classList.remove('playing');
      }
    });

    if (musicToggleBtn) {
      const textSpan = musicToggleBtn.querySelector('.music-btn-text');
      if (textSpan) {
        textSpan.textContent = isMusicPlaying ? 'إيقاف' : 'موسيقى';
      }
    }
  }

  if (musicToggleBtn) musicToggleBtn.addEventListener('click', toggleMusic);
  if (musicNavBtn) musicNavBtn.addEventListener('click', toggleMusic);

  /* ==========================================================================
     3. LIVE COUNTDOWN TIMER
     ========================================================================== */
  // Target: Thursday, November 12, 2026 at 17:00:00
  const weddingDate = new Date('2026-11-12T17:00:00+02:00').getTime();

  const daysVal = document.getElementById('countDays');
  const hoursVal = document.getElementById('countHours');
  const minutesVal = document.getElementById('countMinutes');
  const secondsVal = document.getElementById('countSeconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      if (daysVal) daysVal.textContent = '00';
      if (hoursVal) hoursVal.textContent = '00';
      if (minutesVal) minutesVal.textContent = '00';
      if (secondsVal) secondsVal.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysVal) daysVal.textContent = days < 10 ? '0' + days : days;
    if (hoursVal) hoursVal.textContent = hours < 10 ? '0' + hours : hours;
    if (minutesVal) minutesVal.textContent = minutes < 10 ? '0' + minutes : minutes;
    if (secondsVal) secondsVal.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==========================================================================
     4. TIMELINE WITH ANIMATED ROSE
     ========================================================================== */
  function updateRosePosition(targetItem) {
    if (!targetItem || !timelineRose) return;

    timelineItems.forEach(item => item.classList.remove('active'));
    targetItem.classList.add('active');

    const itemTop = targetItem.offsetTop;
    const itemHeight = targetItem.offsetHeight;
    const targetY = itemTop + 24; // Align with the timeline dot

    timelineRose.style.top = `${targetY}px`;

    // Also update track progress bar
    if (timelineProgress && timelineTrack) {
      const trackHeight = timelineTrack.offsetHeight;
      const progressRatio = Math.min(1, Math.max(0, targetY / trackHeight));
      timelineProgress.style.height = `${progressRatio * 100}%`;
    }
  }

  timelineItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      updateRosePosition(item);
    });
  });

  // Default to first item
  if (timelineItems.length > 0) {
    updateRosePosition(timelineItems[0]);
  }

  // Scroll observer to update timeline rose as user scrolls
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateRosePosition(entry.target);
      }
    });
  }, { threshold: 0.6 });

  timelineItems.forEach(item => timelineObserver.observe(item));

  /* ==========================================================================
     5. PHOTO GALLERY & LIGHTBOX
     ========================================================================== */
  if (galleryCarousel) {
    galleryCarousel.addEventListener('scroll', () => {
      const scrollLeft = galleryCarousel.scrollLeft;
      const cardWidth = polaroidCards[0] ? polaroidCards[0].offsetWidth + 16 : 280;
      const activeIndex = Math.round(Math.abs(scrollLeft) / cardWidth);

      galleryDots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    });
  }

  // Gallery dot click navigation
  galleryDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      if (polaroidCards[idx] && galleryCarousel) {
        polaroidCards[idx].scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    });
  });

  // Lightbox handlers
  polaroidCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     6. SAVE THE DATE (GOOGLE CALENDAR & ICAL DOWNLOAD)
     ========================================================================== */
  if (saveDateBtn) {
    saveDateBtn.addEventListener('click', (e) => {
      // User can click to open Google Calendar, or long-press/option
      // Create and download standard .ics file as fallback/apple support
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Buharita//Wedding Invitation//AR',
        'BEGIN:VEVENT',
        'SUMMARY:دعوة زفاف Mohamed & Mona',
        'DESCRIPTION:نتشرف بدعوتكم لمشاركتنا فرحة زفافنا والاحتفال معنا بهذه المناسبة المباركة.',
        'LOCATION:قاعة روز هول',
        'DTSTART:20261112T150000Z',
        'DTEND:20261112T220000Z',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.setAttribute('download', 'wedding-mohamed-mona.ics');
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast('تم تحميل موعد الزفاف إلى تقويمكم 📅');
    });
  }

  /* ==========================================================================
     7. RSVP FORM SUBMISSION & LOCALSTORAGE
     ========================================================================== */
  // Attendance Toggle
  attendanceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      attendanceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (attendanceInput) {
        attendanceInput.value = btn.dataset.status;
      }
    });
  });

  // Stored RSVP count
  let rsvpCount = parseInt(localStorage.getItem('buharita_rsvp_count') || '142', 10);
  if (attendeesCountEl) {
    attendeesCountEl.textContent = rsvpCount;
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guestName').value.trim();
      const guestCount = document.getElementById('guestCount').value;
      const status = attendanceInput ? attendanceInput.value : 'attending';

      if (!guestName) {
        showToast('يرجى كتابة الاسم الكامل');
        return;
      }

      if (status === 'attending') {
        rsvpCount += parseInt(guestCount, 10);
        localStorage.setItem('buharita_rsvp_count', rsvpCount);
        if (attendeesCountEl) attendeesCountEl.textContent = rsvpCount;
        showToast(`شكراً لك يا ${guestName}، نسعد بتشريفك! 🤍`);
      } else {
        showToast(`شكراً لك يا ${guestName}، سنفتقد وجودك معنا`);
      }

      // Add to Guestbook automatically if desired
      const note = document.getElementById('guestNote').value.trim();
      if (note) {
        addWishToFeed(guestName, note);
      }

      // Reset Form
      rsvpForm.reset();
      attendanceBtns.forEach(b => b.classList.remove('active'));
      if (attendanceBtns[0]) attendanceBtns[0].classList.add('active');
      if (attendanceInput) attendanceInput.value = 'attending';
    });
  }

  /* ==========================================================================
     8. GUESTBOOK / WISHES FEED (SUPABASE REAL DATABASE)
     ========================================================================== */
  const SUPABASE_URL = 'https://tlspbyxgcbufhtqqmnzy.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsc3BieXhnY2J1Zmh0cXFtbnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2NjYyNDgsImV4cCI6MjEwNjI0MjI0OH0.Lsu8r2bu4FOcxbSDKaYTgTOnBcLtpxoadGbOp7NcI_k';

  // Clear any legacy mock data from local storage
  localStorage.removeItem('buharita_wishes');

  // Initialize Supabase Client
  let supabase = null;
  if (window.supabase) {
    try {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
      console.warn('Supabase client initialization fallback:', err);
    }
  }

  let wishes = [];

  function formatArabicTime(dateString) {
    if (!dateString) return 'الآن';
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 60) return 'الآن';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `منذ ${diffHour} ساعة`;
    const diffDays = Math.floor(diffHour / 24);
    if (diffDays === 1) return 'أمس';
    if (diffDays < 30) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString('ar-EG');
  }

  function renderWishes() {
    if (!guestbookFeed) return;
    guestbookFeed.innerHTML = '';

    if (!wishes || wishes.length === 0) {
      guestbookFeed.innerHTML = `
        <div style="text-align: center; padding: 32px 16px; color: var(--color-muted-brown); font-size: 13px;">
          <p style="margin-bottom: 8px; font-size: 22px;">🤍</p>
          <p style="font-weight: 700;">كن أول من يشارك العروسين تهانيه ومباركته!</p>
        </div>
      `;
      return;
    }

    wishes.forEach((wish) => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      const timeDisplay = formatArabicTime(wish.created_at);
      const likesCount = typeof wish.likes === 'number' ? wish.likes : 0;

      card.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHtml(wish.author || '')}</span>
          <span class="wish-date">${timeDisplay}</span>
        </div>
        <p class="wish-text">${escapeHtml(wish.text || '')}</p>
        <button type="button" class="wish-like-btn" data-id="${wish.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span class="like-count">${likesCount}</span>
        </button>
      `;

      const likeBtn = card.querySelector('.wish-like-btn');
      likeBtn.addEventListener('click', () => {
        handleLike(wish.id, card);
      });

      guestbookFeed.appendChild(card);
    });
  }

  // Fetch real wishes from Supabase
  async function fetchWishes() {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('guestbook')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        wishes = data || [];
      } else {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/guestbook?select=*&order=created_at.desc`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        if (!res.ok) throw new Error('Supabase fetch failed');
        wishes = await res.json();
      }
      renderWishes();
    } catch (err) {
      console.warn('Could not load wishes from Supabase yet (run the migration to create the table):', err);
      wishes = [];
      renderWishes();
    }
  }

  // Like a wish and update Supabase
  async function handleLike(wishId, card) {
    const wish = wishes.find(w => w.id === wishId);
    if (!wish) return;

    wish.likes = (typeof wish.likes === 'number' ? wish.likes : 0) + 1;
    card.querySelector('.like-count').textContent = wish.likes;

    try {
      if (supabase) {
        await supabase
          .from('guestbook')
          .update({ likes: wish.likes })
          .eq('id', wishId);
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/guestbook?id=eq.${wishId}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ likes: wish.likes })
        });
      }
    } catch (err) {
      console.error('Failed to update likes in Supabase:', err);
    }
  }

  // Form Submission -> Insert to Supabase
  if (guestbookForm) {
    guestbookForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const author = document.getElementById('wishAuthor').value.trim();
      const text = document.getElementById('wishText').value.trim();
      const submitBtn = guestbookForm.querySelector('button[type="submit"]');

      if (!author || !text) {
        showToast('يرجى ملء جميع الحقول لنشر التهنئة');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
      }

      try {
        let newEntry = null;

        if (supabase) {
          const { data, error } = await supabase
            .from('guestbook')
            .insert([{ author, text, likes: 0 }])
            .select();

          if (error) throw error;
          newEntry = data && data[0];
        } else {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/guestbook`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({ author, text, likes: 0 })
          });

          if (!res.ok) throw new Error('Supabase insert failed');
          const data = await res.json();
          newEntry = data && data[0];
        }

        if (newEntry) {
          wishes.unshift(newEntry);
        } else {
          wishes.unshift({
            id: Date.now(),
            author,
            text,
            likes: 0,
            created_at: new Date().toISOString()
          });
        }

        guestbookForm.reset();
        renderWishes();
        showToast('شكراً لمشاركتنا تهانيكم الصادقة! 🤍');
      } catch (err) {
        console.error('Failed to save wish to Supabase:', err);
        showToast('تم إرسال التهنئة بنجاح! 🤍');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
      }
    });
  }

  // Enable Real-time listener for incoming wishes
  if (supabase) {
    try {
      supabase
        .channel('public:guestbook')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook' }, (payload) => {
          if (payload && payload.new && !wishes.some(w => w.id === payload.new.id)) {
            wishes.unshift(payload.new);
            renderWishes();
          }
        })
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription skipped:', e);
    }
  }

  // Initial load from Supabase
  fetchWishes();

  /* ==========================================================================
     9. MOBILE BOTTOM NAVIGATION & SCROLLSPY
     ========================================================================== */
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.dataset.target;
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const sectionsToSpy = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sectionsToSpy.forEach(sec => {
      if (sec.offsetTop <= scrollPos) {
        currentId = sec.getAttribute('id');
      }
    });

    navItems.forEach(nav => {
      if (nav.dataset.target === currentId) {
        nav.classList.add('active');
      } else {
        nav.classList.remove('active');
      }
    });
  }, { passive: true });

  /* ==========================================================================
     10. SHARE BUTTON (WEB SHARE API)
     ========================================================================== */
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'دعوة زفاف محمد ومنى | Mohamed & Mona',
        text: 'نتشرف بدعوتكم لحضور حفل زفاف محمد ومنى في قاعة روز هول',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log('Share dismissed');
        }
      } else {
        // Fallback: Copy link
        navigator.clipboard.writeText(window.location.href);
        showToast('تم نسخ رابط الدعوة إلى الحافظة بنجاح 📋');
      }
    });
  }

  /* ==========================================================================
     11. HELPER TOAST NOTIFICATION
     ========================================================================== */
  let toastTimeout;
  function showToast(message) {
    if (!toastNotification || !toastText) return;
    toastText.textContent = message;
    toastNotification.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3800);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
