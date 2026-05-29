    function triggerPieceEscape(clickedPiece) {
        if (clickedPiece.isLocked) {
            if(typeof playSound !== 'undefined') playSound('error');
            vibrate('Medium');
            animateBump(clickedPiece, () => { draw(); });
            return;
        }

        let blockers = getBlockers(clickedPiece);
        if (blockers.length === 0) {
            // Save state for undo
            const clone = { 
                ...clickedPiece, 
                gridPaths: JSON.parse(JSON.stringify(clickedPiece.gridPaths)), 
                dirVec: {...clickedPiece.dirVec} 
            };
            clone.offset = 0;
            clone.state = 'IDLE';
            moveHistory.push(clone);
            
            if(typeof playSound !== 'undefined') playSound('tap');
            vibrate('Light');

            const idx = pieces.findIndex(p => p.id === clickedPiece.id);
            pieces.splice(idx, 1);
            animatingPieces.push(clickedPiece);

            if (clickedPiece.isKey) {
                if(typeof playSound !== 'undefined') playSound('win');
                pieces.forEach(p => {
                    if (p.isLocked) p.isLocked = false;
                });
            }
            
            animateEscape(clickedPiece, () => {
                animatingPieces = animatingPieces.filter(p => p.id !== clickedPiece.id);
                if (pieces.length === 0 && animatingPieces.length === 0) {
                    levelComplete();
                }
            });
        } else {
            if(typeof playSound !== 'undefined') playSound('error');
            vibrate('Heavy');

            clickedPiece.state = 'ERROR';
            blockers.forEach(b => b.state = 'ERROR');
            const lostLife = !clickedPiece.errorMarked;
            clickedPiece.errorMarked = true;
            animateBump(clickedPiece, () => {
                clickedPiece.state = 'IDLE';
                blockers.forEach(b => b.state = 'IDLE');
                draw();
                if (lostLife) {
                    lives--;
                    updateHearts();
                    if (lives <= 0 && overlay.classList.contains('hidden')) {
                        modalTitle.innerText = "Game Over";
                        modalBtn.innerText = "Try Again";
                        overlay.classList.remove('hidden');
                    }
                }
            });
        }
    }

    canvas.addEventListener('wheel', (e) => {
        if (!isGameRunning || !canUseZoomPan()) return;
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const centerX = e.clientX - rect.left;
        const centerY = e.clientY - rect.top;
        const delta = e.deltaY > 0 ? -0.08 : 0.08;
        applyZoomAt(centerX, centerY, zoomScale + delta);
    }, { passive: false });

    canvas.addEventListener('pointerdown', (e) => {
        if (!isGameRunning) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        
        try {
            if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
        } catch(err) {}

        if (e.pointerType === 'touch') {
            pinchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pinchPointers.size === 2) {
                const points = Array.from(pinchPointers.values());
                pinchStartDistance = getTouchDistance(points[0], points[1]);
                pinchStartZoom = zoomScale;
                dragPointerId = null;
                dragStart = null;
                isPanning = false;
                return;
            }
        }
        if (pinchPointers.size > 1) return;

        dragPointerId = e.pointerId;
        dragStart = { x: e.clientX, y: e.clientY, ox: offsetX, oy: offsetY };
        isPanning = false;
    });

    canvas.addEventListener('pointermove', (e) => {
        if (!isGameRunning) return;
        
        if (e.pointerType === 'touch' && pinchPointers.has(e.pointerId)) {
            e.preventDefault();
            pinchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pinchPointers.size === 2 && pinchStartDistance > 0) {
                const points = Array.from(pinchPointers.values());
                const newDist = getTouchDistance(points[0], points[1]);
                const rect = canvas.getBoundingClientRect();
                const centerX = (points[0].x + points[1].x) / 2 - rect.left;
                const centerY = (points[0].y + points[1].y) / 2 - rect.top;
                if (canUseZoomPan()) {
                    applyZoomAt(centerX, centerY, pinchStartZoom * (newDist / pinchStartDistance));
                }
            }
            return;
        }

        if (dragStart && dragPointerId === e.pointerId) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            // If moved more than 10 pixels, start panning
            if (!isPanning && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
                isPanning = true;
            }
            if (isPanning && canUseZoomPan()) {
                e.preventDefault();
                const next = clampPanOffset(dragStart.ox + dx, dragStart.oy + dy);
                offsetX = next.x;
                offsetY = next.y;
                updatePixelPaths();
                draw();
            }
            return;
        }

        // Hover effect for mouse
        if (e.pointerType === 'mouse') {
            const style = getHintStyle(window.currentDifficulty);
            if (style.mode !== 'hover') return;
            const rect = canvas.getBoundingClientRect();
            const next = findPieceAtPixel(e.clientX - rect.left, e.clientY - rect.top);
            if (next !== hintedPiece) {
                hintedPiece = next;
                draw();
            }
        }
    });

    canvas.addEventListener('pointerup', (e) => {
        if (e.pointerType === 'touch') {
            pinchPointers.delete(e.pointerId);
            if (pinchPointers.size < 2) pinchStartDistance = 0;
        }
        
        if (dragPointerId === e.pointerId) {
            const wasPanning = isPanning;
            const startPoint = dragStart;
            dragPointerId = null;
            dragStart = null;
            isPanning = false;

            if (!wasPanning && startPoint) {
                // Determine it was a tap, calculate piece!
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const clickedPiece = findPieceAtPixel(x, y);

                if (clickedPiece) {
                    triggerPieceEscape(clickedPiece);
                }
            }
        }
    });

    canvas.addEventListener('pointerleave', () => {
        if (hintedPiece) {
            hintedPiece = null;
            if (isGameRunning) draw();
        }
    });

    canvas.addEventListener('pointercancel', (e) => {
        if (e.pointerType === 'touch') {
            pinchPointers.delete(e.pointerId);
            if (pinchPointers.size < 2) pinchStartDistance = 0;
        }
        if (dragPointerId === e.pointerId) {
            dragPointerId = null;
            dragStart = null;
            isPanning = false;
        }
    });
