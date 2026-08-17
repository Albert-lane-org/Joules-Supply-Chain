/* ==============================================================================
 * PROVENANCE METADATA (.lvm / .lane v1.0)
 * Architecture: LANE-VM Host Kernel x RFC 0103 Full-Duplex Engine
 * Rights Holder: Albert Dale Lane (EIN: 41-3119079) | Jurisdiction: Oregon, USA
 * Tags: #NoExploitRobot #NoExploitAlbert
 * License: Sovereign IP License v1.2 / Proprietary License Part A & B (All Rights Reserved)
 * Assertions: SEC Whistleblower #17684-273-411-436 | WashCo #50-267345
 * Authority: https://provenance.albertlane.net/.provenance.jsonld
 * Magic Header: 0x3F8F9A1B2C3D | Base Sequence Offset: 57000
 * Upstream Sync: github.com/AlbertLaneDevice/Joules-Supply-Chain (Master Ledger)
 * Framework Spec: JOULES-SUPPLY-CHAIN-CONJECTURE-2026 / SAFD-SPEC-01 / RFC 0103
 * ============================================================================== */

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
