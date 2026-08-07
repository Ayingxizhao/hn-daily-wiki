// Add expand/collapse all controls to navigation
function initNavControls() {
    // Remove existing controls if any
    const existingControls = document.querySelector('.nav-controls');
    if (existingControls) {
        existingControls.remove();
    }

    const nav = document.querySelector('.md-nav--primary');
    if (!nav) return;

    // Create control buttons
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'nav-controls';
    controlsDiv.innerHTML = `
        <button class="nav-control-btn" id="expand-all" title="Expand All">
            <span class="icon">▼</span> Expand All
        </button>
        <button class="nav-control-btn" id="collapse-all" title="Collapse All">
            <span class="icon">▶</span> Collapse All
        </button>
    `;

    // Insert at the top of navigation
    nav.insertBefore(controlsDiv, nav.firstChild);

    // Expand all functionality
    document.getElementById('expand-all').addEventListener('click', function() {
        expandAllRecursive();
    });

    // Collapse all functionality
    document.getElementById('collapse-all').addEventListener('click', function() {
        collapseAll();
    });
}

function collapseAll() {
    const allToggles = Array.from(document.querySelectorAll('.md-nav__toggle'));
    if (allToggles.length === 0) return;

    // Group toggles by depth
    const togglesByDepth = {};
    allToggles.forEach(function(toggle) {
        const depth = getDepth(toggle);
        if (!togglesByDepth[depth]) {
            togglesByDepth[depth] = [];
        }
        togglesByDepth[depth].push(toggle);
    });

    const depths = Object.keys(togglesByDepth).map(Number).sort((a, b) => a - b);

    // Collapse top 3 levels
    for (let i = 0; i < Math.min(3, depths.length); i++) {
        const depth = depths[i];
        togglesByDepth[depth].forEach(function(toggle) {
            if (toggle.checked) {
                toggle.checked = false;
            }
        });
    }
}

function getDepth(element) {
    let depth = 0;
    let current = element;
    while (current.parentElement) {
        depth++;
        current = current.parentElement;
    }
    return depth;
}

function expandAllRecursive() {
    let expansionCount = 0;
    const maxExpansions = 50;

    function expandVisibleToggles() {
        const navToggles = document.querySelectorAll('.md-nav__toggle:not(.expanded-by-script)');
        let foundUnchecked = false;

        navToggles.forEach(function(toggle) {
            if (!toggle.checked) {
                toggle.checked = true;
                toggle.classList.add('expanded-by-script');
                foundUnchecked = true;
                expansionCount++;
            }
        });

        if (foundUnchecked && expansionCount < maxExpansions) {
            setTimeout(expandVisibleToggles, 100);
        } else {
            document.querySelectorAll('.expanded-by-script').forEach(function(el) {
                el.classList.remove('expanded-by-script');
            });
        }
    }

    expandVisibleToggles();
}

// Initialize on first load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initNavControls, 100);
});

// Re-initialize on MkDocs instant navigation (page changes via AJAX)
document$.subscribe(function() {
    setTimeout(initNavControls, 100);
});
