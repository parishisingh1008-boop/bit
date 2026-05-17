document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('span');
    const loader = submitBtn.querySelector('.loader');
    const resultCard = document.getElementById('result-card');
    const resetBtn = document.getElementById('reset-btn');
    const formCard = document.querySelector('.form-card');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // UI Loading State
        btnText.classList.add('hidden');
        loader.classList.remove('hidden');
        submitBtn.disabled = true;
        
        // Gather Data
        const data = {
            age: document.getElementById('age').value,
            glucose: document.getElementById('glucose').value,
            bloodPressure: document.getElementById('bloodPressure').value,
            bmi: document.getElementById('bmi').value,
            fatigue: document.getElementById('fatigue').checked ? 1 : 0,
            fever: document.getElementById('fever').checked ? 1 : 0
        };

        try {
            // API Call
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Prediction failed');
            }

            // Simulate slight network delay for better UX feeling
            setTimeout(() => {
                displayResult(result);
            }, 600);

        } catch (error) {
            alert('Error: ' + error.message);
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });

    resetBtn.addEventListener('click', () => {
        resultCard.classList.add('hidden');
        formCard.style.display = 'block';
        form.reset();
        
        // Reset button state
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
        submitBtn.disabled = false;
        
        // Reset classes
        const categoryDisplay = document.getElementById('risk-category');
        categoryDisplay.className = 'category-display';
        
        const meterFill = document.getElementById('meter-fill');
        meterFill.className = 'meter-fill';
        meterFill.style.width = '0%';
        
        formCard.style.animation = 'slideUp 0.5s ease-out forwards';
    });

    function displayResult(result) {
        formCard.style.display = 'none';
        resultCard.classList.remove('hidden');
        
        const categoryDisplay = document.getElementById('risk-category');
        const probabilityDisplay = document.getElementById('risk-probability');
        const meterFill = document.getElementById('meter-fill');
        
        categoryDisplay.textContent = result.category;
        
        // Animate counter
        animateValue(probabilityDisplay, 0, result.probability, 1000);
        
        // Setup styling based on category
        let colorClass = '';
        let bgClass = '';
        let width = result.probability + '%';
        
        if (result.category.includes('Low')) {
            colorClass = 'risk-low';
            bgClass = 'bg-low';
            // Adjust visual width to make sense even with low prob
            width = Math.max(10, result.probability) + '%';
        } else if (result.category.includes('Medium')) {
            colorClass = 'risk-medium';
            bgClass = 'bg-medium';
        } else {
            colorClass = 'risk-high';
            bgClass = 'bg-high';
        }
        
        categoryDisplay.classList.add(colorClass);
        meterFill.classList.add(bgClass);
        
        // Trigger meter animation
        setTimeout(() => {
            meterFill.style.width = width;
        }, 100);
    }

    // Number animation function
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = (progress * (end - start) + start).toFixed(1);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});
