const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const htmlContent = fs.readFileSync(path.join(__dirname, 'capy_vocab.html'), 'utf8');

const dom = new JSDOM(htmlContent, {
  url: 'http://localhost:3000/capy_vocab.html',
  runScripts: 'dangerously',
  resources: 'usable'
});

const { window } = dom;
const { document } = window;

// Wait for scripts to initialize
setTimeout(() => {
  console.log('=== TESTING INTERACTION SIMULATION IN JSDOM ===\n');

  function checkView(name, id) {
    const el = document.getElementById(id);
    if (!el) {
      console.log(`❌ [FAIL] ${name} (#${id}): Element NOT FOUND in DOM!`);
      return false;
    }
    const isHidden = el.classList.contains('hidden');
    const childCount = el.children.length;
    console.log(`ℹ️ [CHECK] ${name} (#${id}): hidden=${isHidden}, childrenCount=${childCount}`);
    return !isHidden;
  }

  // 1. Initial State
  console.log('--- Initial State ---');
  checkView('Trang chủ', 'view-home');
  checkView('Thư viện', 'view-storage');
  checkView('Cửa hàng', 'view-petshop');
  checkView('Bạn bè', 'view-friends');
  checkView('Cài đặt', 'view-settings');

  // 2. Click Cửa Hàng Tab
  console.log('\n--- 1. Clicking Cửa hàng Tab ---');
  const petshopTab = document.querySelector('.nav-tab[data-view="petshop"]');
  if (petshopTab) {
    petshopTab.click();
    const visible = checkView('Cửa hàng', 'view-petshop');
    const itemsCount = document.getElementById('shopItemsContainer')?.children.length || 0;
    console.log(`   Result: view-petshop visible? ${visible}, shopItems count: ${itemsCount}`);
  } else {
    console.log('❌ Could not find .nav-tab[data-view="petshop"]');
  }

  // 3. Click Bạn Bè Tab
  console.log('\n--- 2. Clicking Bạn bè Tab ---');
  const friendsTab = document.querySelector('.nav-tab[data-view="friends"]');
  if (friendsTab) {
    friendsTab.click();
    const visible = checkView('Bạn bè', 'view-friends');
    console.log(`   Result: view-friends visible? ${visible}`);
  } else {
    console.log('❌ Could not find .nav-tab[data-view="friends"]');
  }

  // 4. Click Cài Đặt Header Button
  console.log('\n--- 3. Clicking Cài đặt Button ---');
  const settingsBtn = document.getElementById('btnSettingsHeader');
  if (settingsBtn) {
    settingsBtn.click();
    const visible = checkView('Cài đặt', 'view-settings');
    console.log(`   Result: view-settings visible? ${visible}`);
  } else {
    console.log('❌ Could not find #btnSettingsHeader');
  }

  // 5. Click Flashcard Button
  console.log('\n--- 4. Clicking Chơi Flashcard Ngay ---');
  const flashcardBtn = document.getElementById('btnPlayDailyReview');
  if (flashcardBtn) {
    flashcardBtn.click();
    const visible = checkView('Flashcard SRS Gameplay', 'view-srs-gameplay');
    console.log(`   Result: view-srs-gameplay visible? ${visible}`);
  } else {
    console.log('❌ Could not find #btnPlayDailyReview');
  }

  // 6. Select photo & Click View Vocab
  console.log('\n--- 5. Clicking View Vocab ---');
  const btnBatchExtract = document.getElementById('btnBatchExtract');
  if (btnBatchExtract) {
    btnBatchExtract.click();
    const visible = checkView('Giỏ từ vựng đã chọn', 'view-selected-vocab');
    console.log(`   Result: view-selected-vocab visible? ${visible}`);
  } else {
    console.log('❌ Could not find #btnBatchExtract');
  }

  console.log('\n=== TEST COMPLETED ===');
}, 500);
