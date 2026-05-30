document.addEventListener('DOMContentLoaded', () => {
    const readout = document.getElementById('data-readout');
    const meter = document.getElementById('collapse-meter');

    const updateTelemetry = () => {
        if (!readout) return;

        const networkType = navigator.connection ? navigator.connection.effectiveType : 'Encrypted/Unknown';
        const browserLang = navigator.language;
        const platform = navigator.platform;
        const cores = navigator.hardwareConcurrency || 'Unknown';
        
        const data = `
            > OS/PLATFORM : ${platform}<br>
            > CPU CORES   : ${cores}<br>
            > LANGUAGE    : ${browserLang}<br>
            > NETWORK     : ${networkType}<br>
            > VIEWPORT    : ${window.innerWidth}x${window.innerHeight}<br>
            > SCROLL_Z    : ${Math.floor(window.scrollY)}px
        `;
        readout.innerHTML = data;
    };

    updateTelemetry();

    window.addEventListener('scroll', () => {
        updateTelemetry();

        if (meter) {
            let stability = Math.max(0, 100 - (window.scrollY / 40));
            meter.innerText = `Stability: ${stability.toFixed(2)}%`;
            
            if (stability < 25) {
                meter.style.color = 'var(--danger)';
                document.body.style.backgroundColor = '#1a0505'; 
            } else {
                meter.style.color = 'var(--accent)';
                document.body.style.backgroundColor = 'var(--bg-color)';
            }
        }
    });
});
