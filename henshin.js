(function () {
  const multiplier = 10;
  let active = false;
  let applied = false;

  function log(msg, color = "aqua") {
    console.log(`%c[HENSHIN_CHARGE] ${msg}`, `color:${color}; font-weight:bold;`);
  }

  function patchAll(obj, visited = new WeakSet()) {
    if (visited.has(obj) || typeof obj !== "object" || obj === null) return;
    visited.add(obj);

    for (let key in obj) {
      try {
        const val = obj[key];
        if (
          typeof val === "object" &&
          val !== null &&
          val.hasOwnProperty("henshin_charge") &&
          typeof val.henshin_charge === "number"
        ) {
          if (!applied) {
            const oldValue = val.henshin_charge;
            val.henshin_charge = oldValue * multiplier;
            log(`✅ تم تعديل ${key}.henshin_charge: ${oldValue} → ${val.henshin_charge}`, "lime");
            applied = true;
          }
        }

        if (typeof val === "object" && val !== null) patchAll(val, visited);
      } catch (e) {}
    }
  }

  const interval = setInterval(() => {
    if (active && !applied) {
      patchAll(window);
    }
  }, 1000);

  // 🧩 واجهة مصغرة معدلة
  const panel = document.createElement("div");
  panel.style.cssText = `
    position:fixed; top:20px; left:20px; z-index:999999;
    background:#001122; color:white; padding:8px;
    border-radius:6px; box-shadow:0 0 6px #000;
    font-family:sans-serif; font-size:11px;
    width:170px;
  `;

  const header = document.createElement("div");
  header.textContent = "🥷 تحميل الهان";
  header.style.cssText = `
    font-weight:bold; background:#003366; padding:4px;
    cursor:move; text-align:center; border-radius:4px;
    margin-bottom:4px;
  `;
  panel.appendChild(header);

  const status = document.createElement("div");
  status.textContent = "❌ غير مفعل";
  status.style.cssText = "text-align:center; margin-bottom:4px; font-weight:bold;";
  panel.appendChild(status);

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "تشغيل / إيقاف";
  toggleBtn.style.cssText = `
    width:100%; padding:5px; font-size:11px; border:none;
    border-radius:4px; background:#007acc; color:white;
    cursor:pointer; font-weight:bold;
  `;
  toggleBtn.onclick = () => {
    active = !active;
    applied = false;
    if (active) {
      status.textContent = "✅ مفعل";
      status.style.color = "lime";
      log(`تم تفعيل تحميل الهان`);
    } else {
      status.textContent = "❌ غير مفعل";
      status.style.color = "red";
      log(`تم إيقاف تحميل الهان`);
    }
  };
  panel.appendChild(toggleBtn);

  const footer = document.createElement("div");
  footer.style.cssText = "text-align:right; margin-top:4px;";
  footer.innerHTML = `<button id="minBtn">🗕</button> <button id="closeBtn">❌</button>`;
  panel.appendChild(footer);
  document.body.appendChild(panel);

  // 🖱️ سحب
  let isDragging = false, offsetX = 0, offsetY = 0;
  header.onmousedown = e => {
    isDragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    document.onmousemove = e2 => {
      if (isDragging) {
        panel.style.left = `${e2.clientX - offsetX}px`;
        panel.style.top = `${e2.clientY - offsetY}px`;
      }
    };
    document.onmouseup = () => {
      isDragging = false;
      document.onmousemove = null;
    };
  };

  // 🔽 تصغير
  document.getElementById("minBtn").onclick = () => {
    const collapsed = toggleBtn.style.display !== "none";
    toggleBtn.style.display = collapsed ? "none" : "block";
    status.style.display = collapsed ? "none" : "block";
    footer.style.textAlign = collapsed ? "center" : "right";
  };

  // ❌ إغلاق
  document.getElementById("closeBtn").onclick = () => panel.remove();
})();
