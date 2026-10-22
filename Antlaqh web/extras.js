/* الأسر المنتجة (تمرير عمودي مثل انستغرام + أقسام + بحث) + حاسبة التسعير */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const norm = s => (s || "").toLocaleLowerCase("ar");
  const fmt = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "K" : String(n);
  const parseCount = v => { if (Array.isArray(v)) v = v[0]; if (v && typeof v === "object") v = Object.values(v)[0]; const n = Number(v); return Number.isFinite(n) ? Math.max(0, Math.round(n)) : null; };
  const HEART = '<svg class="ic-heart" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.4 5 6.6 5c2 0 3.5 1.1 5.4 3.2C13.9 6.1 15.4 5 17.4 5c3.2 0 5.1 3 3.9 6.3-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>';
  const SHARE = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13"/></svg>';
  const T = (k, fb) => (window.t ? window.t(k, fb) : fb || k);
  const isEn = () => document.documentElement.lang === "en";

  /* ---------- Families feed ---------- */
  const chips = $("#chips"), find = $("#famSearch"), count = $("#famCount"),
        layout = $(".fam-layout");

  if (layout && chips && typeof FAMILIES !== "undefined") {
    // نحذف القديم (الباجر والـQR) ونحط مكانه الفيد
    layout.className = "reel-wrap";
    layout.innerHTML = `<div class="reel" id="reel" aria-live="polite"></div>`;
    const reel = $("#reel");
    // نافذة عرض الصورة كاملة
    const box = document.createElement("div");
    box.className = "lightbox"; box.hidden = true;
    box.innerHTML = '<button type="button" class="lb-x" aria-label="Close">✕</button><img alt="">';
    document.body.append(box);
    const closeBox = () => { box.hidden = true; document.body.style.overflow = ""; };
    const openBox = (src, alt) => {
      const im = box.querySelector("img"); im.src = src; im.alt = alt || "";
      box.hidden = false; document.body.style.overflow = "hidden";
    };
    box.addEventListener("click", closeBox);
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeBox(); });

    const liked = new Set();
    const likeTotals = new Map();
    let visitorId;
    try {
      visitorId = localStorage.getItem("antlaqh:visitor-id");
      if (!visitorId || !/^[0-9a-f-]{36}$/i.test(visitorId)) {
        visitorId = crypto.randomUUID();
        localStorage.setItem("antlaqh:visitor-id",visitorId);
      }
    } catch { visitorId = null; }
    const likeKey = name => "antlaqh:liked:" + encodeURIComponent(name);
    const hasLiked = name => {
      try { return localStorage.getItem(likeKey(name)) === "1"; }
      catch { return liked.has(name); }
    };
    // Public reviews via Supabase REST API. Only a publishable/anon key belongs in config.
    const config = window.ANTLAQH_SUPABASE || {};
    const supabaseReady = /^https:\/\/[^/]+\.supabase\.co\/?$/.test(config.url || "") &&
      typeof config.anonKey === "string" && config.anonKey.length > 10;
    const reviewCache = new Map();
    const safeText = value => String(value).replace(/[&<>"']/g, char =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
    const api = (path, options = {}) => fetch(config.url.replace(/\/$/, "") + "/rest/v1/" + path, {
      ...options,
      headers: { apikey: config.anonKey, Authorization: "Bearer " + config.anonKey,
        "Content-Type": "application/json", ...options.headers }
    }).then(async response => {
      if (!response.ok) throw new Error("Supabase request failed: " + response.status);
      const body = await response.text(); return body ? JSON.parse(body) : null;
    });
    const limitKey = name => "antlaqh:review-count:v1:" + encodeURIComponent(name);
    const reviewCount = name => { try { return Math.max(0, Number(localStorage.getItem(limitKey(name))) || 0); } catch { return 3; } };
    const saveCount = (name,count) => { try { localStorage.setItem(limitKey(name),String(count)); return true; } catch { return false; } };
    const limitMsg = () => T("limit");
    const loadLikeTotals = async () => {
      if (!supabaseReady) return;
      try {
        const rows = await api("store_like_totals?select=business_name,like_count");
        for (const row of rows) likeTotals.set(row.business_name,Number(row.like_count)||0);
        document.querySelectorAll("#reel .post").forEach(post => {
          const count=post.querySelector(".like-count");
          if(count)count.textContent=fmt(likeTotals.get(post.dataset.name)||0);
        });
      } catch(error) { console.error("Unable to load like totals",error); }
    };
    const reviewItem = r => '<div class="review-item"><strong>' + safeText(r.customer_name) + '</strong> <span class="review-stars">' + "★".repeat(r.rating) + "☆".repeat(5-r.rating) + '</span><p>' + safeText(r.comment) + '</p></div>';
    const reviewsHTML = name => {
      const reviews = reviewCache.get(name) || [];
      if (!reviews.length) return '<section class="customer-reviews" aria-label="'+T("reviewsAria")+'"></section>';
      const first = reviewItem(reviews[0]);
      
      return '<section class="customer-reviews" aria-label="'+T("reviewsAria")+'"><div class="review-list">'+first+'</div>' +
        (reviews.length>1 ? '<button type="button" class="review-more-open">'+T("showMore")+' ('+(reviews.length-1)+') ⌄</button>' : '') + '</section>';
    };
    const popupHTML = name => {
      const form = supabaseReady ? `<form class="review-form">
        <label class="fld"><span>${T("yourName")}</span><input name="customer_name" type="text" required minlength="2" maxlength="60" autocomplete="name" placeholder="${T("namePh")}"></label>
        <fieldset class="rate"><legend>${T("yourRating")}</legend><div class="stars">${[5,4,3,2,1].map(n=>`<input type="radio" id="star${n}" name="rating" value="${n}" required><label for="star${n}" title="${n}" aria-label="${n}">★</label>`).join("")}</div></fieldset>
        <label class="fld"><span>${T("yourComment")}</span><textarea name="review" maxlength="500" rows="4" placeholder="${T("commentPh")}"></textarea></label>
        <button type="submit">${T("send")}</button><p class="review-status" role="status" aria-live="polite"></p></form>` : `<p class="review-note">${T("unavailable")}</p>`;
      return `<div class="review-dialog-backdrop"><section class="review-dialog" role="dialog" aria-modal="true" aria-label="${T("addComment")}"><header><div><h3>${T("addComment")}</h3><p>${safeText(name)}</p></div><button type="button" class="review-close" aria-label="${T("close")}">✕</button></header><div class="review-dialog-compose">${form}</div></section></div>`;
    };
    const allReviewsHTML = name => {
      const reviews = reviewCache.get(name) || [];
      return '<div class="review-dialog-backdrop"><section class="review-dialog" role="dialog" aria-modal="true" aria-label="'+T("reviewsOf")+' '+safeText(name)+'"><header><h3>'+T("reviewsOf")+' '+safeText(name)+'</h3><button type="button" class="review-close" aria-label="'+T("close")+'">✕</button></header><div class="review-dialog-list">'+reviews.map(reviewItem).join("")+'</div></section></div>';
    };
    const showAllReviews = name => {
      dismissReview();
      document.body.insertAdjacentHTML("beforeend",allReviewsHTML(name));
      document.body.classList.add("reviews-modal-open");
      document.querySelector(".review-close")?.focus();
    };
    const dismissReview = () => {
      const dialog = document.querySelector(".review-dialog-backdrop");
      if (dialog) dialog.remove();
      document.body.classList.remove("reviews-modal-open");
    };
    const showReview = name => {
      dismissReview();
      document.body.insertAdjacentHTML("beforeend",popupHTML(name));
      document.querySelector(".review-dialog").dataset.businessName=name;
      document.body.classList.add("reviews-modal-open");
      if (reviewCount(name)>=3) { const form=document.querySelector(".review-dialog .review-form"); if(form){form.querySelector('[type="submit"]').disabled=true;form.querySelector(".review-status").textContent=limitMsg();} }
      document.querySelector(".review-close")?.focus();
    };
    document.addEventListener("click",e=>{
      if (e.target.matches(".review-dialog-backdrop, .review-close")) dismissReview();
    });
    document.addEventListener("keydown",e=>{if(e.key==="Escape")dismissReview();});
    const refreshReviews = async () => {
      if (!supabaseReady) return;
      try {
        const records = await api("reviews?select=business_name,customer_name,rating,comment&approved=eq.true&order=created_at.desc&limit=500");
        reviewCache.clear();
        for (const review of records) {
          if (!reviewCache.has(review.business_name)) reviewCache.set(review.business_name, []);
          reviewCache.get(review.business_name).push(review);
        }
        document.querySelectorAll("#reel .post").forEach(post => {
          const section = post.querySelector(".customer-reviews");
          if (section && !section.querySelector(".review-form :focus")) section.outerHTML = reviewsHTML(post.dataset.name);
        });
      } catch (error) { console.error("Unable to load reviews", error); }
    };

    let cat = "all", term = "";

    const art = f => "data:image/svg+xml," + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${f.c1 || "#6B46B8"}"/><stop offset="1" stop-color="${f.c2 || "#C9A24B"}"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><text x="200" y="240" font-size="150" text-anchor="middle">${f.icon || "🛍️"}</text></svg>`);

    function renderChips() {
      const mk = (key, label, n) =>
        `<button type="button" class="chip" data-cat="${key}" aria-pressed="${cat === key}">${label} <small>${n}</small></button>`;
      chips.innerHTML = mk("all", T("chip.all"), FAMILIES.length) +
        Object.entries(CATEGORIES).map(([k, v]) =>
          mk(k, T("cat." + k, v), FAMILIES.filter(f => f.cat === k).length)).join("");
    }

    const isVid = p => /\.(mp4|mov|m4v|webm)(\?|#|$)/i.test(p);
    const chev = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
    const slideHTML = (src, f, i, fade) => {
      const cls = `slide${i === 0 ? " active" : ""}${isVid(src) ? " is-video" : ""}`;
      const hid = fade ? ` aria-hidden="${i !== 0}"` : "";
      return isVid(src)
        ? `<div class="${cls}"${hid}><video src="${src}#t=0.001" playsinline preload="metadata" ${fade ? "muted" + (i === 0 ? " autoplay" : "") : "controls"}></video></div>`
        : `<div class="${cls}"${hid} style="--bg:url('${src}')"><img src="${src}" alt="${T("productsOf")} ${f.name}" loading="lazy"></div>`;
    };
    const gallery = f => {
      const pics = [...(f.video ? [f.video] : []), ...(f.images && f.images.length ? f.images : [f.image])].filter(Boolean);
      if (!pics.length) return `<img class="post-img" src="${art(f)}" alt="${T("productsOf")} ${f.name}">`;
      const many = pics.length > 1, fade = many && f.name === "تصاميم بلومي";
      return `<div class="gallery${fade ? " fade-gallery" : ""}" data-current="0"><div class="slides">${pics.map((p, i) => slideHTML(p, f, i, fade)).join("")}</div>${many ? `<button type="button" class="g-btn prev" data-dir="prev" aria-label="${T("prev")}">${chev}</button><button type="button" class="g-btn next" data-dir="next" aria-label="${T("next")}">${chev}</button><span class="count">1 / ${pics.length}</span>` : ""}</div>`;
    };
    // frame ratio follows the first item; each item picks cover/contain so there are no big bars
    const fitMedia = scope => scope.querySelectorAll(".gallery").forEach(g => {
      const els = [...g.querySelectorAll(".slide > img, .slide > video")];
      const dim = el => [el.naturalWidth || el.videoWidth, el.naturalHeight || el.videoHeight];
      const apply = () => {
        const [w, h] = dim(els[0]); if (!w || !h) return;
        const fr = Math.min(1.78, Math.max(0.6, w / h));
        g.style.setProperty("--ratio", fr.toFixed(3));
        els.forEach(el => { const [ew, eh] = dim(el); if (ew && eh) el.dataset.fit = "contain"; });
      };
      els.forEach(el => { el.addEventListener(el.tagName === "VIDEO" ? "loadedmetadata" : "load", apply); });
      apply();
    });
    const showFade = (g, index) => {
      const items = [...g.querySelectorAll(".slides > .slide")];
      if (!items.length) return;
      const i = ((index % items.length) + items.length) % items.length;
      items.forEach((item, n) => {
        item.classList.toggle("active", n === i);
        item.setAttribute("aria-hidden", String(n !== i));
        const v = item.querySelector("video");
        if (v) { if (n !== i) { v.pause(); v.currentTime = 0; } else { v.currentTime = 0; v.play().catch(() => {}); } }
      });
      g.dataset.current = String(i);
      g.dataset.shownAt = String(Date.now());
      g.dataset.nextAt = String(Date.now() + 3000);
      g.querySelector(".count").textContent = `${i + 1} / ${items.length}`;
    };
    setInterval(() => {
      if (document.hidden || !box.hidden) return;
      reel.querySelectorAll(".fade-gallery").forEach(g => {
        if (Date.now() < Number(g.dataset.pauseUntil||0)) return;
        const act = g.querySelector(".slide.active"), v = act && act.querySelector("video");
        const next = () => showFade(g, Number(g.dataset.current||0)+1);
        if (v) {   // a video plays to its end before the slideshow moves on
          if (!g.dataset.shownAt) g.dataset.shownAt = String(Date.now());
          const waited = Date.now() - Number(g.dataset.shownAt);
          if (v.ended || (v.duration && v.currentTime >= v.duration - 0.15) || (v.paused && v.readyState >= 2 && waited > 6000) || waited > 120000) next();
          return;
        }
        if (!g.dataset.nextAt) { g.dataset.nextAt=String(Date.now()+3000); return; }
        if (Date.now() >= Number(g.dataset.nextAt)) next();
      });
    },250);
    reel.addEventListener("touchstart", e => {
      const g=e.target.closest(".fade-gallery");
      if(g) g.dataset.touchX=String(e.touches[0].clientX);
    },{passive:true});
    reel.addEventListener("touchend", e => {
      const g=e.target.closest(".fade-gallery");
      if(!g || !g.dataset.touchX) return;
      const dx=e.changedTouches[0].clientX-Number(g.dataset.touchX);
      delete g.dataset.touchX;
      if(Math.abs(dx)<40)return;
      showFade(g,Number(g.dataset.current||0)+(dx>0?1:-1));
      g.dataset.pauseUntil=String(Date.now()+9000);
    },{passive:true});

    const postHTML = f => {
      const on = hasLiked(f.name);
      const bloomy = f.name === "تصاميم بلومي", dispName = (isEn() && f.nameEn) || f.name, bTitle = isEn() && f.nameEn ? f.nameEn : "تصاميم بلومي | bloomy designs", desc = (isEn() && f.descEn) || f.desc;
      return `
      <article class="post" data-name="${f.name}">
        <header class="post-head">
          <div><b>${bloomy ? bTitle : dispName}</b><small>${f.handle || ""}</small></div>
          <span class="tag">${T("cat." + f.cat, CATEGORIES[f.cat] || "")}</span>
        </header>
        ${gallery(f)}
        <div class="post-actions">
          <button type="button" class="act like${on ? " on" : ""}" aria-pressed="${on}" aria-label="${T("like")}" title="${T("like")}">${HEART}<span class="like-count">${fmt(likeTotals.get(f.name) || 0)}</span></button>
          <button type="button" class="act share" aria-label="${T("share")}" title="${T("share")}">${SHARE}</button>
        </div>
        <div class="post-body">
          <p>${bloomy ? `<b>${bTitle}</b>` + desc.split("\n\n").map(part => `<span class="bloomy-paragraph">${part}</span>`).join("") : `<b>${dispName}</b> ${desc}`}</p>
          <div class="store-buttons"><a class="btn-link" href="${f.link}" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10M7 17L17 7"/></svg>${T("visit")}</a><button type="button" class="btn-link store-comment-btn review-open"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/></svg>${T("addComment")}</button></div>
        </div>
        ${reviewsHTML(f.name)}
      </article>`;
    };

    function filter() {
      const list = FAMILIES.filter(f =>
        (cat === "all" || f.cat === cat) &&
        norm([f.name, f.nameEn, f.handle, f.desc, f.descEn, CATEGORIES[f.cat], (f.tags || []).join(" ")].join(" ")).includes(norm(term)));
      count.textContent = term || cat !== "all" ? list.length + " " + T("results") : "";
      reel.innerHTML = list.length
        ? list.map(postHTML).join("")
        : `<p class="empty">${T("empty")}</p>`;
      fitMedia(reel);
      return list.length;
    }

    chips.addEventListener("click", e => {
      const b = e.target.closest(".chip"); if (!b) return;
      cat = b.dataset.cat; renderChips(); filter();
    });
    find.addEventListener("input", () => { term = find.value.trim(); filter(); });

    reel.addEventListener("click", async e => {
      const post = e.target.closest(".post"); if (!post) return;
      if (e.target.closest(".review-open")) { showReview(post.dataset.name); return; }
      if (e.target.closest(".review-more-open")) { showAllReviews(post.dataset.name); return; }
      const nav = e.target.closest(".g-btn");
      if (nav) {
        const fade=nav.closest(".fade-gallery");
        if(fade){
          showFade(fade,Number(fade.dataset.current||0)+(nav.dataset.dir==="next"?1:-1));
          fade.dataset.pauseUntil=String(Date.now()+9000);
          return;
        }
        const sl = nav.parentElement.querySelector(".slides");
        const d = getComputedStyle(sl).direction === "rtl" ? -1 : 1;
        sl.scrollBy({ left: (nav.dataset.dir === "next" ? 1 : -1) * d * sl.clientWidth, behavior: "smooth" });
        return;
      }
      const pic = e.target.closest(".post-img, .slide img");
      if (pic) { openBox(pic.src, pic.alt); return; }
      const f = FAMILIES.find(x => x.name === post.dataset.name); if (!f) return;
      const like = e.target.closest(".like"), share = e.target.closest(".share");
      if (like) {
        if (!supabaseReady || !visitorId || like.disabled) return;
        const previous = hasLiked(f.name), next = !previous, countEl = like.querySelector(".like-count");
        const before = likeTotals.get(f.name) || 0, guess = Math.max(0, before + (next ? 1 : -1));
        const paint = (on, n) => { like.classList.toggle("on", on); like.setAttribute("aria-pressed", String(on)); if (countEl) countEl.textContent = fmt(n); };
        paint(next, guess); like.classList.add("pop"); like.disabled = true;   // instant feedback
        try {
          const raw = await api("rpc/toggle_store_like", { method: "POST", body: JSON.stringify({ p_business_name: f.name, p_visitor_id: visitorId, p_like: next }) });
          const total = parseCount(raw) ?? guess;   // server value when it returns a number
          if (next) liked.add(f.name); else liked.delete(f.name);
          try { localStorage.setItem(likeKey(f.name), next ? "1" : "0"); } catch {}
          likeTotals.set(f.name, total); paint(next, total);
        } catch (error) {
          console.error("Unable to save like", error);
          paint(previous, before); like.classList.add("err"); setTimeout(() => like.classList.remove("err"), 600);
        } finally { like.disabled = false; setTimeout(() => like.classList.remove("pop"), 450); }
      }
      if (share) {
        if (navigator.share) navigator.share({ title: f.name, url: f.link }).catch(() => {});
        else navigator.clipboard?.writeText(f.link).then(() => {
          const old = share.innerHTML; share.textContent = "✓"; setTimeout(() => (share.innerHTML = old), 1500);
        });
      }
    });


    document.addEventListener("submit",async e=>{
      const form=e.target.closest(".review-dialog .review-form");
      if(!form || !supabaseReady)return;
      e.preventDefault();
      const name=document.querySelector(".review-dialog")?.dataset.businessName;
      const customerName=form.elements.customer_name.value.trim();
      const rating=Number(form.elements.rating.value);
      const comment=form.elements.review.value.trim();
      if(!name || customerName.length<2 || customerName.length>60 || !Number.isInteger(rating) || rating<1 || rating>5 || comment.length>500)return;
      const button=form.querySelector('[type="submit"]'),status=form.querySelector(".review-status");
      if(reviewCount(name)>=3){button.disabled=true;status.textContent=limitMsg();return;}
      button.disabled=true;status.textContent=T("sending");
      try{
        await api("reviews",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({business_name:name,customer_name:customerName,rating,comment})});
        const count=reviewCount(name)+1;
        const saved=saveCount(name,count);
        form.reset();status.textContent=saved?(count>=3?T("sent")+" "+limitMsg():T("sent")+" ("+T("remaining")+" "+(3-count)+")"):T("sentNoSave");
        if(count>=3||!saved)button.disabled=true;
        await refreshReviews();
      }catch(error){console.error(error);status.textContent=T("sendFail");}
      finally{if(reviewCount(name)<3)button.disabled=false;}
    });

    // عدّاد الصور 1 / 3
    reel.addEventListener("scroll", e => {
      const sl = e.target;
      if (!sl.classList || !sl.classList.contains("slides")) return;
      const k = Math.round(Math.abs(sl.scrollLeft) / sl.clientWidth);
      const c = sl.parentElement.querySelector(".count");
      if (c) c.textContent = (k + 1) + " / " + sl.children.length;
    }, true);

    // يستخدمها شريط البحث العلوي
    window.searchFamilies = t => {
      cat = "all"; term = t; find.value = t; renderChips();
      const n = filter();
      if (!n) { term = ""; find.value = ""; filter(); }
      return n;
    };

    window.addEventListener("langchange", () => {
      dismissReview(); renderChips(); filter();
      box.querySelector(".lb-x").setAttribute("aria-label", T("close"));
    });
    box.querySelector(".lb-x").setAttribute("aria-label", T("close"));

    renderChips(); filter(); refreshReviews(); loadLikeTotals();
  }

  /* ---------- Pricing calculator ---------- */
  const form = $("#priceForm");
  if (form) {
    const n = id => parseFloat($("#" + id).value) || 0;
    const r = x => (Math.round(x * 100) / 100).toLocaleString(isEn() ? "en-US" : "ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const calc = () => {
      const pieces = Math.max(n("pc"), 1);
      const total = n("mat") + n("pack") + n("oth") + n("hrs") * n("wage");
      const cost = total / pieces;
      const fee = Math.min(n("fee"), 90) / 100;
      const price = Math.ceil((cost * (1 + n("mar") / 100) / (1 - fee)) * 2) / 2;
      const profit = price * (1 - fee) - cost;
      $("#rTotal").textContent = r(total) + " " + T("msg.sar");
      $("#rCost").textContent = r(cost) + " " + T("msg.sar");
      $("#rPrice").textContent = r(price) + " " + T("msg.sar");
      $("#rProfit").textContent = r(profit) + " " + T("msg.sar");
      $("#rAll").textContent = r(profit * pieces) + " " + T("msg.sar");
    };
    form.addEventListener("input", calc);
    form.addEventListener("submit", e => e.preventDefault());
    calc();
    window.addEventListener("langchange", calc);
  }
})();
