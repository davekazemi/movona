// Movona Fitness Website JavaScript

// Plan links configuration for Trainerize integration
const baseUrlPlans = "https://www.trainerize.me/profile/movona/?planGUID=";
const choosePlanIDs = {
    annually: {
        foundation: "4d76d742d95b4952bf3c082176bd22a4",
        basic:  "4d76d742d95b4952bf3c082176bd22a4",
        premium:  "4d76d742d95b4952bf3c082176bd22a4"
    },
    monthly: {
        foundation: "4d76d742d95b4952bf3c082176bd22a4",
        basic: "4d76d742d95b4952bf3c082176bd22a4",
        premium: "4d76d742d95b4952bf3c082176bd22a4"
    }
};
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for anchor links (exclude plan buttons)
    document.querySelectorAll('a[href^="#"]:not(.plan-button)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu on link click
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }

            const targetElement = document.querySelector(this.getAttribute('href'));
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to navigation
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.classList.add('shadow-xl');
        } else {
            nav.classList.remove('shadow-xl');
        }
    });

    // Mobile plans scroll functionality
    const mobileScrollContainer = document.getElementById('mobile-plans-container');
    const scrollIndicators = document.querySelectorAll('.scroll-indicator');
    const prevButton = document.getElementById('prev-plan');
    const nextButton = document.getElementById('next-plan');
    
    let currentPlanIndex = 1; // Start with the middle card (Progression - Most Popular)
    const totalPlans = 3;
    
    if (mobileScrollContainer && scrollIndicators.length > 0) {
        // Handle scroll indicator clicks
        scrollIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                scrollToPlan(index);
            });
        });

        // Handle arrow button clicks
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentPlanIndex > 0) {
                    scrollToPlan(currentPlanIndex - 1);
                }
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (currentPlanIndex < totalPlans - 1) {
                    scrollToPlan(currentPlanIndex + 1);
                }
            });
        }

        // Function to scroll to specific plan
        function scrollToPlan(index) {
            const plans = mobileScrollContainer.querySelectorAll('.snap-center');
            if (plans[index]) {
                const planCard = plans[index];
                const containerRect = mobileScrollContainer.getBoundingClientRect();
                const cardRect = planCard.getBoundingClientRect();
                const scrollLeft = mobileScrollContainer.scrollLeft + cardRect.left - containerRect.left - (containerRect.width - cardRect.width) / 2;
                
                mobileScrollContainer.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
                
                currentPlanIndex = index;
                updateActiveIndicator();
                updateArrowStates();
            }
        }

        // Update active indicator based on current index
        function updateActiveIndicator() {
            scrollIndicators.forEach((indicator, index) => {
                if (index === currentPlanIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        // Update arrow button states
        function updateArrowStates() {
            if (prevButton) {
                if (currentPlanIndex === 0) {
                    prevButton.classList.add('disabled');
                    prevButton.style.opacity = '0.5';
                } else {
                    prevButton.classList.remove('disabled');
                    prevButton.style.opacity = '1';
                }
            }

            if (nextButton) {
                if (currentPlanIndex === totalPlans - 1) {
                    nextButton.classList.add('disabled');
                    nextButton.style.opacity = '0.5';
                } else {
                    nextButton.classList.remove('disabled');
                    nextButton.style.opacity = '1';
                }
            }
        }

        // Listen to scroll events for updating indicators
        let scrollTimeout;
        mobileScrollContainer.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateCurrentIndexFromScroll();
            }, 100);
        });

        // Update current index based on scroll position
        function updateCurrentIndexFromScroll() {
            const scrollLeft = mobileScrollContainer.scrollLeft;
            const containerWidth = mobileScrollContainer.clientWidth;
            const cardWidth = 288 + 16; // card width + gap
            const newIndex = Math.round(scrollLeft / cardWidth);
            
            if (newIndex !== currentPlanIndex && newIndex >= 0 && newIndex < totalPlans) {
                currentPlanIndex = newIndex;
                updateActiveIndicator();
                updateArrowStates();
            }
        }
        
        // Set initial states and scroll to middle card
        updateActiveIndicator();
        updateArrowStates();
        
        // Scroll to the middle card (Progression) on page load
        setTimeout(() => {
            scrollToPlan(1);
        }, 100);
    }

    // Initialize plan buttons with default monthly links
    function updatePlanButtonLinks(billingType = 'monthly') {
        const planButtons = document.querySelectorAll('.plan-button');
        
        planButtons.forEach(button => {
            const planName = getPlanNameFromButton(button);
            if (planName && choosePlanIDs[billingType] && choosePlanIDs[billingType][planName]) {
                const planGUID = choosePlanIDs[billingType][planName];
                button.href = baseUrlPlans + planGUID;
                button.target = '_blank'; // Open in new tab
            }
        });
    }

    // Helper function to determine plan name from button context
    function getPlanNameFromButton(button) {
        const planCard = button.closest('.card-contrast');
        if (!planCard) return null;
        
        const planTitle = planCard.querySelector('h3');
        if (!planTitle) return null;
        
        const title = planTitle.textContent.toLowerCase();
        
        if (title.includes('foundation')) return 'foundation';
        if (title.includes('personal') || title.includes('training')) return 'basic';
        if (title.includes('transformation') || title.includes('premium')) return 'premium';
        
        return null;
    }

    // Initialize plan button links on page load
    updatePlanButtonLinks('monthly');

    // Billing toggle functionality
    const billingToggle = document.getElementById('billing-toggle');
    const toggleIndicator = document.getElementById('toggle-indicator');
    const planPrices = document.querySelectorAll('.plan-price');
    const planPeriods = document.querySelectorAll('.plan-period');
    
    let isAnnual = false;

    if (billingToggle) {
        billingToggle.addEventListener('click', () => {
            isAnnual = !isAnnual;
            
            // Toggle visual state
            billingToggle.classList.toggle('active');
            
            // Update prices and periods
            planPrices.forEach(price => {
                const monthlyPrice = parseInt(price.dataset.monthly);
                const annualPrice = parseInt(price.dataset.annual);
                
                if (isAnnual) {
                    price.textContent = `$${annualPrice}`;
                } else {
                    price.textContent = `$${monthlyPrice}`;
                }
            });

            planPeriods.forEach(period => {
                period.textContent = isAnnual ? '/year' : '/month';
            });

            // Update button links using choosePlanIDs and baseUrlPlans
            updatePlanButtonLinks(isAnnual ? 'annually' : 'monthly');
        });
    }

    // Add loading animations for better UX
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animations
    document.querySelectorAll('.card-hover').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Why Movona section mobile scroll functionality
    const mobileWhyContainer = document.getElementById('mobile-why-container');
    const whyScrollIndicators = document.querySelectorAll('.why-scroll-indicator');
    const prevWhyButton = document.getElementById('prev-why');
    const nextWhyButton = document.getElementById('next-why');
    
    let currentWhyIndex = 1; // Start with the second card (Proven Results)
    const totalWhyCards = 4; // Updated to 4 cards
    
    if (mobileWhyContainer && whyScrollIndicators.length > 0) {
        // Handle scroll indicator clicks
        whyScrollIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                scrollToWhyCard(index);
            });
        });

        // Handle arrow button clicks
        if (prevWhyButton) {
            prevWhyButton.addEventListener('click', () => {
                if (currentWhyIndex > 0) {
                    scrollToWhyCard(currentWhyIndex - 1);
                }
            });
        }

        if (nextWhyButton) {
            nextWhyButton.addEventListener('click', () => {
                if (currentWhyIndex < totalWhyCards - 1) {
                    scrollToWhyCard(currentWhyIndex + 1);
                }
            });
        }

        // Function to scroll to specific why card
        function scrollToWhyCard(index) {
            const whyCards = mobileWhyContainer.querySelectorAll('.snap-center');
            if (whyCards[index]) {
                const cardWidth = 288 + 16; // card width + gap
                const scrollLeft = index * cardWidth;
                
                mobileWhyContainer.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
                
                currentWhyIndex = index;
                updateWhyActiveIndicator();
                updateWhyArrowStates();
            }
        }

        // Update active indicator based on current index
        function updateWhyActiveIndicator() {
            whyScrollIndicators.forEach((indicator, index) => {
                if (index === currentWhyIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        // Update arrow button states
        function updateWhyArrowStates() {
            if (prevWhyButton) {
                if (currentWhyIndex === 0) {
                    prevWhyButton.classList.add('disabled');
                    prevWhyButton.style.opacity = '0.5';
                } else {
                    prevWhyButton.classList.remove('disabled');
                    prevWhyButton.style.opacity = '1';
                }
            }

            if (nextWhyButton) {
                if (currentWhyIndex === totalWhyCards - 1) {
                    nextWhyButton.classList.add('disabled');
                    nextWhyButton.style.opacity = '0.5';
                } else {
                    nextWhyButton.classList.remove('disabled');
                    nextWhyButton.style.opacity = '1';
                }
            }
        }

        // Listen to scroll events for updating indicators
        let whyScrollTimeout;
        mobileWhyContainer.addEventListener('scroll', () => {
            clearTimeout(whyScrollTimeout);
            whyScrollTimeout = setTimeout(() => {
                updateWhyCurrentIndexFromScroll();
            }, 100);
        });

        // Update current index based on scroll position
        function updateWhyCurrentIndexFromScroll() {
            const scrollLeft = mobileWhyContainer.scrollLeft;
            const cardWidth = 288 + 16; // card width + gap
            const newIndex = Math.round(scrollLeft / cardWidth);
            
            if (newIndex !== currentWhyIndex && newIndex >= 0 && newIndex < totalWhyCards) {
                currentWhyIndex = newIndex;
                updateWhyActiveIndicator();
                updateWhyArrowStates();
            }
        }
        
        // Set initial states and scroll to middle card
        updateWhyActiveIndicator();
        updateWhyArrowStates();
        
        // Scroll to the middle card (Proven Results) on page load
        setTimeout(() => {
            scrollToWhyCard(1);
        }, 200);
    }
});
