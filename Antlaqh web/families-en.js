/* =========================================================
   ✏️ English names & descriptions for the stores
   Edit only this file to change the English text.

   - The key (left side) must be the store's Arabic name EXACTLY
     as written in families-data.js (field: name).
   - name = English store name, desc = English description.
   - A store without an entry here keeps its Arabic text in English mode.
   - Line breaks inside the description are kept as written.
   ========================================================= */
const FAMILIES_EN = {
  "تصاميم بلومي": {
    name: "Bloomy Designs",
    desc: `More than just designs… a world of creativity and technology! ✨ From AI videos and animations, website design and development, interactive games and activities, augmented reality (AR) experiences and interactive stories (H5P), to professional presentations, graduation packages and complete senior packages (presentations, games, announcements, giveaways and files), we turn your ideas into eye-catching work! 💗

💌 Have a different idea? Whatever it is, share it with us and let us turn it into reality with a creative touch that sets you apart! ✨

Contact us now!`
  },

  "كوكيز سارونه": {
    name: "Saroona Cookies",
    desc: `All kinds of cookies`
  },

  "حلاويز": {
    name: "Halawiz",
    desc: `Welcome to my store “Halawiz” 🤎

  My store offers a delicious, varied selection of sweets, such as mini cookies, classic cookies, double chocolate cookies, cookie pudding, and cookie cakes in different shapes like hearts and circles, plus mango truffle dessert and Dolce cake. 🍪🍰✨`
  },

  "متجر صناعة الصابون والسكراب والكريمات": {
    name: "Soap, Scrub & Cream Making Store",
    desc: `Soap, scrub and moisturizing cream`
  },

  "جوجو كاندي": {
    name: "JoJo Candy",
    desc: `Luxury made with love, and a taste served fresh every day ✨🍰 We create the finest sweets from fresh, premium ingredients, to share the secrets of delight in every piece.`
  },

  "نورة | رسامة": {
    name: "Norah | Illustrator",
    desc: `Her work centres on her art, especially digital and printed illustration, such as wedding invitation cards and other occasions`
  },

  "متجر سعاد": {
    name: "Suad Store",
    desc: `The art of crochet, wax shaping and journal design`
  },

  "سايوري ارت🎨": {
    name: "Sayori Art 🎨",
    desc: `Handmade and hand-drawn bookmarks made just for you, with love 💗`
  }
};

/* Merge into FAMILIES (don't edit below) */
FAMILIES.forEach(f => {
  const e = FAMILIES_EN[f.name];
  if (e) { f.nameEn = e.name; f.descEn = e.desc; }
});
