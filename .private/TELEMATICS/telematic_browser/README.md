## Architecture

- `index.html`: The static entry point.
- `telematic.html`: The core interactive environment (Two-Way Mirror).
- `styles.css`: Terminal-inspired, high-contrast aesthetic.
- `scripts.js`: Handles live client-side data extraction (hardware, network, scroll depth) and drives the stability simulation.

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Albert Lane | The Forward Path</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container entrance-container">
        <header>
            <h1>Albert Lane</h1>
            <p class="subtitle">System Architect</p>
        </header>
        
        <main>
            <p>Navigation here does not happen laterally. We only move forward.</p>
            <a href="telematic.html" class="btn-forward">Initiate Telematic Mirror</a>
        </main>
    </div>
</body>
</html>

