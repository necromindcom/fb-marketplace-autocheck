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
        <style>
          @keyframes dropdownSlideIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .custom-dropdown-menu {
            max-height: 200px;
            overflow-y: auto;
          }
          .custom-dropdown-menu::-webkit-scrollbar {
            width: 6px;
          }
          .custom-dropdown-menu::-webkit-scrollbar-track {
            background: #f9fafb;
            border-radius: 10px;
          }
          .custom-dropdown-menu::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
          }
          .custom-dropdown-menu::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        </style>
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
                    <div id="counterSubtext" style="font-size: 11px; color: #9ca3af; margin-top: 2px; font-weight: 400;">items checked</div>
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
                    <div style="display: grid; grid-template-columns: 1fr 34px 34px; gap: 6px; align-items: center;">
                        <div style="position: relative;">
                            <div id="presetSelectTrigger" style="height: 36px; padding: 0 36px 0 12px;
                                    border: 1.5px solid #e5e7eb; border-radius: 9px; font-size: 13px;
                                    background: #fff; cursor: pointer; color: #6b7280;
                                    font-family: inherit; transition: all 0.15s; outline: none; font-weight: 500;
                                    display: flex; align-items: center; user-select: none;">
                                <span id="presetSelectValue">Load preset...</span>
                            </div>
                            <div style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
                                        pointer-events: none;">
                                <svg id="presetChevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2.5" stroke-linecap="round" style="transition: transform 0.2s;">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                            <div id="presetDropdownMenu" class="custom-dropdown-menu" style="position: absolute; top: calc(100% + 6px); left: 0; right: 0;
                                    background: white; border: 1.5px solid #e5e7eb; border-radius: 10px;
                                    box-shadow: 0 10px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
                                    display: none; z-index: 100; animation: dropdownSlideIn 0.15s ease-out; padding: 4px;">
                            </div>
                        </div>
                        <button id="savePreset" title="Save current filters as preset" style="width: 34px; height: 34px;
                                background: #10b981; border: none; border-radius: 7px; cursor: pointer;
                                display: flex; align-items: center; justify-content: center; transition: all 0.15s;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                        </button>
                        <button id="deletePreset" title="Delete selected preset" style="width: 34px; height: 34px;
                                background: #ef4444; border: none; border-radius: 7px; cursor: pointer;
                                display: flex; align-items: center; justify-content: center; transition: all 0.15s; opacity: 0.4;"
                                disabled>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
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
                           transition: all 0.15s; font-weight: 400; outline: none;">
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
                           transition: all 0.15s; font-weight: 400; outline: none;">
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
                    background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px;
                    font-size: 12px; color: #6b7280; transition: all 0.15s;">
                    <span>Click '...' on your listing → 'Add to multiple places'</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const confirmButton = modal.querySelector("#confirm");
    const counterDiv = modal.querySelector("#counterDiv");
    const messageDiv = modal.querySelector("#messageDiv");
    const includeInput = modal.querySelector("#include");
    const excludeInput = modal.querySelector("#exclude");
    const modalBody = modal.querySelector("#modalBody");
    const toggleCollapseBtn = modal.querySelector("#toggleCollapse");
    const closeWidgetBtn = modal.querySelector("#closeWidget");
    const presetSelectTrigger = modal.querySelector("#presetSelectTrigger");
    const presetSelectValue = modal.querySelector("#presetSelectValue");
    const presetDropdownMenu = modal.querySelector("#presetDropdownMenu");
    const presetChevron = modal.querySelector("#presetChevron");
    const savePresetBtn = modal.querySelector("#savePreset");
    const deletePresetBtn = modal.querySelector("#deletePreset");

    let currentPresetValue = "";
    let isDropdownOpen = false;

    let isCollapsed = false;

    // Load and populate presets
    const populatePresets = async () => {
      const presets = await loadPresets();
      presetDropdownMenu.innerHTML = '';

      // Add default option
      const defaultItem = document.createElement('div');
      defaultItem.style.cssText = `
        padding: 8px 12px; font-size: 13px; color: #9ca3af; cursor: pointer;
        transition: all 0.15s; border-radius: 6px; font-weight: 500;
      `;
      defaultItem.textContent = 'Load preset...';
      defaultItem.addEventListener('click', () => {
        currentPresetValue = "";
        presetSelectValue.textContent = 'Load preset...';
        presetSelectValue.style.color = '#6b7280';
        includeInput.value = '';
        excludeInput.value = '';
        deletePresetBtn.disabled = true;
        deletePresetBtn.style.opacity = "0.4";
        closeDropdown();
      });
      defaultItem.addEventListener('mouseenter', () => {
        defaultItem.style.background = '#f3f4f6';
      });
      defaultItem.addEventListener('mouseleave', () => {
        defaultItem.style.background = 'transparent';
      });
      presetDropdownMenu.appendChild(defaultItem);

      // Add presets
      presets.forEach(preset => {
        const item = document.createElement('div');
        item.style.cssText = `
          padding: 8px 12px; font-size: 13px; color: #1f2937; cursor: pointer;
          transition: all 0.15s; border-radius: 6px; font-weight: 500;
        `;
        item.textContent = preset.name;
        item.addEventListener('click', () => {
          currentPresetValue = preset.name;
          presetSelectValue.textContent = preset.name;
          presetSelectValue.style.color = '#1f2937';
          includeInput.value = preset.include;
          excludeInput.value = preset.exclude;
          deletePresetBtn.disabled = false;
          deletePresetBtn.style.opacity = "1";
          closeDropdown();
        });
        item.addEventListener('mouseenter', () => {
          item.style.background = '#f0f9ff';
          item.style.color = '#0284c7';
        });
        item.addEventListener('mouseleave', () => {
          item.style.background = 'transparent';
          item.style.color = '#1f2937';
        });
        presetDropdownMenu.appendChild(item);
      });
    };

    populatePresets();

    // Dropdown functions
    const openDropdown = () => {
      isDropdownOpen = true;
      presetDropdownMenu.style.display = 'block';
      presetChevron.style.transform = 'rotate(180deg)';
      presetSelectTrigger.style.borderColor = '#10b981';
      presetSelectTrigger.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.1)';
    };

    const closeDropdown = () => {
      isDropdownOpen = false;
      presetDropdownMenu.style.display = 'none';
      presetChevron.style.transform = 'rotate(0deg)';
      presetSelectTrigger.style.borderColor = '#e5e7eb';
      presetSelectTrigger.style.boxShadow = 'none';
    };

    // Toggle dropdown
    presetSelectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isDropdownOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!presetSelectTrigger.contains(e.target) && !presetDropdownMenu.contains(e.target)) {
        closeDropdown();
      }
    });

    // Hover effects
    presetSelectTrigger.addEventListener('mouseenter', () => {
      if (!isDropdownOpen) {
        presetSelectTrigger.style.borderColor = '#d1d5db';
        presetSelectTrigger.style.background = '#fafbfc';
      }
    });
    presetSelectTrigger.addEventListener('mouseleave', () => {
      if (!isDropdownOpen) {
        presetSelectTrigger.style.borderColor = '#e5e7eb';
        presetSelectTrigger.style.background = '#fff';
      }
    });

    // Load and apply collapse state
    loadCollapseState().then(savedCollapsed => {
      isCollapsed = savedCollapsed;
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
      }
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
    savePresetBtn.addEventListener("click", async () => {
      const currentPreset = currentPresetValue;
      const presets = await loadPresets();

      const savePreset = async (finalName) => {
        const existingIndex = presets.findIndex(p => p.name === finalName);

        if (existingIndex >= 0 && finalName !== currentPreset) {
          // Name exists, ask to overwrite
          showConfirmDialog(
            "Overwrite Preset?",
            `A preset named "${finalName}" already exists. Do you want to overwrite it?`,
            "Overwrite",
            "Cancel",
            async () => {
              await performSave(finalName, presets);
            },
            undefined,
            true
          );
        } else {
          await performSave(finalName, presets);
        }
      };

      const performSave = async (finalName, presets) => {
        const existingIndex = presets.findIndex(p => p.name === finalName);

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

        // Refresh dropdown
        await populatePresets();

        // Update selection
        currentPresetValue = finalName;
        presetSelectValue.textContent = finalName;
        presetSelectValue.style.color = '#1f2937';
        deletePresetBtn.disabled = false;
        deletePresetBtn.style.opacity = "1";
      };

      // If a preset is selected, ask whether to update or save as new
      if (currentPreset) {
        showConfirmDialog(
          "Update or Save As New?",
          `Do you want to update the existing preset "${currentPreset}" or save as a new preset?`,
          "Update Existing",
          "Save As New",
          () => {
            // Update existing
            savePreset(currentPreset);
          },
          () => {
            // Save as new - prompt for name
            showPromptDialog(
              "Save New Preset",
              "Enter a name for your new preset:",
              "",
              (newName) => {
                savePreset(newName);
              }
            );
          },
          false, // isDestructive
          () => {
            // onClose - just close the dialog, do nothing
          }
        );
      } else {
        // No preset selected, ask for name
        showPromptDialog(
          "Save Preset",
          "Enter a name for your preset:",
          "",
          (newName) => {
            savePreset(newName);
          }
        );
      }
    });

    deletePresetBtn.addEventListener("click", async () => {
      const selectedName = currentPresetValue;
      if (!selectedName) return;

      showConfirmDialog(
        "Delete Preset?",
        `Are you sure you want to delete the preset "${selectedName}"? This action cannot be undone.`,
        "Delete",
        "Cancel",
        async () => {
          const presets = await loadPresets();
          const filtered = presets.filter(p => p.name !== selectedName);
          await savePresets(filtered);

          // Refresh dropdown
          await populatePresets();

          // Reset selection
          currentPresetValue = "";
          presetSelectValue.textContent = "Load preset...";
          presetSelectValue.style.color = '#6b7280';
          includeInput.value = "";
          excludeInput.value = "";
          deletePresetBtn.disabled = true;
          deletePresetBtn.style.opacity = "0.4";
        },
        undefined,
        true
      );
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
        processItems(includeInput.value, excludeInput.value, messageDiv, counterDiv, confirmButton);
      } catch (error) {
        appendMessage(messageDiv, `Error: ${error.message}`);
        resetButton(confirmButton);
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

      // Save collapse state
      saveCollapseState(isCollapsed);

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
        input.style.borderColor = "#10b981";
        input.style.boxShadow = "0 0 0 4px rgba(16,185,129,0.1)";
        input.style.transform = "translateY(-1px)";
      });
      input.addEventListener("blur", () => {
        input.style.borderColor = "#e5e7eb";
        input.style.boxShadow = "none";
        input.style.transform = "translateY(0)";
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
    const MAX_CHECKED = 20;

    const counterText = counterDiv.querySelector("#counterText");
    if (counterText) {
      counterText.textContent = `${checkedCount} / ${MAX_CHECKED}`;
      counterText.style.color = '#111827';
    }
  };

  const appendMessage = (messageDiv, message) => {
    messageDiv.innerHTML = `<span>${message}</span>`;
    messageDiv.style.background = '#f9fafb';
    messageDiv.style.borderColor = '#f3f4f6';
    messageDiv.style.color = '#6b7280';
    messageDiv.scrollTop = messageDiv.scrollHeight;
  };

  const showWarningMessage = (messageDiv, message) => {
    messageDiv.innerHTML = `
      <div style="display: flex; align-items: flex-start; gap: 10px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" style="flex-shrink: 0; margin-top: 1px;">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span style="color: #991b1b; font-weight: 500; font-size: 12px; line-height: 1.5;">${message}</span>
      </div>
    `;
    messageDiv.style.background = 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
    messageDiv.style.borderColor = '#fca5a5';
    messageDiv.style.color = '#dc2626';
    messageDiv.style.padding = '12px';
    messageDiv.scrollTop = messageDiv.scrollHeight;
  };

  const processItems = (includeStr, excludeStr, messageDiv, counterDiv, confirmButton) => {
    const { include, exclude } = parseKeywords(includeStr, excludeStr);
    const checkboxes = [...document.querySelectorAll('div[role="checkbox"]')];

    if (checkboxes.length === 0) {
      showWarningMessage(messageDiv, "First, click the '...' on your listing and select 'Add to multiple places'");
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
        } catch (error) {
          errorCount++;
        }
      }, index * SCROLL_DELAY);
    });

    // Calculate how many we can still check (after unchecking completes)
    const availableSlots = MAX_CHECKED - currentlyChecked;

    // Check if no groups matched the filters
    if (toCheck.length === 0 && toUncheck.length === 0) {
      showWarningMessage(messageDiv, "No groups found matching your keywords. Try different include/exclude filters.");
      resetButton(confirmButton);
      return;
    }

    // Check if groups were found but all are excluded
    if (toCheck.length === 0 && toUncheck.length > 0) {
      // Just uncheck and finish
      toUncheck.forEach((checkbox, index) => {
        setTimeout(() => {
          try {
            checkbox.scrollIntoView({ behavior: "auto", block: "center" });
            checkbox.click();
            uncheckedCount++;
          } catch (error) {
            errorCount++;
          }
        }, index * SCROLL_DELAY);
      });

      setTimeout(() => {
        appendMessage(messageDiv, `Unchecked: ${uncheckedCount} (no groups matched your include filters)`);
        resetButton(confirmButton);
        updateCounter(counterDiv);
      }, SCROLL_DELAY * toUncheck.length + 500);
      return;
    }

    // Always show prioritization dialog when there are groups to check
    if (toCheck.length > 0) {
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
        } catch (error) {
          errorCount++;
        }
      }, uncheckDelay + (index * SCROLL_DELAY));
    });

    // Wait for all operations to complete
    const totalOperations = toUncheck.length + toCheckLimited.length;
    setTimeout(() => {
      const totalChanges = checkedCount + uncheckedCount;

      if (totalChanges === 0) {
        appendMessage(messageDiv, "No changes - all items already match your filters");
      } else {
        let message = `Checked: ${checkedCount}, Unchecked: ${uncheckedCount}`;
        if (skippedCount > 0) {
          message += ` (${skippedCount} not selected)`;
        }
        if (errorCount > 0) {
          message += `, Errors: ${errorCount}`;
        }
        appendMessage(messageDiv, message);
      }

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

  // Custom dialog utilities
  const showConfirmDialog = (title, message, confirmText = "OK", cancelText = "Cancel", onConfirm, onCancel, isDestructive = false, onClose = null) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5); z-index: 100000;
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.15s ease-out;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white; border-radius: 12px; padding: 24px;
      max-width: 400px; width: 90%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      animation: slideUp 0.2s ease-out;
    `;

    dialog.innerHTML = `
      <style>
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      </style>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">
          ${title}
        </h3>
        <button id="closeDialogBtn" style="background: transparent; border: none; padding: 4px;
                cursor: pointer; display: flex; align-items: center; border-radius: 4px; transition: all 0.15s;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <p style="margin: 0 0 20px 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
        ${message}
      </p>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button id="cancelBtn" style="padding: 10px 20px; border: 1px solid #e5e7eb;
                                      background: white; border-radius: 8px; cursor: pointer;
                                      font-size: 13px; font-weight: 500; color: #6b7280;
                                      transition: all 0.15s;">
          ${cancelText}
        </button>
        <button id="confirmBtn" style="padding: 10px 20px; border: none;
                                       background: ${isDestructive ? '#ef4444' : '#111827'}; color: white; border-radius: 8px;
                                       cursor: pointer; font-size: 13px; font-weight: 500;
                                       transition: all 0.15s;">
          ${confirmText}
        </button>
      </div>
    `;

    const confirmBtn = dialog.querySelector('#confirmBtn');
    const cancelBtn = dialog.querySelector('#cancelBtn');
    const closeDialogBtn = dialog.querySelector('#closeDialogBtn');

    confirmBtn.addEventListener('mouseenter', () => {
      confirmBtn.style.background = isDestructive ? '#dc2626' : '#1f2937';
      confirmBtn.style.transform = 'translateY(-1px)';
    });
    confirmBtn.addEventListener('mouseleave', () => {
      confirmBtn.style.background = isDestructive ? '#ef4444' : '#111827';
      confirmBtn.style.transform = 'translateY(0)';
    });

    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.background = '#f9fafb';
    });
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.background = 'white';
    });

    confirmBtn.addEventListener('click', () => {
      overlay.remove();
      if (onConfirm) onConfirm();
    });

    cancelBtn.addEventListener('click', () => {
      overlay.remove();
      if (onCancel) onCancel();
    });

    closeDialogBtn.addEventListener('click', () => {
      overlay.remove();
      // Use onClose if provided, otherwise onCancel
      if (onClose) {
        onClose();
      } else if (onCancel) {
        onCancel();
      }
    });

    closeDialogBtn.addEventListener('mouseenter', () => {
      closeDialogBtn.style.background = '#f3f4f6';
    });
    closeDialogBtn.addEventListener('mouseleave', () => {
      closeDialogBtn.style.background = 'transparent';
    });

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
  };

  const showPromptDialog = (title, message, defaultValue = "", onConfirm, onCancel) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5); z-index: 100000;
      display: flex; align-items: center; justify-content: center;
      animation: fadeIn 0.15s ease-out;
    `;

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white; border-radius: 12px; padding: 24px;
      max-width: 400px; width: 90%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      animation: slideUp 0.2s ease-out;
    `;

    dialog.innerHTML = `
      <style>
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      </style>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 16px; color: #111827; font-weight: 600;">
          ${title}
        </h3>
        <button id="closePromptBtn" style="background: transparent; border: none; padding: 4px;
                cursor: pointer; display: flex; align-items: center; border-radius: 4px; transition: all 0.15s;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
        ${message}
      </p>
      <input type="text" id="promptInput" value="${defaultValue}"
             style="width: 100%; padding: 10px 12px; border: 1.5px solid #e5e7eb;
                    border-radius: 8px; font-size: 13px; margin-bottom: 20px;
                    font-family: inherit; color: #1f2937; box-sizing: border-box;
                    transition: all 0.15s;">
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button id="cancelBtn" style="padding: 10px 20px; border: 1px solid #e5e7eb;
                                      background: white; border-radius: 8px; cursor: pointer;
                                      font-size: 13px; font-weight: 500; color: #6b7280;
                                      transition: all 0.15s;">
          Cancel
        </button>
        <button id="confirmBtn" style="padding: 10px 20px; border: none;
                                       background: #111827; color: white; border-radius: 8px;
                                       cursor: pointer; font-size: 13px; font-weight: 500;
                                       transition: all 0.15s;">
          Save
        </button>
      </div>
    `;

    const input = dialog.querySelector('#promptInput');
    const confirmBtn = dialog.querySelector('#confirmBtn');
    const cancelBtn = dialog.querySelector('#cancelBtn');
    const closePromptBtn = dialog.querySelector('#closePromptBtn');

    // Focus input and select text
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);

    // Input focus effect
    input.addEventListener('focus', () => {
      input.style.borderColor = '#111827';
      input.style.boxShadow = '0 0 0 3px rgba(17,24,39,0.05)';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = '#e5e7eb';
      input.style.boxShadow = 'none';
    });

    // Enter key to confirm
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = input.value.trim();
        if (value) {
          overlay.remove();
          if (onConfirm) onConfirm(value);
        }
      } else if (e.key === 'Escape') {
        overlay.remove();
        if (onCancel) onCancel();
      }
    });

    confirmBtn.addEventListener('mouseenter', () => {
      confirmBtn.style.background = '#1f2937';
      confirmBtn.style.transform = 'translateY(-1px)';
    });
    confirmBtn.addEventListener('mouseleave', () => {
      confirmBtn.style.background = '#111827';
      confirmBtn.style.transform = 'translateY(0)';
    });

    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.background = '#f9fafb';
    });
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.background = 'white';
    });

    confirmBtn.addEventListener('click', () => {
      const value = input.value.trim();
      if (value) {
        overlay.remove();
        if (onConfirm) onConfirm(value);
      }
    });

    cancelBtn.addEventListener('click', () => {
      overlay.remove();
      if (onCancel) onCancel();
    });

    closePromptBtn.addEventListener('click', () => {
      overlay.remove();
      if (onCancel) onCancel();
    });

    closePromptBtn.addEventListener('mouseenter', () => {
      closePromptBtn.style.background = '#f3f4f6';
    });
    closePromptBtn.addEventListener('mouseleave', () => {
      closePromptBtn.style.background = 'transparent';
    });

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
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
      <div style="margin-bottom: 16px;">
        <h3 style="margin: 0 0 6px 0; font-size: 18px; color: #111827; font-weight: 600;">
          Select Groups to Check
        </h3>
        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <div style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
                      background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span style="font-size: 13px; font-weight: 600; color: #0369a1;">
              ${checkboxes.length} matched
            </span>
          </div>
          <div style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
                      background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style="font-size: 13px; font-weight: 600; color: #92400e;">
              ${maxSelect} max
            </span>
          </div>
        </div>
      </div>
      <p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280;">
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
      const fullText = container ? container.textContent.trim() : `Group ${index + 1}`;

      // Try to split group name from member count/type
      // Find where member count starts (pattern: number + "tis./mil. členů")
      const memberPattern = /(\d[\d,\.]*\s*(?:tis\.|mil\.)\s*členů.*)/;
      const memberMatch = fullText.match(memberPattern);
      let groupName, memberInfo;

      if (memberMatch) {
        const splitIndex = fullText.indexOf(memberMatch[0]);
        groupName = fullText.substring(0, splitIndex).trim();
        memberInfo = memberMatch[0].trim();
      } else {
        // Fallback if pattern doesn't match
        groupName = fullText.substring(0, 80);
        memberInfo = fullText.length > 80 ? '...' : '';
      }

      const item = document.createElement('label');
      item.style.cssText = `
        display: flex; align-items: flex-start; gap: 10px; padding: 10px;
        border-radius: 8px; cursor: pointer; margin-bottom: 6px;
        transition: all 0.15s; border: 1.5px solid transparent;
      `;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.style.cssText = 'width: 18px; height: 18px; cursor: pointer; margin-top: 2px; flex-shrink: 0;';
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
          item.style.borderColor = '#0ea5e9';
        } else {
          selectedCheckboxes.delete(checkbox);
          item.style.background = 'transparent';
          item.style.borderColor = 'transparent';
        }
        confirmBtn.textContent = `Confirm (${selectedCheckboxes.size}/${maxSelect})`;
      });

      if (cb.checked) {
        item.style.background = '#f0f9ff';
        item.style.borderColor = '#0ea5e9';
      }

      const textContainer = document.createElement('div');
      textContainer.style.cssText = 'flex: 1; min-width: 0;';

      const nameLabel = document.createElement('div');
      nameLabel.style.cssText = 'font-size: 13px; color: #111827; font-weight: 500; margin-bottom: 4px; line-height: 1.3;';
      nameLabel.textContent = groupName;

      const metaLabel = document.createElement('div');
      metaLabel.style.cssText = 'font-size: 11px; color: #6b7280; display: flex; align-items: center; gap: 4px;';

      if (memberInfo) {
        // Add member count icon
        const icon = document.createElement('span');
        icon.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" style="display: inline-block; vertical-align: middle;">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        `;
        metaLabel.appendChild(icon);

        const infoText = document.createElement('span');
        infoText.textContent = memberInfo;
        metaLabel.appendChild(infoText);
      }

      textContainer.appendChild(nameLabel);
      if (memberInfo) textContainer.appendChild(metaLabel);

      item.appendChild(cb);
      item.appendChild(textContainer);
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
        message = "No changes - all items already match your filters";
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

  const loadCollapseState = async () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['isCollapsed'], (result) => {
        resolve(result.isCollapsed || false);
      });
    });
  };

  const saveCollapseState = (isCollapsed) => {
    chrome.storage.local.set({ isCollapsed });
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