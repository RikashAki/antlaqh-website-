/* EN / AR language switcher: direction, labels, localStorage persistence */
(function () {
  "use strict";
  const KEY = "antlaqh:lang";

  const D = {
    ar: {
      "brand.name": "انطلاقة", "brand.tag": "من أسرنا إلى ريادتنا",
      "nav.aria": "القائمة الرئيسية", "nav.home": "الرئيسية", "nav.families": "الأسر المنتجة",
      "nav.stories": "قصص الأسر المنتجة", "nav.contact": "تواصل معنا", "nav.apply": "التقديم",
      "search.label": "ابحث في البوابة", "search.ph": "ابحث في البوابة", "search.btn": "بحث",
      "theme.dark": "تفعيل الوضع الداكن", "theme.light": "تفعيل الوضع الفاتح",
      "lang.to": "Switch language to English",
      "hero.text": "تجمع الأسر الداعمة والطالبات لدعمهم وتوفير خدمات تعليمية متكاملة.",
      "role.students": "الطالبات", "role.teachers": "المعلمات", "role.families": "الأسر الداعمة",
      "banner.title": "تريدين فتح متجرك الخاص؟", "banner.sub": "تعلّمي الخطوات وسعّري منتجاتك بأداة جاهزة",
      "fam.ph": "ابحثي عن قسم أو متجر: ورد، حلويات، خياطة...", "fam.aria": "بحث في الأسر المنتجة",
      "chips.aria": "الأقسام", "chip.all": "الكل", "results": "نتيجة",
      "empty": "لم نعثر على أسرة مطابقة، جرّبي كلمة أخرى أو قسمًا آخر.",
      "visit": "زيارة المتجر", "addComment": "أضف تعليقًا", "like": "إعجاب", "likes": "عدد الإعجابات",
      "share": "مشاركة", "prev": "السابق", "next": "التالي", "close": "إغلاق",
      "productsOf": "منتجات", "reviewsOf": "تعليقات", "reviewsAria": "تقييمات العملاء",
      "yourName": "اسمك", "namePh": "اكتبي اسمك", "yourRating": "تقييمك", "yourComment": "تعليقك (اختياري)",
      "commentPh": "كيف كانت تجربتك مع المتجر؟", "send": "إرسال التقييم",
      "unavailable": "التقييمات غير متاحة مؤقتًا.", "showMore": "إظهار المزيد",
      "limit": "لقد وصلت إلى الحد الأقصى للتعليقات (3 تعليقات لهذا المتجر).",
      "sending": "جارٍ إرسال التقييم...", "sent": "تم إرسال تقييمك بنجاح ✓", "remaining": "المتبقي:",
      "sentNoSave": "تم إرسال تقييمك، لكن تعذّر حفظ عداد التعليقات.",
      "sendFail": "تعذّر تأكيد إرسال التقييم. تحققي من ظهوره قبل إعادة المحاولة.",
      "cat.projects": "مشاريع وتصاميم", "cat.sweets": "حلويات ومعجنات", "cat.flowers": "ورد وهدايا",
      "cat.sewing": "خياطة و صناعات يدوية", "cat.skincare": "منتجات العناية بالبشرة",
      "apply.title": "التقديم", "apply.lead": "عبّئي بيانات متجرك لتنضمي إلى الأسر المنتجة.",
      "apply.form": "تعبئة بيانات المتجر", "apply.storeAr": "اسم المتجر بالعربية",
      "apply.storeArPh": "مثال: متجر الورد", "apply.contact": "رابط الحساب / رقم التواصل",
      "apply.contactPh": "رابط إنستغرام أو رقم الواتساب", "apply.desc": "وصف قصير للمبيعات",
      "apply.descPh": "توصيف مختصر لما يقدمه مشروعك...",
      "apply.note": "<b>تنبيه:</b> عند إرسال البيانات سيفتح لك تطبيق البريد، يرجى إرفاق <b>3 إلى 5 صور</b> للمشروع قبل الضغط على زر الإرسال.",
      "apply.submit": "إرسال البيانات عبر البريد"
    },
    en: {
      "brand.name": "Antlaqh", "brand.tag": "From our families to entrepreneurship",
      "nav.aria": "Main menu", "nav.home": "Home", "nav.families": "Productive Families",
      "nav.stories": "Families' Stories", "nav.contact": "Contact Us", "nav.apply": "Apply",
      "search.label": "Search the portal", "search.ph": "Search the portal", "search.btn": "Search",
      "theme.dark": "Enable dark mode", "theme.light": "Enable light mode",
      "lang.to": "التبديل إلى العربية",
      "hero.text": "Bringing supporting families and students together, with complete educational services.",
      "role.students": "Students", "role.teachers": "Teachers", "role.families": "Supporting families",
      "banner.title": "Want to open your own store?", "banner.sub": "Learn the steps and price your products with a ready tool",
      "fam.ph": "Search a category or store: flowers, sweets, sewing...", "fam.aria": "Search productive families",
      "chips.aria": "Categories", "chip.all": "All", "results": "results",
      "empty": "No matching family found. Try another word or category.",
      "visit": "Visit Store", "addComment": "Add Comment", "like": "Like", "likes": "Likes count",
      "share": "Share", "prev": "Previous", "next": "Next", "close": "Close",
      "productsOf": "Products by", "reviewsOf": "Comments on", "reviewsAria": "Customer reviews",
      "yourName": "Your name", "namePh": "Enter your name", "yourRating": "Your rating", "yourComment": "Your comment (optional)",
      "commentPh": "How was your experience with the store?", "send": "Submit review",
      "unavailable": "Reviews are temporarily unavailable.", "showMore": "Show more",
      "limit": "You have reached the comment limit (3 comments per store).",
      "sending": "Sending your review...", "sent": "Your review was sent ✓", "remaining": "Remaining:",
      "sentNoSave": "Your review was sent, but the comment counter could not be saved.",
      "sendFail": "Could not confirm the review was sent. Check that it appears before trying again.",
      "cat.projects": "Projects & Designs", "cat.sweets": "Sweets & Pastries", "cat.flowers": "Flowers & Gifts",
      "cat.sewing": "Sewing & Handicrafts", "cat.skincare": "Skincare Products",
      "apply.title": "Apply", "apply.lead": "Fill in your store details to join the productive families.",
      "apply.form": "Store details", "apply.storeAr": "Store name in Arabic",
      "apply.storeArPh": "e.g. Flower Store (in Arabic)", "apply.contact": "Account link / contact number",
      "apply.contactPh": "Instagram link or WhatsApp number", "apply.desc": "Short sales description",
      "apply.descPh": "A short description of what your project offers...",
      "apply.note": "<b>Note:</b> submitting opens your mail app. Please attach <b>3 to 5 photos</b> of your project before sending.",
      "apply.submit": "Send details by email"
    }
  };

  /* Arabic text -> English. Keys are the page's Arabic text with whitespace collapsed. */
  const EN_TEXT = {
    "انطلاقة": "Antlaqh", "انتقل إلى المحتوى": "Skip to content", "الروابط": "Links",
    "قصص الأسر المنتجة": "Productive Families' Stories",
    "تعرّفي على أبرز القصص التي تتحدث عن الأسر المنتجة.": "Discover the most inspiring stories about productive families.",
    "1- قصة أم سارة - من المطبخ إلى متجر": "1- Umm Sarah's story: from a kitchen to a store",
    "كانت أم سارة تعدّ الكليجا والمعمول للضيوف فحسب، ثم أخذ جيرانها يطلبونهما منها. بدأت بمبلغ 200 ريال اشترت به الدقيق والسمن، وكانت تعمل في الليل بعد أن ينام أبناؤها. شاركت في بازار للأسر المنتجة في الرياض، فباعت كل ما لديها في يومه الأول. واليوم لها متجر على تطبيق مرسول مع خدمة توصيل، ويتجاوز دخلها الشهري 4000 ريال، وكل ذلك من بيتها.":
      "Umm Sarah used to make kleija and maamoul only for guests, until her neighbours started ordering them from her. She began with 200 riyals, buying flour and ghee, and worked at night after her children had gone to sleep. She joined a bazaar for productive families in Riyadh and sold out on the very first day. Today she has a store on the Mrsool app with delivery, earns more than 4,000 riyals a month, and does it all from her home.",
    "العبرة: لا تنتظري رأس مال كبيرًا، وابدئي بما في يدك.": "The lesson: don't wait for big capital. Start with what you have.",
    "2- عائلة أبي خالد - ورشة الخياطة": "2- Abu Khaled's family: the sewing workshop",
    "الأب متقاعد، والأم تخيط الثياب، والبنات يطرّزن. وكانوا يخيطون لأهلهم فقط. سجّلت الأم في برنامج الأسر المنتجة والتحقت بدورة في التغليف والتسعير. ثم اتفقوا على توزيع الأدوار: الأم تقصّ القماش، والابنة الكبرى تخيطه، والصغرى تصوّر المنتجات وتنشرها على إنستغرام. وهم الآن يتلقون طلبات لتفصيل أزياء موحّدة للمدارس والحضانات، وأصبح لهم دخل ثابت يغطي مصاريف البيت.":
      "The father is retired, the mother sews clothes, and the daughters embroider. They used to sew only for their own relatives. The mother registered in the productive families programme and joined a course on packaging and pricing. Then they divided the roles: the mother cuts the fabric, the eldest daughter sews it, and the youngest photographs the products and posts them on Instagram. They now receive orders to tailor uniforms for schools and nurseries, and have a steady income that covers the household expenses.",
    "العبرة: العمل العائلي يوزّع الجهد ويضاعف الربح.": "The lesson: working as a family shares the effort and multiplies the profit.",
    "3- قصة نورة - إعادة التدوير": "3- Noura's story: recycling",
    "نورة طالبة جامعية، بدأت تجمع علب الزجاج والخشب المهمل وتحوّلها إلى تحف وتوزيعات لحفلات الزفاف. تبلغ تكلفة القطعة 5 ريالات وتبيعها بـ 30 ريالًا. شاركت في مسابقة للحرف اليدوية وفازت بها، ودعمتها بلدية الرياض بركن مجاني في فعاليات يوم التأسيس. واليوم لها علامة تجارية باسمها.":
      "Noura is a university student who started collecting discarded glass jars and wood and turning them into decorative pieces and wedding favours. A piece costs her 5 riyals and she sells it for 30. She entered a handicrafts competition and won, and the Riyadh Municipality supported her with a free booth at the Founding Day events. Today she has a brand of her own.",
    "العبرة: الفكرة المختلفة هي التي تصنع التميّز، ولا يلزم أن تعملي في الطبخ.": "The lesson: a different idea is what creates distinction. You don't have to work in cooking.",
    "4- قصة مؤسس البيك - حلم لم يعش ليرى نجاحه": "4- The story of Al Baik's founder: a dream he did not live to see succeed",
    "في عام 1974، افتتح شكور أبو غزالة أول مطعم له في جدة، بعد أن استثمر مدخراته في حلمه. لكن البداية لم تكن سهلة؛ فالناس لم يكونوا معتادين على الدجاج المقلي الذي يقدمه، وكان يعود إلى البيت حزينًا لقلة الزبائن. وبعد سنوات من المحاولة، بدأ الناس يقبلون على المطعم، لكن المؤسس توفي عام 1976، قبل أن يرى النجاح الكبير الذي سيصل إليه مشروعه. الأكثر تأثيرًا أن ابنيه إحسان ورامي قررا مواصلة حلم أبيهما، رغم الديون والصعوبات، وعملا على تطوير المطعم حتى أصبح البيك من أشهر العلامات التجارية السعودية.":
      "In 1974, Shakour Abu Ghazalah opened his first restaurant in Jeddah, after investing his savings in his dream. The beginning was not easy: people were not used to the fried chicken he served, and he would go home sad because there were so few customers. After years of trying, people began to flock to the restaurant, but the founder passed away in 1976, before he could see the great success his project would reach. Most moving of all, his sons Ihsan and Rami decided to carry on their father's dream despite the debts and difficulties, and worked to develop the restaurant until Al Baik became one of the best-known Saudi brands.",
    "العبرة: التأسيس الحقيقي يحتاج إلى وقت وصبر، وما بدأ بحلم بسيط في مدينة جدة أصبح اليوم علامة فارقة وفخراً وطنياً.": "The lesson: building something real takes time and patience. What began as a simple dream in Jeddah is today a landmark and a source of national pride.",
    "المنشآت الداعمة للأسر المنتجة": "Organisations supporting productive families",
    "بنك التنمية الاجتماعية": "Social Development Bank",
    "وزارة الموارد البشرية والتنمية الاجتماعية": "Ministry of Human Resources and Social Development",
    "مركز جنى للتمويل الأصغر": "Jana Microfinance Center",
    "الهيئة العامة للمنشآت الصغيرة والمتوسطة": "Small and Medium Enterprises General Authority (Monsha'at)",
    "تواصل معنا": "Contact Us", "هل تحتاج إلى مساعدة بخصوص الموقع؟": "Need help with the website?", "هل تحتاج إلى مساعدة بخصوص الموقع": "Need help with the website?", "جيميل": "Gmail", "راسلنا عبر البريد": "Email us", "انستغرام": "Instagram",
    "تريدين فتح متجرك الخاص؟": "Want to open your own store?", "خطوات بسيطة من الفكرة إلى أول طلب.": "Simple steps from the idea to your first order.",
    "اختاري فكرتك": "Choose your idea",
    "ابدئي بشيء تتقنينه ويوجد عليه طلب حولك: حلويات، ورد، خياطة، تدوير... واسألي أهلك وجيرانك عمّا يحتاجون إليه.": "Start with something you do well and that people around you want: sweets, flowers, sewing, recycling... Ask your family and neighbours what they need.",
    "جرّبي بدفعة صغيرة": "Test with a small batch",
    "اصنعي كمية قليلة واطلبي رأي من تثقين برأيهم، وحسّني المنتج قبل أن توسّعي إنتاجك.": "Make a small quantity, ask people you trust for their opinion, and improve the product before you scale up.",
    "احسبي تكلفتك": "Work out your costs",
    "سجّلي كل ريال تنفقينه: المواد والتغليف ووقتك. فبدون ذلك لن تعرفي هل تربحين أم لا.": "Record every riyal you spend: materials, packaging and your time. Without it you won't know whether you are making a profit.",
    "التراخيص والدعم": "Licences and support",
    "اسألي الجهات الداعمة المذكورة في صفحة القصص (مثل بنك التنمية الاجتماعية) عن المتطلبات الحالية وطرق التمويل.": "Ask the supporting organisations listed on the Stories page (such as the Social Development Bank) about current requirements and funding options.",
    "صوّري وغلّفي": "Photograph and package",
    "صور واضحة بإضاءة طبيعية وتغليف مرتب يرفعان قيمة منتجك قبل أن يجرّبه الزبائن.": "Clear photos in natural light and neat packaging raise the value of your product before customers even try it.",
    "افتحي حسابك وابدئي البيع": "Open your account and start selling",
    "أنشئي حساب إنستغرام باسم المتجر، وأضيفي رقم التواصل، وشاركي في البازارات. ثم قدّمي من صفحة": "Create an Instagram account in your store's name, add a contact number, and take part in bazaars. Then apply from the",
    "التقديم": "Apply", "لتنضمّي إلى الأسر المنتجة.": "page to join the productive families.",
    "سعّري منتجاتك": "Price your products", "استخدمي الأداة بالأسفل: تحسب لك التكلفة وسعر البيع المناسب.": "Use the tool below: it calculates your cost and a suitable selling price.",
    "🧮 أداة التسعير": "🧮 Pricing tool", "أدخلي أرقام دفعة واحدة، وتتحدّث النتيجة تلقائيًا.": "Enter the numbers for one batch and the result updates automatically.",
    "تكلفة المواد (ريال)": "Cost of materials (SAR)", "التغليف (ريال)": "Packaging (SAR)",
    "مصاريف أخرى: غاز، كهرباء، توصيل (ريال)": "Other expenses: gas, electricity, delivery (SAR)",
    "ساعات العمل على الدفعة": "Working hours on the batch", "أجر ساعتك (ريال)": "Your hourly wage (SAR)",
    "عدد القطع في الدفعة": "Number of pieces in the batch", "نسبة الربح المطلوبة %": "Desired profit margin %",
    "عمولة المنصة % (إن وجدت)": "Platform fee % (if any)", "إجمالي التكلفة": "Total cost", "تكلفة القطعة": "Cost per piece",
    "سعر البيع المقترح": "Suggested selling price", "ربح القطعة": "Profit per piece", "ربح الدفعة كاملة": "Profit for the whole batch",
    "السعر مقرّب لأقرب نصف ريال. قارنيه بأسعار المتاجر المشابهة قبل أن تعتمديه.": "The price is rounded to the nearest half riyal. Compare it with similar stores before you settle on it.",
    "بوابة تدعم الأسر المنتجة": "A portal that supports productive families",
    "فريق العمل والإشراف": "Team and supervision", "إشراف المعلمة: جواهر آل فواز": "Supervised by teacher: Jawaher Al Fawaz",
    "قيادة وإدارة المشروع، وهندسة البرمجيات، واختبار الأنظمة وضمان جودتها: ملاذ الجعيدي": "Project leadership and management, software engineering, system testing and quality assurance: Malath Al-Juaidi",
    "الإشراف التقني وتطوير الأنظمة: لمار أبو طير": "Technical supervision and systems development: Lamar AbuTair",
    "المحتوى والدعم": "Content and support",
    "قصص الأسر المنتجة: ميمونة الضباعي , ايات الجبان": "Productive families' stories: Maimouna Al-Dababi, Ayat Al-Jaban",
    "جهات تدعم الأسر المنتجة: ألين الشعلان": "Organisations supporting productive families: Aleen Al-Shaalan",
    "التواصل الاجتماعي: بسمة سلعس": "Social media: Basma Salaas", "تصميم شعار الموقع: عنود عبدة": "Website logo design: Anoud Abdah",
    "انطلاقة — من أسرنا إلى ريادتنا · المدرسة الخامسة بعد المائة": "Antlaqh: From our families to entrepreneurship · The 105th School",
    "شعار انطلاقة": "Antlaqh logo", "تبديل الوضع الداكن": "Toggle dark mode", "الأسرة السابقة": "Previous family", "الأسرة التالية": "Next family",
    "الأسر المنتجة": "Productive Families", "رمز QR للحساب": "Account QR code",
    "مثال: 80": "e.g. 80", "مثال: 20": "e.g. 20", "مثال: 10": "e.g. 10", "مثال: 3": "e.g. 3"
  };
  const MSG_D = {
    ar: {
      welcome: "أهلًا بك، ", signedIn: "تم تسجيل الدخول بنجاح", signInError: "تعذّر تسجيل الدخول. حاول مرة أخرى.",
      redirect: "جارٍ فتح تسجيل الدخول بحساب جوجل...", gsiBlocked: "لم يظهر تسجيل الدخول. تحقق من إعدادات المتصفح وحاول مجددًا.",
      gsiLoadError: "تعذّر تحميل خدمة تسجيل الدخول من جوجل.", noResults: "لم يتم العثور على نتائج مطابقة.",
      emptySearch: "اكتب كلمة للبحث أولًا.", required: "يرجى تعبئة الحقول المطلوبة (*).",
      mailOpening: "جارٍ فتح تطبيق البريد... لا تنسَ إرفاق 3 إلى 5 صور.",
      foundFam: "تم العثور على {n} نتيجة في الأسر المنتجة", foundIn: "تم العثور على نتائج في: {p}", found: "تم العثور على نتائج", sar: "ريال"
    },
    en: {
      welcome: "Welcome, ", signedIn: "Signed in successfully", signInError: "Sign-in failed. Please try again.",
      redirect: "Opening Google sign-in...", gsiBlocked: "Sign-in did not appear. Check your browser settings and try again.",
      gsiLoadError: "Could not load Google sign-in.", noResults: "No matching results found.",
      emptySearch: "Type a word to search first.", required: "Please fill in the required fields (*).",
      mailOpening: "Opening your mail app... don't forget to attach 3 to 5 photos.",
      foundFam: "Found {n} result(s) in Productive Families", foundIn: "Found results in: {p}", found: "Found results", sar: "SAR"
    }
  };

  let lang = "ar";
  try { const s = localStorage.getItem(KEY); if (s === "en" || s === "ar") lang = s; } catch {}

  const t = (k, fb) => D[lang][k] ?? (k.startsWith("msg.") ? MSG_D[lang][k.slice(4)] : undefined) ?? fb ?? D.ar[k] ?? k;
  const norm = x => x.replace(/\s+/g, " ").trim();
  const SKIP = "script,style,textarea,#reel,.review-dialog-backdrop,.lightbox,[data-i18n],[data-i18n-html]";

  /* Translate every plain Arabic text node / attribute that has an entry in EN_TEXT */
  function translatePage() {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode());) {
      if (n.parentElement?.closest(SKIP)) continue;
      if (lang === "ar") { if (n.__ar !== undefined) n.nodeValue = n.__ar; continue; }
      const key = norm(n.nodeValue), en = EN_TEXT[key];
      if (!en) continue;
      if (n.__ar === undefined) n.__ar = n.nodeValue;
      const lead = n.__ar.match(/^\s*/)[0], trail = n.__ar.match(/\s*$/)[0];
      n.nodeValue = lead + en + trail;
    }
    document.querySelectorAll("[placeholder],[aria-label],[alt],[title]").forEach(el => {
      if (el.closest("#reel,.review-dialog-backdrop,.lightbox") || el.id === "theme" || el.id === "lang") return;
      for (const a of ["placeholder", "aria-label", "alt", "title"]) {
        if (!el.hasAttribute(a) || (a === "placeholder" && el.hasAttribute("data-i18n-ph")) || (a === "aria-label" && el.hasAttribute("data-i18n-aria"))) continue;
        el.__arA = el.__arA || {};
        if (el.__arA[a] === undefined) { if (!EN_TEXT[norm(el.getAttribute(a))]) continue; el.__arA[a] = el.getAttribute(a); }
        el.setAttribute(a, lang === "en" ? EN_TEXT[norm(el.__arA[a])] || el.__arA[a] : el.__arA[a]);
      }
    });
    // swap logo + favicon
    document.querySelectorAll("[data-logo-ar]").forEach(el => {
      const src = lang === "en" ? el.dataset.logoEn : el.dataset.logoAr;
      if (el.tagName === "LINK") el.href = src; else el.src = src;
    });
    document.title = lang === "en" ? "Antlaqh" : "انطلاقة";
  }
  const $$ = s => [...document.querySelectorAll(s)];

  function apply() {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "en" ? "ltr" : "rtl";

    $$("[data-i18n]").forEach(el => (el.textContent = t(el.dataset.i18n)));
    $$("[data-i18n-html]").forEach(el => (el.innerHTML = t(el.dataset.i18nHtml)));
    $$("[data-i18n-ph]").forEach(el => (el.placeholder = t(el.dataset.i18nPh)));
    $$("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));

    translatePage();

    const theme = document.getElementById("theme");
    if (theme) theme.setAttribute("aria-label", t(root.dataset.theme === "dark" ? "theme.light" : "theme.dark"));

    const btn = document.getElementById("lang");
    if (btn) {
      const target = lang === "ar" ? "en" : "ar";
      btn.textContent = target.toUpperCase();
      btn.lang = target;
      btn.setAttribute("aria-label", t("lang.to"));
      btn.title = t("lang.to");
    }
  }

  function setLang(next) {
    if (next !== "ar" && next !== "en") return;
    lang = next;
    try { localStorage.setItem(KEY, lang); } catch {}
    apply();
    window.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  window.t = t;
  window.getLang = () => lang;
  window.setLang = setLang;

  apply();
  document.getElementById("lang")?.addEventListener("click", () => setLang(lang === "ar" ? "en" : "ar"));
})();
