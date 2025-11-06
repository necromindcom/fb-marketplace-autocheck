(() => {
  const SCROLL_DELAY = 100;
  const CONTAINER_SELECTORS = [
    'div[data-testid="marketplace_feed_item"]',
    'div[role="article"]',
    "div.x1yztbdb",
    "div.x9f619.x1n2onr6",
    "div.x1jx94hy",
  ];

  let widgetExists = false;
  let currentUrl = window.location.href;

  const isCorrectPage = () => {
    return window.location.href.includes('marketplace/you/selling') ||
           window.location.href.includes('marketplace/you/dashboard');
  };

  const checkAndCreateWidget = async () => {
    const existingModal = document.getElementById('marketplaceFilterModal');

    if (isCorrectPage()) {
      if (!existingModal && !widgetExists) {
        console.log("Auto Groups Checker: Creating widget on correct page");
        await createUI();
        widgetExists = true;
      }
    } else {
      if (existingModal) {
        console.log("Auto Groups Checker: Removing widget - not on correct page");
        existingModal.remove();
        widgetExists = false;
      }
    }
  };

  const setupUrlListener = () => {
    // Detect URL changes in SPA (Single Page Application)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
      originalPushState.apply(this, arguments);
      setTimeout(checkAndCreateWidget, 500);
    };

    history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      setTimeout(checkAndCreateWidget, 500);
    };

    // Listen for back/forward navigation
    window.addEventListener('popstate', () => {
      setTimeout(checkAndCreateWidget, 500);
    });

    // Fallback: Check URL periodically
    setInterval(() => {
      if (currentUrl !== window.location.href) {
        currentUrl = window.location.href;
        checkAndCreateWidget();
      }
    }, 1000);
  };

  const main = () => {
    // Initial check
    checkAndCreateWidget();

    // Setup listeners for URL changes
    setupUrlListener();

    console.log("Auto Groups Checker: Monitoring URL changes...");
  };

  const createUI = async () => {

    const modal = document.createElement("div");
    modal.id = "marketplaceFilterModal";
    modal.style.position = "fixed";

    // Calculate initial position with safe margins
    const modalWidth = 320;
    const modalMargin = 20;
    const initialTop = 70;
    const initialLeft = Math.max(modalMargin, window.innerWidth - modalWidth - modalMargin);

    // Load saved position or use default
    const savedPosition = await loadWidgetPosition();
    modal.style.top = savedPosition ? `${savedPosition.top}px` : `${initialTop}px`;
    modal.style.left = savedPosition ? `${savedPosition.left}px` : `${initialLeft}px`;
    modal.style.background = "transparent";
    modal.style.borderRadius = "12px";
    modal.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
    modal.style.zIndex = "99999";
    modal.style.opacity = "0.95";
    modal.style.width = `${modalWidth}px`;
    modal.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', Arial, sans-serif";
    modal.style.boxSizing = "border-box";
    modal.style.touchAction = "none";
    modal.style.userSelect = "none";
    modal.innerHTML = `
        <div style="background: rgba(255,255,255,0.96); backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px); border-radius: 16px; overflow: hidden;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04);
                    border: 1px solid rgba(255,255,255,0.8);">
            <div style="background: #fff; border-bottom: 1px solid rgba(0,0,0,0.06);
                        padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;
                        cursor: move; user-select: none;" id="modalHeader">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 6px; height: 6px; background: #10b981; border-radius: 50%;"></div>
                    <span style="font-weight: 500; font-size: 13px; color: #1f2937; letter-spacing: -0.01em;">Auto Groups Checker</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <button id="toggleCollapse" style="background: transparent; border: none;
                            padding: 4px; border-radius: 6px; cursor: pointer; display: flex; align-items: center;
                            transition: all 0.15s; width: 22px; height: 22px; justify-content: center;"
                            title="Collapse/Expand">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </button>
                    <button id="closeWidget" style="background: transparent; border: none;
                            padding: 4px; border-radius: 6px; cursor: pointer; display: flex; align-items: center;
                            transition: all 0.15s; width: 22px; height: 22px; justify-content: center;"
                            title="Close">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div id="modalBody" style="padding: 16px; display: grid; gap: 12px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                <!-- Counter -->
                <div id="counterDiv" style="background: #f9fafb; border: 1px solid #e5e7eb;
                                            padding: 12px; border-radius: 10px; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 6px;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span style="font-size: 10px; font-weight: 500; color: #6b7280;
                                    text-transform: uppercase; letter-spacing: 0.8px;">Status</span>
                    </div>
                    <div id="counterText" style="font-size: 22px; font-weight: 600; color: #111827; letter-spacing: -0.02em;">0 / 20</div>
                    <div style="font-size: 11px; color: #9ca3af; margin-top: 2px; font-weight: 400;">items checked</div>
                </div>

                <!-- Presets Section -->
                <div style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                            border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px;">
                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                            <polyline points="17 21 17 13 7 13 7 21"/>
                            <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        <span style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">
                            Saved Presets
                        </span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr auto auto; gap: 6px; align-items: center;">
                        <select id="presetSelect" style="height: 34px; padding: 0 28px 0 10px;
                                border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 12px;
                                background: #fff url('data:image/svg+xml;charset=UTF-8,%3csvg width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e') no-repeat;
                                background-position: right 8px center; background-size: 12px;
                                appearance: none; cursor: pointer; color: #1f2937; font-family: inherit;
                                transition: all 0.15s;">
                            <option value="">Load preset...</option>
                        </select>
                        <button id="savePreset" title="Save as new preset" style="height: 34px; padding: 0 12px;
                                background: #10b981; border: none; border-radius: 7px; cursor: pointer;
                                display: flex; align-items: center; gap: 6px; transition: all 0.15s;
                                font-size: 11px; font-weight: 600; color: white;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            <span>Save</span>
                        </button>
                        <button id="deletePreset" title="Delete preset" style="height: 34px; padding: 0 12px;
                                background: #ef4444; border: none; border-radius: 7px; cursor: pointer;
                                display: flex; align-items: center; gap: 6px; transition: all 0.15s; opacity: 0.4;
                                font-size: 11px; font-weight: 600; color: white;"
                                disabled>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                            <span>Del</span>
                        </button>
                    </div>
                </div>

                <!-- Include Input -->
                <div style="position: relative;">
                    <div style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
                                display: flex; align-items: center; justify-content: center; z-index: 1;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </div>
                    <input type="text" id="include" placeholder="Include keywords"
                           style="width: 100%; height: 40px; padding: 10px 14px 10px 40px;
                           border: 1.5px solid #e5e7eb; border-radius: 10px; box-sizing: border-box;
                           font-size: 13px; background: #fff; font-family: inherit; color: #1f2937;
                           transition: all 0.15s; font-weight: 400;">
                </div>

                <!-- Exclude Input -->
                <div style="position: relative;">
                    <div style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
                                display: flex; align-items: center; justify-content: center; z-index: 1;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                    </div>
                    <input type="text" id="exclude" placeholder="Exclude keywords"
                           style="width: 100%; height: 40px; padding: 10px 14px 10px 40px;
                           border: 1.5px solid #e5e7eb; border-radius: 10px; box-sizing: border-box;
                           font-size: 13px; background: #fff; font-family: inherit; color: #1f2937;
                           transition: all 0.15s; font-weight: 400;">
                </div>

                <!-- Hints -->
                <div style="background: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 8px; padding: 10px 12px;">
                    <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" style="flex-shrink: 0; margin-top: 1px;">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="16" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                        <div style="font-size: 11px; color: #0369a1; line-height: 1.5;">
                            <strong style="font-weight: 600;">Separate keywords with commas</strong><br>
                            Example: games, xbox, playstation
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" style="flex-shrink: 0;">
                            <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/>
                        </svg>
                        <span style="font-size: 11px; color: #0369a1;">Drag widget by the header to reposition</span>
                    </div>
                </div>

                <!-- Run Button -->
                <button id="confirm" style="width: 100%; height: 42px; padding: 0;
                    background: #111827; color: white;
                    border: none; border-radius: 10px; font-weight: 500; cursor: pointer; font-size: 13px;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                    transition: all 0.15s; letter-spacing: -0.01em; margin-top: 4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                    <span>Run Checker</span>
                </button>

                <!-- Message Area -->
                <div id="messageDiv" style="min-height: 36px; padding: 10px 12px;
                                           background: #f9fafb; border-radius: 8px;
                                           font-size: 11px; color: #6b7280; display: flex; align-items: center; justify-content: center;
                                           font-weight: 400; border: 1px solid #f3f4f6;">
                    <span>Ready to check</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const confirmButton = modal.querySelector("#confirm");
    const messageDiv = modal.querySelector("#messageDiv");
    const counterDiv = modal.querySelector("#counterDiv");
    const includeInput = modal.querySelector("#include");
    const excludeInput = modal.querySelector("#exclude");
    const modalBody = modal.querySelector("#modalBody");
    const toggleCollapseBtn = modal.querySelector("#toggleCollapse");
    const closeWidgetBtn = modal.querySelector("#closeWidget");
    const presetSelect = modal.querySelector("#presetSelect");
    const savePresetBtn = modal.querySelector("#savePreset");
    const deletePresetBtn = modal.querySelector("#deletePreset");

    let isCollapsed = false;

    // Update counter after short delay to ensure DOM is ready
    setTimeout(() => updateCounter(counterDiv), 300);

    // Load and populate presets
    loadPresets().then(presets => {
      presets.forEach(preset => {
        const option = document.createElement('option');
        option.value = preset.name;
        option.textContent = preset.name;
        presetSelect.appendChild(option);
      });
    });

    // Initialize dragging immediately
    initializeDragging(modal);

    // Ensure widget stays in viewport on window resize
    const ensureInViewport = () => {
      const rect = modal.getBoundingClientRect();
      const margin = 20;

      let newLeft = parseFloat(modal.style.left);
      let newTop = parseFloat(modal.style.top);

      // Check right boundary
      if (rect.right > window.innerWidth - margin) {
        newLeft = window.innerWidth - rect.width - margin;
      }

      // Check left boundary
      if (rect.left < margin) {
        newLeft = margin;
      }

      // Check bottom boundary
      if (rect.bottom > window.innerHeight - margin) {
        newTop = window.innerHeight - rect.height - margin;
      }

      // Check top boundary
      if (rect.top < margin) {
        newTop = margin;
      }

      modal.style.left = `${newLeft}px`;
      modal.style.top = `${newTop}px`;
    };

    window.addEventListener('resize', ensureInViewport);

    // Ensure widget is in viewport on initial load
    setTimeout(ensureInViewport, 100);

    // Preset functionality
    presetSelect.addEventListener("change", async () => {
      const selectedName = presetSelect.value;
      if (!selectedName) {
        deletePresetBtn.disabled = true;
        deletePresetBtn.style.opacity = "0.4";
        return;
      }

      const presets = await loadPresets();
      const preset = presets.find(p => p.name === selectedName);
      if (preset) {
        includeInput.value = preset.include;
        excludeInput.value = preset.exclude;
        deletePresetBtn.disabled = false;
        deletePresetBtn.style.opacity = "1";
      }
    });

    savePresetBtn.addEventListener("click", async () => {
      const currentPreset = presetSelect.value;
      const presets = await loadPresets();

      let finalName = null;

      // If a preset is selected, ask whether to update or save as new
      if (currentPreset) {
        const choice = confirm(`Update existing preset "${currentPreset}"?\n\nOK = Update existing\nCancel = Save as new preset`);

        if (choice) {
          // Update existing
          finalName = currentPreset;
        } else {
          // Save as new
          const newName = prompt("Enter new preset name:");
          if (!newName || !newName.trim()) return;
          finalName = newName.trim();
        }
      } else {
        // No preset selected, ask for name
        const newName = prompt("Enter preset name:");
        if (!newName || !newName.trim()) return;
        finalName = newName.trim();
      }

      // Check if name already exists (and it's not the one we're updating)
      const existingIndex = presets.findIndex(p => p.name === finalName);

      if (existingIndex >= 0 && finalName !== currentPreset) {
        if (!confirm(`Preset "${finalName}" already exists. Overwrite?`)) return;
      }

      const newPreset = {
        name: finalName,
        include: includeInput.value,
        exclude: excludeInput.value
      };

      if (existingIndex >= 0) {
        presets[existingIndex] = newPreset;
      } else {
        presets.push(newPreset);
      }

      await savePresets(presets);

      // Refresh select options
      presetSelect.innerHTML = '<option value="">Load preset...</option>';
      presets.forEach(preset => {
        const option = document.createElement('option');
        option.value = preset.name;
        option.textContent = preset.name;
        presetSelect.appendChild(option);
      });

      presetSelect.value = finalName;
      deletePresetBtn.disabled = false;
      deletePresetBtn.style.opacity = "1";
    });

    deletePresetBtn.addEventListener("click", async () => {
      const selectedName = presetSelect.value;
      if (!selectedName) return;

      if (!confirm(`Delete preset "${selectedName}"?`)) return;

      const presets = await loadPresets();
      const filtered = presets.filter(p => p.name !== selectedName);
      await savePresets(filtered);

      // Refresh select options
      presetSelect.innerHTML = '<option value="">Load preset...</option>';
      filtered.forEach(preset => {
        const option = document.createElement('option');
        option.value = preset.name;
        option.textContent = preset.name;
        presetSelect.appendChild(option);
      });

      presetSelect.value = "";
      includeInput.value = "";
      excludeInput.value = "";
      deletePresetBtn.disabled = true;
      deletePresetBtn.style.opacity = "0.4";
    });

    // Add hover effects for preset buttons
    savePresetBtn.addEventListener("mouseenter", () => {
      savePresetBtn.style.background = "#059669";
      savePresetBtn.style.transform = "translateY(-1px)";
      savePresetBtn.style.boxShadow = "0 4px 8px rgba(16,185,129,0.3)";
    });
    savePresetBtn.addEventListener("mouseleave", () => {
      savePresetBtn.style.background = "#10b981";
      savePresetBtn.style.transform = "translateY(0)";
      savePresetBtn.style.boxShadow = "none";
    });

    deletePresetBtn.addEventListener("mouseenter", () => {
      if (!deletePresetBtn.disabled) {
        deletePresetBtn.style.background = "#dc2626";
        deletePresetBtn.style.transform = "translateY(-1px)";
        deletePresetBtn.style.boxShadow = "0 4px 8px rgba(239,68,68,0.3)";
      }
    });
    deletePresetBtn.addEventListener("mouseleave", () => {
      deletePresetBtn.style.background = "#ef4444";
      deletePresetBtn.style.transform = "translateY(0)";
      deletePresetBtn.style.boxShadow = "none";
    });

    confirmButton.addEventListener("click", () => {
      try {
        confirmButton.style.opacity = "0.7";
        confirmButton.style.transform = "scale(0.98)";
        confirmButton.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" style="animation: spin 0.8s linear infinite;">
            <circle cx="12" cy="12" r="10" opacity="0.2"/>
            <path d="M12 2 A10 10 0 0 1 22 12" opacity="1"/>
          </svg>
          <style>
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
          <span>Checking...</span>
        `;
        confirmButton.style.background = "#1f2937";
        appendMessage(messageDiv, "Checking items...");
        processItems(includeInput.value, excludeInput.value, messageDiv, counterDiv, confirmButton);
      } catch (error) {
        appendMessage(messageDiv, `Error: ${error.message}`);
      }
    });

    const handleEnterKey = (event) => {
      if (event.key === 'Enter') {
        confirmButton.click();
      }
    };

    includeInput.addEventListener("keydown", handleEnterKey);
    excludeInput.addEventListener("keydown", handleEnterKey);

    // Toggle collapse/expand
    toggleCollapseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      isCollapsed = !isCollapsed;

      const svg = toggleCollapseBtn.querySelector('svg');

      if (isCollapsed) {
        modalBody.style.maxHeight = "0";
        modalBody.style.padding = "0 16px";
        modalBody.style.opacity = "0";
        modalBody.style.overflow = "hidden";
        if (svg) {
          svg.innerHTML = '<polyline points="6 15 12 9 18 15"/>';
        }
        toggleCollapseBtn.style.background = "#f3f4f6";
      } else {
        modalBody.style.maxHeight = "1000px";
        modalBody.style.padding = "16px";
        modalBody.style.opacity = "1";
        modalBody.style.overflow = "visible";
        if (svg) {
          svg.innerHTML = '<polyline points="6 9 12 15 18 9"/>';
        }
        toggleCollapseBtn.style.background = "transparent";
      }
    });

    // Close widget
    closeWidgetBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      modal.style.transition = "all 0.3s ease-out";
      modal.style.opacity = "0";
      modal.style.transform = "scale(0.9)";
      setTimeout(() => {
        modal.remove();
        widgetExists = false;
      }, 300);
    });

    // Hover effects for buttons
    [toggleCollapseBtn, closeWidgetBtn].forEach(btn => {
      btn.addEventListener("mouseenter", () => {
        btn.style.background = "#f3f4f6";
      });
      btn.addEventListener("mouseleave", () => {
        if (btn === toggleCollapseBtn && isCollapsed) {
          btn.style.background = "#f3f4f6";
        } else {
          btn.style.background = "transparent";
        }
      });
    });

    // Button hover effect
    confirmButton.addEventListener("mouseenter", () => {
      confirmButton.style.background = "#1f2937";
      confirmButton.style.transform = "translateY(-1px)";
      confirmButton.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    });
    confirmButton.addEventListener("mouseleave", () => {
      if (confirmButton.style.opacity !== "0.7") {
        confirmButton.style.background = "#111827";
        confirmButton.style.transform = "translateY(0)";
        confirmButton.style.boxShadow = "none";
      }
    });

    // Input focus effects
    [includeInput, excludeInput].forEach(input => {
      input.addEventListener("focus", () => {
        input.style.borderColor = "#111827";
        input.style.boxShadow = "0 0 0 3px rgba(17,24,39,0.05)";
      });
      input.addEventListener("blur", () => {
        input.style.borderColor = "#e5e7eb";
        input.style.boxShadow = "none";
      });
    });
  };

  const initializeDragging = (modal) => {
    const header = modal.querySelector('#modalHeader');
    if (!header) return;

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    const onMouseDown = (e) => {
      // Only drag on left click
      if (e.button !== 0) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;

      // Get current position
      const rect = modal.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      // Change cursor
      modal.style.cursor = 'grabbing';
      header.style.cursor = 'grabbing';

      // Prevent text selection
      e.preventDefault();
      e.stopPropagation();
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;

      e.preventDefault();
      e.stopPropagation();

      // Calculate new position
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newLeft = initialLeft + deltaX;
      let newTop = initialTop + deltaY;

      // Keep within viewport bounds with margin
      const margin = 20;
      const maxX = window.innerWidth - modal.offsetWidth - margin;
      const maxY = window.innerHeight - modal.offsetHeight - margin;

      newLeft = Math.max(margin, Math.min(newLeft, maxX));
      newTop = Math.max(margin, Math.min(newTop, maxY));

      // Apply new position
      modal.style.left = newLeft + 'px';
      modal.style.top = newTop + 'px';
    };

    const onMouseUp = (e) => {
      if (!isDragging) return;

      isDragging = false;
      modal.style.cursor = 'default';
      header.style.cursor = 'move';

      // Save new position
      const top = parseFloat(modal.style.top);
      const left = parseFloat(modal.style.left);
      saveWidgetPosition(top, left);

      e.preventDefault();
      e.stopPropagation();
    };

    // Add event listeners
    header.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    console.log('Simple drag initialized');
  };

  const updateCounter = (counterDiv) => {
    const checkboxes = [...document.querySelectorAll('div[role="checkbox"]')];
    const checkedCount = checkboxes.filter(cb => cb.getAttribute("aria-checked") === "true").length;

    const counterText = counterDiv.querySelector("#counterText");
    if (counterText) {
      counterText.textContent = `${checkedCount} / 20`;
    }
  };

  const appendMessage = (messageDiv, message) => {
    messageDiv.innerHTML = `<span>${message}</span>`;
    messageDiv.scrollTop = messageDiv.scrollHeight;
  };

  const processItems = (includeStr, excludeStr, messageDiv, counterDiv, confirmButton) => {
    const { include, exclude } = parseKeywords(includeStr, excludeStr);
    const checkboxes = [...document.querySelectorAll('div[role="checkbox"]')];

    if (checkboxes.length === 0) {
      appendMessage(messageDiv, "No checkboxes found on page");
      resetButton(confirmButton);
      return;
    }

    const MAX_CHECKED = 20;
    let checkedCount = 0;
    let uncheckedCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    // Separate checkboxes into two groups: to uncheck and to check
    const toUncheck = [];
    const toCheck = [];
    let currentlyChecked = 0;

    checkboxes.forEach((checkbox) => {
      const container = findItemContainer(checkbox);
      if (!container) return;
      const text = normalizeText(container.textContent);
      const isChecked = checkbox.getAttribute("aria-checked") === "true";
      const shouldInclude =
        include.length === 0 || include.some((kw) => text.includes(kw));
      const shouldExclude = exclude.some((kw) => text.includes(kw));

      if (isChecked) {
        if (!shouldInclude || shouldExclude) {
          toUncheck.push(checkbox);
        } else {
          currentlyChecked++; // Count checkboxes that should stay checked
        }
      } else if (shouldInclude && !shouldExclude) {
        toCheck.push(checkbox);
      }
    });

    // First, uncheck all that should be unchecked
    toUncheck.forEach((checkbox, index) => {
      setTimeout(() => {
        try {
          checkbox.scrollIntoView({ behavior: "auto", block: "center" });
          checkbox.click();
          uncheckedCount++;
          updateCounter(counterDiv);
        } catch (error) {
          errorCount++;
        }
      }, index * SCROLL_DELAY);
    });

    // Calculate how many we can still check (after unchecking completes)
    const availableSlots = MAX_CHECKED - currentlyChecked;

    // If more groups match than available slots, show prioritization dialog
    if (toCheck.length > availableSlots) {
      showGroupPrioritizationDialog(
        toCheck,
        availableSlots,
        (selectedCheckboxes) => {
          const toCheckLimited = selectedCheckboxes;
          const skipped = toCheck.length - toCheckLimited.length;
          executeChecking(toCheckLimited, toUncheck, skipped, messageDiv, counterDiv, confirmButton);
        },
        () => {
          resetButton(confirmButton);
        }
      );
      return;
    }

    const toCheckLimited = toCheck.slice(0, availableSlots);
    skippedCount = toCheck.length - toCheckLimited.length;

    // Then, check all that should be checked (up to limit)
    const uncheckDelay = toUncheck.length * SCROLL_DELAY;
    toCheckLimited.forEach((checkbox, index) => {
      setTimeout(() => {
        try {
          checkbox.scrollIntoView({ behavior: "auto", block: "center" });
          checkbox.click();
          checkedCount++;
          updateCounter(counterDiv);
        } catch (error) {
          errorCount++;
        }
      }, uncheckDelay + (index * SCROLL_DELAY));
    });

    // Wait for all operations to complete
    const totalOperations = toUncheck.length + toCheckLimited.length;
    setTimeout(() => {
      const totalChanges = checkedCount + uncheckedCount;
      let message = '';

      if (totalChanges === 0) {
        message = "No changes - all items match";
      } else {
        message = `Checked: ${checkedCount}, Unchecked: ${uncheckedCount}`;
        if (skippedCount > 0) {
          message += ` (${skippedCount} skipped - limit 20)`;
        }
        if (errorCount > 0) {
          message += `, Errors: ${errorCount}`;
        }
      }

      appendMessage(messageDiv, message);
      resetButton(confirmButton);
      updateCounter(counterDiv);
    }, SCROLL_DELAY * totalOperations + 500);
  };

  const resetButton = (confirmButton) => {
    confirmButton.style.opacity = "1";
    confirmButton.style.transform = "translateY(0)";
    confirmButton.style.background = "#111827";
    confirmButton.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
      <span>Run Checker</span>
    `;
  };

  const parseKeywords = (includeStr, excludeStr) => ({
    include: splitAndNormalize(includeStr),
    exclude: splitAndNormalize(excludeStr),
  });

  const splitAndNormalize = (str) =>
    (str || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(normalizeText);

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\wčšžříťňďěáéíóúůý]/g, "")
      .replace(/\s+/g, " ");
  };

  const findItemContainer = (element) => {
    for (const selector of CONTAINER_SELECTORS) {
      const container = element.closest(selector);
      if (container) return container;
    }
    return element.closest("div")?.parentElement;
  };

  const showGroupPrioritizationDialog = (checkboxes, maxSelect, onConfirm, onCancel) => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5); z-index: 100000;
      display: flex; align-items: center; justify-content: center;
    `;

    // Create dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white; border-radius: 16px; padding: 24px;
      max-width: 500px; max-height: 70vh; width: 90%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      display: flex; flex-direction: column;
    `;

    dialog.innerHTML = `
      <h3 style="margin: 0 0 12px 0; font-size: 18px; color: #111827; font-weight: 600;">
        Select Groups to Check (${maxSelect} max)
      </h3>
      <p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280;">
        ${checkboxes.length} groups match your filters, but you can only check ${maxSelect}.
        Select which groups you want to check:
      </p>
      <div id="groupList" style="flex: 1; overflow-y: auto; border: 1px solid #e5e7eb;
                                    border-radius: 8px; padding: 12px; margin-bottom: 16px;">
      </div>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button id="cancelBtn" style="padding: 10px 20px; border: 1px solid #e5e7eb;
                                      background: white; border-radius: 8px; cursor: pointer;
                                      font-size: 13px; font-weight: 500; color: #6b7280;">
          Cancel
        </button>
        <button id="confirmBtn" style="padding: 10px 20px; border: none;
                                       background: #111827; color: white; border-radius: 8px;
                                       cursor: pointer; font-size: 13px; font-weight: 500;">
          Confirm Selection
        </button>
      </div>
    `;

    const groupList = dialog.querySelector('#groupList');
    const selectedCheckboxes = new Set();

    checkboxes.forEach((checkbox, index) => {
      const container = findItemContainer(checkbox);
      const text = container ? container.textContent.trim().substring(0, 100) : `Group ${index + 1}`;

      const item = document.createElement('label');
      item.style.cssText = `
        display: flex; align-items: center; gap: 8px; padding: 8px;
        border-radius: 6px; cursor: pointer; margin-bottom: 4px;
        transition: background 0.15s;
      `;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.style.cssText = 'width: 16px; height: 16px; cursor: pointer;';
      cb.checked = index < maxSelect; // Pre-select first N
      if (cb.checked) selectedCheckboxes.add(checkbox);

      cb.addEventListener('change', () => {
        if (cb.checked) {
          if (selectedCheckboxes.size >= maxSelect) {
            cb.checked = false;
            return;
          }
          selectedCheckboxes.add(checkbox);
          item.style.background = '#f0f9ff';
        } else {
          selectedCheckboxes.delete(checkbox);
          item.style.background = 'transparent';
        }
        confirmBtn.textContent = `Confirm (${selectedCheckboxes.size}/${maxSelect})`;
      });

      if (cb.checked) item.style.background = '#f0f9ff';

      const label = document.createElement('span');
      label.style.cssText = 'font-size: 13px; color: #1f2937; flex: 1;';
      label.textContent = text;

      item.appendChild(cb);
      item.appendChild(label);
      groupList.appendChild(item);

      item.addEventListener('mouseenter', () => {
        if (!cb.checked) item.style.background = '#f9fafb';
      });
      item.addEventListener('mouseleave', () => {
        if (!cb.checked) item.style.background = 'transparent';
      });
    });

    const confirmBtn = dialog.querySelector('#confirmBtn');
    const cancelBtn = dialog.querySelector('#cancelBtn');

    confirmBtn.textContent = `Confirm (${selectedCheckboxes.size}/${maxSelect})`;

    confirmBtn.addEventListener('click', () => {
      overlay.remove();
      onConfirm(Array.from(selectedCheckboxes));
    });

    cancelBtn.addEventListener('click', () => {
      overlay.remove();
      onCancel();
    });

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  };

  const executeChecking = (toCheckLimited, toUncheck, skippedCount, messageDiv, counterDiv, confirmButton) => {
    let checkedCount = 0;
    let uncheckedCount = 0;
    let errorCount = 0;

    // First, uncheck (if not already done)
    toUncheck.forEach((checkbox, index) => {
      setTimeout(() => {
        try {
          checkbox.scrollIntoView({ behavior: "auto", block: "center" });
          checkbox.click();
          uncheckedCount++;
          updateCounter(counterDiv);
        } catch (error) {
          errorCount++;
        }
      }, index * SCROLL_DELAY);
    });

    // Then, check selected groups
    const uncheckDelay = toUncheck.length * SCROLL_DELAY;
    toCheckLimited.forEach((checkbox, index) => {
      setTimeout(() => {
        try {
          checkbox.scrollIntoView({ behavior: "auto", block: "center" });
          checkbox.click();
          checkedCount++;
          updateCounter(counterDiv);
        } catch (error) {
          errorCount++;
        }
      }, uncheckDelay + (index * SCROLL_DELAY));
    });

    // Wait for all operations to complete
    const totalOperations = toUncheck.length + toCheckLimited.length;
    setTimeout(() => {
      const totalChanges = checkedCount + uncheckedCount;
      let message = '';

      if (totalChanges === 0) {
        message = "No changes - all items match";
      } else {
        message = `Checked: ${checkedCount}, Unchecked: ${uncheckedCount}`;
        if (skippedCount > 0) {
          message += ` (${skippedCount} not selected)`;
        }
        if (errorCount > 0) {
          message += `, Errors: ${errorCount}`;
        }
      }

      appendMessage(messageDiv, message);
      resetButton(confirmButton);
      updateCounter(counterDiv);
    }, SCROLL_DELAY * totalOperations + 500);
  };

  // Storage functions
  const loadWidgetPosition = async () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['widgetPosition'], (result) => {
        resolve(result.widgetPosition || null);
      });
    });
  };

  const saveWidgetPosition = (top, left) => {
    chrome.storage.local.set({ widgetPosition: { top, left } });
  };

  const loadPresets = async () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['presets'], (result) => {
        resolve(result.presets || []);
      });
    });
  };

  const savePresets = (presets) => {
    chrome.storage.local.set({ presets });
  };

  try {
    main();
  } catch (error) {
    console.error("Unexpected error:", error);
  }
})();