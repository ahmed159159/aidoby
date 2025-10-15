async function askDobby() {
  const question = document.getElementById("question").value;
  const responseBox = document.getElementById("response");
  const placesBox = document.getElementById("places");

  // مسح النتائج القديمة
  responseBox.innerHTML = "⏳ جاري التفكير...";
  placesBox.innerHTML = "";

  // 🔍 الحصول على الموقع بدقة وانتظار النتيجة
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    console.log("📍 Location:", lat, lon);

    const res = await fetch("/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, lat, lon })
    });

    const data = await res.json();

    if (data.error) {
      responseBox.innerHTML = `❌ خطأ: ${data.error}`;
      return;
    }

    responseBox.innerHTML = `<p><b>دوبي:</b> ${data.dobby}</p>`;

    if (data.places && data.places.length > 0) {
      placesBox.innerHTML = data.places.map(p => `
        <div class="place">
          <h3>${p.name}</h3>
          <p>📍 ${p.address || "العنوان غير متوفر"}</p>
          <p>📏 ${p.distance || "?"} متر</p>
          <p>🏷️ ${p.categories || "?"}</p>
        </div>
      `).join("");
    } else {
      placesBox.innerHTML = "<p>🙁 لا توجد أماكن قريبة.</p>";
    }

  }, (err) => {
    responseBox.innerHTML = "⚠️ من فضلك اسمح بالوصول لموقعك.";
  });
}
